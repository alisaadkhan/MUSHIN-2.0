# MUSHIN 2.0 — Launch Hardening Checklist

**Source:** Master Implementation Plan Phase 13, AGENTS.md Section 11 (Definition of Done)

---

## 1. Security Hardening

### 1.1 Penetration Testing
- [ ] API endpoint security audit
- [ ] Authentication bypass attempts
- [ ] Authorization bypass attempts (tenant isolation)
- [ ] SQL injection testing
- [ ] XSS testing (if frontend exists)
- [ ] CSRF testing

### 1.2 RLS Verification
- [ ] Verify RLS policies block cross-workspace access
- [ ] Verify `mushin_system_worker` BYPASSRLS works correctly
- [ ] Verify `app.current_workspace_id` propagation
- [ ] Test with RLS enabled AND disabled (for comparison)

### 1.3 Secret Management
- [ ] Verify `.env` is not committed
- [ ] Verify all secrets are in environment variables
- [ ] Rotate any exposed credentials
- [ ] Verify webhook signature verification works

---

## 2. Load Testing

### 2.1 API Performance
- [ ] p95 latency < 1s for search endpoints (DOC-024 NFR-P01)
- [ ] p95 latency < 500ms for CRUD endpoints
- [ ] 100 concurrent users without degradation
- [ ] Rate limiting works correctly

### 2.2 Database Performance
- [ ] Query performance with RLS enabled
- [ ] Index effectiveness verification
- [ ] Connection pool sizing
- [ ] Partition maintenance (credit_ledger_entry, interaction_timeline)

### 2.3 Queue Performance
- [ ] Outbox relay throughput under load
- [ ] Worker processing throughput
- [ ] DLQ handling under failure conditions

---

## 3. DR Verification

### 3.1 Backup & Recovery
- [ ] Database backup verification
- [ ] Point-in-time recovery test
- [ ] Migration rollback procedure (expand-contract)
- [ ] Cross-region failover (if applicable)

### 3.2 Quarterly Drill Schedule
- [ ] Run DOC-027 quarterly drill now (not just on schedule)
- [ ] Document recovery time
- [ ] Document data loss window

---

## 4. Cost Validation

### 4.1 Margin Guardrail (DOC-003)
- [ ] Credit price >= 3x marginal COGS
- [ ] LLM cost per enrichment calculation
- [ ] Meilisearch Cloud cost calculation
- [ ] Apify cost per scrape calculation
- [ ] Paddle transaction fees included

### 4.2 Cost Monitoring
- [ ] Cost tracking in place for all adapters
- [ ] Alert thresholds configured
- [ ] Budget alerts configured

---

## 5. Documentation Completeness

### 5.1 AGENTS.md Section 8 Checklist
- [ ] ADR references updated/added
- [ ] Schema notes match shipped migration
- [ ] API docs match shipped contract
- [ ] Worker docs match actual trigger/retry/side-effect behavior
- [ ] Dependency graph updated
- [ ] `architecture-state.json` reflects new state
- [ ] Changelog entry written
- [ ] MOC pages updated, wikilinks resolve
- [ ] Repository folder structure documentation updated

---

## 6. Test Coverage

### 6.1 Required Tests (AGENTS.md Section 7)
- [ ] Unit: happy path, validation failures, permission failures, boundary conditions
- [ ] Integration: API contract conformance, DB writes, outbox event emission
- [ ] Security: tenant isolation, RBAC, auth-bypass attempts, injection attempts
- [ ] Regression: old endpoints, migrations, and event contracts still work
- [ ] Performance: latency, throughput against DOC-016 F1 load envelope

### 6.2 Test Results
- [ ] All 186 tests passing
- [ ] No known test failures
- [ ] Coverage report generated

---

## 7. Operational Readiness

### 7.1 Monitoring
- [ ] Structured logging in place (JSON)
- [ ] Correlation IDs propagated (request_id → trace_id)
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring configured (Grafana)
- [ ] Alerting configured for critical paths

### 7.2 Runbooks
- [ ] Incident response runbook
- [ ] Scaling runbook
- [ ] Database maintenance runbook
- [ ] Queue maintenance runbook

---

## 8. Final Sign-Off

- [ ] All open items resolved or documented as accepted risk
- [ ] Architecture state finalized
- [ ] Launch approval from stakeholders
- [ ] Go/no-go decision documented

---

**Status:** Ready for launch hardening execution.
**Test count:** 186 tests passing across 16 test files.
**Build status:** All 8 packages build successfully.
