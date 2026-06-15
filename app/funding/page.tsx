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
  // FUNDING STAGES
  {
    category: "Funding stages",
    term: "FFF - Friends, Family and Fools",
    plain: "The very first people who give you money. They invest because they trust you personally, not because they have evaluated your business. Called fools because investing this early is so risky that only someone who loves you or believes in you blindly would do it.",
    body: "The informal round before any formal fundraising. No standard terms, no institutional investors. Pure personal trust.",
    founder: "Your F&F round is technically FFF. The people writing checks know you, not the business.",
    investor: "You are investing in a person and a vision, not a proven business. Highest risk, highest potential return.",
    best_for: "First $10K-$250K before any external validation.",
  },
  {
    category: "Funding stages",
    term: "Pre-seed",
    plain: "The first time a stranger invests in your company. They are not your friend or family. They are a professional investor or angel who believes in your idea early. Usually happens before you have paying customers.",
    body: "First institutional or angel money. Typically $250K-$2M on a SAFE. Investors are betting on the founder and the problem, not revenue. Median valuation cap $7.7M (PitchBook Q3 2025).",
    founder: "This is where Gamma is headed after F&F closes. Gate: Phase 2 data showing R2 > 0.3 and app live with paying users.",
    investor: "Higher risk than seed but better entry price. You are buying conviction before the market prices it in.",
    best_for: "Pre-revenue startups with validated problem and working prototype.",
  },
  {
    category: "Funding stages",
    term: "Seed",
    plain: "The first significant round from professional investors. By this point you usually have some customers and proof the product works. Think of it as the round that funds you to find product market fit.",
    body: "Typically $2M-$5M priced equity round. Median pre-money $16M (Carta 2025). Median raise $4M. Investors want early revenue ($5K-$50K MRR), real users, and retention data.",
    founder: "Gamma seed round is gated on $20K MRR milestone. Target mid-2027.",
    investor: "First priced round. You get preferred stock with liquidation preferences. More protection than a SAFE.",
    best_for: "Companies with early revenue, proven retention, and clear growth path.",
  },
  {
    category: "Funding stages",
    term: "Series A, B, C",
    plain: "Each letter represents a bigger round as the company grows. Series A is when you have proven the business works and need money to scale it. Series B is when you are scaling fast. Series C is when you are big and preparing for an exit or IPO.",
    body: "Series A median $47.9M pre-money, $12M raise (Carta 2025). Requires $1M-$3M ARR, repeatable growth, clear GTM. Series B median $118.9M. Series C+ leads toward IPO or acquisition.",
    founder: "Series A for Gamma is targeted 2028-2029, gated on $1M ARR and B2B deal signed.",
    investor: "Full due diligence, board representation, anti-dilution, pro-rata rights. These are institutional rounds.",
    best_for: "Companies with proven product market fit scaling revenue.",
  },
  // INSTRUMENTS
  {
    category: "Instruments",
    term: "SAFE - Simple Agreement for Future Equity",
    plain: "Not a loan. Not shares. A promise. Someone gives you money today and you promise them shares later when you raise a real priced round. Simple, fast, no interest, no repayment deadline. Like a voucher for future ownership.",
    body: "Created by YC in 2013. Now used in 92% of pre-priced rounds (Carta Q3 2025). Converts automatically at next priced round. Post-money SAFE gives investor a fixed ownership percentage at conversion.",
    founder: "Cleanest F&F instrument. No debt, no deadline, no pressure. If you never raise again you owe nothing.",
    investor: "No repayment rights if company fails to raise. Money is locked until a priced round happens. No interest.",
    best_for: "Pre-seed and F&F rounds under $500K.",
  },
  {
    category: "Instruments",
    term: "CN - Convertible Note",
    plain: "Similar to a SAFE but structured as a loan first. It has an interest rate, a repayment deadline called a maturity date, and converts to shares when you raise a priced round. Slightly more protection for the investor because if the company never raises again, they can ask for their money back.",
    body: "Has interest (typically 5-8%), maturity date (12-24 months), valuation cap and/or discount. Technically debt until conversion. Gamma's current F&F instrument.",
    founder: "Interest accrues as additional dilution. Maturity date creates a hard deadline. More investor-protective than SAFE.",
    investor: "Repayment rights if no priced round by maturity date. Interest accrues to your benefit. More protection than a SAFE.",
    best_for: "F&F investors who want debt protections or are uncomfortable with SAFEs.",
  },
  {
    category: "Instruments",
    term: "MFN - Most Favored Nation",
    plain: "A protection clause for early investors. It says: if you give any future investor better terms than you gave me, I automatically get those better terms too. Protects early believers from being disadvantaged by later deals.",
    body: "If a future SAFE or note has a higher cap or bigger discount, MFN holders automatically upgrade to match. Common in SAFEs.",
    founder: "Can create surprises. If you raise a future tranche at a $5M cap, all MFN investors at $3M automatically get $5M. Think carefully before offering to all F&F investors.",
    investor: "Protects against founder giving better terms to a later investor without your knowledge.",
    best_for: "Angels investing $25K+. Consider carefully before offering to all F&F investors.",
  },
  {
    category: "Instruments",
    term: "Pro-rata rights",
    plain: "The right to invest in your next round to avoid getting diluted. If an investor owns 5% of your company today and you raise more money, their 5% shrinks unless they put in more money. Pro-rata gives them the right to invest enough to keep their percentage the same.",
    body: "Not automatic. Must be exercised at each round. Without pro-rata, a 5% F&F stake dilutes to roughly 2% by Series A.",
    founder: "Only offer to investors who will actually write follow-on checks. Reserves a slot in every future round.",
    investor: "Essential for protecting your position long term. Critical at seed and Series A.",
    best_for: "Investors writing $25K+ checks. Standard at seed and Series A.",
  },
  // CAP TABLE
  {
    category: "Cap table",
    term: "LP - Limited Partner",
    plain: "A passive investor in a venture fund. They put money into the fund but do not make decisions about which companies to invest in. Think of them as silent backers.",
    body: "LPs provide the capital that VCs invest. Pension funds, university endowments, family offices, and wealthy individuals are common LPs.",
    founder: "You will not interact with LPs directly. They are behind the VC you are pitching.",
    investor: "If you invest via a VC fund rather than personally, you are an LP in that fund.",
    best_for: "Understanding where VC money comes from.",
  },
  {
    category: "Cap table",
    term: "GP - General Partner",
    plain: "The person who runs the venture fund and decides which startups to invest in. They manage the LP money and take a percentage of profits.",
    body: "GPs typically earn 2% management fee annually and 20% carried interest (profit share). When a VC gives you a term sheet, the GP is the person signing it.",
    founder: "You pitch the GP. They decide whether to invest. Build a relationship with the GP, not just the associate.",
    investor: "If you are investing personally as an angel, you are acting as your own GP.",
    best_for: "Understanding VC fund structure.",
  },
  {
    category: "Cap table",
    term: "SPV - Special Purpose Vehicle",
    plain: "A way to group multiple small investors into one single line on your cap table. Instead of having 20 individual investors each with their own row, an SPV combines them all into one entity. Keeps your cap table clean.",
    body: "Useful when you have many small F&F investors. One entity holds all their stakes. Reduces cap table complexity for future investors.",
    founder: "Consider an SPV if you have more than 5-7 F&F investors. Carta and AngelList both offer SPV tools.",
    investor: "You invest through the SPV entity. Less direct relationship with the company but same economic rights.",
    best_for: "Rounds with many small investors ($5K-$25K checks).",
  },
  {
    category: "Cap table",
    term: "ESOP - Employee Stock Option Pool",
    plain: "Shares set aside to give to employees as part of their compensation. When an employee joins a startup they often get options, the right to buy shares at a fixed price in the future. This is how startups attract talent without paying high salaries.",
    body: "Typically 10-15% of shares. Created before or during a priced round. Dilutes founders before the round closes. Requires a 409A valuation to set a legal strike price.",
    founder: "You will need to create an option pool before hiring your technical co-founder on equity. No 409A needed until then.",
    investor: "Option pool creation dilutes you too. Negotiate it to be sized for actual near-term hiring, not arbitrarily large.",
    best_for: "Any company hiring employees who will receive equity compensation.",
  },
  // VALUATION
  {
    category: "Valuation",
    term: "Pre-money valuation",
    plain: "What the company is worth before new investment comes in. If your pre-money valuation is $5M and an investor puts in $500K, the company is now worth $5.5M post-money.",
    body: "Used in priced rounds. The valuation cap on a SAFE or convertible note functions similarly to a pre-money cap but is not exactly the same thing.",
    founder: "Your $3M cap is not technically a pre-money valuation - it is the maximum conversion price. At pre-seed, you will negotiate an actual pre-money valuation for the first time.",
    investor: "Lower pre-money = more ownership for the same check size. Your cap protects you by setting a ceiling on the conversion price.",
    best_for: "Understanding what you are buying into at any priced round.",
  },
  {
    category: "Valuation",
    term: "Post-money valuation",
    plain: "What the company is worth after new investment is included. Your $3M valuation cap is a post-money cap, meaning $3M includes the money being invested.",
    body: "Post-money = pre-money + investment amount. YC standard SAFEs use post-money caps which gives investors a fixed ownership percentage at conversion.",
    founder: "Post-money SAFE at $3M cap means your F&F investors collectively own $150K/$3M = 5% after conversion. Clear and predictable.",
    investor: "Post-money cap means you know exactly what % you own at conversion. No surprises from other SAFEs stacking.",
    best_for: "Post-money is the current standard for SAFEs. Used in all YC standard documents.",
  },
  {
    category: "Valuation",
    term: "Dilution",
    plain: "When new shares are created and your ownership percentage shrinks. If you own 100% of a company and you sell 10% to an investor, you are now diluted to 90%. Every time you raise money you get diluted.",
    body: "Dilution happens at every round. F&F: ~5%. Pre-seed: 10-15%. Seed: ~20%. Series A: ~22%. By Series A, a founder who started at 100% may own 50-60%.",
    founder: "Dilution is the cost of capital. The goal is to make each round's dilution worth more than it costs - by raising your valuation faster than your ownership shrinks.",
    investor: "Your ownership also gets diluted at every subsequent round unless you exercise pro-rata rights.",
    best_for: "Understanding the long-term cost of every check you accept.",
  },
  // DUE DILIGENCE
  {
    category: "Due diligence",
    term: "DD - Due Diligence",
    plain: "The process an investor goes through to verify everything you have told them before writing a check. They check your financials, your legal documents, your product, your team, and your claims. Think of it as a background check on your company.",
    body: "At F&F stage, due diligence is minimal - investors rely on personal trust. At seed it is moderate - financials, product demo, customer calls. At Series A it is full - legal audit, financial audit, customer interviews, technical review.",
    founder: "Prepare a simple data room before F&F closes: cap table, signed documents, one-pager, and financial model. Do not wait for investors to ask.",
    investor: "At F&F stage, your due diligence is the founder's character and the problem's reality. Ask to see the product and talk to one customer.",
    best_for: "Every stage. The depth increases with check size.",
  },
  {
    category: "Due diligence",
    term: "Term Sheet",
    plain: "A short document that outlines the key terms of an investment before the full legal documents are drafted. It is usually non-binding but sets the framework for the deal. Think of it as the outline before the full contract.",
    body: "Used in priced rounds (Seed, Series A+). Not used in SAFE or convertible note rounds. Key terms: pre-money valuation, investment amount, liquidation preference, anti-dilution, board composition.",
    founder: "Never accept a term sheet without an attorney reviewing it. The terms set in the term sheet become the deal.",
    investor: "The term sheet is where you negotiate. Once signed, founders expect you to close on those terms.",
    best_for: "Seed rounds and above.",
  },
  {
    category: "Due diligence",
    term: "NDA - Non Disclosure Agreement",
    plain: "A legal document where someone promises not to share your confidential information. At early stage most investors will not sign an NDA before hearing your pitch because they see hundreds of pitches and cannot risk being locked out of similar companies.",
    body: "Do not ask VCs or angels to sign NDAs before pitching. It signals inexperience. Your algorithm and data are protected as trade secrets, not by NDA.",
    founder: "NDA is appropriate for employees, contractors like Mia, and anyone who sees your algorithm or source code. Not for investors hearing a pitch.",
    investor: "You will not be asked to sign an NDA at F&F stage. If asked, that is a yellow flag about founder sophistication.",
    best_for: "Employees, contractors, and technical partners - not pitch conversations.",
  },
  // EXIT
  {
    category: "Exit",
    term: "Liquidity event",
    plain: "Any event that turns your equity into actual cash. An IPO is a liquidity event. An acquisition is a liquidity event. Until one of these happens, your shares are just paper. This is why F&F investors cannot cash out whenever they want. They have to wait.",
    body: "Average time from first funding to liquidity event is 8-12 years. F&F investors are the last to invest and the last to get liquid. The upside is the entry price is lowest.",
    founder: "Be honest with F&F investors: their money is locked for 5-10 years. No exceptions unless a secondary sale opportunity arises.",
    investor: "You cannot exit whenever you want. Your only exit paths are: acquisition, IPO, secondary sale (rare at F&F), or company buyback (very rare).",
    best_for: "Understanding the full timeline of a startup investment.",
  },
  {
    category: "Exit",
    term: "IPO - Initial Public Offering",
    plain: "When a private company sells shares to the general public on a stock exchange for the first time. This is how early investors and founders eventually cash out. Think of it as the company graduating from private to public.",
    body: "Rare outcome. Less than 1% of startups IPO. Requires $100M+ ARR, consistent growth, and institutional investor demand. After IPO, early investors face a lockup period (typically 180 days) before they can sell.",
    founder: "Not a near-term consideration for Gamma. Focus on acquisition as the more realistic exit path.",
    investor: "If Gamma IPOs, you cannot sell immediately. 180-day lockup applies. But a $1B IPO on a $3M F&F cap generates extraordinary returns.",
    best_for: "Understanding the highest-upside but least-likely exit path.",
  },
  {
    category: "Exit",
    term: "M&A - Mergers and Acquisitions",
    plain: "When one company buys another or two companies combine. For a startup this is usually an acquisition - a larger company buying you. This is one of the most common exit paths for early stage companies.",
    body: "Most likely exit path for Gamma. Strategic acquirers include Oura, Apple, Whoop, Garmin - all have wearable interests and no cognitive performance layer. Acquiring Gamma is faster and cheaper than building the dataset from scratch.",
    founder: "Build toward acquisition by making Gamma strategically valuable to at least 3-4 potential acquirers. The dataset is the asset.",
    investor: "In an acquisition, you get paid based on your ownership percentage after liquidation preferences are satisfied. F&F investors get their money back first, then share in remaining proceeds.",
    best_for: "Most likely exit for early stage startups. Typical timeline 5-8 years from first funding.",
  },
  {
    category: "Exit",
    term: "Acquihire",
    plain: "When a company buys a startup primarily to hire its team rather than for the product or technology. The product may be shut down but the people are absorbed into the acquiring company.",
    body: "Common outcome when product has not scaled but team is strong. Returns are typically low - enough to return investor capital but not generate significant multiples.",
    founder: "Not the goal. Build toward product acquisition, not acquihire. The algorithm and dataset are what make Gamma acquisition-valuable.",
    investor: "Acquihire returns are often 1-2x at best. Not the outcome you are investing for.",
    best_for: "Understanding downside scenarios.",
  },
]


