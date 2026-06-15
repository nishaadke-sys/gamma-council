"use client"

import { useState } from "react"

const SCRIPT = [
  { id: "opening", title: "Opening (30 seconds)", script: "Hey [name], I wanted to reach out because I am building something I think you will find interesting and I would love 15 minutes to share it. No pressure either way. When works for you?", note: "Keep it short. Do not pitch over text or email. Get the call." },
  { id: "problem", title: "The problem (60 seconds)", script: "You probably wear an Oura or Apple Watch. It tells you when your body is recovered. But it has no idea what your brain is capable of today. There is no product that measures cognitive capacity in real time. High performers are making their hardest decisions on their worst cognitive days and have no idea. That is the gap Gamma closes.", note: "Pause after no idea. Let it land. Do not rush to the solution." },
  { id: "solution", title: "The solution (60 seconds)", script: "Gamma gives you a daily Cognitive Capacity Score from 0 to 100 through the wearable you already own. No new hardware. The score is built on EEG brainwave data, which is the only direct measurement of cognitive state. We have already validated it: people with high scores are 223 milliseconds faster on cognitive speed tests than people with low scores. That is a real, measurable difference in brain performance.", note: "The 223ms number is your proof point. Say it clearly and move on." },
  { id: "traction", title: "Traction (60 seconds)", script: "The platform is live. I built it in under 90 days with no prior EEG experience. We have 369,000 raw EEG samples across 81 sessions. Phase 2 starts June 21 with 30 participants across two cohorts. The app launches in October. We have a neuroscientist, Mia Micevska from Padova, who designed the study protocol and is joining full time post-funding.", note: "Do not oversell. These are facts. Let the facts do the work." },
  { id: "ask", title: "The ask (30 seconds)", script: "I am raising $150,000 from friends and family to get through Phase 2 and launch the app. The instrument is a convertible note with a $3 million cap and 5 percent interest. I am closing August 1 because Phase 2 data comes back mid-August and I want the round clean before the story changes. I would love to have you in.", note: "State the terms clearly. Do not apologize for the ask. August 1 is a real deadline." },
  { id: "permission", title: "Permission to decline", script: "I completely understand if the timing is not right or if early stage is not your thing. I would rather know now than have you feel any pressure. What are your thoughts?", note: "Ed Kang: give explicit permission to decline. People who say yes after this actually mean it." },
]

const OBJECTIONS = [
  { q: "It is too early for me", a: "That is completely fair. This is F&F stage which means you are betting on me and the problem, not a proven business. The upside is the $3M cap, which is well below where the next round will price. If early is not your comfort zone, I totally understand.", note: "Do not push. Accept it and move on." },
  { q: "I do not understand EEG", a: "You do not need to. Think of it this way: your Apple Watch measures your heart. EEG measures your brain. Gamma is the first product that uses brain data to tell you what your cognitive capacity is today. The wearable tells you your body is ready. Gamma tells you if your brain is ready.", note: "Use the Apple Watch analogy. Do not go deeper on the science." },
  { q: "What if you never raise again?", a: "With a convertible note, if I hit the 18-month maturity date without raising, you can ask for your money back plus 5 percent interest. It is not ideal but it is your backstop. In practice most F&F investors extend rather than push a company into repayment. But you have that right.", note: "Be honest. Do not oversell the downside protection." },
  { q: "Why a note and not equity?", a: "At this stage, setting a fixed valuation is premature. The note lets you convert at a $3M cap when the next round prices, which means you get more shares per dollar than the pre-seed investors. It is the standard instrument for F&F rounds.", note: "Keep it simple. Do not go into SAFE vs note unless they ask." },
  { q: "What is my return?", a: "Depends on exit. At a $3M cap, $10,000 converts to about 0.36 percent of the company. At a $20M acquisition that is roughly $72,000, a 7x return. At a $50M acquisition, $178,000, an 18x return. These are paper numbers and there are no guarantees.", note: "Use round numbers. Be clear about risk. Do not project unicorn outcomes." },
  { q: "I need to think about it", a: "Of course. I am closing August 1 so take the time you need before then. I will send you the document now so you have it to review. One follow-up from me and then I will leave it with you.", note: "Send the document immediately. One follow-up only. Then move on per Ed." },
]

export default function TalkTrackPage() {
  const [tab, setTab] = useState<"script" | "objections">("script")
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">F&F Talk Track</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full script for investor conversations. Use before every call.</p>
      </header>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        {(["script", "objections"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize " + (tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "script" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6">
            <p className="text-xs font-medium text-primary mb-2">Before every call - Ed Kang</p>
            <div className="space-y-1.5">
              {["Give explicit permission to decline in every conversation", "Treat verbals as signals not closes", "Send the note before the call to pre-empt lawyer stall", "One warm follow-up if they go quiet, then move on", "Never tell other investors the round is filling based on verbals"].map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {SCRIPT.map((s) => (
            <div key={s.id} className={"rounded-xl border bg-card p-5 cursor-pointer transition-colors " + (expanded === s.id ? "border-primary" : "border-border")} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">{s.title}</p>
              <p className="text-sm text-foreground leading-relaxed">{s.script}</p>
              {expanded === s.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{s.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "objections" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-4">Tap any objection to see the response.</p>
          {OBJECTIONS.map((obj, i) => (
            <div key={i} className={"rounded-xl border bg-card p-4 cursor-pointer transition-colors " + (expanded === String(i) ? "border-primary" : "border-border")} onClick={() => setExpanded(expanded === String(i) ? null : String(i))}>
              <p className="text-sm font-medium text-foreground">{obj.q}</p>
              {expanded === String(i) && (
                <div className="mt-3 space-y-2.5">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-foreground leading-relaxed">{obj.a}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{obj.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
