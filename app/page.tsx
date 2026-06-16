"use client"

import { useEffect, useRef, useState } from "react"
import posthog from "posthog-js"
import { Play, RotateCcw, ChevronDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AGENTS, MODES, getMode, type ModeId } from "@/lib/council"
import { useDebate } from "@/hooks/use-debate"
import { CouncilRoster } from "@/components/council-roster"
import { AgentTurnCard } from "@/components/agent-turn-card"
import { DebateHistory } from "@/components/debate-history"

const LIVE_CONTEXT_KEY = "gamma-council:live-context"

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: "Claude",
  openai: "GPT-4o",
  gemini: "Gemini",
  xai: "Grok",
  deepseek: "DeepSeek",
  perplexity: "Perplexity",
}

export default function Page() {
  const [topic, setTopic] = useState("")
  const [mode, setMode] = useState<ModeId>("decision")
  const [perspective, setPerspective] = useState<"founder" | "investor">("founder")
  const [rounds, setRounds] = useState(getMode("decision").recommendedRounds)
  const [roundsTouched, setRoundsTouched] = useState(false)
  const [liveContext, setLiveContext] = useState("")
  const [contextOpen, setContextOpen] = useState(false)
  const [injection, setInjection] = useState("")
  const [tab, setTab] = useState<"council" | "history">("council")
  const bottomRef = useRef<HTMLDivElement>(null)
  const savedRef = useRef(false)
  const { turns, running, error, run, reset, injectFacilitator, sessionCost } = useDebate()

  const activeMode = getMode(mode)

  function handleModeChange(next: ModeId) {
    setMode(next)
    if (!roundsTouched) setRounds(getMode(next).recommendedRounds)
  }

  function handleRoundsChange(r: number) {
    setRounds(r)
    setRoundsTouched(true)
  }

  useEffect(() => {
    const saved = localStorage.getItem(LIVE_CONTEXT_KEY)
    if (saved) setLiveContext(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem(LIVE_CONTEXT_KEY, liveContext)
  }, [liveContext])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [turns])

  const canRun = topic.trim().length > 0 && !running
  const started = turns.length > 0

  function handleRun() {
    if (!canRun) return
    savedRef.current = false
    posthog.capture("council_convened", {
      mode,
      perspective,
      rounds,
      topic_length: topic.trim().length,
      has_live_context: liveContext.trim().length > 0,
    })
    run({ topic: topic.trim(), mode, perspective, rounds, liveContext })
  }

  // Persist each completed debate (topic + verdict + transcript) to Postgres so
  // it shows up under the History tab. Fires whenever the run is finished AND a
  // done verdict exists -- not on a fragile running->false transition edge,
  // which could miss the save if the verdict was still "thinking" at that exact
  // render. savedRef (reset in handleRun) makes it idempotent (saves once).
  useEffect(() => {
    if (running || savedRef.current) return
    const verdict = turns.find((t) => t.agentId === "verdict" && t.status === "done")
    if (!verdict || !topic.trim()) return
    savedRef.current = true
    fetch("/api/debates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-posthog-distinct-id": posthog.get_distinct_id(),
      },
      body: JSON.stringify({
        topic: topic.trim(),
        verdict: verdict.content,
        mode,
        perspective,
        turns: turns.map((t) => ({ agentId: t.agentId, round: t.round, content: t.content })),
        costTotal: totalCost,
      }),
    }).catch((e) => console.error("debate save failed", e))
  }, [running, turns, topic, mode, perspective])

  function handleInject() {
    if (!injection.trim()) return
    posthog.capture("council_injection_sent", {
      injection_length: injection.trim().length,
      mode,
      turns_count: turns.length,
    })
    injectFacilitator(injection.trim())
    setInjection("")
  }

  const totalCost = Object.values(sessionCost).reduce((a, b) => a + b, 0)

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">

      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden />
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Gamma Council</h1>
          </div>
          {totalCost > 0 && (
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap justify-end">
              {Object.entries(sessionCost).map(([provider, cost]) => (
                <span key={provider}>
                  {PROVIDER_LABELS[provider] ?? provider}: ${cost.toFixed(3)}
                </span>
              ))}
              <span className="font-medium text-foreground">Total: ${totalCost.toFixed(3)}</span>
            </div>
          )}
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
          Six AI minds, each on a different model. They debate your question and address each other directly.
        </p>

        <div className="mt-4 flex rounded-lg border border-border overflow-hidden w-fit">
          {(["council", "history"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              } ${t === "history" ? "border-l border-border" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {tab === "council" && (
        <>
      <section className="mb-6">
        <CouncilRoster />
      </section>

      <section className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">

        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Perspective:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setPerspective("founder")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                perspective === "founder"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Founder
            </button>
            <button
              type="button"
              onClick={() => setPerspective("investor")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-border ${
                perspective === "investor"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Investor
            </button>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {perspective === "founder"
              ? "Execution, prioritization, risk"
              : "Fundability, cap table, what kills the round"}
          </span>
        </div>

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
              {rounds * AGENTS.length} responses x {AGENTS.length} agents x {rounds} round{rounds > 1 ? "s" : ""}
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
              placeholder="Standing context shared with every agent. Saved automatically."
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={handleRun} disabled={!canRun} size="lg">
            <Play className="size-4" />
            {running ? "Council in session..." : started ? "Convene again" : "Convene the council"}
          </Button>
          {started && !running && (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                posthog.capture("council_cleared", {
                  mode,
                  perspective,
                  turns_count: turns.length,
                  session_cost: totalCost,
                })
                reset()
                setTopic("")
              }}
            >
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
        <section className="space-y-3 pb-32">
          {turns.map((t) => {
            const agent = AGENTS.find((a) => a.id === t.agentId)

            if (t.agentId === "facilitator") {
              return (
                <div key={t.id} className="flex justify-center">
                  <div className="max-w-md rounded-full border border-border bg-muted px-4 py-2 text-xs text-muted-foreground text-center">
                    <span className="font-medium text-foreground">You: </span>
                    {t.content}
                  </div>
                </div>
              )
            }

            if (t.agentId === "verdict") {
              return (
                <div key={t.id} className="mt-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Council Verdict
                    </span>
                  </div>
                  {t.status === "thinking" ? (
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="size-1.5 animate-pulse rounded-full bg-primary/50"
                          style={{ animationDelay: `${i * 0.18}s` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {t.content}
                    </div>
                  )}
                </div>
              )
            }

            if (!agent) return null
            return <AgentTurnCard key={t.id} agent={agent} turn={t} />
          })}
          <div ref={bottomRef} />
        </section>
      )}

      {started && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-5">
          <div className="flex gap-2 rounded-xl border border-border bg-card p-2 shadow-lg">
            <input
              type="text"
              value={injection}
              onChange={(e) => setInjection(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInject()}
              placeholder="Inject a question or redirect the debate..."
              className="flex-1 rounded-lg bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            <Button size="sm" onClick={handleInject} disabled={!injection.trim()} className="shrink-0">
              <Send className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
        </>
      )}

      {tab === "history" && <DebateHistory />}
    </main>
  )
}
