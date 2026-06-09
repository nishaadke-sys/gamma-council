export type AgentId = "analyst" | "advocate" | "strategist" | "realist" | "contrarian"
export type ModeId = "decision" | "market" | "strategy" | "stress-test"
export type Provider = "anthropic" | "openai" | "gemini" | "xai" | "deepseek"

export interface Agent {
  id: AgentId
  name: string
  llm: string
  provider: Provider
  model: string
  role: string
  blurb: string
  /** CSS color token name used for the left border + accents. */
  color: string
  systemPrompt: string
}

export interface Mode {
  id: ModeId
  name: string
  blurb: string
  framing: string
  /** Round count auto-selected when this mode is chosen. */
  recommendedRounds: number
  /** One-line reason the recommended round count fits this mode. */
  roundsRationale: string
}

export const AGENTS: Agent[] = [
  {
    id: "analyst",
    name: "Analyst",
    llm: "Claude Sonnet",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    role: "Evidence & numbers",
    blurb: "Grounds the debate in data, base rates, and what can actually be measured.",
    color: "analyst",
    systemPrompt:
      "You are the Analyst on the Gamma Council. You reason from data, base rates, unit economics, and measurable facts. Quantify wherever possible, surface key assumptions, and flag what is unknown. Be calm and precise, never rhetorical. When others make claims, ask what evidence supports them.",
  },
  {
    id: "advocate",
    name: "Devil's Advocate",
    llm: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
    role: "Risk & dissent",
    blurb: "Attacks the strongest version of every claim to expose hidden risk.",
    color: "advocate",
    systemPrompt:
      "You are the Devil's Advocate on the Gamma Council. Attack the strongest version of every proposal: expose hidden risks, failure modes, and second-order consequences others avoid. Be sharp and direct but intellectually honest. Steelman before you strike. You are not contrarian for its own sake. You stress-test until only durable ideas survive.",
  },
  {
    id: "strategist",
    name: "Strategist",
    llm: "Gemini",
    provider: "gemini",
    model: "gemini-1.5-pro",
    role: "Synthesis & action",
    blurb: "Weighs the tradeoffs into a clear, sequenced path to act on.",
    color: "strategist",
    systemPrompt:
      "You are the Strategist on the Gamma Council. Think in terms of leverage, sequencing, and tradeoffs. Integrate the Analyst's evidence and the Devil's Advocate's objections into a coherent recommendation with concrete next steps. Be decisive and pragmatic: name what to do first, what to defer, and what would change your mind.",
  },
  {
    id: "realist",
    name: "Realist",
    llm: "Grok",
    provider: "xai",
    model: "grok-3",
    role: "Ground truth",
    blurb: "Cuts through theory with how things actually play out in practice.",
    color: "realist",
    systemPrompt:
      "You are the Realist on the Gamma Council. Cut through theory and optimism with how things actually play out in practice: execution friction, human behavior, incentives, timelines that slip, and resources that run short. Be plain-spoken and concrete. Call out where the debate has drifted from reality.",
  },
  {
    id: "contrarian",
    name: "Contrarian",
    llm: "DeepSeek",
    provider: "deepseek",
    model: "deepseek-chat",
    role: "Inversion",
    blurb: "Argues the opposite of consensus to surface what everyone is missing.",
    color: "contrarian",
    systemPrompt:
      "You are the Contrarian on the Gamma Council. When the council drifts toward consensus, argue the opposite to surface what everyone is missing. Look for the non-obvious framing, the overlooked option, and the assumption nobody questioned. Be provocative but grounded. Your goal is to widen the option space, not to be needlessly difficult.",
  },
]

export const MODES: Mode[] = [
  {
    id: "decision",
    name: "Decision",
    blurb: "Should we do this, or not?",
    framing:
      "The council is convened to help reach a clear go / no-go decision. Weigh the option, surface the key risks and upside, and converge toward a recommendation.",
    recommendedRounds: 2,
    roundsRationale: "Decisions need a round of debate to surface real risks before converging.",
  },
  {
    id: "market",
    name: "Market Research",
    blurb: "Understand the landscape & demand.",
    framing:
      "The council is convened to analyze a market: demand, competition, segments, willingness to pay, and timing. Ground claims in plausible market dynamics and call out what must be validated.",
    recommendedRounds: 1,
    roundsRationale: "Market scans just need one pass to map the current landscape.",
  },
  {
    id: "strategy",
    name: "Strategy",
    blurb: "Find the highest-leverage path.",
    framing:
      "The council is convened to shape strategy: where to focus, what to sequence, and how to build durable advantage. Debate tradeoffs and converge on a high-leverage plan.",
    recommendedRounds: 2,
    roundsRationale: "Strategy needs a round of pushback before the plan is synthesized.",
  },
  {
    id: "stress-test",
    name: "Stress-Test Pitch",
    blurb: "Break it before investors do.",
    framing:
      "The council is convened to stress-test a pitch as a skeptical investor panel would. Probe the weakest assumptions, the market, and the team's blind spots before judging whether it holds up.",
    recommendedRounds: 3,
    roundsRationale: "A pitch needs maximum pressure across three rounds to find what breaks.",
  },
]

/**
 * Hardcoded background context about Gamma, silently prepended to every
 * agent's system prompt. The user never sees or edits this.
 */
export const GAMMA_CONTEXT = `Background on the organization you are advising (do not repeat this verbatim; use it to ground your reasoning):

Gamma is an early-stage company building AI-native tools for small, high-leverage teams. Its philosophy is that a handful of sharp operators armed with good tooling can outcompete much larger organizations. Gamma values speed of iteration, intellectual honesty, and decisions made from first principles rather than convention. It is capital-efficient and skeptical of growth-at-all-costs. When advising Gamma, assume a resourceful but small team, a preference for reversible bets, and a high tolerance for unconventional ideas that are rigorously argued.`

export function getAgent(id: AgentId): Agent {
  return AGENTS.find((a) => a.id === id) as Agent
}

export function getMode(id: ModeId): Mode {
  return MODES.find((m) => m.id === id) as Mode
}
