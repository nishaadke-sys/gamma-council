"use client"

import { AGENTS } from "@/lib/council"

const COLORS: Record<string, string> = {
  analyst: "var(--analyst)",
  advocate: "var(--advocate)",
  strategist: "var(--strategist)",
  realist: "var(--realist)",
  contrarian: "var(--contrarian)",
}

export function CouncilRoster() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {AGENTS.map((a) => (
        <div
          key={a.id}
          className="rounded-lg border border-border bg-card p-3 shadow-sm"
          style={{ borderLeftWidth: 3, borderLeftColor: COLORS[a.color] }}
        >
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: COLORS[a.color] }}
              aria-hidden
            />
            <p className="text-sm font-semibold leading-none text-foreground">{a.name}</p>
          </div>
          <p className="mt-1.5 text-xs font-medium" style={{ color: COLORS[a.color] }}>
            {a.llm}
          </p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground text-pretty">{a.blurb}</p>
        </div>
      ))}
    </div>
  )
}
