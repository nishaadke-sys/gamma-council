"use client"

import { useCallback, useRef, useState } from "react"
import { AGENTS, GAMMA_CONTEXT, getMode, type AgentId, type ModeId } from "@/lib/council"

export interface Turn {
  id: string
  agentId: AgentId | "facilitator" | "verdict"
  round: number
  content: string
  status: "thinking" | "done" | "error"
}

export interface RunArgs {
  topic: string
  mode: ModeId
  perspective: "founder" | "investor"
  rounds: number
  liveContext: string
}

interface ProxyMessage {
  role: "user" | "assistant"
  content: string
}

const AGENT_NAMES = AGENTS.reduce(
  (acc, a) => ({ ...acc, [a.id]: a.name }),
  {} as Record<string, string>,
)

function buildSystem(
  agentId: AgentId,
  mode: ModeId,
  perspective: "founder" | "investor",
  liveContext: string,
): string {
  const agent = AGENTS.find((a) => a.id === agentId)!
  const m = getMode(mode)

  const perspectivePrompt =
    perspective === "investor"
      ? `You are evaluating everything through an investor lens. For every claim or decision, ask: does this make Gamma more or less fundable? Does this preserve or erode investor trust and return potential? Flag anything that would concern a pre-seed or seed investor. Think about cap table health, milestone sequencing, and what a due diligence process would surface.`
      : `You are evaluating everything through a founder execution lens. Focus on what moves the needle, what reduces risk, what preserves optionality, and what is achievable with a small bootstrapped team.`

  const parts = [
    GAMMA_CONTEXT,
    "",
    agent.systemPrompt,
    "",
    perspectivePrompt,
    "",
    `Mode: ${m.name}. ${m.framing}`,
  ]

  if (liveContext.trim()) {
    parts.push("", `Current context from the operator:\n${liveContext.trim()}`)
  }

  const otherAgents = AGENTS.filter((a) => a.id !== agentId)
    .map((a) => a.name)
    .join(", ")

  parts.push(
    "",
    `You are in a live council chat room with: ${otherAgents}. Address them by name when responding to their points. Be direct and conversational -- this is a debate, not a report. Keep responses to 3-5 tight sentences. No long dashes. No bullet points unless absolutely necessary.`,
  )

  return parts.join("\n")
}

function buildTranscript(topic: string, turns: Turn[], upToIndex: number): string {
  const lines: string[] = [`Topic: ${topic}`, ""]
  const prior = turns.slice(0, upToIndex).filter((t) => t.status === "done" && t.agentId !== "verdict")

  if (prior.length === 0) {
    lines.push("You are first to speak. Open the debate with your perspective.")
  } else {
    lines.push("Chat so far:", "")
    for (const t of prior) {
      if (t.agentId === "facilitator") {
        lines.push(`[Facilitator]: ${t.content}`, "")
      } else {
        const name = AGENT_NAMES[t.agentId] ?? t.agentId
        const agent = AGENTS.find((a) => a.id === t.agentId)
        lines.push(`[${name} / ${agent?.llm ?? ""}]: ${t.content}`, "")
      }
    }
    lines.push("Now add your response. Engage with what has been said.")
  }
  return lines.join("\n")
}

function buildVerdictSystem(liveContext: string): string {
  return [
    GAMMA_CONTEXT,
    "",
    "You are the Council Verdict synthesizer. After a full council debate, you produce a clear final recommendation.",
    "",
    "Your output must have three parts:",
    "1. VERDICT: One sentence -- the direct answer to the question debated.",
    "2. KEY TENSIONS: 2-3 sentences on where the council disagreed and why it matters.",
    "3. RECOMMENDED ACTION: 2-3 concrete next steps the founder should take.",
    "",
    "Be decisive. Do not hedge. If the council was split, pick the stronger side and say why. No long dashes.",
    liveContext.trim() ? `\nContext: ${liveContext.trim()}` : "",
  ]
    .filter((x) => x !== undefined)
    .join("\n")
}

export function useDebate() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionCost, setSessionCost] = useState<Record<string, number>>({})
  const abortRef = useRef(false)

  const reset = useCallback(() => {
    abortRef.current = true
    setTurns([])
    setError(null)
    setRunning(false)
    setSessionCost({})
  }, [])

  const injectFacilitator = useCallback((message: string) => {
    const turn: Turn = {
      id: `facilitator-${Date.now()}`,
      agentId: "facilitator",
      round: 0,
      content: message,
      status: "done",
    }
    setTurns((prev) => [...prev, turn])
  }, [])

  const run = useCallback(async ({ topic, mode, perspective, rounds, liveContext }: RunArgs) => {
    abortRef.current = false
    setError(null)
    setRunning(true)

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

    const working = [...initial]
    const costTracker: Record<string, number> = {}

    for (let i = 0; i < working.length; i++) {
      if (abortRef.current) break
      const turn = working[i]
      const agent = AGENTS.find((a) => a.id === turn.agentId)!
      const system = buildSystem(turn.agentId, mode, perspective, liveContext)
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
            maxTokens: 600,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status}).`)

        const text = (data.text || "(no response)").replace(/--/g, "-").replace(/\u2014/g, "-")
        working[i] = { ...turn, content: text, status: "done" }

        const tokenEstimate = (system.length + userMessage.length + text.length) / 4
        const costPerToken: Record<string, number> = {
          anthropic: 0.000003,
          openai: 0.000005,
          gemini: 0.0000005,
          xai: 0.000003,
          deepseek: 0.0000009,
          perplexity: 0.000001,
        }
        costTracker[agent.provider] = (costTracker[agent.provider] ?? 0) + tokenEstimate * (costPerToken[agent.provider] ?? 0.000003)
        setSessionCost({ ...costTracker })
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong."
        working[i] = { ...turn, content: msg, status: "error" }
        setError(`${agent.name} (${agent.llm}): ${msg}`)
      }

      setTurns([...working])
    }

    if (!abortRef.current) {
      const verdictTurn: Turn = {
        id: `verdict-${Date.now()}`,
        agentId: "verdict",
        round: 0,
        content: "",
        status: "thinking",
      }
      setTurns((prev) => [...prev, verdictTurn])

      try {
        const transcript = working
          .filter((t) => t.status === "done")
          .map((t) => {
            const name = AGENT_NAMES[t.agentId as string] ?? t.agentId
            return `${name}: ${t.content}`
          })
          .join("\n\n")

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            provider: "anthropic",
            model: "claude-sonnet-4-5",
            system: buildVerdictSystem(liveContext),
            messages: [{ role: "user", content: `Topic: ${topic}\n\nDebate transcript:\n${transcript}\n\nDeliver the verdict.` }],
            maxTokens: 400,
          }),
        })
        const data = await res.json()
        const verdictText = (data.text || "").replace(/--/g, "-").replace(/\u2014/g, "-")
        setTurns((prev) =>
          prev.map((t) =>
            t.id === verdictTurn.id ? { ...t, content: verdictText, status: "done" } : t,
          ),
        )
      } catch {
        setTurns((prev) =>
          prev.map((t) =>
            t.id === verdictTurn.id ? { ...t, content: "Verdict generation failed.", status: "error" } : t,
          ),
        )
      }
    }

    setRunning(false)
  }, [])

  return { turns, running, error, run, reset, injectFacilitator, sessionCost }
}
HEREDOC