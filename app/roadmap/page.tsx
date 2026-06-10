"use client"

import { useState } from "react"

const STAGES = [
  {
    id: "ff",
    label: "F&F",
    sublabel: "Now - August 1 2026",
    status: "active",
    target: "$150K",
    valuation: "$3M cap",
    instrument: "Convertible note",
    dilution: "~5%",
    gamma: {
      goal: "Close $150K from friends and family. Fund Phase 2 completion and 12-month runway.",
      milestone: "Signed notes from all 7 investors. Wires received in LifeInk Neuro LLC by August 1.",
      gate: "You are here. Round in progress.",
    },
    what: "Friends, family, and close personal network. People who invest in YOU, not the business. Check sizes $10K-$50K. No institutional investors at this stage.",
    instrument_detail: "Convertible note at $3M cap, 5% interest, 18-month conversion window. YC standard template. No lawyer required to execute. Electronic signatures valid.",
    investors: [
      { name: "Friends and family", description: "Personal network. No formal process needed." },
      { name: "Angel investors", description: "Individuals investing personal capital. AngelList, LinkedIn, Neurofounders community." },
    ],
    sources: [
      { label: "YC SAFE and note templates", url: "https://www.ycombinator.com/documents" },
      { label: "Regulation D Rule 506(b)", url: "https://www.sec.gov/education/smallbusiness/exemptions/regD" },
    ],
    benchmarks: "Typical F&F round: $25K-$250K. Median cap: $2M-$4M for pre-revenue. Your $3M cap is at market.",
  },
  {
    id: "preseed",
    label: "Pre-seed",
    sublabel: "Late 2026 - early 2027",
    status: "next",
    target: "$500K-$1.5M",
    valuation: "$6M-$10M cap",
    instrument: "SAFE (post-money)",
    dilution: "10-15%",
    gamma: {
      goal: "Fund consumer app launch, first hires, and M2 model development.",
      milestone: "Phase 2 data showing R2 > 0.3. Consumer app live with paying users. $5K-$10K MRR.",
      gate: "Gated on Phase 2 results (August 2026) and app launch (October 2026).",
    },
    what: "Angel investors, micro-VCs, and pre-seed funds. Check sizes $25K-$500K. You need a lead investor who sets terms and others follow.",
    instrument_detail: "Post-money SAFE is the standard at pre-seed in 2026. 90% of pre-seed rounds use SAFEs. No interest, no maturity date. Cap typically 1.5-2x your F&F cap. $8M-$10M cap is reasonable with Phase 2 data and paying users.",
    investors: [
      { name: "Neurotech angels", description: "Ariel Garten (Interaxon), Amy Kruse (Satori), neurotech-adjacent angels." },
      { name: "Health tech micro-VCs", description: "Firms writing $100K-$500K checks in digital health and wearables." },
      { name: "Startups.com matching", description: "Activate after F&F closes per Ed Kang guidance." },
    ],
    sources: [
      { label: "Carta state of pre-seed Q1 2026", url: "https://carta.com/data/state-of-pre-seed-q1-2026/" },
      { label: "AngelList raise", url: "https://www.angellist.com/raise" },
      { label: "Startups.com investor matching", url: "https://www.startups.com" },
    ],
    benchmarks: "2026 median pre-seed: $500K-$1M raise. Median val cap: $10M for $250K-$1M rounds (Carta Q1 2026). Bar is higher than 2024 - investors want traction even pre-revenue.",
  },
  {
    id: "seed",
    label: "Seed",
    sublabel: "Mid 2027",
    status: "future",
    target: "$2M-$5M",
    valuation: "$15M-$25M pre-money",
    instrument: "Priced equity",
    dilution: "15-25%",
    gamma: {
      goal: "Scale consumer app, build data science team, validate B2B licensing model.",
      milestone: "$20K MRR. M2 model validated. Clear B2B pipeline.",
      gate: "Gated on $20K MRR milestone. This is your seed round trigger.",
    },
    what: "Seed-stage VCs, strategic angels, and corporate venture arms. Lead investor takes 10-20% ownership and typically gets a board observer seat. Round takes 6-12 weeks to close.",
    instrument_detail: "First priced round. Investors receive preferred stock with liquidation preferences. You will need a 409A valuation, option pool (10-15%), and a Delaware C-Corp. Term sheet review by attorney is required. Legal fees $15K-$40K.",
    investors: [
      { name: "Digital health seed funds", description: "Rock Health, 8VC, Andreessen Horowitz Bio, General Catalyst Health." },
      { name: "Neurotech VCs", description: "Khosla Ventures, Founders Fund, Lux Capital - all have neurotech portfolio companies." },
      { name: "Corporate venture", description: "Samsung NEXT, Qualcomm Ventures, Garmin Ventures - all have wearable interests." },
    ],
    sources: [
      { label: "Rock Health", url: "https://rockhealth.com" },
      { label: "Seed round benchmarks 2026", url: "https://www.pitchwise.se/blog/the-complete-guide-to-seed-and-series-funding-rounds-for-founders-in-2026" },
      { label: "Carta seed data", url: "https://carta.com/data" },
    ],
    benchmarks: "2026 median seed: $2M-$4M raise. Median pre-money: $16M. Fewer than 10% of pre-seed startups reach seed. Bar: real revenue, proven retention, clear growth path.",
  },
  {
    id: "seriesa",
    label: "Series A",
    sublabel: "2028-2029",
    status: "future",
    target: "$10M-$20M",
    valuation: "$30M-$60M pre-money",
    instrument: "Series A preferred",
    dilution: "20-25%",
    gamma: {
      goal: "Scale to $1M ARR. Build B2B licensing revenue. Expand dataset to 10K+ users.",
      milestone: "$1M ARR. B2B deal signed. International expansion started.",
      gate: "Gated on seed round success and $1M ARR milestone.",
    },
    what: "Institutional VCs leading $10M-$20M rounds. Lead investor takes a board seat. Full due diligence: financials, IP audit, customer interviews, technical review. Process takes 3-6 months.",
    instrument_detail: "Series A preferred stock with full investor rights: liquidation preference, anti-dilution, pro-rata, information rights, board representation. Legal fees $50K-$100K. Requires audited financials and clean cap table.",
    investors: [
      { name: "Top-tier health tech VCs", description: "GV (Google Ventures), Andreessen Horowitz, General Catalyst, Bessemer." },
      { name: "Strategic acquirers via CVC", description: "Oura, Apple, Garmin, Whoop corporate venture arms." },
      { name: "Growth-stage health funds", description: "Foresite Capital, RA Capital, Deerfield Management." },
    ],
    sources: [
      { label: "Series A benchmarks 2026", url: "https://www.pitchwise.se/blog/the-complete-guide-to-seed-and-series-funding-rounds-for-founders-in-2026" },
      { label: "Foundersuite investor database", url: "https://foundersuite.com" },
      { label: "Crunchbase investor search", url: "https://www.crunchbase.com/lists/investors" },
    ],
    benchmarks: "2026 typical Series A: $10M-$20M, median $12M. Pre-money $25M-$50M, median $45M. Fewer than 5% of seed companies raise Series A.",
  },
  {
    id: "nondilutive",
    label: "Non-dilutive",
    sublabel: "Apply at every stage",
    status: "parallel",
    target: "Varies",
    valuation: "No dilution",
    instrument: "Grants and credits",
    dilution: "0%",
    gamma: {
      goal: "Reduce how much equity you sell at every stage. Every grant dollar is a dollar you do not need to raise.",
      milestone: "NVIDIA Inception applied. EU Horizon grant researched. Portugal IAPMEI programs researched.",
      gate: "No gate. Apply now and at every subsequent stage.",
    },
    what: "Grants, accelerator programs, R&D tax credits, GPU credits, and prize competitions. Zero equity given away. Every dollar of grant funding reduces your dilution at the next round.",
    instrument_detail: "Non-dilutive funding does not appear on your cap table. It reduces burn and extends runway. The more runway you have, the better your negotiating position at every priced round.",
    investors: [
      { name: "NVIDIA Inception", description: "Free to apply. GPU credits, VC network via Inception Capital Connect." },
      { name: "EU Horizon EIC Accelerator", description: "Up to EUR 2.5M non-dilutive for deep tech startups." },
      { name: "Portugal IAPMEI", description: "Portuguese government innovation grants for Portugal-based startups." },
      { name: "Wellcome Trust", description: "Global health research funder. Relevant for cognitive health research." },
    ],
    sources: [
      { label: "NVIDIA Inception program", url: "https://www.nvidia.com/en-us/startups/" },
      { label: "EIC Accelerator (EU)", url: "https://eic.ec.europa.eu/eic-funding/eic-accelerator_en" },
      { label: "Wellcome Trust grants", url: "https://wellcome.org/grant-funding" },
      { label: "IAPMEI Portugal", url: "https://www.iapmei.pt" },
    ],
    benchmarks: "Non-dilutive funding is the best money available. NVIDIA Inception takes 2 hours to apply. EIC Accelerator gives up to EUR 2.5M non-dilutive to deep tech startups.",
  },
]

