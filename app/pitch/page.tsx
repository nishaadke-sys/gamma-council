
import { useState } from "react"

const QUESTIONS = [
  { id: "q1", category: "Traction", difficulty: "high", question: "You have 81 sessions from 3 subjects. Why should I believe this validates anything?", ideal: "You are right that 3 subjects is not statistical proof. What it is is a within-person longitudinal dataset that no competitor has. The 223ms Stroop delta held consistently across 20 paired sessions, not one lucky measurement. Phase 2 starts June 21 with 30 participants across two cohorts specifically to answer your question - cross-person generalization. The $150K F&F funds exactly that. I am not asking you to believe N=3 proves the market. I am asking you to believe the founder built a working platform, validated the measurement within-person, and has a funded plan to prove it across people.", tips: "Do not get defensive. Acknowledge the limitation clearly, then reframe it as depth not weakness. Lead with the Phase 2 plan immediately." },
  { id: "q2", category: "Market", difficulty: "medium", question: "Oura and Apple Watch have hundreds of millions in R&D. What stops them from building this in six months?", ideal: "They cannot build it in six months because they do not have the dataset. EEG paired longitudinally with wearable data does not exist at scale anywhere. You cannot train a model without the data and you cannot collect the data without a working EEG pipeline and users willing to do daily EEG sessions. Oura's moat is the ring. Gamma's moat is the dataset. The two are complementary - which is why acquisition is a realistic exit path. Apple and Oura are more likely to buy Gamma than build against it.", tips: "Never say they could not build it technically. They obviously could. The answer is always the dataset and the time required to collect it." },
  { id: "q3", category: "Business model", difficulty: "medium", question: "Why would someone pay $9.99 a month for a brain score when they already pay for Oura?", ideal: "Because Oura tells you your body is ready. On 75% of measured days, Oura readiness and actual cognitive capacity disagree. Every single time they disagree, Oura overcalls - it says you are ready when your brain is not. High performers making their hardest decisions on their worst cognitive days do not know it is happening. Gamma closes that gap. The $9.99 is not competing with Oura - it is the cognitive layer that makes Oura more useful. Our target user already pays for Oura, Apple Watch, and a Whoop simultaneously. They are not price-sensitive. They are data-hungry.", tips: "Lead with the 75% discordance stat. That is your most powerful commercial proof point. Use it every time this question comes up." },
  { id: "q4", category: "Team", difficulty: "high", question: "You are a solo founder with no EEG background who built this in 90 days. That sounds like a prototype, not a company.", ideal: "It is a prototype and a platform. In 90 days I went from zero Python to 369,000 EEG samples, a validated algorithm, a live iOS app, and a 30-person Phase 2 study starting June 21. That execution speed is the signal. The gap is signal processing depth - I know it, I am actively searching for a technical co-founder with ML and biosignal expertise, and Mia Micevska, MSc Cognitive Neuroscience from Padova, is joining full time post-funding as CTO. The question is not whether a solo founder can build this. I already did. The question is whether the team can scale it. That is what the pre-seed funds.", tips: "Own the solo founder status. Do not apologize for it. The 90-day build speed is the proof of execution. Address the gap directly and show you already have a plan." },
  { id: "q5", category: "Science", difficulty: "high", question: "EEG is notoriously noisy. How do you know your 223ms finding is real and not an artifact?", ideal: "Fair challenge. Three things. First, the 223ms delta held across 20 paired sessions - that consistency is artifact-resilient by definition. Second, the direction is correct - high CCS predicts faster reaction time on a validated cognitive speed test. That is the expected neurological relationship. Third, signal quality gating: we only count sessions above 50% signal quality. The 57 reliable sessions out of 81 total are the foundation. The result is directionally consistent with decades of EEG-cognition literature.", tips: "Do not over-claim. The finding is directionally consistent and methodologically sound. Never say it is clinically proven." },
  { id: "q6", category: "Fundraising", difficulty: "medium", question: "Why are you raising $150K on a $3M cap? That seems low for a deep tech company.", ideal: "The $3M cap reflects where we are: pre-revenue, pre-scale, Phase 2 not yet complete. The cap is deliberately low because it is a friends and family round, not an institutional round. The people investing at $3M are betting on me personally. The pre-seed round targets an $8-10M cap once Phase 2 data and paying users justify it. The $150K is not the valuation story - it is the bridge to the data that earns the higher valuation.", tips: "Do not defend the $3M cap as a permanent valuation. Frame it as the right structure for F&F and show you understand the next round pricing." },
  { id: "q7", category: "Competition", difficulty: "medium", question: "Neurable and Connectome Health are doing similar things with more funding. How do you win?", ideal: "Neurable requires a $600 EEG headset - their product is the hardware. Connectome uses behavioral blood flow markers, not EEG, and has no consumer product. Neither is device-agnostic. Gamma is the only solution that works with hardware the user already owns. No new device, no behavior change, no $600 barrier. The 150 million wearable users are our distribution. Neurable's TAM is people willing to wear a second device. Gamma's TAM is people already wearing a first one. Different markets.", tips: "Know your competitors cold. Neurable is hardware-dependent. Connectome uses different signal. Do not say they are not competitors - say why the category differentiation matters." },
  { id: "q8", category: "Traction", difficulty: "low", question: "What does the Oura discordance finding mean in plain English?", ideal: "On 75% of days where we measured both Oura readiness and EEG cognitive capacity, they disagreed by more than 15 points. Every single time they disagreed, Oura said you are ready when the brain data said you were not. Oura never undercalled. It always overcalled. That means if you are relying on Oura to tell you when to do your hardest work, you are wrong three out of four days. Gamma is the early warning system that Oura cannot be - because Oura measures your body and has no access to what your brain is doing.", tips: "This is your clearest proof point. Practice this answer until it is effortless. Plain language, specific stat, clear implication." },
  { id: "q9", category: "Business model", difficulty: "high", question: "Your M1 model returned negative R-squared on all 80 configurations. Is the core product thesis broken?", ideal: "M1 tested same-day wearable aggregates predicting CCS. All 80 configurations returned negative LODO R-squared. That is a scoping result, not a product failure. Same-day wearable aggregates are too coarse to predict cognitive state. The untested hypothesis is 24-hour pre-session ambient features with timestamps. That is what Phase 2 is designed to test. The consumer product today uses EEG as ground truth, not wearable prediction. M1 was a B2B model test. The B2B same-day pitch pauses. The consumer product and the 24-hour ambient hypothesis are both live.", tips: "This is a hard question sophisticated investors will ask. Answer it directly. Do not hide M1. The honest framing is scoping limitation not product failure." },
  { id: "q10", category: "Fundraising", difficulty: "low", question: "What does the $150K specifically fund?", ideal: "Five things: Phase 2 study with 30 participants and participant compensation. iOS app launch with Delete Account flow and StoreKit paywall. 12-month operating runway. Legal fees for custom convertible note package across US, EU, and India investors. The majority goes to continued research and bridging to pre-seed. The single milestone this $150K funds is Phase 2 complete and app live by October. That is the gate for the pre-seed at $500K on an $8-10M cap.", tips: "Investors want to know their money has a specific job. Be precise. The milestone is Phase 2 complete and app live. That is it." },
]

