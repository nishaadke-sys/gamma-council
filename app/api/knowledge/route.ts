import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM knowledge_base ORDER BY section, updated_at DESC"
    )
    return NextResponse.json({ entries: result.rows })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { section, title, content, source } = await req.json()
    const result = await pool.query(
      "INSERT INTO knowledge_base (section, title, content, source, updated_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [section, title, content, source || null]
    )
    return NextResponse.json({ entry: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, content } = await req.json()
    const result = await pool.query(
      "UPDATE knowledge_base SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [content, id]
    )
    return NextResponse.json({ entry: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    await pool.query("DELETE FROM knowledge_base WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