type MetricItem = { label: string; value: string; sub?: string }
type FlagItem = { type: string; text: string }

export default function FundingPage() {
  const [perspective, setPerspective] = useState<"founder" | "investor">("founder")
  const [tab, setTab] = useState<"calculator" | "scenarios" | "definitions" | "playbook" | "financials">("calculator")
  const [instrument, setInstrument] = useState<"note" | "safe">("note")
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

  // Dynamic instrument T&C. Live slider values are baked into each answer so the
  // plain-English explanation always reflects the current deal on screen.
  const accruedInterest = d.accrued - raise
  const safeOwnership = (raise / cap) * 100
  const pctI = d.investorOwnership.toFixed(2) + "%"
  const pctS = safeOwnership.toFixed(2) + "%"

  type Term = { q: string; when: string; a: string; founder: string; investor: string }

  const noteTerms: Term[] = [
    {
      q: "What happens at maturity?",
      when: `Gamma has not raised a priced round by month ${months}.`,
      a: `If no round in ${months} months, the investor can demand ${fmt(d.accrued)} back.`,
      founder: `Raise or owe ${fmt(d.accrued)}`,
      investor: `Safety valve, not a plan`,
    },
    {
      q: "What happens to the interest?",
      when: `At every point from now until conversion or repayment.`,
      a: `Interest accrues at ${interest}%/yr, adding ${fmt(accruedInterest)} over ${months} months.`,
      founder: `Extra dilution, not cash`,
      investor: `More shares at conversion`,
    },
    {
      q: "What happens to your equity?",
      when: `Gamma raises its next priced round at any valuation.`,
      a: `Your ${fmt(d.accrued)} converts to about ${pctI} at the ${fmt(cap)} cap.`,
      founder: `Debt becomes ~${pctI} equity`,
      investor: `Cap locks in ~${pctI}`,
    },
    {
      q: "When does the founder pay back?",
      when: `You are deciding whether to invest in a note vs a SAFE.`,
      a: `Only if ${months} months pass with no round, otherwise never.`,
      founder: `Almost never repaid`,
      investor: `Backstop, not your return`,
    },
    {
      q: "What happens in a down round?",
      when: `Gamma's next round prices below the ${fmt(cap)} cap.`,
      a: `You convert at the ${fmt(cap)} cap or the round price, whichever is lower.`,
      founder: `You absorb the dilution`,
      investor: `Protected, never worse than cap`,
    },
    {
      q: "What if the company shuts down?",
      when: `Gamma winds down before raising a priced round.`,
      a: `Note holders are paid after secured creditors, before shareholders.`,
      founder: `Ranks ahead of your equity`,
      investor: `Above equity, behind banks`,
    },
  ]

  const safeTerms: Term[] = [
    {
      q: "What happens if no priced round ever happens?",
      when: `Gamma never raises institutional money.`,
      a: `No maturity date - your ${fmt(raise)} stays locked as a promise of future shares with no deadline and no repayment.`,
      founder: `no debt, but no deadline either`,
      investor: `money frozen until a round happens`,
    },
    {
      q: "What happens to your equity?",
      when: `Gamma raises its next priced round at any valuation.`,
      a: `Your ${fmt(raise)} converts to ${pctS} of the company at the ${fmt(cap)} post-money cap, fixed regardless of the next round price.`,
      founder: `${pctS} - clean, no surprises`,
      investor: `your slice is locked in now`,
    },
    {
      q: "When does the founder pay it back?",
      when: `You are comparing a SAFE to a convertible note.`,
      a: `Never. A SAFE is not a loan - no repayment obligation under any circumstances.`,
      founder: `zero repayment risk, ever`,
      investor: `cash back is not your return path`,
    },
    {
      q: "What happens in a down round?",
      when: `Gamma's next round prices below the ${fmt(cap)} cap.`,
      a: `Your SAFE converts at the ${fmt(cap)} cap regardless - giving you more shares than new investors if the round prices lower.`,
      founder: `more dilution in a down round`,
      investor: `down round works in your favor`,
    },
    {
      q: "What happens if the company shuts down?",
      when: `Gamma winds down before raising a priced round.`,
      a: `SAFE holders are not creditors - you stand with equity and almost always recover nothing in a shutdown.`,
      founder: `no creditor claim against you`,
      investor: `no debt claim - shutdown returns zero`,
    },
  ]

  const instrumentTerms = instrument === "note" ? noteTerms : safeTerms

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
        {(["calculator", "scenarios", "definitions", "playbook", "financials"] as const).map((t) => (
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
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Instrument terms</p>
              <div className="flex rounded-lg border border-border overflow-hidden">
                {([
                  { id: "note", label: "Convertible Note" },
                  { id: "safe", label: "SAFE" },
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setInstrument(opt.id)}
                    className={"px-3 py-1.5 text-xs font-medium transition-colors " + (instrument === opt.id ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {instrument === "note"
                ? "A convertible note is a loan that turns into shares. It has interest and a maturity date. The answers below reflect your current sliders."
                : "A SAFE is a promise of future shares, no loan, no interest, no deadline. The answers below reflect your current sliders."}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {instrumentTerms.map((t) => (
                <div key={t.q} className="rounded-xl border border-border bg-card p-4 flex flex-col">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{t.q}</p>
                  <p className="text-[11px] italic text-muted-foreground/70 leading-snug mb-2">When this matters: {t.when}</p>
                  <p className="text-sm text-foreground leading-snug mb-3 flex-1">{t.a}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] leading-none text-primary">
                      <span className="font-semibold">Founder</span>
                      <span className="opacity-80">{t.founder}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] leading-none text-green-700 dark:text-green-400">
                      <span className="font-semibold">Investor</span>
                      <span className="opacity-80">{t.investor}</span>
                    </span>
                  </div>
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
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">What this investment funds</p>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">The F&F round is raising {fmt(150000)} total. Here is exactly what that capital goes toward, what it unlocks, and what it does not cover.</p>
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Funded by this round</p>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">The F&F round gets Gamma to pre-seed readiness. One milestone: Phase 2 complete, app live, first paying users.</p>
                  <div className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
                    {[
                      { category: "Phase 2 study", items: ["30 participants across 2 cohorts", "15 Muse 2 devices (shipped to Murcia)", "Participant compensation: EUR 3 x 2,520 sessions = EUR 7,560", "Mia Micevska: Phase 2 protocol execution and M2 model analysis"], amount: "$27K", pct: "18%" },
                      { category: "Product development", items: ["iOS App Store submission and launch - October 2026", "Delete Account flow (Apple 5.1.1v requirement)", "StoreKit paywall integration", "BLE reset bug fix for back-to-back sessions", "Backend scaling for volunteer data load"], amount: "$25K", pct: "17%" },
                      { category: "Go-to-market", items: ["Waitlist activation and founding 100 cohort", "Community seeding in Lisbon coworking spaces", "App Store acquisition - $15 CPA target", "Muse affiliate program (10% commission via choosemuse.com)"], amount: "$15K", pct: "10%" },
                      { category: "Operations and runway", items: ["12-month operating burn at EUR 700/month", "Railway infrastructure, SendGrid, Apple Developer", "Legal fees: note templates, IP assignment, attorney review"], amount: "$13K", pct: "9%" },
                      { category: "Continued research reserve", items: ["Bridge funding to pre-seed close", "M2 model development post Phase 2", "Signal processing improvements and algorithm iteration", "Unexpected study costs and contingency"], amount: "$70K", pct: "46%" },
                    ].map(({ category, items, amount, pct }) => (
                      <div key={category} className="p-4 bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-foreground">{category}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">{pct}</span>
                            <span className="text-xs font-medium text-foreground">{amount}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <span className="size-1 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" />
                              <p className="text-[11px] text-muted-foreground leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-muted/50 flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground">Total F&F raise</p>
                      <p className="text-xs font-medium text-foreground">$150K</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-medium text-foreground mb-2">What it unlocks</p>
                  <div className="space-y-1.5">
                    {[
                      "M2 model trained on 30-person cohort data - cross-person generalization test",
                      "First paying consumer app users - October 2026 launch",
                      "Pre-seed raise eligibility - gated on Phase 2 R2 > 0.3 and app live",
                      "B2B licensing conversations - contingent on Phase 2 validation",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-green-600 shrink-0 mt-1.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-medium text-foreground mb-2">Not covered by this round</p>
                  <div className="space-y-1.5">
                    {[
                      "Technical co-founder salary - funded at pre-seed",
                      "Marketing spend and paid acquisition - funded at pre-seed",
                      "Full legal fees for pre-seed round - funded at pre-seed",
                      "Clinical validation or regulatory approval - Series A and beyond",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Plain English. Every term you will encounter from F&F to exit. Grouped by topic.</p>
          {["Funding stages", "Instruments", "Cap table", "Valuation", "Due diligence", "Exit"].map((category) => (
            <div key={category} className="mb-8">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border">{category}</p>
              <div className="space-y-0">
                {DEFS.filter((d) => d.category === category).map((def) => (
                  <div key={def.term} className="py-5 border-b border-border last:border-0">
                    <p className="text-sm font-medium text-foreground mb-3">{def.term}</p>
                    <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-3">
                      <p className="text-xs text-foreground/90 leading-relaxed">{def.plain}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{def.body}</p>
                    <div className="space-y-2 mb-2">
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
          ))}
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

      {tab === "financials" && (
        <div className="space-y-10">
          <p className="text-xs text-muted-foreground leading-relaxed">Verified, locked figures. Exact numbers, no rounding, no estimates. Year 1 begins April 2027, Year 2 begins April 2028.</p>

          {/* 1. Revenue model */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">1. Revenue model</p>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {[
                { label: "Subscription price", value: "$9.99 / month", sub: "Single tier, per subscriber" },
                { label: "COGS Year 1", value: "33%", sub: "App Store 30% + infrastructure 3%" },
                { label: "COGS Year 2", value: "30%", sub: "Retained subscribers qualify for 15% App Store fee after 12 months" },
                { label: "Gross margin Year 1", value: "67%", sub: "" },
                { label: "Gross margin Year 2", value: "70%", sub: "" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-xs font-medium text-foreground">{label}</p>
                    {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{sub}</p>}
                  </div>
                  <p className="text-sm font-medium text-foreground shrink-0">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Monthly expenses */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">2. Monthly expenses</p>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {[
                { label: "Founder salary", value: "$4,000 / mo", sub: "" },
                { label: "Technical contractor", value: "$3,000 / mo", sub: "" },
                { label: "Mia consulting", value: "$559 / mo", sub: "$26/hr x 5hrs/week x 4.3 weeks" },
                { label: "People total", value: "$7,559 / mo", sub: "$90,708 / year", strong: true },
                { label: "Operations", value: "$1,062 / mo", sub: "Legal, LLM, tools, Startups.com, SendGrid, Xolo, Apple Dev, $12,744 / year" },
                { label: "Total fixed OpEx", value: "$8,621 / mo", sub: "$103,452 / year", strong: true },
              ].map(({ label, value, sub, strong }) => (
                <div key={label} className={"flex items-start justify-between gap-4 p-4 " + (strong ? "bg-muted/40" : "")}>
                  <div>
                    <p className="text-xs font-medium text-foreground">{label}</p>
                    {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{sub}</p>}
                  </div>
                  <p className="text-sm font-medium text-foreground shrink-0">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Annual financials table */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">3. Annual financials</p>
            <div className="rounded-xl border border-border bg-card p-5 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium text-muted-foreground pb-2 pr-3">Line item</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 px-2">Year 1<br /><span className="font-normal text-muted-foreground/60">Apr 2027</span></th>
                    <th className="text-right font-medium text-muted-foreground pb-2 pl-2">Year 2<br /><span className="font-normal text-muted-foreground/60">Apr 2028</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: "MRR target", y1: "$9,990", y2: "$39,960" },
                    { item: "Annual revenue", y1: "$119,880", y2: "$479,520", strong: true },
                    { item: "Subscribers", y1: "1,000", y2: "4,000" },
                    { item: "COGS", y1: "$39,560", y2: "$143,856" },
                    { item: "Gross profit", y1: "$80,320", y2: "$335,664", strong: true },
                    { item: "Gross margin", y1: "67%", y2: "70%" },
                    { item: "People", y1: "$90,708", y2: "$90,708" },
                    { item: "Operations", y1: "$12,744", y2: "$12,744" },
                    { item: "Acquisition", y1: "$15,000", y2: "$60,000" },
                    { item: "Research", y1: "$19,498", y2: "$14,240" },
                    { item: "IP registration", y1: "$5,700", y2: "$13,000" },
                    { item: "Total expenses", y1: "$183,210", y2: "$334,548", strong: true },
                  ].map(({ item, y1, y2, strong }) => (
                    <tr key={item} className="border-b border-border/60">
                      <td className={"py-2 pr-3 " + (strong ? "font-medium text-foreground" : "text-muted-foreground")}>{item}</td>
                      <td className={"py-2 px-2 text-right tabular-nums " + (strong ? "font-medium text-foreground" : "text-foreground")}>{y1}</td>
                      <td className={"py-2 pl-2 text-right tabular-nums " + (strong ? "font-medium text-foreground" : "text-foreground")}>{y2}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-border/60">
                    <td className="py-2.5 pr-3 font-semibold text-foreground">Net</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-destructive">-$63,330</td>
                    <td className="py-2.5 pl-2 text-right tabular-nums font-semibold text-green-700 dark:text-green-400">+$144,972</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-semibold text-foreground">Margin</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-semibold text-destructive">-53%</td>
                    <td className="py-2.5 pl-2 text-right tabular-nums font-semibold text-green-700 dark:text-green-400">+30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. CAC and LTV */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">4. CAC and LTV</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: "CAC Year 1", value: "$15", sub: "$15,000 / 1,000 subscribers" },
                { label: "CAC Year 2", value: "$20", sub: "$60,000 / 3,000 new subscribers" },
                { label: "LTV at 12 months", value: "$80.32", sub: "$9.99 x 12 x 67% margin" },
                { label: "LTV at 24 months", value: "$160.64", sub: "$9.99 x 24 x 67% margin" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                  <p className="text-lg font-medium text-foreground">{value}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {[
                { label: "LTV/CAC Year 1 at 12 months", value: "5.4x", good: true },
                { label: "LTV/CAC Year 1 at 24 months", value: "10.7x", good: true },
                { label: "CAC payback Year 1", value: "2.2 months", good: false },
                { label: "CAC payback Year 2", value: "3.0 months", good: false },
              ].map(({ label, value, good }) => (
                <div key={label} className="flex items-center justify-between gap-4 p-4">
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className={"text-sm font-medium shrink-0 " + (good ? "text-green-700 dark:text-green-400" : "text-foreground")}>{value}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-3 leading-relaxed">Benchmark: a healthy SaaS LTV/CAC ratio is 3x or above. Both years clear it comfortably.</p>
          </div>

          {/* 5. Runway analysis */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">5. Runway analysis</p>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {[
                { label: "F&F raise", value: "$150,000" },
                { label: "Pre-launch burn to October 2026", value: "$7,470" },
                { label: "Remaining at launch", value: "$142,530", strong: true },
                { label: "Monthly burn post-launch", value: "$11,971" },
                { label: "Runway from launch", value: "11.9 months", strong: true },
                { label: "Runway exhaustion", value: "~ October 2027" },
                { label: "Pre-seed closes", value: "April 2027", sub: "6 months before runway exhaustion" },
                { label: "Buffer at pre-seed close", value: "6 months", sub: "of runway remaining", good: true },
              ].map(({ label, value, sub, strong, good }) => (
                <div key={label} className={"flex items-start justify-between gap-4 p-4 " + (strong ? "bg-muted/40" : "")}>
                  <div>
                    <p className="text-xs font-medium text-foreground">{label}</p>
                    {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{sub}</p>}
                  </div>
                  <p className={"text-sm font-medium shrink-0 " + (good ? "text-green-700 dark:text-green-400" : "text-foreground")}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. MRR milestone timeline */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">6. MRR milestone timeline</p>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="relative pl-6">
                <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" aria-hidden />
                {[
                  { date: "Oct 2026", title: "App Store launch", detail: "20 subscribers · $200 MRR" },
                  { date: "Dec 2026", title: "Pre-seed conversations open", detail: "100 subscribers · $999 MRR" },
                  { date: "Feb 2027", title: "Pre-seed pipeline active", detail: "300 subscribers · $2,997 MRR" },
                  { date: "Apr 2027", title: "Pre-seed closes", detail: "$500K raised", raise: true },
                  { date: "Jun 2027", title: "Year 1 target", detail: "1,000 subscribers · $9,990 MRR" },
                  { date: "Nov 2027", title: "Breakeven", detail: "1,789 subscribers · $17,876 MRR", breakeven: true },
                  { date: "Dec 2027", title: "Seed round preparation", detail: "2,000 subscribers · $19,980 MRR" },
                  { date: "May 2028", title: "Year 2 target, 30% margin", detail: "4,000 subscribers · $39,960 MRR" },
                ].map(({ date, title, detail, breakeven, raise }) => (
                  <div key={date} className="relative pb-5 last:pb-0">
                    <span
                      className={"absolute -left-[22px] top-1 size-3.5 rounded-full border-2 border-card " + (breakeven ? "bg-green-600" : raise ? "bg-primary" : "bg-muted-foreground/40")}
                      aria-hidden
                    />
                    <div className={breakeven ? "rounded-lg bg-green-50 dark:bg-green-950 px-3 py-2 -ml-1" : ""}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-medium text-foreground">{date}</p>
                        <p className={"text-xs font-medium " + (breakeven ? "text-green-700 dark:text-green-400" : "text-foreground")}>{title}</p>
                        {breakeven && <span className="text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 rounded-full bg-green-600/15 px-2 py-0.5">Breakeven</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </main>
  )
}
