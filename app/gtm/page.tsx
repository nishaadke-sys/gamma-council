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
  const [view, setView] = useState<"channels" | "icp" | "metrics" | "journey">("channels")

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">GTM Strategy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Three levers to first revenue. Community first. Clinical referrals second. App Store third.</p>
      </header>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        {(["channels", "icp", "metrics", "journey"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize " + (view === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {v === "icp" ? "ICP" : v === "metrics" ? "Kill metrics" : v === "journey" ? "User journey" : "Channels"}
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

          <div className="rounded-xl border border-border bg-card p-4 mt-2">
            <p className="text-xs font-medium text-foreground mb-1">What success actually looks like</p>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">Many startups track dozens of metrics but few clearly indicate if the business is creating value. Revenue is the destination. These metrics tell you if you are headed there.</p>
            <div className="space-y-2">
              {[
                { stage: "Activation", metric: "User delivers first complete EEG session and receives CCS score", target: "80% of signups complete session 1" },
                { stage: "Product reliability", metric: "Signal quality above 50% and session completion without error", target: "90% of sessions complete without BLE dropout" },
                { stage: "Feature adoption", metric: "User reaches milestone unlocks at sessions 5, 14, and 30", target: "40% of activated users reach session 14" },
                { stage: "Retention", metric: "Monthly active users and day-30 retention rate", target: "60% day-30 retention. Industry benchmark for health apps is 30%" },
                { stage: "Revenue", metric: "$9.99/month paying subscribers after 21-day trial", target: "1,000 subscribers by June 2027 = $9,990 MRR" },
              ].map(({ stage, metric, target }) => (
                <div key={stage} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-[11px] font-medium text-primary shrink-0 min-w-[120px] mt-0.5">{stage}</span>
                  <div>
                    <p className="text-xs text-foreground leading-relaxed">{metric}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Target: {target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "journey" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">The 5-stage user journey for Gamma. Growth happens when you identify friction faster than users leave.</p>

          {[
            {
              stage: "1. Discover",
              sub: "They find you",
              color: "border-primary/30 bg-primary/5",
              label_color: "text-primary",
              how: "Oura discordance hook on social - 75% disagreement stat drives organic sharing. Muse affiliate program via Ariel Garten. Clinical referrals through Mia's network at Brainstim and Xiberlinc. Phase 2 participants as first word-of-mouth.",
              friction: null,
            },
            {
              stage: "2. Try",
              sub: "They give it a chance",
              color: "border-border bg-card",
              label_color: "text-foreground",
              how: "21-day free trial. Frictionless onboarding: connect existing wearable, run first 6-minute EEG session, get first CCS score. Phase 2 participants already primed - they have 14 days of their own data.",
              friction: "They don't see the value: if the first score feels random or unexplained, they drop off. Fix: milestone-unlocked insight at session 1 that explains what their score means and what affects it.",
            },
            {
              stage: "3. Use",
              sub: "They get value",
              color: "border-border bg-card",
              label_color: "text-foreground",
              how: "Daily CCS check before high-stakes work. Milestone-unlocked insights: first unlock at session 5, full set at session 14. The score starts correlating with how the day actually feels - that is the moment of value.",
              friction: "The value isn't enough: score feels generic, not personalized. Fix: longitudinal patterns unlock at session 30 - brain peaks at 6pm, 10.8 points above weekly average. The longer they use it the sharper it gets.",
            },
            {
              stage: "4. Return",
              sub: "They come back",
              color: "border-border bg-card",
              label_color: "text-foreground",
              how: "Data lock-in: accuracy improves with every session. Users who reach session 30 have a personalized model - they cannot get that elsewhere. Daily habit formed around checking CCS before calendar decisions.",
              friction: "They don't come back: habit not formed, score check feels optional. Fix: morning push notification showing yesterday's CCS vs today's. Make the delta visible daily.",
            },
            {
              stage: "5. Recommend",
              sub: "They tell others",
              color: "border-green-200/50 bg-green-50/50 dark:bg-green-950/20",
              label_color: "text-green-700 dark:text-green-400",
              how: "High CCS day screenshots shared organically. Discordance moments - Oura says ready, Gamma says not - are naturally shareable. Phase 2 participants referring colleagues before App Store launch.",
              friction: null,
            },
          ].map(({ stage, sub, color, label_color, how, friction }) => (
            <div key={stage} className={"rounded-xl border p-5 " + color}>
              <p className={"text-xs font-medium mb-0.5 " + label_color}>{stage}</p>
              <p className="text-[11px] text-muted-foreground mb-3">{sub}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{how}</p>
              {friction && (
                <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-xs leading-relaxed">
                  {friction}
                </div>
              )}
            </div>
          ))}

          <div className="rounded-xl border border-border bg-card p-4 mt-2">
            <p className="text-xs font-medium text-foreground mb-1">Key insight from PostHog</p>
            <p className="text-xs text-muted-foreground leading-relaxed italic">Growth happens when you identify friction faster than users leave.</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">For Gamma: the two friction points are Try-to-Use (score feels random) and Use-to-Return (habit not formed). Both are solved by the milestone-unlocked insight system - sessions 1, 5, 14, 30, 90.</p>
          </div>
        </div>
      )}

    </main>
  )
}
