# MUSHIN 2.0 — Master Documentation: Docs 11–29

**Combined:** All 19 documents covering Phase 4 (UX and IA), Phase 5 (Technical Architecture), Phase 6 (Data and API Design), Phase 7 (API Contracts), and Phase 8 (Engineering and Operations).

---

## Table of Contents

1. [DOC-011 — Information Architecture, Navigation Maps and Core User Flows](#doc-011)
2. [DOC-012 — UX-UI Design Principles, Accessibility and Interaction Standards](#doc-012)
3. [DOC-013 — Design System Specification and Component Inventory](#doc-013)
4. [DOC-014 — High-Level Software Architecture, Service Boundaries and Module Breakdown](#doc-014)
5. [DOC-015 — AI Intelligence Layer and Search-Discovery Architecture](#doc-015)
6. [DOC-016 — Data Flow Event Architecture and Scalability Strategy](#doc-016)
7. [DOC-017 — Third-Party Integrations, Webhooks and API Gateway Strategy](#doc-017)
8. [DOC-018 — ARB Audit 1 + Domain Model, Entity Relationships and Data Lifecycle](#doc-018)
9. [DOC-019 — Physical Schema, DDL and Migration Strategy](#doc-019)
10. [DOC-020 — API Contracts and Design](#doc-020)
11. [DOC-021 — Security, Privacy and Compliance Architecture](#doc-021)
12. [DOC-022 — Infrastructure and Deployment Strategy](#doc-022)
13. [DOC-023 — Monitoring, Logging and Observability](#doc-023)
14. [DOC-024 — Testing Strategy and QA Process](#doc-024)
15. [DOC-025 — Engineering Standards and Code Review Guidelines](#doc-025)
16. [DOC-026 — CI-CD Pipeline and Release Management](#doc-026)
17. [DOC-027 — Operational Runbooks and Incident Response](#doc-027)
18. [DOC-028 — Legal, Terms and Data Governance](#doc-028)
19. [DOC-029 — Internal User Roles and Permissions Specification](#doc-029)

---


---

<a name="doc-011"></a>
# DOC-011 — Information Architecture, Navigation Maps and Core User Flows

Entering Phase 4. Generating Document #11.

---

#### DOC-011 — Information Architecture, Navigation Maps & Core User Flows
**Status:** Draft v1.0 | **Phase:** 4 — System Design & UX | **Owner:** Principal Architect (UX) + CPO | **Consumes:** Docs 7–10, Audit #1

---

#### Executive Summary

This document defines MUSHIN's information architecture as a **two-layer object model**: a **global Creator layer** (index-level data, ADR-008) overlaid by a **workspace lens** (lists, campaigns, timeline, consent — NFR-S01), and translates it into a navigable structure: global navigation, workspace switching, screen inventory with stable screen IDs, and the canonical user flows. The centerpiece deliverables are (1) the **Golden Path onboarding (UF-00)** — engineered so that a thin Pakistani index *cannot* produce an empty first experience, by converting the Data-Gap Ladder (Doc 8 A2) from a fallback into an onboarding feature ("bring your creators with you"); and (2) the **J1 lifecycle flows for Agency Alex (UF-A series) and Brand Bianca (UF-B series)**, specified stage-by-stage with entry points, decision branches, and failure states. Every screen and flow carries an ID for Mimo implementation and Qwen review traceability.

#### Purpose & Scope

- Canonical object model and containment/reference hierarchy (Creator ↔ List ↔ Campaign ↔ Timeline).
- Global navigation map, workspace context model, screen inventory (SCR-nn), URL-hierarchy principles (structure, not literal routes).
- Golden Path onboarding (UF-00) and primary J1 flows (UF-A1…A4, UF-B1…B3).
- Cross-cutting UX state catalog (empty/denial/read-only/stale/quote states) binding on all screens.

#### Non-Goals

- Visual design, layout, component specs (Docs 12–13).
- Interaction micro-patterns, accessibility detail (Doc 12).
- Admin-panel IA (internal tool; minimal standard per Doc 10 gap, confirmed in Doc 13).
- Mobile-native apps — **responsive web only for S1/S2** (discharges Doc 7 gap; ADR-013 below).
- Copywriting/localization strings (S1 UI is English; Urdu UI logged as S2+ question).

#### Objectives & Success Criteria

- Every FS from Docs 8–10 has a home: mapped to ≥1 screen ID (coverage matrix obligation on Qwen review).
- A new user reaches first insight (enriched creator view) in ≤5 minutes / ≤6 steps even with **zero** index coverage of their niche (A-006 rescue).
- No screen can render a dead end: every empty/denied/failed state offers a next action (testable, Doc 26).
- Alex can navigate between two clients' campaigns in ≤2 interactions.

#### Detailed Content

**Part A — Object Model & Hierarchy (canonical)**

**A1. Two-layer model (ADR-013 — Accepted: workspace-shell navigation over a global creator layer)**
- **Global layer:** Creator/Profile records + enrichment (shared index, ADR-008). Navigationally, a Creator page is *one canonical screen* wherever reached from.
- **Workspace lens:** everything else — lists, campaigns, timeline, consent, notes, reveals, budgets — renders *into* the Creator page as workspace-scoped panels (Doc 9 FS-04.04 Relationship panel). Consequence: no duplicate "creator in list" vs. "creator in campaign" pages; one creator, many contexts. This kills the classic CRM navigation smell of context-fragmented duplicate records.

**A2. Containment vs. reference (binding relationships)**
- Workspace **contains** Lists, Campaigns, Members, Settings, Ledger view.
- Lists and Campaigns **reference** Creators (many-to-many; adding to a campaign never removes from a list).
- Campaign **contains** Brief, Pipeline (stages containing creator-references), Tasks, Budget, Inbox-view, Performance.
- **Interaction Timeline is not a place** — it is a substrate (Doc 9 A1) surfaced as: (a) the Relationship panel on Creator pages, (b) the activity strip on campaign creator-cards, (c) workspace Activity feed. Users never "go to the timeline"; they meet it in context. (IA decision: prevents an unusable raw event log becoming a primary surface.)

**A3. Naming rule:** navigation labels use glossary terms verbatim (Lists, Campaigns, Search) — no synonyms ("Collections," "Projects") anywhere (consistency invariant, Doc 12 audit item).

**Part B — Global Navigation & Workspace Context**

**B1. App shell (persistent):**
- **Workspace switcher** (top-left): current workspace name/logo; menu lists memberships + "Create workspace" (entitlement-gated per A2/Doc 10). Switching swaps the entire shell context; in-flight unsaved edits prompt before switch. Zero cross-workspace bleed (NFR-S01 assertion at the UX layer: no mixed-workspace lists in any picker, ever).
- **Primary nav (sidebar):** `Search` · `Lists` · `Campaigns` · `Inbox` · `Analytics` · `Settings`. Six items, fixed order — deliberately flat (Philosophy #1; R-UX-001 mitigation). Admin/Owner additionally see `Billing` under Settings, not top-level.
- **Omnibar (top):** global creator lookup (name/handle/URL — transliteration-tolerant per Doc 8 A3; pasting a profile URL triggers add-by-URL flow UF-06 inline). Also does saved-search recall and command actions (S2).
- **Credit meter (persistent, top-right):** balance + hover breakdown (allowance vs. top-up per FS-08.03 ordering); turns amber/red at FS-07.03 thresholds; click → usage view. Cost transparency is a navigation-level citizen (R-PRD-003).
- **Notification tray:** per FS-07.03 catalog.

**B2. Screen inventory (primary, S1 scope):**

| ID | Screen | Home of (spec trace) |
|---|---|---|
| SCR-01 | Search & Discovery | FS-02.01/02/03/04; NL chips; live-search offer (A2 step 3) |
| SCR-02 | Creator Page (canonical) | FS-01.01/02/03/06; Relationship panel (FS-04.04); section-level gap states |
| SCR-03 | Lists index + SCR-03a List detail | FS-04.01/02/03/05 |
| SCR-04 | Campaigns index + SCR-04a Campaign home (Brief · Pipeline · Tasks · Budget · Inbox · Performance as tabs) | FS-05.01–05.05; FS-06.04 (campaign inbox tab) |
| SCR-05 | Inbox (workspace-level, cross-campaign) | FS-06.04 aggregate view |
| SCR-06 | Analytics (workspace overview) | FS-09.02 |
| SCR-07 | Settings (Profile · Members · Notifications · Integrations · Billing · Usage) | FS-07.01/03; FS-08.x customer surfaces; FS-06.01 mailbox connect |
| SCR-08 | Onboarding sequence | UF-00 |

URL-hierarchy principle: workspace-scoped paths nest under a workspace identifier; Creator pages are canonical per creator with workspace context applied by session (Mimo/Doc 20 detail; behavior binding: a shared creator link opened by another workspace member shows *their* workspace lens).

**Part C — UF-00: The Golden Path (J2 onboarding, A-023-proof)**

Design thesis: **when the index is thin, the user's own roster is the content.** The Data-Gap Ladder's step 5 (add-by-URL) is promoted from fallback to a first-class onboarding act, so the "empty index" worst case still produces a personally relevant, enriched first experience.

*Steps (target ≤5 min; instrumented per step for funnel telemetry):*
1. **Sign-up → workspace auto-created** (FS-08.04 trial; PKT/PKR defaults per FS-07.01). Single question asked: "What best describes you?" (Agency / Brand / Other) — branches copy only, not structure (keeps flow singular; R-UX-003).
2. **Intent capture:** "Who are you looking for?" — one NL search box with PK-relevant example chips ("fashion creators in Lahore", "tech reviewers, 50k–500k, PK audience"). Runs FS-02.02 with editable interpretation chips.
3. **Branch on result density (the A-023 hinge):**
   - **≥8 strong results:** ranked results with explanation badges (CC-001) → proceed to step 4.
   - **Thin results (1–7):** results shown *plus* an honest banner: "Our Pakistan index is growing. Add any creator by link and we'll analyze them in minutes" → paste-URL affordance inline.
   - **Zero results:** full-screen pivot (never a blank list): "Bring your creators — paste any Instagram/TikTok/YouTube link" + 3 seeded showcase creators from the validation-panel index (pre-enriched, guaranteed-rich examples so the *capability* is demonstrable even when the *query* fails).
4. **First enrichment moment (the "aha"):** user opens one creator (search result or their own added URL) → SCR-02 renders progressively: header instantly, then authenticity module with **evidence breakdown** (A4 triple) — this explainability reveal is scripted as *the* wow beat. Trial credits absorb the enrichment (quoted per Doc 8 A5 confirm-first rule, framed as "using 1 of your 25 free credits").
5. **Capture value:** one-tap "Save to List" → first list auto-named from the query.
6. **Multiply value (soft close):** "Invite a teammate" + "Turn this list into a campaign" cards — both skippable; onboarding never blocks exploring.

*Failure states:* enrichment provider timeout at step 4 → seeded showcase creator substituted with apology microcopy + queued notification for their creator (FS-07.03) — the wow beat happens on *a* creator even if not *their* creator. Add-by-URL invalid link → inline correction, platform examples. All exits from onboarding resumable via a persistent checklist widget (dismissible; gone after completion or 7 days).

**Part D — J1 Core Flows: Agency Alex (UF-A) and Brand Bianca (UF-B)**

**UF-A1 — New client campaign setup** (J1:1–2)
Entry: SCR-04 → "New campaign" → client picker (create client inline, FS-05.01) → structured brief with machine-readable criteria → **"Find creators for this brief"** deep-links to SCR-01 pre-filtered from the criteria block (the J1 stage-1→2 seam closure, Doc 9). Branch: Alex may instead attach an existing List to the pipeline (agencies reuse rosters — reference model per A2 makes this trivial).

**UF-A2 — Vet & shortlist for client approval** (J1:3–4)
SCR-01 results → multi-select → "Add to List" → SCR-03a working list → per-creator vetting on SCR-02 (authenticity evidence, PK/GCC audience-geo splits per FS-02.01 filters — the export-agency signature move) → list comments between team members (FS-04.02) → **client approval v1 = entitlement-gated CSV export** (known limitation; "client portal lite" S2 candidate per Doc 9 gap — Alex's workaround is spec'd honestly, not hidden).

**UF-A3 — Outreach & negotiation across the pipeline** (J1:5–6)
SCR-04a Pipeline → drag creator `Prospect → Contacted` prompts channel choice: email compose (template + variables, FS-06.02) or WhatsApp click-to-chat (S1, FS-06.06) → sends/logs land in Timeline → replies surface in Campaign Inbox tab with awaiting-reply filter → stage moves any-to-any with reason codes on drops → `rate_recorded` prompt on move to `Agreed` (a deliberate micro-friction: relationship memory demands the rate be captured at the moment it exists — one field, currency pre-set).

**UF-A4 — Multi-client context switching**
Alex's reality-check flow: SCR-04 index groups campaigns **by client**; switching client contexts = one click within the same workspace (clients are workspace-internal entities, *not* separate workspaces — decision: agencies get one workspace per agency, clients as entities; separate workspaces per client remains possible but unrecommended; documented trade-off below). ≤2 interactions requirement satisfied.

**UF-B1 — Fraud-safe creator selection (Bianca's trust journey)** (J1:2–3)
SCR-01 with authenticity-band filter ≥ Moderate → SCR-02 evidence review — including diaspora-calibrated framing (R-PRD-006: evidence text must present GCC-audience share neutrally, never as an implied red flag) → contact reveal (quoted, FS-01.03) → save to list.

**UF-B2 — Campaign execution & budget watch** (J1:6–7)
SCR-04a → Budget tab: planned vs. committed auto-summing agreed rates (FX-normalized PKR/USD, FS-05.03) → over-budget warning state (warn-not-block) → tasks/milestones for deliverables → manual outcome recording (FS-05.05) at `Published`.

**UF-B3 — Repeat collaboration (relationship-memory payoff)** (J1:8)
Entry: new campaign brief → "Suggested: creators you've worked with" module (Timeline-derived: past `Agreed`+positive outcomes) → SCR-02 Relationship panel shows last rate + past performance → re-outreach pre-filled with history context. **This flow is the Wedge-#2 demo** and must exist in S1 even in minimal form (spec: module appears once workspace has ≥1 completed campaign).

**UF-06 — Add-by-URL (global affordance):** paste URL anywhere (omnibar, search, lists) → validate → queued enrichment with progress state → notification on ready (FS-07.03) → creator lands in origin context (search results/list). This is the index-growth engine (R-TEC-003 hedge) and must be frictionless from every surface.

**Part E — Cross-Cutting UX State Catalog (binding on every screen)**

| State class | Behavior contract |
|---|---|
| **Empty (no data yet)** | Never blank: explain + primary action (e.g., empty pipeline → "Add creators from a list or search"). Each SCR's empty state enumerated in Doc 13 inventory |
| **Data-gap (partial creator data)** | Doc 8 A2 states verbatim: section-level "not available" + deep-enrichment CTA; staleness badges + refresh |
| **Credit quote/confirm** | Any metered action: cost shown before execution; balance-after preview; insufficient balance → top-up prompt with exact shortfall (A2/Doc 10 denial reasons) |
| **Entitlement denial** | Machine-readable reason → human message + upgrade path; never a dead modal |
| **Read-only (billing states)** | Persistent banner (state-specific: past-due vs. paused vs. trial-expired per FS-08.02); all data visible; blocked actions render disabled-with-reason, not hidden (users must see what they're missing — conversion honesty) |
| **Degraded (provider/AI down)** | Doc 8 fallback ladders: honest unavailability + non-AI alternative path |
| **Destructive confirmations** | Archive-first policy: campaigns/lists archive (recoverable) rather than delete; true deletion only in Settings with typed confirmation |

#### Dependency Mapping

- **Depends on:** Docs 7–10 (all FS), Audit #1 amendments (PK personas, A-006 downgrade), ADR-007/008/013.
- **Enables:** Doc 12 (interaction standards per state catalog), Doc 13 (component inventory per screen inventory), Doc 20 (URL/resource hierarchy alignment), Doc 26 (flow-level E2E test scripts map 1:1 to UF IDs), Mimo frontend build order.
- **Blocks:** Doc 13 component inventory blocked until this screen inventory approved.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-035 | Clients-as-entities (one workspace per agency) matches PK agency operating reality | Medium | S1 partner observation | Workspace-per-client pattern support; RBAC pull-forward pressure |
| A-036 | Onboarding step-3 zero-result branch occurs in <30% of S1 signups (index seeding works) | Low-Med | UF-00 funnel telemetry | Golden Path re-weighting toward add-by-URL-first |
| A-037 | Six-item flat nav accommodates S2 additions (WhatsApp inbox, reports) without restructure | Med-High | Doc 12/13 stress test | Nav grouping revision |
| A-038 | Rate-capture micro-friction at `Agreed` achieves >60% capture without workflow abandonment | Medium | S1 telemetry | Optional-field fallback; memory quality degrades |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-UX-005 | UX | Golden Path's honesty banners ("index is growing") read as weakness, damaging premium positioning | M | M | Copy testing with S1 partners; frame as freshness/curation, never apology; showcase creators guarantee capability proof |
| R-UX-006 | UX | Client-as-entity model insufficient for agencies needing hard client data separation | M | M | A-035 validation; workspace-per-client escape hatch documented |
| R-UX-007 | UX | Canonical Creator page overloads (intelligence + relationship + actions) | M | H | Progressive disclosure zones (Doc 12 owns section prioritization); NFR-U02 audit |
| R-UX-008 | UX | Onboarding branch logic (step 3) complicates funnel analysis and Mimo build | L | M | Branches share instrumentation schema; single flow ID with branch tags |
| R-PRD-008 | Product | UF-B3 memory module underwhelms with sparse S1 data (cold-start on our own wedge) | M | M | Module gated on ≥1 completed campaign; S1 partner data seeds it fast in agency contexts |

#### Alternatives Considered & Trade-offs

- **Workspace-per-client for agencies** — rejected as default: fragments Alex's cross-client view, multiplies billing/seat complexity; retained as escape hatch (trade-off documented for A-035 review).
- **Timeline as a top-level nav destination** — rejected: raw event streams are archaeologically interesting and operationally useless; contextual surfacing chosen (A2).
- **Wizard-style multi-step onboarding with role/team/goals questionnaires** — rejected: every question before the aha moment taxes A-006's 5-minute budget; single intent question chosen.
- **Hiding blocked features in read-only states** — rejected: disabled-with-reason converts better and is honest (aligns with explainability culture).
- **Search architecture note (Living Thread):** IA assumes progressive result rendering and editable NL chips regardless of the ADR-SEARCH-001 outcome; no IA element constrains the Doc 15 decision — verified.

#### Gap Analysis Report

- Coverage matrix (FS → SCR mapping completeness) drafted for Parts B/D but not exhaustively enumerated here — **Qwen review artifact to be generated at Doc 13** (every FS row must land on a screen/component).
- Urdu UI localization posture undefined (S1 English confirmed; S2+ open) → logged to OD-002.
- Workspace Activity feed (A2c surface) named but under-spec'd — assigned to Doc 12 as a minor surface.
- Notification tray interaction detail deferred to Doc 12 (catalog exists, FS-07.03).
- Keyboard/power-user navigation (agencies live in this tool daily) unaddressed — assigned to Doc 12 interaction standards.

#### Cross-References & Decision Traceability

**ADR-013 (workspace-shell over global creator layer; responsive web only S1/S2) — Accepted.** Implements the UX obligations of: Doc 8 A2 (ladder states), A4 (evidence display), A5 (quote states); Doc 9 A1–A3 (timeline surfacing, channel choice, consent-blocked sends render as disabled-with-reason); Doc 10 A2 (denial reasons), FS-08.02 (billing-state banners). Discharges audit handoffs R-UX-003 (golden path), R-UX-004 (gap-state design), R-OPS-004 (read-only clarity). UF-B3 operationalizes Wedge #2; CC-001 explanation badges placed at SCR-01.

#### Open Questions & External Dependencies

1. OD-002: Urdu UI for S2 — partner demand signal needed.
2. A-035: client-separation depth — observe first 5 agency partners.
3. Showcase-creator set (step-3 zero-result branch): requires validation-panel creators cleared for demo use (consent/legal check → Doc 28).
4. Does the omnibar's add-by-URL need rate-limiting against scraping-abuse patterns? (→ Doc 21.)

#### Future Revision Triggers

UF-00 funnel telemetry: any step >25% drop-off; A-036 breach (zero-result branch >30%); A-035 invalidation; S2 WhatsApp inbox arrival (nav stress test per A-037); client-portal-lite promotion (would add SCR-09 and revise UF-A2).

#### Review Checklist & Validation Criteria

- [ ] Every screen has enumerated empty/denied/degraded states. ✅
- [ ] No flow terminates in a dead end. ✅
- [ ] Golden Path survives zero-coverage worst case. ✅
- [ ] Glossary-verbatim navigation labels. ✅
- [ ] No visual/component design decisions made (Docs 12–13 authority preserved). ✅
- [ ] Zero code. ✅
- [ ] Sign-off: CPO, Principal Architect (UX), Engineering Director; Qwen review against Docs 8–10 FS coverage.

---

[AWAITING APPROVAL]



---

<a name="doc-012"></a>
# DOC-012 — UX-UI Design Principles, Accessibility and Interaction Standards

#### DOC-012 — UX/UI Design Principles, Accessibility & Interaction Standards
**Status:** Draft v1.0 | **Phase:** 4 | **Owner:** Principal Architect (UX) | **Consumes:** Doc 11 (screens, flows, state catalog), Docs 7–10 (FS behaviors)

---

#### Executive Summary

This document defines how MUSHIN *behaves* — the interaction physics that make a ten-pillar platform feel simple (Philosophy #1) and make an 8-hour-a-day agency workday feel fast. It establishes: (1) **five behavioral design principles** with enforcement rules; (2) **interaction specifications for the hard states** — Data-Gap Ladder rendering, credit quote confirmations, read-only billing lockdowns, evidence disclosure; (3) the **power-user standard**: full keyboard operability, a `Cmd/Ctrl+K` command surface, bulk-action grammar, and perceived-performance budgets that bind Mimo's implementation; (4) **WCAG 2.1 AA accessibility standards** including bidirectional text handling (Urdu/English mixed content is a day-one PK reality, not an i18n afterthought); and (5) **progressive disclosure rules** that keep Starter users in a simple tool while enterprise complexity stays dormant until entitled. A key decision: **ADR-014 — undo-over-confirm**: reversible actions execute optimistically with undo; confirmation dialogs are reserved exclusively for irreversible or credit-consuming actions, preserving both speed and the sanctity of the metered-action quote.

#### Purpose & Scope

Behavioral standards binding on every screen (Doc 11 SCR inventory) and component (Doc 13): principles, state interactions, keyboard/power-user grammar, motion and latency budgets, feedback patterns, accessibility conformance, disclosure rules. Discharges Doc 11 handoffs: keyboard navigation, notification tray detail, Activity feed, R-UX-007 (Creator page overload).

#### Non-Goals

- Visual identity: color values, typography, iconography, spacing tokens (Doc 13).
- Component anatomy/inventory (Doc 13).
- Copy/tone guide (lightweight voice rules included only where interaction-relevant; full guide = Doc 13 appendix).
- Marketing site UX; Admin panel (minimal internal standard, one clause in Part F).
- Zero code (policy upheld).

#### Objectives & Success Criteria

- Every Doc 11 state-catalog class has a fully specified interaction pattern (no designer/Mimo improvisation on hard states).
- 100% of user-facing actions reachable by keyboard; power path exists for the top-20 agency actions.
- Perceived-performance budgets defined per interaction class and testable (Doc 26).
- WCAG 2.1 AA conformance criteria enumerated as release gates (NFR-U01).
- Disclosure rules stated as deterministic conditions (tier/entitlement/usage), not vibes.

#### Detailed Content

**Part A — Behavioral Design Principles (enforcement-grade)**

1. **Fast by perception, honest by default.** Every interaction acknowledges within 100ms (visual response), completes or shows determinate progress within budget (Part D), and never fakes completion of metered/irreversible actions. Optimism is for reversible actions only.
2. **The next action is always visible.** Dead-end prohibition (Doc 11 Part E) elevated to principle: every terminal state (empty, error, denied, zero-results) names its exit.
3. **Evidence before verdict, on demand.** Scores render collapsed-with-teaser (verdict + top evidence line); one interaction expands the full A4 triple. Explainability is never a separate page (killing the HypeAuditor copy-paste seam).
4. **Interruption is a last resort.** Modals only for: credit quotes, irreversible confirmations, and legal consents. Everything else is inline, non-blocking (toasts, banners, side panels).
5. **The system remembers so users don't.** Defaults learn: last-used templates, filters, currency, channel per creator. No repeated re-entry of known context (relationship memory as an interaction ethic, not just a feature).

**Part B — Hard-State Interaction Specifications**

**B1. Data-Gap Ladder rendering (Doc 8 A2 → motion behavior)**
- **Progressive skeleton standard:** SCR-02 renders in priority order — header (instant, from minimal data), then sections resolve independently: each section shows a *shaped skeleton* (mimicking final layout, no spinners) that resolves to content, partial-state, or gap-state. Sections never reflow already-rendered content (layout stability rule: reserved heights; no jumping while Alex is reading).
- **Gap-state anatomy:** muted section card = "Not available for this creator" + one-line reason class (insufficient data / not covered yet) + single CTA (*Request Deep Enrichment* with inline credit quote per B2). No red/error styling — gaps are neutral facts, not failures (R-UX-005 tone rule).
- **Staleness:** timestamp chip on every data section ("Data from 12 Jun"); past-TTL chips turn amber with refresh affordance; refresh runs in-place with section-level progress, never a page reload.
- **Live-fetch transitions (ladder step 3):** an explicit user act; button state sequence *quoted → confirmed → fetching (determinate where provider supports progress, indeterminate max 30s per NFR-P03) → resolved*; on timeout, section falls to gap-state with retry (never a blank).

**B2. Credit quote confirmation (the metered-action contract)**
- **Anatomy (uniform everywhere):** action label + cost in credits + balance-after preview + scope note (e.g., "applies to 37 creators") for bulk. Single confirm button carries the cost on its face ("Enrich — 37 credits").
- **Placement:** inline popover for single actions (anchored to the trigger, keyboard-dismissible); modal *only* for bulk (>1 creator) or high-cost (> configurable threshold) actions.
- **Session memory:** per Doc 8 A5, first-per-session confirmation for standard profile enrichment; subsequent same-type actions show a passive cost chip (no popover) with an always-visible running session spend in the credit meter. Rule: **suppression never applies to bulk or high-cost actions.**
- **Insufficient balance:** quote transforms in place into shortfall state ("Need 12 more credits") + top-up path; the intended action is preserved and auto-resumes post-top-up (no context loss through the Paddle checkout round-trip).

**B3. Read-only billing states (FS-08.02 → input behavior)**
- Persistent top banner, state-specific copy (past-due: "Payment issue — full access continues until <date>"; paused: "Workspace is read-only"). Banner is the *only* nagging surface — no per-click scolding.
- **Input restriction pattern:** blocked controls render visible-but-disabled with reason tooltip and (Owner/Admin only) a resolve action deep-linking to Billing. Text inputs become read-only (selectable/copyable — users must be able to extract their data frictionlessly; this is a trust covenant, and export remains enabled in read-only per FS-08.02).
- Sequences/automation show "paused by billing state" chips on affected objects — the *consequences* of the state are visible where work lives, not only in the banner.

**B4. Evidence disclosure (A4 triple interaction)**
- Collapsed: verdict band + confidence chip + strongest evidence line. Expand (click/`E` key): full evidence list, each item with direction icon, weight class, and data-basis footnote. Provider-attributed evidence visually distinguished from MUSHIN reasoning (Doc 8 FS-01.02 integrity rule). Confidence chip hover explains *why* confidence is Medium (data gaps enumerated). Diaspora-calibration tone rule (R-PRD-006): audience-geo evidence uses neutral phrasing patterns defined in the copy appendix (Doc 13).

**B5. Notification tray & Activity feed (Doc 11 handoffs, discharged)**
- Tray: grouped by category (FS-07.03 catalog), newest-first, unread markers; every notification deep-links to its context with the relevant object focused/highlighted on arrival. Bulk "mark read" per group. No notification without a destination (assertion).
- Activity feed (workspace, minor surface in Settings/Overview): filtered Timeline projection (member actions only, no system noise), 30-day window, read-only. Deliberately modest — it exists for accountability glances, not monitoring theater.

**Part C — Power-User Standard (PA-01, 8-hour-day grade)**

**C1. Command surface**
- `Cmd/Ctrl+K` opens the omnibar in command mode: fuzzy-matched actions ("new campaign", "go to <list>", "invite"), creator lookup, saved-search recall. Recent + context-aware ordering (on SCR-04a, campaign actions rank first). Every command-mode action also exists as a visible UI path (discoverability parity — commands accelerate, never gatekeep).

**C2. Global shortcut map (v1, binding; full reference sheet in-app via `?`)**
- `Cmd/Ctrl+K` command/omnibar · `G then S/L/C/I` go-to Search/Lists/Campaigns/Inbox (Gmail-style sequential keys) · `/` focus search on SCR-01 · `J/K` move through result/pipeline lists · `X` toggle-select · `Shift+X` range-select · `Enter` open focused creator (peek panel), `Shift+Enter` full page · `E` expand evidence · `N` new note on focused creator · `Esc` dismiss/close layer-by-layer · `Cmd/Ctrl+Z` undo last reversible action. Reserved namespace documented for S2 (channel compose, stage moves). No shortcut conflicts with browser/screen-reader defaults (accessibility co-constraint, Part E).

**C3. Bulk-action grammar (uniform across SCR-01/03a/04a)**
- Selection model: checkbox + `X`/`Shift+X`; persistent selection bar slides in with count + action set (contextual per surface, per FS-04.05 caps); "select all matching (≤500)" with explicit count.
- Execution: bulk actions run async with a progress toast → completion **receipt** (succeeded/failed/skipped + reasons, per Doc 9 FS-04.05) accessible from the tray. Partial failure never silently succeeds.
- Bulk + metered = always modal quote (B2 rule), showing per-unit and total cost.

**C4. Peek panel pattern**
- From any list/pipeline, `Enter` opens the creator as a right-side peek (SCR-02 condensed) preserving list position and selection state; `J/K` navigate *while peeking* (the vetting power loop: Alex reviews 30 creators without ever losing her place). Full page one keystroke away. This pattern is the single largest speed win for UF-A2 and is a **Must** for S1.

**C5. Optimistic UI & undo (ADR-014 — Accepted)**
- Reversible actions (list add/remove, tag, stage move, note save) execute optimistically with instant UI response + 8-second undo affordance (toast + `Cmd/Ctrl+Z`); background failure rolls back with a distinct error toast (rollbacks must be *loud* — silent reversion is data loss to the user's mental model).
- Irreversible or metered actions (sends, enrichments, reveals, deletions, member removal) are **never** optimistic: explicit confirm per B2/state catalog. The boundary list is maintained in Doc 13's component annotations (Qwen review artifact).

**Part D — Perceived-Performance Budgets (binding, testable)**

| Interaction class | Budget |
|---|---|
| Input acknowledgment (any click/key) | ≤100ms visual response |
| Navigation between screens (shell swap) | ≤200ms to skeleton, ≤1s to content (cached contexts) |
| Filtered search results | ≤1s p95 (NFR-P01); progressive rows |
| NL search | ≤3s p95 (NFR-P02); interpretation chips render *first* (≤800ms), results stream after — chips-first ordering makes latency legible |
| Peek panel open | ≤150ms (from cached list data) |
| Optimistic actions | Instant (0ms perceived); rollback ≤8s window |
| Enrichment/live fetch | Async, section-progress; ≤30s p95 (NFR-P03), then queue-and-notify |
| Motion standard | Micro-transitions 120–200ms ease-out; no animation >300ms on the critical path; all motion respects `prefers-reduced-motion` (Part E) |

Violation of a budget class in implementation = performance defect, triaged like a functional bug (Doc 26 test hooks; ties to Doc 23 real-user monitoring).

**Part E — Accessibility Standards (WCAG 2.1 AA, NFR-U01 — release-gate criteria)**

- **Keyboard:** 100% operability (Part C is also the a11y path); visible focus indicators everywhere (never suppressed); logical focus order; focus trapped in modals and returned to trigger on close; `Esc` layered dismissal.
- **Screen readers:** semantic landmarks per screen region; all icons labeled; dynamic updates (search streaming, bulk receipts, undo toasts) announced via live regions with polite/assertive discipline (assertive reserved for errors and billing-state changes); evidence expansion states programmatically exposed.
- **Contrast & color:** AA ratios (4.5:1 text, 3:1 UI components — value enforcement in Doc 13 tokens); **color is never the sole carrier** — authenticity bands and staleness states pair color with icon + text label (also protects meaning in exports/screenshots).
- **Bidirectional text (PK-critical, day one):** UI chrome is LTR English (S1), but creator bios, template bodies, notes, and messages will contain Urdu (RTL) and mixed Roman-Urdu/English. Standard: all user-content containers handle bidi isolation correctly (no punctuation scrambling, no layout breakage); RTL text renders right-aligned within its block; template editor and compose surfaces fully support RTL input. Full RTL UI mirroring is **out of scope** until OD-002 (Urdu UI) resolves — bidi *content* correctness is not optional.
- **Motion & vestibular:** `prefers-reduced-motion` collapses all transitions to fades/instant; no parallax/auto-playing motion anywhere.
- **Forms & errors:** labels always visible (no placeholder-as-label); errors inline, associated programmatically, described in text (never color-only); FS-06.02's missing-variable block renders as an accessible inline error.
- **Target sizes:** ≥44px interactive targets on touch layouts (responsive web per ADR-013).
- Conformance verification: automated checks + manual audit per release (process detail → Doc 26); known-issues register public to the team.

**Part F — Progressive Disclosure Rules (Philosophy #1/#4; R-UX-007 discharge)**

- **Rule 1 — Entitlement-dormant:** UI for un-entitled features renders in exactly two sanctioned forms: (a) hidden entirely (default for S3 enterprise: SSO, audit exports, granular RBAC — Starter users never see enterprise furniture), or (b) visible-teaser (sanctioned upsell list, CPO-controlled: WhatsApp S2 channel chip, advanced reports). Nothing else may leak.
- **Rule 2 — Usage-graduated:** advanced affordances appear after demonstrated need: bulk-action bar appears on first multi-select; saved-search prompt after 3 similar queries; keyboard-shortcut hints surface contextually after repeated pointer use of the same action (max 1 hint/session — no nagging).
- **Rule 3 — Creator-page zones (SCR-02 overload control):** fixed zone priority — Zone 1: identity + verdict summaries (always visible); Zone 2: evidence + audience detail (one expand away); Zone 3: relationship/workspace panels (persistent side rail, collapsed on narrow viewports); Zone 4: history/raw metrics (tab). Zone assignments are Doc 13 inventory annotations; moving content between zones requires CPO sign-off (this is the anti-clutter constitution).
- **Rule 4 — Settings austerity:** any setting with a sane universal default ships without UI v1; settings earn their existence via support-ticket evidence (settings sprawl is deferred complexity, not flexibility).
- **Admin panel clause:** internal tool follows Parts C/E (keyboard, a11y) but is exempt from disclosure rules and visual polish standards (Doc 10 gap, closed).

#### Dependency Mapping

- **Depends on:** Doc 11 (state catalog, screens, flows), Docs 8–10 (FS behaviors), ADR-013/014, NFR-U01/U02, NFR-P01–03.
- **Enables:** Doc 13 (tokens/components must implement these behaviors), Doc 26 (budget + a11y + assertion test classes), Mimo frontend implementation, Doc 23 (RUM metrics = Part D budgets).
- **Blocks:** Doc 13 cannot finalize component states without Part B/C patterns (now unblocked on approval).

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-039 | Gmail-style sequential shortcuts (`G then X`) are learnable by PK agency users without training | Med-High | S1 usage telemetry + `?` sheet views | Simplify to single-modifier map |
| A-040 | Peek-panel vetting loop achievable within performance budgets on mid-range hardware/bandwidth (PK connectivity reality) | Medium | S1 field testing on representative devices/networks | Budget relaxation or lighter peek payload |
| A-041 | Session-suppressed quotes (B2) don't reintroduce bill shock | Med-High | Support-ticket + refund telemetry | Re-enable per-action confirms |
| A-042 | Bidi content correctness achievable via standard platform text handling (no custom text engine — ADR-002) | High | Doc 13 implementation check | Scoped bidi fixes; never custom engine |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-UX-009 | UX | Power-user grammar intimidates non-technical brand users (PB-02) | M | M | Rule 2 graduation: shortcuts are invisible until earned; pointer paths always complete |
| R-UX-010 | UX | Optimistic-UI rollbacks erode trust if backend reliability is poor early on | M | H | ADR-014 boundary discipline; rollback loudness; reliability SLO dependency (Doc 23) — if error rate >1%, optimism is narrowed, not patched |
| R-UX-011 | UX | Performance budgets unachievable on PK network conditions (latency to cloud regions) | M | H | Region selection input to Doc 22; aggressive caching; budgets measured at p95 *from PK* — binding measurement locale |
| R-UX-012 | UX | A11y treated as post-launch polish under schedule pressure | M | M | Release-gate framing (Part E) + Doc 26 automation; NFR-U01 is S2-gated but structural choices are day-one |
| R-PRD-009 | Product | Disclosure Rule 4 (settings austerity) frustrates early power customers wanting knobs | L | M | Support-evidence pathway is fast (weekly triage); escape hatch documented |

#### Alternatives Considered & Trade-offs

- **Confirmation-heavy safety model** — rejected: taxes the 8-hour user hundreds of times daily; ADR-014's undo-over-confirm chosen with a strict irreversibility boundary.
- **Spinner-based loading** — rejected: shaped skeletons + progressive sections communicate *what* is coming and preserve layout stability (B1).
- **Full RTL UI mirroring now** — rejected: no S1 demand evidence, large surface cost; bidi content correctness (the actual day-one need) mandated instead.
- **Customizable dashboards/layouts** — rejected v1: personalization is complexity debt before PMF; Rule 3 fixed zones chosen (revisit trigger below).
- **Search architecture note (Living Thread):** chips-first NL rendering (Part D) is architecture-agnostic and actually *widens* ADR-SEARCH-001 options by decoupling interpretation latency from retrieval latency — verified no constraint added.

#### Gap Analysis Report

- Copy/voice appendix (including R-PRD-006 neutral-phrasing patterns and R-UX-005 honesty-banner tone) deferred to Doc 13 — owner assigned (UX + CPO).
- Empty-state full enumeration per SCR deferred to Doc 13 inventory (flagged in Doc 11, unchanged).
- Touch/mobile-web interaction deltas (bulk selection without hover, peek panel on small viewports) named but not fully specified — Doc 13 responsive annotations must close this.
- In-app shortcut reference (`?` sheet) needs content design — Doc 13.
- Measurement methodology for "p95 from PK" (RUM segmentation) → Doc 23 requirement stub created.

#### Cross-References & Decision Traceability

**ADR-014 (undo-over-confirm; optimism boundary) — Accepted.** Discharges Doc 11 handoffs (keyboard nav, tray, Activity feed, R-UX-007 via Rule 3). Operationalizes NFR-U01 (Part E as release gates), NFR-U02 (Part F), NFR-P01–03 (Part D budgets + measurement locale), Doc 8 A4/A5 (B2/B4), Doc 9 FS-04.05 (C3 receipts), Doc 10 A2/FS-08.02 (B3). R-UX-011 hands a region-selection constraint to Doc 22 (infrastructure) — first Phase-7 dependency emitted from UX.

#### Open Questions & External Dependencies

1. Representative PK device/network test matrix (A-040) — Engineering Director to define with S1 partners.
2. High-cost threshold value for B2 modal escalation (needs Catalog v1 / OD-001 pricing).
3. OD-002 (Urdu UI) — unchanged, S1 evidence pending.
4. Cloud region latency data from PK (feeds R-UX-011 → Doc 22).

#### Future Revision Triggers

RUM data breaching any Part D budget at p95-from-PK; a11y audit failures at S2 gate; shortcut adoption <10% among agency users at S1 end (A-039 review); rollback rate >1% (R-UX-010 narrowing); ≥3 customer requests for layout customization (Rule 3/4 revisit).

#### Review Checklist & Validation Criteria

- [ ] Every Doc 11 state class has an interaction spec (B1–B5 coverage). ✅
- [ ] Keyboard parity: no pointer-only action exists. ✅
- [ ] Metered actions can never execute without a visible cost. ✅
- [ ] Optimism boundary enumerated and testable. ✅
- [ ] AA criteria framed as release gates with owners. ✅
- [ ] No visual-design decisions leaked from Doc 13's authority. ✅
- [ ] Zero code. ✅
- [ ] Sign-off: CPO, Principal Architect (UX), Engineering Director; Qwen review against Doc 11 state catalog completeness.

---

[AWAITING APPROVAL]



---

<a name="doc-013"></a>
# DOC-013 — Design System Specification and Component Inventory

Generating the Phase 4 finale.

---

#### DOC-013 — Design System Specification & Component Inventory
**Status:** Draft v1.0 | **Phase:** 4 | **Owner:** Principal Architect (UX) | **Consumes:** Doc 11 (SCR inventory, state catalog), Doc 12 (interaction standards, budgets, a11y gates)

---

#### Executive Summary

This document specifies MUSHIN's design system: a **three-tier token architecture** (primitive → semantic → component), the foundational scales (color semantics with AA-enforced contrast, typography with Urdu-capable fallbacks, a 4px spacing grid, motion tokens bound to Doc 12's budgets), the **anatomy of the twelve keystone components** that carry the product's hardest behaviors (Creator Card, Evidence Panel, Credit Quote, Pipeline Card, Peek Panel, and others), and the **Component-to-Screen coverage matrix** — the Qwen review artifact promised in Doc 11 — guaranteeing every screen can render its empty, loading, degraded, denied, and error states from inventoried parts. One material constraint is surfaced honestly: **brand visual identity does not yet exist** (Doc 6 flagged gap). The system is therefore specified **brand-forward**: all semantic and component tokens are final; primitive brand values (accent hues, display typeface) are single-point-swappable placeholders. Mimo can build the entire system now; branding lands later as a token update, not a refactor (**ADR-015**).

#### Purpose & Scope

Token architecture and naming, foundational scales, elevation/motion/breakpoint systems, keystone component anatomy with mandatory state coverage, full component inventory mapped to SCR-01…08, copy/voice appendix (discharging Doc 12's deferral), and design-system governance rules.

#### Non-Goals

- Brand identity creation (logo, brand palette, display typeface) — external dependency, tracked below.
- Marketing-site design system (separate, lighter artifact; out of scope).
- Admin panel visual polish (Doc 12 Part F clause: keyboard + a11y compliant, exempt from brand polish).
- Illustration/iconography *content* (icon set = licensed library per ADR-002; usage rules included, drawing icons is not our business).
- Dark mode — deferred (revision trigger below).
- Zero production code: tokens are specified as named design values; implementation format (CSS variables etc.) is Mimo's domain.

#### Objectives & Success Criteria

- Every component ships with all seven mandatory states defined (default / hover-focus / active / disabled-with-reason / loading-skeleton / empty / error).
- Coverage matrix: every SCR × state-catalog cell resolves to inventoried components — zero improvisation during build.
- Brand swap requires changes **only** at the primitive tier (testable: semantic layer references no raw values).
- All color-pair usages meet AA ratios by construction (contrast enforced at the semantic-pairing level, not per-screen audits).

#### Detailed Content

**Part A — Token Architecture (ADR-015 — Accepted: three-tier, brand-forward)**

**A1. Tiers & naming**
- **Primitive:** raw values — `color.blue.600`, `space.4`, `font.size.14`. The *only* tier containing raw values; brand-pending values live here as placeholders.
- **Semantic:** meaning-bound aliases — `color.bg.surface`, `color.text.primary`, `color.accent.action`, `color.feedback.warning`, `space.section-gap`. Components may reference **only** semantic tokens (lint-enforceable rule for Mimo).
- **Component:** scoped overrides where needed — `card.creator.border`, `quote.modal.emphasis`. Used sparingly; each requires a justification note in the inventory.

**A2. Color semantics (contrast-enforced pairs)**
- **Neutrals (9-step):** backgrounds (`bg.canvas`, `bg.surface`, `bg.raised`), borders (subtle/default/strong), text (`text.primary` ≥7:1 on surface, `text.secondary` ≥4.5:1, `text.disabled` — decorative only, never sole information carrier).
- **Accent (brand-pending primitive):** `accent.action` (primary buttons, links, focus rings — placeholder: accessible indigo family), `accent.selected`. AA-tested against both `bg.surface` and `bg.canvas` as a *pairing contract* — any future brand hue must pass the same pairs before adoption (brand-swap gate).
- **Feedback set:** `feedback.success/warning/danger/info` — each defined as a triad (subtle-bg / border / strong-text) so inline states compose correctly. Danger reserved per Doc 12 (errors, destructive, rollback toasts) — **never** for data-gap states (B1 tone rule: gaps use neutrals).
- **Domain semantics (product-specific, the important ones):**
  - `authenticity.strong/moderate/weak` — triads paired with mandatory icon+label (Doc 12: color never sole carrier). Hue guidance: green/amber/red families *avoided* for the weak band's default rendering in evidence contexts — weak-signal is rendered amber, reserved red strictly for confirmed-fraud evidence lines (R-PRD-006 tone protection: "weak data" must not scream "fraudster").
  - `staleness.fresh/aging/stale` — timestamp chips (neutral/amber pairing per Doc 12 B1).
  - `credit.balance.ok/low/critical` — meter states (FS-07.03 thresholds).
  - `dataviz.categorical.1–6` + sequential ramp — colorblind-safe set, AA against surface for labels.
- **Billing-state banners:** `banner.info` (trial), `banner.warning` (past-due), `banner.neutral-locked` (read-only) — deliberately not danger-red (Doc 12 B3: no scolding).

**A3. Typography**
- **Family:** v1 = platform-native system stack (performance on PK mid-range devices per A-040 — zero font-download cost) **plus mandatory Urdu-capable fallback chain** (Noto-class Nastaliq/Naskh fallback for RTL runs) so bidi content (Doc 12 Part E) renders correctly in cards, notes, templates, and compose surfaces from day one. Brand display typeface, if later adopted, slots at the primitive tier for headings only (body remains system for performance) — pre-decided to prevent future rebrand-driven regression.
- **Scale (px):** 12 (meta/chips) · 13 (dense-table) · 14 (body-default, the workhorse — 8-hour readability) · 16 (emphasized body/inputs) · 20 (section titles) · 24 (page titles) · 32 (onboarding/display only). Line-heights: 1.5 body, 1.3 headings, 1.4 dense-table. Weights: 400/500/650 (semantic: `regular/medium/strong`). Minimum UI font size 12px, never below (a11y floor).
- **Numeric rule:** tabular figures for all metrics, credits, currency (columns must align in tables and the ledger view).

**A4. Spacing, radii, elevation, breakpoints**
- **Grid:** 4px base; scale 4·8·12·16·24·32·48·64. Semantic aliases: `inline-gap` 8, `control-pad` 12, `card-pad` 16, `section-gap` 24, `page-gutter` 24/32 (breakpoint-dependent). Density note: MUSHIN is a work tool — default density is **compact-professional** (14px body / 12-pad controls), not marketing-airy.
- **Radii:** 4 (controls/chips) · 8 (cards/panels) · 12 (modals) · full (avatars/pills).
- **Elevation (4 levels):** flat (canvas) · raised (cards: border + subtle shadow) · overlay (peek panel, popovers) · modal (quote modals, dialogs + scrim). Elevation communicates *interruption weight* — aligned to Doc 12 Principle 4 (peek < modal).
- **Breakpoints:** `sm` <640 (single column, touch targets ≥44px, selection via long-press — closing Doc 12's touch-delta gap) · `md` 640–1024 (side rail collapses per Zone 3) · `lg` 1024–1440 (canonical desktop) · `xl` >1440 (max content width 1440, no infinite stretching).

**A5. Motion tokens**
- `motion.instant` 0ms (optimistic actions) · `motion.quick` 120ms (hover/chips) · `motion.standard` 180ms (panels, expansion) · `motion.deliberate` 280ms (modals only — the ceiling; Doc 12: nothing >300ms on critical path). Easing: ease-out for entrances, ease-in for exits. Skeleton shimmer: one subtle 1.2s loop, disabled under `prefers-reduced-motion` (all motion tokens collapse to `instant` under that preference).

**Part B — Keystone Component Anatomy** (the twelve components carrying Docs 8–12's hardest behaviors; each ships with the seven mandatory states)

1. **Creator Card (list/grid variant)** — avatar, name + platform chips, follower/engagement tabular metrics, **authenticity chip (band icon+label+color)**, ranking-explanation badge slot (CC-001, SCR-01 only), selection checkbox (`X` key target), staleness chip. Zone-1-only content (Rule 3): no evidence detail on cards. Skeleton: shaped per A-shape stability rule.
2. **Pipeline Stage Card** — Creator Card condensed + stage-specific strip: owner avatar, last-interaction age, agreed-rate chip (once recorded), next-task due, cross-campaign presence dot (FS-05.02), awaiting-reply indicator. Drag handle + keyboard-move affordance (a11y parity for drag interactions — move via menu/`M` key; drag is enhancement, not requirement).
3. **Evidence Disclosure Panel** (Doc 12 B4) — collapsed verdict band (band chip + confidence chip + strongest-evidence line + expand affordance/`E`); expanded: evidence rows (direction icon, weight-class label, statement, data-basis footnote), **provider-attributed rows visually distinct** (bordered + "via provider" tag), confidence explainer hover, missing-data enumeration. This component is the productized Wedge #1 — its polish bar is the highest in the system.
4. **Credit Quote (popover + modal variants)** (Doc 12 B2) — action label, cost, balance-after, scope note (bulk), confirm-with-cost-on-button, insufficient-balance transform state (shortfall + top-up + preserved-intent). Modal variant adds per-unit/total breakdown table.
5. **Peek Panel** (Doc 12 C4) — right overlay, SCR-02 condensed (Zones 1–2 + Relationship summary), `J/K` pass-through navigation, "open full" affordance, position-preserving close.
6. **Section Gap Card** (Doc 8 A2 / Doc 12 B1) — neutral styling, reason class line, single CTA (deep-enrichment quote inline), never danger-colored.
7. **Selection Action Bar** (Doc 12 C3) — slide-in, count, contextual actions, select-all-matching (≤500) with count, bulk-receipt link post-execution.
8. **Billing State Banner** (Doc 12 B3) — state-specific copy slots, resolve deep-link (role-gated), non-dismissible variants for read-only states, single-instance rule (one banner max; priority order: billing > degraded-provider > informational).
9. **Toast & Undo** (ADR-014) — success/undo variant (8s countdown affordance, `Cmd/Ctrl+Z` binding), loud-rollback variant (danger triad + persistent until acknowledged), progress variant (bulk ops → receipt).
10. **Interpretation Chips** (FS-02.02) — editable chip row (field:value, edit-in-place, remove, add), chips-first render slot above streaming results (Doc 12 Part D ordering), Urdu/bidi-safe chip content.
11. **Timeline Entry** — icon per event type (Doc 9 A1 taxonomy), actor attribution (incl. "former member" and dual-attributed impersonation variants per FS-07.01/10.02), relative+absolute timestamp, payload preview, channel tag. Dense-list rendering (Relationship panel, activity strip contexts).
12. **Credit Meter** — persistent shell component: balance, allowance-vs-topup hover breakdown (FS-08.03 ordering), threshold states, running session-spend line (Doc 12 B2), click-through to usage.

**Supporting inventory (standard components, anatomy abbreviated):** buttons (primary/secondary/tertiary/danger; loading + disabled-with-reason states), inputs & form fields (visible labels, inline errors, RTL-capable), select/combobox, date picker, tag/badge system, avatar & avatar-stack, tabs, side rail (Zone 3 collapsible), data table (tabular figures, sortable, sticky header, row-focus for `J/K`), modal & confirm-dialog (irreversible-action variant with typed confirmation per Doc 11 Part E), popover, tooltip (also keyboard-triggerable), empty-state block (illustration slot + explain + primary action — Principle 2 enforced structurally), skeleton set (card/row/section shapes), notification item, progress (bar + determinate/indeterminate), file attachment chip, comment thread block, stage column (pipeline container), omnibar/command palette (Doc 12 C1), shortcut-hint chip + `?` reference sheet layout (closing Doc 12 gap), FX-annotated currency display (PKR/USD with rate-timestamp tooltip per FS-05.03).

**Part C — Component ↔ Screen Coverage Matrix (Qwen review artifact, S1 scope)**

| SCR | Keystone components | State-catalog coverage confirmed |
|---|---|---|
| SCR-01 Search | Creator Card (+explanation badge), Interpretation Chips, Selection Bar, Credit Quote (live-search offer), empty-state block (zero-results → UF-00-style pivot), skeletons | Empty ✅ Loading ✅ Degraded (provider-down → filters-only notice) ✅ Quote ✅ |
| SCR-02 Creator Page | Evidence Panel, Section Gap Card, staleness chips, Timeline Entry (Relationship panel), Credit Quote (reveal/refresh/deep-enrich), Peek variant | Gap ✅ Stale ✅ Loading (zoned skeletons) ✅ Denied (entitlement) ✅ |
| SCR-03/03a Lists | Data table / Creator Cards, Selection Bar, comment blocks, file chips, export quote, empty-state | Empty ✅ Bulk receipt ✅ Denied (export gate) ✅ |
| SCR-04/04a Campaigns | Stage columns + Pipeline Cards, brief form set, budget table (FX display), task rows, campaign-inbox thread list, Toast/Undo (stage moves), rate-capture micro-form | Empty pipeline ✅ Over-budget warn ✅ Loading ✅ |
| SCR-05 Inbox | Thread list rows, channel tags, awaiting-reply filter chips, compose surface (RTL-capable, template variables with missing-variable inline error) | Empty ✅ Send-blocked (consent/eligibility disabled-with-reason) ✅ |
| SCR-06 Analytics | Metric cards (definition tooltips per FS-09.01), dataviz set, empty-state ("complete a campaign to see…") | Empty ✅ Partial-data ✅ |
| SCR-07 Settings | Form sets, member table, integration connect cards (OAuth states: connected/revoked/error per FS-06.01), Billing surfaces (Paddle-hosted checkout handoff state, ledger table, usage view), notification prefs matrix | Revoked-token ✅ Read-only ✅ Pending-activation (webhook race) ✅ |
| SCR-08 Onboarding | Intent search box + example chips, showcase Creator Cards, add-by-URL input (validate states), checklist widget, credit-framing quote variant | Zero-result pivot ✅ Enrichment-timeout substitute ✅ |
| Shell (all) | Workspace switcher, sidebar nav, omnibar, Credit Meter, notification tray, Billing Banner, Toasts | Switch-with-unsaved-edits ✅ Banner priority ✅ |

Matrix rule: any future screen/state addition must extend this table **before** build (governance, Part E).

**Part D — Copy & Voice Appendix (discharges Doc 12 deferral)**

- **Voice:** plain, precise, unafraid of numbers; never cute during work, warmth allowed in onboarding/empty states. No exclamation marks in operational UI.
- **Honesty-banner pattern (R-UX-005):** frame growth, never apology — sanctioned: *"Our Pakistan index grows daily — add any creator and we'll analyze them in minutes."* Prohibited: "Sorry", "unfortunately", "we don't have".
- **Diaspora-neutral evidence phrasing (R-PRD-006):** sanctioned pattern: *"Audience: 48% Pakistan, 22% UAE, 9% UK — consistent with PK creators with Gulf diaspora reach."* Prohibited: any phrasing implying foreign audience share is itself suspicious. Fraud statements only on fraud-family evidence (e.g., *"31% of sampled followers show bot-like patterns"*).
- **Cost phrasing:** always concrete units ("3 credits"), always on the button, never "premium feature" euphemisms.
- **Denial phrasing:** state the limit + the path ("Growth plan includes 5 seats — upgrade to add more"), never bare "permission denied."
- **Error phrasing:** what happened + what we did + what you can do ("Couldn't refresh this profile. Your credits weren't used. Try again or check back later.") — credit-safety reassurance is mandatory in metered-action errors (pairs with FS-08.03 reversal contract).

**Part E — Governance**

- New component or state → inventory PR: anatomy, seven states, semantic-token-only check, matrix row, a11y notes. CPO+UX sign-off for keystone changes; Zone reassignments per Doc 12 Rule 3 constitution.
- **Brand-swap gate (ADR-015):** brand adoption = primitive-tier PR passing the A2 pairing contrast contract + visual regression sweep. Nothing else may change.
- Deprecation: components marked deprecated remain in inventory with replacement pointer for one release cycle minimum.

#### Dependency Mapping

- **Depends on:** Docs 11–12 (screens, states, interaction standards, budgets, a11y gates), Doc 8 A2/A4 (gap/evidence rendering), Doc 9 A1 (timeline taxonomy), Doc 10 (billing states, meter), ADR-013/014/015.
- **Enables:** Mimo frontend build (token set + inventory = build order), Doc 26 (visual regression + state-coverage + a11y test classes), brand-identity onboarding (swap gate), Doc 23 (RUM component-level timing hooks).
- **Blocks:** Nothing in Phase 5 — architecture proceeds in parallel. Brand identity (external) blocks only final visual polish, not build.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-043 | System font stack + Noto-class Urdu fallback renders acceptably across PK-prevalent devices/browsers | Med-High | Device-matrix render test (A-040 matrix reuse) | Bundled webfont for Urdu runs (perf cost accepted) |
| A-044 | Compact-professional density suits both PA-01 power use and PB-02 comfort | Medium | S1 observation | Density toggle (violates Rule 4 — needs evidence) |
| A-045 | Licensed icon library covers domain needs (authenticity, channels, pipeline) without custom drawing | High | Inventory pass | Commission ≤10 custom glyphs |
| A-046 | Brand identity lands before S2 public launch without forcing semantic-tier changes | Medium | Brand-swap gate rehearsal | Launch on placeholder-neutral brand (acceptable, flagged to CEO) |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-UX-013 | UX | Placeholder brand ships to S1 partners and anchors perception ("looks generic") | M | M | S1 framing as early access; evidence-panel polish carries premium signal; brand before S2 (A-046) |
| R-UX-014 | UX | Component sprawl as S2 features land (WhatsApp inbox, reports) | M | M | Governance PR gate + matrix-first rule; quarterly inventory audit |
| R-TEC-006 | Technical | Semantic-token discipline erodes under build pressure (raw values leak into components) | M | M | Lint-enforceable rule handed to Mimo/Doc 25 standards; Qwen review checkpoint |
| R-UX-015 | UX | Nastaliq fallback rendering degrades dense layouts (tall glyphs in 14px rows) | M | L-M | Naskh-style fallback preference in dense contexts; line-height exception token for RTL runs |

#### Alternatives Considered & Trade-offs

- **Adopt a full third-party design system (Material-class) wholesale** — rejected: domain components (Evidence Panel, Quote, Pipeline) don't exist there, and wholesale adoption imports someone else's voice; chosen: minimal proprietary system atop standard primitives (ADR-002-consistent: we don't *build* a component framework, we *specify* one over commodity foundations).
- **Custom brand typeface now** — rejected: brand doesn't exist; system stack wins on PK network/device performance (A-040) and costs nothing.
- **Dark mode at v1** — rejected: doubles the contrast-pairing test surface pre-PMF; trigger logged.
- **Airy consumer density** — rejected: 8-hour professional tool; compact-professional chosen (A-044 watch).
- **Search architecture note (Living Thread):** no component constrains ADR-SEARCH-001; Interpretation Chips and streaming-result patterns are retrieval-agnostic — verified, no impact.

#### Gap Analysis Report

- Brand identity remains the open external dependency (A-046) — owner: CEO; swap-gate makes it non-blocking for build.
- Data-viz specification is v1-minimal (six categorical + one ramp) — sufficient for FS-09.01 S1 metrics; S2 report-building will need an expanded viz spec (logged to Intelligence Log).
- Illustration style for empty states unspecified — acceptable v1: icon-scale glyphs from licensed set; revisit with brand.
- Print/PDF styling for exported client reports (UF-A2 CSV limitation → S2 reports) unaddressed — assigned to the S2 client-portal-lite scoping.
- Touch-delta closure (Part A4 `sm` rules) is minimal-viable; dedicated mobile-web usability pass scheduled post-S1 telemetry.

#### Cross-References & Decision Traceability

**ADR-015 (three-tier brand-forward tokens; system-stack + Urdu fallback typography) — Accepted.** Discharges: Doc 12 gaps (copy appendix → Part D, `?` sheet → supporting inventory, touch deltas → A4, empty-state enumeration → Part C matrix), Doc 11 coverage-matrix obligation (Part C), Doc 10 admin-standard clause (Doc 12 Part F reaffirmed). Enforces: Doc 12 Part D budgets (A5 motion ceiling), Part E a11y (A2 pairing contract, A3 floors, bidi in components), Rule 3 zones (component annotations), ADR-014 boundary (Toast/Undo vs. confirm-dialog variants). R-PRD-006 and R-UX-005 now have concrete sanctioned copy patterns (Part D) — moving both risks from "designed" toward "operationalized."

#### Open Questions & External Dependencies

1. Brand identity commissioning timeline (CEO) — must precede S2 (A-046).
2. Icon library licensing selection (ADR-002 procurement; low risk).
3. A-040/A-043 device matrix definition — Engineering Director, shared validation pass.
4. Expanded viz spec trigger: does S2 reporting land in client-portal-lite? (Doc 27 sequencing.)

#### Future Revision Triggers

Brand identity adoption (swap-gate execution); dark-mode demand ≥3 enterprise prospects or S3 gate; component-sprawl audit failure; A-044 density complaints; S2 WhatsApp/reporting component extensions (matrix-first rule applies).

#### Review Checklist & Validation Criteria

- [ ] Components reference semantic tokens only (lintable rule stated). ✅
- [ ] All keystone components define seven mandatory states. ✅
- [ ] Coverage matrix spans all SCRs × state catalog. ✅
- [ ] Contrast enforced at pairing level; bidi handled at component level. ✅
- [ ] Brand dependency isolated to primitive tier. ✅
- [ ] Zero production code. ✅
- [ ] Sign-off: CPO, Principal Architect (UX), Engineering Director; Qwen review of Part C matrix against Doc 11 state catalog.

---

Phase 4 (UX & Information Architecture) is complete: Docs 11–13 give Mimo a buildable frontend contract — object model and flows (11), behavioral physics (12), and the token/component system (13). Next per blueprint: **Phase 5 — Technical Architecture, opening with Doc 14 (High-Level Software Architecture, Service Boundaries & Module Breakdown)**, which must open with the NFR-S01 tenancy invariant per R-TEC-002.

[PHASE 4 COMPLETE - AWAITING APPROVAL FOR PHASE 5]



---

<a name="doc-014"></a>
# DOC-014 — High-Level Software Architecture, Service Boundaries and Module Breakdown

Two Brains directive internalized. Before the document, three register actions this pivot forces — recorded transparently, as this is a material amendment to prior canon:

- **ADR-016 (Two Brains dynamic ingestion pipeline) — Accepted by supervisor directive.** This *amends* ADR-002's "licensed data providers, no scrapers" clause: we still build no scraping infrastructure ourselves (Apify is a managed orchestration platform), but the data-sourcing posture shifts from licensed databases to **first-party aggregation of public data**. Doc 5's SWOT ("dependency on licensed providers") and Doc 8's A1 Provider Capability Contract are reinterpreted: the "provider" is now **our own pipeline**, and the 70% PK-panel gate (A-023) now validates pipeline resolution quality rather than a vendor's index.
- **Strategic upside logged:** this materially de-risks R-TEC-003 — PK coverage is no longer hostage to a Western vendor's index; we discover on demand. The moat also strengthens (ADR-001: our enriched index compounds).
- **Strategic costs logged:** R-LEG-001 elevates (platform ToS exposure of scraping), R-TEC-001 elevates (scraper breakage volatility), and one hard technical truth is surfaced in the Gap Analysis: **audience demographics cannot be scraped directly** — they must be *estimated*, which changes FS-01.01's data contract.

---

#### DOC-014 — High-Level Software Architecture, Service Boundaries & Module Breakdown
**Status:** Draft v1.0 | **Phase:** 5 — Technical Architecture | **Owner:** Principal Architect (Software) | **Consumes:** Docs 7–13, ADR-016 directive

---

#### Executive Summary

MUSHIN's topology is a **modular monolith + asynchronous worker fleet** (ADR-017) fronted by a responsive web client, backed by a managed relational database with two strictly separated data planes (Global Creator Plane / Workspace Plane — the NFR-S01 tenancy invariant, addressed first per R-TEC-002), and surrounded by an **Adapter Layer** that is the sole gateway to all external services (Apify, Serper, LLM inference, Paddle, Gmail/Outlook, BSP, FX). The **Search Coordinator** module implements the Two Brains model: every query hits the internal database first (fast brain); insufficient results trigger an explicit, credit-quoted **Live Discovery job** (discover brain) executed by workers — Serper finds candidates, Apify scrapes platform data, the LLM layer computes scores and summaries, and the Standardization stage persists new creators into the internal database, permanently cheapening every future search. All money-events (Paddle), messages (mailbox/BSP), and external costs flow through single choke points where idempotency, signature verification, and cost telemetry (FS-10.03) are structurally guaranteed rather than per-feature remembered.

#### Purpose & Scope

System topology, module boundaries and ownership, the Two Brains data flow, communication patterns (sync/async/webhook), tenancy enforcement architecture, and the module ↔ Epic/FS mapping that gives Mimo a build skeleton. Technology *categories* are fixed here (managed relational DB, managed queue, object storage); named vendor selections belong to Docs 15/17/22.

#### Non-Goals

- Search index/ranking internals, vector/semantic design, LLM routing detail (Doc 15, closing ADR-SEARCH-001's remainder).
- Event taxonomy, queue semantics, scaling numbers (Doc 16).
- Integration contracts per external API, webhook payload handling detail (Doc 17).
- Entity/schema design (Docs 18–19), API surface (Doc 20), infra/deployment (Doc 22).
- Zero code (policy upheld).

#### Objectives & Success Criteria

- Every Doc 7 Epic maps to exactly one owning module (no orphan features, no shared ownership ambiguity).
- Two Brains flow is deterministic and reviewable: given a query and DB state, the routing decision is predictable.
- NFR-S01 is enforced by construction: a developer cannot accidentally write a cross-tenant query without bypassing a named guard layer (auditable).
- All external spend flows through the Adapter Layer: FS-10.03 cost telemetry coverage is structural, not disciplinary.

#### Detailed Content

**Part A — Tenancy Architecture First (NFR-S01, R-TEC-002)**

**A1. Two data planes (hard boundary):**
- **Global Creator Plane (GCP):** Creators, Profiles, enrichment payloads, scores, index data. Contains **zero** tenant-originated data. Shared by design (ADR-008). Writable only by the Ingestion/Standardization module and Intelligence module — never directly by tenant-facing request paths.
- **Workspace Plane (WP):** everything else — memberships, lists, campaigns, timeline, consent, reveals, ledger, notifications. **Every row carries a workspace identifier.** No exceptions; a WP table without workspace scoping fails schema review (Doc 19 gate).

**A2. Enforcement mechanics (architectural, not conventional):**
- Every authenticated request resolves a **Tenancy Context** (user, workspace, role, entitlement snapshot) before any business logic. Data access to WP passes through a **scoped repository layer** that *requires* the context — the unscoped access path exists only in a named, separately-audited internal module (admin plane, reconciliation jobs) with mandatory audit emission (FS-10.01 audit-first invariant).
- Background jobs carry an explicit serialized context (workspace-scoped jobs) or are declared **plane-global** (ingestion, reconciliation) at registration — a job without a declared scope class cannot be enqueued (fail-closed).
- Cross-plane reads (Creator page rendering WP relationship data over GCP profile data) happen exclusively via composed read APIs, never via cross-plane joins in feature code.
- Admin/staff plane (ADR-011): separate authentication realm, separate service surface; shares the database read paths through the same guarded layers with dual-attribution context (FS-10.02).

**Part B — System Topology**

**B1. Runtime components:**
1. **Web Client** — responsive SPA (ADR-013), talks only to the Backend API; renders progressive/streamed results per Doc 12 budgets.
2. **Backend API** — the modular monolith (Part C): synchronous request handling, tenancy kernel, entitlement enforcement (Doc 10 A2 single evaluation contract).
3. **Worker Fleet** — same codebase, separate processes consuming the managed job queue: Live Discovery jobs, enrichment/refresh, scoring, sequence scheduling (FS-06.03 send windows), webhook post-processing, daily reconciliation (FS-08.02), notification dispatch, ledger integrity checks.
4. **Managed Relational Database** — GCP + WP schemas (physical strategy — same cluster, separated schemas with distinct access roles — detailed in Doc 19).
5. **Search Index** — read-optimized projection of GCP for SCR-01 queries (engine selection = Doc 15).
6. **Managed Job Queue + Scheduler** — at-least-once delivery assumed; all consumers idempotent (Doc 16 semantics).
7. **Object Storage** — files/attachments (FS-04.03), raw scrape payload archive (below).
8. **Webhook Gateway** — dedicated ingress path for Paddle / BSP / mailbox push events: signature verification, raw-event append-only store, idempotency keying, then enqueue for processing (implements FS-08.02 robustness requirements structurally, reused for every webhook source).
9. **Adapter Layer** — one adapter per external service (Apify, Serper, LLM inference, Gmail, Outlook, BSP, FX, email-notification service). Every adapter uniformly provides: credential management, retry/backoff, **circuit breaker wired to FS-10.03 budget caps**, per-call cost-event emission, and a degraded-mode signal consumed by feature fallback ladders (Doc 8). **No module may call an external service except through its adapter** (lintable boundary for Mimo; Qwen review checkpoint).

**B2. Communication patterns:**
- Client ↔ API: synchronous JSON over HTTPS; long operations return job references; client receives progress via lightweight polling v1 (push channel deferred — Doc 16 decision) consistent with Doc 12 async patterns (enrichment progress, bulk receipts).
- API ↔ Workers: exclusively via queue (no direct invocation) — the API never blocks on external services for user-facing requests except sub-second cached reads.
- Inbound events: exclusively via Webhook Gateway.
- Internal module-to-module: in-process interfaces within the monolith, respecting ownership boundaries (Part C); domain events emitted onto the queue for cross-module async reactions (Timeline appends, notifications, telemetry) — taxonomy in Doc 16.

**Part C — Module Breakdown (monolith internals; ownership = review responsibility)**

| # | Module | Owns | Implements (trace) |
|---|---|---|---|
| M1 | **Identity & Tenancy Kernel** | Users, memberships, roles, Tenancy Context, managed-auth adapter (NFR-S02) | FS-07.01/02 |
| M2 | **Creator Store (GCP)** | Canonical Creator/Profile records, dedup/merge identity resolution, freshness/TTL state | FS-01.01/06, glossary entities |
| M3 | **Search Coordinator** | Query parsing, NL interpretation orchestration, **Two Brains routing**, result assembly/ranking invocation, saved searches | FS-02.01–04, CC-001 |
| M4 | **Live Discovery Pipeline** (worker-side) | Discovery job state machine: Serper candidate finding → Apify scrape orchestration → payload validation → handoff to M5/M6 | ADR-016 core |
| M5 | **Standardization & Ingestion** | Cleaning, normalization (A3 transliteration variants), schema mapping, GCP persistence, index projection, raw-payload archival | ADR-016 "MUSHIN Backend" stage |
| M6 | **Intelligence & Scoring** | LLM adapter consumption: authenticity scoring (FS-01.02 evidence assembly), quality scores, audience estimation, summaries (FS-03.01), query construction (FS-03.02), AI manifest + routing policy | EPIC-03, A4 triple |
| M7 | **CRM** | Lists, notes, tags, files, comments, **Interaction Timeline substrate** (append API + projections), relationship memory reads | EPIC-04, Doc 9 A1 |
| M8 | **Campaigns** | Briefs, clients, pipelines, tasks, budgets (FX adapter consumer), outcome recording | EPIC-05 |
| M9 | **Outreach** | Channel abstraction (Doc 9 A2), consent state machine (A3), mailbox adapters, sequence engine, campaign inbox, WhatsApp S1 links / S2 BSP | EPIC-06 |
| M10 | **Billing & Entitlements** | Paddle webhook processing, subscription state machine (FS-08.02), credit ledger + reserve-commit (FS-08.03/ADR-012), Entitlement Catalog, enforcement API | EPIC-08 |
| M11 | **Analytics Projections** | Metric definitions catalog, timeline/ledger-derived read models | EPIC-09, FS-09.01 |
| M12 | **Admin & Platform Ops** | Staff plane, impersonation, flags, cost-telemetry aggregation, circuit-breaker budgets, provider health | EPIC-10 |
| M13 | **Notifications** | Trigger catalog subscriptions, tray + email digest dispatch | FS-07.03 |

Boundary rule: modules touch each other's data only through owned interfaces; the Timeline (M7) and Ledger (M10) are append-only substrates other modules *write to via API* and *read via projections* — never raw-table access (Doc 19 enforces).

**Part D — The Two Brains Flow (canonical, per ADR-016)**

**D1. Query path (Search Coordinator, M3):**
1. Query arrives (filters or NL). NL → M6 interpretation → editable chips (FS-02.02) — **chips render before retrieval** (Doc 12 latency ordering).
2. **Brain 1 — Database Search:** structured query against the Search Index (GCP projection). Sub-second (NFR-P01), zero marginal cost, no metering. Results ranked (FS-02.03; internals Doc 15).
3. **Sufficiency check:** deterministic rule — result count ≥ threshold (default 8, matching UF-00 step 3) *and* fit-score floor met. Sufficient → done.
4. **Insufficient → Live Search offer:** never implicit (Doc 8 A5 rule). User sees Brain-1 results plus a quoted "Search live" action (or, in UF-00's zero-result branch, the add-by-URL pivot). Confirmation → credit reserve (FS-08.03 reserve-commit) → Discovery job enqueued → user gets progressive results as the job streams (Doc 12: queue-and-notify beyond 30s).

**D2. Live Discovery job (M4 pipeline, worker-side; each stage checkpointed and independently retryable):**
1. **Candidate discovery (Serper adapter):** intelligent Google queries constructed from the interpreted intent (niche + geo + platform operators); yields candidate profile URLs, articles, public pages. Dedup against GCP (already-known creators skip to freshness check).
2. **Scrape orchestration (Apify adapter):** platform-appropriate actors fetch public profile data — bio, follower counts, post history, engagement metrics, posting cadence — for Instagram/TikTok/YouTube. Per-candidate isolation: one candidate's failure never kills the job. Raw payloads archived to object storage (reprocessability: scoring improves later without re-scraping — cost asset).
3. **Understanding layer (LLM adapter via M6):** processes raw payloads → authenticity evidence + score, quality score, audience summary and **audience-composition estimates** (see Gap Analysis — estimates, not measurements), niche classification (controlled vocabulary), brand-fit signals vs. query intent. All outputs grounded in the payload (A4 anti-fabrication rule applies at the pipeline level).
4. **Standardization & persistence (M5):** normalize → identity-resolve (transliteration-aware matching per A3) → **persist to GCP → project to Search Index**. The creator now exists for every future Brain-1 query, any workspace (ADR-008 economics: each live search permanently cheapens the platform).
5. **Result assembly (M3):** new creators merged into the ranked result set, streamed to the client; credit reservation committed (or partially released per per-candidate failure accounting — no silent credit loss, FS-08.03).
6. **Same pipeline, second entry point:** add-by-URL (UF-06) and Deep Enrichment (A2 ladder) are Discovery jobs with a pre-known candidate list — one pipeline, three triggers (design economy; single test surface for Doc 26).

**D3. Refresh path:** FS-01.06 refresh = re-scrape job for one creator through stages 2–4, honoring rate limits.

#### Dependency Mapping

- **Depends on:** ADR-016 directive, Docs 7–10 (FS behaviors), Docs 11–12 (async UX, budgets), ADR-002 (as amended), ADR-011/012/013.
- **Enables:** Doc 15 (index/ranking/LLM-routing within M3/M5/M6 frames), Doc 16 (queue semantics, event taxonomy, scaling), Doc 17 (adapter contracts per named service), Doc 18–19 (GCP/WP schemas, append-only substrates), Doc 20 (API surface per module), Doc 22 (runtime deployment of B1 components).
- **Blocks:** Mimo backend scaffolding order = Part C table; nothing else blocked.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-047 | Apify actors deliver reliable IG/TikTok/YT public-profile data at required depth for PK creators | Medium | **Immediate spike: run validation panel (A-023 repurposed) through the pipeline** | Two Brains discover-brain degrades; ADR-016 review |
| A-048 | Serper-constructed queries surface PK creator candidates with usable precision | Medium | Same spike, candidate-precision measurement | Heavier reliance on add-by-URL entry point |
| A-049 | LLM scoring from scraped payloads reaches acceptable authenticity/quality accuracy | Medium | Ground-truth panel (A-025 merged) | Score scope reduction; confidence-band honesty (A4 absorbs gracefully) |
| A-050 | Public-data scraping posture is legally sustainable in operating jurisdictions | Low-Med | Legal review (Doc 28) — **elevated priority** | Sourcing re-architecture; ADR-016 revisit |
| A-051 | Modular monolith + workers sustains S1/S2 scale (hundreds of workspaces) | High | Doc 16 load modeling | Extract hot modules (M4 first candidate) — boundaries designed for it |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-LEG-006 | Legal | Platform ToS enforcement against scraping (blocks, legal notices) — **supersedes/elevates R-LEG-001's sourcing aspect** | M-H | H | Public-data-only scope; managed-platform indirection (Apify); rate discipline; legal posture memo (Doc 28); raw-payload provenance records |
| R-TEC-007 | Technical | Scraper breakage volatility (platform DOM/API changes) — **elevates R-TEC-001** | **H** | H | Apify's maintained actors (their business is keeping them alive); per-stage checkpointing; multi-actor fallback per platform (Doc 17); degraded-mode = Brain-1-only with honest messaging |
| R-TEC-008 | Technical | Garbage-in scoring: bad scrapes yield confident-looking wrong scores | M | H | Payload validation stage (M5) with quality gates; A4 confidence tied to payload completeness; anti-fabrication grounding rule at pipeline level |
| R-FIN-009 | Financial | Live-search unit cost variance (Apify compute + Serper + LLM per job) breaks credit pricing | M | H | Per-stage cost telemetry (adapter choke point); per-job cost caps (candidate-count limits); guardrail dashboard red-flag protocol (FS-10.03) |
| R-OPS-005 | Operational | We now own data-quality operations (dedup, drift, misclassification) — a permanent ops workload previously priced into vendor fees | H | M | M5 quality gates + M12 monitoring; weekly data-quality review ritual (Doc 28 runbooks); accepted knowingly as the price of ADR-016's moat |
| R-SEC-005 | Security | Raw scrape archive becomes a sensitive personal-data lake | M | H | Retention limits + access controls on archive (Doc 21); GCP-plane isolation; deletion pipeline hooks (GDPR stub from Doc 7) |

#### Alternatives Considered & Trade-offs

- **Licensed database vendors (Modash-class) as primary source** — the prior default, now **rejected by directive**: vendor PK coverage risk (the original R-TEC-003), recurring per-profile fees forever, no moat. Trade-off accepted in exchange: ToS/legal exposure (R-LEG-006), ops burden (R-OPS-005), and the demographics-estimation problem (Gap Analysis). Hybrid fallback (vendor as tertiary source for gaps) remains *architecturally possible* through the Adapter Layer — logged as optionality, not plan.
- **Microservices topology** — rejected for S1/S2: team size and iteration speed favor the monolith; module boundaries (Part C) are drawn so M4/M6 extract cleanly if scale demands (A-051 hedge).
- **Synchronous live search (block until scraped)** — rejected: multi-second-to-minutes latency violates every Doc 12 budget; async job + streaming chosen.
- **Skip raw-payload archival (storage cost)** — rejected: reprocessability is the cheapest future-proofing in the system (rescoring without rescraping).
- **Living Thread status:** ADR-SEARCH-001's *macro* question (traditional vs. AI vs. hybrid) is now resolved by ADR-016 as **hybrid-by-construction** (indexed fast brain + AI-mediated discovery brain). Remaining for Doc 15: index engine choice, ranking implementation, semantic/vector layer, LLM routing policy. Status: **Partially Resolved — remainder scoped.**

#### Gap Analysis Report

- **Material spec impact — audience demographics:** public scraping cannot directly observe audience age/gender/geo (vendor panels could). FS-01.01's audience section becomes **modeled estimates** (e.g., inferred from engager samples, language mix, content signals) and must be labeled as estimates with confidence per A4. **CC-003 raised** against Doc 8 (FS-01.01/FS-02.01 audience-geo filters operate on estimated values; filter UX must signal estimate basis). Awaiting CPO ratification. The A4 explainability standard absorbs this honestly — arguably *more* honest than competitors presenting panel extrapolations as facts.
- Identity resolution (same creator across IG/TikTok/YT) is named (M2/M5) but unspecified — assigned to Doc 18 (matching rules) — hard problem, flagged.
- Scrape scheduling/politeness policy (rate limits per platform) unspecified → Doc 17.
- The validation-panel spike (A-047/48/49) is now the project's most urgent technical action — replaces the old provider-evaluation spike; owner: Engineering Director + Mimo prototype.
- Push-vs-polling for job progress deferred (Doc 16) — acceptable, polling meets S1.

#### Cross-References & Decision Traceability

**ADR-016 (Two Brains pipeline; amends ADR-002 sourcing clause) — Accepted (directive). ADR-017 (modular monolith + worker fleet; queue-only async; adapter-layer exclusivity) — Accepted.** ADR-SEARCH-001 → Partially Resolved (remainder → Doc 15). Discharges R-TEC-002 (Part A first, by construction), R-TEC-003 (restated as A-047/48 pipeline-quality risk). Elevates R-LEG-001→R-LEG-006, R-TEC-001→R-TEC-007. CC-003 raised (audience-as-estimates). FS-10.03 telemetry structurally guaranteed at the Adapter Layer. NFR-S01/S02, FS-08.02/08.03 placements traced in Parts A–C.

#### Open Questions & External Dependencies

1. Pipeline validation spike results (A-047/48/49) — gates everything downstream of ADR-016.
2. Legal posture memo on public-data aggregation (A-050) — Doc 28, elevated.
3. CC-003 ratification (audience estimates) — CPO, next audit or sooner.
4. Apify/Serper/LLM vendor cost sheets → live-search credit price (OD-001 adjacent, Doc 17).
5. Identity-resolution rule design → Doc 18.

#### Future Revision Triggers

Spike failure on any A-047/48/49 axis; platform anti-scraping escalation affecting Apify actors; live-search unit cost >3× estimate; M4 throughput requiring extraction (A-051); hybrid vendor-fallback activation.

#### Review Checklist & Validation Criteria

- [ ] Tenancy invariant addressed first, enforced by construction. ✅
- [ ] Two Brains routing deterministic; live search never implicit. ✅
- [ ] Every Epic → exactly one owning module. ✅
- [ ] All external calls pass one adapter choke point (cost telemetry structural). ✅
- [ ] Pipeline stages checkpointed, idempotent, per-candidate isolated. ✅
- [ ] Honest surfacing of the demographics-estimation consequence (CC-003). ✅
- [ ] Zero code. ✅
- [ ] Sign-off: Principal Architects (Software, AI/Search, Data, Security), Engineering Director, CPO (CC-003); Qwen review against Docs 7–10 trace map.

---

[AWAITING APPROVAL]



---

<a name="doc-015"></a>
# DOC-015 — AI Intelligence Layer and Search-Discovery Architecture

CC-003 ratification logged. "LLM as Engine" directive internalized — and it resolves ADR-SEARCH-001 cleanly. One architectural sharpening is applied throughout this document to keep the directive compatible with our binding constraints (FS-02.03 determinism, NFR-P01, 3× guardrail): **the LLM thinks on the write path; the read path stays deterministic** — all expensive reasoning happens at ingestion time and is stored as structured attributes; query time uses only fast index retrieval plus one cheap translation call.

---

#### DOC-015 — AI Intelligence Layer & Search/Discovery Architecture
**Status:** Draft v1.0 | **Phase:** 5 | **Owner:** Principal Architect (AI/Search) | **Consumes:** Doc 14 (M3/M5/M6 frames, Two Brains), Doc 8 (constraint funnel), ADR-016, "LLM as Engine" directive

---

#### Executive Summary

This document finalizes **ADR-SEARCH-001: Accepted — Hybrid, "LLM thinks / Index retrieves."** MUSHIN rejects hand-coded categorization, parsing, and scoring algorithms in favor of LLM APIs as the universal intelligence engine, while retrieval runs on a **Meilisearch/Typesense-class managed search index** for instant, deterministic, zero-marginal-cost queries. The load-bearing principle is **write-path intelligence (ADR-018)**: classification, authenticity reasoning, audience estimation, and summarization execute once at ingestion (Brain 2) and persist as structured attributes; Brain 1 queries touch no LLM except a single cheap, cached **query-translation call** that converts natural language into validated filter structures. The document specifies the model routing ladder (cheap classifier models → frontier reasoning, escalation-by-confidence), the **versioned Prompt Registry** with schema-constrained outputs and grounding validators (anti-fabrication enforcement from Doc 8 A4), the RAG context strategy for scoring, and five cost-control mechanisms that structurally protect the 3× COGS guardrail.

#### Purpose & Scope

Architecture of M3 (Search Coordinator internals), M5 (index projection), M6 (Intelligence & Scoring): index technology class and schema strategy, query translation pipeline, semantic/vector layer, ranking computation, LLM routing policy, prompt engineering governance, RAG assembly, evaluation harness, and cost optimization. Vendor *selection* (specific index host, LLM providers, embedding models) lands in Doc 17 against criteria fixed here.

#### Non-Goals

- Custom model training/fine-tuning — **prohibited** (ADR-002; frontier + open models via API only).
- Queue semantics/scaling (Doc 16); adapter contracts (Doc 17); schema DDL (Doc 19).
- Outreach AI (FS-03.03, S2) — routing policy applies, feature spec exists (Doc 8).
- Zero code / zero prompt text (prompts are governed artifacts, authored at implementation under Part D rules).

#### Objectives & Success Criteria

- Brain-1 query cost: **zero LLM tokens for filtered search; ≤1 cheap-model call for NL search** (testable).
- Identical query + index state → identical results and order (FS-02.03 determinism, testable).
- Every stored score reproducible from archived payload + prompt version + model version (auditability triple).
- Cost per live-discovery candidate and per enrichment bounded by per-job caps; guardrail dashboard (FS-10.03) can attribute cost to model × prompt × stage.

#### Detailed Content

**Part A — ADR-SEARCH-001: Final Decision Record**

- **Context:** Docs 1/7/8 constraint funnel — sub-second filters, NL + transliteration, semantic capability, explainable deterministic ranking, long-tail fairness (T5), per-query cost visibility; ADR-016 Two Brains topology; directive to avoid the custom-algorithm engineering trap.
- **Decision:** Hybrid. (1) Managed search index (Meilisearch/Typesense-class) as the sole query-time retrieval engine over GCP projections. (2) LLMs as the exclusive intelligence layer in three roles — **Translator** (NL→filters), **Analyst** (authenticity/audience/summaries from payloads), **Classifier** (niche taxonomy assignment) — all executing on the write path except translation. (3) Vector/semantic layer for similarity and semantic recall (S2), never replacing structured retrieval.
- **Alternatives rejected:** pure algorithmic backend (brittle, every scenario hand-built — the trap named in the directive; transliteration/NL essentially unsolvable by hand at our team size); pure LLM retrieval ("ask the model to find creators") — non-deterministic, slow, expensive, unrankable at scale; vector-only search — poor at hard filters (follower bands, geo shares), opaque ranking, violates explainability.
- **Consequences:** accepted dependency on LLM API pricing/availability (mitigated: routing ladder + open-model substitution path); scoring quality is now a prompt+eval engineering discipline (Part D/E) rather than an algorithm-maintenance one; index and attributes must be re-projectable (reprocessability via payload archive).
- **Status: Accepted** (supersedes "Proposed" from Doc 1; macro-resolution from ADR-016 incorporated).

**Part B — Brain 1: Database Search Architecture**

**B1. Index technology & schema strategy**
- Engine class: Meilisearch/Typesense-class managed index — selection criteria for Doc 17: typo/transliteration tolerance quality (A3 test set), filterable-attribute performance at 10^5-10^7 documents, faceting, geo support, managed hosting SLA, cost curve.
- Index document = flattened creator projection: identity fields (with **transliteration variant expansions generated by cheap LLM at ingestion** — A3 solved as data, not query logic), platform metrics, LLM-derived attributes (niche categories from controlled vocabulary, authenticity band + score, quality score, audience estimate summary fields incl. PK/GCC/diaspora shares per CC-003, language mix), freshness timestamps.
- Projection is rebuildable from GCP at any time (index is disposable state; recovery story for Doc 24).

**B2. Query translation pipeline (the only query-time LLM)**
- NL query → cheap-model call → **schema-constrained structured output** (filter set + ranking hints + confidence) validated against the filter vocabulary; invalid output → one retry → fallback to keyword mode with honest chip ("interpreted as keywords"). Output renders as editable chips (FS-02.02) *before* retrieval (Doc 12 ordering).
- **Interpretation cache:** normalized-query → interpretation, TTL 24h, shared across users within language (not workspace-scoped — no tenant data in queries; privacy check: any query containing detected personal context skips cache). Cache hit = zero-token NL search. Chip edits bypass translation entirely (edited chips are already structured — power users converge to zero-LLM searching).
- Urdu/Roman-Urdu queries: same call, same schema; the model normalizes to vocabulary values (this is precisely where LLM-as-Translator beats hand-coded parsing).

**B3. Ranking (FS-02.03) — computed, not generated**
- Fit score assembled at query time by the Coordinator from **precomputed attributes**: index relevance signal, criteria-match distance, authenticity band weight, quality score, freshness decay, and the T5 long-tail fairness term (size-band normalization so 15k-follower creators compete within, not against, 1M-follower creators). Weights are configuration (flag-tunable, versioned), **not** per-query LLM output — this preserves determinism, zero query cost, and CC-001 explanations (each ranking factor is citable because each is a stored value).
- Ranking explanation badges derive from the same factor values — explanation is a rendering of the computation, never a post-hoc LLM narrative (anti-fabrication by construction).

**B4. Semantic/vector layer (S2: FR-02.05 similarity + semantic recall)**
- Embeddings computed at ingestion (write-path rule) over normalized content signatures (bio + niche + content-topic digest); stored in the index's vector capability or an adjacent managed vector store (Doc 17 selects; criteria: co-location with filters for hybrid queries).
- "More like this" = vector neighborhood **intersected with structured filters** (hybrid query), then ranked by B3 — semantic expands recall, never overrides deterministic ranking. Embedding model pinned + versioned; re-embedding is a batch job over archives (reprocessability).

**Part C — Brain 2: Live Discovery Intelligence (M6)**

**C1. Model routing ladder (binding policy)**

| Tier | Model class | Assigned tasks | Escalation rule |
|---|---|---|---|
| T-A (cheap/fast; open-source via hosted inference or budget API) | Small instruct models | Niche classification (controlled vocabulary), language detection, transliteration variant generation, payload field extraction/normalization, query translation (B2) | Confidence below threshold or schema-validation failure ×2 → T-B |
| T-B (mid) | Mid-tier API models | Creator summaries (FS-03.01), audience estimation (CC-003), standard authenticity evidence assembly on complete payloads | Sparse/conflicting payload, evidence contradictions, borderline authenticity band → T-C |
| T-C (frontier) | Frontier reasoning models | Authenticity reasoning on ambiguous/high-stakes cases (band boundary, diaspora calibration per R-PRD-006), dispute re-evaluation, low-confidence audience estimates | Terminal; unresolved → honest "insufficient data" state (never guess upward) |

- Routing decisions + confidence logged per task (FS-10.03 attribution: model × prompt × stage). Escalation rate is a monitored economic metric — rising T-C share = cost alarm and/or payload-quality alarm.
- Open-model substitution: T-A tasks are deliberately simple enough that hosted open models (HF-class inference) can compete on cost; adapter-level A/B against eval sets (Part E) governs substitution — never vibes.

**C2. Prompt engineering architecture (governed artifacts)**
- **Prompt Registry:** every prompt is a versioned artifact — ID, version, task, model tier, input schema, **output JSON schema**, eval-set linkage, changelog. Prompt changes follow code review (Qwen reviews prompts like code; Mimo may not inline ad-hoc prompts — lintable rule: M6 calls reference registry IDs only).
- **Schema-constrained outputs everywhere:** every LLM task returns validated structured output; free-text exists only inside designated fields (summary text, evidence statements). Validation failure → retry → tier escalation → task failure with honest state (Doc 8 fallbacks). No unvalidated LLM output ever reaches GCP.
- **Grounding validator (A4 anti-fabrication, mechanized):** evidence-bearing outputs must reference payload field paths for each claim; a post-processor verifies the referenced data exists and is consistent in direction (e.g., claimed "engagement dropped 40%" must match archived metrics within tolerance). Validator failure = output rejected + prompt-quality telemetry. This converts the release-blocking rule (Doc 8) into a runtime guarantee.

**C3. RAG context strategy for scoring**
- Context assembled per task from three bounded sources: (1) **normalized payload extract** (relevant sections only — engagement scoring gets metrics + comment samples, not full post archive; per-task context budgets enforced), (2) **reference frames**: PK/category benchmark medians (FS-01.01 requirement) and the diaspora-calibration guidance derived from the ground-truth panel (A-049/R-PRD-006 — encoded as retrieved reference context, not fine-tuning), (3) **task rubric** from the registry.
- No cross-creator or cross-workspace data in scoring context (GCP-plane inputs only; privacy + fairness). Retrieval of benchmarks is keyed lookup, not vector search (deterministic context = reproducible scores).
- Reproducibility triple: archived payload + prompt version + pinned model version → re-derivable score (Objectives). Model deprecations trigger batch re-scoring from archives.

**Part D — Cost Architecture (3× guardrail protection)**

1. **Write-path exclusivity (ADR-018):** the structural control — intelligence cost scales with *ingestion volume* (metered, credit-funded per Doc 8 A5), never with *query volume* (free-tier-abusable). The economically dangerous surface is simply absent.
2. **Prompt caching:** registry prompts structured for shared static prefixes (rubrics, schemas, benchmarks) to exploit provider prefix caching; interpretation cache (B2); embedding cache keyed on content signature.
3. **Semantic deduplication:** unchanged payload sections (content-signature hash) skip re-scoring on refresh — only deltas re-enter the ladder; full re-score forced past a staleness horizon.
4. **Payload archiving (Doc 14):** re-scoring, re-embedding, and prompt-improvement backfills run from archives at LLM-only cost, never re-scraping cost.
5. **Hard budgets:** per-job candidate caps and per-stage token ceilings (M4); adapter circuit breakers (FS-10.03) as the terminal backstop; per-action unit-cost telemetry feeds the guardrail dashboard with model×prompt attribution so a regressing prompt version is *visible as a margin event*.

**Part E — Evaluation Harness (the quality counterpart to Part D)**

- **Golden sets:** (1) PK validation panel with ground-truth labels (authenticity from A-049 panel, niche labels, known audience compositions where obtainable) — doubles as the A-047/48/49 spike instrument; (2) query-translation set (NL + Urdu/Roman-Urdu → expected filter structures, built from UF-00 telemetry over time); (3) grounding adversarial set (payloads engineered to tempt fabrication).
- **Gates:** any prompt version change, model swap, or tier substitution must meet or beat current eval scores before rollout (flag-staged). Score drift monitoring in production: sampled re-evals weekly.
- Chip-edit rate (Doc 8 trigger: >40% = interpretation failure) and evidence-dispute reports are the live quality signals wired to M12 alerting.

#### Dependency Mapping

- **Depends on:** Doc 14 (module frames, adapter layer, archive), Doc 8 (A2–A5, FS-02.x/03.x behaviors), ADR-016, CC-003, Doc 3 guardrail.
- **Enables:** Doc 17 (vendor selection criteria: index engine, LLM providers, embedding + inference hosts), Doc 16 (scoring-job load model), Doc 19 (attribute/vector persistence), Doc 26 (eval harness = test infrastructure; determinism/grounding assertions), Mimo M3/M5/M6 build.
- **Blocks:** Live-discovery credit pricing (OD-001 adjacent) pends Part D telemetry from the spike; nothing else.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-052 | Cheap-tier models achieve ≥95% schema-valid, ≥90% correct query translation (incl. Roman Urdu) | Medium | Golden set #2 on spike | Route translation to T-B; cost per NL search rises (cache mitigates) |
| A-053 | Meilisearch/Typesense-class engines handle transliteration variance via variant-expansion data strategy (B1) | Med-High | A3 test set on candidates | Query-time variant expansion by T-A model (small added cost) |
| A-054 | Audience estimation (CC-003) achieves usable accuracy bands from public signals | Low-Med | Golden set #1 vs. known compositions | Estimate scope narrowed (language/geo only); filters relabeled accordingly |
| A-055 | Provider prefix caching + dedup yields ≥40% effective token cost reduction at steady state | Medium | Spike telemetry | Guardrail pressure → credit price recalibration (OD-001) |
| A-056 | Escalation-by-confidence keeps T-C share <10% of scoring tasks | Medium | Routing telemetry | Rubric/threshold tuning; payload-quality investment (M5 gates) |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-TEC-009 | Technical | LLM output instability (schema drift, provider model updates) silently degrades scoring | M | H | Pinned model versions; eval gates on any change; schema validation + grounding validator; weekly drift sampling |
| R-FIN-010 | Financial | LLM provider price/ToS changes break unit economics | M | H | Routing ladder portability; open-model substitution path (T-A); multi-provider adapters (Doc 17); Part D budgets |
| R-PRD-010 | Product | Niche classification drift fragments the controlled vocabulary (same creator, shifting categories) | M | M | Vocabulary is fixed data (Doc 18); classifier outputs constrained to it; re-classification only on content change (dedup rule) |
| R-PRD-011 | Product | Ranking-weight tuning becomes opaque "algorithm politics" internally | L | M | Weights versioned + changelogged; CC process for changes affecting CC-001 explanations |
| R-SEC-006 | Security | Prompt injection via scraped content (bios/comments containing adversarial instructions) manipulates scoring | M | H | Payload treated as data-only in prompt structure (rubric/data separation); grounding validator catches fabricated conclusions; adversarial golden set #3; injection findings → M12 alerting |
| R-TEC-010 | Technical | Index/GCP projection drift (stale attributes served) | M | M | Projection versioning + rebuild capability; freshness stamps surfaced in UX (staleness chips already spec'd) |

#### Alternatives Considered & Trade-offs

- **Hand-coded ranking/classification algorithms** — rejected per directive and on merits (maintenance trap, transliteration/NL infeasible at team scale). Trade-off: quality becomes prompt/eval discipline — accepted with Part E as the counterweight.
- **Query-time LLM ranking ("re-rank top 100 with the model")** — rejected: breaks determinism (FS-02.03), adds per-query cost and latency, makes CC-001 explanations narrative rather than computational. Revisit trigger logged (S3, if precomputed ranking hits quality ceiling — would require a determinism-preserving design).
- **Fine-tuning models on our data** — rejected (ADR-002); RAG reference frames + rubrics capture domain knowledge portably.
- **Elasticsearch-class heavy engine** — rejected v1: ops weight vs. Meilisearch/Typesense simplicity at our scale; criteria allow revisiting at 10^7+ docs (Doc 16 trigger).
- **Embedding-first architecture (vector as primary store)** — rejected: hard filters and explainable ranking are the product's spine; vectors are an S2 recall enhancer.

#### Gap Analysis Report

- Controlled niche vocabulary (flagged Doc 8) still undefined — now **blocking** T-A classifier rubrics; assigned to Doc 18 with PK-relevant categories; interim spike may use a provisional 40-category list.
- Diaspora-calibration reference frame content (C3 source 2) depends on ground-truth panel completion — sequenced with the spike.
- Similarity search (S2) UX ("more like this" entry points) not yet in Doc 11 flows — minor; log to Doc 13 matrix-first rule when S2 scoping starts.
- Prompt Registry tooling (storage, review workflow) unspecified — Doc 25 (engineering standards) to place it in the repo/review pipeline.
- Eval-harness runtime (where evals execute in CI) → Doc 26.

#### Cross-References & Decision Traceability

**ADR-SEARCH-001 — Accepted (final; Living Thread closed at macro and micro level). ADR-018 (write-path intelligence / read-path determinism) — Accepted. ADR-019 (Prompt Registry: prompts as versioned, schema-bound, eval-gated artifacts) — Accepted.** Implements Doc 8 constraint funnel in full: NFR-P01/02 (B1/B2), determinism (B3), A3 (B1 variant strategy + B2), A4 (C2 grounding mechanization), A5/3× guardrail (Part D), T5 fairness (B3), CC-001 (computational explanations), CC-003 (C1 T-B task + A-054). R-PRD-004 now mechanically enforced (grounding validator). Directive traceability: Translator = B2, Analyst = C1/C3, Classifier = T-A tasks, Hybrid execution = ADR-018 + B1.

#### Open Questions & External Dependencies

1. Spike results across golden sets (A-052/053/054) — the project's gating technical evidence.
2. Index engine + LLM provider + inference-host selection (Doc 17, criteria fixed here).
3. Niche vocabulary v1 (Doc 18, interim list for spike).
4. Embedding model choice + vector co-location (Doc 17, S2 timeline).
5. OD-001 pricing interaction: live-search credit price awaits Part D spike telemetry.

#### Future Revision Triggers

Eval-gate failures on model swaps; T-C escalation >10% sustained (A-056); chip-edit rate >40%; injection incident (R-SEC-006); index scale approaching engine limits; query-time re-ranking revisit trigger (S3 quality ceiling); provider pricing shift >25% (R-FIN-010).

#### Review Checklist & Validation Criteria

- [ ] ADR-SEARCH-001 finalized with context/decision/alternatives/consequences/status. ✅
- [ ] Zero LLM tokens on filtered search; ≤1 cheap call on NL search. ✅
- [ ] All LLM outputs schema-validated; evidence mechanically grounded. ✅
- [ ] Every score reproducible (payload + prompt version + model version). ✅
- [ ] Cost controls structural (write-path exclusivity + budgets), not aspirational. ✅
- [ ] Zero code, zero prompt text (governed artifacts deferred to registry). ✅
- [ ] Sign-off: Principal Architects (AI/Search, Software, Data), CPO (ranking-weight governance), Engineering Director; Qwen review of prompt-governance and determinism assertions.

---

[AWAITING APPROVAL]



---

<a name="doc-016"></a>
# DOC-016 — Data Flow Event Architecture and Scalability Strategy

Generating Document #16.

---

#### DOC-016 — Data Flow, Event Architecture & Scalability Strategy
**Status:** Draft v1.0 | **Phase:** 5 | **Owner:** Principal Architect (Software) + Principal Architect (Data) | **Consumes:** Doc 14 (topology, modules), Doc 15 (write-path intelligence), Docs 8–10 (behavioral contracts)

---

#### Executive Summary

This document defines MUSHIN's asynchronous nervous system: a **canonical event taxonomy** with a uniform envelope, **transactional-outbox emission with at-least-once delivery and idempotent consumers (ADR-020)** as the correctness foundation, a **consumer reaction matrix** specifying exactly which modules react to which events, and step-by-step specifications of the three hardest flows — the **Paddle money path**, the **Live Discovery ingestion path**, and the **time-delayed Outreach Sequence path** (whose central correctness rule is *eligibility is evaluated at send time, never at enqueue time*). It closes Doc 14's deferred decision with **ADR-021: polling for job progress in v1**, with a defined trigger for upgrading to server push. The scalability strategy is deliberately boring: horizontal worker scaling per queue class, read replicas, and index scaling cover S1/S2 by wide margins; module extraction (M4 first candidate) is governed by **four explicit numeric/organizational triggers**, not architectural fashion.

#### Purpose & Scope

Event envelope and taxonomy, emission/delivery/consumption semantics, the consumer matrix, three critical flow specifications, queue class design, backpressure and rate-limiting policy, load model, scaling axes, and extraction triggers. Binding on Doc 17 (webhook/adapter transports), Doc 19 (outbox/event persistence), Doc 22 (runtime scaling config), Doc 23 (queue/flow observability), Doc 26 (idempotency and flow tests).

#### Non-Goals

- Vendor selection for queue/scheduler (managed-service category fixed by ADR-002/017; named in Doc 22).
- Event payload field-level schemas (Doc 18/20 own entity and contract shapes; envelope only here).
- Analytics warehouse design — reaffirmed deferred (Doc 10); projections remain DB-level read models.
- Disaster recovery flows (Doc 24) — replay capabilities are *enabled* here, exercised there.
- Zero code (policy upheld).

#### Objectives & Success Criteria

- Every state change that other modules react to is expressed as a taxonomy event — no hidden side-channel coupling (reviewable via the matrix).
- Zero lost events under crash-between-write-and-publish (outbox guarantee).
- Every consumer is idempotent under duplicate delivery and tolerant of out-of-order arrival within its ordering scope (testable, Doc 26).
- All three critical flows fully specified with failure behavior at every step.
- Extraction triggers are numeric and pre-agreed — no mid-crisis architecture debates.

#### Detailed Content

**Part A — Event Fundamentals**

**A1. Envelope (uniform, all events):** event ID (globally unique, the idempotency key), type (taxonomy name), schema version, `occurred_at`, **scope class** (`GCP` | `WP` — Doc 14 A2 declaration surfaces here; WP events carry workspace ID), actor (user / system / staff-dual-attributed per FS-10.02), correlation ID (job/flow linkage), causation ID (triggering event), payload (or payload reference for large bodies — raw scrape payloads are *referenced*, never embedded).

**A2. Emission — Transactional Outbox (ADR-020 — Accepted):** modules never publish directly to the queue. State change and its events are written atomically to the module's DB transaction (outbox table); a relay publishes to the queue and marks dispatched. Guarantees: no phantom events (emitted without commit), no lost events (committed without emission). Consequence: eventual delivery (relay lag is a monitored metric, target p95 < 2s — Doc 23).

**A3. Delivery semantics:** at-least-once; consumers **must** be idempotent keyed on event ID (processed-event ledger per consumer group). Ordering: global ordering is **not** guaranteed; per-key ordering (partition by subscription ID for billing, by sequence-enrollment ID for outreach steps, by job ID for discovery stages) where flows require it; consumers otherwise resolve order via `occurred_at` + fetch-current-state (the FS-08.02 fetch-to-heal pattern generalized). Retries: exponential backoff, max attempts per class, then **DLQ** with M12 alerting; poison messages never block a partition beyond the retry budget.

**A4. Events vs. Timeline (boundary clarification):** domain events are *transport*; the Interaction Timeline (M7) is *workspace-facing storage*. M7 consumes relevant WP events and appends timeline entries (Doc 9 A1 taxonomy). Not every event becomes a timeline entry (system internals don't), and no module writes timeline entries except through M7's append API — the matrix below is the mapping authority.

**Part B — Event Taxonomy (v1 canonical set)**

| Family | Events (type names) | Scope |
|---|---|---|
| `creator.*` | `creator.discovered`, `creator.enriched`, `creator.scored`, `creator.refresh_completed`, `creator.merge_resolved` | GCP |
| `discovery.*` | `discovery.job_queued`, `discovery.stage_completed` (per stage, per candidate batch), `discovery.job_completed`, `discovery.job_failed` | GCP (job meta) + WP (requesting workspace linkage) |
| `workspace.*` | `workspace.created`, `workspace.member_invited/joined/removed`, `workspace.settings_changed` | WP |
| `list.*` | `list.created/archived`, `list.membership_changed`, `list.note_added`, `list.exported` | WP |
| `campaign.*` | `campaign.created/archived`, `campaign.stage_changed`, `campaign.task_completed`, `campaign.rate_recorded`, `campaign.outcome_recorded`, `campaign.budget_threshold_crossed` | WP |
| `outreach.*` | `outreach.message_sent/delivered/failed`, `outreach.reply_received`, `outreach.opened` (if tracking on), `outreach.optout_recorded`, `outreach.sequence_enrolled/step_executed/stopped`, `outreach.mailbox_revoked`, `outreach.whatsapp_quality_changed` (S2) | WP |
| `billing.*` | `billing.webhook_received` (raw), `billing.subscription_state_changed`, `billing.plan_changed`, `billing.reconciliation_healed` | WP |
| `credit.*` | `credit.granted`, `credit.reserved`, `credit.committed`, `credit.released`, `credit.reversed`, `credit.balance_threshold_crossed` | WP |
| `reveal.*` | `reveal.contact_revealed` | WP |
| `admin.*` | `admin.impersonation_started/ended`, `admin.flag_changed`, `admin.workspace_suspended` | WP + staff attribution |
| `telemetry.cost` | `cost.recorded` (provider, model, prompt version, stage, unit cost — the FS-10.03 feed) | Platform |

Naming rule: `family.past_tense_fact` — events are facts, never commands. Additions require a matrix row before build (governance mirroring Doc 13's matrix-first rule).

**Part C — Consumer Reaction Matrix (v1 core; full table is a living artifact owned with this doc)**

| Event | M7 Timeline | M11 Analytics | M13 Notify | M10 Billing | M12 Ops | Other |
|---|---|---|---|---|---|---|
| `creator.enriched/scored` | Append (requesting WS) | Refresh projections | "Enrichment ready" (A2 ladder step 4/5) | — | Coverage funnel telemetry | M5→index re-projection |
| `discovery.job_completed` | Append summary | — | Job-done notification | Commit/release reservation (via M10 API) | Job cost rollup | M3 result assembly |
| `campaign.stage_changed` | Append | Conversion projections | Owner notification (per prefs) | — | — | M9: stop-condition check (stage=Agreed/terminal → sequence stop) |
| `campaign.rate_recorded` | Append (rate history) | — | — | — | — | — |
| `outreach.reply_received` | Append | Response-rate projections | "Reply received" | — | — | **M9: sequence stop (hard condition)**; session-window open (S2 WhatsApp) |
| `outreach.optout_recorded` | Append | — | — | — | Abuse telemetry | M9: consent state → `opted_out`, all sequences stop across workspace |
| `outreach.mailbox_revoked` | Append | — | Owner alert (FS-06.01) | — | — | M9: freeze user's sequences |
| `billing.subscription_state_changed` | — | Revenue projections | Owner notification (banner + email) | Source | Drift/heal alerts | M1: entitlement snapshot invalidation |
| `credit.balance_threshold_crossed` | — | — | 80%/95% warnings (FS-07.03) | Source | — | — |
| `reveal.contact_revealed` | Append | — | — | Consumption (already committed) | Provenance log (R-LEG accounting) | M9: contact becomes `contactable` |
| `admin.impersonation_started` | Append (dual-attributed) | — | Owner notification (unless contract-suppressed) | — | Audit log (already written, audit-first) | — |
| `cost.recorded` | — | — | — | — | Guardrail dashboard, budgets, anomaly detection | — |

Matrix rule: a module consuming an event not listed for it = review defect (Qwen checkpoint).

**Part D — Critical Flow Specifications**

**D1. Paddle Money Flow (correctness-critical)**
1. Webhook Gateway: signature verify (fail → 4xx + alert, no processing) → append to raw event store → emit `billing.webhook_received` → ack Paddle fast (processing is never inline with the ack — Paddle retries are our safety net, not our threat).
2. M10 consumer (partition-ordered by subscription ID): idempotency check (Paddle event ID) → `occurred_at` comparison vs. last-applied → **on any ambiguity, fetch current subscription from Paddle API and reconcile to truth** (fetch-to-heal) → apply FS-08.02 state machine → ledger entries in the same transaction (grants/expiry per event type) → outbox-emit `billing.subscription_state_changed` / `credit.granted`.
3. Downstream per matrix: M1 invalidates entitlement snapshots (next request re-resolves — Doc 10 A2), M13 notifies, M11 projects, M12 monitors drift.
4. Failure paths: handler crash → redelivery (idempotent); webhook outage → daily reconciliation heals + `billing.reconciliation_healed` emitted (frequent heals = defect alarm); checkout race → pending-purchase record resolves on whichever arrives first (webhook or user return + poll), other path becomes no-op via idempotency.

**D2. Live Discovery Flow (heavy ingestion)**
1. M3 confirms quote → M10 `credit.reserved` (reserve-commit, FS-08.03) → `discovery.job_queued` (correlation ID = job ID).
2. M4 stage execution (per-key ordering by job ID; per-candidate isolation): Serper stage → candidate batch checkpoint → Apify stage (parallel per-candidate fan-out, bounded concurrency per platform politeness policy — Doc 17) → validation gate (M5) → scoring (M6 routing ladder) → persistence (M5: GCP write + index projection, emitting `creator.discovered/enriched/scored` per creator).
3. Progress: each `discovery.stage_completed` updates job state; client polls job state (ADR-021); results stream into the UI as creators persist (Doc 12 progressive rendering).
4. Completion: `discovery.job_completed` with per-candidate accounting → M10 commits reservation proportional to successful candidates, releases remainder (`credit.committed`/`credit.released`) — **no silent credit loss** (testable).
5. Failure paths: stage retry from checkpoint; candidate failure → skip + account; job-level failure → `discovery.job_failed` → full release + honest UX state + M12 alert. Runaway protection: per-job candidate cap + adapter circuit breakers (Doc 15 Part D5).

**D3. Outreach Sequence Flow (time-delayed correctness)**
1. Enrollment: `outreach.sequence_enrolled` → M9 computes next-step due time (wait rules + send window: workspace TZ, PKT default, Jumu'ah exclusion — FS-06.03).
2. Scheduler tick → due steps enqueued (per-key ordering by enrollment ID). **At execution time — never enqueue time — M9 re-evaluates full eligibility:** consent state, stop conditions (reply/stage/opt-out/manual/campaign-archived), mailbox token validity, daily cap headroom, send window still open. Any failure → step skipped or sequence stopped with reason (`outreach.sequence_stopped`), never a stale send. *This rule exists because hours or days pass between scheduling and execution — the world changes; the send must respect the world at send time.*
3. Send via mailbox adapter → `outreach.message_sent` → timeline. Cap exhaustion → step deferred to next window (queue-and-resume per FS-06.01), not dropped.
4. Reply detection: mailbox sync (thread-scoped per FS-06.01 privacy boundary) → `outreach.reply_received` → matrix reactions (sequence stop is consumer-side and idempotent — a reply arriving twice stops an already-stopped sequence harmlessly).

**Part E — Queue Classes, Backpressure & Rate Limiting**

- **Queue classes (isolation by blast radius):** `interactive` (enrichment, add-by-URL — user-waiting; highest priority), `discovery-bulk` (live search fan-out), `scheduled` (sequences, reconciliation, integrity checks), `events` (matrix fan-out consumers), `webhooks` (money path — never starved by discovery load). Class-level concurrency budgets; discovery can saturate its own class only.
- **Backpressure:** `interactive` depth beyond SLO → new live-search offers degrade honestly ("high demand — results may take longer") before intake throttling; `discovery-bulk` depth → job admission queueing with user-visible position. Ingestion never backpressures the money path (class isolation).
- **Rate limiting:** per-workspace action limits (abuse ceiling, M12-tunable), per-platform scrape politeness (Doc 17 policy), per-mailbox caps (FS-06.01).

**Part F — Load Model & Scalability Strategy**

**F1. S1/S2 load envelope (design targets, not predictions):** ≤500 workspaces, ≤2k WAU, ≤50k indexed creators (S1) → ≤500k (S2), ≤5k discovery candidates/day, ≤20k sequence sends/day, ≤100k events/day. Verdict: **one primary DB with read replicas, one index node-set, and horizontally scaled workers cover this envelope with an order of magnitude of headroom** — the monolith is not the bottleneck at this scale; external adapters (Apify throughput, LLM rate limits) are, and they scale by provider quota, not by our topology.

**F2. Scaling axes (in order of use):** worker replicas per queue class → DB read replicas for projections/search-adjacent reads → index scaling (engine-managed) → payload archive is object storage (infinitely boring) → API replicas behind the load balancer (stateless by construction: Tenancy Context per request, no server sessions).

**F3. Module extraction triggers (pre-agreed; M4 first candidate, M6 second):** extract a module into a separate service only when **any** of: (1) its queue class requires sustained concurrency that materially degrades co-tenant workloads despite class isolation (measured: >20% latency SLO erosion attributable to resource contention, 2 consecutive weeks); (2) its deploy cadence blocks others (>2 hotfixes/month delayed by unrelated module freezes); (3) its resource profile diverges hard (M6 GPU-adjacent inference proxying vs. web-serving); (4) team structure splits ownership (Conway trigger, ≥2 teams). Extraction is cheap by design: M4/M6 already communicate only via queue + adapters (Doc 14 boundary rule) — extraction is a deployment change, not a rewrite. **Anti-trigger:** "microservices would be cleaner" is explicitly not a trigger.

**F4. ADR-021 — Accepted: job-progress via client polling v1** (simple, stateless, cache-friendly; intervals tiered by job class). Upgrade trigger to push (SSE-class): polling load >5% of API traffic **or** S2 WhatsApp inbox requiring sub-5s message delivery UX. Decision pre-made to prevent re-litigation.

#### Dependency Mapping

- **Depends on:** Doc 14 (modules, planes, adapter/webhook gateway), Doc 15 (scoring stages, cost events), FS-06/08/10 behavioral contracts, ADR-017/018.
- **Enables:** Doc 17 (transport realization per adapter/webhook), Doc 19 (outbox, processed-event ledger, projection persistence), Doc 22 (queue infra, worker fleets, autoscaling config), Doc 23 (lag/depth/DLQ observability), Doc 24 (replay from raw stores/outbox), Doc 26 (idempotency, ordering, flow tests).
- **Blocks:** Mimo worker implementation pends queue vendor naming (Doc 22) — scaffolding against the semantics here proceeds now.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-057 | F1 load envelope holds through S2 (±3×) | Med-High | Doc 23 capacity dashboards | Earlier replica/index scaling; envelope re-model |
| A-058 | Managed queue provides per-key ordering (partition/FIFO-group semantics) | Med-High | Doc 22 vendor check | Consumer-side ordering buffers (complexity, bounded) |
| A-059 | Outbox relay lag p95 <2s at envelope load | High | Load test (Doc 26) | Relay tuning; UX unaffected (async flows tolerate seconds) |
| A-060 | Polling-v1 acceptable UX for discovery jobs (with progressive results) | Med-High | S1 telemetry | ADR-021 trigger fires early |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-TEC-011 | Technical | Non-idempotent consumer slips through review → duplicate side effects (double sends, double credits) | M | H | Idempotency test class mandatory per consumer (Doc 26); processed-event ledger as shared library pattern; Qwen checklist item |
| R-TEC-012 | Technical | DLQ neglect: poisoned events silently accumulate | M | M | DLQ depth alerting (M12), weekly DLQ review ritual (Doc 28 runbook), replay tooling requirement (Doc 24) |
| R-TEC-013 | Technical | Event schema evolution breaks consumers | M | M | Envelope schema version + additive-only evolution rule; breaking change = new event type (governance, Part B) |
| R-OPS-006 | Operational | Matrix drift: real consumers diverge from documented matrix | M | M | Matrix as living artifact with PR-coupled updates; periodic audit item |
| R-FIN-011 | Financial | Reservation leaks (reserved-never-committed/released) under partial failures | L | M | Reservation TTL + sweeper job (releases expired reservations, alerts on volume); ledger integrity check extension (FS-08.03) |

#### Alternatives Considered & Trade-offs

- **Exactly-once delivery ambitions** — rejected: mythical at system boundaries; at-least-once + idempotency is honest and testable.
- **Event sourcing as system-wide persistence** — rejected: Timeline and Ledger are already the two substrates that *deserve* append-only treatment (Docs 9/10); making everything event-sourced taxes every feature for two substrates' benefit. Events remain transport; state remains relational.
- **Direct module-to-module async calls (no taxonomy)** — rejected: hidden coupling, unreviewable; the matrix is the price and the payoff.
- **WebSockets from day one** — rejected (ADR-021): infrastructure and reconnect complexity ahead of need; trigger defined.
- **Kafka-class streaming platform** — rejected at this scale (ADR-002/ops weight); managed queue with per-key ordering suffices; revisit only via F3-style evidence.
- **Search/Discovery thread:** closed (Doc 15); this document only realizes its transport — verified no new constraints.

#### Gap Analysis Report

- Full consumer matrix (Part C is core subset) must be completed as the living artifact before Mimo consumer build — owner: Engineering Director; format: appendix table PR-coupled to consumer code.
- Reservation TTL value and sweeper cadence unset (R-FIN-011) — Doc 19/22 config; stub default: TTL = 2× max job duration.
- Notification digest batching semantics (M13 instant-vs-daily per FS-07.03) under-specified at the consumer level — assign to M13 build spec with Doc 12 tray behavior.
- `outreach.opened` privacy interaction with workspace-level tracking opt-in (FS-06.04) needs a consumer-side filter rule — one-line spec assigned to M9/M11: events emitted only when tracking enabled; no retroactive emission.
- Cross-region considerations absent by design (single-region S1/S2 assumption) — hands a confirmation requirement to Doc 22 (region choice per R-UX-011 PK latency).

#### Cross-References & Decision Traceability

**ADR-020 (transactional outbox; at-least-once + idempotent consumers; per-key ordering) — Accepted. ADR-021 (polling v1; defined push trigger) — Accepted.** Realizes: FS-08.02 robustness (D1 = the generalized pattern), FS-08.03 reserve-commit transport (`credit.*` family), FS-06.03 stop conditions (D3 execution-time eligibility), Doc 9 A1 (A4 boundary: M7 sole timeline writer), FS-10.03 feed (`cost.recorded`), Doc 14 F3-ready boundaries (extraction economics). Discharges Doc 14's deferred push-vs-poll question. Scale posture consistent with A-051.

#### Open Questions & External Dependencies

1. Queue vendor + per-key ordering capability confirmation (Doc 22, A-058).
2. Region selection for PK latency (Doc 22, carries R-UX-011).
3. Full matrix completion (Engineering Director, pre-build).
4. Paddle webhook retry/backoff envelope documentation review (Doc 17, informs D1 timing tolerances).

#### Future Revision Triggers

Any F3 extraction trigger firing; ADR-021 push trigger; envelope breach (A-057); DLQ volume trend >0.1% of throughput; duplicate-side-effect incident (R-TEC-011 → process tightening); event taxonomy additions (matrix-first rule).

#### Review Checklist & Validation Criteria

- [ ] Every cross-module reaction flows through a taxonomy event (no hidden coupling). ✅
- [ ] Outbox emission atomic with state change. ✅
- [ ] All three critical flows specify failure behavior at every step. ✅
- [ ] Execution-time eligibility rule explicit for delayed actions. ✅
- [ ] Extraction triggers numeric and pre-agreed; anti-trigger stated. ✅
- [ ] Money path isolated from ingestion load (queue classes). ✅
- [ ] Zero code. ✅
- [ ] Sign-off: Principal Architects (Software, Data, Cloud), Engineering Director; Qwen review of matrix completeness and idempotency assertions.

---

[AWAITING APPROVAL]


---

<a name="doc-017"></a>
# DOC-017 — Third-Party Integrations, Webhooks and API Gateway Strategy

Generating the Phase 5 finale.

---

#### DOC-017 — Third-Party Integrations, Webhooks & API Gateway Strategy
**Status:** Draft v1.0 | **Phase:** 5 | **Owner:** Principal Architects (Software, Cloud, Security) | **Consumes:** Doc 14 (Adapter Layer, Webhook Gateway), Doc 15 (routing ladder, vendor criteria), Doc 16 (flows, queue classes)

---

#### Executive Summary

This document turns the Adapter Layer from an architectural box into a set of enforceable behavioral contracts. It defines the **Uniform Adapter Contract (ADR-022)** — the seven obligations every adapter satisfies identically (credentials, retries, circuit breaking, cost emission, health, degraded-mode signaling, sandbox parity) — then specifies each critical integration: **Paddle** (verification, idempotency, and the full reconciliation decision table), **Apify/Serper** (politeness policies, breakage detection via output-schema canaries, multi-actor fallback), **LLM providers** (timeout/fallback chains realizing Doc 15's routing ladder, with provider-failure degradation that never fabricates), **Gmail/Outlook** (OAuth lifecycle with revocation-first design), and **BSP/WhatsApp** (S2, selection gates fixed now because Meta onboarding lead times demand early action). The API Gateway strategy is deliberately minimal for S1/S2: **no public API (ADR-023)** — a managed edge (CDN/WAF-class) in front of one first-party API surface with app-level rate limiting, because our gateway complexity should serve the product we have, not the platform we might become.

#### Purpose & Scope

Adapter contracts and per-integration behavioral specifications; webhook handling realization (Doc 16 D1 pattern generalized); vendor selection criteria and decision gates for pending selections (index engine, LLM providers, BSP, FX); API gateway/edge strategy, rate limiting, and credential/key management. Binding on Doc 20 (API surface), Doc 21 (secret storage, token security), Doc 22 (edge/runtime realization), Doc 26 (contract-test classes).

#### Non-Goals

- Vendor *pricing negotiations* and final commercial signatures (procurement; criteria and gates fixed here).
- Public/partner API design — explicitly deferred (ADR-023); Doc 20 defines the first-party API only.
- Infrastructure providers (cloud, queue, DB hosting) — Doc 22.
- Secret-management implementation detail (Doc 21; requirements stated here).
- Zero code (policy upheld).

#### Objectives & Success Criteria

- Every external call site satisfies the seven adapter obligations — structurally verifiable (one adapter base contract, per-service implementations; Qwen checklist).
- Every integration has: failure taxonomy, fallback behavior, and a sandbox/test story (Doc 26 dependency).
- Scraper breakage is *detected by us before users report it* (canary objective: detection within 1 hour of systematic breakage).
- No credential lives outside the secret store; no adapter shares credentials with another.

#### Detailed Content

**Part A — Uniform Adapter Contract (ADR-022 — Accepted)**

Every adapter provides, identically:
1. **Credential management:** secrets from the managed secret store only (Doc 21); per-adapter isolation; rotation without deploy (hot-reload on rotation signal); customer-owned credentials (OAuth tokens, WABA) stored encrypted per Doc 21, never in adapter config.
2. **Retry discipline:** idempotent-safe retries only (GET/idempotency-keyed writes); exponential backoff + jitter; per-adapter retry budget; retryable-vs-terminal error classification table (each adapter defines its own, reviewed).
3. **Circuit breaker:** error-rate and latency thresholds per adapter; **wired to FS-10.03 budget caps** (spend trip = same breaker); open-circuit → degraded-mode signal consumed by feature fallback ladders (Doc 8) — features never see raw provider errors.
4. **Cost emission:** `cost.recorded` per call (Doc 16 taxonomy) with unit cost, operation, attribution (model×prompt for LLM; actor×platform for Apify) — no exceptions, including failed calls that still bill.
5. **Health reporting:** rolling success rate, latency percentiles, quota headroom → M12 provider health board (FS-10.04).
6. **Degraded-mode contract:** every adapter declares its degraded behaviors (cached-only, queue-and-retry, honest-unavailable) so feature ladders bind to named states, not ad-hoc conditions.
7. **Sandbox parity:** every adapter has a test double + provider-sandbox configuration (where the provider offers one) — contract tests in Doc 26 run against doubles; scheduled verification runs against sandboxes.

**Part B — Integration Specifications**

**B1. Paddle (money path — realizes Doc 16 D1)**
- **Inbound:** Webhook Gateway verifies Paddle signature per delivery (invalid → 4xx, alert, never processed); raw payload appended before any processing; ack within seconds (processing always async).
- **Idempotency:** Paddle event ID is the processed-ledger key (Doc 16 A3).
- **Reconciliation decision table (fetch-to-heal, canonical):** trigger conditions — (a) event `occurred_at` older than last-applied for that subscription, (b) event implies a transition the state machine disallows from current state, (c) gap detection (sequence anomaly), (d) daily sweep. Action: fetch subscription + latest transactions from Paddle API → recompute expected local state → if divergent, apply Paddle truth, emit `billing.reconciliation_healed` with diff, alert on heal. **Paddle API truth always wins**; local state is a cache of Paddle's reality plus our ledger consequences.
- **Outbound:** catalog sync (FS-08.01 mapping validated against Paddle products on deploy — drift fails the deploy); checkout session creation with workspace-ID passthrough metadata (D1 binding requirement).
- **Sandbox:** full state-machine test coverage against Paddle sandbox required before S1 billing go-live (A-031 validation vehicle); simulated-event replay harness for Doc 26.

**B2. Apify (scrape orchestration)**
- **Actor strategy:** per-platform primary actor + designated fallback actor (different maintainer where possible — R-TEC-007 hedge); actor versions pinned; upgrades pass the validation-panel regression before adoption (mirrors Doc 15 eval-gate discipline).
- **Politeness policy (binding):** per-platform concurrency ceilings and request pacing set conservatively (values configured in M12, reviewed monthly); no authenticated-session scraping — public surfaces only (A-050 legal posture line); per-candidate depth limits (posts sampled, not exhaustive archives) — depth is a cost *and* politeness control.
- **Breakage detection (the canary system):** every scrape output passes M5's schema/completeness validation; per-actor rolling validity rate tracked; drop below threshold (default 80% over 1h) → automatic actions: switch to fallback actor, open circuit on the failing actor, M12 alert, affected jobs re-queued. This is how we detect platform DOM changes within the hour, not via support tickets.
- **Credential/infra:** proxy management is Apify's business (ADR-002); our credentials = Apify API tokens, rotated quarterly.
- **Degraded modes:** platform-level outage → discovery jobs proceed with remaining platforms + honest per-platform notice; total outage → Brain-1-only mode (Doc 14 fallback).

**B3. Serper (candidate discovery)**
- Query construction per interpreted intent (Doc 15 B2 output); **SERP response cache** (query-normalized, TTL 7d) — candidate discovery tolerates staleness well and this is the cheapest cost lever on the discovery path; per-job query budgets (cost cap); degraded mode → add-by-URL-only discovery (honest notice).

**B4. LLM providers (realizes Doc 15 C1 ladder)**
- **Multi-provider posture:** ≥2 providers configured per tier (primary + fallback), pinned model versions per Prompt Registry linkage; provider choice per tier is configuration, not code.
- **Timeout/fallback chain per task:** timeout (per-task budget) → single same-provider retry → alternate-provider same-tier attempt → tier-appropriate degradation: T-A tasks may escalate to T-B (quality up, cost up — acceptable for small volumes); T-B/T-C tasks **degrade to honest failure** (Doc 8 fallback states) — never a cheaper-model substitution for reasoning tasks, because silent quality downgrades on authenticity scoring are trust poison. Substitution *downward* happens only via eval-gated configuration change (Doc 15 Part E), never at runtime.
- **Token budget enforcement:** per-task input/output ceilings from the registry; over-budget context → deterministic truncation per task's RAG rules (Doc 15 C3), never silent overflow billing.
- **Selection criteria (Doc 15 handoff, fixed here):** schema-output reliability on golden sets, PK/Urdu handling (A-052), prefix-caching support (Part D2 economics), rate-limit headroom vs. F1 envelope, data-usage terms (no training on our payloads — hard gate, Doc 21/28 review).

**B5. Gmail / Outlook (mailbox adapters)**
- **OAuth lifecycle:** authorization-code grant, minimal scopes (send + thread read per FS-06.01 privacy boundary); refresh-token handling with proactive expiry refresh; **revocation-first design:** every send/sync failure is checked against auth-error signatures → immediate `outreach.mailbox_revoked` (Doc 16 matrix reactions: freeze sequences, alert owner) — revocation is a first-class state, not an error to retry.
- **Reply/thread sync:** polling v1 (interval tiered: active-campaign mailboxes minutes-level, idle mailboxes hourly) consistent with ADR-021; provider push (Gmail watch/Graph subscriptions) is the pre-approved upgrade path when ADR-021's trigger fires — noted so Mimo builds the sync layer poll/push-agnostic.
- **Cap enforcement:** daily send caps counted at the adapter (single choke point — sequences, manual sends, and future channels all decrement one counter per mailbox); cap headroom exposed to M9's execution-time eligibility check (Doc 16 D3).
- **ToS posture:** A-021 validation task attached here — automation limits reviewed against current Google/Microsoft platform terms before S1 send volumes ramp.

**B6. BSP / WhatsApp (S2 — selection gates fixed now, onboarding started now)**
- **Selection gates (binding):** PK phone-number provisioning support; embedded signup availability; template management API completeness (submit/status/pause states per FS-06.06); webhook delivery states coverage; conversation-category pricing transparency (feeds credit pricing); Meta Tech Provider pathway support. Twilio/MessageBird/360dialog-class candidates evaluated against these six gates only.
- **Lifecycle obligations:** per-workspace WABA binding (never shared, ADR-009); quality-rating webhook → `outreach.whatsapp_quality_changed` → auto-pause reactions (FS-06.06); template state machine synced via BSP API with local cache of approval states.
- **Action item (schedule-critical):** Meta Tech Provider onboarding + BSP sandbox account initiated during S1 — the lead time is the reason this S2 feature has S1 procurement work.

**B7. Supporting adapters (abbreviated):** **FX rates** — daily-fetch managed rate API, rates stored with timestamps (FS-05.01), staleness >48h → conversions flagged in UX; **Managed auth** (NFR-S02) — session issuance/validation only, no user PII duplication beyond the identity contract (Doc 18); **Transactional email/notification service** — digest dispatch (M13), suppression-list sync; **Virus scanning** (FS-04.03) — async scan-on-upload, quarantine state.

**Part C — API Gateway & Edge Strategy**

**C1. ADR-023 — Accepted: no public API at S1/S2.** One first-party API surface (Doc 20) consumed only by our web client. Rationale: a public API is a product with versioning, support, abuse, and deprecation obligations — none of which serve S1 partners; workflow-gravity strategy (ADR-001) is UI-led at this stage. Consequence: gateway needs are modest; revisit trigger: ≥3 enterprise prospects requiring API access, or partner-integration strategy activation (Doc 5 optionality log).
- **Edge:** managed CDN/WAF-class front (ADR-002): TLS termination, static asset caching, basic WAF rules, DDoS absorption, geo latency mitigation (PK-relevant, pairs with Doc 22 region choice).
- **App-level middleware (behind edge):** authentication (managed-auth session validation → Tenancy Context, Doc 14 A2), then rate limiting, then routing to the monolith.
- **Rate limiting (three concentric layers):** edge-level anonymous/IP limits (abuse floor) → per-user session limits (generous; power-user grammar in Doc 12 must never trip it — budget: 10× observed p99 usage) → per-workspace action-class limits (M12-tunable; the abuse instrument for scrape-adjacent actions like add-by-URL, closing Doc 11's open question: **yes, add-by-URL is rate-limited per workspace**, default 50/day, tier-adjustable).
- **Key management:** no customer API keys exist (ADR-023). Internal service credentials (adapter tokens, webhook signing secrets) live in the secret store with per-credential rotation schedules (Doc 21 registry). Webhook endpoints are per-source paths with per-source secrets — one leaked secret never exposes another source.
- **Versioning posture:** single evolving first-party API contract co-deployed with the client (no version negotiation needed v1); breaking-change discipline still applies (Doc 20 rules) because mobile-web caching means old clients briefly exist.

#### Dependency Mapping

- **Depends on:** Doc 14 (adapter/gateway architecture), Doc 15 (ladder, vendor criteria), Doc 16 (D1–D3 flows, taxonomy), Docs 8–10 (fallback ladders, FS-06/08 behaviors), ADR-002/009/016/021.
- **Enables:** Doc 20 (first-party API under ADR-023), Doc 21 (secret/token security requirements enumerated), Doc 22 (edge + region realization), Doc 26 (contract tests, sandbox suites, canary tests), Mimo adapter build, procurement (criteria fixed).
- **Blocks:** Live-search credit pricing awaits spike cost telemetry through these adapters (OD-001 chain); S2 WhatsApp awaits B6 procurement.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation | Impact if False |
|---|---|---|---|---|
| A-061 | Apify actor ecosystem provides viable fallback actors per platform | Medium | Procurement scan during spike | Single-actor risk accepted per platform + faster breakage response SLO |
| A-062 | ≥2 LLM providers meet B4 gates incl. no-training terms | Med-High | Provider terms review | Single-provider risk logged; open-model host as forced second |
| A-063 | SERP caching (7d TTL) doesn't materially degrade candidate freshness | Med-High | Spike precision comparison | TTL reduction (cost rises) |
| A-064 | Edge/WAF managed tier suffices without custom gateway build through S2 | High | Doc 22 realization | Managed API-gateway product adoption (still ADR-002-compliant) |
| A-065 | Mailbox polling intervals achieve reply-detection latency acceptable for sequence stops (<15 min worst case) | Med-High | S1 telemetry | Push upgrade pulled forward (pre-approved path, B5) |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-TEC-014 | Technical | Coordinated platform anti-bot escalation defeats actor fallbacks simultaneously | M | H | Canary detection (1h objective) + Brain-1-only degraded posture + user-submitted flow keeps product alive; strategic hedge: vendor-fallback optionality (Doc 14) |
| R-SEC-007 | Security | Webhook secret/credential leak enables forged money events | L | Critical | Per-source secrets, signature verification before processing, secret-store isolation, rotation schedules; forged-event attempt alerting (signature-failure spike = incident) |
| R-TEC-015 | Technical | LLM provider rate limits throttle discovery bursts | M | M | Multi-provider same-tier spillover (B4 chain), queue-class backpressure (Doc 16 E), per-job pacing |
| R-OPS-007 | Operational | Adapter sprawl: each new integration hand-rolls obligations inconsistently | M | M | ADR-022 base-contract pattern + Qwen checklist per adapter PR; contract-test template (Doc 26) |
| R-LEG-007 | Legal | Mailbox automation breaches Google/Microsoft platform terms → app suspension | L-M | H | A-021 review pre-ramp; conservative caps; user-mailbox model (ADR-010) keeps volumes per-account modest |
| R-FIN-012 | Financial | Failed-but-billed external calls leak COGS invisibly | M | M | Cost emission on failures (A obligation 4); failed-call cost dashboard slice (M12) |

#### Alternatives Considered & Trade-offs

- **Full API-gateway product (Kong/Apigee-class) now** — rejected: serves a public API we don't have (ADR-023); edge + middleware covers first-party needs at a fraction of ops weight.
- **Custom scraping infrastructure instead of Apify** — re-affirmed rejected (ADR-002/016 boundary: we orchestrate managed scraping, we don't operate proxy fleets).
- **Single LLM provider for simplicity** — rejected: R-FIN-010/R-TEC-015; two-provider posture is the minimum honest hedge for a core dependency.
- **Runtime downward model substitution on failure** — rejected (B4): silent quality degradation on trust-bearing scores; honest failure chosen.
- **Webhook processing inline with ack** — rejected (B1): Paddle retry behavior becomes our failure mode; async-after-ack chosen (Doc 16 D1).
- **Search/Discovery thread:** closed; this doc realizes vendor criteria only — no new constraints (verified).

#### Gap Analysis Report

- Vendor selections remain open pending spike results: index engine (Doc 15 criteria), LLM providers (B4 gates), Apify actor shortlist (A-061), BSP (B6 gates) — all criteria now fixed; procurement can run in parallel with Phase 6. Owner: Engineering Director.
- Politeness-policy numeric defaults (B2) set conservatively at spike time — values are config, review ritual monthly (M12).
- Outlook/Graph-specific behavioral deltas vs. Gmail (thread models differ) flagged for adapter design detail — Mimo build note, not a spec gap.
- Webhook Gateway raw-store retention duration unset → Doc 21 retention schedule (stub: 13 months, covering annual billing disputes).
- Provider data-usage/no-training contractual verification (B4 hard gate) needs legal execution → Doc 28 checklist.

#### Cross-References & Decision Traceability

**ADR-022 (Uniform Adapter Contract, seven obligations) — Accepted. ADR-023 (no public API S1/S2; managed edge + app middleware) — Accepted.** Realizes: Doc 16 D1 (B1 decision table), D2 dependencies (B2/B3/B4), D3 (B5 cap choke point + execution-time eligibility input); Doc 15 C1 ladder transport (B4) and Part D economics (B3 SERP cache, B4 prefix-caching gate); FS-10.03/10.04 (obligations 4–5); Doc 8 fallback ladders (obligation 6 named states); ADR-009/010 (B5/B6 postures). Closes Doc 11's add-by-URL rate-limit question (C1). A-021/A-031/A-050 validation vehicles assigned. Doc 16's Paddle-retry-envelope question absorbed into B1 sandbox work.

#### Open Questions & External Dependencies

1. Spike execution across B2/B3/B4 (the gating evidence for A-047/48/49/52/54/55 — now fully instrumentable through these adapter specs).
2. Provider procurement against fixed gates (Engineering Director; parallel with Phase 6).
3. Meta Tech Provider + BSP onboarding start (calendar-critical for S2).
4. Legal: no-training terms verification; mailbox ToS review; scraping posture memo (Doc 28 consolidated).
5. Edge/region realization pairing (Doc 22, R-UX-011).

#### Future Revision Triggers

Canary threshold breaches becoming weekly (politeness/actor strategy revision); any B4 gate failure in procurement; ADR-023 revisit trigger (enterprise API demand); Paddle API/webhook schema version changes; Meta platform policy shifts affecting B6.

#### Review Checklist & Validation Criteria

- [ ] Every adapter obligation enumerable and testable (seven, uniformly). ✅
- [ ] Money path: verification → raw store → async processing → fetch-to-heal, fully specified. ✅
- [ ] Scraper breakage detected by canaries, not customers. ✅
- [ ] LLM failures degrade honestly; no silent downward substitution. ✅
- [ ] Revocation-first mailbox design; caps enforced at one choke point. ✅
- [ ] No customer API keys exist; per-source webhook secrets. ✅
- [ ] Zero code. ✅
- [ ] Sign-off: Principal Architects (Software, Cloud, Security, AI/Search), Engineering Director; Qwen review of adapter-contract conformance plan.

---

Phase 5 (Technical Architecture) is complete: Docs 14–17 fix the topology, the intelligence/search engine, the asynchronous nervous system, and the external-boundary contracts. Next per blueprint: **Phase 6 — Data & API Design, opening with Doc 18 (Domain Model, Entity Relationships & Data Lifecycle)**, which inherits three named obligations: the Interaction Timeline and Ledger persistence models, the identity-resolution rules (Doc 14 gap), and the controlled niche vocabulary (Doc 15 blocker).

[PHASE 5 COMPLETE - AWAITING APPROVAL FOR PHASE 6]


---

<a name="doc-018"></a>
# DOC-018 — ARB Audit 1 + Domain Model, Entity Relationships and Data Lifecycle

---
title: "Doc 18 — ARB Audit #1 + Domain Model, Entity Relationships & Data Lifecycle"
status: Locked
last_updated: 2026-07-05
tags: [data-design, domain-model, arb-audit, locked]
---

# Doc 18 — ARB Audit #1 + Domain Model, Entity Relationships & Data Lifecycle

**Status:** ✅ Locked
**Phase:** 6 — Data & API Design
**Source file:** `ARB AUDIT #1 + DOC-018 — Architecture Review Board Audit & Domain Model.md`

---

## Summary

Combined ARB Audit #1 report and domain model specification. Identified 10 structural gaps (GAP-ARB-001 through GAP-ARB-010), generated 10 architectural patches, and added 5 new ADRs (ADR-024 through ADR-028). Defines the full entity catalogue for GCP and WP planes, the workspace_creator_link bridge entity, Timeline/Ledger substrates, identity resolution state machine, GDPR two-tier deletion lifecycle, and the 48-category niche vocabulary (v1).

## ARB Audit #1 Gap Summary
| Gap | Severity | Resolution |
|---|---|---|
| GAP-ARB-001 | Critical | workspace_creator_link bridge entity (ADR-024) |
| GAP-ARB-002 | Critical | PII nullification tombstone (ADR-025) |
| GAP-ARB-003 | High | 5 composite indexes + monthly partitioning (PATCH-003) |
| GAP-ARB-004 | High | SELECT FOR UPDATE on balance row (ADR-026) |
| GAP-ARB-005 | High | Per-state reservation disposition contract (PATCH-005) |
| GAP-ARB-006 | High/Regulatory | Priority queue + last-gate consent version check (PATCH-006) |
| GAP-ARB-007 | Medium | Per-job dedup set + inflight_url_lock (PATCH-007) |
| GAP-ARB-008 | High | Confidence tiers + merge_status enum (PATCH-008) |
| GAP-ARB-009 | Medium | Synchronous projection for new records (ADR-027) |
| GAP-ARB-010 | Medium | (prompt_version, model_version) scoped dedup key (ADR-028) |

## New ADRs
- ADR-024: GCP/WP cross-plane soft FK via workspace_creator_link
- ADR-025: GDPR erasure = PII nullification tombstone
- ADR-026: Credit ledger SELECT FOR UPDATE concurrency
- ADR-027: Synchronous index projection for new creators
- ADR-028: Prompt version promotions require CPO cost-gate

---

*[[Home]] | [[ADR-Log]] | [[Doc-19-Physical-Schema]] | [[Risk-Register]]*



---

<a name="doc-019"></a>
# DOC-019 — Physical Schema, DDL and Migration Strategy

#### DOC-019 — Physical Schema DDL & Migration Strategy
**Status:** Draft v1.0 | **Phase:** 6 — Data & API Design | **Owner:** Principal Architects (Data, Software) | **Consumes:** Doc 18 (entity catalogue, ARB patches ADR-024–028), Doc 16 (event taxonomy, outbox), YouTube spike validation (2026-07-05)

---

#### Executive Summary

This document translates the Doc 18 domain model into the canonical physical schema for MUSHIN's PostgreSQL database. It is Mimo's authoritative build contract for all data persistence. The schema is organized into three PostgreSQL schemas — `gcp`, `wp`, and `platform` — enforcing the Doc 14 plane separation at the database access-role level: no database-level foreign key crosses a schema boundary (ADR-024), making cross-plane joins structurally impossible without explicit role elevation. The document incorporates the **YouTube spike validation (2026-07-05)**: the `gcp.profile` table introduces `enrichment_source` and `payload_completeness_tier` enums to model the bimodal data-quality reality — YouTube Data API v3 delivers rich, structured payloads with the `subscriber_to_view_ratio` authenticity signal; Apify-sourced IG/TikTok profiles arrive sparse and flow through the Data-Gap Ladder. The **Interaction Timeline** and **Credit Ledger** are monthly-range-partitioned append-only tables with fully specified composite indexes (ARB PATCH-003/004). The **Credit Ledger concurrency contract** (ADR-026) is codified as a `workspace_credit_balance` materialization row locked via `SELECT FOR UPDATE`. The **migration strategy** mandates Flyway-class versioned SQL files, expand-contract zero-downtime patterns, `CREATE INDEX CONCURRENTLY` exclusively, and a partition pre-creation job that runs on the 15th of every month.

#### Purpose & Scope

Complete CREATE TABLE DDL for all entities defined in Doc 18, organized by schema; all custom types and enums; the full index catalogue keyed to the ARB patch requirements; monthly partition pre-creation statements for Timeline and Ledger; the transactional outbox table; and the migration governance rules. This document is the exclusive input for Mimo's database scaffolding. Doc 19 supersedes any ad-hoc schema decisions made during spiking.

#### Non-Goals

- ORM configuration files (Prisma schema, Drizzle config) — these are derived artifacts; see Part N note on ORM interop.
- Query plans, EXPLAIN ANALYZE outputs (Doc 23 / observability).
- Seed data, fixture files (Doc 26 test infrastructure).
- Backup / replication topology (Doc 22).
- Row-level security policies (assigned to Doc 21).
- The Prompt Registry storage format (Doc 25 engineering standards).

#### Objectives & Success Criteria

- Every entity from Doc 18 has a CREATE TABLE statement with all attributes, types, constraints, and comments.
- `gcp.profile` correctly models the YouTube-API / Apify bimodal enrichment reality from the spike.
- Timeline and Ledger partitions have all five mandated composite indexes (PATCH-003) and monthly partitioning defined.
- `wp.workspace_credit_balance` SELECT FOR UPDATE semantics are explicit in code comments and migration notes (ADR-026).
- `wp.workspace_creator_link` satisfies ADR-024 with no DB-level FK to the GCP schema.
- Migration governance produces zero-downtime schema evolution.
- Mimo can scaffold and migrate from this document without interpretation.

---

#### Detailed Content

**Part A — Schema Architecture & Access-Role Isolation**

```sql
-- ============================================================
-- SCHEMAS
-- Three schemas enforce the Doc 14 two-plane + platform topology.
-- No DB-level FK crosses a schema boundary (ADR-024).
-- ============================================================
CREATE SCHEMA IF NOT EXISTS gcp;   -- Global Creator Plane
CREATE SCHEMA IF NOT EXISTS wp;    -- Workspace Plane
CREATE SCHEMA IF NOT EXISTS platform; -- System / infra plane

-- ============================================================
-- ACCESS ROLES (plane separation enforced at DB layer)
-- Application service accounts are granted the minimal role set
-- required for their module responsibilities (Doc 14 Part C).
-- ============================================================

-- GCP roles
CREATE ROLE gcp_write_role;   -- M2, M4, M5, M6 service accounts only
CREATE ROLE gcp_read_role;    -- All backend modules (read for composed APIs)

GRANT USAGE ON SCHEMA gcp TO gcp_write_role, gcp_read_role;
GRANT SELECT ON ALL TABLES IN SCHEMA gcp TO gcp_read_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA gcp TO gcp_write_role;

-- WP roles
CREATE ROLE wp_write_role;    -- All feature modules (runtime tenancy enforced at app layer)
CREATE ROLE wp_read_role;

GRANT USAGE ON SCHEMA wp TO wp_write_role, wp_read_role;
GRANT SELECT ON ALL TABLES IN SCHEMA wp TO wp_read_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA wp TO wp_write_role;

-- Platform roles
CREATE ROLE platform_write_role;  -- Outbox relay, webhook gateway, audit writers
CREATE ROLE platform_read_role;

GRANT USAGE ON SCHEMA platform TO platform_write_role, platform_read_role;
GRANT SELECT ON ALL TABLES IN SCHEMA platform TO platform_read_role;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA platform TO platform_write_role;

-- ============================================================
-- RULE: No application code is granted both gcp_write_role
-- and wp_write_role simultaneously. Cross-plane writes are
-- the exclusive domain of the plane-global merge fan-out job
-- (ADR-024 / PATCH-008), which is a named, audited exception
-- operating under a dedicated service account.
-- ============================================================
```

---

**Part B — Custom Types and Enumerations**

```sql
-- ============================================================
-- ENUMS — stable, bounded value sets
-- For growing taxonomies (niche vocabulary), a reference table
-- is used instead of a PostgreSQL enum (see platform.niche_vocab).
-- ============================================================

-- Social platforms. Additive only — removal requires migration
-- through a new type + column swap (see Part N: enum evolution).
CREATE TYPE platform_enum AS ENUM (
    'instagram',
    'tiktok',
    'youtube',
    'twitter',
    'facebook'
    -- 'pinterest', 'snapchat' added when actor/API coverage exists
);

-- Enrichment data acquisition method.
-- YouTube spike (2026-07-05): YouTube routes to youtube_data_api_v3,
-- NOT Apify. All other platforms currently route to apify_actor.
-- This enum is the authoritative record of which adapter produced a profile.
CREATE TYPE enrichment_source_enum AS ENUM (
    'youtube_data_api_v3',   -- Structured, reliable (Rich tier)
    'apify_actor',           -- Sparse/variable (Standard or Sparse tier)
    'user_submitted',        -- URL submitted by workspace user
    'manual_entry'           -- Staff-created stub record
);

-- Payload completeness tier — drives Data-Gap Ladder UX (Doc 8 A2).
-- Rich: all expected fields present (YouTube Data API v3 response).
-- Standard: core fields present, some optional fields missing (good Apify scrape).
-- Sparse: significant gaps; partial profile only (poor Apify scrape).
-- Minimal: handle/URL only; enrichment not yet attempted or fully failed.
CREATE TYPE completeness_tier_enum AS ENUM (
    'rich',
    'standard',
    'sparse',
    'minimal'
);

-- Creator identity resolution lifecycle (Doc 18 B1, PATCH-008).
CREATE TYPE creator_merge_status_enum AS ENUM (
    'active',        -- Normal, queryable record
    'candidate',     -- 60–89% match confidence; pending admin review
    'merged_into'    -- Permanently redirect stub; points to winner
);

-- Enrichment snapshot types (Doc 18 B3).
CREATE TYPE snapshot_type_enum AS ENUM (
    'authenticity',
    'quality',
    'audience_estimate',
    'summary',
    'niche_classification'
);

-- Evidence confidence levels (Doc 8 A4).
CREATE TYPE confidence_level_enum AS ENUM (
    'high',
    'medium',
    'low',
    'insufficient_data'
);

-- Contact types (Doc 18 B5).
CREATE TYPE contact_type_enum AS ENUM (
    'email',
    'whatsapp_number',
    'website',
    'other'
);

-- Contact source confidence.
CREATE TYPE contact_source_enum AS ENUM (
    'scraped',
    'provider_verified',
    'user_submitted'
);

-- Workspace subscription lifecycle (Doc 10 FS-08.02).
CREATE TYPE subscription_state_enum AS ENUM (
    'trialing',
    'active',
    'past_due',
    'paused_grace',
    'canceled_pending',
    'expired'
);

-- Workspace member roles (Doc 10 A1).
CREATE TYPE member_role_enum AS ENUM (
    'owner',
    'admin',
    'member'
);

-- Membership status.
CREATE TYPE membership_status_enum AS ENUM (
    'active',
    'suspended',
    'pending_invite',
    'removed'
);

-- Campaign objectives (Doc 9 FS-05.01).
CREATE TYPE campaign_objective_enum AS ENUM (
    'awareness',
    'engagement',
    'conversion',
    'ugc'
);

-- Campaign status.
CREATE TYPE campaign_status_enum AS ENUM (
    'active',
    'archived',
    'completed'
);

-- Outreach channel (Doc 9 A2).
CREATE TYPE channel_enum AS ENUM (
    'email',
    'whatsapp'
);

-- Consent state per creator-channel (Doc 9 A3).
CREATE TYPE consent_state_enum AS ENUM (
    'unknown',
    'contactable',
    'opted_out',
    'bounced_invalid',
    'opt_in_required'  -- WhatsApp S2 only
);

-- Sequence enrollment status.
CREATE TYPE sequence_status_enum AS ENUM (
    'active',
    'stopped',
    'completed'
);

-- Sequence stop reasons (Doc 9 FS-06.03).
CREATE TYPE sequence_stop_reason_enum AS ENUM (
    'reply',
    'opt_out',
    'manual',
    'stage_terminal',
    'campaign_archived',
    'mailbox_revoked',
    'quality_pause',
    'subscription_expired'
);

-- Credit ledger entry types (Doc 10 FS-08.03).
CREATE TYPE ledger_entry_type_enum AS ENUM (
    'allowance_grant',
    'topup_purchase',
    'consumption',
    'expiry',
    'refund_adjustment',
    'promo_grant',
    'reversal',
    'reserved',
    'released',
    'committed'
);

-- Credit reservation status (Doc 18 E4, PATCH-005).
CREATE TYPE reservation_status_enum AS ENUM (
    'active',
    'committed',
    'released',
    'expired'
);

-- Discovery job types (Doc 14 D2).
CREATE TYPE discovery_job_type_enum AS ENUM (
    'live_search',
    'add_by_url',
    'deep_enrichment',
    'refresh'
);

-- Discovery job lifecycle.
CREATE TYPE discovery_job_status_enum AS ENUM (
    'queued',
    'running',
    'completed',
    'failed',
    'cancelled'
);

-- Timeline actor types (Doc 18 D1).
CREATE TYPE timeline_actor_type_enum AS ENUM (
    'user',
    'system',
    'ai',
    'staff_impersonated'
);

-- Platform scope class (Doc 16 A1 envelope).
CREATE TYPE scope_class_enum AS ENUM (
    'gcp',
    'wp',
    'platform'
);
```

---

**Part C — GCP Schema: Core Creator Entities**

```sql
-- ============================================================
-- gcp.creator
-- The canonical person/entity record. PII fields are nulled
-- on GDPR erasure (ADR-025 tombstone pattern).
-- ============================================================
CREATE TABLE gcp.creator (
    creator_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity (PII — nulled to '[erased]' on GDPR erasure, ADR-025)
    display_name        TEXT,
    primary_handle      TEXT,

    -- Identity resolution lifecycle (PATCH-008, ADR-024)
    merge_status        creator_merge_status_enum NOT NULL DEFAULT 'active',
    merged_into_creator_id UUID     REFERENCES gcp.creator(creator_id) ON DELETE RESTRICT,
    merge_candidate_for UUID        REFERENCES gcp.creator(creator_id) ON DELETE RESTRICT,
    merge_confidence    NUMERIC(5,4), -- 0.0000–1.0000; stored at candidate creation

    -- Index state (PATCH-009, ADR-027)
    index_pending       BOOLEAN     NOT NULL DEFAULT FALSE,
    -- TRUE while search-index projection is in-flight for a new record.
    -- Brain-1 does not serve creators where index_pending = TRUE.

    -- GDPR lifecycle (ADR-025)
    pii_erased_at       TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE gcp.creator IS
    'Canonical creator entity. Zero workspace-originating data. '
    'merge_status=merged_into records are permanent redirect stubs — never deleted. '
    'GDPR erasure: display_name and primary_handle are set to ''[erased]'', '
    'pii_erased_at is stamped. Row is retained for WP referential integrity (ADR-025).';

COMMENT ON COLUMN gcp.creator.index_pending IS
    'Set TRUE when a new creator is persisted to GCP but the search-index '
    'projection has not yet been confirmed (ADR-027). The M5 sync projection '
    'path clears this flag on successful index write. Brain-1 excludes these '
    'records to prevent serving incomplete projections.';


-- ============================================================
-- gcp.profile
-- A single social-platform account linked to a Creator.
-- YouTube spike (2026-07-05): YouTube profiles use the YouTube
-- Data API v3 (enrichment_source = youtube_data_api_v3), producing
-- rich, structured payloads. IG/TikTok profiles use Apify actors
-- and arrive sparse (standard or sparse completeness tier).
-- The subscriber_to_view_ratio column is the LLM-validated
-- YouTube authenticity signal confirmed in the spike.
-- ============================================================
CREATE TABLE gcp.profile (
    profile_id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id              UUID        NOT NULL REFERENCES gcp.creator(creator_id) ON DELETE RESTRICT,
    platform                platform_enum NOT NULL,

    -- Canonical identity anchor — dedup key (PATCH-007/009)
    canonical_url           TEXT        NOT NULL,
    -- Stored after normalisation: scheme stripped, query params stripped,
    -- trailing slash normalised. Example: 'instagram.com/p/handle'

    handle                  TEXT,
    -- handle_variants: transliteration expansions generated by T-A LLM (Doc 15 B1).
    -- Stored as text array; projected into search index as multi-value field.
    handle_variants         TEXT[],

    -- ── Enrichment metadata ──────────────────────────────────────────────
    enrichment_source       enrichment_source_enum NOT NULL DEFAULT 'user_submitted',
    -- Set to youtube_data_api_v3 for YouTube; apify_actor for IG/TikTok.
    -- Drives adapter routing in M4 (never switch a YouTube profile to Apify).

    payload_completeness_tier completeness_tier_enum NOT NULL DEFAULT 'minimal',
    -- rich     → YouTube Data API v3 (all fields present and validated).
    -- standard → Apify scrape with core fields present.
    -- sparse   → Apify scrape with significant gaps; Data-Gap Ladder UX shown.
    -- minimal  → URL/handle only; enrichment not yet attempted or fully failed.
    -- M5 sets this after payload validation. M3 reads it to decide
    -- whether to surface the Data-Gap Ladder CTA on the profile page.

    enrichment_status       TEXT        NOT NULL DEFAULT 'pending'
        CHECK (enrichment_status IN ('fresh','stale','pending','failed','unsupported')),
    enriched_at             TIMESTAMPTZ,
    enrichment_ttl_days     INTEGER     NOT NULL DEFAULT 30,
    -- Per Doc 8 A5: 30d for metrics, 90d for demographics.
    -- Stored per-profile so worker can compute staleness without config lookup.

    -- ── Universal metrics (platform-agnostic) ────────────────────────────
    -- For YouTube: follower_count = subscriber_count. Unified for index filtering.
    follower_count          BIGINT,
    engagement_rate         NUMERIC(8,6),   -- e.g. 0.034500 = 3.45%
    last_post_at            TIMESTAMPTZ,

    -- ── YouTube-specific metrics (NULL for non-YouTube profiles) ─────────
    -- These fields are only populated when enrichment_source = youtube_data_api_v3.
    -- The subscriber_to_view_ratio is the LLM authenticity signal confirmed
    -- in the YouTube spike (2026-07-05). A healthy channel has ratio 0.05–0.20;
    -- artificially inflated subscriber counts produce ratios near 0.
    yt_subscriber_count     BIGINT,
    yt_view_count           BIGINT,
    yt_video_count          INTEGER,
    yt_subscriber_to_view_ratio NUMERIC(10,8),
    -- Computed at enrichment: yt_view_count / NULLIF(yt_subscriber_count, 0).
    -- Stored (not a generated column) for queryability and index creation.
    -- M6 passes this directly to the authenticity reasoning prompt.
    yt_avg_views_per_video  NUMERIC(12,2),

    -- ── Platform-specific structured payload ─────────────────────────────
    -- Full structured summary of the enrichment payload. Not the raw scrape
    -- (that lives in object storage via scraped_payload_ref). This JSONB
    -- holds normalised, validated, schema-conformant fields beyond the typed
    -- columns above — e.g., top content categories, audience language mix,
    -- engagement breakdown by content type.
    platform_metrics        JSONB,

    -- ── Archive reference ─────────────────────────────────────────────────
    scraped_payload_ref     TEXT,
    -- Object-storage key for the raw scrape/API payload archive.
    -- Format: '{provider}/{year}/{month}/{profile_id}.json.gz'
    -- Used by M5/M6 for re-scoring from archive (Doc 14 D2 step 2).

    -- ── Search index projection state ─────────────────────────────────────
    index_projection_version INTEGER NOT NULL DEFAULT 0,
    -- Incremented on each successful search-index projection write.
    -- Allows detection of stale projections (index version < current projection version).

    -- ── GDPR lifecycle ─────────────────────────────────────────────────────
    pii_erased_at           TIMESTAMPTZ,
    -- When set: handle, handle_variants, platform_metrics PII fields are nulled.
    -- scraped_payload_ref deletion is tracked separately (object-storage job).

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_profile_platform_url UNIQUE (platform, canonical_url)
    -- This is the M5 UPSERT target (PATCH-007).
    -- Concurrent inserts for the same URL converge via ON CONFLICT DO UPDATE.
);

COMMENT ON TABLE gcp.profile IS
    'Single social-platform account belonging to a Creator. '
    'enrichment_source distinguishes YouTube Data API v3 (rich, structured) '
    'from Apify-sourced profiles (sparse). '
    'yt_subscriber_to_view_ratio is the spike-validated YouTube authenticity signal. '
    'payload_completeness_tier drives the Data-Gap Ladder CTA in the UI.';

COMMENT ON COLUMN gcp.profile.yt_subscriber_to_view_ratio IS
    'YouTube-only. Computed: total_views / subscriber_count. '
    'Spike-validated (2026-07-05) as the primary LLM authenticity signal for YouTube. '
    'Healthy organic channels: 0.05–0.20. Artificially inflated subscriber counts '
    'produce ratios near 0 (many subscribers, few views per subscriber). '
    'NULL for all non-YouTube profiles and for YouTube profiles where either '
    'yt_view_count or yt_subscriber_count is NULL (insufficient data state).';

COMMENT ON COLUMN gcp.profile.payload_completeness_tier IS
    'Drives Data-Gap Ladder UX (Doc 8 A2). '
    'rich: YouTube Data API v3 response (all expected fields present). '
    'standard: Apify scrape with core metrics available. '
    'sparse: Apify scrape with significant gaps — API shows partial-data state + CTA. '
    'minimal: URL-only stub awaiting enrichment.';
```

---

**Part D — GCP Schema: Intelligence & Scoring Entities**

```sql
-- ============================================================
-- gcp.enrichment_snapshot
-- Versioned intelligence output (Doc 18 B3).
-- prompt_version + model_version provenance (ADR-028).
-- is_current flag identifies the active score per creator/type.
-- ============================================================
CREATE TABLE gcp.enrichment_snapshot (
    snapshot_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id          UUID        NOT NULL REFERENCES gcp.creator(creator_id) ON DELETE RESTRICT,
    snapshot_type       snapshot_type_enum NOT NULL,

    -- Score output (structured per type)
    verdict             JSONB       NOT NULL,
    -- Authenticity: {"score": 74, "band": "moderate", "label": "..."}
    -- Quality: {"score": 81, "dimensions": {...}}
    -- Audience estimate: {"pk_share": 0.45, "gcc_share": 0.22, ...}
    -- Summary: {"text": "...", "word_count": 143}
    -- Niche classification: {"primary": "pk_fashion_textile", "secondary": [...]}

    evidence_breakdown  JSONB       NOT NULL,
    -- Array of evidence items per A4 standard:
    -- [{"signal": "engagement_consistency", "direction": "negative",
    --   "weight": "high", "payload_field_path": "metrics.comment_auth_rate",
    --   "value": 0.12, "threshold": 0.35}]

    confidence_level    confidence_level_enum NOT NULL,
    data_basis_statement TEXT       NOT NULL,
    -- Human-readable summary of what data was available and what was missing.

    -- Provenance triple (ADR-028, PATCH-010)
    prompt_version      TEXT        NOT NULL,
    -- Format: '{task_id}:{version}' e.g. 'authenticity_scorer:v7'
    model_version       TEXT        NOT NULL,
    -- Format: '{provider}:{model_id}' e.g. 'openai:gpt-4o-2024-08-06'
    content_hash        TEXT        NOT NULL,
    -- SHA-256 of the normalised payload sections fed to the model.
    -- Semantic dedup key (PATCH-010): re-scoring skipped if
    -- content_hash UNCHANGED AND prompt_version = active AND model_version = active.

    -- Scoring currency (ADR-028)
    is_current          BOOLEAN     NOT NULL DEFAULT TRUE,
    -- Only one snapshot per (creator_id, snapshot_type) has is_current = TRUE.
    -- Enforced by partial unique index below.
    -- On prompt/model version promotion: old snapshots set is_current = FALSE,
    -- new snapshots set is_current = TRUE after batch re-scoring completes.

    -- Job correlation
    job_id              UUID,
    -- References the discovery/enrichment job that produced this snapshot.
    -- Used for cost attribution in FS-10.03.

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- No updated_at: snapshots are immutable append-only records.
    -- "Updates" are new snapshots + is_current flip.
);

COMMENT ON TABLE gcp.enrichment_snapshot IS
    'Versioned intelligence output. Immutable — corrections are new rows. '
    'ADR-028: every score carries its prompt_version + model_version. '
    'is_current identifies the active score per (creator_id, snapshot_type). '
    'Prompt version promotions flip is_current via batch re-scoring job '
    'approved by CPO (cost-gate per ADR-028).';


-- ============================================================
-- gcp.niche_classification
-- Active niche classification for a creator (Doc 18 B4).
-- Values constrained to platform.niche_vocab reference table.
-- ============================================================
CREATE TABLE gcp.niche_classification (
    classification_id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id          UUID        NOT NULL REFERENCES gcp.creator(creator_id) ON DELETE RESTRICT,
    primary_niche       TEXT        NOT NULL,
    -- Validated against platform.niche_vocab.slug at application layer.
    secondary_niches    TEXT[]      NOT NULL DEFAULT '{}',
    -- Array, max length 3. Each value validated against platform.niche_vocab.slug.
    niche_confidence    confidence_level_enum NOT NULL,
    prompt_version      TEXT        NOT NULL,
    classified_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_current          BOOLEAN     NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_niche_current UNIQUE NULLS NOT DISTINCT (creator_id, is_current)
    -- Partial uniqueness: only one current classification per creator.
    -- Violated if two rows for the same creator both have is_current = TRUE.
    -- (PostgreSQL 15+: NULLS NOT DISTINCT; earlier versions use partial index.)
);


-- ============================================================
-- gcp.contact_record
-- GCP-level contact info. Workspace reveal action (wp.reveal)
-- marks a workspace's permission to use this contact.
-- PII fields nulled on GDPR erasure (ADR-025).
-- ============================================================
CREATE TABLE gcp.contact_record (
    contact_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id          UUID        NOT NULL REFERENCES gcp.creator(creator_id) ON DELETE RESTRICT,
    contact_type        contact_type_enum NOT NULL,
    value               TEXT,
    -- Nulled on GDPR erasure. NULL during erasure ≠ "no contact" — check pii_erased_at.
    source              contact_source_enum NOT NULL,
    confidence          confidence_level_enum NOT NULL,
    discovered_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pii_erased_at       TIMESTAMPTZ
);


-- ============================================================
-- gcp.inflight_url_lock
-- Ephemeral lock table preventing concurrent intra-job dedup
-- failures (PATCH-007/009, ARB-007).
-- Cleared on job completion; swept by the sweeper job (expired TTL).
-- ============================================================
CREATE TABLE gcp.inflight_url_lock (
    canonical_url       TEXT        PRIMARY KEY,
    -- Normalised profile URL (platform-stripped, param-stripped).
    job_id              UUID        NOT NULL,
    dispatched_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL
    -- Default: dispatched_at + INTERVAL '15 minutes'
    -- Set by M4 at dispatch time: NOW() + INTERVAL '15 minutes'
);

COMMENT ON TABLE gcp.inflight_url_lock IS
    'Ephemeral per-URL lock held while a candidate is in-flight through '
    'the Apify → M5 pipeline (PATCH-009). Prevents concurrent jobs from '
    'independently discovering and double-scoring the same creator URL. '
    'TTL = 15 minutes. Swept every 5 minutes by the reservation sweeper job. '
    'M4 checks this table (direct GCP query, not via Search Index) before '
    'dispatching any candidate to Apify (authorised direct-access exception, ADR-024).';
```

---

**Part E — WP Schema: Identity, Tenancy & the Cross-Plane Bridge**

```sql
-- ============================================================
-- wp.app_user
-- Shadow record mirroring the BaaS auth identity (NFR-S02).
-- Minimal — only what MUSHIN needs for FK references and display.
-- The authoritative identity record lives in the BaaS provider.
-- ============================================================
CREATE TABLE wp.app_user (
    user_id             UUID        PRIMARY KEY,
    -- Mirrors the BaaS identity provider's subject ID. Not generated here.
    email               TEXT        UNIQUE,
    display_name        TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- wp.workspace
-- The tenancy and billing boundary. All WP data hangs off here.
-- ============================================================
CREATE TABLE wp.workspace (
    workspace_id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    TEXT        NOT NULL,
    logo_url                TEXT,
    owner_user_id           UUID        NOT NULL REFERENCES wp.app_user(user_id),
    default_timezone        TEXT        NOT NULL DEFAULT 'Asia/Karachi',
    default_currency        TEXT        NOT NULL DEFAULT 'PKR'
        CHECK (char_length(default_currency) = 3),  -- ISO 4217

    -- Billing state (driven exclusively by Paddle webhooks, FS-08.02)
    subscription_state      subscription_state_enum NOT NULL DEFAULT 'trialing',
    subscription_plan_id    TEXT,
    -- Internal plan ID from Entitlement Catalog. NULL during trial if not yet bound.
    subscription_paddle_id  TEXT,
    -- Paddle subscription ID. Stored for reconciliation only; never used as PK.

    -- Entitlement snapshot invalidation key (Doc 10 A2)
    entitlement_snapshot_version INTEGER NOT NULL DEFAULT 0,
    -- Incremented every time subscription_state or subscription_plan_id changes.
    -- M1 caches entitlement snapshots keyed on (workspace_id, version).
    -- A stale cache hit (version mismatch) triggers a full re-resolve.

    trial_ends_at           TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- wp.membership
-- User × Workspace × Role. Soft-delete: removed members'
-- artifacts are retained and reassigned (Doc 10 FS-07.01).
-- ============================================================
CREATE TABLE wp.membership (
    membership_id       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    user_id             UUID        NOT NULL REFERENCES wp.app_user(user_id),
    role                member_role_enum NOT NULL DEFAULT 'member',
    status              membership_status_enum NOT NULL DEFAULT 'pending_invite',
    invited_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    joined_at           TIMESTAMPTZ,
    removed_at          TIMESTAMPTZ,

    CONSTRAINT uq_membership UNIQUE (workspace_id, user_id)
);


-- ============================================================
-- wp.workspace_creator_link  — THE GCP/WP BRIDGE (ADR-024)
--
-- Every WP entity that logically relates to a GCP creator is
-- anchored through this table. It is created automatically the
-- first time any WP action references a creator in a workspace.
--
-- CRITICAL: There is NO database-level foreign key from this
-- table's creator_id to gcp.creator.creator_id. This is a
-- deliberate design decision (ADR-024) to enforce plane
-- separation. The application layer is responsible for
-- verifying that the creator_id exists in gcp.creator before
-- creating a link. The Doc 19 schema review gate requires that
-- NO migration adds a cross-schema FK.
-- ============================================================
CREATE TABLE wp.workspace_creator_link (
    link_id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    creator_id          UUID        NOT NULL,
    -- Soft FK to gcp.creator. No DB-level FK (ADR-024).
    -- Application rule: creator_id must exist in gcp.creator at link creation time.

    first_linked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Updated on any WP interaction with this creator in this workspace.
    -- Drives "most recently active" ordering for over-capacity downgrade rules
    -- (Doc 10 FS-08.05).

    workspace_removed_at TIMESTAMPTZ,
    -- Tier-1 deletion: workspace removes creator. GCP untouched.

    pii_deleted_at      TIMESTAMPTZ,
    -- Set by the GDPR erasure consumer on creator.gdpr_erased event (ADR-025).
    -- After this: related WP entities display "Creator [Removed]".

    CONSTRAINT uq_ws_creator_link UNIQUE (workspace_id, creator_id)
);

COMMENT ON TABLE wp.workspace_creator_link IS
    'The GCP/WP cross-plane bridge (ADR-024). '
    'Single anchor per workspace-creator pair. Created on first WP interaction. '
    'creator_id is a soft FK (no DB-level constraint) — enforced at application layer. '
    'GDPR erasure flow: pii_deleted_at is stamped by the creator.gdpr_erased consumer. '
    'Merge fan-out job repoints creator_id from loser to winner across all workspaces '
    'and is the ONLY background job authorised to UPDATE this table across workspaces '
    '(declared plane-global job, mandatory audit emission — PATCH-008).';
```

---

**Part F — WP Schema: Workspace Operations (Lists, Campaigns, Outreach)**

```sql
-- ============================================================
-- wp.list
-- ============================================================
CREATE TABLE wp.list (
    list_id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    name                TEXT        NOT NULL,
    visibility          TEXT        NOT NULL DEFAULT 'workspace'
        CHECK (visibility IN ('private','workspace')),
    owner_user_id       UUID        NOT NULL REFERENCES wp.app_user(user_id),
    archived_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- wp.list_membership
-- Creator in a list. Soft-delete: removed_at nullable.
-- Duplicate add is idempotent via ON CONFLICT DO UPDATE.
-- ============================================================
CREATE TABLE wp.list_membership (
    membership_id       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    list_id             UUID        NOT NULL REFERENCES wp.list(list_id),
    creator_id          UUID        NOT NULL,
    -- Soft FK to gcp.creator via workspace_creator_link (ADR-024).
    added_by_user_id    UUID        REFERENCES wp.app_user(user_id),
    added_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    removed_at          TIMESTAMPTZ,

    CONSTRAINT uq_list_creator_active
        UNIQUE NULLS NOT DISTINCT (list_id, creator_id, removed_at)
    -- Allows re-add after removal (removed_at IS NOT NULL = historical row).
);


-- ============================================================
-- wp.tag  (workspace-scoped folksonomy)
-- ============================================================
CREATE TABLE wp.tag (
    tag_id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    name                TEXT        NOT NULL,
    color               TEXT        DEFAULT '#6B7280',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tag_name UNIQUE (workspace_id, name)
);


-- ============================================================
-- wp.creator_tag  (many-to-many: creator × tag, per workspace)
-- ============================================================
CREATE TABLE wp.creator_tag (
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    creator_id          UUID        NOT NULL,
    tag_id              UUID        NOT NULL REFERENCES wp.tag(tag_id),
    tagged_by_user_id   UUID        REFERENCES wp.app_user(user_id),
    tagged_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (workspace_id, creator_id, tag_id)
);


-- ============================================================
-- wp.campaign
-- ============================================================
CREATE TABLE wp.campaign (
    campaign_id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id            UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    name                    TEXT        NOT NULL,
    client_name             TEXT,       -- Agency use (PA-01)
    objective               campaign_objective_enum NOT NULL DEFAULT 'awareness',
    budget_amount           NUMERIC(14,2),
    budget_currency         TEXT        DEFAULT 'PKR' CHECK (char_length(budget_currency) = 3),
    budget_committed        NUMERIC(14,2) NOT NULL DEFAULT 0,
    -- Maintained as projection: sum of agreed rates on campaign_creator rows.
    -- Updated by analytics consumer on rate_recorded timeline events.
    start_date              DATE,
    end_date                DATE,
    criteria_block          JSONB       NOT NULL DEFAULT '{}',
    -- Machine-readable targeting criteria; deep-links to FS-02.01 search filters.
    -- Schema: {"platform": [...], "geo": "PK", "niche": [...], "size_band": {...},
    --          "authenticity_floor": 60, "engagement_floor": 0.02}
    stage_config            JSONB       NOT NULL DEFAULT '[]',
    -- Ordered array of stage labels for this campaign's pipeline.
    -- Default template applied at creation; customisable per FS-05.02.
    status                  campaign_status_enum NOT NULL DEFAULT 'active',
    created_by_user_id      UUID        REFERENCES wp.app_user(user_id),
    brief_version           INTEGER     NOT NULL DEFAULT 1,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- wp.campaign_brief_version
-- Immutable brief snapshots (versioned on each edit).
-- ============================================================
CREATE TABLE wp.campaign_brief_version (
    version_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id         UUID        NOT NULL REFERENCES wp.campaign(campaign_id),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    version_number      INTEGER     NOT NULL,
    brief_snapshot      JSONB       NOT NULL,
    -- Full brief state at this version. Includes name, objective, budget,
    -- criteria_block, stage_config snapshot.
    changed_by_user_id  UUID        REFERENCES wp.app_user(user_id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_brief_version UNIQUE (campaign_id, version_number)
);


-- ============================================================
-- wp.campaign_creator
-- Creator's position in a campaign pipeline.
-- A creator may be in multiple campaigns concurrently (agency reality).
-- ============================================================
CREATE TABLE wp.campaign_creator (
    campaign_creator_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id            UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    campaign_id             UUID        NOT NULL REFERENCES wp.campaign(campaign_id),
    creator_id              UUID        NOT NULL,
    -- Soft FK to gcp.creator via workspace_creator_link.
    pipeline_stage          TEXT        NOT NULL DEFAULT 'Prospect',
    stage_changed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_to_user_id     UUID        REFERENCES wp.app_user(user_id),
    drop_reason_code        TEXT,
    -- Reason code for terminal stage transitions (feeds analytics).
    added_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    removed_at              TIMESTAMPTZ,

    CONSTRAINT uq_campaign_creator_active
        UNIQUE NULLS NOT DISTINCT (campaign_id, creator_id, removed_at)
);


-- ============================================================
-- wp.task
-- ============================================================
CREATE TABLE wp.task (
    task_id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    campaign_id         UUID        REFERENCES wp.campaign(campaign_id),
    campaign_creator_id UUID        REFERENCES wp.campaign_creator(campaign_creator_id),
    -- At least one of campaign_id or campaign_creator_id must be non-null.
    title               TEXT        NOT NULL,
    description         TEXT,
    due_date            DATE,
    assignee_user_id    UUID        REFERENCES wp.app_user(user_id),
    completed_at        TIMESTAMPTZ,
    created_by_user_id  UUID        REFERENCES wp.app_user(user_id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_task_has_scope
        CHECK (campaign_id IS NOT NULL OR campaign_creator_id IS NOT NULL)
);


-- ============================================================
-- wp.consent_state
-- Per creator-contact-channel per workspace.
-- version column enables the TOCTOU last-gate check (PATCH-006).
-- ============================================================
CREATE TABLE wp.consent_state (
    consent_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    creator_id          UUID        NOT NULL,
    channel             channel_enum NOT NULL,
    contact_ref         TEXT        NOT NULL,
    -- The specific contact value this consent applies to
    -- (email address or WhatsApp number).
    state               consent_state_enum NOT NULL DEFAULT 'unknown',
    opt_in_evidence     JSONB,
    -- Required for WhatsApp S2: {"source": "click_to_chat_reply",
    -- "timestamp": "...", "attested_by_user_id": "..."}
    state_changed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    state_changed_by    TEXT        NOT NULL DEFAULT 'system',
    -- 'system' or user_id (UUID as text).

    -- Optimistic lock for TOCTOU consent check (PATCH-006, ARB-006).
    -- M9's last-gate check reads (state, version) in the same query.
    -- If state = opted_out at the final check, send is aborted.
    -- The opt-out consumer increments version on state change.
    version             INTEGER     NOT NULL DEFAULT 0,

    CONSTRAINT uq_consent UNIQUE (workspace_id, creator_id, channel)
    -- One consent record per channel per creator per workspace.
);

COMMENT ON COLUMN wp.consent_state.version IS
    'Optimistic lock version for TOCTOU race mitigation (PATCH-006, ARB-006). '
    'M9 sequence worker reads (state, version) as final check before adapter call. '
    'If state has transitioned to opted_out between the eligibility check and '
    'the adapter invocation, the send is aborted. '
    'Incremented by the opt-out event consumer on every state transition.';


-- ============================================================
-- wp.reveal
-- Workspace-level record of a contact reveal action.
-- The GCP contact value itself stays in gcp.contact_record.
-- ============================================================
CREATE TABLE wp.reveal (
    reveal_id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id            UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    creator_id              UUID        NOT NULL,
    contact_id              UUID        NOT NULL,
    -- Soft FK to gcp.contact_record. No DB-level FK (ADR-024).
    contact_type            contact_type_enum NOT NULL,
    -- Denormalised from GCP for query efficiency (avoids cross-schema join).
    revealed_by_user_id     UUID        REFERENCES wp.app_user(user_id),
    revealed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    credit_ledger_entry_id  UUID
    -- References wp.credit_ledger_entry.entry_id. Set after credit commit.
);


-- ============================================================
-- wp.sequence_template
-- ============================================================
CREATE TABLE wp.sequence_template (
    template_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    name                TEXT        NOT NULL,
    channel             channel_enum NOT NULL DEFAULT 'email',
    is_active           BOOLEAN     NOT NULL DEFAULT TRUE,
    created_by_user_id  UUID        REFERENCES wp.app_user(user_id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- wp.sequence_step
-- ============================================================
CREATE TABLE wp.sequence_step (
    step_id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id         UUID        NOT NULL REFERENCES wp.sequence_template(template_id),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    step_index          INTEGER     NOT NULL,    -- 0-based ordering
    step_type           TEXT        NOT NULL DEFAULT 'message'
        CHECK (step_type IN ('message','wait')),
    wait_days           INTEGER,                 -- for step_type='wait'
    message_template_id UUID,                    -- references a future message_template table
    subject_template    TEXT,
    body_template       TEXT,

    CONSTRAINT uq_step_order UNIQUE (template_id, step_index)
);


-- ============================================================
-- wp.sequence_enrollment
-- ============================================================
CREATE TABLE wp.sequence_enrollment (
    enrollment_id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id            UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    campaign_creator_id     UUID        NOT NULL REFERENCES wp.campaign_creator(campaign_creator_id),
    template_id             UUID        REFERENCES wp.sequence_template(template_id),
    channel                 channel_enum NOT NULL DEFAULT 'email',
    status                  sequence_status_enum NOT NULL DEFAULT 'active',
    stop_reason             sequence_stop_reason_enum,
    enrolled_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_step_due_at        TIMESTAMPTZ,
    current_step_index      INTEGER     NOT NULL DEFAULT 0,
    enrolled_by_user_id     UUID        REFERENCES wp.app_user(user_id)
);


-- ============================================================
-- wp.file_attachment
-- ============================================================
CREATE TABLE wp.file_attachment (
    attachment_id       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    creator_id          UUID,       -- nullable: attached to creator, list, or campaign
    list_id             UUID        REFERENCES wp.list(list_id),
    campaign_id         UUID        REFERENCES wp.campaign(campaign_id),
    file_name           TEXT        NOT NULL,
    storage_key         TEXT        NOT NULL UNIQUE,
    content_type        TEXT        NOT NULL,
    size_bytes          BIGINT      NOT NULL,
    virus_scan_status   TEXT        NOT NULL DEFAULT 'pending'
        CHECK (virus_scan_status IN ('pending','clean','quarantined','failed')),
    uploaded_by_user_id UUID        REFERENCES wp.app_user(user_id),
    uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

**Part G — WP Schema: Billing & Entitlements**

```sql
-- ============================================================
-- wp.entitlement_catalog
-- Versioned mapping of internal plan IDs → limits (Doc 10 FS-08.01).
-- Paddle product/price IDs live here only, abstracted from billing logic.
-- ============================================================
CREATE TABLE wp.entitlement_catalog (
    catalog_id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id             TEXT        NOT NULL,       -- e.g. 'starter', 'growth', 'agency'
    catalog_version     INTEGER     NOT NULL,
    paddle_product_id   TEXT,
    paddle_price_id     TEXT,
    seat_limit          INTEGER     NOT NULL,
    workspace_limit     INTEGER     NOT NULL,
    monthly_credit_allowance INTEGER NOT NULL,
    sequence_slot_limit INTEGER     NOT NULL,
    feature_gates       JSONB       NOT NULL DEFAULT '{}',
    -- e.g. {"whatsapp_s2": false, "exports": true, "api_access": false}
    is_current          BOOLEAN     NOT NULL DEFAULT TRUE,
    valid_from          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_catalog_plan_version UNIQUE (plan_id, catalog_version)
);


-- ============================================================
-- wp.paddle_subscription
-- Local state of a Paddle subscription, derived from webhooks.
-- Paddle API is the source of truth; this is a cache (Doc 10 FS-08.02).
-- ============================================================
CREATE TABLE wp.paddle_subscription (
    paddle_subscription_id  TEXT        PRIMARY KEY,
    workspace_id            UUID        NOT NULL REFERENCES wp.workspace(workspace_id) UNIQUE,
    -- One subscription per workspace (current model; future: multiple sub-items).
    plan_id                 TEXT        NOT NULL,
    catalog_version         INTEGER     NOT NULL,
    state                   subscription_state_enum NOT NULL,
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    last_paddle_event_id    TEXT,
    last_event_occurred_at  TIMESTAMPTZ,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

**Part H — Append-Only Substrate: Interaction Timeline**

```sql
-- ============================================================
-- wp.interaction_timeline   — PARTITIONED TABLE
-- Append-only. M7 sole writer. All WP workspace events.
-- MONTHLY RANGE PARTITIONING on occurred_at (PATCH-003).
--
-- PostgreSQL requirement: the partition key (occurred_at) must
-- be included in the primary key for partitioned tables.
-- Primary key: (entry_id, occurred_at).
-- ============================================================
CREATE TABLE wp.interaction_timeline (
    entry_id                UUID            NOT NULL DEFAULT gen_random_uuid(),
    workspace_id            UUID            NOT NULL,
    -- NOT a FK to wp.workspace — partitioned tables cannot have FK constraints
    -- that reference non-partitioned tables in all PostgreSQL versions.
    -- Application layer enforces workspace existence.
    creator_id              UUID            NOT NULL,
    -- Soft FK to gcp.creator via workspace_creator_link.
    entry_type              TEXT            NOT NULL,
    -- Validated against the Doc 18 D3 taxonomy at application layer.
    -- Not a PG enum: the taxonomy may grow; text + app validation avoids
    -- ALTER TYPE … ADD VALUE in hot production partitions.
    occurred_at             TIMESTAMPTZ     NOT NULL,
    -- Authoritative event time. Never the DB insert time.
    actor_type              timeline_actor_type_enum NOT NULL DEFAULT 'system',
    actor_id                TEXT            NOT NULL DEFAULT 'system',
    campaign_id             UUID,
    sequence_enrollment_id  UUID,
    channel                 channel_enum,
    payload_ref             JSONB           NOT NULL DEFAULT '{}',
    -- Lightweight structured event summary. Never contains full message bodies.
    -- Large payloads referenced by key in object storage.
    source_event_id         UUID,
    -- The domain event ID (Doc 16 A1 envelope) that triggered this entry.

    PRIMARY KEY (entry_id, occurred_at)
    -- Composite PK required for partitioned table (PostgreSQL constraint).
) PARTITION BY RANGE (occurred_at);

COMMENT ON TABLE wp.interaction_timeline IS
    'Append-only workspace event log. M7 sole writer (Doc 14 Part C). '
    'Partitioned monthly on occurred_at (PATCH-003). '
    'All M11 analytics queries must use materialized projections — '
    'direct aggregation over this table is prohibited (review defect). '
    'GDPR erasure: creator PII in payload_ref is scrubbed on creator.gdpr_erased; '
    'structural rows are retained for audit integrity (ADR-025).';


-- ── Monthly partitions (pre-created; add new partition on 15th of previous month) ──

CREATE TABLE wp.interaction_timeline_2026_07
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-08-01 00:00:00+00');

CREATE TABLE wp.interaction_timeline_2026_08
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

CREATE TABLE wp.interaction_timeline_2026_09
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE wp.interaction_timeline_2026_10
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE wp.interaction_timeline_2026_11
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE wp.interaction_timeline_2026_12
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE wp.interaction_timeline_2027_01
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2027-02-01 00:00:00+00');

-- Future partitions: partition_creation_job runs on the 15th of each month
-- and creates the partition for month+2 (two months ahead, for safety margin).


-- ── Timeline Indexes (PATCH-003 mandated; one per partition, auto-inherited) ──
-- All CREATE INDEX statements use CONCURRENTLY to avoid partition-level locks.
-- Run after partition creation, before enabling writes to the partition.

-- Primary access pattern: creator relationship panel
CREATE INDEX CONCURRENTLY idx_tl_ws_creator_time
    ON wp.interaction_timeline (workspace_id, creator_id, occurred_at DESC);

-- Campaign history view
CREATE INDEX CONCURRENTLY idx_tl_ws_campaign_time
    ON wp.interaction_timeline (workspace_id, campaign_id, occurred_at DESC)
    WHERE campaign_id IS NOT NULL;

-- Analytics: filter by event type within workspace
CREATE INDEX CONCURRENTLY idx_tl_ws_type_time
    ON wp.interaction_timeline (workspace_id, entry_type, occurred_at DESC);

-- Sequence activity tracking
CREATE INDEX CONCURRENTLY idx_tl_enrollment
    ON wp.interaction_timeline (sequence_enrollment_id)
    WHERE sequence_enrollment_id IS NOT NULL;

-- Workspace activity feed (admin/owner overview)
CREATE INDEX CONCURRENTLY idx_tl_ws_time
    ON wp.interaction_timeline (workspace_id, occurred_at DESC);
```

---

**Part I — Append-Only Substrate: Credit Ledger & Concurrency Control**

```sql
-- ============================================================
-- wp.credit_ledger_entry   — PARTITIONED TABLE
-- Append-only. M10 sole writer. All credit movements.
-- MONTHLY RANGE PARTITIONING on occurred_at (PATCH-004).
-- ============================================================
CREATE TABLE wp.credit_ledger_entry (
    entry_id                UUID            NOT NULL DEFAULT gen_random_uuid(),
    workspace_id            UUID            NOT NULL,
    entry_type              ledger_entry_type_enum NOT NULL,
    amount                  NUMERIC(12,4)   NOT NULL,
    -- Positive = credits added. Negative = credits consumed/reserved.
    balance_after           NUMERIC(12,4)   NOT NULL,
    -- Denormalised running balance at entry time. NOT the source of truth
    -- (workspace_credit_balance is). Stored for audit trail readability.
    occurred_at             TIMESTAMPTZ     NOT NULL,
    period_tag              TEXT            NOT NULL,
    -- Billing period: 'YYYY-MM'. Used for allowance expiry queries.
    action_type             TEXT,
    -- Metered action type from Doc 8 A5 (e.g. 'live_search', 'enrichment').
    action_reference_id     UUID,
    -- The job_id / enrichment_id / reveal_id that consumed these credits.
    provider_cost_snapshot  JSONB,
    -- On consumption entries: {"provider": "openai", "model": "gpt-4o-...",
    -- "operation": "authenticity_score", "unit_cost_usd": 0.0042,
    -- "prompt_version": "authenticity_scorer:v7"}
    -- Feeds FS-10.03 margin dashboard.
    reservation_id          UUID,
    -- Links reserved → committed/released entries for the same action.
    paddle_event_id         TEXT,
    -- Paddle event ID for idempotency on allowance_grant / expiry entries.
    admin_reason            TEXT,
    -- Mandatory for promo_grant entries (audit requirement, FS-10.03).

    PRIMARY KEY (entry_id, occurred_at)
) PARTITION BY RANGE (occurred_at);

COMMENT ON TABLE wp.credit_ledger_entry IS
    'Append-only credit ledger. M10 sole writer (ADR-012). '
    'Source of truth for all credit movements. balance_after is for audit readability; '
    'the canonical balance is workspace_credit_balance.balance. '
    'Partitioned monthly on occurred_at for query performance. '
    'The nightly integrity check uses: '
    'SELECT SUM(amount) FROM wp.credit_ledger_entry WHERE workspace_id = $1 '
    'and compares to workspace_credit_balance.balance. Mismatch = P1 incident.';


-- ── Monthly partitions (same cadence as Timeline) ──

CREATE TABLE wp.credit_ledger_entry_2026_07
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-08-01 00:00:00+00');

CREATE TABLE wp.credit_ledger_entry_2026_08
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

CREATE TABLE wp.credit_ledger_entry_2026_09
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE wp.credit_ledger_entry_2026_10
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE wp.credit_ledger_entry_2026_11
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE wp.credit_ledger_entry_2026_12
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE wp.credit_ledger_entry_2027_01
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('2027-01-01 00:00:00+00') TO ('2027-02-01 00:00:00+00');


-- ── Ledger Indexes ──

-- Workspace ledger history (admin view, audit)
CREATE INDEX CONCURRENTLY idx_ledger_ws_time
    ON wp.credit_ledger_entry (workspace_id, occurred_at DESC);

-- Allowance expiry calculations (period-scoped)
CREATE INDEX CONCURRENTLY idx_ledger_ws_period
    ON wp.credit_ledger_entry (workspace_id, period_tag, entry_type);

-- Reserve-commit-release chain linkage
CREATE INDEX CONCURRENTLY idx_ledger_reservation
    ON wp.credit_ledger_entry (reservation_id)
    WHERE reservation_id IS NOT NULL;

-- Credit reversal lookup (failed action refund)
CREATE INDEX CONCURRENTLY idx_ledger_action_ref
    ON wp.credit_ledger_entry (action_reference_id)
    WHERE action_reference_id IS NOT NULL;

-- Paddle event idempotency check
CREATE INDEX CONCURRENTLY idx_ledger_paddle_event
    ON wp.credit_ledger_entry (paddle_event_id)
    WHERE paddle_event_id IS NOT NULL;


-- ============================================================
-- wp.workspace_credit_balance   — MATERIALIZED BALANCE ROW
-- (ADR-026, PATCH-004)
--
-- One row per workspace. This is the hot row that the reserve-
-- commit concurrency contract operates on. The SELECT FOR UPDATE
-- pattern is documented here as the contract; Mimo must implement
-- the reserve operation exactly as described in the comment.
-- ============================================================
CREATE TABLE wp.workspace_credit_balance (
    workspace_id        UUID        PRIMARY KEY REFERENCES wp.workspace(workspace_id),
    balance             NUMERIC(12,4) NOT NULL DEFAULT 0
        CHECK (balance >= 0),
    -- Hard constraint: balance may never go below zero in this row.
    -- The only exception is the refund-clamp path (FS-08.02):
    -- a refund that would cause negative balance triggers a CLAMP to 0
    -- plus a compliance flag to support review.
    reserved_balance    NUMERIC(12,4) NOT NULL DEFAULT 0
        CHECK (reserved_balance >= 0),
    -- Sum of all active reservation amounts. Updated atomically with
    -- credit_reservation rows.
    usable_balance      NUMERIC(12,4) GENERATED ALWAYS AS (balance - reserved_balance) STORED,
    -- Computed column. The effective balance available for new actions.
    version             INTEGER     NOT NULL DEFAULT 0,
    -- Optimistic lock version. Incremented on every balance or reserved_balance change.
    -- ADR-026 reserve operation:
    --   BEGIN;
    --   SELECT balance, reserved_balance, version
    --     FROM wp.workspace_credit_balance
    --     WHERE workspace_id = $1
    --     FOR UPDATE;                          -- row-level write lock
    --   -- (application checks usable_balance >= requested_amount)
    --   INSERT INTO wp.credit_ledger_entry (...) VALUES (...);
    --   INSERT INTO wp.credit_reservation (...) VALUES (...);
    --   UPDATE wp.workspace_credit_balance
    --     SET reserved_balance = reserved_balance + $amount,
    --         version = version + 1
    --     WHERE workspace_id = $1 AND version = $current_version;
    --   -- If UPDATE affects 0 rows: concurrent modification → retry (up to 3 times)
    --   COMMIT;
    last_entry_id       UUID,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE wp.workspace_credit_balance IS
    'Materialized credit balance per workspace. ADR-026. '
    'Concurrency contract: ALL reserve-commit operations acquire '
    'SELECT FOR UPDATE on this row before reading or modifying balance. '
    'This is the single choke point that prevents overdraft under any '
    'concurrency scenario. See column comments for the full transaction pattern. '
    'Nightly integrity check: SUM of ledger entries must equal balance. '
    'Mismatch = P1 incident (FS-08.03).';

COMMENT ON COLUMN wp.workspace_credit_balance.version IS
    'Optimistic lock. Incremented on every balance change. '
    'UPDATE ... WHERE version = $current_version acts as the optimistic check: '
    'if 0 rows affected, a concurrent transaction modified the balance; '
    'the operation retries (up to 3 times) by re-reading the row. '
    'After 3 failed retries, the operation fails with a retriable error '
    'surfaced to the caller.';


-- ============================================================
-- wp.credit_reservation
-- Active reservation records for in-flight metered actions.
-- (PATCH-005, ARB-005)
-- ============================================================
CREATE TABLE wp.credit_reservation (
    reservation_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    action_type         TEXT        NOT NULL,
    action_reference_id UUID        NOT NULL,
    -- The discovery_job_id / enrichment_id that holds this reservation.
    amount_reserved     NUMERIC(12,4) NOT NULL CHECK (amount_reserved > 0),
    status              reservation_status_enum NOT NULL DEFAULT 'active',
    reserved_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL,
    -- Default: reserved_at + INTERVAL '30 minutes' (2× max job duration, PATCH-005).
    -- Configured as a named constant; tunable via M12 without migration.
    resolved_at         TIMESTAMPTZ,
    resolution_reason   TEXT
    -- 'committed', 'released_by_job', 'ttl_expired', 'subscription_expired'
);

COMMENT ON TABLE wp.credit_reservation IS
    'Tracks active credit reservations for in-flight metered actions (PATCH-005). '
    'Sweeper job runs every 5 minutes: releases reservations where '
    'status=active AND expires_at < NOW(). '
    'Released amount is returned to workspace_credit_balance.reserved_balance. '
    'Release volume > 5/hour triggers M12 alert (defect signal). '
    'Subscription state change behaviour: see Doc 18 E4 / PATCH-005 contract.';
```

---

**Part J — WP Schema: Discovery Jobs**

```sql
-- ============================================================
-- wp.discovery_job
-- WP-scoped record for live search / enrichment jobs.
-- Produces GCP records; credits charged to the initiating workspace.
-- ============================================================
CREATE TABLE wp.discovery_job (
    job_id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id            UUID        NOT NULL REFERENCES wp.workspace(workspace_id),
    initiated_by_user_id    UUID        REFERENCES wp.app_user(user_id),
    job_type                discovery_job_type_enum NOT NULL DEFAULT 'live_search',
    query_intent            JSONB       NOT NULL DEFAULT '{}',
    -- Serialised search intent (filter set + NL query) for replay/audit.
    status                  discovery_job_status_enum NOT NULL DEFAULT 'queued',
    reservation_id          UUID        REFERENCES wp.credit_reservation(reservation_id),
    correlation_id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    -- Links all domain events in this job's flow (Doc 16 A1 envelope).
    candidate_count_target  INTEGER,
    candidate_count_scraped INTEGER     NOT NULL DEFAULT 0,
    candidate_count_succeeded INTEGER   NOT NULL DEFAULT 0,
    candidate_count_failed  INTEGER     NOT NULL DEFAULT 0,
    credits_committed       NUMERIC(12,4),
    -- Set at job completion: proportional to successful candidates.
    queued_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at              TIMESTAMPTZ,
    completed_at            TIMESTAMPTZ,
    failure_reason          TEXT
);
```

---

**Part K — Platform Schema: System Infrastructure**

```sql
-- ============================================================
-- platform.outbox
-- Transactional outbox for reliable event emission (ADR-020).
-- Each module writes events here atomically with its state change.
-- The outbox relay polls this table and publishes to the queue.
--
-- Relay query pattern (SKIP LOCKED for concurrent relay workers):
--   SELECT * FROM platform.outbox
--   WHERE dispatched_at IS NULL
--   ORDER BY created_at
--   LIMIT 100
--   FOR UPDATE SKIP LOCKED;
-- ============================================================
CREATE TABLE platform.outbox (
    outbox_id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id            UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    -- The domain event ID per Doc 16 A1 envelope. Published to queue as-is.
    event_type          TEXT        NOT NULL,
    schema_version      TEXT        NOT NULL DEFAULT '1',
    scope_class         scope_class_enum NOT NULL,
    workspace_id        UUID,
    -- NULL for GCP and platform scope events.
    actor_type          TEXT,
    actor_id            TEXT,
    correlation_id      UUID,
    causation_id        UUID,
    payload             JSONB       NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dispatched_at       TIMESTAMPTZ,
    -- Set by relay on successful queue publish. NULL = pending dispatch.
    dispatch_attempts   INTEGER     NOT NULL DEFAULT 0
);

COMMENT ON TABLE platform.outbox IS
    'Transactional outbox (ADR-020). Written atomically with state-change DB transactions. '
    'Relay polls WHERE dispatched_at IS NULL using SKIP LOCKED for parallel relay workers. '
    'dispatched_at IS NULL partial index makes polling O(pending_count), not O(table_size). '
    'Events older than 24h with dispatch_attempts > 5 are moved to DLQ by the relay.';

-- Critical partial index for relay performance
CREATE INDEX CONCURRENTLY idx_outbox_pending
    ON platform.outbox (created_at)
    WHERE dispatched_at IS NULL;


-- ============================================================
-- platform.processed_event_ledger
-- Per-consumer-group idempotency registry (ADR-020, Doc 16 A3).
-- ============================================================
CREATE TABLE platform.processed_event_ledger (
    consumer_group      TEXT        NOT NULL,
    -- Format: '{module_id}:{event_type}' e.g. 'M10:billing.webhook_received'
    event_id            UUID        NOT NULL,
    processed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (consumer_group, event_id)
);

COMMENT ON TABLE platform.processed_event_ledger IS
    'Idempotency registry per consumer group (ADR-020). '
    'Before processing an event, consumer checks: '
    'SELECT 1 FROM platform.processed_event_ledger '
    'WHERE consumer_group = $1 AND event_id = $2. '
    'If found: skip (duplicate delivery). If not found: process then insert. '
    'This check+insert must be in the same DB transaction as the side-effect.';


-- ============================================================
-- platform.paddle_webhook_raw
-- Raw webhook payload store (Doc 17 B1, Doc 16 D1).
-- Append-only. 13-month retention.
-- ============================================================
CREATE TABLE platform.paddle_webhook_raw (
    raw_event_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    paddle_event_id     TEXT        NOT NULL UNIQUE,
    source              TEXT        NOT NULL DEFAULT 'paddle'
        CHECK (source IN ('paddle','bsp','mailbox_push')),
    received_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payload             JSONB       NOT NULL,
    signature_valid     BOOLEAN     NOT NULL,
    -- FALSE events are stored for forensics but never processed.
    processed_at        TIMESTAMPTZ
);

COMMENT ON TABLE platform.paddle_webhook_raw IS
    'Raw webhook store. Signature verified at Gateway before append (Doc 17 B1). '
    'invalid signatures (signature_valid=FALSE) are stored + alerted but never processed. '
    'Retention: 13 months (covers annual billing dispute window, Doc 17 gap resolved). '
    'Replay capability: re-processing from this table is the DR recovery path (Doc 24).';


-- ============================================================
-- platform.admin_audit_log
-- Immutable admin action record. Audit-first invariant:
-- if this write fails, the triggering action fails (FS-10.01).
-- ============================================================
CREATE TABLE platform.admin_audit_log (
    audit_id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_user_id       TEXT        NOT NULL,
    impersonation_context JSONB,
    -- Nullable. Present during impersonation sessions:
    -- {"target_workspace_id": "...", "reason": "...", "ticket_ref": "..."}
    action              TEXT        NOT NULL,
    target_type         TEXT        NOT NULL,
    target_id           TEXT        NOT NULL,
    reason              TEXT        NOT NULL,
    -- Mandatory. Action fails if reason is empty string (application rule).
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE platform.admin_audit_log IS
    'Immutable admin action record (FS-10.01). '
    'Audit-first invariant: this INSERT is in the same transaction as the admin action. '
    'If the INSERT fails, the action is rolled back. '
    'This table must never be updated or deleted. '
    'Retention: indefinite (regulatory + impersonation audit requirements).';


-- ============================================================
-- platform.niche_vocab
-- Controlled niche vocabulary reference table (Doc 18 Part H).
-- Applications validate niche values against slug column.
-- Text + FK (not enum) allows additive growth without ALTER TYPE.
-- ============================================================
CREATE TABLE platform.niche_vocab (
    vocab_id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug                TEXT        NOT NULL UNIQUE,
    -- Machine-readable key used in gcp.niche_classification and search index.
    -- e.g. 'pk_fashion_textile', 'health_fitness'
    display_name        TEXT        NOT NULL,
    parent_cluster      TEXT        NOT NULL,
    -- Parent cluster for UI grouping. e.g. 'Pakistan-Specific High-Value'
    is_deprecated       BOOLEAN     NOT NULL DEFAULT FALSE,
    -- Deprecated slugs remain (referential integrity); new classifications
    -- are prohibited. Existing classifications are re-classified on next scoring.
    sort_order          INTEGER     NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE platform.niche_vocab IS
    'Controlled vocabulary for niche classification (Doc 18 Part H, 48 categories v1). '
    'Slug values are the enum used by T-A classifier output schema (Doc 15 C2). '
    'New categories: INSERT with is_deprecated=FALSE after change-control review. '
    'Removal: SET is_deprecated=TRUE (never hard-delete — existing classifications reference slug). '
    'Vocabulary change triggers T-A rubric update + eval-gate pass (Doc 15 Part E).';

-- Seed data for v1 vocabulary (48 categories per Doc 18 Part H)
INSERT INTO platform.niche_vocab (slug, display_name, parent_cluster, sort_order) VALUES
-- Lifestyle & Wellness
('lifestyle_general',       'Lifestyle (General)',          'Lifestyle & Wellness', 10),
('health_fitness',          'Health & Fitness',             'Lifestyle & Wellness', 11),
('beauty_skincare',         'Beauty & Skincare',            'Lifestyle & Wellness', 12),
('fashion_style',           'Fashion & Style',              'Lifestyle & Wellness', 13),
('food_cooking',            'Food & Cooking',               'Lifestyle & Wellness', 14),
('travel_adventure',        'Travel & Adventure',           'Lifestyle & Wellness', 15),
('home_interior',           'Home & Interior',              'Lifestyle & Wellness', 16),
('parenting_family',        'Parenting & Family',           'Lifestyle & Wellness', 17),
-- Entertainment & Culture
('comedy_humor',            'Comedy & Humor',               'Entertainment & Culture', 20),
('music_performance',       'Music & Performance',          'Entertainment & Culture', 21),
('gaming_esports',          'Gaming & Esports',             'Entertainment & Culture', 22),
('film_tv_reviews',         'Film & TV Reviews',            'Entertainment & Culture', 23),
('books_literature',        'Books & Literature',           'Entertainment & Culture', 24),
('art_illustration',        'Art & Illustration',           'Entertainment & Culture', 25),
('dance_choreography',      'Dance & Choreography',         'Entertainment & Culture', 26),
('podcasting',              'Podcasting',                   'Entertainment & Culture', 27),
-- Knowledge & Education
('education_tutoring',      'Education & Tutoring',         'Knowledge & Education', 30),
('tech_gadgets',            'Tech & Gadgets',               'Knowledge & Education', 31),
('finance_investing',       'Finance & Investing',          'Knowledge & Education', 32),
('personal_development',    'Personal Development',         'Knowledge & Education', 33),
('science_nature',          'Science & Nature',             'Knowledge & Education', 34),
('history_culture',         'History & Culture',            'Knowledge & Education', 35),
('language_learning',       'Language Learning',            'Knowledge & Education', 36),
('career_professional',     'Career & Professional',        'Knowledge & Education', 37),
-- Business & Entrepreneurship
('startup_entrepreneurship','Startups & Entrepreneurship',  'Business & Entrepreneurship', 40),
('marketing_advertising',   'Marketing & Advertising',      'Business & Entrepreneurship', 41),
('ecommerce_retail',        'E-commerce & Retail',          'Business & Entrepreneurship', 42),
('freelancing_creator_economy','Freelancing & Creator Economy','Business & Entrepreneurship',43),
('real_estate',             'Real Estate',                  'Business & Entrepreneurship', 44),
('hr_management',           'HR & Management',              'Business & Entrepreneurship', 45),
-- Social Impact & Community
('activism_social_causes',  'Activism & Social Causes',     'Social Impact & Community', 50),
('religion_spirituality_islamic','Religion & Spirituality (Islamic)','Social Impact & Community',51),
('environment_sustainability','Environment & Sustainability','Social Impact & Community', 52),
('community_local',         'Community & Local',            'Social Impact & Community', 53),
-- Sports & Outdoors
('cricket_sports',          'Cricket & Sports',             'Sports & Outdoors', 60),
('football_soccer',         'Football / Soccer',            'Sports & Outdoors', 61),
('outdoor_adventure_extreme','Outdoor & Extreme Sports',    'Sports & Outdoors', 62),
('motorsport',              'Motorsport',                   'Sports & Outdoors', 63),
-- Pakistan-Specific High-Value
('pk_fashion_textile',      'PK Fashion & Textile',         'Pakistan-Specific High-Value', 70),
('pk_food_street',          'PK Food & Street Culture',     'Pakistan-Specific High-Value', 71),
('pk_politics_commentary',  'PK Politics & Commentary',     'Pakistan-Specific High-Value', 72),
('pk_drama_entertainment',  'PK Drama & Entertainment',     'Pakistan-Specific High-Value', 73),
('pk_tech_startups',        'PK Tech & Startups',           'Pakistan-Specific High-Value', 74),
('pk_agriculture_rural',    'PK Agriculture & Rural',       'Pakistan-Specific High-Value', 75),
('pk_diaspora_content',     'PK Diaspora Content',          'Pakistan-Specific High-Value', 76),
-- Commerce & Brands
('brand_collab_showcase',   'Brand Collab Showcase',        'Commerce & Brands', 80),
('ugc_creator',             'UGC Creator',                  'Commerce & Brands', 81),
('affiliate_review',        'Affiliate & Review',           'Commerce & Brands', 82);


-- ============================================================
-- platform.fx_rate_snapshot
-- Daily FX rates for budget normalisation (Doc 9 FS-05.01).
-- ============================================================
CREATE TABLE platform.fx_rate_snapshot (
    snapshot_id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency       TEXT        NOT NULL,
    quote_currency      TEXT        NOT NULL,
    rate                NUMERIC(18,8) NOT NULL,
    rate_date           DATE        NOT NULL,
    source              TEXT        NOT NULL DEFAULT 'managed_fx_api',
    fetched_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_fx_rate_date UNIQUE (base_currency, quote_currency, rate_date)
);
```

---

**Part L — Complete Index Catalogue**

All indexes listed below are in addition to primary-key indexes. Indexes on partitioned tables are created once on the parent and automatically propagate to child partitions.

```sql
-- ── GCP Schema Indexes ──────────────────────────────────────────────────────

-- Creator lookup by merge state (identity resolution queries)
CREATE INDEX CONCURRENTLY idx_creator_merge_status
    ON gcp.creator (merge_status)
    WHERE merge_status IN ('candidate','merged_into');

-- Creator GDPR erasure pipeline
CREATE INDEX CONCURRENTLY idx_creator_pii_erased
    ON gcp.creator (pii_erased_at)
    WHERE pii_erased_at IS NOT NULL;

-- Profile dedup anchor (M5 UPSERT target, PATCH-007)
-- Already covered by UNIQUE constraint idx on (platform, canonical_url).

-- Profile by creator (enumerate a creator's profiles)
CREATE INDEX CONCURRENTLY idx_profile_creator
    ON gcp.profile (creator_id);

-- Profile enrichment status sweep (worker queue: which profiles need refresh)
CREATE INDEX CONCURRENTLY idx_profile_enrichment_status
    ON gcp.profile (enrichment_status, enriched_at)
    WHERE enrichment_status IN ('stale','pending','failed');

-- Profile index_pending sweep (ADR-027 sync projection follow-up)
CREATE INDEX CONCURRENTLY idx_profile_index_pending
    ON gcp.profile (index_pending)
    WHERE index_pending = TRUE;

-- YouTube-specific: authenticity signal filtering (Doc 15 Brain-1 attribute)
CREATE INDEX CONCURRENTLY idx_profile_yt_ratio
    ON gcp.profile (yt_subscriber_to_view_ratio)
    WHERE enrichment_source = 'youtube_data_api_v3'
      AND yt_subscriber_to_view_ratio IS NOT NULL;

-- Enrichment snapshot: current score lookup per creator/type
CREATE INDEX CONCURRENTLY idx_snapshot_creator_type_current
    ON gcp.enrichment_snapshot (creator_id, snapshot_type)
    WHERE is_current = TRUE;

-- Enrichment snapshot: prompt version sweep (ADR-028 re-scoring backfill)
CREATE INDEX CONCURRENTLY idx_snapshot_prompt_version
    ON gcp.enrichment_snapshot (snapshot_type, prompt_version, model_version)
    WHERE is_current = TRUE;

-- Contact record by creator
CREATE INDEX CONCURRENTLY idx_contact_creator
    ON gcp.contact_record (creator_id);

-- In-flight URL lock expiry sweep
CREATE INDEX CONCURRENTLY idx_inflight_url_expires
    ON gcp.inflight_url_lock (expires_at);


-- ── WP Schema Indexes ────────────────────────────────────────────────────────

-- Workspace by owner (ownership transfer queries)
CREATE INDEX CONCURRENTLY idx_workspace_owner
    ON wp.workspace (owner_user_id);

-- Workspace by subscription state (billing sweep jobs)
CREATE INDEX CONCURRENTLY idx_workspace_subscription_state
    ON wp.workspace (subscription_state);

-- Membership by user (multi-workspace switcher)
CREATE INDEX CONCURRENTLY idx_membership_user
    ON wp.membership (user_id)
    WHERE status = 'active';

-- Membership by workspace + role (entitlement resolution)
CREATE INDEX CONCURRENTLY idx_membership_ws_role
    ON wp.membership (workspace_id, role)
    WHERE status = 'active';

-- workspace_creator_link: find all workspaces for a creator (merge fan-out, PATCH-008)
CREATE INDEX CONCURRENTLY idx_wcl_creator_id
    ON wp.workspace_creator_link (creator_id);

-- workspace_creator_link: workspace view of linked creators
CREATE INDEX CONCURRENTLY idx_wcl_ws_active
    ON wp.workspace_creator_link (workspace_id, last_active_at DESC)
    WHERE workspace_removed_at IS NULL;

-- List by workspace
CREATE INDEX CONCURRENTLY idx_list_workspace
    ON wp.list (workspace_id)
    WHERE archived_at IS NULL;

-- List membership: creator's lists in workspace
CREATE INDEX CONCURRENTLY idx_lm_creator_ws
    ON wp.list_membership (workspace_id, creator_id)
    WHERE removed_at IS NULL;

-- Campaign by workspace
CREATE INDEX CONCURRENTLY idx_campaign_ws_status
    ON wp.campaign (workspace_id, status, created_at DESC);

-- Campaign creator: creator's active campaigns
CREATE INDEX CONCURRENTLY idx_cc_creator_ws
    ON wp.campaign_creator (workspace_id, creator_id)
    WHERE removed_at IS NULL;

-- Campaign creator: pipeline stage view
CREATE INDEX CONCURRENTLY idx_cc_campaign_stage
    ON wp.campaign_creator (campaign_id, pipeline_stage)
    WHERE removed_at IS NULL;

-- Task: overdue tasks per workspace
CREATE INDEX CONCURRENTLY idx_task_ws_due
    ON wp.task (workspace_id, due_date)
    WHERE completed_at IS NULL AND due_date IS NOT NULL;

-- Consent state: fast eligibility lookup (PATCH-006, TOCTOU last-gate)
CREATE INDEX CONCURRENTLY idx_consent_ws_creator_channel
    ON wp.consent_state (workspace_id, creator_id, channel);
-- This index serves the last-gate check: M9 reads one row at invocation time.

-- Sequence enrollment: active enrollments per workspace
CREATE INDEX CONCURRENTLY idx_enrollment_ws_active
    ON wp.sequence_enrollment (workspace_id, next_step_due_at)
    WHERE status = 'active';

-- Sequence enrollment: by campaign_creator
CREATE INDEX CONCURRENTLY idx_enrollment_cc
    ON wp.sequence_enrollment (campaign_creator_id);

-- Discovery job: active jobs per workspace
CREATE INDEX CONCURRENTLY idx_djob_ws_status
    ON wp.discovery_job (workspace_id, status, queued_at DESC);

-- Credit reservation: active reservations per workspace (sweeper + balance)
CREATE INDEX CONCURRENTLY idx_reservation_ws_active
    ON wp.credit_reservation (workspace_id, expires_at)
    WHERE status = 'active';

-- Credit reservation: expiry sweep (sweeper job)
CREATE INDEX CONCURRENTLY idx_reservation_expires
    ON wp.credit_reservation (expires_at)
    WHERE status = 'active';

-- Paddle subscription by workspace
CREATE INDEX CONCURRENTLY idx_paddle_sub_workspace
    ON wp.paddle_subscription (workspace_id);


-- ── Platform Schema Indexes ──────────────────────────────────────────────────

-- Outbox pending dispatch (relay polling — critical hot path)
-- Already defined above as idx_outbox_pending (partial WHERE dispatched_at IS NULL).

-- Processed event ledger: idempotency check (hot path per consumer)
-- Already covered by PRIMARY KEY (consumer_group, event_id).

-- Paddle webhook by event ID (idempotency lookup)
-- Already covered by UNIQUE constraint on paddle_event_id.

-- Paddle webhook: unprocessed (reconciliation)
CREATE INDEX CONCURRENTLY idx_paddle_webhook_unprocessed
    ON platform.paddle_webhook_raw (received_at)
    WHERE processed_at IS NULL;

-- Niche vocab by slug (classifier validation lookup)
-- Already covered by UNIQUE constraint on slug.

-- FX rate by currency pair and date
-- Already covered by UNIQUE constraint on (base_currency, quote_currency, rate_date).

-- Enrichment snapshot: partial index for niche_classification is_current
CREATE UNIQUE INDEX CONCURRENTLY idx_niche_class_current
    ON gcp.niche_classification (creator_id)
    WHERE is_current = TRUE;
-- Enforces: exactly one current classification per creator.
```

---

**Part M — Partition Management Strategy**

**M1. Partition pre-creation job (binding operational requirement)**

A scheduled job runs on the **15th of every month** and creates the partition for `M+2` (two months ahead) on both `wp.interaction_timeline` and `wp.credit_ledger_entry`. Running two months ahead provides a safety buffer against job failures without immediate data-ingestion risk.

```sql
-- Template executed by the partition_creation_job (pseudocode — actual job is
-- a worker in the scheduler queue, not a cron at the DB level):

-- For month = CURRENT_DATE + INTERVAL '2 months':
CREATE TABLE wp.interaction_timeline_{YYYY_MM}
    PARTITION OF wp.interaction_timeline
    FOR VALUES FROM ('{YYYY-MM-01 00:00:00+00}') TO ('{YYYY-(MM+1)-01 00:00:00+00}');

CREATE TABLE wp.credit_ledger_entry_{YYYY_MM}
    PARTITION OF wp.credit_ledger_entry
    FOR VALUES FROM ('{YYYY-MM-01 00:00:00+00}') TO ('{YYYY-(MM+1)-01 00:00:00+00}');

-- All five Timeline indexes and all five Ledger indexes are then created
-- CONCURRENTLY on the new partitions immediately after table creation.
-- Index creation failure = P2 alert to M12; job retries with backoff.
```

**M2. Partition archival (cold-tier migration)**

Partitions older than 24 months are detached from the parent table and attached to a cold-tier archive tablespace (Doc 22 selects the storage tier). The detach + reattach is a metadata operation and does not require downtime:

```sql
-- Detach (logical removal from query path):
ALTER TABLE wp.interaction_timeline
    DETACH PARTITION wp.interaction_timeline_2024_06;

-- Archive: tablespace migration (cold storage, Doc 22)
ALTER TABLE wp.interaction_timeline_2024_06
    SET TABLESPACE cold_tablespace;

-- Re-attach as read-only partition (for audit/DR replay access):
ALTER TABLE wp.interaction_timeline
    ATTACH PARTITION wp.interaction_timeline_2024_06
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
```

---

**Part N — Migration Strategy & Zero-Downtime Patterns**

**N1. Migration tooling**

All schema changes are managed through **Flyway-class versioned SQL files** stored in `/db/migrations/`. File naming convention: `V{n}__{snake_case_description}.sql`. Rules:
- Migration files are **immutable** after they touch a production database. No in-place editing of applied migrations.
- **Forward-only**: no rollback scripts in production. Rollback = a new forward migration that undoes the change. This eliminates the category of "applied migration but rollback fails" incidents.
- **Checksum validation** on every deploy: Flyway validates checksums of applied migrations against the file tree, detecting accidental edits.
- Migration version numbering is sequential integers (not timestamps), enforced by the PR gate.

**N2. Zero-downtime migration patterns**

All structural changes follow the **expand-contract pattern** to avoid table locks or unavailability:

| Change type | Safe pattern | Unsafe (prohibited) |
|---|---|---|
| Add column | Add as `NULLABLE` first; populate default; add NOT NULL constraint later as separate migration | `ALTER TABLE ADD COLUMN ... NOT NULL` on a large table (rewrites table) |
| Add index | Always `CREATE INDEX CONCURRENTLY` — never `CREATE INDEX` (takes ShareLock) | `CREATE INDEX` without CONCURRENTLY |
| Remove column | (1) Remove all application references; (2) make nullable; (3) drop in separate migration after 2 deploys | Single-migration column drop with code references still live |
| Rename column | (1) Add new column; (2) dual-write; (3) backfill; (4) switch reads; (5) drop old | `ALTER TABLE RENAME COLUMN` while application code uses old name |
| Rename table | Same dual-name pattern using a view alias | Direct rename with live application code |
| Change column type | (1) Add new typed column; (2) populate; (3) switch code; (4) drop old | `ALTER TABLE ALTER COLUMN TYPE` (rewrites table, locks) |

**N3. Enum evolution**

**Adding a value** to an existing PostgreSQL enum is safe and additive:
```sql
-- Safe: additive, no table rewrite, immediate
ALTER TYPE platform_enum ADD VALUE IF NOT EXISTS 'pinterest';
ALTER TYPE platform_enum ADD VALUE IF NOT EXISTS 'snapchat';
```

**Removing a value** from an enum is **not supported in PostgreSQL** and requires the full column-swap pattern (N2: change column type). For this reason, the niche vocabulary uses a reference table (`platform.niche_vocab`) instead of a PostgreSQL enum — additions are INSERTs, deprecations are `SET is_deprecated=TRUE`, and no DDL migration is required.

The `entry_type` column on `interaction_timeline` uses `TEXT` (not an enum) for the same reason: the taxonomy grows over time; a text constraint with application-layer validation avoids ALTER TYPE migrations on hot partitioned tables.

**N4. Partitioned table schema changes**

Adding a column to a partitioned parent automatically propagates to all child partitions:
```sql
-- Safe: propagates to all partitions automatically
ALTER TABLE wp.interaction_timeline ADD COLUMN IF NOT EXISTS external_ref TEXT;
-- No per-partition ALTER needed.
```

However, adding a `NOT NULL` column requires populating all existing partitions first:
```sql
-- Step 1 (migration V{n}): add nullable
ALTER TABLE wp.interaction_timeline ADD COLUMN new_field TEXT;

-- Step 2 (separate migration V{n+1}, after backfill job completes):
ALTER TABLE wp.interaction_timeline ALTER COLUMN new_field SET NOT NULL;
-- This is safe on populated partitions if all rows have the value.
-- Use a partial NOT NULL constraint (CHECK) if rows may be NULL by design.
```

**N5. Large-table backfill strategy**

For populating new columns on large tables (Timeline, Ledger), the batched-UPDATE pattern is mandatory:
```sql
-- Backfill worker (M12 operations job, not a migration):
DO $$
DECLARE
    batch_size  INT := 1000;
    last_id     UUID := '00000000-0000-0000-0000-000000000000';
    rows_updated INT;
BEGIN
    LOOP
        UPDATE wp.interaction_timeline
        SET new_field = compute_value(...)
        WHERE (entry_id, occurred_at) IN (
            SELECT entry_id, occurred_at
            FROM wp.interaction_timeline
            WHERE entry_id > last_id
              AND new_field IS NULL
            ORDER BY entry_id
            LIMIT batch_size
        )
        RETURNING entry_id INTO last_id;

        GET DIAGNOSTICS rows_updated = ROW_COUNT;
        EXIT WHEN rows_updated = 0;
        PERFORM pg_sleep(0.1);  -- 100ms pause between batches (replication lag relief)
    END LOOP;
END $$;
```

**N6. Niche vocabulary additions (change-control migration)**

New niche category additions require:
1. Evidence of ≥500 creators matching the new category (M12 data report).
2. T-A classifier rubric updated and evaluation gate passed (Doc 15 Part E).
3. Migration: `INSERT INTO platform.niche_vocab (...) VALUES (...)`.
4. Re-classification of affected creators scheduled (low-priority background job).

This is a one-SQL-statement migration with no downtime, no lock, and no risk. The reference-table approach was chosen precisely to make vocabulary growth a safe, routine operation.

**N7. ORM interoperability note**

Prisma and Drizzle do not natively support PostgreSQL range-partitioned tables. For the partitioned tables (`interaction_timeline`, `credit_ledger_entry`), Mimo must:
- Define the parent table schema in the ORM for type generation purposes.
- Execute all partition creation and management DDL through raw migration files (`$executeRaw` / raw SQL migrations), not through ORM migration generation.
- The ORM schema file is a **derived, secondary artifact** of this document, not an input to it. If there is a conflict between the ORM schema and this DDL, this document governs.

---

#### Dependency Mapping

- **Depends on:** Doc 18 (entity catalogue, all ARB patches ADR-024–028), Doc 15 (scoring provenance, enrichment_snapshot contract), Doc 16 (outbox, event taxonomy, discovery job), Doc 10 (FS-08.02 subscription state, FS-08.03 ledger), Doc 9 (timeline taxonomy, consent states), YouTube spike validation (2026-07-05).
- **Enables:** Doc 20 (API contracts — query shapes, request/response types derive from column types here), Doc 21 (GDPR erasure flow operates on the specific columns named in ADR-025; row-level security policies reference workspace_id columns defined here), Doc 22 (DB hosting, tablespace config, replication topology), Doc 24 (DR replay uses paddle_webhook_raw and outbox tables defined here), Doc 26 (all schema-level test assertions: constraint violations, partition query plans, SELECT FOR UPDATE behaviour).
- **Blocks:** Mimo backend scaffolding is unblocked by this document. The migration file `V001__initial_schema.sql` derives directly from Parts B–K. No further interpretation required.

#### Assumptions & Constraints

| ID | Description | Confidence | Validation |
|---|---|---|---|
| A-066 | PostgreSQL (≥14) or compatible (Aurora PG, Cloud SQL PG) used as the DB engine, confirming `SELECT FOR UPDATE`, range partitioning, `gen_random_uuid()`, and generated columns | High | Doc 22 DB engine selection |
| A-067 | Managed search index write latency < 500ms for new creator projections (ADR-027 sync path) | Med-High | Doc 15 spike |
| A-070 | Monthly partitioning on Timeline and Ledger provides adequate performance through S2 scale without cross-partition fan-out queries in the hot path | High | Standard at our F1 load envelope (Doc 16 F1) |
| A-071 | `NULLS NOT DISTINCT` in UNIQUE constraints available (PostgreSQL ≥15); fallback: replace with partial unique index `WHERE is_current = TRUE` on earlier versions | Med-High | Doc 22 version pin |
| A-072 | `GENERATED ALWAYS AS ... STORED` column for `usable_balance` supported (PG ≥12) | High | Standard PG feature |

#### Classified Risk Register

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| R-DATA-003 | Operational | Partition pre-creation job fails silently; data insert into future month has no partition → PostgreSQL raises error | M | H | M12 alert on partition-creation job failure; partition existence check in deploy gate; 2-month-ahead creation provides buffer |
| R-DATA-004 | Technical | `SELECT FOR UPDATE` on `workspace_credit_balance` becomes a hot-row contention point at high concurrent credit consumption | L | M | At S1/S2 load envelope (Doc 16 F1) this row is accessed O(concurrent metered actions); for S1/S2 scale this is negligible. Re-evaluate if concurrent enrichment > 50/workspace/second (not expected) |
| R-DATA-005 | Technical | Cross-schema soft FK (workspace_creator_link.creator_id) goes stale if a creator is deleted without triggering the GDPR erasure event | L | H | ADR-025 erasure flow emits `creator.gdpr_erased` synchronously with GCP nullification; consumer sets pii_deleted_at on the link row. Application rule: creator records are never hard-deleted (only nullified) |
| R-DATA-006 | Technical | ORM-generated migrations overwrite hand-crafted partitioned table DDL | M | H | CI gate: Prisma `migrate diff` or Drizzle `generate` output is reviewed against this document before merge; partitioned tables are excluded from ORM migration generation via schema introspection ignore list |
| R-DATA-007 | Operational | `yt_subscriber_to_view_ratio` computed incorrectly at enrichment time (divide-by-zero or type mismatch) | L | M | M5 validation gate: if `yt_subscriber_count = 0`, set `yt_subscriber_to_view_ratio = NULL` explicitly (insufficient data state, not 0); M6 prompt treats NULL as "ratio unavailable" and falls back to other signals |

#### Alternatives Considered & Trade-offs

- **PostgreSQL enums for entry_type / niche slug** — rejected for growth fields: `ALTER TYPE ... ADD VALUE` cannot be rolled back and is transaction-unsafe in partitioned tables (PostgreSQL limitation). Text + application validation chosen for `entry_type`; reference table chosen for niche_vocab. Stable, bounded enums (platform, role, channel) retain the type-safety of PostgreSQL native enums.
- **Single `metrics` JSONB column on Profile vs. typed YouTube columns** — hybrid chosen: `follower_count` and `engagement_rate` are universal and indexed; YouTube-specific fields (`yt_subscriber_count`, `yt_view_count`, `yt_subscriber_to_view_ratio`, `yt_avg_views_per_video`) are typed columns because the spike confirmed they are first-class authenticity signals that M6 passes directly to the LLM prompt. `platform_metrics` JSONB carries additional structured payload for non-critical fields.
- **Single partition key (occurred_at) for Timeline vs. composite (workspace_id, occurred_at)** — single key on `occurred_at` chosen: PostgreSQL range partitioning on a single column is the standard pattern; partition pruning on time ranges is the primary production query shape. Workspace isolation is enforced by the composite indexes (idx_tl_ws_creator_time, etc.), not the partition key. Composite-key partitioning would require hash + range (PostgreSQL sub-partitioning), adding operational complexity at S1/S2 scale without measurable benefit.
- **Separate schemas (gcp / wp / platform) vs. naming-prefix approach (gcp_creator, wp_workspace)** — separate schemas chosen: PostgreSQL grants on schemas are cleaner than grants on individual tables; the role model (gcp_write_role, wp_write_role) is more maintainable at scale; and the schema boundary is auditable (`\dn`, `\dt gcp.*`) without table-name parsing.
- **Eager vs. deferred `workspace_credit_balance` update** — eager (same-transaction) chosen: the entire point of the materialized balance row is to avoid a full-ledger SUM on every credit check. A deferred update would require a SUM on the critical path, violating NFR-P01. The SELECT FOR UPDATE cost (a single-row lock on a hot row) is negligible compared to the alternative.

#### Gap Analysis Report

- **Outbox DLQ table not defined** — the outbox relay moves events with `dispatch_attempts > 5` to a DLQ. A `platform.outbox_dlq` table (identical schema to platform.outbox + `dlq_reason` text column) should be defined in a follow-up migration. Assigned to Doc 22 (infra/operational config). **Low urgency** — the relay can write to the same `platform.outbox` with a `dlq_at` column as a simpler alternative; doc 22 decides.
- **Mailbox token storage table not defined** — OAuth tokens for Gmail/Outlook (FS-06.01) require encrypted storage (Doc 21 requirement). The schema for this table is deliberately omitted here and assigned to **Doc 21** (secret management and token security), which owns the encryption-at-rest and access-control specification.
- **WhatsApp WABA binding table (S2) not defined** — per-workspace WABA + phone-number binding (Doc 9 FS-06.06) requires a table. Omitted here as S2 scope; assigned to a future schema migration produced before S2 BSP integration begins. Owner: Mimo, gated on BSP procurement (Doc 17 B6).
- **`workspace_credit_balance.usable_balance` transaction isolation note** — the generated column is correct, but the critical implementation note (transaction isolation must be `READ COMMITTED` with `FOR UPDATE` to prevent phantom reads) is a Doc 26 test case. Assigned: Doc 26 must include a concurrency test that fires 10 simultaneous reserve operations against a balance of 5 credits and asserts exactly 0 or 1 succeed (never negative balance).

#### Cross-References & Decision Traceability

ADR-024 (soft FK via workspace_creator_link) codified in `wp.workspace_creator_link` DDL and role model. ADR-025 (GDPR tombstone) codified in `pii_erased_at` columns on `gcp.creator`, `gcp.profile`, `gcp.contact_record`, and `wp.workspace_creator_link`. ADR-026 (SELECT FOR UPDATE reserve-commit) codified in `wp.workspace_credit_balance` with transaction pattern in column comments. ADR-027 (synchronous index projection) codified in `gcp.profile.index_pending` flag. ADR-028 (prompt version score invalidation) codified in `gcp.enrichment_snapshot.prompt_version`, `model_version`, `content_hash`, and `is_current` fields. YouTube spike (2026-07-05): `gcp.profile.enrichment_source`, `payload_completeness_tier`, `yt_subscriber_to_view_ratio`, and related YouTube columns. PATCH-003 (Timeline indexing): 5 indexes defined. PATCH-004/ADR-026 (Ledger concurrency): 5 indexes + `workspace_credit_balance` + `credit_reservation`. PATCH-007/009 (intra-job dedup): `gcp.inflight_url_lock`. PATCH-008 (identity resolution): `gcp.creator.merge_status` enum, `merge_confidence`, `merged_into_creator_id`. Doc 18 Part H (niche vocab): `platform.niche_vocab` reference table + 48-row seed.

#### Open Questions & External Dependencies

1. PostgreSQL version pin (≥14 required for this DDL; ≥15 preferred for `NULLS NOT DISTINCT` in UNIQUE constraints) — confirmed in Doc 22 DB engine selection before V001 migration is applied.
2. `platform.outbox_dlq` design — Doc 22 (infra) or inline addition to `platform.outbox` with `dlq_at` column — decision deferred to Doc 22.
3. OAuth token storage schema — Doc 21 owns this; must be defined before Mimo builds FS-06.01 (Gmail/Outlook integration).
4. Cold-tier tablespace name for partition archival — Doc 22 provides the tablespace identifier; Part M uses the placeholder `cold_tablespace`.
5. DB connection pooling configuration (PgBouncer-class) — needed before `SELECT FOR UPDATE` behaviour is tested; TRANSACTION mode pooling is incompatible with advisory locks; DOC 22 must confirm SESSION or TRANSACTION pooling mode.

#### Future Revision Triggers

New platform added (e.g., Pinterest): `ALTER TYPE platform_enum ADD VALUE`; new profile columns defined here; adapter spec added to Doc 17. New niche categories: INSERT into `platform.niche_vocab` (no DDL migration). S2 WhatsApp: WABA binding table migration added. S3 enterprise: audit log export schema; granular RBAC tables (anticipated structurally; no DDL here). Index removal if a query pattern changes: always via `DROP INDEX CONCURRENTLY`. ADR-028 batch re-scoring implementation requires: `UPDATE gcp.enrichment_snapshot SET is_current = FALSE WHERE snapshot_type = $1 AND prompt_version != $current` — no schema change, only data-state migration.

#### Review Checklist & Validation Criteria

- [ ] Every Doc 18 entity has a CREATE TABLE statement with all attributes, types, constraints. ✅
- [ ] `gcp.profile`: enrichment_source enum, payload_completeness_tier, yt_subscriber_to_view_ratio, YouTube columns. ✅ (YouTube spike integrated)
- [ ] `wp.workspace_creator_link`: no DB-level FK to gcp schema; unique constraint on (workspace_id, creator_id). ✅ (ADR-024)
- [ ] `wp.interaction_timeline`: PARTITION BY RANGE; all 5 composite indexes from PATCH-003. ✅
- [ ] `wp.credit_ledger_entry`: PARTITION BY RANGE; all 5 ledger indexes. ✅
- [ ] `wp.workspace_credit_balance`: version column; SELECT FOR UPDATE pattern documented. ✅ (ADR-026)
- [ ] `wp.credit_reservation`: expires_at; status enum; sweeper pattern described. ✅ (PATCH-005)
- [ ] `gcp.inflight_url_lock`: canonical_url PK; 15-minute TTL; expires_at index. ✅ (PATCH-009)
- [ ] `gcp.enrichment_snapshot`: prompt_version, model_version, content_hash, is_current. ✅ (ADR-028)
- [ ] `gcp.creator`: merge_status enum; merge_confidence; merged_into FK. ✅ (PATCH-008)
- [ ] `platform.niche_vocab`: 48-row seed data matching Doc 18 Part H. ✅
- [ ] All CREATE INDEX statements use CONCURRENTLY. ✅
- [ ] Migration strategy: expand-contract, forward-only, enum evolution, partitioned-table DDL guidance. ✅
- [ ] ORM interop note present. ✅
- [ ] Sign-off: Principal Architects (Data, Software, Security), Engineering Director (migration strategy + partition ops), Mimo (implementability review — can scaffold V001 migration from this document alone); Qwen review of ADR-024 cross-schema FK absence and ADR-026 transaction pattern.

---

[AWAITING APPROVAL]



---

<a name="doc-020"></a>
# DOC-020 — API Contracts and Design

---
title: "Doc 20 — API Design & Contracts"
status: In Review
last_updated: 2026-07-05
tags: [api-design, rest, contracts, endpoints, authentication, rate-limiting]
phase: 6
doc_number: 20
depends_on: [Doc-14, Doc-16, Doc-17, Doc-18, Doc-19]
---

# Document #20 — API Design & Contracts

**Version:** 1.0-draft
**Status:** In Review
**Authors:** MUSHIN Architecture Team
**Review Cycle:** Pre-implementation review required before S1 development begins

---

## Executive Summary

This document defines the complete REST API surface for MUSHIN's first-party client-facing API. MUSHIN has **no public API at S1/S2** (ADR-023); all endpoints are first-party-only, served through a managed edge/WAF layer, and consumed exclusively by the MUSHIN SPA (ADR-013). This document establishes: authentication and tenancy resolution contracts, request/response envelope standards, error catalogue, rate-limiting architecture, pagination strategy, versioning policy, per-module endpoint inventories (M1–M13), job-progress polling pattern (ADR-021), webhook reception contracts for inbound third-party events, and the API evolution protocol.

Every endpoint is workspace-scoped unless it operates at the platform level (admin, auth). Every business operation is gated by entitlement checks before execution. No raw database identifiers are exposed; all public identifiers are UUIDs.

---

## Purpose & Scope

**In scope:**
- Complete endpoint inventory for modules M1–M13
- Authentication and tenancy resolution middleware specification
- Standard request/response envelope, header, and error formats
- Rate limiting at three concentric layers (edge, workspace, endpoint)
- Pagination patterns (cursor-based and offset)
- API versioning and deprecation policy
- Inbound webhook reception contracts (Paddle, Gmail, Outlook)
- Job progress polling contract (ADR-021)
- Security envelope per endpoint category
- Integration stack interface notes for adapter-touching endpoints

**Out of scope:**
- Public API (deferred to S3; trigger: ≥3 enterprise prospects requiring API access — ADR-023)
- Mobile API variants (S1 is SPA-only — ADR-013)
- GraphQL or gRPC surfaces (not in scope at S1/S2)
- Internal inter-module RPC contracts (these are internal monolith contracts, not API contracts)
- OpenAPI/Swagger spec file (this doc IS the specification source of truth; a machine-readable spec shall be generated from it in Doc 26)

---

## Non-Goals

- Designing for external developer consumption — MUSHIN has no external developers at S1/S2
- Providing a public discovery/read API over the GCP — the GCP is a private intelligence asset
- Supporting webhook outbound delivery to customer systems (S3+ feature)
- Designing admin-impersonation endpoints in this document — covered in Doc 29

---

## Objectives & Success Criteria

| Objective | Criterion |
|---|---|
| NFR-P01 compliance | Filtered search endpoint p95 < 1s |
| NFR-P02 compliance | NL/semantic search endpoint p95 < 3s |
| NFR-S01 compliance | Zero cross-workspace data in any API response |
| NFR-C01 compliance | All credit-consuming endpoints emit cost events |
| No overdraft | All credit operations use reserve-commit (ADR-026) |
| Idempotency | All mutating operations accept idempotency keys |
| Consent TOCTOU safety | All outreach endpoints perform last-gate consent check (PATCH-006) |

---

## Part A — API Philosophy & Architectural Constraints

### A1. Core Constraints

1. **First-party only (ADR-023):** The API is a private implementation detail of the MUSHIN SPA. No external consumers at S1/S2. No public documentation. No API key issuance to customers.

2. **Managed edge (ADR-023):** All traffic enters through a managed WAF/CDN layer. No custom API gateway build — managed product (Cloudflare or equivalent) handles TLS termination, DDoS protection, and IP-level rate limiting.

3. **Tenancy-first:** Every request resolves a `TenancyContext` (user, workspace, role, entitlement snapshot) before any business logic executes. No endpoint skips this middleware.

4. **Write-path isolation (ADR-018):** API endpoints never invoke LLM scoring inline. All intelligence operations are triggered asynchronously via workers. API responses are always fast, deterministic reads from the indexed GCP or WP data.

5. **Adapter exclusivity (ADR-022):** No endpoint calls external services directly. All external calls route through the Adapter Layer. This is enforced at the monolith module boundary, not enforced by the API layer itself.

6. **Idempotency-by-default:** All `POST` and `PATCH` endpoints accept an `Idempotency-Key` header. Duplicate submissions within a 24-hour window return the cached response without re-executing side effects.

### A2. URL Structure

```
Base URL:   https://api.mushin.app/api/v1/
Webhooks:   https://api.mushin.app/webhooks/
Admin:      https://api.mushin.app/api/v1/admin/   (staff identity plane only — ADR-011)
```

All paths are lowercase with hyphens. No trailing slashes. Resource collections use plural nouns. Actions that do not map cleanly to CRUD use sub-resource verbs (e.g., `/enroll`, `/cancel`, `/erase`).

### A3. Content Negotiation

- All requests: `Content-Type: application/json`
- All responses: `Content-Type: application/json`
- No XML, form-data, or multipart at this API layer (file uploads handled via pre-signed URLs to object storage)

---

## Part B — Authentication & Authorization

### B1. Authentication Model

MUSHIN uses a BaaS-provided JWT authentication layer (provider selected in Doc 22). The authentication flow:

```
1. User authenticates against BaaS auth endpoint (outside /api/v1/ prefix)
2. BaaS issues a short-lived JWT (access token, 15-minute expiry)
3. SPA includes JWT in every API request: Authorization: Bearer <jwt>
4. API middleware validates JWT signature against BaaS JWKS endpoint (cached)
5. User identity (user_id, email) extracted from JWT claims
6. TenancyContext resolved from user_id + X-Workspace-ID header
```

**Token characteristics:**
- Access token: 15-minute expiry; stateless JWT; RS256 signed
- Refresh token: 7-day expiry; opaque token; handled entirely by BaaS layer
- MUSHIN backend never stores tokens; validates only via JWKS

### B2. Staff Identity Plane (ADR-011)

Staff (admin/support) authentication uses a **completely separate auth realm** from customer auth:

```
Staff auth endpoint: (separate BaaS project / separate JWKS)
Mandatory MFA:       TOTP or WebAuthn
JWT claim:           "realm": "staff"
```

Any request to `/api/v1/admin/*` that does not carry a staff-realm JWT receives `403 Forbidden` regardless of the workspace entitlement state. Staff JWT validity is cross-workspace; staff `X-Workspace-ID` is optional (some admin endpoints operate globally).

### B3. TenancyContext Resolution

Every non-auth, non-webhook request goes through tenancy middleware in this sequence:

```
1. Extract user_id from JWT claims
2. Read X-Workspace-ID header (required for workspace-scoped endpoints)
3. Load workspace membership record → resolve role (owner/admin/member/viewer)
4. Load workspace entitlement snapshot (cached 60s; invalidated by Paddle webhook)
5. Attach TenancyContext to request: { user_id, workspace_id, role, entitlements }
6. If workspace is suspended/read-only → enforce read-only mode for mutating ops
```

**TenancyContext failure modes:**
| Condition | HTTP Status | Error Code |
|---|---|---|
| No/invalid JWT | 401 | `AUTH_TOKEN_INVALID` |
| Valid JWT, no X-Workspace-ID | 400 | `WORKSPACE_ID_REQUIRED` |
| Valid JWT, workspace not found | 404 | `WORKSPACE_NOT_FOUND` |
| User not member of workspace | 403 | `WORKSPACE_ACCESS_DENIED` |
| Workspace suspended | 403 | `WORKSPACE_SUSPENDED` |
| Feature not in entitlement tier | 403 | `FEATURE_NOT_ENTITLED` |

### B4. Role-Based Access Control

| Role | Scope | Mutate | Billing | Admin |
|---|---|---|---|---|
| `owner` | Full workspace | ✅ | ✅ | ✅ |
| `admin` | Full workspace | ✅ | ✅ read-only | ❌ |
| `member` | Assigned resources | ✅ | ❌ | ❌ |
| `viewer` | Read-only | ❌ | ❌ | ❌ |

Role requirements are documented per endpoint in Part I. Endpoints that require `owner` or `admin` return `403 ROLE_INSUFFICIENT` for lower roles.

---

## Part C — Request & Response Standards

### C1. Standard Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | ✅ | `Bearer <jwt>` |
| `X-Workspace-ID` | ✅ (workspace endpoints) | UUID of the target workspace |
| `Content-Type` | ✅ (body requests) | `application/json` |
| `Idempotency-Key` | Recommended | Client-generated key (UUID); prevents duplicate side effects within 24h |
| `X-Request-ID` | Optional | Client-generated trace ID; echoed in response |

### C2. Standard Response Headers

| Header | Description |
|---|---|
| `X-Request-ID` | Echo of client's X-Request-ID, or server-generated UUID if not provided |
| `X-RateLimit-Limit` | Total requests allowed in current window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `X-Entitlement-Tier` | Current workspace subscription tier slug |
| `X-Credits-Balance` | Current usable credit balance (on credit-consuming responses only) |

### C3. Success Response Envelope

**Single resource:**
```json
{
  "data": { ... },
  "meta": {
    "request_id": "req_01JXXXXXXXXXXXXXXX"
  }
}
```

**Collection:**
```json
{
  "data": [ ... ],
  "pagination": {
    "cursor": "eyJpZCI6IjAxSlhYWCJ9",
    "has_more": true,
    "total_count": 1450
  },
  "meta": {
    "request_id": "req_01JXXXXXXXXXXXXXXX"
  }
}
```

**Async job initiated:**
```json
{
  "data": {
    "job_id": "job_01JXXXXXXXXXXXXXXX",
    "status": "queued",
    "poll_url": "/api/v1/discovery/jobs/job_01JXXXXXXXXXXXXXXX",
    "estimated_duration_seconds": 45
  },
  "meta": {
    "request_id": "req_01JXXXXXXXXXXXXXXX"
  }
}
```

### C4. HTTP Status Code Usage

| Code | Usage |
|---|---|
| `200 OK` | Successful GET, PATCH, PUT |
| `201 Created` | Successful POST creating a new resource |
| `202 Accepted` | POST that triggers an async job |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Validation error, malformed request |
| `401 Unauthorized` | Missing or invalid JWT |
| `403 Forbidden` | Valid auth but insufficient permission |
| `404 Not Found` | Resource does not exist or is not accessible to workspace |
| `409 Conflict` | Idempotency key collision, or resource state conflict |
| `422 Unprocessable Entity` | Business rule violation (insufficient credits, etc.) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |
| `503 Service Unavailable` | Circuit breaker open (adapter degraded) |

---

## Part D — Error Catalogue

All error responses use the same envelope:

```json
{
  "error": {
    "code": "ERROR_CODE_SNAKE_UPPER",
    "message": "Human-readable error description",
    "details": { },
    "request_id": "req_01JXXXXXXXXXXXXXXX"
  }
}
```

### D1. Authentication & Authorisation Errors (401/403)

| Code | Message | HTTP |
|---|---|---|
| `AUTH_TOKEN_INVALID` | JWT is missing, expired, or signature invalid | 401 |
| `AUTH_TOKEN_EXPIRED` | JWT access token has expired; refresh required | 401 |
| `WORKSPACE_ID_REQUIRED` | X-Workspace-ID header is required for this endpoint | 400 |
| `WORKSPACE_NOT_FOUND` | Workspace does not exist | 404 |
| `WORKSPACE_ACCESS_DENIED` | User is not a member of this workspace | 403 |
| `WORKSPACE_SUSPENDED` | Workspace subscription is suspended | 403 |
| `WORKSPACE_READ_ONLY` | Workspace is in read-only grace period; mutation not permitted | 403 |
| `ROLE_INSUFFICIENT` | Your role does not permit this action | 403 |
| `FEATURE_NOT_ENTITLED` | Your subscription tier does not include this feature | 403 |
| `STAFF_REALM_REQUIRED` | This endpoint requires staff authentication | 403 |

### D2. Validation Errors (400/422)

| Code | Message | HTTP |
|---|---|---|
| `VALIDATION_ERROR` | Request body failed schema validation; see `details` for field errors | 400 |
| `INVALID_UUID` | Provided ID is not a valid UUID | 400 |
| `INVALID_CURSOR` | Pagination cursor is malformed or expired | 400 |
| `INVALID_DATE_RANGE` | Date range is invalid or exceeds maximum window | 400 |

### D3. Credit & Billing Errors (422)

| Code | Message | HTTP |
|---|---|---|
| `CREDIT_INSUFFICIENT` | Insufficient credits; required: X, available: Y | 422 |
| `CREDIT_RESERVE_FAILED` | Credit reservation could not be completed; try again | 422 |
| `CREDIT_RESERVATION_EXPIRED` | The credit reservation for this operation has expired | 422 |
| `BILLING_STATE_INVALID` | Billing state prevents this operation | 422 |

### D4. Business Logic Errors (404/409/422)

| Code | Message | HTTP |
|---|---|---|
| `RESOURCE_NOT_FOUND` | The requested resource does not exist | 404 |
| `CREATOR_NOT_FOUND` | Creator does not exist in the Global Creator Plane | 404 |
| `DUPLICATE_IDEMPOTENCY_KEY` | Request with this idempotency key was already processed | 409 |
| `CAMPAIGN_ALREADY_COMPLETED` | Campaign is completed and cannot be modified | 409 |
| `SEQUENCE_ENROLLMENT_EXISTS` | Creator is already enrolled in this sequence | 409 |
| `CONSENT_OPT_OUT` | Creator has opted out; outreach blocked | 422 |
| `MAILBOX_NOT_CONNECTED` | No mailbox is connected to this workspace | 422 |
| `WABA_NOT_PROVISIONED` | WhatsApp Business Account not provisioned for this workspace | 422 |
| `JOB_NOT_CANCELLABLE` | Job is in a terminal state and cannot be cancelled | 409 |
| `GDPR_ERASED` | Creator data has been erased per GDPR request | 404 |

### D5. Service & Rate Limit Errors (429/503)

| Code | Message | HTTP |
|---|---|---|
| `RATE_LIMIT_WORKSPACE` | Workspace API rate limit exceeded; see X-RateLimit-Reset | 429 |
| `RATE_LIMIT_ENDPOINT` | Endpoint-specific rate limit exceeded; see X-RateLimit-Reset | 429 |
| `ADAPTER_DEGRADED` | External service adapter is in degraded mode; operation not available | 503 |
| `DISCOVERY_CAPACITY` | Live Discovery capacity exceeded; retry in X seconds | 503 |

---

## Part E — Rate Limiting Architecture

Three concentric layers enforce rate limits (from Doc 17 C1):

### E1. Layer 1 — Edge / IP-Level (WAF)

Managed by the WAF/CDN provider (Cloudflare or equivalent). Not configurable per workspace.

| Protection | Limit |
|---|---|
| Flood protection | 1000 req/min per IP |
| DDoS mitigation | Managed WAF policy |
| Bot challenge | Adaptive (not applied to API traffic with valid JWT) |

### E2. Layer 2 — Workspace / Subscription-Tier Level

Applied by API middleware after TenancyContext resolution. Limits vary by subscription tier.

| Tier | Requests/min | Discovery jobs/hour | Enrichment calls/day |
|---|---|---|---|
| Free / Trial | 60 | 5 | 20 |
| Starter | 300 | 20 | 100 |
| Pro | 1000 | 60 | 500 |
| Agency | 3000 | 200 | 2000 |

Rate limit state is stored in a fast in-memory store (Redis-class, separate from PostgreSQL). Window is sliding 60-second.

### E3. Layer 3 — Endpoint-Specific Limits

Applied per user (not per workspace) for computationally expensive endpoints:

| Endpoint | Limit |
|---|---|
| `POST /api/v1/discovery/jobs` | 10 concurrent active jobs per workspace |
| `POST /api/v1/creators/add-by-url` | 50/hour per user |
| `POST /api/v1/search` (Brain-2 path) | 20/min per user |
| `POST /api/v1/sequences/{id}/enroll` (batch) | 100 enrollments/request |

### E4. Rate Limit Headers

Every response includes:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 947
X-RateLimit-Reset: 1751721600
```

On `429` responses, a `Retry-After` header is also included (seconds until reset).

---

## Part F — Pagination Strategy

### F1. Cursor-Based Pagination (large/unbounded collections)

Used for: Timeline, Credit Ledger, Discovery Results, Notification stream, Admin audit log.

**Request:**
```
GET /api/v1/timeline?cursor=eyJpZCI6Ii4uLiJ9&limit=50
```

**Response:**
```json
{
  "data": [ ... ],
  "pagination": {
    "cursor": "eyJpZCI6Ii4uLiJ9",
    "has_more": true,
    "total_count": null
  }
}
```

- `cursor` is an opaque base64-encoded continuation token (encodes `occurred_at + entry_id`)
- `limit` default: 25; max: 100
- `total_count` is `null` for partitioned tables (count is too expensive); returned for bounded collections
- Cursor is valid for 24 hours; expired cursor returns `INVALID_CURSOR` error

### F2. Offset Pagination (bounded/small collections)

Used for: Workspace members, Campaign creators, List creators, Sequences, Notifications.

**Request:**
```
GET /api/v1/campaigns?offset=0&limit=20
```

**Response:**
```json
{
  "data": [ ... ],
  "pagination": {
    "offset": 0,
    "limit": 20,
    "total_count": 87,
    "has_more": true
  }
}
```

- `limit` default: 20; max: 100
- `total_count` always returned for offset-paginated collections

---

## Part G — Versioning Policy

### G1. URL Versioning

All endpoints are versioned under `/api/v1/`. A version increment to `/api/v2/` requires:
- A breaking change (field removal, type change, semantic change)
- Documented migration path
- 90-day deprecation window running both versions in parallel
- Change-Control-Log entry

### G2. Additive-Only Evolution

Within `/api/v1/`, only additive changes are permitted:
- ✅ New optional request fields
- ✅ New response fields
- ✅ New endpoints
- ✅ New error codes
- ❌ Removing request/response fields
- ❌ Changing field types
- ❌ Changing HTTP method for existing endpoints
- ❌ Changing status code semantics

### G3. Deprecation Signaling

Deprecated fields are flagged with a `X-Deprecated-Fields: field_name` response header and a `deprecated: true` annotation in the spec. Consumers have 90 days to migrate before a version increment.

---

## Part H — Idempotency Protocol

All `POST` and `PATCH` endpoints support idempotency via the `Idempotency-Key` header:

```
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

**Behaviour:**
- If a request with this key was completed within 24h, the cached response is returned with status `200` (not `201`)
- If a request with this key is in-flight, returns `409 DUPLICATE_IDEMPOTENCY_KEY` until complete
- Key scope: per workspace + per user (same key from different workspaces is treated as different)
- Keys expire after 24h; after expiry, re-using the key triggers a fresh execution

---

## Part I — Module API Surfaces

### I1. M1 — Identity & Tenancy Kernel

Authentication endpoints are outside the `/api/v1/` prefix and are handled entirely by the BaaS auth layer. The following workspace/membership endpoints are exposed through the MUSHIN backend:

#### Workspace Management

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/workspaces` | Any | List all workspaces the user is a member of |
| `POST` | `/api/v1/workspaces` | — | Create a new workspace (triggers Paddle customer creation) |
| `GET` | `/api/v1/workspaces/{workspace_id}` | viewer+ | Get workspace details and entitlement snapshot |
| `PATCH` | `/api/v1/workspaces/{workspace_id}` | owner | Update workspace name, timezone, settings |
| `DELETE` | `/api/v1/workspaces/{workspace_id}` | owner | Soft-delete workspace (suspends; 30-day data retention before purge) |

#### Membership Management

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/workspaces/{workspace_id}/members` | viewer+ | List workspace members with roles |
| `POST` | `/api/v1/workspaces/{workspace_id}/members/invite` | admin+ | Invite user by email; sends BaaS invitation |
| `PATCH` | `/api/v1/workspaces/{workspace_id}/members/{user_id}/role` | owner | Change member role |
| `DELETE` | `/api/v1/workspaces/{workspace_id}/members/{user_id}` | admin+ | Remove member from workspace |
| `GET` | `/api/v1/me` | Any | Current user profile + all workspace memberships |

**Key behaviours:**
- `POST /workspaces` is not workspace-scoped (no `X-Workspace-ID` required)
- `DELETE /workspaces/{id}` requires owner role and emits a workspace suspension event to the outbox; does not immediately purge data

---

### I2. M2 — Creator Store (GCP)

These endpoints read from the GCP schema. They return workspace-scoped views (relationship data from `workspace_creator_link` merged with GCP intelligence data). No raw GCP mutations via API — the GCP is mutated only by M4/M5/M6 workers.

#### Creator Detail

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/creators/{creator_id}` | viewer+ | Full creator detail: GCP attributes + workspace relationship data |
| `GET` | `/api/v1/creators/{creator_id}/profiles` | viewer+ | All social profiles for this creator |
| `GET` | `/api/v1/creators/{creator_id}/profiles/{profile_id}` | viewer+ | Single profile with enrichment snapshot |
| `GET` | `/api/v1/creators/{creator_id}/enrichment` | viewer+ | Enrichment status, payload completeness tier, last enrichment timestamp |
| `POST` | `/api/v1/creators/{creator_id}/enrich` | member+ | Trigger deep enrichment (credit-consuming; reserves credits before dispatching) |

**Add-by-URL (triggers Brain-2 fast path):**

| Method | Path | Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/creators/add-by-url` | member+ | Add creator by social profile URL; triggers M4 minimal ingestion if not in GCP |

Request body:
```json
{
  "profile_url": "https://www.instagram.com/creator_handle/",
  "platform": "instagram",
  "workspace_list_id": "list_01JXXXXXXX"
}
```

Response: `202 Accepted` with job reference if new URL (pending M4 ingestion); `200 OK` with creator_id if URL already in GCP.

**Note:** `POST /api/v1/creators/{creator_id}/enrich` is credit-consuming. It executes the reserve-commit pattern (ADR-026): credits are reserved before the worker job is dispatched, and committed on success or released on failure.

#### Lists

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/lists` | viewer+ | List all workspace lists |
| `POST` | `/api/v1/lists` | member+ | Create a new list |
| `GET` | `/api/v1/lists/{list_id}` | viewer+ | List detail with creator count |
| `PATCH` | `/api/v1/lists/{list_id}` | member+ | Update list name/description |
| `DELETE` | `/api/v1/lists/{list_id}` | admin+ | Soft-delete list (removes list; does not delete creators) |
| `GET` | `/api/v1/lists/{list_id}/creators` | viewer+ | Paginated creators in list (with workspace relationship data) |
| `POST` | `/api/v1/lists/{list_id}/creators` | member+ | Add creator(s) to list (batch: up to 100) |
| `DELETE` | `/api/v1/lists/{list_id}/creators/{creator_id}` | member+ | Remove creator from list |

---

### I3. M3 — Search Coordinator

The Search Coordinator routes to Brain-1 (fast indexed search) or Brain-2 (Live Discovery) based on query type. The SPA always calls the same endpoint; routing is backend-determined.

#### Search

| Method | Path | Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/search` | viewer+ | Execute search query against creator index |
| `GET` | `/api/v1/search/facets` | viewer+ | Available filter facets and their value counts for current index |

**Search request body:**
```json
{
  "query": "Pakistani fashion micro-influencers Karachi",
  "filters": {
    "platform": ["instagram", "tiktok"],
    "niche": ["pk_fashion_textile"],
    "min_followers": 10000,
    "max_followers": 100000,
    "min_authenticity_score": 70,
    "payload_completeness_tier": ["rich", "standard"]
  },
  "sort": {
    "field": "authenticity_score",
    "direction": "desc"
  },
  "pagination": {
    "cursor": null,
    "limit": 25
  },
  "routing_hint": "brain1"
}
```

**`routing_hint` values:**
- `brain1` (default): Forced Brain-1 only; fast; returns only indexed creators
- `brain2`: Triggers Live Discovery job; returns `202 Accepted` with job reference
- `auto`: Backend decides based on query characteristics (if query implies undiscovered creators, routes to Brain-2)

**Search response (Brain-1):**
- `200 OK` with paginated creator list (p95 < 1s per NFR-P01)
- Each result includes: creator_id, display_name, primary_platform, follower_count, authenticity_score, payload_completeness_tier, workspace relationship status
- NL query translation is applied transparently by M3 (cached 24h per normalised query)

**Search response (Brain-2):**
- `202 Accepted` with job reference → client polls `/api/v1/discovery/jobs/{job_id}` per ADR-021

---

### I4. M4 — Live Discovery Pipeline

The Live Discovery pipeline is entirely asynchronous (ADR-021). Clients submit jobs and poll for status/results.

#### Discovery Jobs (ADR-021 Polling Protocol)

| Method | Path | Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/discovery/jobs` | member+ | Initiate a new discovery job |
| `GET` | `/api/v1/discovery/jobs/{job_id}` | viewer+ | Poll job status and progress |
| `GET` | `/api/v1/discovery/jobs/{job_id}/results` | viewer+ | Get paginated discovery results (credit-consuming on reveal) |
| `DELETE` | `/api/v1/discovery/jobs/{job_id}` | member+ | Cancel an in-progress job |
| `GET` | `/api/v1/discovery/jobs` | viewer+ | List all jobs for workspace (active + recent) |

**Job creation request:**
```json
{
  "type": "niche_discovery",
  "parameters": {
    "query": "PK fashion creators Lahore",
    "platforms": ["instagram", "tiktok"],
    "niche_hints": ["pk_fashion_textile"],
    "max_results": 50
  },
  "target_list_id": "list_01JXXXXXXX"
}
```

**Job types:**
- `niche_discovery`: Serper → Apify actor(s) → M5 → M6 pipeline
- `add_by_url`: Single URL fast-path through M4/M5 (triggered by `POST /creators/add-by-url`)
- `hashtag_discovery`: `apify/instagram-hashtag-scraper` → M5 pipeline

**Job status polling response:**
```json
{
  "data": {
    "job_id": "job_01JXXXXXXX",
    "type": "niche_discovery",
    "status": "running",
    "progress": {
      "stage": "apify_scraping",
      "completed_stages": ["serper_query", "url_dedup"],
      "percent": 45,
      "candidates_found": 23,
      "candidates_scored": 18,
      "candidates_failed": 2
    },
    "created_at": "2026-07-05T10:00:00Z",
    "estimated_completion_at": "2026-07-05T10:01:30Z"
  }
}
```

**Job status values:**
- `queued` → `running` → `completed` | `partial` | `failed` | `cancelled`
- `partial`: Some candidates succeeded, some failed (pipeline degraded)

**Polling recommendation (per ADR-021):**
- Initial poll: after 3 seconds
- Subsequent polls: every 2–5 seconds while `running`
- Progressive results available via `GET /results` even before job is `completed`
- Client library handles backoff; not enforced by API

**Intra-Job Dedup (PATCH-007):** The backend transparently deduplicates URLs within a job using `gcp.inflight_url_lock` + GCP URL lookup. The API surface does not expose this; duplicate candidates are silently deduplicated and counted in `candidates_found` without LLM double-billing.

---

### I5. M5/M6 — Standardization, Ingestion & Intelligence (no direct API surface)

M5 (standardization/ingestion) and M6 (LLM scoring) are pure worker-side modules. There are no client-facing API endpoints. Their outputs are consumed via M2 creator/profile read endpoints and the search index.

**Observable effects exposed via API:**
- `gcp.enrichment_snapshot.is_current` → surfaced in `GET /creators/{id}/enrichment`
- `payload_completeness_tier` → included in all search results and creator detail responses
- `prompt_version` / `model_version` → included in enrichment snapshot response (ADR-028 traceability)

---

### I6. M7 — CRM & Interaction Timeline

The Interaction Timeline is an append-only, workspace-scoped event log (no updates, no deletes). All entries are immutable. Filtering is handled by index-backed queries.

#### Timeline

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/timeline` | viewer+ | Workspace timeline (cursor-paginated; most recent first) |
| `GET` | `/api/v1/creators/{creator_id}/timeline` | viewer+ | Timeline for specific creator in this workspace |
| `POST` | `/api/v1/timeline/entries` | member+ | Create a manual timeline entry (note, call log, etc.) |

**Timeline filter parameters (GET):**
```
?creator_id=<uuid>
&campaign_id=<uuid>
&entry_type=outreach_sent|reply_received|note|status_change|enrichment|campaign_added
&from=2026-01-01T00:00:00Z
&to=2026-07-05T23:59:59Z
&cursor=<cursor>
&limit=50
```

**Timeline entry types** (read-only by default; `POST` creates `note`, `call_log`, `custom` types only):

| Type | Created by |
|---|---|
| `enrichment_triggered` | M5 |
| `enrichment_completed` | M5 |
| `outreach_sent` | M9 |
| `reply_received` | M9 |
| `campaign_added` | M8 |
| `campaign_stage_changed` | M8 |
| `status_changed` | User action |
| `note` | User (via POST) |
| `call_log` | User (via POST) |
| `consent_granted` | M9 |
| `consent_revoked` | M9 |

---

### I7. M8 — Campaigns

#### Campaign CRUD

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/campaigns` | viewer+ | List workspace campaigns |
| `POST` | `/api/v1/campaigns` | member+ | Create campaign |
| `GET` | `/api/v1/campaigns/{campaign_id}` | viewer+ | Campaign detail with pipeline summary |
| `PATCH` | `/api/v1/campaigns/{campaign_id}` | member+ | Update campaign (name, dates, budget, status) |
| `DELETE` | `/api/v1/campaigns/{campaign_id}` | admin+ | Soft-delete campaign |

#### Campaign Creators (Pipeline)

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/campaigns/{campaign_id}/creators` | viewer+ | Paginated creator list with pipeline stage |
| `POST` | `/api/v1/campaigns/{campaign_id}/creators` | member+ | Add creator(s) to campaign (batch: up to 50) |
| `PATCH` | `/api/v1/campaigns/{campaign_id}/creators/{creator_id}` | member+ | Update pipeline stage, notes, deal terms |
| `DELETE` | `/api/v1/campaigns/{campaign_id}/creators/{creator_id}` | member+ | Remove creator from campaign |

**Campaign pipeline stages** (workspace-configurable; defaults provided):
`prospect` → `shortlisted` → `contacted` → `negotiating` → `confirmed` → `live` → `completed` | `rejected`

**Outcome recording (S1 manual):**
```json
PATCH /api/v1/campaigns/{id}/creators/{creator_id}
{
  "stage": "completed",
  "outcome": {
    "agreed_rate_pkr": 150000,
    "deliverables_completed": 3,
    "actual_reach": 45000,
    "actual_engagement_rate": 0.034,
    "notes": "Delivered on time; strong audience response"
  }
}
```

---

### I8. M9 — Outreach (Email + WhatsApp)

All outreach endpoints are credit-consuming and enforce consent checking. The consent TOCTOU fix (PATCH-006) is implemented as middleware: the opt-out queue is prioritised over the sequence execution queue, and the adapter call is preceded by a final consent version read.

#### Sequences

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/sequences` | viewer+ | List workspace sequences |
| `POST` | `/api/v1/sequences` | member+ | Create sequence (define steps, templates, schedule) |
| `GET` | `/api/v1/sequences/{sequence_id}` | viewer+ | Sequence detail with step definitions |
| `PATCH` | `/api/v1/sequences/{sequence_id}` | member+ | Update sequence (draft state only) |
| `DELETE` | `/api/v1/sequences/{sequence_id}` | admin+ | Soft-delete sequence |
| `POST` | `/api/v1/sequences/{sequence_id}/activate` | member+ | Activate sequence (validates all steps; locks for editing) |
| `POST` | `/api/v1/sequences/{sequence_id}/pause` | member+ | Pause sequence (halts pending sends) |
| `POST` | `/api/v1/sequences/{sequence_id}/enroll` | member+ | Enroll creator(s) in sequence (batch: up to 100) |
| `GET` | `/api/v1/sequences/{sequence_id}/enrollments` | viewer+ | List enrollments with status |
| `DELETE` | `/api/v1/sequences/{sequence_id}/enrollments/{enrollment_id}` | member+ | Unenroll creator (cancels pending steps) |

**Step definition (in sequence body):**
```json
{
  "steps": [
    {
      "step_number": 1,
      "channel": "email",
      "delay_days": 0,
      "send_window": { "from": "09:00", "to": "17:00", "timezone": "Asia/Karachi" },
      "exclude_jumu_ah": true,
      "template_id": "tpl_01JXXXXXXX"
    },
    {
      "step_number": 2,
      "channel": "email",
      "delay_days": 3,
      "condition": "no_reply_to_step_1",
      "template_id": "tpl_01JXXXXXXX"
    }
  ]
}
```

**Jumu'ah exclusion:** When `exclude_jumu_ah: true`, the backend shifts sends scheduled between 12:00–14:00 PKT on Fridays to 14:00 PKT. This is enforced by the sequence scheduler, not the API layer.

#### Direct Messaging

| Method | Path | Role | Description |
|---|---|---|---|
| `POST` | `/api/v1/messages/send` | member+ | Send a single direct message (email or WhatsApp) |
| `GET` | `/api/v1/messages/{message_id}` | viewer+ | Message detail with delivery status |

**Consent Management**

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/creators/{creator_id}/consent` | viewer+ | Current consent state for this creator in this workspace |
| `POST` | `/api/v1/creators/{creator_id}/consent` | member+ | Record consent grant with source and evidence |
| `DELETE` | `/api/v1/creators/{creator_id}/consent` | member+ | Record opt-out (immediately blocks outreach) |

**Consent opt-out** takes effect synchronously at the API layer (consent_state record updated; opt-out event emitted to priority queue). Any in-flight sequence step for this creator will perform the last-gate check (PATCH-006) and abort the send if the opt-out version has advanced.

#### Mailbox Connection Status

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/outreach/mailbox-status` | viewer+ | Connected mailboxes and their OAuth health status |
| `DELETE` | `/api/v1/outreach/mailboxes/{mailbox_id}` | owner | Revoke mailbox OAuth access |

---

### I9. M10 — Billing & Entitlements

#### Subscription & Entitlements

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/billing/subscription` | viewer+ | Current subscription state from Paddle (via entitlement cache) |
| `GET` | `/api/v1/billing/entitlements` | viewer+ | Full entitlement snapshot: tier, feature flags, limits |
| `POST` | `/api/v1/billing/portal` | owner | Generate Paddle billing portal session URL (redirect to Paddle) |

**Subscription state values** (derived from Paddle webhook state machine):
`trialing` | `active` | `past_due` | `read_only_grace` | `suspended` | `cancelled`

#### Credits

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/credits/balance` | viewer+ | Current credit balance: allowance, top-up, reserved, usable |
| `GET` | `/api/v1/credits/ledger` | owner | Paginated credit ledger (cursor-based; append-only view) |
| `GET` | `/api/v1/credits/transactions/{entry_id}` | owner | Single ledger entry detail |

**Balance response:**
```json
{
  "data": {
    "allowance_balance": 350.00,
    "topup_balance": 50.00,
    "total_balance": 400.00,
    "reserved_balance": 12.50,
    "usable_balance": 387.50,
    "allowance_expiry_at": "2026-08-05T00:00:00Z",
    "currency": "credits"
  }
}
```

**Note:** Credit reserve/commit operations are internal API calls between modules (M10 is called by M4, M6, M9 internally). They are not exposed as client-facing endpoints. The `POST /credits/reserve` internal route is an intra-monolith call, not an HTTP API endpoint.

---

### I10. M11 — Analytics Projections

Analytics endpoints serve from pre-computed projection tables (not live query). Projections are updated asynchronously by M11 workers.

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/analytics/overview` | viewer+ | Workspace overview: creator count, campaign count, outreach funnel, credit spend |
| `GET` | `/api/v1/analytics/campaigns/{campaign_id}` | viewer+ | Campaign-specific metrics: pipeline conversion, ROI, engagement outcomes |
| `GET` | `/api/v1/analytics/outreach` | viewer+ | Outreach funnel: sent/opened/replied/converted rates per sequence |
| `GET` | `/api/v1/analytics/credits` | owner | Credit consumption breakdown by category (enrichment, discovery, outreach) |

**Date range parameters:**
```
?from=2026-06-01&to=2026-07-05&granularity=day|week|month
```

---

### I11. M12 — Admin & Platform Ops

Admin endpoints are protected by the staff identity plane (ADR-011). All admin actions are audit-logged.

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/workspaces` | staff | List all workspaces with subscription state |
| `GET` | `/api/v1/admin/workspaces/{workspace_id}` | staff | Workspace admin view: members, billing, usage |
| `POST` | `/api/v1/admin/workspaces/{workspace_id}/suspend` | staff | Manually suspend workspace |
| `POST` | `/api/v1/admin/workspaces/{workspace_id}/reinstate` | staff | Reinstate suspended workspace |
| `GET` | `/api/v1/admin/creators/{creator_id}` | staff | GCP creator admin view (full attributes, all workspaces linked) |
| `POST` | `/api/v1/admin/creators/{creator_id}/gdpr-erase` | staff | Trigger GDPR erasure (PII nullification per ADR-025) |
| `GET` | `/api/v1/admin/audit-log` | staff | Platform-wide audit log (paginated; filterable by actor, event_type, workspace) |
| `GET` | `/api/v1/admin/queue-health` | staff | Queue health: DLQ depths, active workers, in-flight jobs |
| `POST` | `/api/v1/admin/creators/{creator_id}/merge` | staff | Manually trigger creator identity merge (requires merge_status='candidate') |

**GDPR Erasure flow** (ADR-025):
`POST /admin/creators/{id}/gdpr-erase` → emits `creator.gdpr_erase_requested` event → M5 worker nullifies all PII fields in GCP → emits `creator.gdpr_erased` event → WP records updated with `[Removed]` labels → raw payload archive deletion scheduled (30-day window)

---

### I12. M13 — Notifications

| Method | Path | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | viewer+ | List notifications for current user in current workspace |
| `PATCH` | `/api/v1/notifications/{notification_id}/read` | viewer+ | Mark single notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | viewer+ | Mark all notifications as read |
| `GET` | `/api/v1/notifications/preferences` | viewer+ | Get notification preferences |
| `PATCH` | `/api/v1/notifications/preferences` | viewer+ | Update notification preferences |

---

## Part J — Job Progress Polling Contract (ADR-021)

ADR-021 mandates polling v1 for all async job progress. The push upgrade trigger is: SPA polling interval degradation observed in telemetry (p95 poll cycle > 30s indicates WebSocket upgrade is warranted).

### J1. Polling Protocol

1. Client receives `202 Accepted` with `job_id` and `poll_url`
2. Client waits 3 seconds, then begins polling `GET /api/v1/discovery/jobs/{job_id}`
3. While `status == "running"`: poll every 2–5 seconds (client-side exponential backoff with max 10s interval)
4. When `status` reaches terminal state (`completed`, `partial`, `failed`, `cancelled`): stop polling
5. Fetch results from `GET /api/v1/discovery/jobs/{job_id}/results` (paginated)

### J2. Progressive Results

Results become available before job completion. The SPA should fetch from `GET /results` on each poll cycle to render progressively as candidates are scored:

```
Poll 1: status=running, candidates_scored=5  → GET /results?limit=25 → render 5 rows
Poll 2: status=running, candidates_scored=18 → GET /results?cursor=... → render 13 more
Poll 3: status=completed, candidates_scored=31 → GET /results?cursor=... → render 13 more
```

### J3. Job Expiry

Job records and results are retained for 72 hours after completion. After 72 hours, `GET /jobs/{id}` returns `404 RESOURCE_NOT_FOUND`. The SPA must save desired results to a list before job expiry.

---

## Part K — Webhook Reception Contracts

Inbound webhooks from third-party services are received at `/webhooks/*`. These endpoints do not require user authentication (they use payload signature verification instead).

### K1. Paddle Webhooks (`POST /webhooks/paddle`)

**Security:** Paddle signature verification using per-source HMAC secret (ADR-022, R-SEC-007). Signature in `Paddle-Signature` header. Any request with invalid or missing signature returns `401`.

**Processed event types:**
| Paddle Event | MUSHIN Action |
|---|---|
| `subscription.created` | Upsert entitlement; emit `entitlement.updated` to outbox |
| `subscription.updated` | Update tier/limits; emit `entitlement.updated` |
| `subscription.cancelled` | Mark cancelled; begin grace period |
| `subscription.past_due` | Transition to past_due state |
| `transaction.completed` | Create credit ledger entry (top-up) |
| `transaction.payment_failed` | Increment failed_payment_count; trigger dunning |

**Idempotency:** Paddle webhook handler uses event_id as idempotency key. Duplicate deliveries are silently acknowledged (200 OK) without re-processing.

**State machine:** Entitlement state transitions are validated against the allowed state machine before application. Invalid transitions are rejected and logged to `platform.outbox` for manual review.

### K2. Gmail Push Notifications (`POST /webhooks/gmail`)

**Security:** Google-signed JWT in `Authorization: Bearer <google-jwt>`. Verified against Google's JWKS. Workspace mailbox association verified from `historyId` to `mailbox_id` mapping.

**Processed events:**
- New message in watched mailbox → M9 reply-detection worker triggered
- Token expiry notification → OAuth re-auth flow prompted to workspace user

**Privacy constraint (ADR-010):** MUSHIN never performs full mailbox sync. Reply detection operates only on thread IDs matching known outreach sends.

### K3. Outlook Push Notifications (`POST /webhooks/outlook`)

**Security:** Microsoft subscription validation token during setup; thereafter, `ClientState` secret verification per Microsoft notification spec.

Same reply-detection behaviour as Gmail.

---

## Part L — Security Envelope

### L1. Injection Prevention

- All query parameters and path segments validated against allow-lists before use in database queries
- No dynamic SQL construction from user input; all queries use parameterised statements (ORM/query builder enforced)
- Scraped content from Apify actors is treated as untrusted data-only at all API boundaries (R-SEC-006)
- Prompt injection defence: Creator-provided content reaching LLM prompts is framed as structured data, not instructions

### L2. Sensitive Data Handling

- No card data or PII flows through MUSHIN API (Paddle MoR handles all — NFR-S03)
- OAuth tokens stored encrypted at rest; never returned in API responses
- Creator contact records (emails, phone numbers) are workspace-revealed only (explicit reveal action; credit-consuming; logged to timeline)
- GDPR-erased creator records return `404 GDPR_ERASED` not field-nullified data

### L3. Tenancy Isolation (NFR-S01)

Every data-layer query is parameterised with `workspace_id` from TenancyContext. No endpoint accepts a `workspace_id` in the request body that can override the TenancyContext. The `workspace_id` is always sourced from the resolved TenancyContext, not from client-provided data.

### L4. Audit Logging

All admin operations (staff plane) are written to `platform.admin_action_log` synchronously before the action executes (audit-first invariant from ADR-011). All credit-consuming operations are written to the credit ledger atomically (ADR-026). All consent changes are written to `wp.consent_state` and emitted to the interaction timeline atomically.

---

## Part M — Adapter-Touching Endpoint Notes

Endpoints that indirectly trigger adapter calls (via workers) are subject to adapter circuit breaker states (ADR-022):

| Endpoint | Adapter(s) Involved | Degraded Behaviour |
|---|---|---|
| `POST /discovery/jobs` | Serper, Apify (`apify/instagram-scraper`, `clockworks/tiktok-scraper`, `apify/instagram-hashtag-scraper`) | Brain-1-only degraded posture; job returns `partial` status |
| `POST /creators/{id}/enrich` | Apify actors (platform-dependent), YouTube Data API v3, Instagram/YouTube Comment Scrapers | Returns `503 ADAPTER_DEGRADED` with circuit-breaker state; credits not reserved |
| `POST /messages/send` | Gmail/Outlook OAuth adapter | Returns `503 ADAPTER_DEGRADED`; message not sent; credits not consumed |
| `POST /webhooks/paddle` | Paddle API read (fetch-to-heal reconciliation) | Logs inconsistency; queues reconciliation retry |

**Sandbox parity (ADR-022 obligation 7):** All adapter-touching endpoints behave identically in sandbox mode (test environment) using Paddle Sandbox, Gmail test accounts, and Apify actor test datasets. No mock-only paths.

---

## Part N — API Evolution & Deprecation Policy

### N1. Backward Compatibility Commitment

Within `/api/v1/`, MUSHIN commits to additive-only evolution. The SPA is the sole consumer, so breaking changes are coordinated deployments, not versioned API contracts. However, the additive-only rule is enforced to facilitate future public API readiness (S3 trigger from ADR-023).

### N2. Deprecation Process

1. Field/endpoint marked `deprecated` in spec with target removal date (min. 90 days from announcement)
2. `X-Deprecated-Fields` response header added
3. Deprecation entry added to Change-Control-Log
4. SPA migrated before removal date
5. Version increment (`/api/v2/`) created if breaking change cannot be avoided

### N3. Public API Readiness (S3 Trigger)

When ≥3 enterprise prospects request API access (ADR-023 trigger), the following additional work is required before public API launch:
- OpenAPI 3.1 spec generated from this document (Doc 26)
- API key management system added (Paddle-backed or custom)
- Per-key rate limiting layer added
- Webhook outbound delivery system designed
- Developer portal and documentation site

---

## Dependency Mapping

| Dependency | Direction | Nature |
|---|---|---|
| Doc 14 (System Architecture) | Inbound | Module boundary definitions, TenancyContext model |
| Doc 15 (AI Search Architecture) | Inbound | Query translation, routing ladder, Brain-1/Brain-2 contract |
| Doc 16 (Event Architecture) | Inbound | Outbox pattern, async job protocol |
| Doc 17 (Integration Contracts) | Inbound | Adapter contract, rate limit constraints, webhook security |
| Doc 18 (Domain Model) | Inbound | Entity definitions, PATCH-006 consent TOCTOU |
| Doc 19 (Physical Schema) | Inbound | Table/column names used in response schema descriptions |
| Doc 21 (Security & Compliance) | Outbound | Security envelope details handed off to Doc 21 |
| Doc 22 (Infrastructure) | Outbound | BaaS JWT provider selection, managed edge/WAF selection |
| Doc 24 (Testing Strategy) | Outbound | API contract testing, idempotency test class requirements |
| Doc 26 (CI/CD) | Outbound | OpenAPI spec generation from this document |

---

## Assumptions & Constraints

| ID | Assumption | Confidence | Impact if False |
|---|---|---|---|
| A-021 | Gmail/Outlook APIs permit sequence automation within ToS at our scale | Med-High | Outreach scope reduction |
| A-031 | Paddle webhook payloads + API reads suffice for full state machine | Med-High | State machine rework |
| A-060 | Polling-v1 acceptable UX for discovery jobs (with progressive results) | Med-High | ADR-021 trigger fires early → WebSocket upgrade |
| A-065 | Mailbox polling intervals achieve reply-detection latency <15 min worst case | Med-High | Push upgrade for reply detection pulled forward |

---

## Risk Register (API-Specific)

| ID | Risk | L | I | Mitigation |
|---|---|---|---|---|
| R-TEC-011 | Non-idempotent consumer → duplicate side effects (double sends, double credits) | M | H | Idempotency test class mandatory per consumer; idempotency key enforcement at API layer |
| R-ARC-001 | TOCTOU race: consent checked at eligibility; opt-out races with adapter call | L-M | Critical | PATCH-006: priority queue + last-gate consent version check at M9 |
| R-SEC-007 | Webhook secret/credential leak enables forged money events | L | Critical | Per-source secrets; signature verification; secret-store isolation; rotation |
| R-FIN-007 | Webhook/entitlement drift grants unpaid access | M | H | Idempotency + fetch-to-heal + daily reconciliation |
| R-SEC-006 | Prompt injection via scraped content | M | H | Payload treated as data-only; grounding validator at M6 |

---

## Alternatives Considered

### Alt-1: GraphQL instead of REST

**Rejected:** GraphQL provides flexible client-driven queries, reducing over-fetching. However, it adds complexity (schema introspection, N+1 query risks), complicates rate limiting at the field level, and introduces an additional layer between the API and the physical schema. Given that MUSHIN has exactly one client (the SPA) and no external consumers at S1/S2, the GraphQL flexibility value does not justify the cost. REST with well-defined response shapes for known use cases is sufficient. Revisit at S3 if developer API surface requires it.

### Alt-2: Per-module versioned APIs (e.g., `/billing/v1/`, `/search/v2/`)

**Rejected:** Per-module versioning creates a fragmented API surface that is difficult to reason about holistically. Uniform `/api/v1/` prefix with additive evolution is simpler to maintain, document, and test. Module-level breaking changes will be handled as coordinated deployments rather than independent versioning.

### Alt-3: Server-Sent Events (SSE) instead of polling for job progress

**Rejected for S1 (ADR-021):** SSE provides a cleaner UX for progressive updates. However, SSE connections are long-lived and require infrastructure support (connection limits, proxy buffering). For S1 with tens/hundreds of concurrent users, polling is simpler to implement and operate. ADR-021 defines the push upgrade trigger: if polling degradation is observed in telemetry (p95 > 30s), SSE or WebSocket upgrade is authorised.

---

## Gap Analysis

| Gap | Owner | Priority |
|---|---|---|
| OpenAPI 3.1 machine-readable spec not yet generated | Doc 26 (CI/CD) | Medium — required before first external API access |
| Contact reveal endpoint not specified (M2 exposes contact_record) | This doc / Doc 21 | Medium — credit-consuming; needs privacy gate spec |
| WhatsApp template management endpoints (S2) | Not yet designed | Low — S2 feature |
| Webhook outbound delivery (customer webhooks) | S3 scope | Low |
| Refresh token rotation endpoint (BaaS-handled, but MUSHIN may need hook) | Doc 22 | Low |

---

## Cross-References & Decision Traceability

| Decision | ADR | Implemented In |
|---|---|---|
| No public API at S1/S2 | ADR-023 | Part A1, Part N3 |
| Polling v1 for job progress | ADR-021 | Part J, I4 |
| User-owned mailbox sends | ADR-010 | I8, K2, K3 |
| WhatsApp via BSPs only | ADR-009 | I8 |
| Append-only credit ledger | ADR-012 | I9 |
| SELECT FOR UPDATE reserve-commit | ADR-026 | I9, D3 |
| GDPR PII nullification tombstone | ADR-025 | I11, D4 |
| Synchronous index projection for new creators | ADR-027 | I4 (dedup) |
| Prompt version score scoping | ADR-028 | I5 |
| Consent TOCTOU fix | PATCH-006 | I8 |
| Intra-job URL dedup | PATCH-007 | J (transparent) |
| Transactional outbox | ADR-020 | K1 (webhook idempotency) |
| Separate staff identity plane | ADR-011 | B2, I11, L4 |
| Uniform Adapter Contract | ADR-022 | Part M |

---

## Open Questions

| OQ | Question | Owner | Due |
|---|---|---|---|
| OQ-20-01 | BaaS provider selection (affects JWT claim structure and JWKS endpoint format) | Doc 22 | Before S1 dev start |
| OQ-20-02 | Contact reveal: should it be a separate `POST /creators/{id}/reveal-contact` or a query param on the creator GET? | Product | Sprint 1 |
| OQ-20-03 | Creator merge API surface: should admin-triggered merges also be exposable to workspace owners for self-service? | Doc 29 (Roles) | Sprint 2 |
| OQ-20-04 | Analytics projection staleness: what is the acceptable lag for M11 projections? Does the API need to surface a `data_as_of` timestamp? | Doc 23 (Observability) | Sprint 2 |

---

## Future Revision Triggers

- BaaS provider selected (OQ-20-01) → update B1 with actual JWT claim names
- ADR-021 push upgrade trigger fires → add SSE/WebSocket endpoint spec
- ADR-023 public API trigger fires (≥3 enterprise prospects) → add API key management and public spec
- WhatsApp S2 launch → add template management and WABA provisioning endpoints
- Contact reveal endpoint design finalised (OQ-20-02) → add to M2 section
- Any new module added → corresponding API surface section required in this document

---

## Review Checklist

- [x] All modules M1–M13 have explicit API surface documentation
- [x] ADR-023 (no public API) enforced in Part A1 and N3
- [x] ADR-021 (polling v1) fully specified in Part J
- [x] ADR-026 (reserve-commit) reflected in I9 and D3 error catalogue
- [x] ADR-025 (GDPR erasure) reflected in I11 and D4 error catalogue
- [x] PATCH-006 (consent TOCTOU) enforced at I8 outreach endpoints
- [x] PATCH-007 (intra-job dedup) noted as transparent in Part J
- [x] NFR-P01 (search p95 < 1s) referenced in I3 success criteria
- [x] NFR-S01 (tenancy isolation) enforced in B3, L3
- [x] NFR-C01 (COGS telemetry) referenced at all credit-consuming endpoints
- [x] Webhook signature verification specified for all three inbound channels (K1, K2, K3)
- [x] Jumu'ah exclusion window documented in I8
- [x] Apify actor stack reflected at adapter-touching endpoint notes (Part M)
- [x] YouTube Data API v3 (not Apify) reflected at I2 enrichment endpoint
- [x] Rate limiting at three layers (Part E)
- [x] Error catalogue covers all expected failure modes (Part D)
- [x] Open questions documented with owners (OQ-20-01 through OQ-20-04)

---

*[[Home]] | [[ADR-Log]] | [[Risk-Register]] | [[Doc-17-Integration-Contracts]] | [[Doc-19-Physical-Schema]]*

---

**[AWAITING APPROVAL]**



---

<a name="doc-021"></a>
# DOC-021 — Security, Privacy and Compliance Architecture

# Document 21: Security, Privacy & Compliance Architecture

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 18 (Domain Model), Doc 19 (Physical Schema), Doc 20 (API Design)
**Governing ADRs:** ADR-011, ADR-022, ADR-023, ADR-024, ADR-025, ADR-026, ADR-028
**Applied Patches:** PATCH-002, PATCH-006, PATCH-010

---

## 1. Security Architecture Overview

### 1.1 Threat Model — Two Brains Architecture

MUSHIN's attack surface divides along its two-brain paradigm. Each brain carries a distinct threat profile:

| Surface | Brain | Primary Threats | Severity |
|---|---|---|---|
| Database Search (Brain 1) | Read path | Cross-tenant data leakage, IDOR on creator/workspace records, query enumeration | Critical |
| Live Discovery (Brain 2) | Write path | Prompt injection via scraped payloads (R-SEC-006), poisoned ingestion, actor supply-chain compromise | High |
| Billing plane | — | Forged Paddle webhooks (R-SEC-007), ledger race exploitation, credit inflation | Critical |
| Outreach plane | — | OAuth token theft (Gmail/Outlook), WABA credential misuse, consent bypass (R-ARC-001) | Critical |
| Staff plane | — | Support/Admin privilege escalation, unaudited impersonation | High |

**Core threat model insight:** Brain 2 ingests *adversary-controllable content* (public social media posts, bios, comments). Every byte scraped via Apify must be treated as hostile input. This drives the write-path intelligence / read-path determinism split (ADR-018): the read path never executes intelligence on raw content, so a poisoned payload cannot affect serving-time behavior — only ingestion-time scoring, which is sandboxed (§3.4).

### 1.2 Security Boundaries

Three planes, matching the schema separation from Doc 19:

- **GCP (Global Creator Plane):** Provider-sourced enrichment, cached globally (ADR-008). Contains creator PII (names, emails, handles). No workspace data ever writes here.
- **WP (Workspace Plane):** Tenant-scoped CRM data, notes, timelines, campaigns. Hard tenancy boundary.
- **Platform Plane:** Billing, staff identity, prompt registry, vocabularies.

The only sanctioned crossing is `workspace_creator_link` (ADR-024, PATCH-001) — a soft FK bridge. **Invariant:** no query may join GCP and WP tables except through the bridge entity, and the bridge carries the `workspace_id` predicate. This is enforced at the repository layer (§2.2), not left to developer discipline.

### 1.3 Zero-Trust Principles

1. **No implicit network trust.** Managed edge (ADR-023) terminates TLS; all internal service-to-service calls carry signed identity.
2. **Every request re-derives tenancy.** `workspace_id` is extracted from the authenticated session, never from request bodies or query params.
3. **Scraped content is data, never instructions** (§3.4).
4. **Staff access is deny-by-default, audit-first** (§2.4).
5. **Secrets are injected, never stored in code or env files committed to VCS** (§6.2).

---

## 2. Authentication & Authorization

### 2.1 Customer Authentication Flow

- **Primary:** Email/password + OAuth (Google) sign-in via managed auth provider (integration-first, ADR-002).
- **Session model:** Short-lived JWT access token (15 min) + rotating refresh token (30 days, httpOnly Secure SameSite=Lax cookie). Refresh rotation with reuse detection: a replayed refresh token revokes the entire token family.
- **JWT claims:** `sub` (user_id), `wsp` (active workspace_id), `role`, `iat/exp`, `jti`. No PII in claims.
- **MFA:** Optional TOTP for customers at S1; mandatory for workspace Owner role at S2.

### 2.2 Workspace Tenancy Enforcement (NFR-S01)

Tenancy is enforced at **three redundant layers** — failure of any single layer must not leak data:

1. **Middleware layer:** Resolves `workspace_id` from JWT; rejects any request where path/body workspace references disagree with the session workspace (403 `AUTHZ_WORKSPACE_MISMATCH`, per Doc 20 error catalogue).
2. **Repository layer:** All WP-schema queries pass through a tenancy-scoped repository base class that injects `WHERE workspace_id = :ctx_workspace_id` unconditionally. Raw query escape hatches require an ARB-reviewed `@TenancyExempt` annotation with justification (used only by Platform plane jobs).
3. **Database layer:** PostgreSQL Row-Level Security (RLS) policies on all `wp.*` tables keyed on `current_setting('app.workspace_id')`, set per-transaction. Defense-in-depth; the app remains correct even without RLS, but RLS catches repository-layer bugs.

**Testing hook (feeds Doc 24):** Tenancy isolation suite must assert cross-workspace 404/403 for every M1-M13 endpoint enumerated in Doc 20.

### 2.3 RBAC Matrix (Customer Roles)

| Capability | Owner | Admin | Member | Viewer |
|---|---|---|---|---|
| Billing / credits purchase | ✅ | ❌ | ❌ | ❌ |
| Workspace settings, seat mgmt | ✅ | ✅ | ❌ | ❌ |
| Connect mailbox / WABA (ADR-009/010) | ✅ | ✅ | Own mailbox only | ❌ |
| Run discovery jobs (Brain 2, credit-spending) | ✅ | ✅ | ✅ | ❌ |
| Search / view creators (Brain 1) | ✅ | ✅ | ✅ | ✅ |
| CRM writes (notes, stages, timeline) | ✅ | ✅ | ✅ | ❌ |
| Outreach sends | ✅ | ✅ | ✅ | ❌ |
| GDPR data export request | ✅ | ✅ | ❌ | ❌ |

Credit-spending actions additionally pass through the reservation disposition contract (PATCH-005) — RBAC gates *initiation*; the ledger gates *settlement* (ADR-026).

### 2.4 Staff Identity Plane Separation (ADR-011)

- Staff accounts live in a **separate identity provider tenant** with a separate issuer. Customer JWTs can never satisfy staff endpoints and vice versa — verified by issuer + audience claims, not just role flags.
- **MFA mandatory** for all staff, hardware-key (WebAuthn) required for Admin role.
- **Audit-first invariant:** the audit record for a staff action is written *in the same transaction* as the action itself (transactional outbox pattern, ADR-020). If the audit write fails, the action fails. No staff mutation is possible without a corresponding immutable audit row.
- Support role: read-only, no impersonation, no billing visibility (full matrix deferred to Doc 29; this document establishes the enforcement mechanism).
- Impersonation (Admin only): time-boxed (60 min), banner-visible to the staff user, produces `impersonation_session` audit records, and is blocked from viewing decrypted OAuth tokens or sending outreach.

---

## 3. Data Protection & Privacy

### 3.1 Data Classification Schema

| Class | Examples | Storage Rules |
|---|---|---|
| **C1 — Sensitive PII** | OAuth tokens, WABA credentials, payment identifiers (Paddle-held) | Envelope-encrypted at column level; never logged; never in exports |
| **C2 — PII** | Creator names/emails/handles (GCP), user emails, contact info | Encrypted at rest (disk-level); tombstone-eligible (ADR-025); redacted in logs |
| **C3 — Tenant Business Data** | Notes, campaigns, timelines, credit ledger | Tenancy-scoped; encrypted at rest; retained per Doc 28 policy |
| **C4 — Derived Intelligence** | LLM scores, `enrichment_snapshot` rows | Non-PII by construction (scores + provenance triple per PATCH-010); survives erasure |
| **C5 — Public/Operational** | Niche vocab, prompt registry metadata, metrics | Standard controls |

### 3.2 Encryption Strategy

- **In transit:** TLS 1.2+ everywhere (edge, DB connections, queue, adapter calls). HSTS with preload on all app domains.
- **At rest:** Managed Postgres disk encryption (AES-256) as baseline for C2-C5.
- **Column-level (C1):** Envelope encryption — per-record data keys wrapped by a KMS-held master key. OAuth refresh tokens, BSP credentials, and webhook secrets use this path. Decryption occurs only in the worker process performing the adapter call (ADR-022), never in the web tier, never returned by any API.
- **Key rotation:** Master key annual rotation; data keys re-wrapped lazily on next write.

### 3.3 Right to Erasure — ADR-025 / PATCH-002

Two-tier flow, matching Doc 18/19:

- **Tier 1 (workspace-scoped):** Customer deletes a creator from their workspace → `workspace_creator_link` and WP-plane records soft-deleted; GCP record untouched (other tenants may legitimately hold it).
- **Tier 2 (GDPR erasure):** Verified data-subject request → **PII nullification tombstone**: all C2 fields on the GCP creator record are nulled and replaced with a tombstone marker (`erased_at`, `erasure_request_id`); the row *persists* to preserve referential integrity of soft FKs (ADR-024) and to prevent re-ingestion. A **re-ingestion blocklist** (hashed platform handles) stops Brain 2 from re-scraping the erased subject. `enrichment_snapshot` scores are retained only if fully de-identified; otherwise cascaded to nullification.
- **SLA:** 30 days (GDPR Art. 17); target 72 hours automated. Erasure is triggered via the Doc 20 GDPR endpoint and (for staff-initiated flows) requires Admin role with audit-first logging.
- **Propagation:** Erasure events flow through the transactional outbox (ADR-020) to purge search index projections (respecting ADR-027 synchronous projection paths) and analytics stores.

### 3.4 Prompt Injection Prevention (R-SEC-006)

The LLM scoring pipeline (Brain 2) treats scraped payloads as untrusted:

1. **Structural isolation:** Scraped content is passed as fenced, schema-bound *data fields* in the prompt (Prompt Registry, ADR-019), never concatenated into instruction sections.
2. **Payload validation gate (R-TEC-008):** Pre-LLM sanitization strips control characters, normalizes Unicode (homoglyph collapse), enforces field length caps, and rejects payloads failing schema validation.
3. **Output schema enforcement:** LLM responses must parse against the registered output schema; any deviation (extra fields, narrative text, instructions) → payload quarantined, job item marked `scoring_failed`, no ingestion.
4. **Grounding validator:** Post-scoring check that every cited evidence span exists in the source payload — a hijacked model emitting fabricated justification fails grounding and is discarded.
5. **Capability confinement:** The scoring worker has **no tool access, no network egress beyond the LLM provider, and no write access outside the ingestion staging tables**. A fully compromised prompt can, at worst, produce a bad score — which PATCH-010's `(prompt_version, model_version)` provenance makes traceable and bulk-invalidatable (ADR-028).

---

## 4. API Security

Building on Doc 20's contracts:

- **Rate limiting:** Three concentric layers enforced as specified — Layer 1 WAF/IP (edge), Layer 2 workspace/tier quotas, Layer 3 endpoint-specific limits (tightest on auth, discovery-job creation, and webhook endpoints). 429 responses carry `Retry-After`.
- **Input validation:** Schema-first validation at the middleware boundary for every endpoint; unknown fields rejected (not ignored) on write endpoints. The 35-code error catalogue's `VALIDATION_*` family applies.
- **SQL injection:** Parameterized queries exclusively; the tenancy repository layer (§2.2) forbids string-built SQL; `@TenancyExempt` reviews double as injection reviews.
- **XSS:** Strict CSP (`default-src 'self'`, no `unsafe-inline`); all user/scraped content rendered as text nodes, never HTML. Scraped bios/comments are the highest-risk XSS vector — they are C-class hostile input rendered in the workspace UI.
- **CSRF:** SameSite=Lax cookies + double-submit token on state-changing requests; idempotency keys (Doc 20 protocol) additionally blunt replay.
- **Webhook endpoints:** Signature verification *before* body parsing (§5); per-source secrets (R-SEC-007 mitigation); replay window enforcement via timestamp tolerance + `jti`/event-id dedup.
- **Future public API (post-ADR-023):** When opened at S3+, scoped API keys with per-key rate limits and workspace-bound audiences; design reserved, not built now.

---

## 5. Third-Party Integration Security

All adapters comply with the Uniform Adapter Contract (ADR-022); the security-relevant obligations are credential confinement, timeout/circuit behavior, and degraded-mode signaling.

| Integration | Auth Mechanism | Storage | Rotation |
|---|---|---|---|
| **Apify actors** | API token (server-side only) | KMS-wrapped, worker-plane only | 90-day rotation; per-environment tokens |
| **YouTube Data API v3** | API key + OAuth where needed | KMS-wrapped | Key rotation quarterly; quota alarms |
| **Paddle webhooks** | HMAC signature verification (per Doc 20) | Per-source secret, KMS-wrapped | Rotation with dual-secret overlap window |
| **Gmail** | OAuth 2.0, incremental scopes, `gmail.send` minimum | Refresh tokens C1 envelope-encrypted; never exposed via API | Revocation-aware; token health monitor |
| **Outlook** | OAuth 2.0 + webhook `ClientState` validation | Same C1 treatment | Same |
| **WhatsApp BSP (ADR-009)** | Per-workspace WABA credentials via official Meta BSP | C1 envelope-encrypted, workspace-scoped | BSP-managed + our re-wrap on rotation |
| **LLM provider** | API key | KMS-wrapped, scoring workers only | 90-day rotation, zero-downtime dual-key cutover |

**Apify-specific posture:** Actor outputs are untrusted (§3.4); actor *selection* is pinned to the finalized stack (`apify/instagram-scraper`, `clockworks/tiktok-scraper`, `apify/instagram-hashtag-scraper`, comment scrapers, web scraper) with version pinning where the platform allows — mitigating supply-chain drift (R-TEC-007 adjacency). Web Scraper email extraction outputs are validated (RFC 5322 syntax + disposable-domain filter) before entering GCP as C2 data.

**OAuth token invariants:** tokens decrypt only in the worker executing the send; the API surface exposes connection *status* only (`connected`, `expired`, `revoked`), never token material; user-initiated disconnect triggers provider-side revocation, not just local deletion.

---

## 6. Infrastructure Security

### 6.1 Managed Service Posture

Integration-first (ADR-002) means we inherit — and must verify — provider controls: SOC 2 Type II attestation required for the app platform, managed Postgres, queue, and KMS providers. Sub-processor list is maintained for DPA purposes (§7.3). Full provider selection lands in Doc 22; this document sets the *requirements*: encryption at rest, VPC/private networking for DB, audit log export capability.

### 6.2 Secret Management

- Central secret manager (KMS-integrated); secrets injected at deploy/runtime, never baked into images or `.env` files in VCS.
- Per-environment isolation: dev secrets can never authenticate against prod providers.
- Secret access is itself audited; CI has read access only to the secrets its pipeline stage requires.
- Detection: pre-commit + CI secret scanning; a leaked-secret runbook (Doc 27) mandates rotation within 4 hours of detection.

### 6.3 Network Security

- Managed WAF + DDoS at the edge (ADR-023's managed edge); Layer 1 rate limiting lives here.
- Database accepts connections only from app/worker planes (private networking); no public DB endpoint.
- Queue access restricted to worker fleet identity (ADR-017).

### 6.4 Logging & Audit Trail

- Structured JSON logs with `request_id`, `workspace_id`, `actor_id`; **C1 never logged, C2 redacted by a centralized redaction middleware** (fail-closed: unknown fields in log payloads are dropped).
- Immutable audit domains: staff actions (§2.4), credit ledger events (append-only per ADR-012), consent changes (PATCH-006's last-gate checks log both the check and its input version), erasure lifecycle, impersonation sessions.
- Retention: security audit logs 24 months; operational logs 30-90 days (finalized in Doc 23/28).

---

## 7. Compliance & Legal

*(Framework here; full legal drafting in Doc 28.)*

- **GDPR:** Lawful basis mapping — legitimate interest for public-data creator enrichment (Art. 6(1)(f), balancing test documented; interacts with A-050/R-LEG-006), contract for customer data. Rights supported: access, erasure (§3.3), portability (export endpoint), objection (blocklist doubles as objection registry).
- **CCPA/CPRA:** Creators as data subjects → "Do Not Sell/Share" honored via the same blocklist mechanism; service-provider terms flow into DPAs.
- **Pakistan PECA 2016:** Unauthorized-access provisions reinforce the public-data-only scraping posture; data localization is *not* currently mandated for our category (tracked as an assumption, §10).
- **ToS requirements:** acceptable-use (no harassment via outreach), scraping-derived-data disclaimers, credit terms (non-refundable ledger semantics per ADR-012), Paddle MoR pass-through terms.
- **Privacy Policy structure:** data categories (§3.1 mapped to plain language), sources (public platforms via processors), retention, sub-processors, rights channels — including a **creator-facing removal request channel** (feeds Tier 2 erasure).
- **DPA:** Offered to workspace customers (we are processor for their WP data, controller for GCP enrichment — dual-role documented).
- **Cookie policy:** Strictly-necessary + analytics tiers; consent banner for non-essential only.
- **FTC/disclosure:** MUSHIN facilitates outreach, not ad publication; ToS obliges brand customers to comply with disclosure rules (FTC, and platform-native branded-content tools); outreach templates include optional disclosure-reminder snippet.

---

## 8. Security Testing Requirements

*(Detailed process in Doc 24; scope defined here.)*

- **Penetration testing:** Annual external pentest + pre-GA test. In scope: tenancy isolation (NFR-S01), auth flows, webhook forgery, staff-plane separation, prompt injection via seeded scraped profiles. Out of scope: third-party provider internals.
- **Vulnerability scanning:** Dependency scanning on every CI run; container/image scanning per deploy; weekly DAST against staging.
- **Security code review checklist (gate for merge):** tenancy predicate present or `@TenancyExempt` justified; no raw SQL; C1/C2 fields not logged; new endpoints registered in rate-limit config; webhook handlers verify-before-parse; adapter changes uphold ADR-022 obligations; LLM prompt changes go through Prompt Registry eval gates (ADR-019) including injection eval set.
- **Idempotency & race testing:** ledger concurrency (ADR-026/PATCH-004) and consent TOCTOU (PATCH-006) get dedicated concurrent-load test suites.
- **Incident response outline:** Sev1 (data breach/tenancy leak) → 15-min acknowledgment, containment, GDPR 72-hour notification assessment; Sev2 (credential leak, R-SEC-007) → rotate within 4 hours; full runbooks in Doc 27.

---

## 9. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-SEC-008 (new)** | Security | RLS misconfiguration silently disabled on new WP table | L-M | Critical | Migration linter requires RLS policy in same migration as table creation; tenancy test suite |
| **R-SEC-009 (new)** | Security | Staff impersonation abuse | L | H | Time-boxed sessions, audit-first invariant, token/outreach blackout during impersonation |
| **R-SEC-010 (new)** | Security | XSS via scraped creator content rendered in UI | M | H | Strict CSP, text-node rendering, payload sanitization gate |
| **R-SEC-011 (new)** | Security | KMS/master key compromise | L | Critical | Envelope encryption limits blast radius; rotation; access audit |
| **R-LEG-007 (new)** | Legal | Dual controller/processor role misclassified in DPAs | M | M | Explicit dual-role DPA language; legal review (Doc 28) |
| R-SEC-006 | Security | Prompt injection via scraped content | M | H | **Strengthened:** §3.4 five-layer defense; residual risk Low |
| R-SEC-007 | Security | Webhook secret leak | L | Critical | **Strengthened:** dual-secret rotation, verify-before-parse, replay dedup |

**Risk acceptance criteria:** Residual Critical-impact risks require CEO+ARB sign-off; High requires ARB; Medium accepted by engineering lead with register entry.

---

## 10. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-061 | Legitimate-interest basis holds for public-data creator enrichment under GDPR | Low-Med (couples to A-050; legal memo required) |
| A-062 | PECA 2016 imposes no data-localization requirement on our category at S1/S2 | Med (verify with PK counsel) |
| A-063 | Managed providers (app platform, Postgres, queue, KMS) hold current SOC 2 Type II | High (verify pre-contract) |
| A-064 | Postgres RLS overhead is acceptable within NFR-P01 latency budgets | Med-High (benchmark in Doc 24 perf testing) |

**Dependencies:** Doc 22 (provider selection realizes §6 requirements), Doc 23 (audit log pipeline), Doc 24 (test suites specified in §8), Doc 27 (incident runbooks), Doc 28 (legal drafting of §7), Doc 29 (staff permission matrix on §2.4 mechanisms).

**Open questions for legal/security review:**
1. GDPR balancing-test memo for scraped-data legitimate interest (blocks A-061).
2. Whether Tier 2 erasure blocklist hashes themselves constitute PII (pseudonymization analysis).
3. BSP contractual liability allocation for WABA credential incidents.
4. Pentest vendor selection and timing relative to GA.

---

**End of Document 21.**

[AWAITING APPROVAL]


---

<a name="doc-022"></a>
# DOC-022 — Infrastructure and Deployment Strategy

# Document 22: Infrastructure & Deployment Strategy

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 17 (Architecture), Doc 19 (Physical Schema), Doc 20 (API Design), Doc 21 (Security)
**Governing ADRs:** ADR-002, ADR-017, ADR-020, ADR-021, ADR-023, ADR-026, ADR-027
**Applied Patches:** PATCH-003, PATCH-005, PATCH-009, PATCH-010

---

## 1. Cloud Provider & Service Selection

Integration-first (ADR-002) governs every selection below: we orchestrate managed services and own only the modular monolith + worker fleet (ADR-017). Each selection carries hard requirements inherited from prior documents, listed as **Selection Gates** — any provider failing a gate is disqualified regardless of other merits.

### 1.1 Application Hosting — Vercel

- **Hosts:** Next.js SPA + API routes (the modular monolith web tier).
- **Selection gates:** managed edge with WAF-class controls (ADR-023), preview deployments per branch, SOC 2 Type II (A-063).
- **Constraint acknowledged:** Vercel serverless functions are unsuitable for long-running Brain 2 pipeline work (execution time limits, no persistent workers). Therefore the **worker fleet deploys separately** (§1.6) — Vercel hosts only the request/response plane. This split is a first-class architectural boundary, not an afterthought: web tier scales on request volume, workers scale on queue depth.

### 1.2 Managed PostgreSQL — Neon (primary candidate) / Supabase (fallback)

- **Selection gates (non-negotiable):**
  - Full PostgreSQL RLS support — required by Doc 21 §2.2 tenancy layer 3.
  - Native `RANGE` partitioning + ability to run partition pre-creation jobs — required by Doc 19 Timeline strategy (PATCH-003).
  - `SELECT FOR UPDATE` row locking with predictable behavior under connection pooling — required by ADR-026/PATCH-004. **This gate has a subtlety:** transaction-mode poolers (PgBouncer-style) are compatible with `SELECT FOR UPDATE` only when lock acquisition and settlement occur within a single transaction, which Doc 19's ledger design guarantees. Session-level advisory locks are therefore *banned* from the codebase — a linted rule.
  - Point-in-time recovery (PITR) — required by §8.
  - Private networking or IP allowlisting — required by Doc 21 §6.3.
- **Why Neon first:** branch-per-environment database copies accelerate staging/preview workflows with masked data (§2.2); scale-to-zero economics fit pre-revenue S1.
- **GENERATED ALWAYS AS STORED** columns (`usable_balance`, Doc 19) and Flyway-class migrations are standard Postgres — no provider risk.

### 1.3 Managed Queue — AWS SQS FIFO (primary) via thin adapter

- **Selection gates:** per-key ordering (FIFO `MessageGroupId` = ordering key, satisfying ADR-020 per-key ordering), at-least-once delivery, dead-letter queues, delayed delivery (for retry backoff), and **priority segregation** (PATCH-006 priority queue, PATCH-010 low-priority class).
- **Realization:** priority is implemented as **separate queues per class** (SQS has no intra-queue priority): `q-discovery-high`, `q-discovery-standard`, `q-rescore-low`, `q-outbox-relay`, `q-erasure`. Workers poll classes with weighted priority (high drained before standard; `q-rescore-low` consumed only by a capped worker allocation, §5.3).
- Queue access confined to worker-fleet IAM identity (Doc 21 §6.3). All queue interaction passes through the queue adapter (ADR-022 uniformity applies to infrastructure adapters as well as data providers).

### 1.4 Object Storage — Cloudflare R2

- **Purpose:** raw scraped payload archives (Doc 14) — the immutable evidence trail behind `enrichment_snapshot.content_hash` (PATCH-010), plus GDPR export bundles.
- **Selection gates:** lifecycle policies (payload retention windows per Doc 28), zero egress fees (payloads are re-read during re-scoring campaigns, ADR-028 — egress-priced storage would inflate the CPO cost-gate calculus), S3-compatible API.
- **Erasure interaction (ADR-025):** raw payloads for tombstoned creators are hard-deleted (not tombstoned — archives have no referential integrity constraints), driven by the erasure outbox event.

### 1.5 Search Index — Meilisearch Cloud

- **Selection gates:** synchronous-confirmable writes — ADR-027/PATCH-009 requires that a newly ingested creator be searchable before the discovery job reports the result row as complete; Meilisearch task API allows awaiting task completion. Typo tolerance and faceting for the 48-category niche vocabulary; filterable attributes for score ranges.
- **Index topology:** single global creator index (GCP plane — search is on global creator data, tenancy applies at result-hydration time through `workspace_creator_link`, per ADR-024). No WP data ever enters the search index — this keeps the index outside the tenancy blast radius (Doc 21 §1.2).

### 1.6 Worker Fleet — Railway (primary candidate) / Fly.io (fallback)

- Long-running Node.js worker processes: queue consumers, outbox relay (ADR-020), Apify orchestration, LLM scoring, sweeper jobs.
- **Selection gates:** persistent processes, horizontal scaling on metrics, cron/scheduled job support (PATCH-005 sweeper, partition pre-creation), private networking to Postgres, per-service secret injection.

### 1.7 Supporting Services

| Service | Provider | Gate |
|---|---|---|
| KMS / secrets | Cloud KMS + provider-native secret stores | Doc 21 §6.2: injection at runtime, per-env isolation, access audit |
| Auth | Managed auth provider (per Doc 21 §2.1) | Separate staff tenant (ADR-011) |
| Email infra | User mailboxes only (ADR-010) — no transactional-outreach infra; app transactional email via Resend/Postmark | DKIM/SPF on app domain only |
| Edge/CDN | Vercel Edge Network + Cloudflare (DNS/WAF) | ADR-023 managed edge; Layer 1 rate limiting |

---

## 2. Environment Strategy

### 2.1 Three Environments, Hard Isolation

| | Development | Staging | Production |
|---|---|---|---|
| Data | Synthetic only | Masked subset + synthetic | Real |
| Secrets | Dev-tier providers, sandbox keys | Sandbox keys (Paddle sandbox, Apify dev token, LLM dev key) | Production keys, KMS-wrapped |
| DB | Neon branch (ephemeral per PR optional) | Neon branch from masked snapshot | Primary |
| Queue | Isolated queue set (`dev-` prefix) | `stg-` prefix | `prod-` prefix |
| Paddle | Sandbox | Sandbox | Live (MoR) |
| Cross-env access | **Impossible by construction:** per-env IAM identities, per-env secret scopes (Doc 21 §6.2) | | |

**Rule:** no environment shares any credential, queue, bucket, or database with another. Dev secrets cannot authenticate against prod providers — enforced by separate provider accounts/projects, not just separate keys.

### 2.2 Data Masking for Lower Environments

- Staging refreshes from a **masked snapshot pipeline**: C1 fields (Doc 21 classification) are dropped entirely (OAuth tokens are useless and dangerous outside prod); C2 PII (creator names, emails, handles) is replaced with format-preserving synthetic values; C3 tenant data is either synthetic or drawn from consenting internal test workspaces only.
- Masking runs as a transform step during snapshot restore — masked data never round-trips through developer machines.
- Synthetic creator corpus: a seeded generator producing realistic PK-market creator profiles across all 48 niche categories, used for search relevance tuning and PATCH-008 identity-resolution testing without real PII.

---

## 3. Region & Latency Strategy

### 3.1 Region Selection (R-UX-011)

- **Primary compute + database region: AWS `ap-south-1` (Mumbai)** equivalents across providers (Neon Mumbai region, SQS ap-south-1, R2 APAC location hint). Mumbai delivers ~30-60 ms RTT to Karachi/Lahore/Islamabad — the best managed-service region for Pakistan, since no hyperscaler operates a Pakistan region.
- **Rationale against Singapore:** `ap-southeast-1` adds ~60-90 ms to PK users; acceptable for GCC expansion (ADR-007 S3) but Mumbai serves both PK and GCC (~100-120 ms to Dubai) adequately for S1/S2.
- **Data residency note:** Mumbai placement is compatible with A-062 (no PK localization mandate); if that assumption breaks, the expand-contract migration posture (Doc 19) plus IaC (§6.3) makes region migration tractable, though costly — tracked as R-INF-004 (§9).

### 3.2 Edge Configuration (ADR-023)

- Static assets + SPA shell served from Vercel's global edge — PK users hit nearby PoPs for everything except API calls.
- API routes pinned to Mumbai-adjacent serverless region to keep the API-to-database hop under 5 ms; the dominant latency term becomes user-to-region, already minimized.
- Polling endpoints (ADR-021) are cheap-by-design (indexed job-status reads, PATCH-003 discipline), so polling from PK at Doc 20's specified intervals stays within NFR-P01 budgets.
- Cloudflare fronts DNS + WAF (Layer 1 rate limiting, DDoS) before Vercel — the managed-edge stack of Doc 21 §6.3.

---

## 4. Secret Management Integration

Realizing Doc 21 §6.2:

- **Source of truth:** cloud KMS-backed secret manager; per-environment secret scopes with distinct IAM principals.
- **Injection paths:**
  - Vercel: environment variables synced from secret manager via CI (never hand-entered); marked sensitive; scoped per environment.
  - Worker fleet: secrets injected at container start from the platform secret store, itself synced from the same source of truth — single rotation point.
  - CI: OIDC federation to cloud IAM (no long-lived CI cloud keys); each pipeline stage receives only its stage-scoped secrets.
- **Envelope encryption runtime:** workers performing adapter calls (Gmail/Outlook/BSP sends, Doc 21 §3.2) fetch the KMS master key handle at start; per-record data-key unwrap happens in-process per operation. The web tier holds **no** KMS decrypt permission for C1 keys — enforced at IAM level, making Doc 21's "decrypt only in workers" invariant infrastructural rather than conventional.
- **Rotation:** dual-secret overlap for webhook secrets (Doc 21 §5); 90-day adapter token rotation executed as a runbook (Doc 27) with secret-manager versioning enabling instant rollback.

---

## 5. Infrastructure Realization of ARB Patches

### 5.1 PATCH-005 — Reservation TTL Sweeper

- **Mechanism:** scheduled worker job (platform cron, every 60 s) scanning for expired credit reservations and applying the per-state disposition contract (release / settle / escalate per PATCH-005's state table).
- **Concurrency safety:** the sweeper acquires each reservation via the same `SELECT FOR UPDATE` path as settlement (ADR-026) — sweeper and worker settlement can race safely; the row lock serializes them and the disposition contract makes both outcomes idempotent.
- **Singleton guard:** sweeper runs use a Postgres advisory *transaction* lock (`pg_try_advisory_xact_lock`) keyed to the job name so overlapping cron fires no-op — the one sanctioned advisory-lock usage (exempt from §1.2's ban because it is transaction-scoped).
- **Telemetry:** swept-reservation count and age-at-sweep exported as metrics (Doc 23) — a rising sweep rate signals worker settlement failures upstream.

### 5.2 PATCH-009 — Synchronous Projection Retry

- **Happy path:** ingestion worker writes the new creator row and synchronously awaits the Meilisearch task completion (ADR-027) before marking the discovery result deliverable.
- **Failure path infrastructure:** if the index write fails or times out (5 s budget), the worker (a) marks the creator row `projection_status = 'pending'`, (b) emits a `projection.retry` outbox event (ADR-020). A dedicated consumer on `q-outbox-relay` retries with exponential backoff (30 s → 16 min, 6 attempts) then DLQs.
- **Reconciliation backstop:** nightly job diffs `projection_status = 'pending'` rows older than 1 h against the index and heals — the fetch-to-heal pattern (mirroring R-FIN-007's mitigation) applied to search.
- **Degraded UX contract:** creators pending projection are still returned in the originating job's results (direct DB read) but flagged; Doc 20's job polling payload already carries per-result status to express this.

### 5.3 PATCH-010 — Batch Re-Scoring Infrastructure

- **Trigger:** prompt version promotion passing the CPO cost-gate (ADR-028) enqueues a re-scoring campaign.
- **Queue class:** `q-rescore-low` — consumed by a **capped allocation** (max 20% of worker fleet concurrency; configurable). Re-scoring must never starve live discovery jobs (customer-facing, credit-backed) of LLM throughput or worker capacity.
- **Dedup:** the `(prompt_version, model_version)` scoped dedup key (PATCH-010) is checked before enqueue *and* at execution — a campaign restarted after partial completion skips already-scored snapshots at near-zero cost.
- **Payload source:** raw archives from R2 (§1.4) via `content_hash` lookup — re-scoring never re-scrapes, which is why R2's zero-egress pricing is a selection gate.
- **Cost telemetry:** per-campaign LLM spend metered and reported against the cost-gate estimate (feeds FS-10.03, Doc 23).

---

## 6. Deployment & CI/CD Architecture

*(Pipeline detail in Doc 26; this section fixes the infrastructure-level strategy.)*

### 6.1 Deployment Strategy

- **Web tier (Vercel):** atomic immutable deployments with instant alias rollback — effectively blue-green per deploy, provider-managed.
- **Worker fleet:** rolling deployment with **drain-then-replace**: workers stop polling, finish in-flight jobs (bounded by per-job timeout), then terminate. At-least-once delivery + idempotent consumers (ADR-020) means a worker killed mid-job is safe — the message redelivers.
- **Canary posture:** deferred to S2 for the web tier (Vercel supports gradual rollouts); worker canary achieved cheaply by deploying one worker instance on the new version consuming `q-discovery-standard` and watching error metrics before fleet rollout.

### 6.2 Zero-Downtime Migrations (Doc 19 Requirement)

- Flyway-class migrations run as a **pre-deploy gate job**: migrate → verify → deploy app. Expand-contract discipline (Doc 19) guarantees the previous app version runs correctly against the migrated schema, so migration and deploy need not be atomic.
- **Guards:** migration linter enforces: no `ACCESS EXCLUSIVE`-heavy operations without `lock_timeout`; `CREATE INDEX CONCURRENTLY` for all index additions (PATCH-003 indexes were built this way); RLS policy required in the same migration as any new `wp.*` table (Doc 21 R-SEC-008 mitigation).
- **Partition pre-creation:** monthly scheduled job creates Timeline partitions 3 months ahead (Doc 19); a deploy-time check fails the pipeline if the next month's partition is missing — belt and suspenders.

### 6.3 Infrastructure as Code

- **Approach:** Terraform for cloud-account resources (SQS queues, IAM, KMS, R2 buckets, DNS/WAF); provider-native config-as-code (`vercel.json`, Railway config) committed to the repo for platform-managed services.
- State in a locked remote backend; `terraform plan` posted on infra MRs; applies only from CI, never from laptops.
- Environments are Terraform workspaces sharing modules — guaranteeing the isolation matrix of §2.1 is structural.

---

## 7. Observability Infrastructure

*(Full strategy in Doc 23; infrastructure selections here.)*

- **Log aggregation:** structured JSON (Doc 21 §6.4 redaction middleware) shipped from Vercel (log drains) and workers (stdout collectors) to a centralized store (Axiom or Grafana Loki — decision gate: retention pricing at projected S2 volume). Security audit domains routed to a separate 24-month retention stream.
- **Metrics:** OpenTelemetry SDK throughout monolith and workers → managed backend (Grafana Cloud). Business metrics (credit burn, job throughput, per-provider cost — FS-10.03 groundwork) emitted as first-class OTel metrics, not derived from logs.
- **Tracing:** OTel traces across web → queue → worker via traceparent propagation in message attributes; sampling 100% on errors, 10% baseline.
- **Alerting:** Grafana alerting → PagerDuty (Sev1/Sev2) and Slack (Sev3+); queue-depth, DLQ-nonempty, sweeper-rate, and projection-retry alarms wired from day one since they instrument the ARB patch machinery (§5).

---

## 8. Disaster Recovery & Backup

| Asset | Mechanism | RPO | RTO |
|---|---|---|---|
| PostgreSQL | PITR (WAL-based, provider-managed) + daily snapshot, 30-day window | ≤ 5 min | ≤ 4 h |
| R2 payload archives | Provider durability + versioning; monthly integrity audit against `content_hash` | ≤ 24 h | ≤ 24 h |
| Search index | **Rebuildable, not backed up** — full reprojection from Postgres (ADR-027 machinery reused as bulk rebuild) | N/A | ≤ 6 h |
| Queues | Not backed up; outbox (ADR-020) is the durable source — queues rehydrate from unrelayed outbox rows | 0 (outbox) | ≤ 1 h |
| Secrets | Secret-manager versioning + offline break-glass copy (sealed, two-person access) | 0 | ≤ 2 h |

- **Ledger note:** the credit ledger's append-only design (ADR-012) makes PITR restores auditable — post-restore reconciliation replays Paddle webhook history (fetch-to-heal, R-FIN-007) to detect any paid-but-unrestored credit events.
- **DR drills:** quarterly restore-to-staging exercise (runbook in Doc 27); RTO targets are unvalidated until the first drill — tracked as A-067.
- Multi-region failover is explicitly **out of scope for S1/S2** (cost/complexity vs. ADR-006 MVP boundary); provider-managed intra-region HA suffices.

---

## 9. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-INF-001 (new)** | Infrastructure | Serverless/pooling breaks `SELECT FOR UPDATE` assumptions (ADR-026) | L-M | Critical | Single-transaction lock discipline; advisory-lock ban lint; ledger race test suite (Doc 24) against pooled staging |
| **R-INF-002 (new)** | Infrastructure | Worker platform (Railway) maturity/outage | M | H | Thin platform coupling (containers + env vars only); Fly.io tested as warm fallback; queue durability means outage = delay, not loss |
| **R-INF-003 (new)** | Infrastructure | Meilisearch sync-write latency breaks ADR-027 ingestion throughput | M | M | 5 s budget + PATCH-009 retry path degrades gracefully; benchmark gate before GA |
| **R-INF-004 (new)** | Regulatory | Future PK data-localization mandate forces region migration | L | H | IaC + expand-contract posture keeps migration tractable; monitor PECA/PDPB developments (couples A-062) |
| **R-INF-005 (new)** | Financial | Re-scoring campaigns (PATCH-010) blow LLM budget despite cost-gate | L-M | M | Capped queue allocation; per-campaign spend metering with auto-pause at 120% of estimate |
| R-UX-011 | UX | PK latency degrades experience | M | M | **Strengthened:** Mumbai region + edge strategy (§3); residual risk Low |

---

## 10. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-065 | Neon Mumbai region GA and production-grade (RLS, PITR, partitioning) at build time | Med-High (verify at contract) |
| A-066 | SQS FIFO throughput quotas suffice for S2 discovery volume with per-creator ordering keys | High (quotas documented; headroom >10x) |
| A-067 | 4-hour DB RTO achievable with provider PITR | Med (validate in first DR drill) |
| A-068 | Vercel + separate worker fleet split adds no prohibitive operational overhead vs. single platform | Med-High |
| A-069 | Meilisearch Cloud sustains synchronous write confirmation within 5 s at p99 under ingestion load | Med (benchmark before GA; PATCH-009 is the hedge) |

**Dependencies:** Doc 23 (observability strategy on §7 infrastructure), Doc 24 (perf/race test suites validating gates in §1.2, §5, A-069), Doc 26 (pipeline detail on §6), Doc 27 (DR drills, rotation runbooks), Doc 21 (all security requirements realized here — §4, §6.2 guards).

**Open questions:**
1. Neon vs. Supabase final call — pending Mumbai-region production validation (A-065) and pooler behavior test against the ledger suite.
2. Log backend (Axiom vs. Loki) — pending S2 volume cost model.
3. Whether staging warrants its own Paddle sandbox account vs. shared sandbox with dev (webhook secret isolation argues for separate).

---

**End of Document 22.**

[AWAITING APPROVAL]


---

<a name="doc-023"></a>
# DOC-023 — Monitoring, Logging and Observability

# Document 23: Monitoring, Logging & Observability

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 17 (Architecture), Doc 20 (API Design), Doc 21 (Security), Doc 22 (Infrastructure)
**Governing ADRs:** ADR-012, ADR-017, ADR-019, ADR-020, ADR-021, ADR-022, ADR-026, ADR-027, ADR-028
**Applied Patches:** PATCH-005, PATCH-006, PATCH-009, PATCH-010

---

## 1. Structured Logging Strategy

### 1.1 Log Schema

Every log line is a single JSON object conforming to a versioned schema:

```json
{
  "ts": "2026-07-05T10:32:01.443Z",
  "level": "warn",
  "schema_v": 2,
  "service": "worker-discovery",
  "env": "prod",
  "msg": "apify actor run exceeded latency budget",
  "request_id": "req_9f3c...",
  "trace_id": "4bf92f35...",
  "workspace_id": "wsp_01H...",
  "actor_id": "usr_01H...",
  "job_id": "job_01H...",
  "module": "M5",
  "adapter": "apify.instagram-scraper",
  "duration_ms": 48211,
  "ctx": { }
}
```

**Rules:**
- `msg` is a static, grep-stable string — variable data goes in structured fields, never interpolated into `msg`.
- `workspace_id` / `actor_id` present on every request-scoped and job-scoped line; `system` sentinel for platform jobs (sweeper, partition pre-creation).
- `adapter` field mandatory on any line emitted inside an adapter call (ADR-022) — this is what makes per-provider health queries (§6) trivial.
- `ctx` is the only free-form object and passes through the redaction middleware (§1.4) with fail-closed semantics.

### 1.2 Log Levels

| Level | Use | Examples |
|---|---|---|
| `fatal` | Process cannot continue | Missing KMS handle at worker boot; unmigrated schema detected |
| `error` | Operation failed, no automatic recovery | DLQ delivery; settlement failure after retries; webhook signature failure |
| `warn` | Degraded or anomalous, self-healing engaged | PATCH-009 projection retry; sweeper releasing an expired reservation; adapter circuit-open |
| `info` | Business-significant state transitions | Job created/completed; credit settlement; prompt version promotion; erasure executed |
| `debug` | Diagnostic detail | Adapter request/response metadata (never bodies); scoring pipeline stage timings |

`debug` is disabled in prod by default, enableable per-service via config flag (not redeploy) for time-boxed investigations (auto-reverts after 4 h — prevents forgotten debug logging from leaking C2-adjacent detail and inflating cost).

### 1.3 Correlation Model

- **`request_id`:** minted at the edge for every HTTP request; returned in the `X-Request-Id` response header (support asks users for it — feeds Doc 29 Support workflows).
- **`trace_id`:** OTel trace identifier (§3); `request_id` ↔ `trace_id` linked on the root span so either can pivot to the other.
- **`job_id`:** discovery/outreach job identity; carried in queue message attributes so every worker line for a job is correlated even across retries and redeliveries — the polling contract (ADR-021) means a customer-reported job ID leads directly to the full worker log history.
- **Outbox lineage:** outbox relay (ADR-020) stamps `origin_trace_id` into relayed messages — a consumer's logs link back to the transaction that produced the event.

### 1.4 Redaction Rules

Realizing Doc 21 §6.4 as a concrete middleware contract:

- **C1 (tokens, credentials, secrets):** structurally unloggable — the logger's serializer maintains a denylist of field names (`token`, `refresh_token`, `authorization`, `client_secret`, `api_key`, plus adapter-registered names) and replaces values with `"[C1_REDACTED]"`. Additionally, an entropy heuristic flags high-entropy strings >32 chars in `ctx` for redaction.
- **C2 (PII):** creator/user emails, names, handles replaced with stable HMAC-based pseudonyms (`crt_hash:ab12…`) — allows correlation ("same creator appears in 3 failed jobs") without PII exposure. The HMAC key lives in KMS and is *not* rotated with other keys (rotation would break historical correlation) — documented exception.
- **Fail-closed:** unknown nested objects in `ctx` deeper than 2 levels are dropped with a `_redaction_dropped: true` marker. A missing redaction middleware (misconfigured service) is a **boot failure**, not a warning.
- **Scraped payloads never logged** — payload references are logged as R2 object keys + `content_hash` (PATCH-010), pointing to the archive instead of inlining hostile content (R-SEC-006 hygiene: logs must not become a prompt-injection or XSS vector in log-viewer UIs).

### 1.5 Aggregation Pipeline

- **Web tier:** Vercel log drains → log backend.
- **Workers:** stdout JSON → platform collector → same backend.
- **Backend decision (Doc 22 gate resolved):** **Axiom** — selected for ingest-priced (not retention-priced) economics fitting our 24-month security-audit stream, and query performance on JSON fields without Loki's label-cardinality constraints (`workspace_id` as a queryable field would explode Loki label cardinality; in Axiom it's just a column). Grafana Cloud remains the metrics/tracing/alerting home (§7) — split-backend is acceptable because alerting on *logs* is limited to a small set of patterns (§4) forwarded via Axiom monitors.
- **Streams:** `ops` (30-day retention), `audit` (24-month: staff actions, ledger events, consent checks, erasure lifecycle, impersonation — per Doc 21 §6.4), `access` (edge/WAF logs, 90-day).

---

## 2. Metrics Collection & Dashboards

### 2.1 OTel Integration

- OTel SDK in monolith and workers; metrics exported via OTLP to Grafana Cloud.
- **Naming convention:** `mushin.<domain>.<metric>` with bounded-cardinality attributes. **Cardinality rule:** `workspace_id` is *never* a metric attribute (unbounded); workspace-level analysis happens in logs/traces. Attributes are drawn from closed sets: `queue_class`, `adapter`, `module`, `job_type`, `prompt_version`, `model_version`, `error_code` (the 35-code catalogue from Doc 20).

### 2.2 Metric Inventory (Core)

| Domain | Metrics |
|---|---|
| **Credits** | `credits.reserved`, `credits.settled`, `credits.released`, `credits.swept` (PATCH-005), `ledger.lock_wait_ms` (ADR-026 contention histogram) |
| **Jobs** | `jobs.created/completed/failed` by `job_type`; `jobs.duration_ms`; `jobs.items_processed`; `jobs.poll_requests` (ADR-021 polling load) |
| **Queues** | `queue.depth`, `queue.oldest_message_age_s`, `queue.dlq_depth` — all by `queue_class` |
| **Adapters** | `adapter.calls`, `adapter.errors` by `error_class`, `adapter.latency_ms`, `adapter.circuit_state`, `adapter.degraded_responses` (ADR-022 obligation telemetry) |
| **Ingestion** | `ingestion.payloads_validated/rejected` (R-TEC-008 gate), `scoring.grounding_failures` (R-SEC-006 signal), `projection.sync_success/retry/healed` (ADR-027, PATCH-009) |
| **Consent** | `consent.last_gate_checks`, `consent.last_gate_blocks` (PATCH-006 — a nonzero block rate is the TOCTOU fix visibly working) |
| **Cost** | §5 inventory |
| **Security** | `authz.workspace_mismatch` (tenancy signal), `webhook.signature_failures`, `auth.refresh_reuse_detected` |

### 2.3 Dashboards

Four canonical dashboards, provisioned as code (Grafana JSON in the repo, deployed via CI — dashboards are reviewed artifacts, not hand-edited):

1. **Cost & Margin (FS-10.03):** §5's guardrail view — per-provider spend, margin by action type, 3x COGS status band.
2. **Queue & Pipeline Health:** per-class depth/age, DLQ status, sweeper rate, projection retry/heal rates, outbox relay lag (unrelayed row age — the ADR-020 health signal).
3. **Provider Health:** §6's per-adapter panels — success rate, latency percentiles, circuit states, quota headroom.
4. **Security Posture:** `authz.workspace_mismatch` timeline, webhook signature failures, refresh-token reuse detections, impersonation session count, erasure SLA tracker (open Tier 2 requests vs. 72 h target).

**Tenancy isolation note:** `authz.workspace_mismatch` counts *rejected* attempts — an elevated rate is either an attack or a client bug; a successful cross-tenant read would by definition not appear here, which is why the metric is paired with the Doc 24 continuous tenancy test suite (detection of enforcement failure, not just enforcement activity).

---

## 3. Distributed Tracing

- **Propagation:** W3C `traceparent` on HTTP; embedded in SQS message attributes at enqueue; workers extract and continue the trace. Outbox-relayed events carry `origin_trace_id` as a span link (not a parent — the outbox transaction boundary is a legitimate trace break, linked for navigation).
- **Span conventions:** one span per adapter call (attributes: `adapter`, `error_code`, `degraded`), per DB transaction touching the ledger (`ledger.lock_wait_ms` recorded here), per pipeline stage in Brain 2 (scrape → validate → score → resolve identity → ingest → project) — making the canonical discovery trace a readable waterfall of the entire two-brain write path.
- **Sampling:** tail-sampling in the Grafana Cloud/Tempo pipeline — 100% of traces containing errors or `duration > p95 budget`, 10% baseline, 100% of anything touching the ledger (low volume, high forensic value per ADR-012/026).
- **Debug workflow:** support/eng receives `request_id` → Axiom log lookup → `trace_id` pivot → Tempo waterfall → per-span job/adapter context. Target: any customer-reported job issue diagnosable without SSH or DB access.

---

## 4. Alerting Rules & Escalation

### 4.1 Severity Ladder

| Sev | Definition | Channel | Ack SLA |
|---|---|---|---|
| **Sev1** | Data breach, tenancy leak, ledger corruption, total outage | PagerDuty (page) | 15 min |
| **Sev2** | Credential leak, provider hard-down, payment/webhook pipeline stalled, erasure SLA breach imminent | PagerDuty (page) | 30 min; credential rotation ≤ 4 h (Doc 21) |
| **Sev3** | Degraded pipeline, queue backlog, elevated error rates | Slack `#mushin-alerts` | Business hours |
| **Sev4** | Cost anomalies (non-runaway), quota trends, canary warnings | Slack digest | Weekly review |

### 4.2 Alert Rules (Canonical Set)

| Alert | Threshold | Sev |
|---|---|---|
| Cross-workspace access spike | `authz.workspace_mismatch` > 0 sustained (>5 in 5 min from one principal) | **Sev1** (single events are Sev3-logged; a burst pattern pages) |
| Tenancy canary failure | Doc 24 continuous tenancy probe fails | **Sev1** |
| Ledger anomaly | Balance reconciliation mismatch, or `ledger.lock_wait_ms` p99 > 2 s | **Sev1** / Sev2 |
| Webhook signature failures | > 10 in 5 min per source | Sev2 (possible R-SEC-007 event) |
| DLQ non-empty | `queue.dlq_depth` > 0 for > 1 min | Sev2 (prod business queues); Sev3 (`q-rescore-low`) |
| Queue backlog | depth > 1000 for > 5 min, or `oldest_message_age_s` > 900 | Sev3; escalates Sev2 at 30 min |
| Sweeper rate | `credits.swept` > 5/h | Sev3 (upstream settlement failures — PATCH-005 telemetry) |
| Projection retries | > 10/h, or any row pending > 1 h (heal backstop firing) | Sev3 (ADR-027 degradation) |
| Provider error rate | `adapter.errors`/`adapter.calls` > 5% over 5 min per adapter | Sev3; Sev2 if circuit opens on Paddle or LLM |
| Credit burn / campaign spend | Re-scoring campaign spend > 120% of cost-gate estimate → **auto-pause** (Doc 22 §5.3) + alert | Sev2 |
| Margin guardrail | Marginal COGS ratio enters red band (§5.4) | Sev2 (business), Slack + email to CPO |
| Consent last-gate block spike | `consent.last_gate_blocks` > 20/h | Sev3 (legitimate mechanism, but a spike means upstream queue latency or a consent-flapping bug) |
| Erasure SLA | Tier 2 request open > 48 h | Sev2 (72 h target, Doc 21 §3.3) |
| Outbox relay lag | Oldest unrelayed row > 5 min | Sev2 (ADR-020 — everything downstream depends on this) |

**Alert hygiene:** every rule has an owning runbook link (Doc 27); any alert firing >3× in a week without action is tuned or deleted in the weekly review — noisy alerting is treated as an incident class of its own (R-OBS-002, §9).

---

## 5. Cost Telemetry Implementation (FS-10.03)

### 5.1 Per-Action Cost Model

Every cost-incurring adapter call emits a `cost_event` (structured log to a dedicated Axiom stream + OTel counter):

```json
{
  "event": "cost_event",
  "provider": "llm",
  "unit": "tokens",
  "quantity_in": 3812, "quantity_out": 411,
  "unit_cost_usd": 0.000003,
  "cost_usd": 0.012669,
  "attribution": {
    "stage": "authenticity_scoring",
    "prompt_version": "pv_014",
    "model_version": "claude-x-2026-05",
    "job_id": "job_01H...", "job_type": "discovery",
    "campaign_id": null
  }
}
```

- **LLM attribution:** `model × prompt_version × stage` — exactly the provenance triple discipline of PATCH-010, reused for money. Prompt Registry promotions (ADR-019/028) automatically get before/after cost-per-score comparison, closing the CPO cost-gate loop with measured rather than estimated data.
- **Apify attribution:** `actor × platform × job_type`, priced from actor compute-unit consumption reported per run.
- **YouTube:** quota units consumed per endpoint (quota is the scarce resource; dollar cost ~0, but quota exhaustion is an availability cost — tracked in the same pipeline with `unit: "quota_units"`).

### 5.2 Margin Monitoring

- Each credit-spending action type has a **standard credit price** (ADR-004) and a **measured marginal COGS** (rolling 7-day mean of `cost_usd` per action from cost_events).
- `margin_ratio = credit_revenue_per_action / marginal_COGS` computed per action type, refreshed hourly.

### 5.3 Reconciliation

Metered costs are estimates; monthly provider invoices are truth. A monthly reconciliation job compares metered totals vs. invoiced totals per provider; drift > 10% triggers a metering-model correction task. (Same fetch-to-heal philosophy as R-FIN-007, applied to cost data.)

### 5.4 Guardrail Dashboard (3x COGS)

| Band | Condition | Action |
|---|---|---|
| 🟢 Green | margin_ratio ≥ 3.0 | None |
| 🟠 Amber | 2.0 ≤ ratio < 3.0 | Weekly digest flags action type; pricing review queued |
| 🔴 Red | ratio < 2.0 | Sev2 alert to CPO; new prompt promotions for that stage frozen (ADR-028 gate hardens automatically) |

### 5.5 Anomaly Detection

- **Runaway spend:** hourly spend per provider > 3× trailing 7-day same-hour mean → Sev2 + investigation runbook (distinguishes traffic growth from a retry storm or pricing change).
- **Provider price change:** `unit_cost_usd` is config-sourced; a config change requires an MR (auditable), and reconciliation drift (§5.3) catches unannounced provider-side changes.

---

## 6. Provider Health Monitoring

Per-adapter panels on the Provider Health dashboard, all derived from ADR-022's uniform telemetry obligations:

- **Apify actors:** per-actor (`apify/instagram-scraper`, `clockworks/tiktok-scraper`, `apify/instagram-hashtag-scraper`, comment scrapers, web scraper) run success rate, run duration, items-per-run, and **payload validation pass rate** — the leading breakage indicator (R-TEC-007): a scraper that "succeeds" but returns schema-invalid payloads shows up here before it shows up as job failures. **Canary system (Doc 17):** scheduled canary runs against a fixed panel of known-stable public profiles per platform (4×/day); field-level diff against expected schema; canary failure → Sev3 alert *before* customer jobs degrade.
- **LLM provider:** latency percentiles, error/rate-limit rates, **rate-limit headroom** (consumed vs. provisioned TPM), grounding-failure rate (quality signal, R-SEC-006/R-TEC-008).
- **YouTube Data API:** daily quota consumed vs. cap with forecast line; alert at 70% projected end-of-day consumption; per-endpoint quota attribution.
- **Paddle:** webhook delivery lag (event `created_at` vs. our receipt), signature failure count, reconciliation drift status (R-FIN-007).
- **Gmail/Outlook OAuth health:** proactive token validity probe per connected mailbox (daily lightweight call); `revoked`/`expired` states surface to the workspace UI (Doc 20 connection status) *and* metrics — a fleet-wide revocation spike suggests a provider policy change (A-021 watch signal).
- **BSP/WhatsApp:** message send success rate, template rejection rate, per-workspace WABA credential validity.

---

## 7. Observability Infrastructure

| Concern | Backend | Notes |
|---|---|---|
| Logs | **Axiom** (§1.5 decision) | 3 streams; audit stream 24-month retention |
| Metrics | Grafana Cloud (Mimir) | OTLP ingest; dashboards as code |
| Traces | Grafana Cloud (Tempo) | Tail sampling per §3 |
| Alerting | Grafana alerting + Axiom monitors | → PagerDuty (Sev1/2), Slack (Sev3/4) |
| Uptime | External synthetic probes (Grafana synthetic monitoring) on login, search, job-poll endpoints from an APAC vantage (validates R-UX-011 in production continuously) | |
| Status page | Managed status page (S2) | Manual updates per Doc 27 comms templates |

All observability config (dashboards, alert rules, monitors) lives in the repo and deploys via CI — drift between declared and live alerting is itself checked weekly.

---

## 8. On-Call & Incident Response

*(Full runbooks in Doc 27; structure fixed here.)*

- **Rotation:** single weekly primary + secondary rotation across the engineering team (team size at S1 doesn't support specialist rotations); founder/CTO is permanent Sev1 escalation.
- **Escalation path:** Primary (15 min ack) → Secondary (+15 min) → CTO (+15 min). Sev1 tenancy/breach events additionally trigger the Doc 21 §8 breach-assessment track (GDPR 72 h clock) immediately on confirmation, not on resolution.
- **Communication templates:** internal incident channel auto-created per PagerDuty incident; customer-facing template set (investigating / identified / resolved) for status page; regulator-notification template pre-drafted with counsel (Doc 28).
- **Post-incident review:** blameless PIR within 5 business days for Sev1/Sev2; PIR must produce at minimum one detection improvement (alert/metric gap) and one prevention item, tracked in the backlog with a `pir` label. Sweeper-rate, projection-retry and consent-block alerts (§4.2) exist precisely because PIR discipline says self-healing machinery firing silently is a masked failure.

---

## 9. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-OBS-001 (new)** | Observability | Redaction gap leaks C2 PII into logs | M | H | Fail-closed middleware, boot-failure on missing redaction, entropy heuristic, quarterly log-sample audit |
| **R-OBS-002 (new)** | Observability | Alert fatigue erodes Sev1 response | M | H | Weekly tuning review; >3 firings/week rule; strict Sev ladder |
| **R-OBS-003 (new)** | Observability | Metric cardinality explosion (workspace/creator attributes) inflates cost and breaks dashboards | M | M | Closed attribute sets, `workspace_id` ban in metrics, CI lint on metric declarations |
| **R-OBS-004 (new)** | Observability | Cost metering drifts from invoiced truth → wrong margin decisions | M | M-H | Monthly reconciliation (§5.3), 10% drift trigger |
| **R-OBS-005 (new)** | Observability | Split backend (Axiom + Grafana) creates correlation gaps during incidents | L-M | M | `request_id`/`trace_id` dual-pivot convention (§3); incident runbooks reference both tools explicitly |
| R-TEC-007 | Technical | Scraper breakage volatility | H | H | **Strengthened:** canary panel + payload-validation pass-rate leading indicator (§6); detection latency now hours, not customer-report-driven |

---

## 10. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-070 | Axiom ingest pricing remains economical at S2 log volume (~50 GB/day projected) | Med-High |
| A-071 | Apify exposes per-run compute-unit consumption sufficient for §5.1 attribution | High (verify API field availability) |
| A-072 | Canary panel of stable public profiles remains representative of actor health (profiles may go private/delete) | Med (panel refresh runbook mitigates) |
| A-073 | Tail-sampling config in Grafana Cloud supports the ledger-100% rule without full-trace-forwarding cost blowup | Med-High |
| A-074 | Grafana → PagerDuty integration meets 15-min Sev1 ack SLA end-to-end | High |

**Dependencies:** Doc 24 (tenancy canary probe implementation, perf budgets that alerts reference), Doc 26 (dashboards/alerts-as-code deployment pipeline), Doc 27 (runbooks for every §4.2 alert — a rule may not ship without its runbook), Doc 28 (log retention legal alignment; regulator notification template), Doc 29 (Support access to Axiom `ops` stream, *not* `audit` stream).

**Open questions:**
1. Whether the `audit` stream should additionally mirror to R2 (WORM-style) for tamper-evidence beyond Axiom retention — leaning yes, cost is trivial; decide with Doc 27.
2. Synthetic probe vantage point for PK specifically (Grafana synthetic locations don't include Pakistan; Mumbai vantage is a proxy — acceptable?).
3. Per-workspace cost attribution (customer-facing usage analytics) is deliberately deferred — cost_events carry `job_id` from which workspace attribution is derivable later without schema change; confirm this satisfies future FS-10.03 phase 2.

---

**End of Document 23.**

[AWAITING APPROVAL]


---

<a name="doc-024"></a>
# DOC-024 — Testing Strategy and QA Process

# Document 24: Testing Strategy & QA Process

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 19 (Schema), Doc 20 (API), Doc 21 (Security), Doc 22 (Infrastructure), Doc 23 (Observability)
**Governing ADRs:** ADR-011, ADR-019, ADR-020, ADR-021, ADR-022, ADR-024, ADR-025, ADR-026, ADR-027, ADR-028
**Applied Patches:** PATCH-001 through PATCH-010 (all — this document is their verification contract)

---

## 1. Testing Philosophy & Strategy

### 1.1 Test Pyramid

| Layer | Share | Target Runtime | Environment |
|---|---|---|---|
| Unit | ~70% | < 3 min full suite | In-process, no I/O |
| Integration | ~25% | < 15 min | Real Postgres (ephemeral Neon branch), real/localstack SQS, mocked external providers |
| E2E | ~5% | < 30 min | Staging, sandbox providers |

**Guiding principle:** the ARB patches exist because the failure modes are *concurrency, cross-plane, and provider-boundary* failures — none of which unit tests can catch. Therefore MUSHIN's integration layer is unusually load-bearing: **the ten ARB patch suites (§3.1) are release-blocking on every merge to main**, not nightly.

### 1.2 Shift-Left Principles

- Contract-first: Doc 20's API schema and ADR-022's adapter obligations are testable artifacts; violations fail at MR time.
- Migration linter (Doc 22 §6.2), metric-cardinality lint (Doc 23 R-OBS-003), advisory-lock ban lint (Doc 22 §1.2), and tenancy-annotation checks (Doc 21 §2.2) run as static gates *before* any test executes.
- Every alert rule in Doc 23 §4.2 that guards a mechanism (sweeper, projection retry, last-gate) has a corresponding test that deliberately triggers the mechanism — we test the *detector* as well as the behavior.

### 1.3 Test Data Management

- **Synthetic creator corpus** (Doc 22 §2.2): seeded, deterministic generator producing PK-market profiles across all 48 niche categories, with controlled distributions (follower counts, engagement rates, Urdu/Roman-Urdu/English bios, cross-platform identity clusters for PATCH-008 testing).
- **Adversarial corpus:** a versioned set of hostile payloads — prompt-injection bios, XSS handles, homoglyph names, oversized fields, malformed actor outputs — shared by security tests (§6), payload-gate tests (R-TEC-008), and grounding tests (§11.2). Grows via PIR discipline: every production incident adds its trigger payload.
- **Never real PII in tests.** Staging masked snapshots (Doc 22 §2.2) are for exploratory QA only; automated suites use synthetic data exclusively.

### 1.4 Environment Strategy

- **Unit/static:** every commit, every branch.
- **Integration:** every MR — ephemeral Neon branch + isolated queue namespace (`ci-<pipeline_id>-` prefix), torn down post-run.
- **E2E:** merge-to-main → staging deploy → E2E suite; also nightly full run.
- **Production:** smoke tests post-deploy (§10.4) + continuous tenancy canary (§6.1) + Apify canary panel (§11.1). Production testing is *read-only and canary-scoped* — no synthetic writes into customer-visible planes except the dedicated canary workspace.

---

## 2. Unit Testing Requirements

### 2.1 Coverage Targets

| Layer / Domain | Line Coverage Gate | Rationale |
|---|---|---|
| Ledger domain logic (M-billing) | 95% + branch coverage | ADR-012/026 — money |
| Consent & sequence scheduling | 95% | PATCH-006, Jumu'ah logic |
| Identity resolution state machine | 90% | PATCH-008 tier transitions |
| Adapters (unit-testable portions) | 85% | ADR-022 obligation logic |
| API handlers / validation | 85% | Doc 20 error catalogue mapping |
| Overall repo | 80% | Floor, not target |

Coverage is a **ratchet**: CI fails if a module's coverage drops below its high-water mark minus 1%. New modules declare their gate in module manifest.

### 2.2 Mocking Strategy

- **Adapters (ADR-022):** every adapter ships a **conformance fake** — an in-process implementation satisfying all seven obligations, with scriptable failure modes (timeout, rate-limit, malformed payload, degraded response, circuit-open). Application code is tested against fakes; the fake itself is tested against the recorded contract (§8.2). **Rule: application tests never mock HTTP directly** — only the adapter interface. This keeps the adapter boundary (adapter-layer exclusivity, ADR-017) real in tests.
- **Clock and randomness injected** everywhere (TTL logic, Jumu'ah windows, backoff jitter are all time-dependent — PATCH-005 and I8 tests require a controllable clock).
- **Postgres is never mocked** — repository-layer logic runs against real Postgres in the integration layer; unit tests stop at the repository interface.

### 2.3 Property-Based Testing

Applied to the invariant-dense cores, using generated operation sequences:

- **Ledger:** for any interleaving of grant/reserve/settle/release/sweep operations: (a) `usable_balance ≥ 0` always; (b) sum of ledger entries equals derived balance (ADR-012: balances derived, never mutable); (c) every reservation terminates in exactly one disposition (PATCH-005 contract totality); (d) replaying any operation is a no-op (idempotency).
- **Identity resolution (PATCH-008):** any sequence of evidence events yields a valid `merge_status`; no transition skips a confidence tier; merges are commutative where the state machine says they are.
- **Pagination:** any dataset + cursor walk yields each row exactly once, no duplicates/omissions under concurrent inserts (Doc 20 cursor contract).

### 2.4 Prompt Snapshot Testing (ADR-019)

- Every registered prompt version has snapshot tests: fixed input payload → rendered prompt text snapshot (catches accidental template drift) and → output *schema* validation against the registry-bound schema.
- Snapshots are per `(prompt_version)`; a prompt change without a version bump fails CI — the Prompt Registry's versioning discipline is enforced mechanically, and PATCH-010's provenance triple stays truthful.

---

## 3. Integration Testing

### 3.1 ARB Patch Test Suites (Release-Blocking)

Each patch has a named, owned suite. Summarized contracts:

**PATCH-001 — Bridge entity (ADR-024):**
- Link creation, idempotent re-link, unlink; hydration joins only via bridge.
- **Negative:** static analysis asserts no query text joins `gcp.*` to `wp.*` except through `workspace_creator_link`; orphan-link healing (GCP row tombstoned → link resolves to tombstone view, never 500).

**PATCH-002 — GDPR erasure (ADR-025):**
- Tier 1: workspace delete soft-deletes WP rows + link; GCP untouched; second workspace's link unaffected.
- Tier 2: all C2 fields nulled; tombstone markers set; row persists; soft FKs still resolve; re-ingestion blocklist blocks a subsequent Brain 2 encounter of the same handles; `enrichment_snapshot` cascade rules applied; R2 archive deletion event emitted; search index purged (verify via query).
- Erasure is idempotent (double-submit of same request).

**PATCH-003 — Timeline partitioning/indexes:**
- Inserts route to correct monthly partition; queries spanning partition boundaries correct.
- All 5 composite indexes exist post-migration (schema assertion) and are *used*: `EXPLAIN` assertions on the canonical Timeline query set — plans must show index scans, no seq scan on partitioned parent.
- Missing-next-month-partition condition trips the deploy-gate check (Doc 22 §6.2).

**PATCH-004 — Ledger concurrency (ADR-026):**
- N=50 parallel reservation attempts against a balance sufficient for k<50: exactly k succeed, balance never negative, no deadlocks, `version` increments correctly.
- Same test executed against **pooled connections** (transaction-mode pooler) — the R-INF-001 validation gate.
- Contention histogram (`ledger.lock_wait_ms`) emitted and sane under load (ties to Doc 23 alert).

**PATCH-005 — Sweeper:**
- Clock-advanced expiry: each reservation state maps to its contracted disposition; sweeper vs. late-settling worker race (both grab the row) → row lock serializes, both paths idempotent, final state deterministic.
- Overlapping sweeper runs no-op (advisory xact lock); swept metrics emitted.

**PATCH-006 — Consent TOCTOU:**
- Concurrent opt-out + in-flight send: opt-out lands after enqueue but before send → **last-gate check blocks the send**; `consent.last_gate_blocks` incremented; consent version recorded in the audit log.
- Priority queue: opt-out events overtake queued sends (ordering assertion across queue classes).
- Fuzzed interleavings (100 randomized schedules) — zero sends after opt-out timestamp, ever.

**PATCH-007 — Intra-job dedup:**
- Same URL twice in one job input → scraped once, both result rows resolve; `inflight_url_lock` honored across two workers processing the same job; lock TTL (15 min) expiry allows retry after worker crash (clock-advanced).

**PATCH-008 — Identity resolution:**
- Synthetic identity clusters: high-confidence auto-merge, mid-tier flagged `pending_review`, low-tier kept separate; merge fan-out updates links and snapshots; no cross-tier skips; un-merge (reversal) path preserves audit trail.

**PATCH-009 — Synchronous projection (ADR-027):**
- New creator searchable (index query returns it) **before** job result row is marked deliverable.
- Forced index failure → `projection_status='pending'`, retry via outbox with backoff, heal backstop fixes rows older than 1 h; degraded result flag present in polling payload (Doc 20 contract).

**PATCH-010 — Score invalidation (ADR-028):**
- Prompt promotion enqueues campaign; dedup key `(prompt_version, model_version)` skips already-scored snapshots at enqueue *and* execution; campaign restart after partial completion is cheap (assert LLM-fake call count); cost-gate refusal blocks enqueue entirely; re-scoring uses R2 archive via `content_hash`, never triggers scraping (assert zero Apify-fake calls).

### 3.2 Database Integration Tests

- **RLS:** for every `wp.*` table — a generated test sets `app.workspace_id` to workspace A and asserts zero visibility of workspace B rows, *bypassing* the repository layer (raw SQL) — this tests layer 3 independently of layer 2 (Doc 21 §2.2). New table without an RLS test fails a schema-coverage check (R-SEC-008 mitigation).
- **Generated columns:** `usable_balance` correctness across all ledger mutations.
- **Migration tests:** every migration applies against a snapshot of the previous schema + representative data; expand-contract verified by running previous app version's repository test suite against migrated schema.

### 3.3 Queue Integration Tests

- FIFO ordering per `MessageGroupId` (per-key ordering, ADR-020) under multi-consumer competition; cross-key parallelism confirmed.
- DLQ behavior: poison message → max receives → DLQ, `queue.dlq_depth` metric fires.
- Priority-by-queue-class semantics: high drained before standard under load; `q-rescore-low` cap respected (Doc 22 §5.3).
- Outbox relay: transactional write + relay; relay crash mid-batch → no event loss, duplicates absorbed by consumer idempotency (§7.4).

### 3.4 Adapter Integration Tests

Against **sandbox/recorded** environments, nightly (not per-MR — provider flakiness must not block merges):

- Apify: dev-token runs of all six actors against the canary panel; schema validation of outputs.
- YouTube Data API: quota-cheap endpoint smoke + quota accounting assertion.
- Paddle sandbox: full subscription lifecycle event sequence (§4.3 feeds from this).
- Gmail/Outlook: OAuth flow against test tenants; token refresh; revocation detection probe (Doc 23 §6).
- BSP sandbox: template send + status callback.

---

## 4. End-to-End Testing

Staging, sandbox providers, synthetic corpus. Critical journeys (Doc 11 UF series):

1. **UF-00 Onboarding:** signup → workspace creation → seat invite → first search (Brain 1) — asserts sub-second search on seeded index.
2. **Two Brains flow:** Brain 1 query with thin results → user triggers Live Discovery (Brain 2) → job created (credits reserved, PATCH-005 states observable) → polling (ADR-021 protocol: progressive results, terminal state) → new creators searchable immediately (PATCH-009) → credits settled → ledger and balance consistent.
3. **Paddle lifecycle:** sandbox checkout → webhook → entitlement + credit grant → upgrade → downgrade → cancellation → dunning path; each step asserts entitlement state *and* ledger entries; duplicate webhook delivery mid-sequence (idempotency, R-FIN-007); fetch-to-heal reconciliation corrects an artificially suppressed webhook.
4. **Outreach sequence:** mailbox connect (test tenant) → sequence enrollment → sends respecting schedule incl. Jumu'ah exclusion (clock-controlled staging time) → reply detection stops sequence → opt-out mid-sequence triggers last-gate block (PATCH-006 E2E confirmation).
5. **GDPR erasure E2E:** creator present in 2 workspaces → Tier 2 request → PII nullified, tombstone visible in both workspaces' UI as anonymized record, search purged, R2 archive deleted (assert object absence), blocklist prevents re-discovery in a subsequent Brain 2 job.

E2E failures block promotion to production (Doc 26 gate).

---

## 5. Performance Testing

### 5.1 NFR Budget Validation

| NFR | Budget | Method |
|---|---|---|
| NFR-P01 | Filtered search p95 < 1 s | k6 load: 10k concurrent virtual users against staging index seeded with S2-scale corpus (500k creators); **RLS overhead measured** (A-064 validation: same suite with RLS disabled on a throwaway branch, delta must be < 10%) |
| NFR-P02 | NL/semantic search p95 < 3 s | Same harness; includes LLM query-translation path with Urdu/Roman-Urdu query mix (Doc 15 B2) |
| NFR-P03 | Profile enrichment p95 < 30 s | Brain 2 single-profile enrichment with adapter fakes at recorded-latency distributions; then nightly against real sandbox actors |

Budgets are CI-enforced trend gates on staging: >10% p95 regression vs. 7-day baseline fails the release.

### 5.2 Database Performance

- **Ledger contention:** PATCH-004 suite scaled to 500 concurrent reservations across 50 workspaces; p99 `lock_wait_ms` < 2 s (the Doc 23 alert threshold is validated as achievable, not aspirational).
- **Timeline:** query performance across 24 months of partitions at S2 volume (10M rows); partition pruning verified in plans; PATCH-003 index efficacy under realistic write load.

### 5.3 Queue & Pipeline Throughput

- Discovery job storm: 200 concurrent jobs → queue depth, oldest-age, and outbox relay lag stay under Doc 23 alert thresholds at target worker fleet size; measured throughput documents the fleet-sizing model for Doc 27 capacity runbook.
- Meilisearch sync-write p99 < 5 s under ingestion load — the **A-069 validation gate**; failure here triggers the PATCH-009-heavy fallback posture review before GA.

### 5.4 LLM & Apify

- LLM latency distribution per model tier; timeout + retry behavior under injected slow responses; rate-limit headroom behavior (backpressure engages before 429 storms).
- Apify per-platform throughput with rate-limit handling; multi-actor fallback switchover time (R-TEC-007).

---

## 6. Security Testing

### 6.1 Tenancy Isolation Suite (NFR-S01) — Highest-Priority Suite

Three components:

1. **Endpoint sweep:** generated from Doc 20's endpoint inventory — for *every* M1-M13 endpoint, an authenticated workspace-A session attempts access to workspace-B resources (path IDs, body references, cursor tampering). Expected: 403/404 per Doc 20 catalogue, never 200, never a B-plane field in an error body. New endpoints are auto-included (inventory-driven generation); an endpoint missing from the inventory fails CI.
2. **RLS verification:** §3.2's per-table raw-SQL suite.
3. **Continuous production canary:** two dedicated canary workspaces in prod; a probe (every 5 min) attempts a fixed set of cross-workspace reads; any success → **Sev1 page** (Doc 23 §4.2). This is the only test that runs against production continuously.

### 6.2 Penetration Testing & OWASP

- Pre-GA external pentest + annual thereafter (Doc 21 §8 scope: tenancy, auth, webhook forgery, staff-plane separation, prompt injection).
- OWASP Top 10 mapped to automated coverage: injection (§3.2 parameterization + SQLi payload corpus in the endpoint sweep), broken access control (§6.1), auth failures (token family revocation tests, refresh reuse detection test), SSRF (adapter egress allowlist test — workers attempt disallowed egress, must fail), etc. The mapping matrix lives in the repo and is a pentest-prep artifact.

### 6.3 Prompt Injection Testing (R-SEC-006)

- Adversarial corpus (§1.3) seeded through the *full* Brain 2 pipeline in staging: injection bios ("ignore previous instructions…", encoded payloads, homoglyphs, schema-mimicry) → assert: payload gate rejections where applicable; scoring output remains schema-valid; grounding validator rejects fabricated evidence; **no score deviates beyond tolerance from the same profile without the injected content** (differential assertion — the strongest signal that isolation held).
- Corpus versioned; new LLM/model version promotion (ADR-028) must pass the injection eval set before the cost-gate is even consulted (Doc 21 §8 checklist).

### 6.4 Webhook, OAuth, Staff-Plane

- **Webhook forgery:** invalid signature, valid-signature-stale-timestamp (replay), body tamper post-signature, duplicate event-id — all against Paddle/Gmail/Outlook receivers; assert verify-before-parse (malformed body with bad signature never reaches the parser — instrumented assertion).
- **OAuth theft simulation:** exfiltrated refresh token replayed → family revocation triggers; C1 fields absent from every API response and log line (automated response/log scan against C1 field denylist).
- **Staff plane (ADR-011):** customer JWT against every staff endpoint → 401 (issuer/audience rejection, not role rejection — asserted specifically); staff mutation with induced audit-write failure → whole action fails (audit-first invariant test); impersonation session cannot read decrypted tokens or trigger sends.

---

## 7. Idempotency & Race Condition Testing

Consolidated race matrix (some overlap with §3.1, listed here as the canonical inventory):

| # | Race | Suite | Key Assertion |
|---|---|---|---|
| 7.1 | Parallel reserve/settle (ADR-026) | PATCH-004 | Exactly-k success, non-negative balance |
| 7.2 | Opt-out vs. in-flight send | PATCH-006 | Zero post-opt-out sends across fuzzed schedules |
| 7.3 | Duplicate Paddle webhooks (R-FIN-007) | Webhook suite | Single ledger effect; idempotent entitlement |
| 7.4 | Outbox relay redelivery (ADR-020) | Outbox suite | At-least-once absorbed; consumer effects exactly-once-equivalent |
| 7.5 | Duplicate URL / competing workers | PATCH-007 | Single scrape; lock TTL recovery |
| 7.6 | Sweeper vs. late settlement | PATCH-005 | Deterministic disposition via row lock |
| 7.7 | Client idempotency-key replay | Doc 20 protocol suite | Same key + same body → cached response; same key + different body → 409 |
| 7.8 | Concurrent identity merges | PATCH-008 | State machine validity under interleaving |

All race tests run with **randomized scheduling and ≥100 iterations** in the nightly build (deterministic reduced set per-MR for speed).

---

## 8. Contract Testing

- **API contracts (Doc 20):** OpenAPI-derived tests assert response schemas, all 35 error codes reachable and correctly shaped, rate-limit headers present, pagination contracts (cursor stability, offset bounds). Breaking-change detector diffs the spec per MR.
- **Adapter contracts (ADR-022):** a shared conformance suite runs against *every* adapter's fake and (nightly) real sandbox: seven obligations verified — including timeout ceilings, degraded-response shape, telemetry emission (Doc 23 §6 fields), credential confinement (adapter cannot be constructed in the web tier — compile/DI-level test), and error taxonomy mapping.
- **Webhook contracts:** recorded fixture library per provider version; provider payload drift (new fields, changed types) detected nightly against sandbox → alerts before prod impact (A-031 watch).
- **LLM output contracts (ADR-019):** every registered prompt's output schema validated against golden-set runs per version; schema violation rate must be < 0.5% on the golden set for promotion eligibility.

---

## 9. Continuous Testing & CI/CD Integration

- **Pipeline stages (detail in Doc 26):** static gates → unit → integration (ephemeral Neon branch + `ci-` queue namespace, provisioned per pipeline, destroyed after) → deploy staging → E2E → performance trend gates → production promotion → post-deploy smoke.
- **Seeding:** synthetic corpus generator runs as a pipeline step with a pinned seed per suite (deterministic) and a rotating seed nightly (exploratory).
- **Flaky test policy:** a test failing then passing on retry is auto-tagged; 3 flakes/14 days → quarantined (excluded from gates, ticketed, 2-week fix SLA; expired SLA blocks the owning module's merges). Quarantine list size is a dashboard metric — a growing list is R-QA-002 materializing.
- **Coverage gates:** §2.1 ratchet enforced in CI; patch-suite completeness check: a diff touching ledger/consent/identity/projection code without touching its patch suite raises a review flag.

---

## 10. QA Process & Release Gates

### 10.1 Definition of Done (Feature)

Code + tests at gate coverage; patch suites green if touched domain; endpoint added to Doc 20 inventory (auto-includes it in §6.1 sweep); metrics/alerts added per Doc 23 conventions with runbook link; security checklist (Doc 21 §8) passed in review; docs updated.

### 10.2 Release Readiness

All release-blocking suites green (unit, integration incl. ten patch suites, E2E, tenancy sweep); no open Sev1/Sev2 bugs; performance trend gates within budget; migration linter clean; next Timeline partition exists.

### 10.3 Rollback Testing

Quarterly drill: deploy → forced rollback (Vercel alias revert + worker fleet re-pin) against the expand-contract schema — previous version's suite must pass against current schema (§3.2 migration test makes this continuous, the drill validates the *operational* path, feeding Doc 27).

### 10.4 Production Verification

Post-deploy smoke (< 5 min): login, Brain 1 search, job creation + poll (canary workspace, minimal credit job), webhook receiver health, queue consumer liveness. Failure → auto-rollback trigger (Doc 26).

---

## 11. Specialized Testing

### 11.1 Apify Canary (operationalizing Doc 23 §6)

- Fixed panel: 10 profiles/platform, publicly stable accounts; 4×/day runs of all six actors; field-level schema diff (added/removed/retyped fields) against expected schema version; payload-validation pass-rate trend is the R-TEC-007 leading indicator.
- **Panel refresh runbook** (A-072): monthly panel health check; a private/deleted panel account is replaced within 48 h; panel changes are versioned so diff baselines reset cleanly.

### 11.2 LLM Quality

- **Golden set** (Doc 15 Part E): per-prompt-version evaluation — scoring accuracy vs. human-labeled ground truth (PK-market labeled set), regression tolerance ±2% on aggregate metrics for promotion.
- **Grounding adversarial:** §6.3 corpus + synthetic "plausible fabrication" cases (evidence that *almost* matches payload spans) — validator false-negative rate < 1% on this set.
- **Audience estimation accuracy (CC-003):** estimated vs. known-demographic validation panel; MAE thresholds per demographic dimension; tracked per model version.

### 11.3 Localization

- **Urdu/Roman-Urdu query translation (Doc 15 B2):** golden query set (200 queries: Urdu script, Roman Urdu, code-switched) → intent-preservation assertions on translated structured queries; NFR-P02 budget applies to this path specifically (§5.1).
- **Bidi rendering (Doc 12 Part E):** visual regression tests (Playwright screenshots) on mixed RTL/LTR creator names, bios, and notes; Urdu fallback typography (ADR-015) renders without tofu on the CI font matrix.
- **Jumu'ah exclusion (Doc 20 I8):** clock-controlled tests around window boundaries (start/end edge minutes, timezone of workspace vs. UTC storage), DST-irrelevant but Ramadan-adjacent schedule shifts covered as parameterized cases; property test: no send timestamp ever falls inside the configured window for any generated schedule.

---

## 12. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-QA-001 (new)** | Quality | Race suites give false confidence (schedulers don't explore real interleavings) | M | H | ≥100 randomized iterations nightly; pooled-connection variants; production metrics (sweeper/last-gate/lock-wait) as the runtime backstop |
| **R-QA-002 (new)** | Quality | Flaky-test accumulation erodes gate trust | M | M-H | Quarantine policy + SLA + dashboard; merge-block on expired SLA |
| **R-QA-003 (new)** | Quality | Golden sets drift from real PK creator distribution | M | M | Quarterly golden-set refresh from production sampling (anonymized per Doc 21 classification) |
| **R-QA-004 (new)** | Quality | Sandbox provider behavior diverges from production (esp. Paddle, BSP) | M | M-H | Nightly contract drift detection (§8); fetch-to-heal as prod backstop; A-031 monitoring |
| **R-QA-005 (new)** | Cost | S2-scale perf environments (500k corpus, 10k VU) inflate CI cost | M | L-M | Perf suite on staging nightly/pre-release only, not per-MR; scale-to-zero Neon branches |
| R-TEC-008 | Technical | Garbage-in scoring | M | H | **Strengthened:** adversarial corpus + differential scoring assertions (§6.3); residual Low-Med |

---

## 13. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-075 | Neon ephemeral branches provision fast enough (< 60 s) for per-MR integration runs | Med-High (validate week 1 of CI build-out) |
| A-076 | A human-labeled PK ground-truth set (~500 creators) is producible for §11.2 accuracy testing | Med (labeling effort budgeted; blocks CC-003 validation otherwise) |
| A-077 | Canary panel accounts remain stable enough that panel churn < 20%/quarter | Med (A-072 runbook hedges) |
| A-078 | k6 staging load tests at 10k VU don't trip provider abuse controls (Vercel/Neon) | Med (coordinate with providers; use load-test headers) |
| A-064 | *(validation scheduled)* RLS overhead < 10% on NFR-P01 path — §5.1 test is the resolution gate | Med-High |
| A-069 | *(validation scheduled)* Meilisearch sync-write p99 < 5 s — §5.3 is the resolution gate | Med |

**Dependencies:** Doc 26 (pipeline realization of §9, auto-rollback wiring for §10.4), Doc 27 (rollback drill runbook, capacity model from §5.3, canary panel refresh runbook), Doc 25 (review checklist integration of §10.1), Doc 23 (every mechanism-guarding alert paired with its trigger test), Doc 29 (canary workspace access rules for staff).

**Open questions:**
1. Ownership of golden-set labeling (internal vs. contracted) and inter-rater reliability threshold — needed before A-076 resolves.
2. Whether the tenancy production canary should also perform *write* probes (stronger signal, more blast-radius risk) — recommend read-only until S2, revisit after first pentest.
3. Visual regression baseline management for Bidi tests across font-rendering differences in CI runners — pin a rendering container image?

---

**End of Document 24.**

[AWAITING APPROVAL]


---

<a name="doc-025"></a>
# DOC-025 — Engineering Standards and Code Review Guidelines

# Document 25: Engineering Standards & Code Review Guidelines

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 19 (Schema), Doc 20 (API), Doc 21 (Security), Doc 22 (Infrastructure), Doc 23 (Observability), Doc 24 (Testing)
**Governing ADRs:** ADR-017, ADR-019, ADR-020, ADR-022, ADR-026, ADR-028

---

## 1. Code Style & Formatting

### 1.1 Language & Toolchain

- **TypeScript everywhere** — monolith (Next.js) and worker fleet share one repo, one `tsconfig` base, one dependency graph (modular monolith, ADR-017). `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` are non-negotiable; `any` requires an inline justification comment and is lint-flagged.
- **Formatting is not reviewed — it is enforced.** Prettier (default config + 100-char width) runs on pre-commit and CI; a formatting diff in review is a tooling bug, never a discussion.
- **ESLint config layers:** base (typescript-eslint recommended-strict) + MUSHIN custom rules, which encode prior documents' invariants as lint:
  - `mushin/no-raw-sql` — string-built SQL banned (Doc 21 §4)
  - `mushin/no-advisory-session-lock` — Doc 22 §1.2 ban (allowlist: sweeper's `pg_try_advisory_xact_lock`)
  - `mushin/no-cross-plane-join` — query text joining `gcp.*` to `wp.*` outside the bridge repository (PATCH-001)
  - `mushin/metric-attribute-allowlist` — closed attribute sets, no `workspace_id` in metrics (Doc 23 R-OBS-003)
  - `mushin/no-c1-in-logs` — C1 field-name denylist in logger call sites (Doc 21 §3.1)
  - `mushin/adapter-import-boundary` — adapter classes importable only in worker-plane entry points (Doc 21 §3.2 IAM invariant mirrored at compile time)

### 1.2 Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Modules | `M<number>-<name>` directories | `modules/m5-discovery/` |
| Files | kebab-case | `credit-reservation.service.ts` |
| Types/classes | PascalCase; suffixes `Service`, `Repository`, `Adapter`, `Handler` | `LedgerRepository` |
| Functions/vars | camelCase; booleans prefixed `is/has/can` | `canSettleReservation` |
| DB entities | snake_case, singular tables (per Doc 19) | `workspace_creator_link` |
| Queue classes | `q-<domain>-<priority>` (Doc 22 §1.3) | `q-rescore-low` |
| Metrics | `mushin.<domain>.<metric>` (Doc 23 §2.1) | `mushin.credits.swept` |
| Error codes | Doc 20 catalogue families | `AUTHZ_WORKSPACE_MISMATCH` |
| Env vars | `MUSHIN_<SCOPE>_<NAME>` | `MUSHIN_LLM_API_KEY` |

**IDs:** prefixed ULIDs throughout (`wsp_`, `usr_`, `crt_`, `job_`, `rsv_`) — matching Doc 19/20; the prefix makes log lines and support tickets self-describing.

### 1.3 Comments & Documentation

- JSDoc required on: exported functions of every module's public surface, all adapter methods (documenting which ADR-022 obligation each satisfies), and any function marked `@TenancyExempt` (justification mandatory, reviewed).
- **Comment rule:** comments explain *why*, never *what*. A comment restating the code is deleted in review; a missing comment on non-obvious concurrency or ADR-driven behavior is a review blocker. Every workaround references its ticket or risk ID (`// R-INF-001: single-txn lock discipline`).

---

## 2. Git Workflow & Branching Strategy

- **Trunk-based:** `main` is always deployable (Doc 22 §6 pipeline). No long-lived develop branch, no release branches at S1/S2 — Vercel immutable deploys + worker image pinning provide rollback (Doc 24 §10.3); release branches add ceremony without benefit at our cadence.
- **Branch naming:** `feat/<module>-<slug>`, `fix/<module>-<slug>`, `hotfix/<slug>`, `chore/<slug>`, `migration/<slug>` (migration-only branches get extra CI gates, §5).
- **Commits:** Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `test:`, `chore:`, `migration:`) with module scope: `feat(m7-outreach): jumu'ah window boundary handling`. Enforced by commitlint. Changelog is generated, never hand-written.
- **MR process:**
  - MR template auto-populates the four review checklists (§3) as checkboxes plus: linked issue, risk register impact (yes/no + ID), rollback note.
  - **One approval minimum; two for:** ledger/billing code, consent/outreach scheduling, migrations, prompt promotions, anything `@TenancyExempt`, adapter contract changes. CODEOWNERS routes these automatically.
  - **Squash-merge to main** — one commit per MR, MR title becomes the commit message (commitlint applies to MR titles). Feature branches rebase on main; merge commits into feature branches are banned (linear history keeps bisect useful).
  - Draft MRs encouraged early; CI runs on drafts.

---

## 3. Code Review Checklist

The four checklists below are the canonical review artifact — embedded in the MR template, and the reviewer confirms each applicable item. "N/A" is a valid answer; an *unexamined* item is not.

### 3.1 Security (Doc 21 §8, mechanized where possible)

| Item | Enforcement |
|---|---|
| Tenancy predicate present, or `@TenancyExempt` with justification + second reviewer | Lint + human |
| No raw SQL; parameterized only | `mushin/no-raw-sql` + human |
| C1/C2 never logged; new fields registered with redaction middleware if PII-bearing | Lint + human |
| New endpoint registered in rate-limit config **and** Doc 20 inventory (auto-enrolls in tenancy sweep, Doc 24 §6.1) | CI inventory check |
| Webhook handlers verify-before-parse | Human + Doc 24 §6.4 test required |
| Adapter changes uphold all seven ADR-022 obligations | Conformance suite + human |
| Prompt changes: version bump + eval gates (§6) | Prompt Registry CI |
| New `wp.*` table ships RLS policy in same migration | Migration linter |
| Secrets: none in code/config; new secrets registered per-env in secret manager | Secret scan + human |

### 3.2 Performance

- `EXPLAIN` output attached for any new/changed query on NFR-P01/P02 paths or Timeline (PATCH-003 discipline); plan must show expected index usage.
- No N+1: repository methods returning collections must batch; review flags loops containing awaited repository calls.
- Unbounded collections paginated per Doc 20 (cursor vs. offset per contract) — no `findAll` without limit.
- New hot-path code: does it add an adapter call, LLM call, or lock acquisition inside a loop? If yes, justify against budget.

### 3.3 Testing (Doc 24 §10.1)

- Coverage ratchet green; touched invariant-dense domain → its property/patch suite updated; new endpoint → contract test present; new race surface → entry added to the §7 race matrix; new feature journey → E2E added or explicitly deferred with ticket.

### 3.4 Documentation & Observability

- Metrics per Doc 23 naming/cardinality conventions; every new alert rule ships with its runbook link (Doc 23 rule: no runbook, no alert); module manifest updated (§4); ADR written if a decision of record was made (§10.3); README delta if architecture moved.

**Review culture:** reviews respond within one business day; blocking comments cite the standard or document they enforce ("blocks per Doc 21 §2.2", not "I'd prefer"); style opinions not encoded in lint are non-blocking by definition.

---

## 4. Module Manifest Requirements

Every module `M1-M13` carries `manifest.yaml` at its root — a versioned, reviewed artifact:

```yaml
module: M6-billing
owner: "@eng-core"          # team or individual
coverage_gate: 95            # Doc 24 §2.1
depends_on:
  modules: [M1-identity]
  adapters: [paddle]
api_surface:                 # must match Doc 20 inventory
  - "POST /v1/credits/reserve"
  - "GET  /v1/ledger"
test_suites:
  unit: true
  integration: [PATCH-004, PATCH-005]
  property: [ledger-invariants]
metrics:
  - mushin.credits.reserved
  - mushin.ledger.lock_wait_ms
alerts_owned:
  - ledger-lock-p99          # runbook: docs/runbooks/ledger-lock.md
```

**CI cross-checks the manifest:** declared API surface diffed against the Doc 20 inventory; declared metrics against actual emission (a declared-but-never-emitted metric fails, as does emitted-but-undeclared); declared patch suites must exist and be green. The manifest is thus the module's *contract with the rest of the documentation set*, kept honest mechanically. Manifest changes require the module owner's approval.

---

## 5. Migration Authoring Standards (Doc 22 §6.2)

- **Format:** Flyway-class versioned SQL — `V<yyyymmddHHMM>__<slug>.sql`, forward-only; no down-migrations (rollback = expand-contract guarantees + PITR, never reverse SQL).
- **Expand-contract mandatory:** additive change → deploy code reading both shapes → backfill → contract in a *later* migration (minimum one release between expand and contract). The contract migration's MR must link the expand MR.
- **Linter rules (CI-blocking):**
  1. Any statement class acquiring `ACCESS EXCLUSIVE` requires `SET lock_timeout = '5s'` preamble and a retry note.
  2. All index creation uses `CREATE INDEX CONCURRENTLY` (and therefore lives in its own non-transactional migration).
  3. New `wp.*` table without an RLS policy in the same file → fail (R-SEC-008).
  4. `ALTER TABLE ... ADD COLUMN` with volatile default, table rewrites on partitioned parents, and type-narrowing changes → fail with pattern guidance.
  5. Touching `workspace_credit_balance`, `interaction_timeline`, or `workspace_creator_link` → requires two approvals (CODEOWNERS) and the relevant patch suite in the MR pipeline.
- **Partitioning:** monthly partition pre-creation job (3 months ahead) is the *only* creator of Timeline partitions; migrations never create partitions ad hoc. Deploy-gate check for next-month partition (Doc 22 §6.2) stays as the backstop.
- **Testing:** every migration runs against previous-schema + representative-data snapshot; previous app version's repository suite passes post-migration (Doc 24 §3.2).

---

## 6. Prompt Engineering Standards (ADR-019)

### 6.1 Registry Workflow

Prompts are code: they live in the repo under `prompts/<stage>/<name>/`, with `prompt.md` (template), `schema.json` (output schema), `evals/` (golden + injection sets), and `meta.yaml` (version, model compatibility, cost profile).

**Change flow:** edit → **version bump mandatory** (CI fails on content change without bump — Doc 24 §2.4 snapshot enforcement) → eval pipeline runs:
1. Output-schema conformance on golden set (< 0.5% violation, Doc 24 §8)
2. Quality regression vs. current version (±2% aggregate tolerance, Doc 24 §11.2)
3. **Injection eval set pass** (Doc 21 §8 — gate precedes cost consideration)
4. Cost delta report: measured cost-per-score (Doc 23 §5.1 attribution) old vs. new + batch re-scoring estimate for the affected snapshot population
5. **CPO cost-gate approval** (ADR-028) recorded in the MR — promotion without the recorded approval is blocked by a required MR label check
6. Promotion → PATCH-010 campaign enqueued to `q-rescore-low`

### 6.2 Prompt Structure Rules

- Scraped/user content appears **only** in fenced, schema-bound data sections — never interpolated into instruction text (Doc 21 §3.4 structural isolation). Lint: template variables are only legal inside registered data fences.
- Output must be schema-parseable; prompts must instruct nothing that the grounding validator can't verify (every claim field pairs with an evidence-span field).
- Model version pinned in `meta.yaml`; a model change is a version bump with the full eval flow — the `(prompt_version, model_version)` provenance triple (PATCH-010) is honest only if both dimensions are governed.

### 6.3 Review

Prompt MRs require: one engineer (schema/pipeline correctness) + the prompt steward (quality/eval judgment). The reviewer checks eval diffs, not vibes: which golden cases changed and why.

---

## 7. Adapter Development Standards (ADR-022)

Every adapter implements the seven obligations; the shared conformance suite (Doc 24 §8.2) is the acceptance test. Implementation standards per obligation:

| # | Obligation | Standard |
|---|---|---|
| 1 | **Credential management** | KMS-wrapped, per-env (Doc 22 §4); constructed only in worker plane (`mushin/adapter-import-boundary`); credentials never appear in adapter method signatures or thrown errors |
| 2 | **Retry discipline** | Exponential backoff + jitter from the shared retry util (no hand-rolled loops); retries only on idempotent-safe operations — each method declares `idempotent: boolean` and the base class refuses to retry unsafe ones |
| 3 | **Circuit breaker** | Shared breaker util; thresholds in adapter config (error-rate %, latency p99, window); state transitions emit `adapter.circuit_state` (Doc 23 §2.2) |
| 4 | **Cost emission** | `cost_event` per billable call (Doc 23 §5.1) with full attribution; a new adapter without cost mapping fails conformance |
| 5 | **Health reporting** | Success rate, latency, quota headroom emitted per Doc 23 §6 field conventions |
| 6 | **Degraded-mode contract** | Named degraded states enumerated in the adapter's manifest (e.g., `apify.instagram: STALE_CACHE_OK`, `llm: QUEUE_FOR_RETRY`); callers switch on named states, never on error strings; Doc 20's degraded-behavior endpoint mapping consumes these names |
| 7 | **Sandbox parity** | Conformance fake (scriptable failures) + provider-sandbox config ship with the adapter; nightly sandbox run wired before first production use |

**New adapter checklist:** manifest entry, conformance suite green against fake and sandbox, cost model documented, degraded states mapped in Doc 20 terms, canary/health panel added (Doc 23 §6), secret registered per-env.

---

## 8. Error Handling Standards

- **All thrown application errors are `MushinError` subclasses** carrying a Doc 20 catalogue code; throwing raw `Error` on an API path is lint-flagged. Unknown/unexpected exceptions map to `INTERNAL_ERROR` at the boundary with full trace capture — never leak internals in the envelope.
- **Envelope (Doc 20):** `{ error: { code, message, request_id, details? } }` — `message` is the user-facing string; `details` is machine-readable and PII-free.
- **User-facing messages:** plain language, actionable, no jargon or internal identifiers ("Your workspace doesn't have enough credits for this discovery. Add credits or reduce the job size." — not "reservation failed: insufficient usable_balance"). Urdu-market tone guidance per Doc 12; messages live in a copy catalogue, not inline strings, for future localization.
- **Logging pairing:** every `error`-level log line carries the catalogue code (`error_code` field, Doc 23 §2.1 closed set) — dashboards slice by code family.
- **Swallowed errors are banned:** empty catch blocks fail lint; intentional suppression uses `suppressError(err, reason)` which logs at `warn` with the reason.

---

## 9. Dependency Management

- **Security patches:** Renovate auto-MRs; critical CVEs merged within 48 h (pipeline green required, but review may be expedited single-approver).
- **Feature updates:** batched weekly Renovate MRs; major-version bumps require a named owner and a migration note.
- **Vulnerability scanning:** per-CI dependency scan (Doc 21 §8); a new critical vuln in the lockfile blocks merges repo-wide until triaged (accept-with-ticket or patch).
- **License compliance:** allowlist (MIT, Apache-2.0, BSD, ISC); copyleft additions require explicit sign-off; CI license check on lockfile changes.
- **Lockfile:** `pnpm-lock.yaml` committed always; `pnpm` frozen-lockfile in CI; lockfile-only diffs reviewed for unexpected transitive additions (supply-chain hygiene — R-TEC-007's cousin in our own dependency tree).
- **Pinning:** direct dependencies pinned exact; no `^` ranges — Renovate owns movement, humans own approval.

---

## 10. Documentation Standards

### 10.1 READMEs

Per-module README template: purpose (one paragraph), manifest summary link, local dev/test commands, key invariants with ADR references, "things that will bite you" section (required — institutional memory is a deliverable).

### 10.2 API Documentation

OpenAPI spec is **generated from code** (route schema declarations) and CI-diffed against the Doc 20 inventory — the spec, the inventory, and the tenancy sweep (Doc 24 §6.1) share one source of truth. Spec publication pipeline lands in Doc 26.

### 10.3 ADR Workflow

- New ADRs use the established template (Context / Decision / Consequences / Status), numbered sequentially after ADR-028, committed under `docs/adr/`.
- **Trigger rule:** any MR that (a) forecloses a future option, (b) contradicts or amends an existing ADR, or (c) selects a provider/pattern others must follow → ADR required. Reviewers ask "is there a decision of record hiding in this MR?"
- Amendments reference the amended ADR (as ADR-016 amends ADR-002); ADRs are never edited in place after acceptance.

### 10.4 Runbooks

Template (full set in Doc 27): trigger (which alert), impact, diagnosis steps (with exact Axiom/Grafana queries), remediation, escalation, verification. Doc 23's "no runbook, no alert" rule makes runbook authoring part of feature DoD, not an ops afterthought.

---

## 11. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-ENG-001 (new)** | Engineering | Custom lint rules drift from the documents they encode (rule exists, invariant evolved) | M | M | Lint rules carry doc-section references in their metadata; doc-change checklist includes "update encoded lint?"; quarterly standards review |
| **R-ENG-002 (new)** | Engineering | Two-approver domains bottleneck on a small team | M-H | M | CODEOWNERS lists ≥2 eligible reviewers per domain; founder/CTO is universal fallback; measure MR cycle time, revisit at S2 |
| **R-ENG-003 (new)** | Engineering | Manifest/CI cross-checks become ceremony and get rubber-stamped | M | M | Cross-checks are *mechanical* (CI fails, not humans nag); checklist items without enforcement are candidates for deletion in quarterly review |
| **R-ENG-004 (new)** | Supply chain | Malicious transitive dependency enters via lockfile churn | L-M | H | Exact pinning, Renovate-only movement, lockfile diff review, CI vuln scan; worker egress allowlist (Doc 24 §6.2) limits blast radius |
| **R-ENG-005 (new)** | Engineering | Prompt steward becomes single point of failure for LLM quality judgment | M | M | Eval gates are automated floors; steward judgment is additive; second steward trained by S2 |

---

## 12. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-079 | Team size at S1 (~3-5 eng) can sustain the two-approver domains without cycle-time collapse | Med (R-ENG-002 monitoring resolves) |
| A-080 | Route-schema-to-OpenAPI generation covers 100% of Doc 20 surface without hand-written spec patches | Med-High (spike in first CI build-out) |
| A-081 | Custom ESLint rules (cross-plane join, C1-in-logs) are implementable with acceptable false-positive rates | Med-High (AST patterns are tractable; human checklist is the fallback) |
| A-082 | Conventional Commits + squash discipline holds without a dedicated release manager | High |

**Dependencies:** Doc 26 (CI realization of every gate named here: lint, manifest cross-checks, migration linter, prompt eval pipeline, OpenAPI publication), Doc 27 (runbook template consumption), Doc 24 (checklists §3.3 reference its gates), Doc 29 (CODEOWNERS domains align with staff role boundaries where staff-plane code is touched).

**Open questions:**
1. Monorepo tooling choice (Turborepo vs. Nx) for module-scoped CI — affects how manifest-driven test selection is implemented; decide in Doc 26.
2. Whether prompt steward role needs formal definition in Doc 29's permission matrix (leaning yes — prompt promotion is a cost-bearing capability, adjacent to ADR-028's CPO gate).
3. Copy catalogue tooling for §8 user-facing messages (simple JSON catalogue vs. i18n framework now) — recommend JSON catalogue at S1, framework decision deferred to first localization milestone.

---

**End of Document 25.**

[AWAITING APPROVAL]


---

<a name="doc-026"></a>
# DOC-026 — CI-CD Pipeline and Release Management

# Document 26: CI/CD Pipeline & Release Management

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 21 (Security), Doc 22 (Infrastructure), Doc 23 (Observability), Doc 24 (Testing), Doc 25 (Standards)
**Governing ADRs:** ADR-017, ADR-019, ADR-020, ADR-022, ADR-026, ADR-027, ADR-028
**Applied Patches:** PATCH-003 (partition gate), PATCH-004/005/006/009/010 (suite gating and infra deploy paths)

---

## 1. Pipeline Architecture Overview

### 1.1 Platform Selection — GitHub Actions

- **Selection gates:** OIDC federation to AWS IAM (Doc 22 §4 — no long-lived CI cloud keys, hard requirement), native Vercel/Railway/Neon integrations, matrix + reusable workflows, per-job secret scoping, merge queue support.
- Pipeline definitions are **pipeline-as-code**: `.github/workflows/*.yml` plus reusable composite actions under `.github/actions/`. Workflow changes are reviewed like any code — and changes to *deploy* workflows require two approvals (CODEOWNERS, extending Doc 25 §2's sensitive-domain rule: the pipeline is itself a privileged system).
- **Merge queue:** MRs merge through a queue that runs the release-blocking suite against the *merged* result — eliminating "green on branch, red on main" races on a trunk-based repo (Doc 25 §2).

### 1.2 Stage Graph

```
[Static Analysis] ──┬── [Unit] ──────────────┐
                    ├── [Build & Package] ────┤
                    └── [Prompt Eval]* ───────┤
                                              ▼
                          [Integration] ── [Contract]
                                              ▼
                                     [Deploy Staging]
                                              ▼
                                     [Staging Smoke]
                                              ▼
                                          [E2E]
                                              ▼
                                 [Production Promotion Gate]
                                              ▼
                                    [Deploy Production]
                                              ▼
                                  [Post-Deploy Verification]

Nightly/pre-release (parallel track): [Performance] [Security-Extended] [Adapter Sandbox] [Contract Drift]
```
\* Prompt Eval runs only when `prompts/**` changes.

**Parallelization rules:** Static, Unit, Build, and Prompt Eval fan out in parallel from the same commit (no interdependencies). Integration waits on Static only (fail fast on lint before paying for a Neon branch). Contract runs alongside late Integration shards. Everything downstream of Deploy Staging is strictly sequential — deploys are not parallelizable events.

### 1.3 Caching Strategy

| Cache | Mechanism | Key |
|---|---|---|
| Dependencies | `pnpm` store cache (Actions cache) | lockfile hash |
| Build artifacts | Turborepo remote cache (§11) | task hash (inputs + deps) |
| Test results | Turborepo cache — unchanged modules' unit tests are cache hits, not re-runs | task hash |
| Container layers | Registry layer cache | Dockerfile + context hash |

**Cache poisoning guard:** remote cache writes only from `main` and merge-queue runs; branch pipelines read-only. A cache-restored test result is trusted only because its inputs hash identically — Turborepo's model, stated here as policy.

---

## 2. Build Stages

### 2.1 Static Analysis Stage (~3 min, fail-fast)

Runs as parallel jobs within the stage:

| Check | Source |
|---|---|
| ESLint incl. all six custom MUSHIN rules (`no-raw-sql`, `no-advisory-session-lock`, `no-cross-plane-join`, `metric-attribute-allowlist`, `no-c1-in-logs`, `adapter-import-boundary`) | Doc 25 §1.1 |
| Prettier check | Doc 25 §1.1 |
| `tsc --noEmit` strict | Doc 25 §1.1 |
| Migration linter (runs only when `migrations/**` changes; enforces the five rules of Doc 25 §5) | Doc 22 §6.2 |
| Tenancy annotation audit (`@TenancyExempt` inventory diff — new exemptions flagged for the two-approver path) | Doc 21 §2.2 |
| Secret scanning (gitleaks-class, full diff) | Doc 21 §6.2 |
| License allowlist check (lockfile changes only) | Doc 25 §9 |
| Dependency vulnerability scan; critical CVE → repo-wide merge block flag | Doc 21 §8, Doc 25 §9 |
| commitlint on MR title (squash-merge message) | Doc 25 §2 |

### 2.2 Unit Test Stage (~5 min)

- Module-scoped via Turborepo (§11): only changed modules + dependents execute; the rest are cache hits.
- Coverage ratchet enforced per module manifest (`coverage_gate`, Doc 24 §2.1 / Doc 25 §4) — the ratchet's high-water marks are stored as a repo artifact updated on main merges.
- Property suites (ledger, identity resolution, pagination — Doc 24 §2.3) run in **reduced-iteration mode per-MR** (20 iterations, fixed seeds) and full randomized mode nightly (≥100 iterations, per Doc 24 §7).
- Prompt snapshot tests (Doc 24 §2.4): render + schema snapshots; content-change-without-version-bump fails here.

### 2.3 Integration Test Stage (~12 min)

**Provisioning preamble (composite action `provision-ci-env`):**
1. Create Neon branch `ci-<pipeline_id>` from the migration-baseline branch (a maintained branch with schema + minimal seed, so per-pipeline setup applies only *new* migrations — keeps A-075's <60 s target realistic).
2. Apply pending migrations; run schema assertions (RLS presence per `wp.*` table, PATCH-003 index existence, partition layout).
3. Create SQS queues `ci-<pipeline_id>-*` (full class set incl. FIFO + DLQs) via a scoped IAM role that can only create/delete `ci-*`-prefixed resources.
4. Seed synthetic corpus (pinned seed per suite, Doc 24 §1.3).

**Suites (sharded across 4 runners):**
- **The ten ARB patch suites (Doc 24 §3.1) — release-blocking, every MR.** PATCH-004 runs both direct and pooled-connection variants (R-INF-001 gate).
- DB integration: RLS raw-SQL sweep, generated columns, migration forward-compat (previous app version's repository suite vs. new schema — Doc 24 §3.2).
- Queue integration: FIFO per-key ordering, DLQ, priority-by-class, outbox relay crash/redelivery (Doc 24 §3.3).
- Adapter tests against **conformance fakes** (real sandbox runs are nightly only — provider flakiness must not block merges, Doc 24 §3.4).

**Teardown (always-runs, even on failure):** destroy Neon branch + `ci-*` queues; a nightly janitor deletes any orphaned `ci-*` resources older than 6 h (R-CI-003 mitigation).

### 2.4 Contract Test Stage (~4 min)

- API contract tests: response schemas, all 35 error codes, rate-limit headers, pagination contracts (Doc 24 §8).
- Adapter conformance suite vs. every adapter's fake (seven ADR-022 obligations, Doc 25 §7).
- Webhook fixture contracts (Paddle/Gmail/Outlook recorded fixtures).
- LLM output schema contracts on golden-set fixtures.
- **OpenAPI diff:** spec generated from route schemas (A-080) → diffed against the committed Doc 20 inventory → breaking changes (removed endpoint, narrowed type, new required field) fail with a labeled report; additive changes require the inventory file updated in the same MR (keeping Doc 24 §6.1's tenancy sweep auto-enrollment honest).

### 2.5 Build & Package Stage (~6 min, parallel with tests)

- Next.js production build (Vercel build output API).
- Worker container image: multi-stage Dockerfile, distroless runtime, SBOM generated and attached, image signed (cosign) — deploy stages verify signatures (supply-chain, R-ENG-004 adjacency).
- **Module manifest cross-checks** (Doc 25 §4): declared API surface vs. generated OpenAPI; declared metrics vs. static emission scan; declared suites exist and are in the pipeline graph.
- **Prompt eval pipeline** (conditional on `prompts/**`): golden-set conformance + quality regression + injection eval set (Doc 25 §6.1 steps 1-3); cost delta report posted as an MR comment; **promotion label check** — the `cpo-cost-gate-approved` label (applied only by CPO role) is required for merge when a prompt version bump is present (ADR-028 gate, mechanized).

### 2.6 Deploy Staging Stage

Sequence (strictly ordered):
1. **Migration gate job:** apply migrations to staging DB → verify (schema assertions + **next-month Timeline partition existence check**, Doc 22 §6.2) → proceed only on green. A migration failure stops everything before any app deploy.
2. Vercel staging deployment (aliased atomically).
3. Worker fleet rolling deploy to staging (drain-then-replace).
4. **Staging smoke** (Doc 24 §10.4 suite pointed at staging): login, search, canary-workspace job create+poll, webhook receiver health, consumer liveness. Red smoke → staging marked broken, main frozen for deploys until fixed (fix-forward or revert MR).

---

## 3. E2E, Performance & Security Stages

### 3.1 E2E Stage (merge-to-main, ~25 min)

The five journeys of Doc 24 §4 against staging with sandbox providers: onboarding, Two Brains full flow (reserve → discover → poll → PATCH-009 searchability → settle), Paddle lifecycle (incl. duplicate-webhook and suppressed-webhook heal cases), outreach sequence (clock-controlled Jumu'ah + PATCH-006 last-gate), GDPR erasure E2E. **E2E green is a production promotion gate** — production never receives a build whose E2E didn't pass on staging.

### 3.2 Performance Stage (nightly + pre-release, not per-MR — Doc 24 R-QA-005)

- k6 NFR suites (P01/P02/P03) against staging at S2-scale corpus; **trend gate:** p95 regression >10% vs. 7-day baseline fails and blocks the next production promotion until triaged.
- Ledger contention at 500-concurrent scale; Timeline 24-month query set; queue/outbox throughput; Meilisearch sync-write p99 (A-069 tracking).
- Results published to a Grafana dashboard — performance history is an artifact, not a CI log.

### 3.3 Security Stage (nightly + pre-release)

- Full tenancy endpoint sweep (per-MR runs a changed-endpoints subset; nightly runs all of Doc 20's inventory).
- Prompt injection corpus through the staging Brain 2 pipeline (Doc 24 §6.3, differential assertions).
- Webhook forgery matrix, OAuth theft simulation, staff-plane separation tests (Doc 24 §6.4).
- DAST scan against staging (Doc 21 §8 weekly commitment satisfied by nightly).
- Annual external pentest is scheduled *outside* CI but its findings enter as required-fix gates on the release checklist.

### 3.4 Nightly Auxiliary Tracks

Adapter sandbox runs (all six Apify actors vs. canary panel, Paddle sandbox lifecycle, mail test tenants, BSP sandbox — Doc 24 §3.4); webhook contract drift detection (Doc 24 §8, A-031 watch); full-iteration race matrix (Doc 24 §7); flaky-test detector updating the quarantine list (Doc 24 §9).

---

## 4. Environment Provisioning

- **Neon branches:** lifecycle per §2.3; baseline branch refreshed weekly (migrations + reseed) to keep per-pipeline migration application shallow.
- **Queue namespaces:** `ci-*` creation via the scoped provisioner role; Terraform manages *shared* queues (dev/stg/prod), the provisioner action manages *ephemeral* ones — the split keeps Terraform state free of transient resources.
- **Secret injection:** GitHub OIDC → AWS IAM role per workflow, with **per-stage role granularity**: Static/Unit stages get *zero* cloud credentials; Integration gets the `ci-provisioner` role; Deploy Staging gets staging-scoped roles; Deploy Production gets prod deploy roles gated by environment protection rules (required reviewers on the `production` environment = the human promotion approval, §9). Provider tokens (Vercel, Railway, Neon API) live in GitHub environment-scoped secrets synced from the central secret manager (Doc 22 §4 single source of truth).
- **No pipeline stage can read a secret it doesn't need** — the Doc 22 §4 stage-scoping requirement realized via GitHub environments + job-level secret references.

---

## 5. Deployment Strategy

### 5.1 Web Tier (Vercel)

- Preview deployment per branch (MR reviewers get a URL; preview uses dev-tier providers, never prod data).
- Staging and production are aliased atomic deployments; **promotion is an alias flip of the already-built, already-staged artifact** — production deploys exactly the bytes E2E tested, never a rebuild.

### 5.2 Worker Fleet (Railway)

- Rolling drain-then-replace (Doc 22 §6.1): SIGTERM → stop polling → finish in-flight (bounded by job timeout) → exit; redelivery via at-least-once + idempotent consumers (ADR-020) covers hard kills.
- **Canary step (production only):** deploy one worker instance on the new image consuming `q-discovery-standard`; hold 15 minutes; automated comparison of canary vs. fleet on `adapter.errors`, job failure rate, and processing latency; healthy → fleet rollout; unhealthy → canary killed, promotion reverted, Sev3 raised.
- Images pinned by digest (not tag) in the deploy manifest — rollback re-pins the previous digest (§6).

### 5.3 Database Migrations

- Pre-deploy gate job order: **migrate → verify → deploy app** (Doc 22 §6.2). Expand-contract (Doc 25 §5) guarantees the running previous version tolerates the migrated schema, so the gate job and app deploy need not be atomic.
- Contract-phase migrations additionally require: the expand-phase release has been in production ≥1 release cycle (checked via migration metadata linking expand→contract MRs, Doc 25 §5).
- Partition pre-creation is the monthly scheduled job (Doc 22 §5); the deploy gate's existence check is the backstop, never the creator.

---

## 6. Rollback Procedures

| Tier | Mechanism | Time | Notes |
|---|---|---|---|
| Web | Vercel alias revert to previous deployment | Instant | One command / one click; previous deployment always retained |
| Workers | Re-pin previous image digest → rolling redeploy | ~5 min | Queue durability means rollback = brief throughput dip, no loss |
| Config/flags | Flag revert (§7) — preferred first response when the change was flag-wrapped | Instant | Try the flag before the deploy rollback |
| Database | **Never rolled back with the app.** Expand-contract means old app + new schema is safe. Data-corruption events → PITR restore (Doc 22 §8) + fetch-to-heal reconciliation for Paddle-sourced state (R-FIN-007) + ledger reconciliation replay (ADR-012 auditability) | ≤4 h RTO | Sev1 path, runbook in Doc 27 |

- **Auto-rollback:** post-deploy smoke failure (§10) triggers automatic web alias revert + worker re-pin, then pages (Sev2) — rollback first, diagnose second.
- **Quarterly drill** (Doc 24 §10.3) exercises the full manual path including worker re-pin and a PITR restore-to-staging; drill results feed Doc 27's runbook accuracy.

---

## 7. Feature Flag Management

- **Platform: Unleash** (self-hostable-later, managed now) — selection gates: server-side evaluation (flags must not require shipping evaluation logic + flag data to clients for workspace-scoped gating), audit log of flag changes, API for CI integration. LaunchDarkly is functionally superior but cost-disproportionate at S1 (integration-first ≠ price-insensitive).
- **Evaluation:** server-side only at S1/S2; flag context = `workspace_id`, `user_id`, `env`. Client receives resolved booleans via the session payload — no flag SDK in the browser (smaller attack/perf surface, consistent with ADR-023's no-public-API posture).
- **Lifecycle:** `draft → active → deprecated → removed`, with **flag debt control:** every flag declares an owner and an expiry review date in the module manifest (`flags_owned`, extending Doc 25 §4); CI warns on flags past review date; a flag `deprecated` >2 releases must be removed (lint on flag-key references).
- **Release integration:** risky features ship flag-wrapped and dark; deploy ≠ release. Kill-switch flags are mandatory for: new adapters, prompt-pipeline behavior changes, and outreach scheduling changes (the domains where Doc 21/24 concentrate risk).
- **A/B testing:** out of scope at S1 (no experimentation platform); Unleash gradual rollouts (percentage by workspace) suffice for canarying features.

---

## 8. OpenAPI Spec Generation & Publication

- Generated from route schema declarations at build time (§2.4; A-080).
- **Diff gates:** breaking-change detector classifies diffs (breaking / additive / docs-only); breaking → fail unless MR carries `api-breaking-approved` label (two approvals, Doc 25 §2); additive → inventory file must be updated in-MR.
- **Publication:** spec artifact versioned per release and published to an internal developer portal (simple static docs site rendered from the spec, deployed as part of the docs pipeline). **Internal only** — ADR-023: no public API at S1/S2, so no public spec; the publication pipeline is nonetheless built now, making the eventual S3+ public API a policy change rather than an engineering project.
- The spec is also the source for: contract test generation (§2.4), tenancy sweep enrollment (Doc 24 §6.1), and Doc 20 inventory reconciliation — one artifact, four consumers.

---

## 9. Production Promotion Gates

Promotion to production requires **all** of:

1. Merge-queue pipeline green: static, unit (ratchet), integration incl. **all ten ARB patch suites**, contract, manifest cross-checks.
2. Staging deploy + smoke green.
3. E2E suite green on the exact candidate build.
4. Nightly security stage green within last 24 h (or re-run on demand); per-MR tenancy subset green.
5. Performance trend gates within budget (last nightly run; a red trend blocks until triaged).
6. Migration gate verified incl. next-month partition existence.
7. No open Sev1/Sev2 bugs (label query against the tracker, checked mechanically).
8. **Human approval on the `production` GitHub environment** (one engineer; two during the first month post-GA) — the deliberate, auditable "go" moment.
9. Worker canary healthy (15-min hold, §5.2) before fleet completion.

Gates 1-7 are mechanical; gate 8 is judgment; gate 9 is empirical. Nothing else may be added to this list without an ADR — promotion-gate creep is a named failure mode (R-CI-002).

---

## 10. Post-Deploy Verification

1. **Smoke suite** (<5 min, Doc 24 §10.4): login, Brain 1 search, canary-workspace minimal discovery job create+poll, webhook receiver health probes, queue consumer liveness. **Failure → auto-rollback (§6) + Sev2 page.**
2. **Continuous canaries resume watch:** tenancy probe (5-min cadence, Sev1 on breach — Doc 24 §6.1) and Apify canary panel (4×/day — Doc 24 §11.1) are deployment-independent but their first post-deploy cycles are explicitly checked in the deploy log.
3. **Alerting self-verification:** post-deploy job emits a synthetic test event per critical alert path (test DLQ message in a designated verification queue, synthetic error-rate blip in a sandbox metric) and confirms the alert pipeline fires to a verification channel — deploys must not silently break the *detectors* (Doc 23 §4 rules are code too, deployed via this same pipeline).
4. **Observability config deploy:** dashboards/alerts-as-code (Doc 23 §7) apply in the same production deploy stage, diffed and versioned with the release.

---

## 11. Monorepo Tooling

**Decision (resolving Doc 25 open question #1): Turborepo.**

- **Rationale:** our graph is simple (modules + shared libs + two deploy targets); Turborepo's task-hash caching model directly implements §1.3 and module-scoped CI with near-zero config; Vercel-native remote cache removes a service to operate (ADR-002 instinct). Nx's generators/plugins solve problems we don't have at 3-5 engineers; revisit at S3 if the graph deepens.
- **Module-scoped CI:** `turbo run test --filter=...[origin/main]` — changed modules + dependents execute; manifest-declared suites are wired as Turborepo tasks so the manifest and the task graph cannot diverge (Doc 25 §4 cross-check).
- **Remote cache:** Vercel remote cache; write-restricted to main/merge-queue (§1.3 poisoning guard); cache hit rates exported as a CI health metric (a collapsing hit rate silently doubles pipeline cost — watched under R-CI-001).

---

## 12. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-CI-001 (new)** | Delivery | Pipeline duration creep erodes trunk-based flow (>30 min to merge) | M-H | M | Duration budget per stage tracked on dashboard; cache hit-rate metric; module-scoped execution; quarterly pipeline review alongside Doc 25's standards review |
| **R-CI-002 (new)** | Delivery | Promotion-gate creep makes releases rare and risky | M | M-H | Gate list is ADR-controlled (§9); deploy frequency is a tracked health metric (target: ≥daily) |
| **R-CI-003 (new)** | Cost/Hygiene | Orphaned `ci-*` Neon branches / SQS queues accumulate cost | M | L-M | Always-run teardown + nightly janitor + scoped provisioner role that can *only* touch `ci-*` |
| **R-CI-004 (new)** | Security | CI compromise (malicious workflow change, poisoned action) reaches production credentials | L-M | Critical | Two-approver deploy workflows, pinned third-party actions by SHA, OIDC short-lived creds, environment protection on prod, image signing + verify-at-deploy |
| **R-CI-005 (new)** | Delivery | Auto-rollback flaps on a flaky smoke test | L-M | M | Smoke suite held to zero-flake standard (immediate quarantine bypass = fix now); rollback trigger requires 2 consecutive smoke failures |
| R-INF-002 | Infrastructure | Railway platform risk | M | H | **Strengthened:** image-digest pinning + registry independence keeps Fly.io failover a config change (Doc 22 mitigation operationalized) |

---

## 13. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-083 | GitHub Actions merge queue + environments support the promotion model at our concurrency without enterprise-tier pricing surprises | Med-High |
| A-084 | Turborepo task hashing correctly captures all test inputs (incl. migrations, fixtures, prompt files) so cache hits are always safe | Med-High (audit task `inputs` globs in week 1; wrong globs = silent test skipping — the failure mode behind R-QA-001's spirit) |
| A-085 | Per-pipeline Neon branch + queue provisioning stays under 90 s end-to-end (refines A-075 with queue creation included) | Med |
| A-086 | Unleash managed tier supports server-side evaluation latency budget (<5 ms p99 in-process cached) | High |
| A-087 | Vercel "promote staged artifact" flow (no rebuild between staging and prod) is achievable with our Next.js config | Med-High (spike; fallback is build-twice with source-hash assertion) |

**Dependencies:** Doc 24 (every suite this pipeline orchestrates), Doc 25 (every gate this pipeline mechanizes), Doc 22 (deploy targets, secret model, migration strategy), Doc 23 (alert self-verification, pipeline health metrics), Doc 27 (rollback and deploy-failure runbooks; drill schedule), Doc 29 (who may approve production environment deploys, apply `cpo-cost-gate-approved` and `api-breaking-approved` labels — label-permission mapping lands there).

**Open questions:**
1. Deploy-frequency target enforcement: soft metric vs. hard "stale main" alert when main is undeployed >48 h — recommend soft at S1.
2. Whether staging Paddle sandbox isolation (Doc 22 open question #3) requires a second sandbox account before E2E Paddle suites run in parallel pipelines — likely yes once pipeline concurrency >1; decide at CI build-out.
3. SBOM publication/retention policy (compliance-grade supply-chain evidence) — coordinate with Doc 28's audit posture.

---

**End of Document 26.**

[AWAITING APPROVAL]


---

<a name="doc-027"></a>
# DOC-027 — Operational Runbooks and Incident Response

# Document 27: Operational Runbooks & Incident Response

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 21 (Security), Doc 22 (Infrastructure), Doc 23 (Observability), Doc 24 (Testing), Doc 26 (CI/CD)
**Governing ADRs:** ADR-012, ADR-020, ADR-021, ADR-022, ADR-025, ADR-026, ADR-027
**Applied Patches:** PATCH-005, PATCH-006, PATCH-009 (runbook subjects), PATCH-002 (erasure SLA operations)

---

## 1. Incident Response Lifecycle

### 1.1 Severity Definitions (binding, per Doc 23 §4.1)

| Sev | Definition | Ack SLA | Examples |
|---|---|---|---|
| **Sev1** | Data breach, tenancy leak, ledger corruption, total outage | 15 min | Tenancy canary breach; balance/ledger mismatch; prod down |
| **Sev2** | Credential leak, provider hard-down, payment pipeline stalled, erasure SLA breach imminent, auto-rollback fired | 30 min | Paddle circuit open; leaked API key; outbox lag >5 min |
| **Sev3** | Degraded pipeline, backlog, elevated error rates | Business hours | Sweeper spike; projection retries; queue backlog |
| **Sev4** | Trends, cost anomalies, quota drift | Weekly review | Amber margin band; quota forecast warnings |

**Classification rule:** when in doubt between two severities, pick the higher and downgrade explicitly with a stated reason — downgrades are logged in the incident timeline; silent downgrades are a PIR finding.

### 1.2 Incident Command Structure

At S1 team size (3-5 eng), roles are hats, not people:

- **Incident Commander (IC):** the responder who acknowledges the page. Owns the timeline, decisions, and role delegation. The IC does **not** debug while commanding — if the IC must go hands-on-keyboard, they hand IC to the secondary first.
- **Technical Lead (TL):** hands-on diagnosis/remediation. Default: the on-call secondary or the module owner (manifest `owner`, Doc 25 §4).
- **Communications Lead (CL):** status page, customer comms, regulator-clock tracking. For Sev1/Sev2 this defaults to founder/CTO; for Sev3 the IC absorbs it.
- Sev1 involving personal data additionally opens the **breach-assessment track** (Doc 21 §8): the GDPR 72-hour notification clock starts at *awareness of a likely breach*, not at resolution — CL logs the clock-start timestamp in the incident channel as the first action.

### 1.3 Lifecycle Stages

1. **Detection:** alert (Doc 23 §4.2), canary failure, customer report, or eng observation. Every incident gets a PagerDuty incident + auto-created Slack channel `#inc-<yyyymmdd>-<slug>`.
2. **Triage:** classify severity; assign hats; post the initial situation summary (template §1.4) within 15 min of ack.
3. **Mitigation:** stop the bleeding first — flag kill-switch (Doc 26 §7) before rollback, rollback (Doc 26 §6) before hotfix, hotfix last. Mitigation ≠ resolution; the incident stays open.
4. **Resolution:** root cause addressed or consciously deferred with a ticket; alerts quiet; verification steps of the relevant runbook green.
5. **PIR:** §7, within 5 business days for Sev1/Sev2.

### 1.4 Communication Protocols

- **Internal:** all decisions and observations go in the incident channel with timestamps — the channel *is* the timeline; PIRs are reconstructed from it. No side-channel DMs for incident decisions.
- **Customer status page** (Doc 23 §7): Sev1 always; Sev2 when customer-visible. Template ladder: *Investigating → Identified → Monitoring → Resolved*, plain language, no internal identifiers, update cadence ≥ every 60 min while open.
- **Regulator notification:** pre-drafted template (with counsel, Doc 28); decision to notify is made by founder + counsel, informed by CL's breach-assessment log; the 72 h clock discipline means the *assessment* must conclude within 48 h to leave notification headroom.

---

## 2. On-Call Rotation & Escalation

- **Structure:** weekly primary + secondary; founder/CTO permanent tertiary (Doc 23 §8). Rotation calendar in PagerDuty; swaps self-service with 24 h notice.
- **Escalation:** Primary (15 min ack) → auto-escalate Secondary (+15) → CTO (+15). Manual escalation is always permitted and never criticized — under-escalation is the failure mode we police, not over-escalation.
- **Compensation:** off-hours Sev1/Sev2 pages earn time-off-in-lieu (half day per disrupted night, full day per disrupted weekend day); tracked honor-system at S1, formalized at S2 hiring.
- **Handoff checklist (Monday, 15 min sync):**
  1. Open incidents and their state
  2. Quarantined/flaky suites (Doc 24 §9) that might page falsely
  3. Deploys shipped last week + anything flag-dark awaiting release
  4. Alert-tuning changes made (Doc 23 §4.2 hygiene rule outcomes)
  5. Upcoming: scheduled campaigns (PATCH-010 re-scoring), partition pre-creation run, DR drill, canary panel refresh
  6. Provider advisories (Apify actor deprecations, Paddle/Meta policy notices)

---

## 3. Runbook Template & Structure

All runbooks live at `docs/runbooks/<slug>.md`, versioned with code, linked from their alert rule (**"no runbook, no alert"** — Doc 23; CI checks the link's existence when alert rules deploy, Doc 26 §10.4).

**Template (mandatory sections):**

```markdown
# RB-<slug>
**Trigger:** <alert name + threshold, Doc 23 §4.2 reference>
**Severity:** <default sev + upgrade conditions>
**Impact:** <who/what is affected, in customer terms>
## Diagnosis
<numbered steps with EXACT Axiom/Grafana queries, copy-pasteable>
## Remediation
<decision tree: cheapest reversible action first>
## Escalation
<when to page whom; when this becomes a different runbook>
## Verification
<observable conditions proving resolution; which metrics return to baseline>
**Last drill/real execution:** <date> — runbooks unexecuted for 6 months are flagged stale
```

---

## 4. Canonical Runbooks

Condensed operational content; full copy-pasteable query text lives in the repo versions.

### RB-01: Ledger Sweeper Rate Spike (PATCH-005)

- **Trigger:** `mushin.credits.swept` > 5/h (Sev3; Sev2 if sustained 4 h or paired with customer reports).
- **Impact:** reservations expiring instead of settling — customers' jobs may be completing without settlement (revenue leak) or failing silently (UX harm). The sweeper is *working correctly*; something upstream is failing to settle.
- **Diagnosis:** (1) Axiom: swept reservation IDs → join to `job_id`s → are jobs completing? (2) If jobs complete but don't settle → check worker errors at settlement step; check `ledger.lock_wait_ms` p99 (contention starving settlement, ADR-026 path). (3) If jobs aren't completing → this is a pipeline incident, pivot to RB-06/queue diagnosis. (4) Check for a deploy correlation (Doc 26 deploy log).
- **Remediation:** worker crash-loop → re-pin previous image (Doc 26 §6); DB contention → check for a runaway campaign hogging locks, pause `q-rescore-low` consumers; settlement code bug → kill-switch flag if flagged, else rollback.
- **Verification:** sweep rate < 1/h for 2 h; disposition audit confirms swept reservations landed in contract-correct states (PATCH-005 per-state table).

### RB-02: Projection Retry Storm (PATCH-009 / ADR-027)

- **Trigger:** projection retries > 10/h, or heal backstop touching rows (Sev3).
- **Impact:** newly discovered creators delayed appearing in search; discovery jobs deliver flagged/degraded results (Doc 20 contract) — customer-visible but self-healing.
- **Diagnosis:** (1) Meilisearch task API status + latency panel (index overload vs. hard failure). (2) Distinguish: timeouts under load (A-069 territory) vs. 4xx (schema/payload bug — correlate with deploys) vs. network partition (Railway↔Meilisearch connectivity).
- **Remediation:** overload → reduce ingestion concurrency (worker env config, no deploy) and let retries drain; hard index failure → engage Meilisearch Cloud support (Sev2), rows remain `pending` and heal on recovery; schema bug → rollback. **Never** hand-edit `projection_status` — the heal backstop is the only writer that reconciles.
- **Verification:** `projection.sync_success` back to baseline; zero rows `pending` > 1 h; a manual new-creator probe is searchable pre-job-completion (the ADR-027 invariant, re-confirmed).

### RB-03: Consent Last-Gate Block Spike (PATCH-006)

- **Trigger:** `consent.last_gate_blocks` > 20/h (Sev3).
- **Impact:** none to compliance — **the blocks are the system succeeding** (zero post-opt-out sends is preserved). A spike signals upstream latency or consent flapping, and blocked sends are silently consumed credits/scheduling slots.
- **Diagnosis:** (1) Sample blocked events in Axiom: time delta between opt-out and attempted send. Large deltas → queue latency (check `queue.oldest_message_age_s` on send queues; opt-outs should overtake via priority class — verify priority consumption is healthy). (2) Same contacts flapping opt-in/opt-out → possible consent-state bug or a customer misusing re-enrollment; check consent version history for the sampled contacts.
- **Remediation:** queue latency → scale send-queue consumers (§6.1); priority inversion → verify `q-*-high` consumer weighting config; flapping → if product bug, kill-switch re-enrollment flag; if customer abuse pattern, flag to support (Doc 29 workflow).
- **Verification:** block rate < 5/h; audit sample confirms every block has consent-version evidence logged (Doc 21 audit stream).

### RB-04: Apify Canary Failure (R-TEC-007)

- **Trigger:** canary run schema diff failure or actor error, any of the six actors (Sev3; Sev2 if primary actor for a platform is hard-down and customer jobs are failing).
- **Impact:** impending or active scraper breakage — canaries fire *before* customer impact by design (Doc 23 §6); check whether customer jobs are already degrading (payload validation pass-rate panel).
- **Diagnosis:** (1) Canary diff report: field removed/renamed/retyped vs. run error. (2) Panel account issue (private/deleted — A-072) vs. actor issue: is the failure uniform across panel accounts? Uniform → actor; single account → panel refresh, not an incident. (3) Check Apify actor changelog/issues for a pushed update.
- **Remediation (decision tree):** single-account → replace panel account (48 h SLA, versioned panel baseline reset — Doc 24 §11.1). Field rename with same semantics → adapter mapping patch (small MR, expedited). Actor hard-broken → activate **multi-actor fallback** (R-TEC-007 mitigation): flip adapter config to the designated fallback actor for that platform (kill-switch flag, Doc 26 §7 — mandatory flag for adapters); accept degraded field coverage per the adapter's named degraded state (ADR-022 obligation 6). Prolonged outage → pause affected discovery job intake (feature flag) rather than sell failing jobs; reservations release per PATCH-005.
- **Verification:** canary green on 2 consecutive runs; payload validation pass rate ≥ baseline; if fallback active, a ticket exists to restore/re-evaluate the primary.

### RB-05: Paddle Webhook Drift (R-FIN-007)

- **Trigger:** webhook delivery lag alert, reconciliation mismatch, or customer entitlement complaint (Sev2 — money and access).
- **Impact:** entitlement/credit state diverges from Paddle truth — customers over- or under-entitled.
- **Diagnosis:** (1) Axiom: last received event per source vs. Paddle dashboard event log — missing events? signature failures (possible R-SEC-007, escalate to RB-08 if so)? (2) Received-but-unprocessed → check webhook consumer DLQ.
- **Remediation:** **fetch-to-heal** — run the reconciliation job scoped to affected subscription IDs: fetch authoritative state from Paddle API, diff against local, apply corrections through the normal idempotent event handlers (never direct DB writes to entitlement or ledger; ledger corrections are new append-only entries with `reconciliation` reason codes, ADR-012). DLQ'd events → redrive after fixing the processing fault.
- **Verification:** reconciliation job reports zero drift on two consecutive runs; affected customers' entitlements spot-checked; ledger audit trail shows correction entries, not mutations.

### RB-06: Outbox Relay Lag (ADR-020)

- **Trigger:** oldest unrelayed row > 5 min (Sev2 — everything downstream depends on the outbox: projections, erasure propagation, campaign events).
- **Diagnosis:** (1) Relay worker alive? (Railway process status, consumer liveness probe). (2) Alive but slow → poison event throwing repeatedly (Axiom: relay errors by event type) vs. SQS throttling vs. outbox table bloat (dead tuples — check autovacuum recency). (3) Burst backlog after an incident → expected drain, monitor only.
- **Remediation:** dead relay → restart/re-pin. Poison event → move to the outbox dead-letter table (dedicated runbook step with two-person confirmation — skipping an event is a data-loss decision; log event ID in incident channel). Throughput → scale relay workers (relay is per-key-order-safe to parallelize by design). Bloat → manual `VACUUM ANALYZE` off-peak.
- **Verification:** lag < 30 s sustained 30 min; downstream consumers (projection, erasure) show no gap — spot-check the oldest previously-stuck event's effects landed exactly once.

### RB-07: Database Connection Pool Exhaustion

- **Trigger:** pool saturation metric / connection errors in logs (Sev2 if request failures occur).
- **Diagnosis:** (1) Grafana: connections by service — which tier is consuming (web vs. workers vs. relay)? (2) Long-running transactions holding connections (`pg_stat_activity` sorted by `xact_start` — exact query in repo runbook): a stuck ledger transaction (ADR-026 lock chain) shows here. (3) Leak signature: connections climbing monotonically post-deploy → deploy correlation.
- **Remediation:** stuck transactions → `pg_terminate_backend` on the blocker after logging its query (ledger transactions are idempotent-safe to kill: reservation either committed or it didn't — PATCH-004 semantics); leak → rollback the correlated deploy; genuine load → raise pool ceiling within Neon plan limits and ticket capacity review (§6.2).
- **Verification:** pool utilization < 70% steady; zero connection errors 1 h; `ledger.lock_wait_ms` back to baseline.

### RB-08: Leaked Credential (R-SEC-007 / Doc 21 §6.2)

- **Trigger:** secret-scan hit, provider notice, webhook signature failure spike, or anomalous usage (Sev2; Sev1 if exploitation confirmed).
- **Remediation (clock: rotation ≤ 4 h from detection):** identify blast radius from the secret's scope (per-env, per-stage scoping limits it — Doc 22 §4) → rotate at provider → update secret manager (dual-secret overlap for webhook secrets) → verify consumers picked up the new version → audit usage logs for the exposure window → if customer data plausibly accessed, open breach-assessment track (§1.2).

---

## 5. Disaster Recovery & Backup Procedures

- **PITR execution (RTO ≤ 4 h, Doc 22 §8):** (1) Declare Sev1, freeze deploys, pause worker fleet (stop consuming — queues buffer). (2) Neon PITR restore to target timestamp on a new branch. (3) Validation gate on the restored branch: schema assertions, ledger balance derivation check, row-count sanity vs. metrics history. (4) Repoint app/workers (connection string via secret manager). (5) **Reconciliation pass:** Paddle fetch-to-heal across the gap window (RB-05 machinery); outbox events created-but-unrelayed pre-restore re-relay naturally; customers notified of the gap window via CL. (6) Post-restore: search index consistency check → §5's rebuild if drifted.
- **Search index full rebuild (RTO ≤ 6 h):** provision fresh index with settings-as-code → bulk reprojection job streams all non-tombstoned GCP creators (reuses ADR-027 projection code path in batch mode) → verify count parity + sampled query correctness → atomic index alias swap. Tombstoned creators (ADR-025) are excluded by the projector's source query — a rebuild is also an erasure-consistency repair.
- **Queue rehydration:** queues are not backed up by design — the outbox is the durable source (Doc 22 §8). Recreate queues via Terraform → relay resumes from unrelayed outbox rows → in-flight job state machines resume from persisted job state (ADR-021 job records) with redelivered messages absorbed idempotently.
- **Emergency secret rotation:** RB-08.
- **DR drill schedule (quarterly, Doc 24 §10.3):** rotating scenario — Q1 PITR restore-to-staging (validates A-067), Q2 rollback drill (web+worker), Q3 index rebuild, Q4 secret rotation + break-glass access (Doc 22 §8). Every drill updates the runbook's "last executed" stamp and files gaps as `pir`-labeled tickets.

---

## 6. Capacity Planning & Scaling Runbooks

### 6.1 Worker Fleet Scaling

- **Signal:** sustained `queue.depth` growth + `oldest_message_age_s` trend (not instantaneous spikes).
- **Action:** raise Railway service replica count per consumer group; respect the `q-rescore-low` 20% cap (Doc 22 §5.3) — scaling the fleet raises the cap's absolute value, which is correct; never scale rescore consumers independently above cap.
- **Model:** the Doc 24 §5.3 throughput measurements define jobs/worker/hour per job type; capacity reviews (monthly, §2 handoff feeds it) compare demand forecast vs. fleet size.

### 6.2 Database Scaling

- **Read pressure:** Neon read replica for Brain 1 search-adjacent reads and Timeline queries — **never** for ledger reads (ADR-026 requires primary-consistency for balance reads; replica lag would break reserve correctness). Repository layer already routes by consistency requirement.
- **Write/lock pressure:** `ledger.lock_wait_ms` trending → first verify no misbehaving long transactions (RB-07), then compute-tier upgrade; partitioning already contains Timeline write costs (PATCH-003).

### 6.3 Meilisearch Scaling

- **Signal:** sync-write p99 approaching the 5 s budget (A-069 panel).
- **Action:** tier upgrade with Meilisearch Cloud; if ceiling reached, ingestion concurrency cap (RB-02 lever) trades throughput for latency until re-architecture review — a persistent breach reopens the ADR-027 posture discussion at ARB.

### 6.4 LLM Rate-Limit Headroom

- **Signal:** headroom panel < 30% at peak (Doc 23 §6).
- **Action ladder:** provision higher TPM tier → shift `q-rescore-low` campaigns to off-peak windows (scheduler config) → per-tier model routing adjustments (cheaper tier for lower-stakes stages, via Prompt Registry model pins — full eval flow applies, Doc 25 §6). Backpressure engages automatically before 429 storms (Doc 24 §5.4 verified behavior).

---

## 7. Post-Incident Review (PIR)

- **Blameless, mandatory** for Sev1/Sev2 within 5 business days; optional-but-encouraged for instructive Sev3s.
- **Template:** timeline (from the incident channel) → impact quantification (customers, duration, credits/refunds, data) → **5 Whys** root-cause chain (stopping at systemic causes, not human error — "engineer missed X" always yields a sixth why: what made X missable?) → what went well → action items.
- **Required outputs (hard rule, Doc 23 §8):** ≥1 **detection** improvement (alert/metric/canary gap) and ≥1 **prevention** item (test, lint, design change). Adversarial corpus additions (Doc 24 §1.3) count as prevention for injection/payload incidents.
- **Tracking:** `pir`-labeled tickets with owners and due dates; open `pir` items reviewed in the weekly alert-tuning session; a `pir` item slipping twice escalates to founder review. PIR docs live in the repo (`docs/pirs/`) — searchable institutional memory.

---

## 8. SLA Definitions & Monitoring

| SLA | Target | Measured By |
|---|---|---|
| Sev1 ack | 15 min | PagerDuty analytics |
| Sev2 ack | 30 min | PagerDuty analytics |
| Uptime (customer-facing, S1/S2) | 99.5% monthly (internal target 99.9%) | Synthetic probes (Doc 23 §7); status page history |
| Support first response | Business hours: 8 h (Pro), 24 h (Starter) — PK business week, Sun-Thu aware | Ticket system |
| GDPR Tier 2 erasure | 30-day legal / **72 h target** | Erasure SLA tracker (Doc 23 dashboard); Sev2 at 48 h open |
| Job progress freshness (ADR-021 polling) | Status staleness < 30 s | Pipeline metrics |

External SLA commitments are published in ToS terms (Doc 28) at the 99.5% level — we publicly commit only what a Sev1's worst-case recovery (RTO 4 h ≈ 99.45% monthly if fully consumed) cannot casually break; 99.9% remains the internal bar.

---

## 9. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-OPS-001 (new)** | Operational | Runbooks rot (queries drift from schema/dashboards) | M-H | M-H | "Last executed" staleness flag (6 mo); drills execute runbooks verbatim; runbooks versioned with code so schema MRs can update them in-diff |
| **R-OPS-002 (new)** | Operational | Single-person incident load at S1 team size (IC+TL+CL collapse into one) | M | H | Hat-handoff discipline (§1.2); founder as standing CL; under-escalation policing; hiring trigger: >2 Sev2/month sustained |
| **R-OPS-003 (new)** | Operational | Manual interventions (DLQ redrive, event skip, backend terminate) cause secondary damage | L-M | H | Two-person confirmation on destructive runbook steps; all manual actions logged in incident channel; idempotent-by-design substrates (ADR-020/026) limit blast radius |
| **R-OPS-004 (new)** | Operational | DR drill findings not actioned (drills become theater) | M | M | Drill gaps are `pir`-labeled with the same escalation as incident PIRs |
| **R-OPS-005 (new)** | Compliance | Breach-assessment clock mismanaged during chaotic Sev1 | L-M | Critical | CL logs clock-start as first action (§1.2); pre-drafted regulator template; 48 h assessment deadline leaves headroom |

---

## 10. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-088 | S1 team can sustain the weekly rotation without burnout at projected alert volume (<5 pages/month) | Med (alert hygiene rule is the guard; R-OPS-002 hiring trigger the escape) |
| A-089 | Neon PITR + repoint completes within the 4 h RTO at production data volume | Med (Q1 drill resolves — refines A-067) |
| A-090 | Paddle API supports bulk state fetch at reconciliation scale without rate-limit pain | Med-High (verify during RB-05 first execution/drill) |
| A-091 | Meilisearch bulk reprojection sustains full-rebuild ≤ 6 h at S2 corpus size | Med (Q3 drill resolves) |

**Dependencies:** Doc 23 (every trigger references its alert; dashboards are the diagnosis surface), Doc 26 (rollback/flag machinery invoked by remediations; deploy freeze mechanics), Doc 24 (drill schedule shared; smoke suite = post-remediation verification), Doc 28 (regulator template counsel review; ToS SLA publication; erasure legal windows), Doc 29 (Support's role in customer-facing incident comms and RB-03 abuse-pattern escalation; who may execute destructive runbook steps).

**Open questions:**
1. Status page provider selection (Instatus vs. Statuspage) — trivial, decide at setup; requirement: API-driven updates from incident tooling.
2. Whether PagerDuty analytics suffice for SLA reporting or a lightweight incident-metrics rollup (MTTA/MTTR by sev) should live in Grafana — recommend Grafana rollup at S2.
3. Two-person confirmation mechanics for destructive steps at S1 (when only one responder is awake) — proposal: founder/CTO async confirmation with 15-min timeout allows proceed-with-log; ratify at first drill.

---

**End of Document 27.**

[AWAITING APPROVAL]


---

<a name="doc-028"></a>
# DOC-028 — Legal, Terms and Data Governance

# Document 28: Legal, Terms & Data Governance

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8
**Depends on:** Doc 20 (API), Doc 21 (Security & Compliance framework §7), Doc 22 (Infrastructure/sub-processors), Doc 23 (retention), Doc 27 (regulator comms)
**Governing ADRs:** ADR-004, ADR-007, ADR-008, ADR-009, ADR-010, ADR-012, ADR-025, ADR-PAYMENT-001
**Applied Patches:** PATCH-002 (erasure), PATCH-006 (consent evidence)

> **Standing caveat:** this document specifies the *engineering-grounded requirements and structure* for legal artifacts. Every artifact herein requires qualified counsel review (PK counsel for entity/PECA matters, EU/US privacy counsel for GDPR/CCPA) before publication. Items blocking on counsel are flagged `[COUNSEL]`.

---

## 1. Terms of Service Framework

### 1.1 Acceptable Use Policy (AUP)

Binding on all workspace users; enforcement hooks exist in-product:

- **No harassment or spam via outreach:** outreach must be genuine business communication to creators; bulk unsolicited messaging outside the sequence machinery, circumvention of opt-outs, or re-enrollment of opted-out contacts is prohibited. *Enforcement hook:* PATCH-006 last-gate blocks + consent audit trail (Doc 21 §6.4) provide evidence; RB-03's abuse-pattern escalation (Doc 27) is the operational path; repeated violations → suspension per §1.6.
- **Mailbox/WABA compliance:** users connect their own mailboxes (ADR-010) and WABAs (ADR-009) and warrant they will comply with Gmail/Outlook bulk-sender rules and Meta's WhatsApp Business/Commerce policies. MUSHIN's Jumu'ah-aware scheduling and send pacing are features, not a compliance guarantee — responsibility sits with the sender.
- **No resale/republication of platform data:** creator data and scores are licensed for internal campaign use within the workspace; systematic export to build competing datasets is prohibited. *Enforcement hook:* export endpoints are bounded and rate-limited (Doc 20); no public API exists to bulk-harvest (ADR-023).
- **No use against the scraped platforms' rights beyond MUSHIN's own posture** (§6) — customers may not commission scraping of private/logged-in content through support requests.

### 1.2 Credit Terms (ADR-004, ADR-012)

- Credits are **prepaid usage units, not stored value or currency**; non-refundable except where consumer law mandates `[COUNSEL: PK/EU consumer-law carve-outs]`.
- The **append-only ledger is the authoritative record** (ADR-012); customers see full ledger history (Doc 20 ledger endpoint) — transparency is the fairness argument supporting non-refundability.
- **Failed-job protection stated contractually:** credits reserved for a job that fails due to MUSHIN or provider fault are released per the reservation disposition contract (PATCH-005) — the ToS commits to the behavior the system already guarantees. Jobs that complete but return fewer results than hoped are *not* refundable (results-quality disclaimers, §1.4).
- Expiry: subscription-granted credits expire at term end; purchased credit packs expire 12 months after purchase `[COUNSEL: expiry enforceability per jurisdiction]`. Expiry events are ledger entries with 30/7-day advance notice emails.

### 1.3 Paddle MoR Pass-Through (ADR-PAYMENT-001)

- Paddle is the **Merchant of Record**: the customer's payment contract is with Paddle; Paddle handles tax calculation/remittance (VAT/GST/sales tax), invoicing, chargebacks, and payment-method compliance. The ToS incorporates Paddle's Buyer Terms by reference.
- **Refunds flow through Paddle** per its policies; MUSHIN's obligation is entitlement correction (fetch-to-heal keeps entitlements true to Paddle state, R-FIN-007) — a Paddle refund produces a corresponding ledger clawback entry (append-only, reason-coded).
- **A-032 dependency surfaced contractually:** the entity structure clause names the PK-incorporated contracting entity `[COUNSEL: pending A-032 verification — EXISTENTIAL; if Paddle cannot onboard the PK entity, the contracting structure section is rewritten around the fallback entity plan]`.

### 1.4 Scraping-Derived Data Disclaimers & AI Estimates

- All creator data is provided **"as-is"**: sourced from public platforms at a point in time, may be stale, incomplete, or wrong; MUSHIN warrants the *pipeline's* integrity, not the *data's* accuracy.
- **AI scores are estimates, prominently disclaimed:** authenticity scores, audience estimates (CC-003), and niche classifications are model outputs with documented methodology (Explainable AI, Philosophy #2 — the explainability surface doubles as the legal fairness defense: we show our evidence, per the grounding validator's evidence-span discipline). ToS states scores are decision-support, not representations of fact about any creator, and must not be used as the sole basis for public statements about a creator.
- Score provenance (`prompt_version`, `model_version`, PATCH-010) means any disputed score is reconstructible — a defensibility asset worth stating in the ToS's dispute section.

### 1.5 Limitation of Liability

- Liability cap: fees paid in the preceding 12 months; exclusion of consequential damages `[COUNSEL: enforceability by jurisdiction]`.
- **Specific carve-ins we accept:** our breach of confidentiality/security obligations, and gross negligence.
- **Specific exclusions:** campaign outcomes; creator behavior; deliverability of outreach (mailbox providers and Meta control delivery — ADR-009/010 mean we never own the sending infrastructure); accuracy of scores (§1.4); actions taken by scraped platforms against a customer's own accounts.

### 1.6 Termination & Post-Termination Data

- Customer termination: workspace data (WP plane) retained 30 days for reactivation, then deleted (Tier 1 semantics across the workspace); export available during the window (Doc 20 export endpoint).
- MUSHIN-initiated termination (AUP breach): notice + cure period except for egregious violations; ledger balance handling `[COUNSEL: forfeiture enforceability]`.
- Ledger records survive workspace deletion for the financial retention period (§2.4) — stated explicitly to reconcile "we deleted your workspace" with "we retain financial records," which confuses customers if unstated.

---

## 2. Privacy Policy Structure

Written in plain language; the structure below maps each section to its engineering substrate.

### 2.1 Data Categories (mapped from Doc 21 §3.1)

| Policy language | Class | Substrate |
|---|---|---|
| "Account and login data" | C2 | User records, auth provider |
| "Connected service credentials" (never readable by staff, encrypted) | C1 | Envelope encryption, Doc 21 §3.2 |
| "Creator profiles from public sources" | C2 | GCP plane |
| "Your workspace content" (notes, campaigns, messages) | C3 | WP plane |
| "AI-derived insights" (de-identified scores) | C4 | `enrichment_snapshot` |
| "Usage and technical data" | C5 | Redacted logs, metrics |

### 2.2 Sources & Legal Basis

- **Sources stated plainly:** public social platforms (via processing partners, i.e., Apify), YouTube's official API, information the customer provides, information creators' own public sites publish (Web Scraper email extraction — listed explicitly, as email harvesting is the most sensitive collection we do).
- **Legal bases:** contract (customer account/WP data); **legitimate interest, Art. 6(1)(f)** for public-data creator enrichment — the policy references the balancing test (LIA) summary: business-contact-style data, publicly self-published for professional discovery purposes, with objection and erasure honored via a dedicated channel (§2.6). `[COUNSEL: LIA memo is the blocking artifact — A-061]`. Consent (analytics cookies, §4).

### 2.3 Sub-Processor List (published, versioned)

Paddle (payments/MoR), Apify (public-data collection), Anthropic/LLM provider (scoring — **payloads only, no training rights** in the DPA with the provider `[verify contract term]`), Neon (database), Railway (compute), Vercel (hosting/edge), Cloudflare (edge/DNS, R2 storage), AWS (queueing/KMS), Meilisearch Cloud (search), Axiom (logs), Grafana Labs (metrics/traces), PagerDuty (ops), auth provider, Google/Microsoft (only as the customer's own connected mailboxes — processor role sits with the customer's tenancy, noted for accuracy), Meta BSPs (per-workspace WABA).

Change mechanism: 30-day advance notice via the policy page + email to workspace owners; objection path per DPA (§3.3).

### 2.4 Retention Schedule (published table)

| Data | Retention | Rationale/Substrate |
|---|---|---|
| Ledger & billing records | 7 years | Financial/tax law; ADR-012 append-only |
| Workspace content | Life of workspace + 30 days | §1.6 |
| Interaction timeline | Life of workspace; partitions ≥ 24 months old archived, dropped 90 days after archival | PATCH-003 monthly partitions make this a partition-drop operation, stated honestly |
| Raw scraped payloads (R2) | 24 months rolling | Re-scoring utility (ADR-028) vs. minimization; lifecycle policy, Doc 22 §1.4 |
| Security audit logs | 24 months | Doc 21 §6.4 |
| Operational logs | 30-90 days | Doc 23 §1.5 |
| Erasure tombstones + blocklist hashes | Indefinite | The tombstone *is* the erasure guarantee (ADR-025) — retained to prevent re-ingestion; policy explains this apparent paradox plainly |

### 2.5 User Rights

Access, rectification, erasure, portability (machine-readable export via Doc 20), restriction, objection. Fulfillment SLAs per Doc 27 §8 (30-day legal / 72 h target for erasure).

### 2.6 Creator-Facing Removal Channel

A public page (`mushin.app/creator-privacy`) — **no login required** (creators are not customers): identity verification (control of the listed platform handle via a verification post/DM code or email to the on-profile address) → triggers Tier 2 erasure (ADR-025/PATCH-002: PII nullification, blocklist entry, R2 purge, index purge) → confirmation sent. The same channel records **objections** (Art. 21) — honored identically to erasure, since the blocklist doubles as the objection registry (Doc 21 §7). Volume and SLA are tracked on the erasure dashboard (Doc 23).

---

## 3. Data Processing Agreements

### 3.1 Dual-Role Structure

The DPA documents both postures explicitly (Doc 21 §7):

- **MUSHIN as processor** — for WP-plane customer data (their notes, contacts they upload, messages): customer is controller; we process per instructions; the DPA covers this plane with standard processor obligations (Art. 28 terms, sub-processor flow-down, breach notification within 48 h to the controller — inside our own 72 h regulator clock, Doc 27 §1.2).
- **MUSHIN as independent controller** — for GCP-plane enrichment (creators discovered from public sources, cached globally per ADR-008): we determine purposes/means; customers receive a *license* to this data, not a processing delegation. **The plane boundary (Doc 21 §1.2) is the legal boundary** — `workspace_creator_link` (ADR-024) is precisely where controller-licensed data meets processor-held data; the DPA's data-category annex mirrors the schema split.
- R-LEG-007 (dual-role misclassification) is retired only when counsel signs this structure `[COUNSEL]`.

### 3.2 International Transfers

- Data residency: Mumbai region (Doc 22 §3.1) — India is not adequacy-listed by the EU. For EU customers/creators: **SCCs (2021 modules)** — Module 2 (controller→processor) for customer data to MUSHIN, Module 3 flow-down to sub-processors; transfer impact assessment (TIA) documenting Doc 21's technical measures (encryption at rest/in transit, envelope-encrypted C1, pseudonymized logging) as supplementary measures `[COUNSEL: TIA]`.
- Sub-processor transfers (US-based: AWS, Vercel, Axiom, etc.): rely on their DPF certifications where held, SCCs otherwise — recorded per sub-processor in the ROPA (§7.4).

### 3.3 Sub-Processor Change Mechanism

30-day notice (§2.3); customer objection right with a good-faith resolution window; if unresolvable, termination right with pro-rata refund of prepaid *subscription* fees (credits per §1.2) `[COUNSEL]`.

---

## 4. Cookie Policy

- **Strictly necessary (no consent):** session/refresh cookies (httpOnly, Doc 21 §2.1), CSRF token, load-balancing.
- **Analytics (consent-gated):** product analytics only; consent banner with equal-prominence reject; consent state itself stored as a necessary cookie. No analytics beacon fires pre-consent — verified by an automated pre-consent network-request test (added to the Doc 24 E2E suite).
- **None:** advertising, cross-site tracking, fingerprinting. Server-side flag evaluation (Doc 26 §7) means no third-party flag SDK cookies — a deliberate simplification worth stating.

---

## 5. Influencer Marketing Disclosure & Compliance

- **Role boundary:** MUSHIN facilitates discovery and outreach; it does not publish ads or contract creators. **Disclosure responsibility sits with the brand customer and the creator** under FTC Endorsement Guides (US), ASA/CAP (UK), and platform rules — the ToS obliges customers to comply and indemnify for their campaign conduct.
- **Product support (not obligation):** outreach templates include an optional disclosure-reminder snippet (Doc 20/21 §7); campaign brief templates carry a disclosure checklist item; help-center guidance links FTC/platform branded-content policies.
- **Platform-native tools:** guidance notes recommend Instagram/TikTok branded-content tools for executed partnerships; no integration is built at S1/S2 (out of MVP boundary, ADR-006) — noted so the policy doesn't over-claim.
- Pakistan: no influencer-specific disclosure statute currently; general consumer-protection and PEMRA/PTA content rules noted `[COUNSEL: PK marketing-law memo, low urgency]`.

---

## 6. Scraping Legal Posture (R-LEG-006)

The load-bearing legal position, documented as a defensible-posture stack:

1. **Public-data-only scope:** only content visible without authentication is collected; no credentialed scraping, no private accounts, no circumvention of access controls. This is the core distinction in US CFAA jurisprudence (*hiQ v. LinkedIn* line: public data scraping ≠ unauthorized access, while noting hiQ's ultimate contract-claim vulnerability) and in **PECA 2016 §3-4** (unauthorized access/copying of *protected* information systems — public pages are not access-protected) `[COUNSEL: PK memo]`.
2. **Processor indirection:** Apify performs collection under its own compliance framework and ToS; MUSHIN consumes actor outputs. This does not eliminate platform-ToS exposure but locates the collection activity with a specialized processor whose business is maintaining lawful actors — and whose actor maintenance is our R-TEC-007 mitigation besides.
3. **Platform ToS risk acknowledged, not denied:** Instagram/TikTok ToS prohibit scraping; enforcement against *consumers of scraped public data* has historically been civil (contract/tortious interference) and targeted at scale abusers. Mitigations: no platform accounts used for collection (nothing to ban that we own — customer accounts are never used for scraping), politeness/rate discipline (Doc 17), no wholesale database republication (§1.1 AUP), YouTube handled via **native API within its ToS** (hybrid strategy reduces the exposed surface to two platforms). Residual risk accepted at ARB level per Doc 21 §9 criteria; A-050 remains Low-Med confidence by design.
4. **robots.txt posture:** honored for our own Web Scraper email-extraction runs against personal sites; Apify actor internals follow Apify's compliance posture — we configure actors within their documented lawful-use parameters `[verify per-actor configuration options]`.
5. **Data-subject rights as mitigation:** the creator removal channel (§2.6), erasure machinery (ADR-025), and objection registry demonstrate accountability — the strongest practical answer to legitimate-interest challenges (§2.2).
6. **Kill-switch readiness:** per-platform ingestion flags (Doc 26 §7 mandatory adapter flags) mean a cease-and-desist can be honored for a platform within minutes without a deploy — an operational fact worth citing in any enforcement response `[COUNSEL: pre-drafted C&D response template]`.

---

## 7. Data Governance & Internal Policies

### 7.1 Classification Handling (operationalizing Doc 21 §3.1)

Per-class handling rules are *published internally as policy* and *enforced as code where possible*: C1 envelope encryption + worker-only decryption (IAM-enforced, Doc 22 §4), C2 pseudonymization in logs (HMAC, Doc 23 §1.4) and tombstone-eligibility, C3 tenancy triple-layer (Doc 21 §2.2), C4 de-identification-by-construction review on any new derived field (review checklist item: "could this score field re-identify?").

### 7.2 Employee Access Policy

- Least privilege by default; staff plane separation (ADR-011) with the audit-first invariant; Support role's explicit denials (no impersonation/config/billing — matrix in Doc 29).
- **No production data on endpoints:** staging masked snapshots for debugging (Doc 22 §2.2); production access only via audited staff tooling — never direct DB access for support tasks (RB-level DB access is incident-scoped, logged per Doc 27 §R-OPS-003).
- Offboarding: same-day identity revocation checklist (auth provider, GitHub, PagerDuty, secret manager, cloud IAM) — a named runbook.

### 7.3 Vendor Risk Management

- Intake gate: SOC 2 Type II (or ISO 27001) for any vendor touching C1-C3 (A-063); DPA + SCC/DPF verification (§3.2); security-posture review recorded.
- Annual re-review; sub-processor list update flows from this register (§2.3) — one register, two consumers (governance + policy page).
- LLM provider addendum: **no-training clause** on submitted payloads verified in contract `[verify]` — scraped creator content must not become model training data through our pipeline (both a privacy and a competitive matter).

### 7.4 Records of Processing Activities (ROPA)

Maintained per GDPR Art. 30, structured by plane: GCP controller activities (enrichment, scoring, discovery), WP processor activities (per-customer processing categories), Platform activities (billing, staff audit). Each entry: purpose, categories, recipients/sub-processors, transfers + safeguards, retention (§2.4 table is the source), security-measure references (Doc 21 sections). The ROPA is versioned in the governance repo; schema changes touching PII-bearing tables prompt a ROPA-review checklist item (Doc 25 §3.4 documentation gate extension).

---

## 8. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-LEG-008 (new)** | Legal | Legitimate-interest basis (A-061) rejected by a DPA/regulator on complaint | L-M | H | LIA memo, removal/objection channel, minimization (retention table), pseudonymized ops; fallback: consent-or-removal posture for EU creators (product impact assessed if triggered) |
| **R-LEG-009 (new)** | Legal | Credit expiry/forfeiture terms unenforceable in a key market | M | M | `[COUNSEL]` review per market; ledger transparency as fairness evidence; graceful term redesign is a config change, not architecture |
| **R-LEG-010 (new)** | Legal | Cease-and-desist from a scraped platform | M | H | §6 posture stack; per-platform kill switch; pre-drafted response; hybrid strategy limits blast radius (YouTube unaffected) |
| **R-LEG-011 (new)** | Compliance | Creator removal channel abused (false-flag removals of competitors' rosters) | L-M | M | Handle-control verification (§2.6); removal ≠ instant on weak verification — manual review tier for contested cases |
| **R-LEG-012 (new)** | Compliance | ROPA/sub-processor register drifts from actual stack | M | M | Vendor register as single source (§7.3); infra MR checklist hook; annual audit |
| R-LEG-006 | Legal | Platform ToS enforcement against scraping | M-H | H | **Restated with full posture stack (§6)**; residual accepted at ARB per Doc 21 §9 criteria |
| A-032 | — | Paddle onboards PK entity | — | — | **Escalated visibility:** contracting-structure clause blocked on verification (§1.3); fallback entity plan is a pre-GA legal deliverable |

---

## 9. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-092 | *hiQ*-line reasoning on public-data scraping remains persuasive in relevant US fora; no adverse controlling precedent before GA | Med |
| A-093 | PECA 2016 §3-4 "unauthorized access" does not reach unauthenticated public-page collection | Med `[COUNSEL: PK memo resolves]` |
| A-094 | Handle-control verification (§2.6) is sufficient identity proof for erasure without creating an impersonation vector | Med-High (R-LEG-011 hedges) |
| A-095 | LLM provider contract includes/permits a no-training clause at our tier | Med-High (verify at contract) |
| A-096 | SCC Module 2/3 + TIA suffices for EU→Mumbai transfers without additional measures | Med `[COUNSEL: TIA]` |

**Dependencies:** Doc 21 (classification, erasure machinery, compliance framework this document drafts against), Doc 22 (sub-processor stack, region/residency facts), Doc 23 (retention enforcement, erasure SLA dashboard), Doc 26 (kill-switch flags cited in §6.6), Doc 27 (breach notification clocks, regulator template, SLA publication), Doc 29 (Support's role in removal-channel triage; who executes contested-removal review).

**Blocking counsel deliverables (pre-GA):** (1) LIA memo (A-061/R-LEG-008), (2) PK PECA + entity memo (A-093, A-032 fallback), (3) TIA + SCC execution (A-096), (4) ToS/Privacy Policy/DPA drafting from this specification, (5) C&D response template (§6.6).

**Open questions:**
1. Whether creator *scores* (C4) are disclosable to the creator on an access request — they're de-identified in our frame but *about* an identifiable person once linked to the requester; leaning yes-disclose with methodology summary `[COUNSEL]`.
2. Minimum age / child-creator handling: policy for creators flagged as likely minors (exclude from outreach features? full exclusion?) — needs a product + legal decision before GA; currently unhandled. **Flagged as the most material gap this document surfaces.**
3. WhatsApp outreach consent standard: Meta BSP rules impose opt-in requirements stricter than email norms — confirm the consent model (PATCH-006 substrate) maps to Meta's standard per template category.

---

**End of Document 28.**

[AWAITING APPROVAL]


---

<a name="doc-029"></a>
# DOC-029 — Internal User Roles and Permissions Specification

# Document 29: Internal User Roles & Permissions Specification

**Status:** 🟡 Draft — Pending Approval
**Phase:** 8 (Final Document)
**Depends on:** Doc 20 (API/admin surface), Doc 21 (Security §2.4), Doc 23 (Observability access), Doc 25 (label permissions), Doc 26 (deploy approvals), Doc 27 (runbook execution), Doc 28 (governance policies §7.2)
**Governing ADRs:** ADR-011 (foundational), ADR-012, ADR-025, ADR-026, ADR-028
**Applied Patches:** PATCH-002 (erasure execution), PATCH-008 (merge resolution)

---

## 1. Staff Identity Plane Integration (ADR-011)

### 1.1 Separate Auth Realm

- Staff identities live in a **separate auth provider tenant/project** with its own issuer and JWKS endpoint. The customer application's JWT verification middleware and the staff admin surface's middleware trust **disjoint issuer sets** — a customer token presented to a staff endpoint fails at signature/issuer verification, *before* any role logic executes (verified by the Doc 24 §6.4 test: rejection must be issuer-based, not role-based).
- No shared user table, no shared password store, no account-linking feature. A staff member who is also a customer (dogfooding) holds two unrelated identities.

### 1.2 MFA Requirements

| Role | MFA Standard |
|---|---|
| Support | TOTP mandatory (enrollment blocks first login) |
| Admin | WebAuthn hardware key mandatory; TOTP as registered backup only |
| Break-glass | Hardware key + second-person approval (§6.3) |

### 1.3 Staff JWT Claims

```json
{
  "iss": "https://auth.staff.mushin.internal",
  "sub": "stf_01H...",
  "realm": "staff",
  "role": "admin | support",
  "amr": ["webauthn"],
  "exp": "<15 min>",
  "jti": "..."
}
```

- `realm: "staff"` is asserted *and* redundant with the issuer — defense in depth against middleware misconfiguration.
- Staff tokens carry **no workspace claim**: staff access is cross-workspace by nature. Workspace scoping is per-request via an explicit `X-Workspace-ID` header, which the middleware records in the audit entry — staff tooling must *name its target* on every workspace-scoped call; there is no ambient workspace context to fat-finger.
- Staff sessions: 15-min access tokens, 8-hour maximum session (re-auth daily), no refresh-token longevity — staff convenience loses to auditability.

---

## 2. Admin Role (Internal Staff — Full Access)

### 2.1 Capabilities

| Capability | Substrate |
|---|---|
| Workspace management: view, suspend, reinstate | Suspension freezes logins + job intake; reservations release per PATCH-005; ledger untouched (ADR-012) |
| GCP creator admin view: full attributes + **all** workspace links | The one legitimate cross-tenant view; exists for identity/erasure operations; every access audit-logged with reason |
| GDPR erasure trigger (Tier 2) | Executes ADR-025/PATCH-002 flow; feeds from the creator removal channel (Doc 28 §2.6) after verification |
| Contested-removal review | R-LEG-011 manual tier (Doc 28) |
| Creator identity merge/un-merge | Resolves `merge_status='candidate'` queue (PATCH-008); un-merge preserves audit trail |
| Feature flag management | Create/toggle/deprecate incl. kill switches (Doc 26 §7); flag changes audit-logged by Unleash + mirrored to audit stream |
| Cost telemetry dashboards | Full FS-10.03 guardrail view (Doc 23 §5.4) |
| Queue health + operational tooling | DLQ inspection/redrive, worker status (Doc 27 runbook surfaces) |
| Audit log access | Platform-wide, filterable (Axiom `audit` stream, Doc 23 §1.5) |
| Impersonation | §5 workflow only |
| Refund-linked ledger corrections | Only via reason-coded append entries through the reconciliation path (RB-05) — never direct balance manipulation (structurally impossible: balances are derived, ADR-012) |

### 2.2 Restrictions (hard, enforced structurally where possible)

- **Cannot view decrypted OAuth tokens or any C1 material** — the admin surface runs in the web tier, which holds no KMS decrypt permission for C1 keys (Doc 22 §4 IAM invariant); this is not a UI omission, it is a missing capability.
- **Cannot send outreach on behalf of customers** — send paths require a customer-realm session bound to the connected mailbox owner (ADR-010: sends originate from the *user's* mailbox); no staff code path reaches the send queue.
- **Cannot create or modify credit grants outside reason-coded reconciliation entries.**
- **Every mutating action requires a `reason` field (min 10 chars) + optional ticket ref**, written in the same transaction as the action — the audit-first invariant (Doc 21 §2.4): audit write fails → action fails.

### 2.3 Use Cases

Design-partner support (consented impersonation), incident response (queue tooling, audit forensics — Doc 27), compliance operations (erasure execution, merge resolution, contested removals), platform operations (flags, cost guardrails, canary workspace management — Doc 24 §6.1).

---

## 3. Support Role (Internal Staff — Limited Access)

### 3.1 Capabilities (all read-only)

- **Workspace inspection:** members, seat/plan status (boolean/tier level), usage metrics (job counts, feature usage), workspace settings — for troubleshooting "why isn't X working."
- **Creator admin view (read-only):** GCP attributes + workspace links for the workspace under investigation.
- **Ticket/user report viewing** in the support tool; `request_id` lookup against the Axiom **`ops` stream only** (Doc 23 §10 dependency: Support explicitly has *no* `audit` stream access — the audit stream contains staff-action forensics that Support should not read, per least privilege).
- **Audit log, workspace-scoped read:** a *filtered view* exposing customer-actor events for one named workspace (helps answer "who on your team changed this?") — implemented as a scoped query API, not raw stream access, preserving the `audit`-stream denial above.
- **Notification preference management for designated test workspaces only** (allowlisted workspace IDs) — the single write capability, scoped to non-customer data.

### 3.2 Explicit Denials (the defining feature of the role)

| Denial | Enforcement |
|---|---|
| NO impersonation | Endpoint requires `role=admin`; no Support UI affordance |
| NO system configuration (flags, queue tooling, deploy approvals) | Role check + Unleash/GitHub permissions don't include Support principals |
| NO billing/financial data (ledger entries, credit balances, amounts) | Support workspace view omits ledger endpoints entirely; sees plan *tier* and payment-state *boolean* (active/past-due), never amounts — enough to triage "my payment failed" tickets without financial visibility |
| NO destructive actions (suspension, erasure, merge, redrive) | `role=admin` on all mutating admin endpoints |
| NO C1 access | Same structural impossibility as Admin (§2.2) plus role denial |
| NO outreach sending or sequence modification | No staff path exists (§2.2); doubly denied |
| NO production DB access, no cloud console | Doc 28 §7.2 policy; no IAM bindings issued to Support principals |

### 3.3 Escalation Path

- Support → Admin escalation via ticket handoff with the investigation summary; the Admin's subsequent action cites the ticket ref in its mandatory reason field — creating a documented chain from customer report → Support triage → Admin action.
- Support **cannot** execute any Doc 27 runbook step marked destructive (§8), and cannot serve as the second person in two-person confirmations (confirmation requires Admin judgment and Admin accountability).
- Support **can** serve as Communications Lead input during incidents (customer-facing ticket load is their signal) and performs first-line triage of the creator removal channel (Doc 28 §2.6): verification checking and queuing — **execution of the erasure remains Admin-only**.

---

## 4. Permission Matrix

Canonical matrix for the Doc 20 admin surface (`/v1/admin/*`). Legend: ✅ allowed, 👁 read-only, ❌ denied. Every ✅ row's audit entry includes: staff `sub`, role, `X-Workspace-ID` (if scoped), reason, ticket ref, `request_id`, timestamp.

| Endpoint (Doc 20 admin surface) | Support | Admin | Audit Requirement | Escalation |
|---|---|---|---|---|
| `GET /admin/workspaces/:id` (overview) | 👁 (no financial fields) | ✅ | Access logged w/ reason | — |
| `GET /admin/workspaces/:id/members` | 👁 | ✅ | Access logged | — |
| `GET /admin/workspaces/:id/usage` | 👁 (counts only) | ✅ | Access logged | — |
| `GET /admin/workspaces/:id/ledger` | ❌ | ✅ | Access logged w/ reason | Support → ticket → Admin |
| `POST /admin/workspaces/:id/suspend` / `reinstate` | ❌ | ✅ | Mandatory reason + ticket; same-txn audit | Admin only; suspension of paying customer requires founder co-sign (§8) |
| `GET /admin/creators/:id` (GCP full view) | 👁 | ✅ | Access logged w/ reason (cross-tenant view) | — |
| `POST /admin/creators/:id/erase` (Tier 2, ADR-025) | ❌ | ✅ | Mandatory reason + removal-request ID; same-txn audit; erasure lifecycle events | Support triages channel → Admin executes |
| `POST /admin/creators/merge` / `unmerge` (PATCH-008) | ❌ | ✅ | Evidence summary required in reason | — |
| `GET /admin/audit` (platform-wide) | ❌ | ✅ | Meta-audited (audit reads are themselves logged) | — |
| `GET /admin/audit?workspace=:id` (customer-actor scoped view) | 👁 | ✅ | Access logged | — |
| `POST /admin/impersonation/sessions` | ❌ | ✅ | §5 full protocol | — |
| Flags (Unleash UI/API) | ❌ | ✅ | Unleash audit + mirror | Kill-switch flips during incidents follow Doc 27 IC authority |
| Queue tooling (`GET` health / `POST` redrive) | ❌ | ✅ | Redrive: reason + incident channel ref | Two-person for event-skip (§8) |
| Cost dashboards (Grafana FS-10.03) | ❌ | ✅ (CPO additionally, see below) | Grafana access logs | — |
| `POST /admin/test-workspaces/:id/notifications` | ✅ (allowlisted) | ✅ | Standard log | — |

**Adjacent permission mappings (resolving prior documents' deferrals):**
- **Doc 26 `production` environment deploy approval:** Admin-role engineers listed in the GitHub environment reviewers.
- **Doc 26 `cpo-cost-gate-approved` label (ADR-028):** CPO principal only — modeled as an attribute on a staff identity, not a third role; **Doc 25 open question #2 resolved: the prompt steward is a manifest-declared responsibility** (review routing), not a permission role; the *cost gate* is the CPO's, the *quality judgment* is the steward's, and neither requires new RBAC machinery.
- **`api-breaking-approved` label:** any two Admin-role engineers (matches Doc 25 two-approver rule).
- **Rate limiting:** admin endpoints get a dedicated Layer-3 class (Doc 20): low ceilings (staff traffic is human-scale; a high-rate staff token is an anomaly by definition → alert, Doc 23 security dashboard).

---

## 5. Impersonation Workflow

### 5.1 Triggers (exhaustive)

1. **Design-partner support:** standing contractual consent clause + per-session confirmation recorded (ticket ref to the consent).
2. **Sev1/Sev2 incident:** emergency basis; IC authority per Doc 27; PIR reviews the necessity.

No third trigger exists. "Customer asked me to look" without a consent record routes through Support's read-only view instead.

### 5.2 Session Protocol

- **Start:** `POST /admin/impersonation/sessions` with target workspace, reason, trigger type, ticket/incident ref → audit entry written same-txn → time-boxed session token issued (**60 min default, configurable down, never up without founder co-sign**).
- **During:** persistent banner ("Impersonating workspace X — session ends HH:MM — all actions recorded"); the impersonation token is a *distinct token type* carrying both `stf_` subject and impersonation context — every log line and audit entry during the session is **dual-attributed** (`actor_id = stf_...`, `impersonation_session_id`, `on_behalf_of_workspace`).
- **Capabilities:** read-everything the customer's Owner role could read in WP plane + linked GCP data via `workspace_creator_link` (ADR-024 path — impersonation does not grant the cross-tenant GCP view; that stays on the admin surface). **No writes**: no data modification, no outreach, no credit-consuming actions, no settings changes. **No C1** (structural, §2.2). Read-only impersonation covers the actual use case — *seeing what the customer sees* — while eliminating the abuse ceiling (R-SEC-009).
- **End:** expiry or explicit end → closing audit entry (duration, request count). Session records retained 24 months (security audit stream, Doc 21 §6.4).
- **Visibility to customer:** impersonation sessions appear in the workspace's own audit-visible history at S2 (product surface); at S1, disclosed on request — flagged as an open question (§10).

---

## 6. Access Review & Offboarding

### 6.1 Quarterly Access Review

CTO/Founder reviews: all staff principals vs. current responsibilities; Admin-role justification re-affirmed individually (Admin is exceptional, not default — new staff start as Support); dormant accounts (no login 30 days) deactivated; allowlists audited (test workspaces §3.1, GitHub environment reviewers, Unleash principals, Grafana access). Review itself produces an audit entry; findings tracked like PIR items (Doc 27 §7).

### 6.2 Offboarding Checklist (same-day, named runbook per Doc 28 §7.2)

1. Staff auth tenant: identity disabled (kills all sessions ≤15 min via token expiry)
2. GitHub org removal (incl. environment reviewer lists)
3. PagerDuty rotation removal + schedule re-balance
4. Secret manager principal revocation
5. Cloud IAM detachment (per-env roles)
6. Unleash / Grafana / Axiom / PagerDuty SaaS seats revoked
7. Hardware key de-registered
8. Audit entry: offboarding timestamp, executor, checklist confirmation

Checklist executed by an Admin *other than* the leaver; founder executes for Admin-role leavers.

### 6.3 Break-Glass Access

- **Purpose:** critical incidents where normal Admin tooling is insufficient or unavailable (e.g., staff auth tenant outage during a Sev1, direct DB intervention per Doc 27 runbooks).
- **Mechanism:** sealed break-glass credentials (Doc 22 §8) under two-person access — retrieval requires founder + one Admin, each action logged; **4-hour time box**, credentials rotated immediately after use (RB-08 machinery).
- **Mandatory PIR** for every break-glass use, no exceptions — even "successful" uses (Doc 27 §7): break-glass is by definition a gap in normal tooling, and the PIR's prevention item should close it.

---

## 7. Middleware Enforcement (Doc 20 Integration)

- **Enforcement point:** the staff admin surface has its own middleware chain: staff-issuer JWT verification → `realm` assertion → role check per endpoint (declarative route metadata, mirroring Doc 20's role annotations) → `X-Workspace-ID` extraction + audit-context binding → handler. Role checks are route metadata, not in-handler conditionals — the §4 matrix is *generated from* route metadata, so the document and the code cannot drift (same pattern as Doc 25 §4 manifest cross-checks; a CI check diffs generated matrix vs. this document's committed table).
- **Audit middleware:** wraps every admin mutation in the transactional audit pattern (Doc 21 §2.4); reads are logged post-response (read-logging failure alerts but does not fail the read — reads are not mutations; this asymmetry is deliberate and documented).
- **Tenancy interaction:** staff reads of WP data bypass customer-session tenancy (they are the `@TenancyExempt`-reviewed paths, Doc 21 §2.2) but *always* carry the explicit `X-Workspace-ID` scope — RLS session variable is set to the named workspace, so the DB-layer guarantee still applies; there is no "all workspaces at once" WP query even for Admins (the cross-tenant GCP creator view is GCP-plane, where tenancy doesn't apply — ADR-008/024 boundary respected).

---

## 8. Runbook Execution Permissions (Doc 27 Integration)

| Runbook / Step Class | Support | Admin | Two-Person Rule |
|---|---|---|---|
| RB-01/02/03 diagnosis (dashboards, Axiom `ops`) | 👁 (dashboards where granted) | ✅ | — |
| RB-03 abuse-pattern triage → escalation | ✅ (triage) | ✅ (action) | — |
| RB-04 actor fallback flag flip | ❌ | ✅ | — (kill-switch, IC authority) |
| RB-05 reconciliation run | ❌ | ✅ | — (idempotent by design) |
| RB-06 DLQ redrive | ❌ | ✅ | — |
| RB-06 **event skip** (data-loss decision) | ❌ | ✅ | **Admin + Admin**, or Admin + Founder (Doc 27 R-OPS-003; async 15-min timeout rule ratified per Doc 27 open Q3) |
| RB-07 `pg_terminate_backend` | ❌ | ✅ | Admin + second (same rule) |
| RB-08 secret rotation | ❌ | ✅ | — (speed beats ceremony at 4 h clock; logged) |
| PITR restore execution (§5, Doc 27) | ❌ | ✅ | **Admin + Founder** (Sev1 by definition) |
| Workspace suspension (paying customer) | ❌ | ✅ | Admin + Founder co-sign |
| GDPR erasure execution | triage only | ✅ | Single Admin (verification already gates it; speed serves the SLA) |
| Break-glass | ❌ | per §6.3 | Founder + Admin always |

---

## 9. Risk Register Updates

| ID | Category | Risk | L | I | Mitigation |
|---|---|---|---|---|---|
| **R-STF-001 (new)** | Security | Role creep: Support principals accumulate Admin-ish grants via ad-hoc exceptions | M | H | No per-user grants — role is the only permission unit; exceptions require a role change reviewed at §6.1; quarterly allowlist audit |
| **R-STF-002 (new)** | Security | Two-role model too coarse at scale (future: billing-ops, compliance-officer needs) | M | M | Accepted for S1/S2 (ADR-006 spirit); route-metadata enforcement makes role additions cheap; revisit at first ops hire beyond eng |
| **R-STF-003 (new)** | Security | Matrix drift between this document, route metadata, and actual checks | M | H | Generated-matrix CI diff (§7); Doc 24 §6.4 staff-plane tests exercise denials, not just allows |
| **R-STF-004 (new)** | Operational | Founder as mandatory co-signer becomes availability bottleneck in incidents | M | M | Async 15-min timeout rule (§8); second Admin as alternate where specified; PIR reviews every timeout-proceed |
| R-SEC-009 | Security | Impersonation abuse | L | H | **Strengthened & partially retired:** read-only impersonation (§5.2) removes the write-abuse ceiling entirely; residual = read-privacy abuse, mitigated by dual attribution + 24-month retention + S2 customer visibility |

---

## 10. Assumptions & Dependencies

**New assumptions:**

| ID | Description | Confidence |
|---|---|---|
| A-097 | Read-only impersonation suffices for design-partner support (no legitimate need for staff writes-as-customer) | Med-High (if falsified, write-impersonation returns as a founder-co-signed exception with its own ADR) |
| A-098 | Auth provider supports two fully isolated tenants + WebAuthn enforcement per tenant at our tier | High (verify at setup) |
| A-099 | Route-metadata → matrix generation is implementable in the chosen framework (mirrors A-080's spec-generation confidence) | Med-High |
| A-100 | S1/S2 staff count (≤8) makes the two-role model and founder co-sign rules operable | High (R-STF-002/004 are the watch items) |

**Dependencies:** Doc 20 (admin endpoint inventory the matrix maps; rate-limit class), Doc 21 (§2.4 mechanisms this document configures; C1 structural denials), Doc 23 (audit/ops stream access split; security dashboard), Doc 24 (§6.4 staff-plane test suite must cover every ❌ in the matrix — denial tests are the release-blocking half), Doc 26 (environment reviewers, label permissions), Doc 27 (runbook execution table §8; break-glass drill Q4), Doc 28 (§7.2 employee access policy this document implements; removal-channel triage split).

**Open questions:**
1. Customer-visible impersonation history at S1 (recommend: ship the audit substrate now — already exists — and the UI surface at S2; disclose on request until then).
2. Whether the CPO cost-gate attribute needs succession/delegation rules (CPO unavailable during a needed prompt promotion) — recommend founder as delegate, recorded per-use.
3. Support access to Grafana operational dashboards (§8 grants are ambiguous for pure dashboards) — recommend read access to Queue/Provider health dashboards (aids triage), denial on Cost and Security Posture dashboards; ratify at first Support hire.

---

**End of Document 29.**

---

#### Phase 8 Completion Summary

Documents 21-29 are now drafted, completing the 29-document SDLC set:

- **Doc 21** — Security, Privacy & Compliance (locked)
- **Doc 22** — Infrastructure & Deployment (locked)
- **Doc 23** — Monitoring, Logging & Observability (locked)
- **Doc 24** — Testing Strategy & QA (locked)
- **Doc 25** — Engineering Standards & Code Review (locked)
- **Doc 26** — CI/CD Pipeline & Release Management (locked)
- **Doc 27** — Operational Runbooks & Incident Response (locked)
- **Doc 28** — Legal, Terms & Data Governance (locked)
- **Doc 29** — Internal User Roles & Permissions (this document)

**Cross-phase threads resolved in Phase 8:** Axiom vs. Loki (Doc 23), Turborepo vs. Nx (Doc 26), prompt steward role (Doc 29 §4), Doc 27 two-person async rule (Doc 29 §8). **Threads carried forward:** A-032 Paddle/PK entity verification (existential, pre-GA), counsel deliverables (Doc 28 §9), child-creator policy gap (Doc 28 open Q2), A-064/A-069 benchmark gates (Doc 24).

[DOCUMENTATION PHASE COMPLETE - AWAITING FINAL REVIEW]