const CATEGORIES = ["All", "Traction", "Market", "Business model", "Team", "Science", "Fundraising", "Competition"]
const DIFFICULTY_COLORS: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export default function PitchPage() {
  const [category, setCategory] = useState("All")
  const [mode, setMode] = useState<"browse" | "drill">("browse")
  const [drillIndex, setDrillIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = category === "All" ? QUESTIONS : QUESTIONS.filter(q => q.category === category)

  function startDrill() {
    setMode("drill")
    setDrillIndex(0)
    setShowAnswer(false)
    setUserAnswer("")
  }

  function nextQuestion() {
    if (drillIndex < filtered.length - 1) {
      setDrillIndex(drillIndex + 1)
      setShowAnswer(false)
      setUserAnswer("")
    } else {
      setMode("browse")
    }
  }

  const current = filtered[drillIndex]

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Pitch Q&A Drill</h1>
        <p className="mt-1 text-sm text-muted-foreground">Practice the hardest investor questions. Answer first, then see the ideal response.</p>
      </header>

      <div className="flex gap-1 mb-6 border-b border-border pb-3">
        <button onClick={() => { setMode("browse"); setExpanded(null) }} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (mode === "browse" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Browse
        </button>
        <button onClick={startDrill} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (mode === "drill" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Drill mode
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={"text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors " + (category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            {cat}
          </button>
        ))}
      </div>

      {mode === "browse" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-4">{filtered.length} questions{category !== "All" ? " in " + category : ""}. Tap to expand ideal answer.</p>
          {filtered.map((q) => (
            <div key={q.id} className={"rounded-xl border bg-card transition-colors cursor-pointer " + (expanded === q.id ? "border-primary" : "border-border")} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-foreground leading-relaxed">{q.question}</p>
                  <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + DIFFICULTY_COLORS[q.difficulty]}>{q.difficulty}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{q.category}</span>
              </div>
              {expanded === q.id && (
                <div className="border-t border-border p-4 space-y-3">
                  <div>
                    <p className="text-[11px] font-medium text-primary mb-2">Ideal answer</p>
                    <p className="text-xs text-foreground leading-relaxed">{q.ideal}</p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Coaching note</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.tips}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === "drill" && current && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Question {drillIndex + 1} of {filtered.length}</p>
            <div className="flex gap-1">
              {filtered.map((_, i) => (
                <span key={i} className={"size-1.5 rounded-full " + (i === drillIndex ? "bg-primary" : i < drillIndex ? "bg-primary/40" : "bg-muted")} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-sm font-medium text-foreground leading-relaxed">{current.question}</p>
              <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + DIFFICULTY_COLORS[current.difficulty]}>{current.difficulty}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">{current.category}</p>
          </div>
          {!showAnswer && (
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-2">Your answer</p>
              <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} rows={5} placeholder="Answer out loud first, then type the key points here..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
              <button onClick={() => setShowAnswer(true)} className="w-full mt-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium py-2.5 hover:bg-primary/90 transition-colors">
                Show ideal answer
              </button>
            </div>
          )}
          {showAnswer && (
            <div className="space-y-3">
              {userAnswer && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[11px] font-medium text-muted-foreground mb-2">Your answer</p>
                  <p className="text-xs text-foreground leading-relaxed">{userAnswer}</p>
                </div>
              )}
              <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4">
                <p className="text-[11px] font-medium text-green-700 dark:text-green-400 mb-2">Ideal answer</p>
                <p className="text-xs text-foreground leading-relaxed">{current.ideal}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[11px] font-medium text-muted-foreground mb-1">Coaching note</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{current.tips}</p>
              </div>
              <button onClick={nextQuestion} className="w-full rounded-lg bg-primary text-primary-foreground text-xs font-medium py-2.5 hover:bg-primary/90 transition-colors">
                {drillIndex < filtered.length - 1 ? "Next question" : "Finish drill"}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
