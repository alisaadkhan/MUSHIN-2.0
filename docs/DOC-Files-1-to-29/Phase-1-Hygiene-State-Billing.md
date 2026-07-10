# Phase 1 — Hygiene Patch List, State Tracking, and Billing Abstraction

---

## 1. Hygiene: Assumption ID Renumbering (verified by direct extraction — 22 edits, 9 files)

Ten IDs collide (same number, two meanings). The **first** use of each (chronologically, by phase) keeps its number; the **later** duplicate gets renumbered starting at **A-101** — verified via `grep` that A-100 is the current highest ID in use, so 101+ is guaranteed collision-free.

**Home definitions to renumber:**

| File | Old ID | New ID | (kept as-is elsewhere) |
|---|---|---|---|
| DOC-021 | A-061 (GDPR legitimate interest) | **A-101** | DOC-017's A-061 (Apify fallback actors) unchanged |
| DOC-021 | A-062 (PECA 2016 localization) | **A-102** | DOC-017's A-062 (LLM providers) unchanged |
| DOC-021 | A-063 (SOC 2 Type II) | **A-103** | DOC-017's A-063 (SERP caching) unchanged |
| DOC-021 | A-064 (RLS overhead) | **A-104** | DOC-017's A-064 (Edge/WAF tier) unchanged |
| DOC-022 | A-065 (Neon Mumbai region) | **A-105** | DOC-017's A-065 (mailbox polling) unchanged — DOC-020's citation already correctly points to Doc17's meaning, no change needed there |
| DOC-022 | A-066 (SQS FIFO throughput) | **A-106** | DOC-019's A-066 (PostgreSQL version) unchanged |
| DOC-022 | A-067 (4-hour DB RTO) | **A-107** | DOC-019's A-067 (search index latency) unchanged |
| DOC-023 | A-070 (Axiom pricing) | **A-108** | DOC-019's A-070 (monthly partitioning) unchanged |
| DOC-023 | A-071 (Apify compute-unit data) | **A-109** | DOC-019's A-071 (`NULLS NOT DISTINCT`) unchanged |
| DOC-023 | A-072 (canary panel representativeness) | **A-110** | DOC-019's A-072 (`GENERATED ALWAYS AS STORED`) unchanged |

**Downstream citations to fix (each confirmed by reading the citing context, not just the ID string):**

| File : Line | Current text | Fix |
|---|---|---|
| DOC-024:172 | `(A-064 validation: same suite with RLS disabled...)` | → A-104 |
| DOC-024:285 | `Panel refresh runbook (A-072)` | → A-110 |
| DOC-024:322 | `(A-072 runbook hedges)` | → A-110 |
| DOC-024:324 | `A-064 \| *(validation scheduled)* RLS overhead...` | → A-104 |
| DOC-027:120 | `private/deleted — A-072` | → A-110 |
| DOC-027:159 | `(validates A-067)` | → A-107 |
| DOC-027:231 | `(refines A-067)` | → A-107 |
| DOC-028:75 | `LIA memo is the blocking artifact — A-061` | → A-101 |
| DOC-028:170 | `SOC 2 Type II... (A-063)` | → A-103 |
| DOC-028:184 | `Legitimate-interest basis (A-061) rejected` | → A-101 |
| DOC-028:208 | `LIA memo (A-061/R-LEG-008)` | → A-101 |
| DOC-029:260 | `A-064/A-069 benchmark gates` | → A-104/A-069 (only the first ID changes — A-069 is unique, correct as-is) |

