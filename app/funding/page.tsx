"use client"


import { useState } from "react"

function fmt(n: number, type = "dollar"): string {
  if (type === "dollar") {
    if (Math.abs(n) >= 1000000) return "$" + (Math.round(n / 100000) / 10) + "M"
    if (Math.abs(n) >= 1000) return "$" + (Math.round(n / 100) / 10) + "K"
    return "$" + Math.round(n)
  }
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
  { name: "Conservative cap", raise: 150000, cap: 5000000, discount: 0, interest: 5, months: 18, nextVal: 6000000, note: "Higher cap gives investors less ownership but may be harder to justify pre-revenue", yours: false },
  { name: "SAFE structure", raise: 150000, cap: 3000000, discount: 20, interest: 0, months: 18, nextVal: 6000000, note: "No interest, 20% discount. Simpler for F&F but slightly more dilutive at conversion", yours: false },
  { name: "Raise more", raise: 250000, cap: 4000000, discount: 0, interest: 5, months: 18, nextVal: 6000000, note: "Raise $250K at $4M cap. Extends runway but gives away more equity", yours: false },
]

const DEFS = [
  {
    term: "SAFE (Simple Agreement for Future Equity)",
    plain: "You give money today. When the company raises a real funding round, your money turns into shares - at a better price than the new investors pay. No repayment, no deadline, no interest. How good a deal you get depends on three outcomes: (1) Next round is above your cap - cap kicks in, you get more shares per dollar than new investors. This is the good scenario. (2) Next round is at or below your cap - cap does not help, you convert at round price like everyone else. (3) Company never raises a priced round - your SAFE sits indefinitely. No repayment obligation, but no return either. Your money is locked with no path out.",
    body: "The most common early-stage instrument today, used in 90% of pre-seed deals in 2025. A SAFE is not a loan. It has no interest and no maturity date. It converts automatically when the company raises a priced equity round.",
    founder: "Cleanest structure for F&F. No debt on your balance sheet. No deadline pressure. If you never raise again, you owe nothing. Downside: post-money SAFEs lock in investor ownership percentage, which can dilute you more than expected when multiple SAFEs stack.",
    investor: "You get in early at a favorable valuation. No interest, but also no repayment rights if the company fails. Your money is locked until a priced round happens, which could be 12 months or several years.",
    best_for: "Pre-seed, F&F rounds, angels investing under $500K. Gamma's current raise should consider SAFE as an alternative to convertible note.",
  },
  {
    term: "Convertible note",
    plain: "You lend me $10K. Instead of paying you back in cash, when I raise my next big funding round, your loan turns into shares. You earn a little interest while you wait, and you get shares at a better price than the new investors.",
    body: "A convertible note is technically a loan that converts to equity at the next priced round. It carries an interest rate (typically 5-8%), a maturity date (12-24 months), and conversion terms. More legal protections for investors than a SAFE. Gamma's current F&F instrument.",
    founder: "Interest accrues, meaning more dilution at conversion. If you hit the maturity date without raising, investors can demand repayment, which can put the company in a difficult position. Only use if investors specifically require it over a SAFE.",
    investor: "You earn interest while waiting. You have repayment rights as a backstop if the company never raises again. More familiar to traditional investors. The downside: if the company does well, your return is capped by the conversion terms.",
    best_for: "Bridge rounds between priced rounds, investors who want debt protections, F&F investors who are uncomfortable with SAFEs.",
  },
  {
    term: "Priced equity round (Seed, Series A, B...)",
    plain: "The company sets an actual price tag. Investors buy shares at that price. Everyone knows exactly what percentage they own the moment the deal closes. No guessing, no conversion later.",
    body: "A priced round means the company has an agreed valuation. Investors receive preferred shares immediately. Requires a term sheet, investment agreement, and full cap table update. Takes 6-12 weeks to close. This is also when SAFEs and convertible notes convert.",
    founder: "You know exactly what you are giving away. No uncertainty. But you are committing to a valuation. Too high and your next round becomes harder. Too low and you give away too much. Option pool is typically created or expanded here, which dilutes you.",
    investor: "You own shares immediately. Preferred stock comes with protections: liquidation preference, anti-dilution, pro-rata rights. Board seat typically starts at Series A. You can see the full cap table.",
    best_for: "Seed rounds of $500K+, Series A onwards, institutional VCs and lead investors.",
  },
  {
    term: "Revenue-based financing (RBF)",
    plain: "You give me $100K. I pay you back $150K over time, out of my monthly revenue, say 5% of every dollar I bring in until I hit $150K total. No shares, no ownership, just repayment with a premium.",
    body: "RBF is a loan repaid as a fixed percentage of monthly revenue until a total repayment cap is reached, typically 1.5-3x the original amount. The investor gets no equity, only cash repayments. Only works for companies with predictable recurring revenue.",
    founder: "Zero dilution, you keep 100% of your company. But you need revenue to repay, so it is not suitable pre-revenue. The total cost of 1.5-3x repayment is expensive if your valuation is low and equity would be cheaper.",
    investor: "Predictable returns tied to revenue performance. No equity upside if the company becomes a unicorn. Better suited to capital-preservation investors than growth investors.",
    best_for: "Post-revenue SaaS companies with $10K+ MRR. Not suitable for Gamma at current pre-revenue stage.",
  },
  {
    term: "Grants and non-dilutive funding",
    plain: "Free money. No repayment, no equity, no ownership transfer. You apply, you win, you keep it, and 100% of your company stays yours.",
    body: "Government grants, accelerator grants, and R&D tax credits give you capital without giving up equity. Examples include NVIDIA Inception (GPU credits, investor introductions), EU Horizon grants, and Portugal's IAPMEI programs. Non-dilutive funding is always the best money available when accessible.",
    founder: "Apply for everything you qualify for. Zero dilution. The time cost of applications is worth it. NVIDIA Inception is free to apply and takes under two hours.",
    investor: "Not applicable, investors do not participate in grants. But grants on your funding history show resourcefulness and reduce how much equity you need to sell.",
    best_for: "All stages. NVIDIA Inception is the most immediately relevant for Gamma. Apply before raising pre-seed.",
  },
  {
    term: "Valuation cap",
    plain: "Think of it as a price ceiling for early investors. Even if your company is worth $20M by the time you raise your next round, early investors convert as if it is still worth $3M, so they get more shares per dollar than the new investors.",
    body: "The cap protects early investors from being diluted by a high future valuation. It sets the maximum valuation used to calculate their share price at conversion. Lower cap means more dilution for founders.",
    founder: "Your $3M cap is appropriate for a pre-revenue F&F round. At a $6M pre-seed, your F&F investors convert at $3M, getting 2x the shares of new investors. The higher your next round valuation, the more your F&F investors benefit from the cap.",
    investor: "The cap is where you make your money. It locks in a favorable price per share regardless of how high the company's valuation goes at the next round.",
    best_for: "Always included in SAFEs and convertible notes. Critical term to negotiate carefully.",
  },
  {
    term: "Discount rate",
    plain: "A guaranteed price cut at conversion. If new investors pay $1 per share, a 20% discount means you only pay $0.80. It rewards you for writing a check earlier and taking more risk.",
    body: "The discount is applied to the share price at conversion. A 20% discount at a $10 per share priced round means the SAFE or note holder pays $8 per share, getting more shares per dollar than new investors.",
    founder: "Discounts compound with caps. If both are in the agreement, investors get whichever gives them more shares. Standard F&F rounds often include a cap with no discount. Adding a discount on top of a $3M cap increases dilution.",
    investor: "Guarantees a price advantage over new investors regardless of valuation. More valuable when next round valuation is near or below the cap.",
    best_for: "Often omitted in F&F rounds. More common in seed bridge rounds between priced rounds.",
  },
  {
    term: "Liquidation preference",
    plain: "If the company sells or shuts down, preferred investors get their money back first before founders and employees see anything. Think of it as a refund guarantee in bad outcomes.",
    body: "Liquidation preferences determine payout order in an exit or dissolution. 1x non-participating is market standard, meaning investors get their investment back first, then participate in remaining proceeds alongside common shareholders.",
    founder: "1x non-participating is fair and standard. Reject 2x preferences or participating preferred, which can wipe out your return in a modest exit even if the company sold for a reasonable price.",
    investor: "Your downside protection. In a bad exit, you recover your investment before founders see anything. In a great exit, you convert to common stock and share in the full upside.",
    best_for: "Priced equity rounds (Seed, Series A+). Not present in SAFEs or convertible notes.",
  },
  {
    term: "Pro-rata rights",
    plain: "The right to invest again in the next round to keep your ownership percentage the same. You own 5% now. The next round would dilute you to 3%. Pro-rata rights let you write another check to stay at 5%.",
    body: "Pro-rata rights allow investors to maintain their ownership percentage across funding rounds. They are not automatic. Investors must actively exercise them at each subsequent round by writing another check.",
    founder: "Only offer to investors who will actually write follow-on checks. It reserves a slot for them in every future round, which reduces how much you can give to new investors.",
    investor: "Essential for protecting your position over time. Without pro-rata, a 5% F&F stake gets diluted to roughly 2% by Series A. With pro-rata, you can maintain your percentage by investing more.",
    best_for: "Offer to investors writing $25K+ checks. Becomes standard at Seed and Series A.",
  },
  {
    term: "Post-money vs pre-money SAFE",
    plain: "Post-money SAFE: the cap is calculated after your investment converts. You know exactly what percentage you own right away. Pre-money SAFE: the math is done before, so your final percentage depends on how many other SAFEs are also converting, which is harder to predict.",
    body: "YC's current standard SAFE is post-money. It gives investors a fixed ownership percentage at conversion. The difference matters most when multiple SAFEs are stacked.",
    founder: "Post-money SAFEs are slightly more dilutive when you raise multiple SAFEs. If you raise $150K on a $3M post-money SAFE, that investor owns exactly 5% after conversion regardless of what else converts alongside it.",
    investor: "Post-money gives you certainty. You know you own 5% and nothing changes that. Pre-money SAFEs are less predictable, your final percentage depends on the full conversion stack.",
    best_for: "Post-money is the current standard. Use it unless your attorney specifically recommends pre-money for your situation.",
  },
  {
    term: "MFN (Most Favored Nation) clause",
    plain: "If I give better terms to a future investor, say a higher valuation cap or bigger discount, you automatically get those same better terms too. It is a fairness guarantee.",
    body: "An MFN clause means that if the company issues a future SAFE or note with better terms, existing MFN holders automatically upgrade to match those terms.",
    founder: "MFN can create surprises. If you raise your next F&F tranche at a $5M cap, all MFN investors at $3M automatically get the $5M cap. Think carefully before including it in all F&F documents.",
    investor: "Protects against the founder giving better terms to a later investor without your knowledge. A reasonable ask for angels who write checks early.",
    best_for: "Often included in SAFEs for angels investing $25K+. Consider carefully before offering to all F&F investors.",
  },
]

