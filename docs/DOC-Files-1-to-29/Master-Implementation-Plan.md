# MUSHIN Master Implementation Plan

**Target:** Mimo Code Editor, AI-agent-executed under supervision, per AGENTS.md.

---

## Preamble: ADR-033 — Stack Pivot (logged, not silently adopted)

**Status:** Proposed — flagging for your confirmation rather than assuming.

The requested build target — **Supabase Postgres + pgvector, Upstash Redis, Vercel, Apify, Serper, Paddle, OpenAI/Ollama** — differs from what DOC-017/DOC-022 (still nominally higher-precedence) actually specify: **Neon** (not Supabase), **Meilisearch Cloud** (not pgvector) as the search index, and a **Groq/Anthropic/OpenAI routing ladder with confidence-based escalation** (not an OpenAI/Ollama split) for LLM calls. No Redis/Upstash appears anywhere in the original 29 documents.

This matters concretely, not just as a paperwork objection:

| Original (DOC-017/022) | This directive | What actually changes |
|---|---|---|
| Neon Postgres | Supabase Postgres | Mostly cosmetic — both are managed Postgres; migration DDL is portable. Supabase's built-in auth/storage/realtime layers are *not* used here (Identity & Tenancy Kernel and file storage are custom per DOC-014) — worth being explicit that "Supabase" means "their Postgres," not "their platform," or this becomes a much bigger change than intended. |
| Meilisearch Cloud (dedicated search engine: facets, typo tolerance, ranking) | pgvector (in-Postgres vector similarity) | **Not a drop-in swap.** Meilisearch does keyword+filter+facet search; pgvector does nearest-neighbor similarity over embeddings. DOC-015's search design (flattened index document, filter-heavy queries per DOC-020) assumes Meilisearch's feature set. Recommendation below. |
| Groq (cheap tier) -> Claude/GPT-4o (mid) -> o1 (hard cases), all API-hosted | OpenAI + Ollama (self-hosted) | Ollama implies self-hosted inference infrastructure DOC-022 never scoped (GPU compute, model hosting, ops burden) — a materially bigger infra commitment than "call another vendor's API." |
| — (not present) | Upstash Redis | New component; no original document assigns it a role. Assume: rate-limit counters, hot-path caching (search facet counts, entitlement checks) — not the outbox, not the ledger, not anything durability-sensitive. |

**Recommendation, to avoid rework:** keep Meilisearch Cloud for the actual search/filter/rank surface (DOC-015's design is detailed and this directive doesn't ask to replace it), and add pgvector *alongside* it specifically for semantic/similarity features (e.g., "find creators like this one") that Meilisearch doesn't natively do well — additive, not a replacement. For LLM routing, keep the existing ladder's *architecture* (confidence-based escalation, provider-agnostic Adapter) and treat "OpenAI/Ollama" as which providers currently sit in the ladder rather than a redesign — Ollama specifically should wait until there's an actual cost or latency reason to self-host, given the infra lift. This preserves everything DOC-015/017 already got right instead of discarding it. **Flagging this rather than deciding it** — say the word if you'd rather commit to the stack as literally listed, and I'll revise DOC-015/017/022 formally instead of layering a recommendation on top.

Everything below assumes this recommendation unless you tell me otherwise.

---

## Why this isn't 14 phases of exhaustive file-by-file detail

The original request (turn 1) asked for per-module objective/dependencies/files/DB changes/APIs/tests/rollback for every module. At 14 phases and ~30 modules, that level of detail *now*, before any code exists, would itself become exactly the kind of artifact this project has already been burned by twice (DOC-018, the assumption-ID drift): a large upfront document that's stale the moment reality diverges from the plan. Per AGENTS.md Section 9 (context budgeting), detailed per-module specs should be generated **just-in-time**, immediately before that module's "Load Context" step — using the actual current state of the schema/API/adjacent modules at that time, not a snapshot frozen today. What follows is the sequencing layer: phase objectives, dependencies, gates, and the decisions/risks specific to each phase. Ask for any individual phase's full per-module breakdown when you're about to start it, and it'll reflect what's actually true then.

---

## Phase 0 — Foundations
Repo setup, CI/CD skeleton, secrets management, base observability, feature-flag infrastructure, `architecture-state.json` initialized. **Gate:** a PR can go from open to merged through the full pipeline (lint, typecheck, test, deploy-to-staging) on a trivial change before Phase 1 starts.

## Phase 1 — Identity & Tenancy Kernel
Auth, `wp.workspace`, `wp.membership`, `wp.app_user`. This is where the DOC-019 Addendum's RLS baseline actually gets applied — not retrofitted later. **Gate:** tenant-isolation security tests (Section 7 of AGENTS.md) pass, including the negative case (cross-workspace read attempt fails).

