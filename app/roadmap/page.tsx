"use client"

import { useState } from "react"

const PHASES = [
  {
    id: "ff",
    label: "F&F Close",
    sublabel: "Now - Aug 1 2026",
    status: "active",
    goal: "Close $150K from 6 investors. Wire all funds into LifeInk Neuro LLC by August 1.",
    confirmed: "$10K confirmed. $140K gap.",
    links: [
      { label: "Investor CRM", href: "/crm" },
      { label: "Talk Track", href: "/talktrack" },
      { label: "Funding", href: "/funding" },
      { label: "Legal OS", href: "/legal" },
    ],
    weeks: [
      {
        week: "Week 1",
        dates: "Jun 15 - Jun 21",
        focus: "Activate every conversation",
        tasks: [
          { task: "Send Saurabh the financials doc and ask if he can go above $10K", solo: true, tool: "Funding > Financials" },
          { task: "Start FEMA compliance review for both India uncles immediately - takes 2-4 weeks regardless of yes", solo: false, who: "CA or attorney in India", tool: "Legal OS" },
          { task: "Call Pranav Pandit - first conversation, use Talk Track", solo: true, tool: "Talk Track" },
          { task: "Call Lav Kumar - first conversation, use Talk Track", solo: true, tool: "Talk Track" },
          { task: "Follow up with brother on capacity - does he want in and at what amount", solo: true, tool: null },
          { task: "Send convertible note template to any investor who says verbal yes within 24 hours", solo: true, tool: "Legal OS" },
        ],
        calendar: "Jun 15 - Jun 21 2026",
        doNotTouch: "Do not start Phase 2 prep this week. F&F close is the only priority.",
      },
      {
        week: "Week 2",
        dates: "Jun 22 - Jun 28",
        focus: "Follow up and send documents",
        tasks: [
          { task: "Follow up with Saurabh on financials - does he want to go higher than $10K", solo: true, tool: "CRM" },
          { task: "Follow up with Pranav Pandit and Lav Kumar - send note document to anyone who said yes", solo: true, tool: "Talk Track" },
          { task: "Check FEMA compliance status for both uncles", solo: false, who: "India CA/attorney", tool: "Legal OS" },
          { task: "Call both India uncles if FEMA process is underway", solo: true, tool: "Talk Track" },
          { task: "Update CRM with status for every investor after each conversation", solo: true, tool: "CRM" },
        ],
        calendar: "Jun 22 - Jun 28 2026",
        doNotTouch: "One warm follow-up maximum per investor this week. Do not chase.",
      },
      {
        week: "Week 3",
        dates: "Jun 29 - Jul 5",
        focus: "Get signatures on all verbal yeses",
        tasks: [
          { task: "Chase any unsigned documents - send reminder to anyone who has not countersigned within 5 days", solo: true, tool: "CRM" },
          { task: "For anyone who has gone quiet - one final warm follow-up then move on", solo: true, tool: "Talk Track" },
          { task: "Confirm wire details for all signed investors", solo: true, tool: "CRM" },
          { task: "Check if Varun Gulati soft no has changed - if not, move on", solo: true, tool: "CRM" },
        ],
        calendar: "Jun 29 - Jul 5 2026",
        doNotTouch: "Do not add new investors at this stage. Close what you have.",
      },
      {
        week: "Week 4",
        dates: "Jul 6 - Jul 12",
        focus: "Wire collection begins",
        tasks: [
          { task: "All signed investors should wire by July 12 to allow processing time before Aug 1", solo: true, tool: "CRM" },
          { task: "Send wire instructions to every signed investor", solo: true, tool: "CRM" },
          { task: "Confirm India wires are in compliance review and on track", solo: false, who: "India CA/attorney", tool: "Legal OS" },
          { task: "Update cap table after each wire received", solo: true, tool: "Funding" },
        ],
        calendar: "Jul 6 - Jul 12 2026",
        doNotTouch: "Do not wait until August to chase wires. Banks are slow.",
      },
      {
        week: "Week 5",
        dates: "Jul 13 - Jul 19",
        focus: "Chase stragglers",
        tasks: [
          { task: "Any investor not wired by July 13 gets a direct chase - deadline is real", solo: true, tool: "CRM" },
          { task: "India wires: confirm they are processing and have reference numbers", solo: false, who: "India CA/attorney", tool: "Legal OS" },
          { task: "Assess: are you on track for $150K or do you need to activate Anisha Rachit backup", solo: true, tool: "CRM" },
        ],
        calendar: "Jul 13 - Jul 19 2026",
        doNotTouch: "Do not start new investor conversations. You are in collection mode.",
      },
      {
        week: "Week 6",
        dates: "Jul 20 - Aug 1",
        focus: "Close cleanly",
        tasks: [
          { task: "All wires received into LifeInk Neuro LLC by August 1", solo: true, tool: "CRM" },
          { task: "Send closing email to all investors confirming their stake and next steps", solo: true, tool: null },
          { task: "Final cap table update with all investors, amounts, dates", solo: true, tool: "Funding" },
          { task: "Update pitch deck: Bootstrapped to F&F funded $150K raised", solo: true, tool: null },
          { task: "Announce to Ed Kang - round is closed, ask about activating investor matching tool", solo: true, tool: null },
        ],
        calendar: "Jul 20 - Aug 1 2026",
        doNotTouch: "Do not start pre-seed conversations until F&F is fully closed and wired.",
      },
    ],
    gaps: [
      { gap: "FEMA compliance for India wires", solo: false, who: "CA or attorney based in India", how: "Ask your uncles for a referral to their CA before the conversation. Start the process before they say yes - it takes 2-4 weeks." },
      { gap: "Convertible note legal review", solo: false, who: "Delaware attorney", how: "One-time review of the YC standard template. Cost $500-$1,500. Ed Kang can refer. Do this before sending to any investor." },
      { gap: "Brother: no formal note needed but equity reserved", solo: true, who: "You alone", how: "Decide the amount and keep a written record even if informal. You need documentation for the pre-seed cap table." },
    ],
  },
  {
    id: "phase2",
    label: "Phase 2",
    sublabel: "Jun 21 - Aug 15 2026",
    status: "active",
    goal: "30 participants, 2 cohorts, 2,520 EEG sessions. M2 model validation data collected.",
    confirmed: "Cohort 1 starts June 21. 15 Muse 2 devices shipped to Murcia.",
    links: [
      { label: "Knowledge Base", href: "/knowledge" },
      { label: "Legal OS", href: "/legal" },
    ],
    weeks: [
      {
        week: "Week 1",
        dates: "Jun 21 - Jun 28",
        focus: "Cohort 1 kickoff",
        tasks: [
          { task: "Cohort 1 starts June 21 - confirm all 15 participants have received Muse 2 devices", solo: true, tool: "Knowledge Base" },
          { task: "Confirm 24h ambient wearable data collection is running for all participants - critical design requirement", solo: false, who: "Mia Micevska", tool: "Knowledge Base" },
          { task: "Fix back-to-back session BLE reset bug before participants start", solo: false, who: "iOS engineer or Claude Code", tool: null },
          { task: "Monitor study backend - gammacog.com/study/admin", solo: true, tool: null },
        ],
        calendar: "Jun 21 - Jun 28 2026",
        doNotTouch: "Do not change session protocol mid-cohort.",
      },
      {
        week: "Week 2-3",
        dates: "Jun 29 - Jul 11",
        focus: "Cohort 1 in progress",
        tasks: [
          { task: "Monitor daily session completion rates in study admin dashboard", solo: true, tool: null },
          { task: "Flag any participant with <3 sessions per day to Mia immediately", solo: true, tool: null },
          { task: "Confirm Apple Watch and Oura data is syncing correctly for all participants", solo: true, tool: null },
          { task: "Resolve Mia open questions: ADHD exclusion, left-handedness protocol, low-CCS intervention timing", solo: false, who: "Mia Micevska", tool: "Knowledge Base" },
        ],
        calendar: "Jun 29 - Jul 11 2026",
        doNotTouch: "Do not change EEG protocol mid-study.",
      },
      {
        week: "Week 4",
        dates: "Jul 12 - Jul 18",
        focus: "Cohort 2 kickoff",
        tasks: [
          { task: "Cohort 2 starts July 12 - onboard 15 new participants", solo: true, tool: null },
          { task: "Cohort 1 completes July 12 - confirm all session data is saved", solo: true, tool: null },
          { task: "Begin preliminary data review with Mia on Cohort 1 data", solo: false, who: "Mia Micevska", tool: null },
        ],
        calendar: "Jul 12 - Jul 18 2026",
        doNotTouch: null,
      },
      {
        week: "Week 5-6",
        dates: "Jul 19 - Aug 1",
        focus: "Cohort 2 in progress, data collection",
        tasks: [
          { task: "Monitor Cohort 2 session completion", solo: true, tool: null },
          { task: "Confirm 24h ambient data is complete for Cohort 1 before analysis begins", solo: false, who: "Mia Micevska", tool: null },
          { task: "Close F&F round by August 1 simultaneously", solo: true, tool: "CRM" },
        ],
        calendar: "Jul 19 - Aug 1 2026",
        doNotTouch: null,
      },
      {
        week: "Week 7-8",
        dates: "Aug 1 - Aug 15",
        focus: "Cohort 2 complete, analysis begins",
        tasks: [
          { task: "Cohort 2 completes August 15 - confirm all data collected", solo: true, tool: null },
          { task: "Begin M2 model analysis with Mia - 24h pre-session features vs CCS", solo: false, who: "Mia Micevska", tool: null },
          { task: "Primary endpoint check: LODO R2 > 0.3 on 24h pre-session wearable features", solo: false, who: "Mia Micevska", tool: null },
        ],
        calendar: "Aug 1 - Aug 15 2026",
        doNotTouch: null,
      },
    ],
    gaps: [
      { gap: "24h ambient data collection fix", solo: false, who: "iOS/backend engineer or Claude Code", how: "This must be fixed before Phase 2 starts. It is the critical design requirement. Tell Claude Code to fix this first." },
      { gap: "BLE reset bug for back-to-back sessions", solo: false, who: "iOS engineer or Claude Code", how: "Breaks volunteer experience. Fix before June 21." },
      { gap: "Stroop session_id NULL fix", solo: false, who: "Backend engineer or Claude Code", how: "Prevents automated pairing. Fix before Phase 2 data analysis." },
      { gap: "M2 model analysis (XGBoost)", solo: false, who: "Mia Micevska", how: "Mia owns the analysis. You provide the data pipeline and clean exports. Confirm her availability for August." },
      { gap: "Open questions from Mia", solo: false, who: "Mia Micevska", how: "ADHD/OCD exclusion, left-handedness, low-CCS rotating prompt. Reply to Mia before PR #6 can merge." },
    ],
  },
  {
    id: "launch",
    label: "App Launch",
    sublabel: "Aug - Oct 2026",
    status: "upcoming",
    goal: "iOS app live in App Store by October 2026. Founding 100 cohort converted to paying subscribers.",
    confirmed: "Build 41 in TestFlight. Delete Account flow and StoreKit paywall still needed for App Store.",
    links: [
      { label: "Financials", href: "/funding" },
    ],
    weeks: [
      {
        week: "August",
        dates: "Aug 1 - Aug 31",
        focus: "App Store submission prep",
        tasks: [
          { task: "Build Delete Account flow (Apple 5.1.1v requirement - hard requirement for App Store)", solo: false, who: "iOS engineer or Claude Code", tool: null },
          { task: "Build 21-day free trial paywall with StoreKit integration", solo: false, who: "iOS engineer or Claude Code", tool: null },
          { task: "QA via bluepixel-qa branch", solo: false, who: "Bluepixel QA contractor", tool: null },
          { task: "Submit to App Store for review", solo: true, tool: null },
        ],
        calendar: "Aug 1 - Aug 31 2026",
        doNotTouch: "Do not launch to public until App Store approval.",
      },
      {
        week: "September",
        dates: "Sep 1 - Sep 30",
        focus: "Soft launch and founding 100",
        tasks: [
          { task: "App Store approval expected - monitor review status", solo: true, tool: null },
          { task: "Activate founding 100 waitlist - convert Phase 2 participants first (target 20 of 30)", solo: true, tool: "Financials" },
          { task: "Begin community seeding in Lisbon (FitnessUp, MVMT, Matchbox Gym, digital nomad Slack groups)", solo: true, tool: null },
          { task: "D7 visa renewal appointment September 4 with AIMA - confirm NovoBanco balance EUR 11,040 minimum", solo: true, tool: "Legal OS" },
        ],
        calendar: "Sep 1 - Sep 30 2026",
        doNotTouch: null,
      },
      {
        week: "October",
        dates: "Oct 1 - Oct 31",
        focus: "Public launch",
        tasks: [
          { task: "Public launch - founding 100 cohort converts to paying subscribers", solo: true, tool: "Financials" },
          { task: "Target: 20 paying subscribers by end of October", solo: true, tool: "Financials" },
          { task: "Begin clinical referral channel through Mia network at Brainstim and Xiberlinc", solo: false, who: "Mia Micevska", tool: null },
          { task: "Open pre-seed conversations with first angels", solo: true, tool: "Roadmap" },
        ],
        calendar: "Oct 1 - Oct 31 2026",
        doNotTouch: null,
      },
    ],
    gaps: [
      { gap: "Delete Account flow (App Store 5.1.1v)", solo: false, who: "iOS engineer or Claude Code", how: "Hard Apple requirement. Cannot submit without it. Highest priority build task in August." },
      { gap: "StoreKit paywall integration", solo: false, who: "iOS engineer or Claude Code", how: "Required for paid subscriptions. Build in August alongside Delete Account." },
      { gap: "App Store QA", solo: false, who: "Bluepixel QA contractor", how: "Required before submission. Restore CLAUDE.md from repo before giving access." },
      { gap: "Clinical referral channel", solo: false, who: "Mia Micevska", how: "Mia's network at Brainstim and Xiberlinc. Coordinate with her in September." },
    ],
  },
  {
    id: "preseed",
    label: "Pre-seed",
    sublabel: "Oct 2026 - Apr 2027",
    status: "upcoming",
    goal: "$500K raise. Close April 2027. Gate: Phase 2 data showing R2 > 0.3 and app live with paying users.",
    confirmed: "Not started. Activate investor matching tool only after F&F is fully closed per Ed Kang.",
    links: [
      { label: "Funding", href: "/funding" },
      { label: "Roadmap", href: "/roadmap" },
    ],
    weeks: [
      {
        week: "Oct - Nov 2026",
        dates: "Oct - Nov 2026",
        focus: "Build pre-seed pipeline",
        tasks: [
          { task: "Activate Startups.com investor matching tool - only after F&F fully closed", solo: true, tool: "Funding" },
          { task: "Reach out to Neurofounders for founder feature/interview", solo: true, tool: null },
          { task: "Apply to NVIDIA Inception program", solo: true, tool: "Roadmap" },
          { task: "Target: 100 paying subscribers ($999 MRR) by December 2026 to open pre-seed conversations", solo: true, tool: "Financials" },
        ],
        calendar: "Oct 1 - Nov 30 2026",
        doNotTouch: "Do not pitch institutional investors without Phase 2 data and live paying users.",
      },
      {
        week: "Dec 2026 - Feb 2027",
        dates: "Dec 2026 - Feb 2027",
        focus: "Active pre-seed conversations",
        tasks: [
          { task: "100 subscribers milestone opens pre-seed conversations", solo: true, tool: "Financials" },
          { task: "Pitch neurotech angels: Ariel Garten, Amy Kruse and network", solo: true, tool: "Talk Track" },
          { task: "Flip to Delaware C-Corp before first institutional investor signs", solo: false, who: "Delaware attorney", tool: null },
          { task: "Create option pool and 409A valuation before any equity offers to Mia or co-founder", solo: false, who: "Attorney and 409A provider", tool: "Legal OS" },
          { task: "Target: 300 paying subscribers ($2,997 MRR) by February 2027", solo: true, tool: "Financials" },
        ],
        calendar: "Dec 1 2026 - Feb 28 2027",
        doNotTouch: null,
      },
      {
        week: "Mar - Apr 2027",
        dates: "Mar - Apr 2027",
        focus: "Close pre-seed",
        tasks: [
          { task: "Pre-seed closes April 2027 - $500K target", solo: true, tool: "Funding" },
          { task: "Hire technical co-founder with EEG/ML/biosignal expertise post-funding", solo: false, who: "Technical co-founder", tool: null },
          { task: "Mia joins full time as CTO post-funding", solo: false, who: "Mia Micevska", tool: null },
        ],
        calendar: "Mar 1 - Apr 30 2027",
        doNotTouch: null,
      },
    ],
    gaps: [
      { gap: "Technical co-founder", solo: false, who: "ML engineer with EEG/biosignal expertise, ideally Lisbon-based", how: "Start search now via YC co-founder matching, Entrepreneur First, LinkedIn neurotech groups. Do not wait until pre-seed closes." },
      { gap: "Delaware C-Corp conversion", solo: false, who: "Delaware attorney", how: "Stripe Atlas ($500) or Clerky ($399) for incorporation. Do before first institutional investor." },
      { gap: "409A valuation", solo: false, who: "409A provider ($2K-$5K)", how: "Required before any stock options issued. Do before hiring technical co-founder on equity." },
      { gap: "Pitch coaching", solo: false, who: "Ed Kang (Startups.com)", how: "Ed is already your advisor. Use him for pre-seed pitch prep. Activate after F&F closes." },
    ],
  },
  {
    id: "scale",
    label: "Scale",
    sublabel: "Apr 2027 - Nov 2027",
    status: "future",
    goal: "1,000 paying subscribers ($9,990 MRR) by June 2027. Breakeven at 1,789 subscribers by November 2027.",
    confirmed: "Gated on pre-seed close and technical co-founder hire.",
    links: [
      { label: "Financials", href: "/funding" },
    ],
    weeks: [
      {
        week: "Apr - Jun 2027",
        dates: "Apr - Jun 2027",
        focus: "Scale to 1,000 subscribers",
        tasks: [
          { task: "Open paid acquisition channels post pre-seed (CAC target $20)", solo: false, who: "Growth hire or agency", tool: "Financials" },
          { task: "Technical co-founder starts - hand off signal processing pipeline", solo: false, who: "Technical co-founder", tool: null },
          { task: "Mia leads Phase 3 study design with larger cohort", solo: false, who: "Mia Micevska", tool: null },
          { task: "Target: 1,000 paying subscribers by June 2027 ($9,990 MRR)", solo: false, who: "Full team", tool: "Financials" },
        ],
        calendar: "Apr 1 - Jun 30 2027",
        doNotTouch: null,
      },
      {
        week: "Jun - Nov 2027",
        dates: "Jun - Nov 2027",
        focus: "Breakeven and seed prep",
        tasks: [
          { task: "Breakeven at 1,789 subscribers - target November 2027", solo: false, who: "Full team", tool: "Financials" },
          { task: "Begin seed round preparation - $2M-$5M target", solo: true, tool: "Roadmap" },
          { task: "B2B licensing conversations - contingent on Phase 2 and Phase 3 validation", solo: true, tool: "Roadmap" },
          { task: "Target: 2,000 subscribers ($19,980 MRR) by December 2027 for seed round", solo: false, who: "Full team", tool: "Financials" },
        ],
        calendar: "Jun 1 - Nov 30 2027",
        doNotTouch: null,
      },
    ],
    gaps: [
      { gap: "Growth and paid acquisition", solo: false, who: "Growth hire or performance marketing agency", how: "Funded by pre-seed. CAC target $20 in Year 2. Do not open paid channels before pre-seed closes." },
      { gap: "B2B licensing model", solo: false, who: "Business development hire or Mia leading research partnerships", how: "Contingent on Phase 2 and Phase 3 data. Cannot sell B2B without cross-person generalization proof." },
      { gap: "Seed round lead investor", solo: false, who: "Tier 1 health tech VC", how: "Rock Health, GV, General Catalyst, Andreessen Bio. Need $1M+ ARR and proven retention before approaching." },
    ],
  },
]

