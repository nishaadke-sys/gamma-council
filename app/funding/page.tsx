"use client"


import { useState, useCallback } from "react"

function fmt(n: number, type = "dollar"): string {
  if (type === "dollar") {
    if (Math.abs(n) >= 1000000) return "$" + Math.round(n / 100000) / 10 + "M"
    if (Math.abs(n) >= 1000) return "$" + Math.round(n / 100) / 10 + "K"
    return "$" + Math.round(n)
  }
  if (type === "pct") return (Math.round(n * 100) / 100).toFixed(1) + "%"
  return Math.round(n).toLocaleString()
}

function calcDilution(raise: number, cap: number, discountPct: number, interestRate: number, months: number, nextVal: number) {
  const accrued = raise * (1 + (interestRate / 100) * (months / 12))
  const conversionVal = Math.min(cap, nextVal * (1 - discountPct / 100))
  const investorOwnership = (accrued / (conversionVal + accrued)) * 100
  const founderOwnership = 100 - investorOwnership
  const valueAtNextRound = nextVal * (investorOwnership / 100)
  const multiple = valueAtNextRound / raise
  return { accrued, conversionVal, investorOwnership, founderOwnership, multiple, valueAtNextRound }
}

const SCENARIOS = [
  { name: "Your current deal", raise: 150000, cap: 3000000, discount: 0, interest: 5, months: 18, nextVal: 6000000, note: "$150K convertible note, $3M cap, 5% interest, August 1 close", yours: true },
  { name: "Conservative cap", raise: 150000, cap: 5000000, discount: 0, interest: 5, months: 18, nextVal: 6000000, note: "Higher cap gives investors less ownership but may be harder to justify pre-revenue" },
  { name: "SAFE structure", raise: 150000, cap: 3000000, discount: 20, interest: 0, months: 18, nextVal: 6000000, note: "No interest, 20% discount. Simpler for F&F but slightly more dilutive at conversion" },
  { name: "Raise more", raise: 250000, cap: 4000000, discount: 0, interest: 5, months: 18, nextVal: 6000000, note: "Raise $250K at $4M cap. Extends runway but gives away more equity" },
]

const DEFS = [
  { term: "Convertible note", body: "A loan that converts into equity at a future funding round. Has an interest rate and maturity date. If you never raise again, you owe the money back.", founder: "You owe interest until conversion. More investor-protective than SAFE.", investor: "Provides repayment rights if company fails to raise. Interest accrues as additional ownership." },
  { term: "SAFE", body: "A YC instrument that converts to equity at the next round with no interest and no maturity date. Simpler and faster than a note. No repayment obligation.", founder: "No interest means less accrual. No maturity date means no pressure to convert.", investor: "No repayment rights. More founder-friendly. Relies entirely on a future priced round." },
  { term: "Valuation cap", body: "The maximum valuation used to calculate the investor's share price at conversion. Protects early investors from a high future valuation.", founder: "Lower cap means more dilution. Your $3M cap means investors always convert at $3M or below regardless of how high your valuation goes.", investor: "The cap is your return mechanism. At $3M cap and $6M next round, you get 2x the shares you'd get without a cap." },
  { term: "Discount rate", body: "A percentage reduction on the share price at conversion. A 20% discount means you buy shares at 80% of what new investors pay.", founder: "Discounts compound with caps if both included. Standard F&F often has just a cap with no discount.", investor: "Guarantees more shares than next round investors regardless of valuation." },
  { term: "Dilution", body: "The reduction in ownership percentage when new shares are issued. Every round dilutes you. F&F, pre-seed, seed, and Series A each add a layer.", founder: "You start at 100%. After F&F at $3M cap: ~95%. After pre-seed: ~78%. After seed: ~62%. After Series A: ~47%. Illustrative.", investor: "Your ownership gets diluted by each subsequent round too unless you have pro-rata rights." },
  { term: "Pro-rata rights", body: "The right to invest in future rounds to maintain your ownership percentage.", founder: "Only offer to investors who will actually exercise. Locks you into offering them a slot in every future round.", investor: "Critical at seed stage. Without pro-rata your 5% gets diluted to 2% by seed." },
  { term: "MFN clause", body: "Most Favored Nation. If you give better terms to a future investor, existing MFN investors automatically get those same terms.", founder: "Can create surprises. If you raise next F&F at higher cap, MFN investors get that cap automatically.", investor: "Protects against founder giving better terms to a later investor without your knowledge." },
]

