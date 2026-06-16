"use client"

import { useState } from "react"

const RISKS = [
  {
    id: "r1",
    category: "Fundraising",
    title: "F&F round does not close by August 1",
    probability: "medium",
    impact: "critical",
    description: "Only $10K confirmed. $140K gap with 6.5 weeks to close. Investors not yet approached or still in early conversations.",
    mitigations: [
      "Start all investor conversations this week - no more delays",
      "Send Saurabh financials today and ask if he can go above $10K",
      "Start FEMA compliance for both India uncles immediately - 2-4 weeks minimum",
      "Have backup investor Anisha Rachit ready to activate if someone drops out",
    ],
    owner: "Nisha",
    status: "open",
  },
  {
    id: "r2",
    category: "Legal",
    title: "India uncle wire blocked by FEMA/LRS compliance",
    probability: "high",
    impact: "high",
    description: "Both India uncles total $50K. FEMA compliance takes 2-4 weeks minimum. If started late, wires cannot land before August 1.",
    mitigations: [
      "Have uncles contact their AD bank this week with specific question about LRS eligibility",
      "Start compliance process before having the investment conversation",
      "Backup: route through US-based relative who invests directly with side letter",
      "Mark Underwood is handling India compliance path in Schedule A",
    ],
    owner: "Nisha + Mark Underwood",
    status: "open",
  },
  {
    id: "r3",
    category: "Research",
    title: "Phase 2 participant dropout reduces dataset below minimum",
    probability: "medium",
    impact: "high",
    description: "30 participants, 3 sessions/day for 14 days. High dropout risk for daily EEG commitment. Below 20 reliable participants weakens M2 model generalization.",
    mitigations: [
      "EUR 3 per session compensation incentivizes completion",
      "Varun and Shreya pre-enrolled as pilot participants",
      "Monitor completion rate daily in study admin dashboard",
      "Have replacement participants on standby for each cohort",
    ],
    owner: "Nisha + Mia",
    status: "open",
  },
  {
    id: "r4",
    category: "Technical",
    title: "24h ambient data collection not fixed before Phase 2",
    probability: "high",
    impact: "critical",
    description: "24h ambient wearable data collection is a critical design requirement for Phase 2. If not fixed before June 21, the M2 model cannot be trained on the correct features.",
    mitigations: [
      "This is the highest priority technical fix before June 21",
      "Tell Claude Code to fix this immediately",
      "Verify fix is working before first participant session",
    ],
    owner: "Claude Code / iOS engineer",
    status: "open",
  },
  {
    id: "r5",
    category: "Technical",
    title: "BLE reset bug breaks back-to-back sessions",
    probability: "high",
    impact: "medium",
    description: "Back-to-back session BLE reset bug causes connection failures between consecutive sessions. Must be fixed before volunteers start 3x daily sessions.",
    mitigations: [
      "Fix before June 21 Phase 2 start",
      "Tell Claude Code to prioritize this alongside 24h ambient fix",
      "Test thoroughly before Cohort 1 starts",
    ],
    owner: "Claude Code / iOS engineer",
    status: "open",
  },
  {
    id: "r6",
    category: "Legal",
    title: "GDPR consent flow not ready before June 21 study start",
    probability: "medium",
    impact: "high",
    description: "EEG data is Special Category data under GDPR Article 9. Study cannot legally start without explicit informed consent flow and privacy notice live.",
    mitigations: [
      "Mark Underwood Schedule B GDPR pack due June 20 - one day before Phase 2",
      "iOS screener has consent flow in gated PR #6 - merge before June 21",
      "Privacy policy must be live on gammacog.com before study starts",
    ],
    owner: "Nisha + Mark Underwood",
    status: "open",
  },
  {
    id: "r7",
    category: "Product",
    title: "App Store rejection delays October launch",
    probability: "medium",
    impact: "high",
    description: "Apple rejects apps for many reasons. Missing Delete Account flow (5.1.1v) is a guaranteed rejection. Review process takes 1-7 days, rejections reset the clock.",
    mitigations: [
      "Build Delete Account flow in August - hard requirement",
      "QA via bluepixel-qa branch before submission",
      "Submit by September 1 to allow for one rejection cycle before October launch",
      "Do not submit without StoreKit paywall fully working",
    ],
    owner: "Nisha + iOS engineer",
    status: "open",
  },
  {
    id: "r8",
    category: "Team",
    title: "No technical co-founder - signal processing gap unowned",
    probability: "high",
    impact: "medium",
    description: "EOG MNE SSP, ASR, mastoid referencing, and Stroop session_id NULL fix are all unowned since Marcelo terminated. No one to productionize the CCS algorithm.",
    mitigations: [
      "Active co-founder search across YC matching, Entrepreneur First, Neuromatch, OpenBCI Discord",
      "Claude Code handles tactical fixes in interim",
      "Mia can advise on signal processing but cannot own the codebase",
      "Pre-seed funds hiring - do not wait for co-founder to launch",
    ],
    owner: "Nisha",
    status: "open",
  },
  {
    id: "r9",
    category: "Fundraising",
    title: "Varun Gulati soft no leaves round short",
    probability: "medium",
    impact: "low",
    description: "Varun was a planned $10K investor who gave a soft no. If other investors also decline, the round may fall short of $150K.",
    mitigations: [
      "Anisha Rachit is backup for $25K if needed",
      "Saurabh may go above $10K after reviewing financials",
      "Brother capacity unknown - could add $10-25K",
      "Do not count Varun in the target - build the round without him",
    ],
    owner: "Nisha",
    status: "open",
  },
  {
    id: "r10",
    category: "Legal",
    title: "D7 visa renewal fails at September 4 AIMA appointment",
    probability: "low",
    impact: "critical",
    description: "D7 renewal requires minimum EUR 11,040 in Portuguese bank account. If NovoBanco transfer is delayed or balance is insufficient, renewal may be denied.",
    mitigations: [
      "Transfer funds to NovoBanco in July to build 2 months of history",
      "Confirm exact balance requirement with immigration attorney before appointment",
      "Do not spend down NovoBanco balance before September 4",
    ],
    owner: "Nisha",
    status: "open",
  },
]

