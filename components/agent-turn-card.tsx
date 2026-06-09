"use client"

import { useState } from "react"
import type { Agent } from "@/lib/council"
import type { Turn } from "@/hooks/use-debate"

const COLOR_VARS: Record<string, { border: string; dot: string; soft: string }> = {
  analyst: { border: "var(--analyst)", dot: "var(--analyst)", soft: "var(--analyst-soft)" },
  advocate: { border: "var(--advocate)", dot: "var(--advocate)", soft: "var(--advocate-soft)" },
  strategist: { border: "var(--strategist)", dot: "var(--strategist)", soft: "var(--strategist-soft)" },
  realist: { border: "var(--realist)", dot: "var(--realist)", soft: "var(--realist-soft)" },
  contrarian: { border: "var(--contrarian)", dot: "var(--contrarian)", soft: "var(--contrarian-soft)" },
  researcher: { border: "var(--analyst)", dot: "var(--analyst)", soft: "var(--analyst-soft)" },
}

{expanded && (
  <div className="space-y-2.5 pt-1 border-t border-border/50 mt-2">
    {turn.content.split(/\n\n+/).slice(1).map((para, i) => (

export function AgentTurnCard({ agent, turn }: { agent: Agent; turn: Turn }) {
  const c = COLOR_VARS[agent.color] ?? COLOR_VARS.analyst
  const [expanded, setExpanded] = useState(false)

  const summary = turn.status === "done" ? getSummary(turn.content) : null
  const hasMore = turn.status === "done" && turn.content.length > (summary?.length ?? 0) + 20

  return (
    <article
      className="rounded-lg border border-border bg-card shadow-sm"
      style={{ borderLeftWidth: 3, borderLeftColor: c.border }}
    >
      <header className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: c.dot }} aria-hidden />
          <h3 className="text-sm font-semibold leading-none text-foreground">{agent.name}</h3>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium leading-none"
            style={{ backgroundColor: c.soft, color: c.border }}
          >
            {agent.llm}
          </span>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {agent.role}
        </span>
      </header>

      <div className="px-4 pb-4">
        {turn.status === "thinking" ? (
          <ThinkingDots />
        ) : turn.status === "error" ? (
          <p className="text-sm leading-relaxed text-destructive">{turn.content}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{summary}</p>

            {hasMore && (
              <>
                {expanded && (
                  <div className="space-y-2.5 pt-1 border-t border-border/50 mt-2">
                    {turn.content.split(/\n\n+/).map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed text-foreground/80 text-pretty">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-[11px] font-medium mt-1"
                  style={{ color: c.border }}
                >
                  {expanded ? "↑ Collapse" : "↓ Read full reasoning"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  )
}
