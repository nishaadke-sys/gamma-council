"use client"

import { useState } from "react"

const CHANNELS = [
  {
    id: "phase2",
    name: "Phase 2 participants",
    stage: "Pre-launch",
    cac: "$0",
    target: "20 of 30 convert",
    status: "active",
    priority: 1,
    how: "30 study participants complete 14 days of daily EEG sessions with their own cognitive data. Target 20 of 30 converting to paying subscribers on study completion. First revenue before App Store launch.",
    killMetric: "Less than 10 of 30 express willingness to pay during debrief interview.",
    owner: "Nisha + Mia",
    timeline: "August 2026",
  },
  {
    id: "clinical",
    name: "Clinical referrals via Mia",
    stage: "Pre-launch",
    cac: "$0",
    target: "300 subscribers Year 1",
    status: "active",
    priority: 2,
    how: "Warm referrals from brain health professionals through Mia's network at Brainstim Centers and Xiberlinc. High trust, high retention. These are practitioners who see cognitive performance issues daily.",
    killMetric: "Less than 5 referrals in first 60 days post-launch.",
    owner: "Mia Micevska",
    timeline: "October 2026 onwards",
  },
  {
    id: "community",
    name: "Lisbon community seeding",
    stage: "Launch",
    cac: "$15",
    target: "680 subscribers Year 1",
    status: "planned",
    priority: 3,
    how: "Three Lisbon gym partners: FitnessUp, MVMT, and Matchbox Gym. Three digital nomad Slack and WhatsApp communities. 500 direct outreach messages. Landing page: gammacog.com/study. Kill metric: if CAC exceeds $30 after 200 outreach attempts, pivot to paid Instagram ads.",
    killMetric: "CAC exceeds $30 after 200 outreach attempts.",
    owner: "Nisha",
    timeline: "September 2026 onwards",
  },
  {
    id: "oura",
    name: "Oura readiness gap hook",
    stage: "Launch",
    cac: "Organic",
    target: "Viral sharing",
    status: "planned",
    priority: 4,
    how: "Primary acquisition hook: converting Oura users by surfacing the 50% discordance rate. Leverage Oura overcalling stat to drive organic comparison-based sharing. Message: your Oura says you are ready. Your brain might not be.",
    killMetric: "Less than 2% share rate on discordance content.",
    owner: "Nisha",
    timeline: "October 2026 onwards",
  },
  {
    id: "muse",
    name: "Muse affiliate partnership",
    stage: "Launch",
    cac: "10% commission",
    target: "Muse user base",
    status: "planned",
    priority: 5,
    how: "Approved formal affiliate relationship with Ariel Garten (Muse 2 co-founder). Direct access to the only existing consumer audience with EEG hardware. 10% commission via choosemuse.com. Unfair advantage: no competitor has this distribution.",
    killMetric: "Less than 50 installs from Muse referral link in first 90 days.",
    owner: "Nisha + Ariel Garten",
    timeline: "October 2026 onwards",
  },
  {
    id: "paid",
    name: "Paid acquisition",
    stage: "Post pre-seed",
    cac: "$20",
    target: "3,000 new Year 2",
    status: "future",
    priority: 6,
    how: "Paid channels open post pre-seed only. Instagram and LinkedIn ads targeting Oura and Apple Watch users. CAC target $20 in Year 2. Do not open paid channels before pre-seed closes - burns runway without unit economics proof.",
    killMetric: "CAC exceeds $30 in first 30 days of paid spend.",
    owner: "Growth hire or agency",
    timeline: "Post pre-seed April 2027",
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-primary text-primary-foreground" },
  planned: { label: "Planned", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  future: { label: "Post pre-seed", color: "bg-muted text-muted-foreground" },
}

const ICP = [
  { label: "Primary", desc: "High performers, founders, executives already wearing Oura or Apple Watch. Already track health data. Already accept behavior change. Not price-sensitive. Data-hungry." },
  { label: "Secondary", desc: "Athletes and biohackers. Self-optimizers who have exhausted physical tracking and want the cognitive layer." },
  { label: "Channel to avoid", desc: "General consumer market. Too broad, too much education required, wrong CAC." },
]

export default function GTMPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [view, setView] = useState<"channels" | "icp" | "metrics">("channels")

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">GTM Strategy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Three levers to first revenue. Community first. Clinical referrals second. App Store third.</p>
      </header>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        {(["channels", "icp", "metrics"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize " + (view === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {v === "icp" ? "ICP" : v === "metrics" ? "Kill metrics" : "Channels"}
          </button>
        ))}
      </div>

      {view === "channels" && (
        <div className="space-y-3">
          {CHANNELS.map(ch => (
            <div key={ch.id} className={"rounded-xl border bg-card cursor-pointer transition-colors " + (expanded === ch.id ? "border-primary" : "border-border")} onClick={() => setExpanded(expanded === ch.id ? null : ch.id)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground/60">{ch.priority}</span>
                    <p className="text-sm font-medium text-foreground">{ch.name}</p>
                  </div>
                  <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_CONFIG[ch.status].color}>{STATUS_CONFIG[ch.status].label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{ch.stage} · CAC {ch.cac} · Target: {ch.target}</p>
              </div>
              {expanded === ch.id && (
                <div className="border-t border-border p-4 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{ch.how}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground mb-1">Owner</p>
                      <p className="text-xs text-foreground">{ch.owner}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground mb-1">Timeline</p>
                      <p className="text-xs text-foreground">{ch.timeline}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-xs leading-relaxed">
                    Kill metric: {ch.killMetric}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "icp" && (
        <div className="space-y-4">
          {ICP.map(i => (
            <div key={i.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium text-foreground mb-2">{i.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{i.desc}</p>
            </div>
          ))}
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-foreground mb-3">Positioning</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">Your wearable tracks your body. It cannot track your brain. Gamma closes that gap.</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Primary hook: Oura says you are ready. On 75% of days, your brain disagrees. Gamma is the early warning system your wearable cannot be.</p>
          </div>
        </div>
      )}

      {view === "metrics" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Kill metrics tell you when to stop a channel and pivot. Check these monthly.</p>
          {CHANNELS.map(ch => (
            <div key={ch.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-foreground mb-1">{ch.name}</p>
              <p className="text-[11px] text-muted-foreground mb-2">{ch.timeline}</p>
              <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-xs leading-relaxed">
                {ch.killMetric}
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium text-foreground mb-2">North star metric</p>
            <p className="text-xs text-muted-foreground leading-relaxed">1,000 paying subscribers by June 2027 at $9.99/month = $9,990 MRR. This is the pre-seed gate. Every channel decision should be evaluated against its contribution to this number.</p>
          </div>
        </div>
      )}
    </main>
  )
}