## Phase 2 — Billing Foundation
`BillingProvider` interface, Paddle adapter, entitlements, credit ledger, reservation lifecycle (ADR-030, pending your sign-off — implement the mechanism, gate the cancellation-specific behavior behind that sign-off landing). **Risk flag:** A-032 (Paddle/Pakistan entity) is still unresolved and existential. Build the *interface* and a working Paddle adapter now — don't build Pakistan-entity-specific assumptions into the ledger/entitlement logic itself, so a fallback provider (if needed) is a second adapter, not a rewrite. That's the entire point of doing the abstraction first.

## Phase 3 — Creator Plane (GCP)
`gcp.creator`, `gcp.profile`, `gcp.contact_record`, niche system (48-category vocabulary, already fully specified — no design work needed, just implementation), `gcp.enrichment_snapshot`. Identity resolution (ADR-029) belongs here — including `minor_signal` handling from day one, not bolted on later. **Gate:** identity-resolution property tests (deterministic scoring, evidence_breakdown correctness) pass before Phase 5 (which depends on creators existing) starts.

## Phase 4 — Event Infrastructure
Transactional outbox, workers, queues (ADR-031's class-to-queue mapping), retry policies. **Gate:** an event written in the same transaction as its triggering row-write is reliably delivered exactly once to a test consumer, including under simulated worker crash-and-restart.

## Phase 5 — Discovery Pipeline
Live discovery, enrichment orchestration (Serper -> Apify -> LLM per the "Two Brains" design). Depends on Phase 3 (creator entities to write into) and Phase 4 (event infrastructure to emit progress/completion events).

## Phase 6 — Search
Meilisearch index + pgvector similarity (per the ADR-033 recommendation above, pending confirmation). **Gate:** search latency against DOC-016's load envelope (p95 <1s per DOC-024's NFR-P01), tested with RLS enabled — not disabled "to check the number," since that overhead is exactly what A-104 (formerly A-064) needs validated.

## Phase 7 — AI Enrichment Layer
Authenticity, quality, audience estimates, summaries — the snapshot-producing side of what Phase 3 stores. Depends on Phase 5 (raw data to enrich) existing.

## Phase 8 — CRM Layer
Lists, tags, campaigns, tasks. Standard CRUD-plus-workflow; lowest architectural risk phase in the plan.

## Phase 9 — Outreach Layer
Gmail OAuth, WABA, sequences — this is where the DOC-019 Addendum's `oauth_credential`/`whatsapp_business_binding` tables get consumed, and where `minor_signal` gating (AGENTS.md Section 2) has to actually be enforced at the point of send, not just at data-model level. **Gate:** an outreach-eligibility check against a `minor_signal = true` fixture creator must block the send in a test, not just in documentation.

## Phase 10 — Feedback & Product Intelligence (M14)
Deferred to its own spec pass (DOC-030 + ADR-032, not written yet) — implementing against the Master Directive's Feature C sketch directly would mean building against an unreviewed spec. Dashboard actions (Report Bug, Feature Request, General Feedback, Incorrect Creator Data, Fraud Detection Error), each producing a timeline event + support ticket + analytics event + priority score, as specified. Recommend this phase doesn't start until DOC-030 lands.

## Phase 11 — Cross-Platform Discovery
Explicitly isolated and independently deployable/disableable per your directive — this should be closer to a plugin than a core dependency of Identity Resolution. Consumes credits (Phase 2), produces Timeline events (Phase 4), writes confidence scores using **the same evidence-weighting philosophy as ADR-029**, not a second, divergent scoring system — two identity-matching algorithms with different weights would be its own future consistency problem. **`minor_signal` applies here too:** this feature generates *more* cross-platform identity evidence about real people, which is exactly the scenario ADR-029's default was written for — it doesn't get a carve-out for being "premium."

## Phase 12 — Analytics & Reporting
Benchmarking, reporting. Depends on Phases 3–9 having real data flowing to report on; low architectural risk, mostly a consumer of everything before it.

## Phase 13 — Launch Hardening
Penetration testing, load testing, DR verification (the quarterly drill schedule DOC-027 already defines — run it for real here, not just on schedule going forward), cost validation against the margin guardrail (DOC-003: credit price ≥3x marginal COGS).

---

## Cross-Cutting Notes

- **Extension over modification:** future modules (Agency Mode, Marketplace, White Label, Benchmarking, AI Recommendations, Enterprise features) should each map to a new module behind existing boundaries (M1–M14's adapter/plane/event patterns), not a modification of an existing module's internals. If a future feature *can't* be expressed that way, that's a signal worth surfacing, not a reason to bend the boundary quietly.
- **Extraction-readiness:** repository structure should keep each module's code within its own directory boundary from Phase 0 onward (even inside a monolith) — extraction into a separate service, if a DOC-016 F3 threshold is ever crossed, should be a deployment change, not a rewrite.
- **A-032 and the child-creator policy are the two items most likely to force rework if left unresolved too long** — neither blocks Phase 0–1, but A-032 should resolve before Phase 2 goes deep, and the child-creator policy should resolve before Phase 9/11 ship to real users, not after.
