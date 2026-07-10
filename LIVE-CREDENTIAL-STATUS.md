# LIVE-CREDENTIAL-STATUS.md

*Generated: 2026-07-09*

---

## Provider Status

| Provider | Status | Latency | Evidence |
|----------|--------|---------|----------|
| Meilisearch | ✅ VERIFIED | 545ms | Health endpoint returned "available" |
| Upstash Redis | ✅ VERIFIED | 669ms | PING → PONG response |
| Groq | ✅ VERIFIED | 999ms | llama-3.1-8b-instant returned "OK" |
| YouTube | ✅ VERIFIED | 1085ms | Retrieved video metadata successfully |
| Apify | ✅ VERIFIED | 1217ms | Account confirmed, free plan |
| Resend | ✅ VERIFIED | 1546ms | API key valid, 0 domains configured |
| HuggingFace | ✅ VERIFIED | 983ms | API key valid |
| Supabase | ❌ FAILED | 626ms | HTTP 401 — needs DATABASE_URL connection string |
| Serper | ❌ FAILED | 1588ms | "Not enough credits" — account has no balance |

---

## Credential Classification

| Credential | Value Present | Provider Response |
|------------|---------------|-------------------|
| SUPABASE_URL | Yes | HTTP 401 (no DATABASE_URL for direct connection) |
| SUPABASE_ANON_KEY | Yes | Valid key format |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Valid key format |
| MEILISEARCH_HOST | Yes | Healthy |
| MEILISEARCH_API_KEY | Yes | Working |
| GROQ_API_KEY | Yes | Working |
| YOUTUBE_API_KEY | Yes | Working |
| APIFY_TOKEN | Yes | Working |
| SERPER_API_KEY | Yes | No credits |
| UPSTASH_REDIS_REST_URL | Yes | Working |
| UPSTASH_REDIS_REST_TOKEN | Yes | Working |
| RESEND_API_KEY | Yes | Working |
| HUGGINGFACE_API_KEY | Yes | Working |
| ANTHROPIC_API_KEY | Yes | Untested (user says it's Ollama key) |
| PADDLE_API_KEY | No | MISSING |
| PADDLE_WEBHOOK_SECRET | No | MISSING |
| AWS_* | No | MISSING |
| SQS_* | No | MISSING |
| SENTRY_* | No | MISSING |
| DATABASE_URL | No | MISSING |
