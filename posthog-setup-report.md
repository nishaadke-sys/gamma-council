# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Gamma Council app. PostHog is initialized client-side via `instrumentation-client.ts` (Next.js 15.3+ pattern) using a reverse proxy through `/ingest` to avoid ad-blockers. A server-side client (`lib/posthog-server.ts`) handles API route events. 14 events were instrumented across 7 files, covering the full product surface: AI council debates, pitch drilling, investor CRM, funding modeling, knowledge base, talk track, and GTM planning. Server-side debate saves pass the client's PostHog distinct ID via `x-posthog-distinct-id` header to correlate events across the client/server boundary.

| Event | Description | File |
|---|---|---|
| `council_convened` | User starts an AI debate session | `app/page.tsx` |
| `council_injection_sent` | User injects a follow-up question into a live debate | `app/page.tsx` |
| `council_cleared` | User clears the current debate session | `app/page.tsx` |
| `debate_saved` | Completed debate saved to the database (server-side) | `app/api/debates/route.ts` |
| `pitch_drill_started` | User enters drill mode on the Pitch Q&A page | `app/pitch/page.tsx` |
| `pitch_drill_answer_revealed` | User reveals the ideal answer while drilling | `app/pitch/page.tsx` |
| `pitch_drill_completed` | User finishes all questions in a drill session | `app/pitch/page.tsx` |
| `investor_status_updated` | User changes an investor's status in the CRM | `app/crm/page.tsx` |
| `investor_notes_saved` | User saves notes or next action for an investor | `app/crm/page.tsx` |
| `knowledge_document_uploaded` | User uploads a document to extract knowledge entries | `app/knowledge/page.tsx` |
| `knowledge_entry_deleted` | User deletes a knowledge base entry | `app/knowledge/page.tsx` |
| `funding_tab_viewed` | User switches tabs on the Funding strategy page | `app/funding/page.tsx` |
| `talk_track_section_expanded` | User expands a script section or objection | `app/talktrack/page.tsx` |
| `gtm_channel_expanded` | User expands a GTM channel card | `app/gtm/page.tsx` |

## Next steps

We've built a dashboard and five insights to monitor user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://eu.posthog.com/project/203584/dashboard/753380)
- **Council debates over time**: [Hl6Y09wY](https://eu.posthog.com/project/203584/insights/Hl6Y09wY) — daily `council_convened` trend
- **Pitch drill conversion funnel**: [NyBqENTj](https://eu.posthog.com/project/203584/insights/NyBqENTj) — started → answer revealed → completed
- **Feature engagement overview**: [XIXZZgeW](https://eu.posthog.com/project/203584/insights/XIXZZgeW) — debates, pitch drills, CRM updates, knowledge uploads side by side
- **Council debate modes breakdown**: [EcsEsg9A](https://eu.posthog.com/project/203584/insights/EcsEsg9A) — debates split by mode (decision, exploration, etc.)
- **Debate sessions with follow-up injections**: [Y1gi9334](https://eu.posthog.com/project/203584/insights/Y1gi9334) — debates started vs. injections sent (measures engagement depth)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
