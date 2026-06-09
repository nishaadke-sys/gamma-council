"use client"

import { useEffect, useMemo, useState } from "react"
import { Play, RotateCcw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AGENTS, MODES, getMode, type ModeId } from "@/lib/council"
import { useDebate } from "@/hooks/use-debate"
import { CouncilRoster } from "@/components/council-roster"
import { AgentTurnCard } from "@/components/agent-turn-card"

const LIVE_CONTEXT_KEY = "gamma-council:live-context"

export default function Page() {
  const [topic, setTopic] = useState("")
  const [mode, setMode] = useState<ModeId>("decision")
  const [rounds, setRounds] = useState(getMode("decision").recommendedRounds)
  const [roundsTouched, setRoundsTouched] = useState(false)
  const [liveContext, setLiveContext] = useState("")
  const [contextOpen, setContextOpen] = useState(false)
  const { turns, running, error, run, reset } = useDebate()

  const activeMode = getMode(mode)

  // Switching mode auto-selects its recommended round count, unless the user
  // has manually overridden rounds for the current selection.
  function handleModeChange(next: ModeId) {
    setMode(next)
    if (!roundsTouched) {
      setRounds(getMode(next).recommendedRounds)
    }
  }

  function handleRoundsChange(r: number) {
    setRounds(r)
    setRoundsTouched(true)
  }

  // Load live context from localStorage on mount.
  useEffect(() => {
    const saved = localStorage.getItem(LIVE_CONTEXT_KEY)
    if (saved) setLiveContext(saved)
  }, [])

  // Persist live context as the user edits it.
  useEffect(() => {
    localStorage.setItem(LIVE_CONTEXT_KEY, liveContext)
  }, [liveContext])

  const grouped = useMemo(() => {
    const byRound = new Map<number, typeof turns>()
    for (const t of turns) {
      const arr = byRound.get(t.round) ?? []
      arr.push(t)
      byRound.set(t.round, arr)
    }
    return [...byRound.entries()].sort((a, b) => a[0] - b[0])
  }, [turns])

  const canRun = topic.trim().length > 0 && !running

  function handleRun() {
    if (!canRun) return
    run({ topic: topic.trim(), mode, rounds, liveContext })
  }

  const started = turns.length > 0

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-primary" aria-hidden />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Gamma Council</h1>
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
          Five AI minds, each on a different model. They debate your question across rounds. Every
          member reads the full debate before adding its voice.
        </p>
      </header>

      <section className="mb-6">
        <CouncilRoster />
      </section>

      <section className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <label htmlFor="topic" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          What should the council debate?
        </label>
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Should Gamma launch a paid tier before reaching 10k weekly active users?"
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Mode</p>
            <div className="grid grid-cols-2 gap-1.5">
              {MODES.map((m) => {
                const active = m.id === mode
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModeChange(m.id)}
                    aria-pressed={active}
                    className={`rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="block font-medium text-foreground">{m.name}</span>
                    <span className="block leading-snug">{m.blurb}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Rounds</p>
              {rounds === activeMode.recommendedRounds ? (
                <span className="text-[11px] font-medium text-primary">Recommended</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRoundsChange(activeMode.recommendedRounds)}
                  className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Reset to {activeMode.recommendedRounds}
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((r) => {
                const active = r === rounds
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoundsChange(r)}
                    aria-pressed={active}
                    className={`h-9 flex-1 rounded-lg border text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
              {activeMode.roundsRationale}
            </p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground/80">
              {rounds * AGENTS.length} responses · 5 agents × {rounds} round{rounds > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setContextOpen((v) => !v)}
            aria-expanded={contextOpen}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronDown
              className={`size-3.5 transition-transform ${contextOpen ? "rotate-180" : ""}`}
            />
            Live context {liveContext.trim() ? "(saved)" : "(optional)"}
          </button>
          {contextOpen && (
            <textarea
              value={liveContext}
              onChange={(e) => setLiveContext(e.target.value)}
              placeholder="Standing context shared with every agent. Saved automatically in this browser."
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={handleRun} disabled={!canRun} size="lg">
            <Play className="size-4" />
            {running ? "Council in session…" : started ? "Convene again" : "Convene the council"}
          </Button>
          {started && !running && (
            <Button variant="ghost" size="lg" onClick={reset}>
              <RotateCcw className="size-4" />
              Clear
            </Button>
          )}
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">
            {error}
          </p>
        )}
      </section>

      {started && (
        <section className="space-y-8 pb-12">
          {grouped.map(([round, roundTurns]) => (
            <div key={round}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Round {round}
                </h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">{getMode(mode).name}</span>
              </div>
              <div className="space-y-3">
                {roundTurns.map((t) => {
                  const agent = AGENTS.find((a) => a.id === t.agentId)!
                  return <AgentTurnCard key={t.id} agent={agent} turn={t} />
                })}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
