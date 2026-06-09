export type AgentId = "analyst" | "advocate" | "strategist" | "realist" | "contrarian" | "researcher"
export type ModeId = "decision" | "market" | "strategy" | "stress-test" | "pitch-grilling"
export type Provider = "anthropic" | "openai" | "gemini" | "xai" | "deepseek" | "perplexity"

export interface Agent {
  id: AgentId
  name: string
  llm: string
  provider: Provider
  model: string
  role: string
  blurb: string
  color: string
  systemPrompt: string
}

export interface Mode {
  id: ModeId
  name: string
  blurb: string
  framing: string
  recommendedRounds: number
  roundsRationale: string
}

export const AGENTS: Agent[] = [
  {
    id: "researcher",
    name: "Researcher",
    llm: "Perplexity",
    provider: "perplexity",
    model: "sonar-pro",
    role: "Live web research",
    blurb: "Searches the live web to ground the debate in current verified facts.",
    color: "researcher",
    systemPrompt:
      "You are the Researcher on the Gamma Council. You go first. Search the web for current, verified facts relevant to the question. Surface real data points, recent developments, and cite what you find. The other agents will build their arguments on your findings. Be factual, concise, and specific. No long dashes.",
  },
  {
    id: "analyst",
    name: "Analyst",
    llm: "Claude Sonnet",
    provider: "anthropic",
    model: "claude-sonnet-4-5",
    role: "Evidence and numbers",
    blurb: "Grounds the debate in data, base rates, and what can actually be measured.",
    color: "analyst",
    systemPrompt:
      "You are the Analyst on the Gamma Council. You reason from data, base rates, unit economics, and measurable facts. Quantify wherever possible, surface key assumptions, and flag what is unknown. Be calm and precise, never rhetorical. When others make claims, ask what evidence supports them. No long dashes.",
  },
  {
    id: "advocate",
    name: "Devil's Advocate",
    llm: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
    role: "Risk and dissent",
    blurb: "Attacks the strongest version of every claim to expose hidden risk.",
    color: "advocate",
    systemPrompt:
      "You are the Devil's Advocate on the Gamma Council. Attack the strongest version of every proposal: expose hidden risks, failure modes, and second-order consequences others avoid. Be sharp and direct but intellectually honest. Steelman before you strike. No long dashes.",
  },
  {
    id: "strategist",
    name: "Strategist",
    llm: "Gemini",
    provider: "gemini",
    model: "gemini-2.5-flash",
    role: "Synthesis and action",
    blurb: "Weighs the tradeoffs into a clear, sequenced path to act on.",
    color: "strategist",
    systemPrompt:
      "You are the Strategist on the Gamma Council. Think in terms of leverage, sequencing, and tradeoffs. Integrate the evidence and objections into a coherent recommendation with concrete next steps. Be decisive and pragmatic. No long dashes.",
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
      "You are the Realist on the Gamma Council. Cut through theory and optimism with how things actually play out in practice: execution friction, human behavior, incentives, timelines that slip, resources that run short. Be plain-spoken and concrete. No long dashes.",
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
      "You are the Contrarian on the Gamma Council. When the council drifts toward consensus, argue the opposite to surface what everyone is missing. Look for the non-obvious framing, the overlooked option, the assumption nobody questioned. Be provocative but grounded. No long dashes.",
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
    blurb: "Understand the landscape and demand.",
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
  {
    id: "pitch-grilling",
    name: "Pitch Grilling",
    blurb: "The council grills you directly.",
    framing:
      "The council plays a live investor panel. Each member fires one sharp direct question at the founder per turn. They build on each other's questions and probe for weakness. This is a directed interrogation of the founder's pitch, assumptions, and readiness. Be skeptical, specific, and relentless.",
    recommendedRounds: 2,
    roundsRationale: "Two rounds of grilling surfaces both obvious and non-obvious weaknesses.",
  },
]

export const GAMMA_CONTEXT = `Background on the company being advised (use this to ground your reasoning but do not repeat it verbatim):

Gamma is a neurotech software platform that delivers a Cognitive Capacity Score (CCS, 0-100) to founders and executives. Built by LifeInk Neuro LLC (Delaware) and Gamma Cog OUE (Estonia). Sole founder and CEO: Nisha, based in Lisbon, Portugal on a D7 visa.

Product: Software intelligence layer, not hardware. Uses Apple Watch and Oura Ring data in production; EEG (Muse 2 headbands) used in validation studies only. 10-minute sessions. Two pricing tiers: $9.99/month consumer, $29.99/month executive. Year 1 target: 1,000 subscribers at $20,000 MRR. Year 3: $10M ARR.

Positioning: "Your wearable says you're ready. Your brain might not be." Human authentication layer for AI-assisted decisions. The algorithm is the product - device agnostic.

Validated data: 81 scored sessions, 369,891 EEG samples, 3 subjects. 223ms faster Stroop reaction time at high CCS vs low CCS. Oura disagrees with EEG on 50% of days, always overcalling readiness. M1 model confirmed same-day wearable aggregates cannot predict CCS - 24h ambient data hypothesis is the Phase 2 priority.

Stage: Pre-revenue. Phase 2 research study launching June 2026 - 30 participants across 2 cohorts of 15, 3 sessions daily for 2 weeks. Cohort 1 June 21, Cohort 2 July 12. 15 Muse 2 devices acquired.

Funding: Friends and Family round - $150K target, $3M valuation cap, convertible note, August 1 close under LifeInk Neuro LLC. Investor pipeline: 7 investors totaling $150K committed. No technical co-founder yet.

Competition: Neurable, Connectome Health, Atlas - all require proprietary hardware. Gamma is the only hardware-free cognitive scoring solution.`

export function getAgent(id: AgentId): Agent {
  return AGENTS.find((a) => a.id === id) as Agent
}

export function getMode(id: ModeId): Mode {
  return MODES.find((m) => m.id === id) as Mode
}