*(Not touched: DOC-020:1095's `A-065` — verified this cites DOC-017's original meaning, not DOC-022's; DOC-024's other `A-069` mentions — unique, no collision; DOC-027's other `A-069` mentions — same.)*

## 2. Hygiene: "Doc 27" Stale References (12 instances, 6 files)

Confirmed Doc 27 = *Operational Runbooks & Incident Response* everywhere in Docs 21–29 (30+ correct citations). These 12 treat it as a product-roadmap/sprint-planning document instead — a real destination for this content doesn't currently exist among the 29 documents, so this isn't a simple renumber:

- DOC-001:105, DOC-001:138
- DOC-002:106, DOC-002:113, DOC-002:136
- DOC-004:54
- DOC-006:66
- DOC-007:21, DOC-007:150, DOC-007:163, DOC-007:207
- DOC-013:165

**Recommendation:** either (a) redirect these to DOC-007's existing epic/stage-tag sequencing content if that's close enough in substance, or (b) spin up a lightweight standalone Roadmap artifact outside the 001–029 numbering (a 30th document, or a vault-only MOC) and repoint all 12. I'd lean toward (b) — the citations consistently describe something with its own cadence (sprint decomposition, estimation passes, year-2/3 timing) that doesn't naturally live inside the Master PRD's structure. Flagging the choice rather than picking it, since it's a documentation-structure decision, not a pure bug fix.

---

## 3. `architecture-state.json` — Schema

Maintained at repo root; updated automatically at Module Execution Protocol step 12 (Section 8 of your directive). Recommend the same CI cross-check pattern DOC-025 §4 already applies to API/metrics manifests: a build step that diffs this file's `modules[].status` against actual deployed routes/migrations and fails if they disagree — otherwise this file drifts exactly like DOC-018 did.

```json
{
  "schema_version": "1.0",
  "last_updated": "2026-07-08T00:00:00Z",
  "updated_by": "module-executor | ci | manual",
  "active_adrs": [
    { "id": "ADR-029", "title": "Identity Resolution Matching Algorithm", "status": "accepted" },
    { "id": "ADR-030", "title": "Credit Reservation Lifecycle", "status": "pending_approval" }
  ],
  "modules": [
    { "id": "M1", "name": "Identity & Tenancy Kernel", "status": "not_started", "blocking_reason": null }
  ],
  "open_architectural_decisions": [
    { "ref": "ADR-030", "blocks": ["M9-Billing"], "owner": "product" }
  ],
  "deferred_items": [
    { "item": "Timeline D3 taxonomy ratification", "source": "DOC-018 Part D3", "reason": "TEXT column allows evolution without migration; low urgency" }
  ],
  "current_migration_version": "V000",
  "extraction_trigger_status": [
    { "module": "M4", "metric": "creator-plane QPS", "current": null, "threshold": "per DOC-016 F3", "triggered": false }
  ],
  "feature_flags": [
    { "flag": "identity_resolution_v2", "default": false, "workspace_scoped": true },
    { "flag": "cross_platform_discovery", "default": false, "workspace_scoped": true },
    { "flag": "m14_ai_feedback_loop", "default": false, "workspace_scoped": true }
  ]
}
```

---

## 4. `BillingProvider` Abstraction

Per your directive's item A.9. Stack inferred as TypeScript/Node from DOC-025's ESLint tooling — flag if that's wrong. Follows the same seven-obligation shape as the existing Adapter Layer (ADR-022), so Paddle isn't structurally different from any other external dependency:

```typescript
interface BillingProvider {
  createCheckoutSession(params: {
    workspaceId: string;
    planId: string;
    billingEntity: 'default' | 'pk_entity'; // A-032-dependent; see note below
  }): Promise<{ checkoutUrl: string; sessionId: string }>;

  getSubscriptionStatus(workspaceId: string): Promise<{
    status: 'active' | 'past_due' | 'canceled' | 'expired';
    currentPeriodEnd: Date;
    planId: string;
  }>;

  cancelSubscription(workspaceId: string, opts?: { immediate?: boolean }): Promise<void>;

  // Normalizes provider-specific webhook payloads into MUSHIN's own event shape
  // BEFORE anything touches business logic — this is the seam that makes swapping
  // Merchant-of-Record providers (relevant given the open A-032 dependency) a
  // provider-implementation change, not a rewrite of billing/entitlement code.
  parseWebhook(rawPayload: Buffer, signature: string): Promise<NormalizedBillingEvent>;

  // Read-only entitlement check — never mutates; callers use this, not provider status directly
  getEntitlements(workspaceId: string): Promise<EntitlementSnapshot>;
}

type NormalizedBillingEvent =
  | { type: 'subscription.activated'; workspaceId: string; planId: string }
  | { type: 'subscription.canceled'; workspaceId: string; effectiveAt: Date }
  | { type: 'subscription.payment_failed'; workspaceId: string; retryAt: Date | null }
  | { type: 'subscription.expired'; workspaceId: string };
```

**Note tying this back to A-032:** if Paddle can't onboard the Pakistan entity (still unresolved, existential per DOC-028), the fallback entity plan becomes a *second provider implementation* behind this same interface rather than a rewrite — that's the concrete payoff of doing this abstraction now rather than after the fact.

---

## What's done vs. deferred

**Done this pass:** ADR-029/030/031, DOC-018 finalized, RLS + OAuth/WABA migration, both hygiene patch lists, architecture-state.json schema, BillingProvider interface.

**Deferred to next pass** (flagging exactly where, per your own "don't stop unless blocked" rule — this is a scoping choice, not a block): DOC-030 (Feedback & Product Intelligence module) + ADR-032, the AGENTS.md rewrite incorporating everything from this directive, and the Module Execution Protocol write-up. DOC-030 in particular is comparable in scope to one of the original 29 documents and deserves its own dedicated pass rather than being compressed to fit alongside everything above.
