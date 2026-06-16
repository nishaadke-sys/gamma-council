"use client"

import { useState } from "react"

const MILESTONES = [
  {
    id: "phase2_cohort1",
    category: "Research",
    title: "Phase 2 Cohort 1 starts",
    date: "2026-06-21",
    status: "upcoming",
    owner: "Nisha + Mia",
    description: "30 participants, 2 cohorts, 6-minute EEG sessions 3x daily for 14 days. Cohort 1 of 15 participants starts June 21.",
    dependencies: ["24h ambient wearable data collection fix", "BLE reset bug fix", "Mia open questions resolved"],
    link: "/roadmap",
  },
  {
    id: "ff_close",
    category: "Fundraising",
    title: "F&F round closes",
    date: "2026-08-01",
    status: "in_progress",
    owner: "Nisha",
    description: "$150K target. Confirmed: $10K from Saurabh. Gap: $140K. 6 investors to close.",
    dependencies: ["All notes signed", "All wires received in LifeInk Neuro LLC", "FEMA compliance for India uncles"],
    link: "/crm",
  },
  {
    id: "phase2_complete",
    category: "Research",
    title: "Phase 2 complete",
    date: "2026-08-15",
    status: "upcoming",
    owner: "Nisha + Mia",
    description: "Cohort 2 completes August 15. All 2,520 EEG sessions collected. 24h ambient wearable data collected for all 30 participants.",
    dependencies: ["Cohort 1 complete July 12", "Cohort 2 starts July 12", "Data pipeline clean"],
    link: "/roadmap",
  },
  {
    id: "app_store",
    category: "Product",
    title: "iOS app live in App Store",
    date: "2026-10-01",
    status: "upcoming",
    owner: "Nisha + iOS engineer",
    description: "App Store submission requires: Delete Account flow (Apple 5.1.1v), 21-day free trial paywall (StoreKit), QA via bluepixel-qa branch.",
    dependencies: ["Delete Account flow built", "StoreKit integration", "Bluepixel QA complete", "App Store review approval"],
    link: "/roadmap",
  },
  {
    id: "founding_100",
    category: "Revenue",
    title: "Founding 100 cohort converted",
    date: "2026-10-31",
    status: "upcoming",
    owner: "Nisha",
    description: "20 of 30 Phase 2 participants convert to paying subscribers at launch. First revenue before broader App Store acquisition.",
    dependencies: ["App Store live", "Phase 2 participants debriefed", "Willingness to pay confirmed in exit interviews"],
    link: "/gtm",
  },
  {
    id: "d7_renewal",
    category: "Legal",
    title: "D7 visa renewal - AIMA appointment",
    date: "2026-09-04",
    status: "upcoming",
    owner: "Nisha",
    description: "AIMA appointment September 4. Minimum Portuguese bank balance EUR 11,040 required. NovoBanco transfer July to build 2 months history.",
    dependencies: ["NovoBanco transfer July", "2 months bank history before September 4"],
    link: "/legal",
  },
  {
    id: "preseed_conversations",
    category: "Fundraising",
    title: "Pre-seed conversations open",
    date: "2026-12-01",
    status: "upcoming",
    owner: "Nisha",
    description: "100 paying subscribers ($999 MRR) triggers pre-seed conversations. Activate Startups.com investor matching tool only after F&F fully closed.",
    dependencies: ["F&F closed", "App Store live", "100 paying subscribers"],
    link: "/funding",
  },
  {
    id: "preseed_close",
    category: "Fundraising",
    title: "Pre-seed closes",
    date: "2027-04-01",
    status: "future",
    owner: "Nisha",
    description: "$500K target at $8-10M cap. Gate: Phase 2 data showing R2 > 0.3 and app live with paying users.",
    dependencies: ["Phase 2 R2 > 0.3", "300+ paying subscribers", "Delaware C-Corp conversion"],
    link: "/funding",
  },
  {
    id: "year1_target",
    category: "Revenue",
    title: "Year 1 revenue target",
    date: "2027-06-01",
    status: "future",
    owner: "Nisha + team",
    description: "1,000 paying subscribers at $9.99/month = $9,990 MRR. Pre-seed gate milestone.",
    dependencies: ["Pre-seed closed", "Technical co-founder hired", "Paid acquisition channels open"],
    link: "/funding",
  },
  {
    id: "breakeven",
    category: "Revenue",
    title: "Breakeven",
    date: "2027-11-01",
    status: "future",
    owner: "Nisha + team",
    description: "1,789 subscribers at $9.99/month = $17,872 MRR. Monthly fixed costs $11,971 covered. Every subscriber after this flows to margin.",
    dependencies: ["1,789 paying subscribers", "CAC under $20"],
    link: "/funding",
  },
]

const CATEGORIES = ["All", "Research", "Fundraising", "Product", "Revenue", "Legal"]

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  done: { label: "Done", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", dot: "bg-green-600" },
  in_progress: { label: "In progress", color: "bg-primary/10 text-primary", dot: "bg-primary animate-pulse" },
  upcoming: { label: "Upcoming", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", dot: "bg-yellow-500" },
  future: { label: "Future", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/40" },
  at_risk: { label: "At risk", color: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function MilestonesPage() {
  const [category, setCategory] = useState("All")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<Record<string, string>>({})

  const filtered = category === "All" ? MILESTONES : MILESTONES.filter(m => m.category === category)

  function getStatus(m: typeof MILESTONES[0]) {
    return statuses[m.id] || m.status
  }

  function updateStatus(id: string, status: string) {
    setStatuses(prev => ({ ...prev, [id]: status }))
  }

  const nextMilestone = MILESTONES.filter(m => ["upcoming", "in_progress"].includes(getStatus(m))).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Milestone tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every critical gate from now to breakeven. Click any milestone to update status or see dependencies.</p>
      </header>

      {nextMilestone && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6">
          <p className="text-[11px] font-medium text-primary mb-1">Next milestone</p>
          <p className="text-sm font-medium text-foreground">{nextMilestone.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{nextMilestone.date} - {daysUntil(nextMilestone.date)} days away</p>
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={"text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors " + (category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(m => {
          const status = getStatus(m)
          const days = daysUntil(m.date)
          return (
            <div key={m.id} className={"rounded-xl border bg-card transition-colors " + (expanded === m.id ? "border-primary" : "border-border")}>
              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <span className={"size-2 rounded-full shrink-0 " + STATUS_CONFIG[status].dot} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground">{m.date} · {days > 0 ? days + " days" : "overdue"} · {m.category}</p>
                </div>
                <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].label}</span>
              </div>

              {expanded === m.id && (
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>

                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-2">Dependencies</p>
                    <div className="space-y-1">
                      {m.dependencies.map((dep, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" />
                          <p className="text-xs text-muted-foreground">{dep}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-2">Update status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <button key={key} onClick={() => updateStatus(m.id, key)} className={"text-[11px] font-medium px-2 py-1 rounded-full transition-colors " + (status === key ? val.color : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <a href={m.link} className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                    Open related tool
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
