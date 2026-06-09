"use client"

import { useCallback, useRef, useState } from "react"
import { AGENTS, GAMMA_CONTEXT, getMode, type AgentId, type ModeId } from "@/lib/council"

export interface Turn {
  id: string
  agentId: AgentId
  round: number
  content: string
  status: "thinking" | "done" | "error"
}

interface RunArgs {
  topic: string
  mode: ModeId
  rounds: number
  liveContext: string
}

interface ProxyMessage {
  role: "user" | "assistant"
  content: string
}

/**
 * Builds the system prompt for one agent: silent Gamma context + the agent's
 * persona + the mode framing + the live, user-editable context.
 */
function buildSystem(agentId: AgentId, mode: ModeId, liveContext: string): string {
  const agent = AGENTS.find((a) => a.id === agentId)!
  const m = getMode(mode)
  const parts = [
    GAMMA_CONTEXT,
    "",
    agent.systemPrompt,
    "",
    `Mode: ${m.name}. ${m.framing}`,
  ]
  if (liveContext.trim()) {
    parts.push("", `Additional context provided by the operator:\n${liveContext.trim()}`)
  }
  parts.push(
    "",
    "Speak in your own voice. Keep your contribution focused to a few tight paragraphs at most. Engage directly with what other council members have said when relevant. Do not preface with your own name.",
  )
  return parts.join("\n")
}

/**
 * Renders the running debate transcript into a single user message so each
 * agent can see everything said before it responds.
 */
function buildTranscript(topic: string, turns: Turn[], upToIndex: number): string {
  const lines: string[] = [`The council's topic:\n${topic}`, ""]
  const prior = turns.slice(0, upToIndex).filter((t) => t.status === "done")
  if (prior.length === 0) {
    lines.push("You are the first to speak. Open the debate.")
  } else {
    lines.push("The debate so far:", "")
    for (const t of prior) {
      const a = AGENTS.find((x) => x.id === t.agentId)!
      lines.push(`[Round ${t.round}] ${a.name} (${a.llm}):`, t.content, "")
    }
    lines.push("Now add your contribution.")
  }
  return lines.join("\n")
}

export function useDebate() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef(false)

  const reset = useCallback(() => {
    abortRef.current = true
    setTurns([])
    setError(null)
    setRunning(false)
  }, [])

  const run = useCallback(async ({ topic, mode, rounds, liveContext }: RunArgs) => {
    abortRef.current = false
    setError(null)
    setRunning(true)

    // Pre-build the full speaking order: each round, every agent in order.
    const order: { agentId: AgentId; round: number }[] = []
    for (let r = 1; r <= rounds; r++) {
      for (const a of AGENTS) order.push({ agentId: a.id, round: r })
    }

    const initial: Turn[] = order.map((o, i) => ({
      id: `${o.round}-${o.agentId}-${i}`,
      agentId: o.agentId,
      round: o.round,
      content: "",
      status: "thinking",
    }))
    setTurns(initial)

    // Local working copy so each request sees finished prior turns.
    const working = [...initial]

    for (let i = 0; i < working.length; i++) {
      if (abortRef.current) break
      const turn = working[i]
      const agent = AGENTS.find((a) => a.id === turn.agentId)!
      const system = buildSystem(turn.agentId, mode, liveContext)
      const userMessage = buildTranscript(topic, working, i)
      const messages: ProxyMessage[] = [{ role: "user", content: userMessage }]

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            provider: agent.provider,
            model: agent.model,
            system,
            messages,
            maxTokens: 900,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status}).`)

        working[i] = { ...turn, content: data.text || "(no response)", status: "done" }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong."
        working[i] = { ...turn, content: msg, status: "error" }
        setError(`${agent.name} (${agent.llm}): ${msg}`)
      }

      // Push the updated working copy to state so the UI streams turn-by-turn.
      setTurns([...working])
    }

    setRunning(false)
  }, [])

  return { turns, running, error, run, reset }
}
