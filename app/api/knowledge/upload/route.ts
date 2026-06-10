import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest) {
  try {
    const { filename, content, section } = await req.json()

    const extractRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        system: `You are extracting structured knowledge from a document for a founder OS knowledge base.
Extract key information and organize it into these sections:
- product: What the product does, current state, tech stack
- validation: Research findings, data points, validated claims
- funding: Investment structure, investor details, terms
- strategy: Strategic decisions, positioning, competitive landscape
- questions: Open hypotheses, things to validate
- constraints: Limitations, timelines, resources

Return a JSON array of objects with this structure:
[{"section": "product", "title": "Brief title", "content": "Full extracted content", "source": "filename"}]

Extract everything relevant. Be comprehensive. Return ONLY valid JSON, no markdown.`,
        messages: [{ role: "user", content: `Document: ${filename}\n\n${content}` }],
      }),
    })

    const extractData = await extractRes.json()
    const rawText = extractData.content?.[0]?.text || "[]"
    const clean = rawText.replace(/```json|```/g, "").trim()
    const entries = JSON.parse(clean)

    for (const entry of entries) {
      await pool.query(
        "INSERT INTO knowledge_base (section, title, content, source, updated_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING",
        [entry.section, entry.title, entry.content, entry.source || filename]
      )
    }

    await pool.query(
      "INSERT INTO uploaded_files (filename, section, extracted_content, uploaded_at) VALUES ($1, $2, $3, NOW())",
      [filename, section || "general", rawText]
    )

    return NextResponse.json({ success: true, count: entries.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