type MetricItem = { label: string; value: string; sub?: string }
type FlagItem = { type: string; text: string }

export default function FundingPage() {
  const [perspective, setPerspective] = useState<"founder" | "investor">("founder")
  const [tab, setTab] = useState<"calculator" | "scenarios" | "definitions" | "playbook">("calculator")
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

  const exitScenarios = [
    { label: "Conservative exit", val: 5000000 },
    { label: "Decent exit", val: 20000000 },
    { label: "Strong exit", val: 50000000 },
    { label: "Unicorn exit", val: 1000000000 },
  ].map(({ label, val }) => ({
    label,
    exitVal: val,
    investorReturn: val * (d.investorOwnership / 100),
    multiple: (val * (d.investorOwnership / 100)) / raise,
  }))

  const founderMetrics: MetricItem[] = [
    { label: "You keep", value: d.founderOwnership.toFixed(3) + "%", sub: "at conversion" },
    { label: "Investor gets", value: d.investorOwnership.toFixed(3) + "%", sub: "of company" },
    { label: "Accrued debt", value: fmt(d.accrued), sub: "at conversion" },
    { label: "Effective cap", value: fmt(d.conversionVal), sub: "conversion val" },
  ]

  const investorMetrics: MetricItem[] = [
    { label: "Ownership", value: d.investorOwnership.toFixed(3) + "%", sub: "at conversion" },
    { label: "Value at next round", value: fmt(d.valueAtNextRound), sub: "on paper" },
    { label: "Paper multiple", value: d.multiple.toFixed(1) + "x", sub: "at next round" },
    { label: "Interest earned", value: fmt(d.accrued - raise), sub: "over " + months + " mo" },
  ]

  const metrics = perspective === "founder" ? founderMetrics : investorMetrics

  const founderFlags: FlagItem[] = [
    ...(d.investorOwnership > 7 ? [{ type: "red", text: "Investors will own " + d.investorOwnership.toFixed(3) + "% at conversion. F&F rounds typically give 5-8% total. Consider raising the cap or reducing the raise amount." }] : []),
    ...(raise / cap > 0.06 ? [{ type: "amber", text: "Raise-to-cap ratio is " + Math.round(raise / cap * 100) + "%. Above 6% signals the cap may be too low relative to raise size." }] : []),
    ...(interest > 6 ? [{ type: "amber", text: "Interest rate of " + interest + "% is above market standard for F&F (5-6%). Every extra point accrues as additional dilution." }] : []),
    ...(nextVal < cap * 1.5 ? [{ type: "amber", text: "Next round valuation is less than 1.5x the cap. Cap protection only benefits investors if the next round is higher than the cap." }] : []),
    ...(d.founderOwnership > 92 ? [{ type: "green", text: "You retain " + d.founderOwnership.toFixed(3) + "% at conversion. Strong founder ownership going into pre-seed." }] : []),
    ...(months <= 12 ? [{ type: "green", text: "Short conversion window of " + months + " months means less interest accrual and faster certainty." }] : []),
  ]

  const investorFlags: FlagItem[] = [
    ...(d.investorOwnership < 3 ? [{ type: "amber", text: "Ownership of " + d.investorOwnership.toFixed(3) + "% is below 3%. May not be material enough to justify the risk." }] : []),
    ...(cap > nextVal ? [{ type: "red", text: "Valuation cap exceeds next round valuation. Cap protection is worthless at these settings." }] : []),
    ...(interest < 5 ? [{ type: "amber", text: "Interest rate of " + interest + "% provides minimal downside protection. Market standard is 5-8%." }] : []),
    ...(d.investorOwnership >= 5 && d.investorOwnership <= 8 ? [{ type: "green", text: "Ownership of " + d.investorOwnership.toFixed(3) + "% is within the typical F&F range of 5-8%. Clean structure." }] : []),
    ...(d.multiple > 1.5 ? [{ type: "green", text: "Paper multiple of " + d.multiple.toFixed(1) + "x at next round valuation. Attractive for a friends and family check." }] : []),
  ]

  const flags = perspective === "founder" ? founderFlags : investorFlags

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Funding strategy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Model your deal from both sides. Pre-loaded with your current F&F round.</p>
      </header>

      <div className="flex rounded-lg border border-border overflow-hidden w-fit mb-6">
        {(["founder", "investor"] as const).map((p) => (
          <button key={p} onClick={() => setPerspective(p)} className={"px-4 py-2 text-xs font-medium transition-colors " + (perspective === p ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted")}>
            {p === "founder" ? "Founder view" : "Investor view"}
          </button>
        ))}
      </div>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        {(["calculator", "scenarios", "definitions", "playbook"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize " + (tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "calculator" && (
        <div className="space-y-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Deal parameters</p>
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              {([
                { label: "Investment amount", display: fmt(raise), min: 10000, max: 500000, step: 5000, value: raise, set: setRaise },
                { label: "Valuation cap", display: fmt(cap), min: 1000000, max: 10000000, step: 100000, value: cap, set: setCap },
                { label: "Discount rate", display: discount + "%", min: 0, max: 30, step: 1, value: discount, set: setDiscount },
                { label: "Interest rate (%/yr)", display: interest + "%", min: 0, max: 10, step: 0.5, value: interest, set: setInterest },
                { label: "Months to conversion", display: months + " mo", min: 6, max: 36, step: 1, value: months, set: setMonths },
                { label: "Next round valuation", display: fmt(nextVal), min: 2000000, max: 20000000, step: 500000, value: nextVal, set: setNextVal },
              ] as { label: string; display: string; min: number; max: number; step: number; value: number; set: (n: number) => void }[]).map(({ label, display, min, max, step, value, set }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground min-w-[160px]">{label}</span>
                  <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className="flex-1" />
                  <span className="text-xs font-medium text-foreground min-w-[56px] text-right">{display}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">{perspective === "founder" ? "Founder outcome" : "Investor outcome"}</p>
            <div className="grid grid-cols-4 gap-3">
              {metrics.map(({ label, value, sub }) => (
                <div key={label} className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                  <p className="text-lg font-medium text-foreground">{value}</p>
                  {sub && <p className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</p>}
                </div>
              ))}
            </div>
          </div>

          {perspective === "investor" && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">How ownership is calculated</p>
            </div>
          )}

          {perspective === "investor" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Your ownership as Gamma grows</p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">This shows how your {fmt(raise)} investment grows in value as Gamma raises each round. Each round dilutes your ownership slightly but increases the company valuation. Industry medians sourced from Carta, PitchBook, and Crunchbase 2026.</p>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="grid grid-cols-5 gap-2 pb-2 mb-2 border-b border-border">
                    {["Stage", "Gamma target", "Industry median", "Your ownership", "Stake value"].map((h) => (
                      <p key={h} className="text-[11px] text-muted-foreground font-medium">{h}</p>
                    ))}
                  </div>
                  {[
                    { stage: "F&F (now)", gammaVal: cap, industry: "No standard. $2M-$5M typical", ownership: d.investorOwnership, note: "You invest today" },
                    { stage: "Pre-seed", gammaVal: 8000000, industry: "Median $7.7M (PitchBook Q3 2025)", ownership: d.investorOwnership * 0.87, note: "13% dilution" },
                    { stage: "Seed", gammaVal: 16000000, industry: "Median $16M pre-money (Carta 2025)", ownership: d.investorOwnership * 0.87 * 0.80, note: "20% dilution" },
                    { stage: "Series A", gammaVal: 45000000, industry: "Median $47.9M pre-money (Carta 2025)", ownership: d.investorOwnership * 0.87 * 0.80 * 0.78, note: "22% dilution" },
                  ].map(({ stage, gammaVal, industry, ownership }) => (
                    <div key={stage} className="grid grid-cols-5 gap-2 py-2.5 border-b border-border last:border-0 items-start">
                      <p className="text-xs font-medium text-foreground">{stage}</p>
                      <p className="text-xs text-foreground">{fmt(gammaVal)}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{industry}</p>
                      <p className="text-xs font-medium text-foreground">{ownership.toFixed(4)}%</p>
                      <p className={"text-xs font-medium " + (gammaVal * ownership / 100 > raise ? "text-green-700 dark:text-green-400" : "text-foreground")}>{fmt(gammaVal * ownership / 100)}</p>
                    </div>
                  ))}
                  <p className="text-[11px] text-muted-foreground/60 mt-3">Stake value = your ownership % x company valuation at that stage. Dilution figures are industry medians.</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">What you get at exit</p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Exit value is the total price someone pays to acquire Gamma or its market cap if Gamma goes public. Can happen at any stage. Your return is your ownership at that point multiplied by the total exit price.</p>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="grid grid-cols-4 gap-2 pb-2 mb-2 border-b border-border">
                    {["Scenario", "Exit value", "Your return", "Multiple"].map((h) => (
                      <p key={h} className="text-[11px] text-muted-foreground font-medium">{h}</p>
                    ))}
                  </div>
                  {exitScenarios.map(({ label, exitVal, investorReturn, multiple }) => (
                    <div key={label} className="grid grid-cols-4 gap-2 py-2 border-b border-border last:border-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xs text-foreground">{fmt(exitVal)}</p>
                      <p className={"text-xs font-medium " + (multiple >= 5 ? "text-green-700 dark:text-green-400" : "text-foreground")}>{fmt(investorReturn)}</p>
                      <p className={"text-xs font-medium " + (multiple >= 10 ? "text-green-700 dark:text-green-400" : multiple < 1 ? "text-destructive" : "text-foreground")}>{multiple.toFixed(2)}x</p>
                    </div>
                  ))}
                  <p className="text-[11px] text-muted-foreground/60 mt-3">Based on {d.investorOwnership.toFixed(4)}% ownership at F&F conversion. Does not account for dilution from rounds after Series A.</p>
                </div>
              </div>
            </div>
          )}

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
                {flags.map((f, i) => (
                  <div key={i} className={"p-3 rounded-lg text-xs leading-relaxed " + (f.type === "red" ? "bg-destructive/10 text-destructive" : f.type === "green" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200")}>
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
            const founderItems: MetricItem[] = [
              { label: "You keep", value: sd.founderOwnership.toFixed(3) + "%" },
              { label: "Investors get", value: sd.investorOwnership.toFixed(3) + "%" },
              { label: "Accrued", value: fmt(sd.accrued) },
              { label: "Raise", value: fmt(s.raise) },
            ]
            const investorItems: MetricItem[] = [
              { label: "Ownership", value: sd.investorOwnership.toFixed(3) + "%" },
              { label: "Multiple", value: sd.multiple.toFixed(1) + "x" },
              { label: "Interest", value: fmt(sd.accrued - s.raise) },
              { label: "Risk", value: s.discount > 0 ? "Low" : "Med" },
            ]
            const items = perspective === "founder" ? founderItems : investorItems
            return (
              <div key={s.name} className={"rounded-xl border bg-card p-5 " + (s.yours ? "border-primary" : "border-border")} style={s.yours ? { borderWidth: "2px" } : {}}>
                {s.yours && <p className="text-[11px] font-medium text-primary mb-1">Your current deal</p>}
                <p className="text-sm font-medium text-foreground mb-1">{s.name}</p>
                <p className="text-xs text-muted-foreground mb-4">{s.note}</p>
                <div className="grid grid-cols-4 gap-2">
                  {items.map(({ label, value }) => (
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
        <div>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Plain English explanations of every funding instrument and term. Each entry shows what it means for you as the founder and what it means for your investor.</p>
          <div className="space-y-0">
            {DEFS.map((def) => (
              <div key={def.term} className="py-6 border-b border-border">
                <p className="text-sm font-medium text-foreground mb-3">{def.term}</p>
                <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-4">
                  <p className="text-xs text-foreground/90 leading-relaxed">{def.plain}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{def.body}</p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-medium text-primary shrink-0 min-w-[52px] mt-0.5">Founder</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{def.founder}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-medium text-green-700 dark:text-green-400 shrink-0 min-w-[52px] mt-0.5">Investor</span>
                    <span className="text-xs text-muted-foreground leading-relaxed">{def.investor}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[11px] text-muted-foreground/60 shrink-0 mt-0.5">Best for</span>
                  <span className="text-[11px] text-muted-foreground leading-relaxed">{def.best_for}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "playbook" && (
        <div className="space-y-10">
          <p className="text-xs text-muted-foreground">Playbook content loading...</p>
        </div>
      )}

      {tab === "playbook" && (
        <div className="space-y-10">

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">What closing means</p>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">August 1 is your close date. Closing means every investor has signed, wired, and is on your cap table. Verbal yes does not count. Signed but no wire does not count.</p>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {[
                { step: "1", title: "Document sent", body: "Send the signed SAFE or convertible note to the investor. Have it ready before any conversation so you can send within 24 hours of a verbal yes." },
                { step: "2", title: "Investor countersigns", body: "They sign and return. Nothing is closed until this happens regardless of what they said verbally. Send a reminder after 48 hours if you have not heard back." },
                { step: "3", title: "Wire received", body: "Money lands in LifeInk Neuro LLC's Delaware bank account. Signed document with no wire is not closed. Send wire instructions with the document." },
                { step: "4", title: "Confirmation sent", body: "Send a brief email acknowledging receipt and welcoming them as an investor. Keep it short and warm." },
                { step: "5", title: "Cap table updated", body: "Add investor name, amount, instrument type, and date immediately. Do not wait until all investors are in." },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-4 p-4">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-[11px] font-medium flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                { type: "red", text: "India wire (uncle $25K): Start compliance review now. International wires from India to a US LLC take 2-3 weeks minimum with AML and KYC checks. If you wait until mid-July you will miss August 1." },
                { type: "amber", text: "Verbal yes is not a close. Send the document within 24 hours of a verbal yes to keep momentum. One warm follow-up if they go quiet, then move on." },
                { type: "green", text: "Lawyer stall prevention: Send the SAFE before the call. This is the YC standard 5-page template used by thousands of startups. When it is normalized upfront the pause usually does not happen." },
              ].map((f, i) => (
                <div key={i} className={"p-3 rounded-lg text-xs leading-relaxed " + (f.type === "red" ? "bg-destructive/10 text-destructive" : f.type === "green" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200")}>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Investor readiness checklist</p>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">Everything you need ready before an investor says yes.</p>
            <div className="space-y-6">
              {[
                {
                  section: "Documents to have ready",
                  items: [
                    "Signed SAFE or convertible note template (YC standard, filled with your terms: $3M cap, 5% interest, August 1 close, LifeInk Neuro LLC as issuer)",
                    "One-pager: what Gamma does, traction to date, ask ($150K at $3M cap), close date August 1, your contact",
                    "Pitch deck with verified numbers only",
                    "LifeInk Neuro LLC bank account details and wire instructions",
                    "Cap table showing current state (100% Nisha, pre-investment)",
                  ]
                },
                {
                  section: "Answers to have ready",
                  items: [
                    "What is the money for? Phase 2 study completion, 12-month runway, infrastructure. Be specific.",
                    "When will you raise again? Pre-seed target after Phase 2 data, late 2026 or early 2027.",
                    "What happens if you never raise a priced round? Convertible note: maturity date forces resolution. SAFE: sits indefinitely, no repayment obligation, no return for investor.",
                    "What is your exit path? Consumer app acquisition target, B2B licensing, or IPO if dataset scales.",
                  ]
                },
                {
                  section: "What to ask each investor",
                  items: [
                    "What instrument do you prefer - SAFE or convertible note? Never push one over the other.",
                    "What check size are you comfortable with?",
                    "Do you want pro-rata rights to invest in future rounds?",
                    "Any questions about the terms before I send the document?",
                    "What is your expected timeline to wire once you sign?",
                  ]
                },
              ].map(({ section, items }) => (
                <div key={section}>
                  <p className="text-xs font-medium text-foreground mb-3">{section}</p>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="size-4 rounded border border-border bg-background shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Ed's guidance</p>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">Practical F&F advice from Ed Kang, your Startups.com advisor.</p>
            <div className="space-y-3">
              {[
                { label: "On close date", text: "Set it at 60 days from first outreach. I am closing August 1 because the study starts mid-August is honest and specific. Put the date in the one-pager." },
                { label: "On instrument choice", text: "Never push one instrument over another. Ask what the investor wants. If they have no preference, explain both. Ed prefers convertibles for F&F for investor protection reasons but institutional investors are fine with SAFEs." },
                { label: "On lawyer stall", text: "Send the SAFE before the call with a note: this is the YC standard 5-page template used by thousands of startups. Happy to connect you with my attorney if helpful." },
                { label: "On verbal yes going quiet", text: "Treat verbal interest as a signal, not a close. One warm follow-up if someone goes quiet, then move on. The relationship is worth more than the check." },
                { label: "On explaining the SAFE", text: "One sentence: You are giving me $10K today. When Gamma raises its next priced round, you get shares at a discount to what those investors pay, based on a $3M cap." },
                { label: "On closing cleanly", text: "A clean F&F round stops looking like a cap table risk and starts looking like founder conviction once you show up with paying customers and closed notes on clear terms." },
                { label: "On financials pre-revenue", text: "Never include financials when you have no revenue. But have a 3-year model ready for due diligence showing revenue, CAC, LTV, and path to $20K MRR. One page but be ready to back it up." },
                { label: "On social yes vs real yes", text: "People say yes in a social context because saying no to a friend is uncomfortable. Give explicit permission to decline upfront: I completely understand if the timing or risk level is not right. It feels counterintuitive but improves your close rate." },
              ].map(({ label, text }) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-[11px] font-medium text-primary mb-1.5">{label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </main>
  )
}