const CATEGORIES = ["All", "Fundraising", "Legal", "Research", "Technical", "Product", "Team"]

const PROBABILITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  high: { label: "High", color: "bg-destructive/10 text-destructive" },
}

const IMPACT_CONFIG: Record<string, { label: string; color: string; order: number }> = {
  low: { label: "Low impact", color: "text-muted-foreground", order: 3 },
  medium: { label: "Medium impact", color: "text-yellow-700 dark:text-yellow-400", order: 2 },
  high: { label: "High impact", color: "text-destructive", order: 1 },
  critical: { label: "Critical", color: "text-destructive font-semibold", order: 0 },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-destructive/10 text-destructive" },
  mitigated: { label: "Mitigated", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  closed: { label: "Closed", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
}

export default function RisksPage() {
  const [category, setCategory] = useState("All")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<Record<string, string>>({})

  const filtered = (category === "All" ? RISKS : RISKS.filter(r => r.category === category))
    .sort((a, b) => IMPACT_CONFIG[a.impact].order - IMPACT_CONFIG[b.impact].order)

  const openCount = RISKS.filter(r => (statuses[r.id] || r.status) === "open").length
  const criticalCount = RISKS.filter(r => r.impact === "critical" && (statuses[r.id] || r.status) === "open").length

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Risk register</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every risk that could derail Gamma before August 1. Sorted by impact.</p>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">Total risks</p>
          <p className="text-2xl font-medium text-foreground">{openCount}</p>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
          <p className="text-[11px] text-destructive mb-1">Critical open</p>
          <p className="text-2xl font-medium text-destructive">{criticalCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground mb-1">Mitigated</p>
          <p className="text-2xl font-medium text-foreground">{RISKS.filter(r => (statuses[r.id] || r.status) === "mitigated").length}</p>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={"text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors " + (category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(r => {
          const status = statuses[r.id] || r.status
          return (
            <div key={r.id} className={"rounded-xl border bg-card transition-colors " + (expanded === r.id ? "border-primary" : "border-border")}>
              <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">{r.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full " + PROBABILITY_CONFIG[r.probability].color}>{PROBABILITY_CONFIG[r.probability].label} probability</span>
                    <span className={"text-[11px] " + IMPACT_CONFIG[r.impact].color}>{IMPACT_CONFIG[r.impact].label}</span>
                    <span className="text-[11px] text-muted-foreground">{r.category}</span>
                  </div>
                </div>
                <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].label}</span>
              </div>

              {expanded === r.id && (
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-2">Mitigations</p>
                    <div className="space-y-1.5">
                      {r.mitigations.map((m, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{m}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">Owner:</span>
                      <span className="text-[11px] font-medium text-foreground">{r.owner}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <button key={key} onClick={() => setStatuses(prev => ({ ...prev, [r.id]: key }))} className={"text-[11px] font-medium px-2 py-1 rounded-full transition-colors " + (status === key ? val.color : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