const STATUS_COLORS: Record<string, string> = {
  active: "bg-primary text-primary-foreground",
  next: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  future: "bg-muted text-muted-foreground",
  parallel: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active now",
  next: "Next",
  future: "Future",
  parallel: "Apply at every stage",
}

export default function RoadmapPage() {
  const [activeStage, setActiveStage] = useState("ff")
  const stage = STAGES.find((s) => s.id === activeStage)!

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Founder funding roadmap</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every stage from F&F to Series A. What you need, when you need it, and who to talk to.</p>
      </header>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {STAGES.map((s) => (
          <button key={s.id} onClick={() => setActiveStage(s.id)} className={"flex-shrink-0 flex flex-col items-start px-3 py-2 rounded-lg border transition-colors " + (activeStage === s.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted")}>
            <span className="text-xs font-medium text-foreground">{s.label}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">{s.sublabel}</span>
          </button>
        ))}
      </div>

      <div className="space-y-5">

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-medium text-foreground">{stage.label} round</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stage.sublabel}</p>
            </div>
            <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_COLORS[stage.status]}>{STATUS_LABELS[stage.status]}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Target raise", value: stage.target },
              { label: "Valuation", value: stage.valuation },
              { label: "Instrument", value: stage.instrument },
              { label: "Dilution", value: stage.dilution },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted p-2.5">
                <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
                <p className="text-xs font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-xs font-medium text-primary mb-3">Gamma - this stage</p>
          <div className="space-y-2">
            {[
              { label: "Goal", value: stage.gamma.goal },
              { label: "Milestone", value: stage.gamma.milestone },
              { label: "Gate", value: stage.gamma.gate },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-[11px] font-medium text-foreground shrink-0 min-w-[60px] mt-0.5">{label}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Who invests at this stage</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{stage.what}</p>
          <div className="space-y-2">
            {stage.investors.map((inv) => (
              <div key={inv.name} className="flex items-start gap-2.5">
                <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <div>
                  <span className="text-xs font-medium text-foreground">{inv.name} </span>
                  <span className="text-xs text-muted-foreground">{inv.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Instrument details</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{stage.instrument_detail}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">2026 benchmarks</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{stage.benchmarks}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Sources and links</p>
          <div className="space-y-2">
            {stage.sources.map((src) => (
              <a key={src.label} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                <i className="ti ti-external-link" style={{ fontSize: 13 }} aria-hidden />
                {src.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