export default function FundingPage() {
  const [perspective, setPerspective] = useState<"founder" | "investor">("founder")
  const [tab, setTab] = useState<"calculator" | "scenarios" | "definitions">("calculator")
  const [raise, setRaise] = useState(150000)
  const [cap, setCap] = useState(3000000)
  const [discount, setDiscount] = useState(0)
  const [interest, setInterest] = useState(5)
  const [months, setMonths] = useState(18)
  const [nextVal, setNextVal] = useState(6000000)

  const d = calcDilution(raise, cap, discount, interest, months, nextVal)

  const rounds = [
    { name: "F&F", pct: d.founderOwnership },
    { name: "Pre-seed", pct: d.founderOwnership * 0.82 },
    { name: "Seed", pct: d.founderOwnership * 0.82 * 0.8 },
    { name: "Series A", pct: d.founderOwnership * 0.82 * 0.8 * 0.75 },
  ]

  const flags = perspective === "founder" ? [
    d.investorOwnership > 7 ? { type: "red", text: `Investors will own ${d.investorOwnership.toFixed(1)}% at conversion. F&F rounds typically give 5-8% total. Consider raising the cap or reducing the raise amount.` } : null,
    raise / cap > 0.06 ? { type: "amber", text: `Raise-to-cap ratio is ${Math.round(raise / cap * 100)}%. Above 6% signals the cap may be too low relative to raise size.` } : null,
    interest > 6 ? { type: "amber", text: `Interest rate of ${interest}% is above market standard for F&F (5-6%). Every extra point accrues as additional dilution.` } : null,
    nextVal < cap * 1.5 ? { type: "amber", text: `Next round valuation is less than 1.5x the cap. Structure only helps investors if the next round is higher than the cap.` } : null,
    d.founderOwnership > 92 ? { type: "green", text: `You retain ${d.founderOwnership.toFixed(1)}% at conversion. Strong founder ownership going into pre-seed.` } : null,
    months <= 12 ? { type: "green", text: `Short conversion window of ${months} months means less interest accrual and faster certainty for both sides.` } : null,
  ].filter(Boolean) : [
    d.investorOwnership < 3 ? { type: "amber", text: `Ownership of ${d.investorOwnership.toFixed(1)}% is below 3%. May not be material enough for institutional investors.` } : null,
    cap > nextVal ? { type: "red", text: `Valuation cap exceeds next round valuation. The cap protection is worthless.` } : null,
    interest < 5 ? { type: "amber", text: `Interest rate of ${interest}% provides minimal downside protection. Market standard is 5-8%.` } : null,
    d.investorOwnership >= 5 && d.investorOwnership <= 8 ? { type: "green", text: `Ownership of ${d.investorOwnership.toFixed(1)}% is within the typical F&F range of 5-8%.` } : null,
    d.multiple > 1.5 ? { type: "green", text: `Paper multiple of ${d.multiple.toFixed(1)}x at next round valuation. Attractive for a friends and family check.` } : null,
  ].filter(Boolean)

  const sl = "flex items-center gap-3 mb-3"
  const slLabel = "text-xs text-muted-foreground min-w-[160px]"
  const slVal = "text-xs font-medium text-foreground min-w-[56px] text-right"

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Funding strategy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Model your deal from both sides. Pre-loaded with your current F&F round.</p>
      </header>

      <div className="flex rounded-lg border border-border overflow-hidden w-fit mb-6">
        {(["founder", "investor"] as const).map((p) => (
          <button key={p} onClick={() => setPerspective(p)} className={`px-4 py-2 text-xs font-medium transition-colors ${perspective === p ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
            {p === "founder" ? "Founder view" : "Investor view"}
          </button>
        ))}
      </div>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        {(["calculator", "scenarios", "definitions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "calculator" && (
        <div className="space-y-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Your deal parameters</p>
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              {[
                { label: "Raise amount", val: fmt(raise), min: 50000, max: 500000, step: 5000, value: raise, set: setRaise },
                { label: "Valuation cap", val: fmt(cap), min: 1000000, max: 10000000, step: 100000, value: cap, set: setCap },
                { label: "Discount rate", val: discount + "%", min: 0, max: 30, step: 1, value: discount, set: setDiscount },
                { label: "Interest rate (%/yr)", val: interest + "%", min: 0, max: 10, step: 0.5, value: interest, set: setInterest },
                { label: "Months to conversion", val: months + " mo", min: 6, max: 36, step: 1, value: months, set: setMonths },
                { label: "Next round valuation", val: fmt(nextVal), min: 2000000, max: 20000000, step: 500000, value: nextVal, set: setNextVal },
              ].map(({ label, val, min, max, step, value, set }) => (
                <div key={label} className={sl}>
                  <span className={slLabel}>{label}</span>
                  <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className="flex-1" />
                  <span className={slVal}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">{perspective === "founder" ? "Founder outcome" : "Investor outcome"}</p>
            <div className="grid grid-cols-4 gap-3">
              {perspective === "founder" ? [
                { label: "You keep", value: d.founderOwnership.toFixed(1) + "%", sub: "at conversion" },
                { label: "Investor gets", value: d.investorOwnership.toFixed(1) + "%", sub: "of company" },
                { label: "Accrued debt", value: fmt(d.accrued), sub: "at conversion" },
                { label: "Effective cap", value: fmt(d.conversionVal), sub: "conversion val" },
              ] : [
                { label: "Ownership", value: d.investorOwnership.toFixed(1) + "%", sub: "at conversion" },
                { label: "Value at next round", value: fmt(d.valueAtNextRound), sub: "on paper" },
                { label: "Paper multiple", value: d.multiple.toFixed(1) + "x", sub: "at next round" },
                { label: "Interest earned", value: fmt(d.accrued - raise), sub: `over ${months} mo` },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                  <p className="text-lg font-medium text-foreground">{value}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Founder ownership across rounds</p>
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              {rounds.map(({ name, pct }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground min-w-[70px]">{name}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: pct.toFixed(1) + "%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground min-w-[42px] text-right">{pct.toFixed(1)}%</span>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground/60 mt-1">Pre-seed/Seed/Series A assume 18%/20%/25% dilution each. Illustrative only.</p>
            </div>
          </div>

          {flags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">{perspective === "founder" ? "Founder flags" : "Investor flags"}</p>
              <div className="space-y-2">
                {flags.map((f: any, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg text-xs leading-relaxed ${f.type === "red" ? "bg-destructive/10 text-destructive" : f.type === "green" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"}`}>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "scenarios" && (
        <div className="space-y-4">
          {SCENARIOS.map((s) => {
            const sd = calcDilution(s.raise, s.cap, s.discount, s.interest, s.months, s.nextVal)
            return (
              <div key={s.name} className={`rounded-xl border bg-card p-5 ${s.yours ? "border-primary border-2" : "border-border"}`}>
                {s.yours && <p className="text-[11px] font-medium text-primary mb-1">Your current deal</p>}
                <p className="text-sm font-medium text-foreground mb-1">{s.name}</p>
                <p className="text-xs text-muted-foreground mb-4">{s.note}</p>
                <div className="grid grid-cols-4 gap-2">
                  {(perspective === "founder" ? [
                    { label: "You keep", value: sd.founderOwnership.toFixed(1) + "%" },
                    { label: "Investors get", value: sd.investorOwnership.toFixed(1) + "%" },
                    { label: "Accrued", value: fmt(sd.accrued) },
                    { label: "Raise", value: fmt(s.raise) },
                  ] : [
                    { label: "Ownership", value: sd.investorOwnership.toFixed(1) + "%" },
                    { label: "Multiple", value: sd.multiple.toFixed(1) + "x" },
                    { label: "Interest", value: fmt(sd.accrued - s.raise) },
                    { label: "Risk", value: s.discount > 0 ? "Low" : "Med" },
                  ]).map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-muted p-2.5 text-center">
                      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                    { label: "You keep", value: sd.founderOwnership.toFixed(1) + "%" },
                    { label: "Investors get", value: sd.investorOwnership.toFixed(1) + "%" },
                    { label: "Accrued", value: fmt(sd.accrued) },
                    { label: "Raise", value: fmt(s.raise) },
                  ] : [
                    { label: "Ownership", value: sd.investorOwnership.toFixed(1) + "%" },
                    { label: "Multiple", value: sd.multiple.toFixed(1) + "x" },
                    { label: "Interest", value: fmt(sd.accrued - s.raise) },
                    { label: "Risk", value: s.discount > 0 ? "Low" : "Med" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-muted p-2.5 text-center">
                      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === "definitions" && (
        <div className="space-y-1">
          {DEFS.map((def) => (
            <div key={def.term} className="py-4 border-b border-border">
              <p className="text-sm font-medium text-foreground mb-1">{def.term}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{def.body}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary">Founder: {def.founder}</span>
                <span className="text-[11px] px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Investor: {def.investor}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
