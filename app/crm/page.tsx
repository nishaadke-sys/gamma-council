"use client"

import { useState } from "react"
import posthog from "posthog-js"

const INVESTORS = [
  { id: "saurabh", name: "Saurabh", amount: 10000, location: "US", status: "verbal", priority: 1, notes: "$10K confirmed. Sent financials - waiting to see if he goes higher. Most important active conversation.", compliance: "US wire - straightforward", lastContact: "", nextAction: "Follow up on financials review" },
  { id: "pranav_pandit", name: "Pranav Pandit", amount: 10000, location: "US", status: "to_contact", priority: 2, notes: "Friend. Not yet asked.", compliance: "US wire - straightforward", lastContact: "", nextAction: "Initial conversation" },
  { id: "lav_kumar", name: "Lav Kumar", amount: 10000, location: "US", status: "to_contact", priority: 3, notes: "Friend. Not yet asked.", compliance: "US wire - straightforward", lastContact: "", nextAction: "Initial conversation" },
  { id: "brother", name: "Brother", amount: 10000, location: "Unknown", status: "to_contact", priority: 4, notes: "Family. Asked but capacity unknown. May not need a formal note. Reserve equity regardless.", compliance: "TBD based on location", lastContact: "", nextAction: "Follow up on capacity" },
  { id: "uncle_1", name: "Uncle 1", amount: 25000, location: "India", status: "to_contact", priority: 5, notes: "Family. Not yet asked. India wire requires FEMA compliance - start process before they say yes.", compliance: "INDIA - FEMA required", lastContact: "", nextAction: "Start FEMA compliance review" },
  { id: "uncle_2", name: "Uncle 2", amount: 25000, location: "India", status: "to_contact", priority: 6, notes: "Family. Not yet asked. India wire requires FEMA compliance - start process before they say yes.", compliance: "INDIA - FEMA required", lastContact: "", nextAction: "Start FEMA compliance review" },
  { id: "varun_gulati", name: "Varun Gulati", amount: 10000, location: "Unknown", status: "parked", priority: 7, notes: "Soft no. Park for now. Revisit only if round is short.", compliance: "TBD", lastContact: "", nextAction: "Park - revisit only if needed" },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  verbal: { label: "Verbal yes", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  doc_sent: { label: "Doc sent", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  signed: { label: "Signed", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  wired: { label: "Wired", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  closed: { label: "Closed", color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
  to_contact: { label: "To contact", color: "bg-muted text-muted-foreground" },
  parked: { label: "Parked", color: "bg-muted text-muted-foreground" },
  declined: { label: "Declined", color: "bg-destructive/10 text-destructive" },
}

const STATUS_ORDER = ["to_contact", "verbal", "doc_sent", "signed", "wired", "closed", "parked", "declined"]

function fmt(n: number): string {
  if (n >= 1000) return "$" + (n / 1000).toFixed(0) + "K"
  return "$" + n
}

export default function CRMPage() {
  const [investors, setInvestors] = useState(INVESTORS)
  const [selected, setSelected] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, Partial<(typeof INVESTORS)[0]>>>({})

  const active = investors.filter(i => !["parked", "declined"].includes(i.status))
  const totalConfirmed = active.reduce((s, i) => s + i.amount, 0)
  const wired = investors.filter(i => ["wired", "closed"].includes(i.status)).reduce((s, i) => s + i.amount, 0)
  const signed = investors.filter(i => ["signed", "wired", "closed"].includes(i.status)).reduce((s, i) => s + i.amount, 0)

  function updateStatus(id: string, status: string) {
    const investor = investors.find(i => i.id === id)
    posthog.capture("investor_status_updated", {
      investor_id: id,
      investor_location: investor?.location,
      previous_status: investor?.status,
      new_status: status,
    })
    setInvestors(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  function saveEdits(id: string) {
    if (edits[id]) {
      const investor = investors.find(i => i.id === id)
      posthog.capture("investor_notes_saved", {
        investor_id: id,
        investor_status: investor?.status,
        fields_updated: Object.keys(edits[id]),
      })
      setInvestors(prev => prev.map(i => i.id === id ? { ...i, ...edits[id] } : i))
    }
    setSelected(null)
  }

  function setEdit(id: string, field: string, value: string) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Investor CRM</h1>
        <p className="mt-1 text-sm text-muted-foreground">F&F round - $150K target - August 1 close - $10K confirmed - $140K gap</p>
      </header>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Target", value: "$150K" },
          { label: "In pipeline", value: fmt(totalConfirmed) },
          { label: "Signed", value: fmt(signed) },
          { label: "Wired", value: fmt(wired) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            <p className="text-lg font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-muted-foreground">Wired progress</p>
          <p className="text-xs font-medium text-foreground">{fmt(wired)} of $150K</p>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: Math.min(100, wired / 150000 * 100) + "%" }} />
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {investors.map((investor) => {
          const edit = edits[investor.id] || {}
          return (
            <div key={investor.id} className={"rounded-xl border bg-card transition-colors " + (selected === investor.id ? "border-primary" : "border-border")}>
              <div className="flex items-center justify-between gap-3 p-4 cursor-pointer" onClick={() => setSelected(selected === investor.id ? null : investor.id)}>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground/60 min-w-[16px]">{investor.priority}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{investor.name}</p>
                    <p className="text-[11px] text-muted-foreground">{investor.location} · {investor.compliance.includes("INDIA") ? "FEMA required" : "Standard wire"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-foreground">{fmt(investor.amount)}</span>
                  <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full " + STATUS_CONFIG[investor.status].color}>{STATUS_CONFIG[investor.status].label}</span>
                </div>
              </div>

              {selected === investor.id && (
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                  {investor.compliance.includes("INDIA") && (
                    <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-xs leading-relaxed">
                      FEMA compliance required. Start now - international wires from India take 2-4 weeks minimum. His Authorized Dealer bank needs: purpose of remittance, signed investment agreement, source of funds declaration.
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-2">Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_ORDER.map((s) => (
                        <button key={s} onClick={() => updateStatus(investor.id, s)} className={"text-[11px] font-medium px-2 py-1 rounded-full transition-colors " + (investor.status === s ? STATUS_CONFIG[s].color : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Last contact</p>
                    <input type="date" value={edit.lastContact ?? investor.lastContact} onChange={(e) => setEdit(investor.id, "lastContact", e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Next action</p>
                    <input type="text" value={edit.nextAction ?? investor.nextAction} onChange={(e) => setEdit(investor.id, "nextAction", e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Notes</p>
                    <textarea value={edit.notes ?? investor.notes} onChange={(e) => setEdit(investor.id, "notes", e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs resize-none" />
                  </div>
                  <button onClick={() => saveEdits(investor.id)} className="w-full rounded-lg bg-primary text-primary-foreground text-xs font-medium py-2 hover:bg-primary/90 transition-colors">
                    Save
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">August 1 close checklist</p>
        <div className="space-y-2">
          {[
            "Start FEMA compliance review for both India uncles immediately - 2-4 weeks minimum",
            "Follow up with Saurabh on financials - can he go above $10K",
            "Call Pranav Pandit this week - first conversation",
            "Call Lav Kumar this week - first conversation",
            "Follow up with brother on capacity",
            "Send note document within 24 hours of any verbal yes",
            "All signed by July 25 to allow wire processing time",
            "All wires received in LifeInk Neuro LLC by August 1",
            "Cap table updated after each wire received",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="size-4 rounded border border-border bg-background shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
