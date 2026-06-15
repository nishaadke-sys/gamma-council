import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

let initialized = false
async function ensureTable() {
  if (initialized) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS debates (
      id SERIAL PRIMARY KEY,
      topic TEXT NOT NULL,
      verdict TEXT,
      mode TEXT,
      perspective TEXT,
      turns JSONB,
      cost_total REAL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  // Add cost_total to tables created before this column existed.
  await pool.query("ALTER TABLE debates ADD COLUMN IF NOT EXISTS cost_total REAL")
  initialized = true
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query(
      "SELECT id, topic, verdict, mode, perspective, turns, cost_total, created_at FROM debates ORDER BY created_at DESC LIMIT 100"
    )
    return NextResponse.json({ debates: result.rows })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const { topic, verdict, mode, perspective, turns, costTotal } = await req.json()
    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "topic required" }, { status: 400 })
    }
    const result = await pool.query(
      "INSERT INTO debates (topic, verdict, mode, perspective, turns, cost_total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at",
      [topic, verdict || null, mode || null, perspective || null, JSON.stringify(turns || []), typeof costTotal === "number" ? costTotal : null]
    )
    return NextResponse.json({ ok: true, debate: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable()
    const { id } = await req.json()
    await pool.query("DELETE FROM debates WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
