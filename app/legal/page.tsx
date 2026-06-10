"use client"

import { useState } from "react"

const SECTIONS = [
  {
    id: "current",
    title: "Now - current legal state",
    content: [
      { heading: "What you have", body: "Two legal entities: Gamma Cog OUE (Estonian e-Residency via Xolo, EU operations) and LifeInk Neuro LLC (Delaware, US operations). F&F round issuing under LifeInk Neuro LLC. Mia consulting agreement signed with IP assignment. Marcelo terminated - no equity, no role.", status: "good" },
      { heading: "What you need before August 1", body: "Signed convertible note or SAFE for each investor. Wire instructions for LifeInk Neuro LLC. Cap table tracking all investors. India compliance review started for uncle wire. BOI report filed with FinCEN if LifeInk Neuro LLC formed after January 1 2024 - required within 90 days, $500/day fine for non-compliance.", status: "action" },
      { heading: "Entity watch", body: "The Estonian OUE will raise questions from US pre-seed investors. They prefer a clean Delaware entity on the cap table. LifeInk Neuro LLC as F&F issuing entity is correct. At pre-seed, ask your attorney about flipping to a Delaware C-Corp - most VC-backed startups do this before Series A.", status: "warning" },
    ],
  },
  {
    id: "ff",
    title: "Now - F&F round legals",
    content: [
      { heading: "What legally binding means", body: "A verbal yes is not legally binding. A signed document is. For a convertible note or SAFE to be enforceable you need: a written agreement signed by both parties, consideration meaning money actually exchanged, and clear terms including amount, cap, and issuing entity. The YC standard SAFE is 5 pages and covers all of this.", status: "info" },
      { heading: "What you must disclose", body: "You are legally required to be honest about material facts: current financial state (pre-revenue), known risks (single subject dataset, no technical co-founder), actual use of funds, and the nature of the instrument they are signing. You do not need to disclose trade secrets like your algorithm. But you cannot misrepresent your traction or financials.", status: "info" },
      { heading: "Securities law - Regulation D Rule 506(b)", body: "When you raise money from friends and family in the US, you are selling securities. Rule 506(b) lets you raise from up to 35 non-accredited investors and unlimited accredited investors without SEC registration, as long as you do not publicly advertise the round. Never tell other investors the round is filling based on verbals - that can look like general solicitation which voids the exemption.", status: "warning" },
      { heading: "Do you need a lawyer to sign?", body: "No. For a YC standard SAFE or convertible note at F&F stage, you do not need a lawyer to review, notarize, or witness the document. Both parties sign electronically (DocuSign or HelloSign is legally valid). No notarization required. No witnesses required. Money transfers. Done. Best practice: pay an attorney $500-$1,000 to review your template once before sending it to anyone. After that, use the same template for all 7 investors unchanged. Do not negotiate individual terms with each investor - it creates a messy cap table and signals inexperience.", status: "good" },
      { heading: "India wire - your uncle's $25K", body: "Most complex part of your round. Your uncle sending money from India to a US LLC requires FEMA compliance under Indian law. His Authorized Dealer bank must verify source of funds under KYC and AML requirements. He needs: purpose of remittance, declaration of source of funds, and the signed investment agreement. SAFE notes are not clearly defined under FEMA - a convertible note is safer for this investor specifically. Start this process now - it takes 2-4 weeks minimum.", status: "action" },
    ],
  },
  {
    id: "entities",
    title: "Now - entity structure",
    content: [
      { heading: "Why Delaware C-Corp is the VC standard", body: "Every VC term sheet, SAFE, convertible note, stock option plan, and drag-along right is built around Delaware corporate law. When a VC reviews your cap table they work from a body of law they know cold. Anything else creates friction and sometimes a hard stop. If you plan to raise institutional money, you will need a Delaware C-Corp at some point.", status: "info" },
      { heading: "Your current structure", body: "Gamma Cog OUE (Estonia) is your EU operating entity - good for EU contracts and Xolo management. LifeInk Neuro LLC (Delaware LLC) is your US entity for F&F fundraising. An LLC is not ideal for VC fundraising long-term - VCs prefer C-Corps because LLCs have pass-through taxation that complicates their fund structures. For F&F and potentially pre-seed, an LLC is acceptable.", status: "warning" },
      { heading: "When to flip to C-Corp", body: "The right time is before your first institutional investor. Flipping early means lower cost and cleaner structure. Stripe Atlas ($500) and Clerky ($399) can incorporate a Delaware C-Corp quickly. Ask your attorney about this before pre-seed conversations start.", status: "info" },
      { heading: "BOI report - action required", body: "Under the Corporate Transparency Act, LifeInk Neuro LLC must file a Beneficial Ownership Information report with FinCEN. If formed after January 1 2024, you had 90 days from formation. Fine is $500 per day for non-compliance. Filing is free at fincen.gov. You report: your full name, date of birth, address, and a copy of your ID.", status: "action" },
    ],
  },
  {
    id: "ip",
    title: "Now - IP protection",
    content: [
      { heading: "IP assignment - most important document you may not have", body: "An IP assignment agreement between you and your company formally assigns all IP you created - the algorithm, codebase, research findings, brand - to the company. Without this, you personally own the IP, not the company. Every investor will require this before closing. It is a 1-2 page document. Get this done before the first SAFE or note is signed.", status: "action" },
      { heading: "What Mia owns", body: "Per the consulting agreement Mia signed, all work product she creates for Gamma is assigned to the company. This includes the Phase 2 protocol, methodology, and analysis. Her agreement has the IP assignment clause. This is clean.", status: "good" },
      { heading: "Algorithm as trade secret", body: "Your scoring algorithm is a trade secret, not a patent. Trade secret protection is automatic as long as you take reasonable steps to protect it: NDAs with anyone who sees it, keeping it out of public documents, limiting access. You are already doing this correctly. Do not include the algorithm in pitch decks, investor materials, or any public document.", status: "good" },
      { heading: "EEG and health data", body: "EEG data is sensitive health data. Under GDPR you need: a legal basis for processing (consent is most appropriate for a research study), a clear privacy policy, data processing agreements with vendors who touch the data (Railway, SendGrid), and the ability to honor deletion requests. Your Phase 2 study should have explicit informed consent for data collection and use.", status: "warning" },
    ],
  },
  {
    id: "gdpr",
    title: "Before Phase 2 - GDPR",
    content: [
      { heading: "Why GDPR applies to you", body: "You are based in Portugal collecting data from EU residents. GDPR applies regardless of where your company is incorporated. EEG data and health data are Special Category data under GDPR Article 9, which requires explicit consent and extra safeguards.", status: "info" },
      { heading: "What Phase 2 requires", body: "Explicit informed consent form signed before any data collection. Clear explanation of what data is collected, how it is used, who has access, and how long it is kept. Right to withdraw consent and have data deleted. Privacy policy on gammacog.com. Your iOS screener has consent flow built in - this is correct.", status: "good" },
      { heading: "What you still need", body: "A published Privacy Policy on gammacog.com covering: data types collected (EEG, Apple Watch, Oura, demographic), legal basis for processing, data retention period, third parties who access data (Railway, SendGrid), and user rights. A simple Record of Processing Activities spreadsheet is also recommended.", status: "action" },
      { heading: "Health data claims - regulatory risk", body: "Gamma currently positions as a wellness product, not a medical device. This is intentional and correct. If you ever make diagnostic claims (this score indicates cognitive impairment, use this before surgery), you enter medical device territory requiring CE marking in the EU and FDA clearance in the US. Stay on wellness positioning until you have a deliberate strategy for clinical validation.", status: "warning" },
    ],
  },
  {
    id: "preseed",
    title: "Pre-seed - legals",
    content: [
      { heading: "What pre-seed due diligence requires", body: "Before any pre-seed close, investors will ask for: clean Delaware C-Corp incorporation with bylaws, signed IP assignment agreements from all founders, all prior SAFE and convertible note documents with closing records, a verified cap table on Carta or Pulley, any material contracts, privacy policy and terms of service, and a financial model showing path to revenue.", status: "info" },
      { heading: "409A valuation", body: "A 409A is an independent valuation of your common stock. Required before you issue any stock options to employees or advisors. Without it you cannot set a legal option strike price. At pre-seed, a 409A costs $2K-$5K. You do not need one now but you will need one before your first technical co-founder joins on equity.", status: "info" },
      { heading: "Option pool", body: "Pre-seed investors will typically require 10-15% of shares in an employee option pool before calculating their ownership. This pool comes out of pre-money valuation, which means it dilutes you before the round closes. Negotiate: size it for what you will actually need in 12-18 months, not arbitrarily large.", status: "warning" },
      { heading: "Term sheet basics", body: "A term sheet outlines key terms of a priced investment. Critical terms: pre-money valuation, liquidation preference (1x non-participating is standard, reject 2x or participating), anti-dilution (broad-based weighted average is standard, full ratchet is aggressive), and board composition. Never accept a term sheet without an attorney reviewing it.", status: "info" },
    ],
  },
  {
    id: "portugal",
    title: "Ongoing - Portugal D7",
    content: [
      { heading: "D7 visa and startup income", body: "Your D7 Passive Income Visa requires demonstrating passive income meeting minimum thresholds. Investment income from your own startup is not passive income. Revenue from Gamma (salary, dividends) counts as active income. Your September 4 AIMA renewal requires showing minimum Portuguese bank balance of approximately EUR 11,040. Your planned NovoBanco transfer in July is the right move - build 2 months of visible balance history before the appointment.", status: "warning" },
      { heading: "NHR tax regime", body: "Portugal's Non-Habitual Resident regime (IFICI for new applicants since 2024) can significantly reduce your tax burden. Foreign-source income including dividends and capital gains may qualify for reduced rates depending on your situation and the applicable double-taxation treaty. Consult a Portuguese tax attorney if you have not already applied.", status: "info" },
      { heading: "Salary vs investment money", body: "Investment money raised into LifeInk Neuro LLC is not your personal income. You cannot spend it on personal expenses without a formal salary or distribution. Establish a clear salary from the company once you have raised, even if modest. Commingling personal and company funds is a serious legal risk that investors will flag in due diligence.", status: "warning" },
    ],
  },
  {
    id: "exit",
    title: "Long-term - exit basics",
    content: [
      { heading: "Liquidation waterfall", body: "When a company is acquired or shuts down, money flows in this order: (1) secured creditors, (2) unsecured creditors including convertible note holders if not converted, (3) preferred shareholders with liquidation preferences, (4) common shareholders including founders. If your F&F investors used convertible notes and they have not yet converted, they are debt holders and get paid before you in a bad exit.", status: "info" },
      { heading: "Stock sale vs asset sale", body: "In a stock sale (most startup acquisitions), the acquirer buys the company and all shareholders get paid proportionally based on ownership. In an asset sale, the company gets the money then distributes to shareholders after paying liabilities. Your F&F investors get their liquidation preference first (their money back), then pro-rata share of remaining proceeds.", status: "info" },
      { heading: "Drag-along rights", body: "Drag-along rights allow majority shareholders to force minority shareholders to approve a sale. This is standard at Series A. It prevents a small investor from blocking an acquisition. You do not have drag-along rights in your current convertible notes but they will appear in your first priced round term sheet. 1x non-participating preferred with drag-along is standard and acceptable.", status: "info" },
      { heading: "Earnouts", body: "An earnout is when part of the acquisition price is contingent on future performance. Example: acquirer pays $5M now and up to $10M more if you hit $2M ARR within 2 years. Earnouts are risky for founders because the acquirer now controls your business and may not prioritize hitting your earnout targets. Avoid if possible. If unavoidable, negotiate short windows and simple metrics.", status: "warning" },
    ],
  },
]

const STATUS_STYLES: Record<string, string> = {
  good: "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
  action: "bg-destructive/10 text-destructive",
  warning: "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  info: "bg-muted text-muted-foreground",
}

const STATUS_LABELS: Record<string, string> = {
  good: "Clean",
  action: "Action needed",
  warning: "Watch this",
  info: "Know this",
}

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState("current")
  const section = SECTIONS.find((s) => s.id === activeSection)!

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Legal OS</h1>
        <p className="mt-1 text-sm text-muted-foreground">End-to-end legal coverage from your current state to exit. Plain English. Gamma-specific.</p>
      </header>

      <div className="flex gap-1 mb-8 flex-wrap border-b border-border pb-3">
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors " + (activeSection === s.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {s.title}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-base font-medium text-foreground mb-6">{section.title}</h2>
        <div className="space-y-4">
          {section.content.map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-sm font-medium text-foreground">{item.heading}</p>
                <span className={"text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 " + STATUS_STYLES[item.status]}>{STATUS_LABELS[item.status]}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
