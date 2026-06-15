"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

interface DebateRow {
  id: number
  topic: string
  verdict: string | null
  mode: string | null
  perspective: string | null
  created_at: string
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export function DebateHistory() {
  const [debates, setDebates] = useState<DebateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/debates")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) setError(String(data.error))
        else setDebates(data.debates ?? [])
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading history…</p>
  }

  if (error) {
    return (
      <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">
        {error}
      </p>
    )
  }

  if (debates.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No debates saved yet. Convene the council to start building history.
      </p>
    )
  }

  return (
    <section className="space-y-3 pb-32">
      {debates.map((d) => {
        const open = openId === d.id
        return (
          <article key={d.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : d.id)}
              aria-expanded={open}
              className="flex w-full items-start justify-between gap-3 text-left"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{d.topic}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span>{formatDate(d.created_at)}</span>
                  {d.mode && <span>· {d.mode}</span>}
                  {d.perspective && <span>· {d.perspective}</span>}
                </p>
              </div>
              <ChevronDown
                className={`mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            {open && (
              <div className="mt-3 border-t border-border/50 pt-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Council Verdict
                </p>
                <div className="space-y-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {d.verdict || "No verdict recorded."}
                </div>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
