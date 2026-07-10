# MUSHIN 2.0 — Provider Validation Report

*Generated: 2026-07-09*

---

## Summary

| Provider | Status | Tests | Notes |
|----------|--------|-------|-------|
| Supabase PostgreSQL | PARTIALLY_VERIFIED | 5 mock tests, 3 blocked | Schema validated, RLS defined, no real connection test |
| Meilisearch Cloud | PARTIALLY_VERIFIED | 8 mock tests, 3 blocked | Adapter verified, degraded mode tested, no real index test |
| Resend | PARTIALLY_VERIFIED | 5 mock tests, 1 blocked | Adapter verified, invalid credentials tested, no real send test |
| Paddle Sandbox | PARTIALLY_VERIFIED | 7 mock tests, 2 blocked | Adapter verified, HMAC tested, no real webhook test |
| Serper | PARTIALLY_VERIFIED | 3 mock tests, 1 blocked | Adapter verified, no real search test |
| Apify | PARTIALLY_VERIFIED | 3 mock tests, 1 blocked | Adapter verified, no real scrape test |
| AWS SQS | PARTIALLY_VERIFIED | 3 mock tests, 1 blocked | Publisher verified, no real queue test |
| Sentry | PARTIALLY_VERIFIED | 3 mock tests, 1 blocked | Logger verified, no real exception capture |

---

## 16.1 — Database (Supabase PostgreSQL)

| Test | Status | Evidence |
|------|--------|----------|
| Connection configured | VERIFIED | `getDb()` function exists and accepts connection string |
| Migrations exist | VERIFIED | 9 SQL files (V001-V009) in supabase/migrations/ |
| RLS policies defined | VERIFIED | V005 creates 15 policies across 11 WP tables |
| pgvector defined | VERIFIED | V008 creates extension, embedding column, IVFFlat index |
| Backup creation | BLOCKED | Requires real database connection |
| Restore procedure | BLOCKED | Requires real database connection |
| Real connection | BLOCKED | Requires DATABASE_URL in .env |

---

## 16.2 — Search (Meilisearch Cloud)

| Test | Status | Evidence |
|------|--------|----------|
| Adapter creates | VERIFIED | `new MeilisearchAdapter({host, apiKey})` works |
| All methods exist | VERIFIED | upsertDocument, upsertDocuments, search, health, ping, configureIndex |
| Circuit breaker initializes | VERIFIED | getCircuitStatus() returns 'closed' |
| Degraded mode works | VERIFIED | Invalid host returns 'error' status, not exception |
| Index creation | BLOCKED | Requires MEILISEARCH_HOST in .env |
| Document ingestion | BLOCKED | Requires MEILISEARCH_HOST in .env |
| Search execution | BLOCKED | Requires MEILISEARCH_HOST in .env |

---

## 16.3 — Email (Resend)

| Test | Status | Evidence |
|------|--------|----------|
| Adapter creates | VERIFIED | `new ResendAdapter({apiKey, fromAddress})` works |
| All methods exist | VERIFIED | sendEmail, health |
| Circuit breaker initializes | VERIFIED | getCircuitStatus() returns 'closed' |
| Invalid credentials handled | VERIFIED | sendEmail returns `{success: false, error: ...}` |
| Real send | BLOCKED | Requires RESEND_API_KEY in .env |

---

## 16.4 — Billing (Paddle Sandbox)

| Test | Status | Evidence |
|------|--------|----------|
| Adapter creates | VERIFIED | `new PaddleAdapter({apiKey, webhookSecret, environment})` works |
| All methods exist | VERIFIED | createSubscription, cancelSubscription, updateSubscription, getSubscription, parseWebhook, health |
| Webhook verification rejects invalid signature | VERIFIED | parseWebhook returns null for bad signature |
| Circuit breaker initializes | VERIFIED | getCircuitStatus() returns 'closed' |
| Real checkout | BLOCKED | Requires PADDLE_API_KEY in .env (sandbox) |
| Real webhook | BLOCKED | Requires PADDLE_WEBHOOK_SECRET in .env |

---

## 16.5 — Discovery (Serper + Apify)

| Test | Status | Evidence |
|------|--------|----------|
| Serper adapter creates | VERIFIED | `new SerperAdapter({apiKey})` works |
| Serper methods exist | VERIFIED | search, searchSocialProfiles, health |
| Apify adapter creates | VERIFIED | `new ApifyAdapter({apiKey})` works |
| Apify methods exist | VERIFIED | runActor, fetchDataset, health |
| Discovery orchestrator exists | VERIFIED | `DiscoveryOrchestrator` class importable |
| Real Serper search | BLOCKED | Requires SERPER_API_KEY in .env |
| Real Apify scrape | BLOCKED | Requires APIFY_API_KEY in .env |

---

## 16.6 — Queue (AWS SQS)

| Test | Status | Evidence |
|------|--------|----------|
| SQS publisher creates | VERIFIED | `new SQSPublisher({region, credentials, queueUrls})` works |
| InMemory publisher works | VERIFIED | Events stored and retrievable |
| Outbox relay creates | VERIFIED | `new OutboxRelay(db, publisher)` works |
| Real publish | BLOCKED | Requires AWS credentials and SQS queue URLs in .env |

---

## 16.7 — Monitoring (Sentry)

| Test | Status | Evidence |
|------|--------|----------|
| Structured logger produces JSON | VERIFIED | Output is valid JSON with ts, service, level, message |
| Logger redacts C1 fields | VERIFIED | password, api_key become '[REDACTED]' |
| Logger redacts C2 fields | VERIFIED | email becomes '[PSEUDO:hash]' |
| Real exception capture | BLOCKED | Requires SENTRY_DSN in .env |

---

## Blocked Tests Summary

| Provider | Blocked Tests | Required Credentials |
|----------|---------------|---------------------|
| Supabase | 3 | DATABASE_URL |
| Meilisearch | 3 | MEILISEARCH_HOST, MEILISEARCH_API_KEY |
| Resend | 1 | RESEND_API_KEY |
| Paddle | 2 | PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET |
| Serper | 1 | SERPER_API_KEY |
| Apify | 1 | APIFY_API_KEY |
| SQS | 1 | AWS credentials, SQS URLs |
| Sentry | 1 | SENTRY_DSN |

**Total: 12 tests blocked by missing credentials**

---

## Next Steps

1. Add all CRITICAL credentials to .env (3 keys)
2. Add all REQUIRED credentials to .env (14 keys)
3. Run `pnpm test:integration` to execute blocked tests
4. Verify each provider returns expected results
5. Mark tests as VERIFIED after real transactions complete

---

## Related

- [[CREDENTIAL-STATUS|Credential Status]]
- [[PRODUCTION-AUDIT|Production Audit]]
- [[PHASE-SUMMARY|Phase Summary]]