const STATUS_COLORS: Record<string, string> = {
  active: "bg-primary text-primary-foreground",
  upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  future: "bg-muted text-muted-foreground",
}

function makeCalendarUrl(title: string, dates: string): string {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE"
  const text = encodeURIComponent("Gamma Sprint: " + title)
  const details = encodeURIComponent("Gamma Master Sprint - " + title + " (" + dates + ")")
  return base + "&text=" + text + "&details=" + details
}

export default function SprintPage() {
  const [activePhase, setActivePhase] = useState("ff")
  const [activeView, setActiveView] = useState<"weeks" | "gaps">("weeks")
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null)

  const phase = PHASES.find((p) => p.id === activePhase)!

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Master Sprint</h1>
        <p className="mt-1 text-sm text-muted-foreground">End-to-end execution plan. Solo founder. Every week, every gap, every handoff.</p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {PHASES.map((p) => (
          <button key={p.id} onClick={() => { setActivePhase(p.id); setExpandedWeek(null) }} className={"flex-shrink-0 flex flex-col items-start px-3 py-2 rounded-lg border transition-colors " + (activePhase === p.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted")}>
            <span className="text-xs font-medium text-foreground">{p.label}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">{p.sublabel}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-medium text-foreground">{phase.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{phase.sublabel}</p>
          </div>
          <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_COLORS[phase.status]}>{phase.status === "active" ? "Active now" : phase.status === "upcoming" ? "Upcoming" : "Future"}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{phase.goal}</p>
        <p className="text-[11px] text-muted-foreground/60 leading-relaxed mb-3">{phase.confirmed}</p>
        <div className="flex flex-wrap gap-2">
          {phase.links.map((link) => (
            <a key={link.label} href={link.href} className="text-[11px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {link.label} -&gt;
            </a>
          ))}
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        {(["weeks", "gaps"] as const).map((v) => (
          <button key={v} onClick={() => setActiveView(v)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize " + (activeView === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {v === "weeks" ? "Week by week" : "Gaps and handoffs"}
          </button>
        ))}
      </div>

      {activeView === "weeks" && (
        <div className="space-y-3">
          {phase.weeks.map((week) => (
            <div key={week.week} className={"rounded-xl border bg-card transition-colors " + (expandedWeek === week.week ? "border-primary" : "border-border")}>
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}>
                <div>
                  <p className="text-xs font-medium text-foreground">{week.week} - {week.focus}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{week.dates}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={makeCalendarUrl(week.week + " " + week.focus, week.dates)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[11px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    + Calendar
                  </a>
                  <span className="text-xs text-muted-foreground">{expandedWeek === week.week ? "^" : "v"}</span>
                </div>
              </div>

              {expandedWeek === week.week && (
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
                  <div className="space-y-2">
                    {week.tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className={"size-4 rounded shrink-0 mt-0.5 border " + (task.solo ? "border-primary/40 bg-primary/5" : "border-amber-400/40 bg-amber-50 dark:bg-amber-950")} />
                        <div className="flex-1">
                          <p className="text-xs text-foreground leading-relaxed">{task.task}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {task.solo ? (
                              <span className="text-[11px] text-primary">Solo</span>
                            ) : (
                              <span className="text-[11px] text-amber-700 dark:text-amber-400">Needs: {"who" in task ? task.who : "help"}</span>
                            )}
                            {"tool" in task && task.tool && (
                              <a href={"/" + task.tool.toLowerCase().replace(/ > .*/, "").replace(/ /g, "")} className="text-[11px] text-muted-foreground/60 hover:text-primary transition-colors">{task.tool}</a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {week.doNotTouch && (
                    <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-xs leading-relaxed">
                      Do not: {week.doNotTouch}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeView === "gaps" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Every task you cannot do alone. Who you need, and how to get them.</p>
          {phase.gaps.map((gap, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-medium text-foreground">{gap.gap}</p>
                <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + (gap.solo ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200")}>{gap.solo ? "Solo" : "Needs help"}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Who: {gap.who}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{gap.how}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
