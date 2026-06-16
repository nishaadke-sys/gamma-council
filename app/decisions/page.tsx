"use client"

import { useState } from "react"

type Decision = {
  id: string
  date: string
  category: string
  decision: string
  rationale: string
  alternatives: string
  outcome: string
  status: "open" | "made" | "revisit"
}

const SEED_DECISIONS: Decision[] = [
  { id: "d1", date: "2026-06-15", category: "Legal", decision: "Engage Mark Underwood for fixed-fee legal package", rationale: "Multi-jurisdiction F&F round requires custom note package. Fixed-fee protects runway. Schedule A F&F close $7K by July 15, Schedule B GDPR pack $3K by June 20.", alternatives: "YC standard template only (cheaper but risky across US/EU/India), monthly retainer (too expensive at current burn)", outcome: "", status: "made" },
  { id: "d2", date: "2026-06-15", category: "Fundraising", decision: "Keep minimum check size at $10K not $20K", rationale: "Only $10K confirmed. $140K gap. Raising the minimum cuts out people who want to participate. At F&F stage inclusion matters more than check size.", alternatives: "$20K minimum (cleaner cap table but risks losing investors who cannot write that check)", outcome: "", status: "made" },
  { id: "d3", date: "2026-06-10", category: "Instrument", decision: "Use convertible note not SAFE for F&F round", rationale: "Ed Kang recommendation. More investor-protective. India investor path requires FEMA compliance regardless of instrument. Convertible note has maturity date backstop.", alternatives: "YC post-money SAFE (simpler, no interest, but no repayment backstop)", outcome: "", status: "made" },
  { id: "d4", date: "2026-06-10", category: "Product", decision: "Skip RedBridge membership", rationale: "290 EUR is trivial but 60-80 hours over 12 months is catastrophic. Base rate for converting club attendees into closed deals under 2%. Direct executive outreach is higher leverage.", alternatives: "Join RedBridge (networking access but low conversion probability at pre-revenue stage)", outcome: "", status: "made" },
  { id: "d5", date: "2026-06-01", category: "Entity", decision: "Issue F&F round under LifeInk Neuro LLC not Gamma Cog OUE", rationale: "US investors prefer Delaware entity. India wire compliance cleaner through US LLC. Pre-seed investors will want US entity on cap table.", alternatives: "Issue under Estonian OUE (simpler for EU investors but raises questions from US institutional investors)", outcome: "", status: "made" },
]

const CATEGORIES = ["All", "Legal", "Fundraising", "Instrument", "Product", "Entity", "Team", "Research", "GTM"]
const STATUS_CONFIG = {
  made: { label: "Made", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  open: { label: "Open", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  revisit: { label: "Revisit", color: "bg-destructive/10 text-destructive" },
}

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>(SEED_DECISIONS)
  const [category, setCategory] = useState("All")
  const [showNew, setShowNew] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newDecision, setNewDecision] = useState({ date: new Date().toISOString().split("T")[0], category: "Legal", decision: "", rationale: "", alternatives: "", outcome: "", status: "open" as const })

  const filtered = category === "All" ? decisions : decisions.filter(d => d.category === category)

  function addDecision() {
    if (!newDecision.decision.trim()) return
    const d: Decision = { ...newDecision, id: "d" + Date.now() }
    setDecisions(prev => [d, ...prev])
    setNewDecision({ date: new Date().toISOString().split("T")[0], category: "Legal", decision: "", rationale: "", alternatives: "", outcome: "", status: "open" })
    setShowNew(false)
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Decision Log</h1>
            <p className="mt-1 text-sm text-muted-foreground">Every major decision, why you made it, and what the alternatives were.</p>
          </div>
          <button onClick={() => setShowNew(!showNew)} className="rounded-lg bg-primary text-primary-foreground text-xs font-medium px-3 py-2 hover:bg-primary/90 transition-colors">
            + New
          </button>
        </div>
      </header>

      {showNew && (
        <div className="rounded-xl border border-primary bg-card p-5 mb-6 space-y-3">
          <p className="text-xs font-medium text-foreground">Log a decision</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Date</p>
              <input type="date" value={newDecision.date} onChange={e => setNewDecision(p => ({...p, date: e.target.value}))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Category</p>
              <select value={newDecision.category} onChange={e => setNewDecision(p => ({...p, category: e.target.value}))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">Decision</p>
            <input type="text" value={newDecision.decision} onChange={e => setNewDecision(p => ({...p, decision: e.target.value}))} placeholder="What did you decide?" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">Rationale</p>
            <textarea value={newDecision.rationale} onChange={e => setNewDecision(p => ({...p, rationale: e.target.value}))} rows={2} placeholder="Why?" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs resize-none" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">Alternatives considered</p>
            <textarea value={newDecision.alternatives} onChange={e => setNewDecision(p => ({...p, alternatives: e.target.value}))} rows={2} placeholder="What else did you consider?" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={addDecision} className="flex-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium py-2 hover:bg-primary/90 transition-colors">Save</button>
            <button onClick={() => setShowNew(false)} className="flex-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium py-2 hover:bg-muted/80 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={"text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors " + (category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(d => (
          <div key={d.id} className={"rounded-xl border bg-card cursor-pointer transition-colors " + (expanded === d.id ? "border-primary" : "border-border")} onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="text-sm font-medium text-foreground leading-relaxed">{d.decision}</p>
                <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_CONFIG[d.status].color}>{STATUS_CONFIG[d.status].label}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{d.date} · {d.category}</p>
            </div>
            {expanded === d.id && (
              <div className="border-t border-border p-4 space-y-3">
                <div>
                  <p className="text-[11px] font-medium text-primary mb-1">Rationale</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{d.rationale}</p>
                </div>
                {d.alternatives && (
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Alternatives considered</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{d.alternatives}</p>
                  </div>
                )}
                {d.outcome && (
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Outcome</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{d.outcome}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
