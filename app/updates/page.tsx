"use client"

import { useState } from "react"

const TEMPLATES = [
  {
    id: "monthly",
    name: "Monthly update",
    audience: "F&F investors",
    when: "Once per month after round closes. First one in September 2026.",
    subject: "Gamma update - [Month] [Year]",
    template: `Hi [name],

Monthly update on Gamma. Three things.

1. What happened this month
[One paragraph. Specific. Numbers where possible. What shipped, what closed, what was learned.]

2. What is coming next month
[Two or three specific things. Not vague. Dates where possible.]

3. One thing I need
[Be specific. Intro to X, feedback on Y, connection to Z. Give investors a way to help.]

Metrics this month:
- Subscribers: [number]
- MRR: $[number]
- Phase 2 status: [status]
- Runway remaining: [months]

As always, reply if you have questions or connections that could help.

Nisha
nisha@gammacog.com
gammacog.com`,
    notes: "Send on the same day each month. Keep it under 200 words. Never skip a month - silence is worse than bad news. F&F investors invested in you personally. Keep them in the loop even when nothing dramatic happened.",
  },
  {
    id: "milestone",
    name: "Milestone update",
    audience: "All investors + warm prospects",
    when: "When a major milestone hits: Phase 2 complete, App Store live, 100 subscribers, 1,000 subscribers.",
    subject: "Gamma milestone - [milestone name]",
    template: `Hi [name],

Quick update: [milestone achieved].

What this means: [one sentence on why this matters for the company].

The numbers: [specific data supporting the milestone].

What comes next: [the next milestone and timeline].

[Optional: if this triggers a conversation you want to have, say so directly.]

Nisha`,
    notes: "Milestone updates are the most read emails you will send. Keep them short. Lead with the milestone, not context. Avoid explaining why the milestone matters - let the number do the work.",
  },
  {
    id: "preseed",
    name: "Pre-seed outreach",
    audience: "Angel investors and micro-VCs",
    when: "October 2026 onwards, after F&F closes and app is live.",
    subject: "Gamma - cognitive performance layer for wearables",
    template: `Hi [name],

I am building Gamma - a real-time Cognitive Capacity Score delivered through the wearable you already own. No new hardware.

Three things that might interest you:

1. We have validated it: people with high scores are 223ms faster on cognitive speed tests than people with low scores. That is a real, measurable difference in brain performance.

2. Oura readiness and actual cognitive capacity disagree on 75% of measured days. Every single time they disagree, Oura overcalls. Gamma is the early warning system Oura cannot be.

3. Phase 2 is complete with 30 participants. App is live in the App Store. [X] paying subscribers.

I am raising [amount] at [cap]. August [year] close.

Happy to send the deck or get on a call. Either way, no pressure.

Nisha Adke
nisha@gammacog.com
gammacog.com`,
    notes: "This is cold outreach. Keep it under 150 words. Lead with proof not pitch. The 223ms number and 75% discordance are your two most powerful lines - use both. Always end with explicit permission to decline.",
  },
  {
    id: "bad_news",
    name: "Bad news update",
    audience: "F&F investors",
    when: "When something material goes wrong. Phase 2 misses target, app rejected by App Store, key person leaves.",
    subject: "Gamma update - [brief description of issue]",
    template: `Hi [name],

I want to keep you informed. [What happened - one sentence, direct, no softening].

What this means: [honest assessment of impact. Do not minimize].

What I am doing about it: [specific actions, not vague reassurances].

Timeline: [when you expect resolution or next update].

I will update you again by [date].

Nisha`,
    notes: "Send bad news fast. Do not wait until you have a solution. Investors would rather know early with no solution than late with a partial one. One paragraph. Specific. No spin. Always include a specific next update date.",
  },
  {
    id: "round_close",
    name: "Round closing announcement",
    audience: "All F&F investors",
    when: "When August 1 close is complete and all wires are received.",
    subject: "Gamma F&F round closed - thank you",
    template: `Hi [name],

The Gamma friends and family round is closed. $[amount] raised from [number] investors.

Your convertible note is executed and on file. Your investment of $[amount] is confirmed at a $3M valuation cap with 5% annual interest. You will receive a copy of the final signed document separately.

What happens next:
- Phase 2 completes August 15
- iOS app launches October 2026
- Pre-seed conversations open December 2026

I will send monthly updates starting September. If you have questions or connections that could help, reply to this email.

Thank you for believing in Gamma early. I will not waste it.

Nisha`,
    notes: "This email sets the tone for the investor relationship going forward. Be warm but professional. Confirm the specific terms. Give a clear timeline. End with gratitude that is genuine not performative.",
  },
]

export default function UpdatesPage() {
  const [active, setActive] = useState("monthly")
  const [copied, setCopied] = useState(false)

  const template = TEMPLATES.find(t => t.id === active)!

  function copyTemplate() {
    navigator.clipboard.writeText(template.template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Investor updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Templates for every investor communication. Use consistently after round closes.</p>
      </header>

      <div className="flex gap-1.5 flex-wrap mb-6 border-b border-border pb-3">
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (active === t.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">{template.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{template.audience}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-medium text-muted-foreground min-w-[44px] mt-0.5">When</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{template.when}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-medium text-muted-foreground min-w-[44px] mt-0.5">Subject</span>
              <p className="text-xs text-foreground font-mono">{template.subject}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-[11px] font-medium text-muted-foreground">Template</p>
            <button onClick={copyTemplate} className={"text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors " + (copied ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary")}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="p-4">
            <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">{template.template}</pre>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-medium text-muted-foreground mb-2">Coaching note</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{template.notes}</p>
        </div>
      </div>
    </main>
  )
}
