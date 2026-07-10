# MUSHIN 2.0 — Credential Status Report

*Generated: 2026-07-09*

---

## Summary

| Category | Total | Ready | Missing |
|----------|-------|-------|---------|
| CRITICAL | 3 | 0 | 3 |
| REQUIRED | 7 | 0 | 7 |
| OPTIONAL | 12 | 0 | 12 |
| **Total** | **22** | **0** | **22** |

---

## CRITICAL Credentials (Must Set to Start)

| Service | Variable | Where to Get | Status |
|---------|----------|--------------|--------|
| Supabase | `DATABASE_URL` | https://supabase.com/dashboard → Settings → API | MISSING |
| Auth Provider | `JWT_ISSUER` | Your auth provider dashboard | MISSING |
| Auth Provider | `JWKS_URI` | Your auth provider dashboard | MISSING |

---

## REQUIRED Credentials (Must Set for Core Features)

| Service | Variable | Where to Get | Status |
|---------|----------|--------------|--------|
| Paddle | `PADDLE_API_KEY` | https://paddle.com/dashboard → Developer → API Keys | MISSING |
| Paddle | `PADDLE_WEBHOOK_SECRET` | https://paddle.com/dashboard → Developer → Webhooks | MISSING |
| Resend | `RESEND_API_KEY` | https://resend.com/api-keys | MISSING |
| Meilisearch | `MEILISEARCH_HOST` | https://cloud.meilisearch.com → Project → API Keys | MISSING |
| Meilisearch | `MEILISEARCH_API_KEY` | https://cloud.meilisearch.com → Project → API Keys | MISSING |
| Groq | `GROQ_API_KEY` | https://console.groq.com/keys | MISSING |
| Serper | `SERPER_API_KEY` | https://serper.dev/api-key | MISSING |
| Apify | `APIFY_API_KEY` | https://console.apify.com/account/integrations | MISSING |
| AWS | `AWS_ACCESS_KEY_ID` | https://console.aws.amazon.com/iam → Users | MISSING |
| AWS | `AWS_SECRET_ACCESS_KEY` | https://console.aws.amazon.com/iam → Users | MISSING |
| AWS | `SQS_OUTBOX_QUEUE_URL` | https://console.aws.amazon.com/sqs → Create queue | MISSING |
| AWS | `SQS_DLQ_URL` | https://console.aws.amazon.com/sqs → Create queue | MISSING |
| Upstash | `UPSTASH_REDIS_REST_URL` | https://console.upstash.com → Redis → Connect | MISSING |
| Upstash | `UPSTASH_REDIS_REST_TOKEN` | https://console.upstash.com → Redis → Connect | MISSING |

---

## OPTIONAL Credentials (Set When Ready)

| Service | Variable | Where to Get | Status |
|---------|----------|--------------|--------|
| Sentry | `SENTRY_DSN` | https://sentry.io → Settings → Projects | MISSING |
| Sentry | `SENTRY_AUTH_TOKEN` | https://sentry.io → Settings → Auth Tokens | MISSING |
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys | MISSING |
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys | MISSING |
| HuggingFace | `HUGGINGFACE_API_KEY` | https://huggingface.co/settings/tokens | MISSING |
| YouTube | `YOUTUBE_API_KEY` | https://console.cloud.google.com/apis/credentials | MISSING |
| Phyllo | `PHYLLO_API_KEY` | https://developers.getphyllo.com | MISSING |
| Phyllo | `PHYLLO_SECRET_KEY` | https://developers.getphyllo.com | MISSING |
| R2 | `R2_ACCOUNT_ID` | https://dash.cloudflare.com → R2 | MISSING |
| R2 | `R2_ACCESS_KEY_ID` | https://dash.cloudflare.com → R2 → API Tokens | MISSING |
| R2 | `R2_SECRET_ACCESS_KEY` | https://dash.cloudflare.com → R2 → API Tokens | MISSING |
| Axiom | `AXIOM_TOKEN` | https://axiom.co → Settings → API Tokens | MISSING |

---

## Already Set (No Action Needed)

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | development | App config |
| `PORT` | 3000 | App config |
| `JWT_AUDIENCE` | mushin-api | App config |
| `AWS_REGION` | us-east-1 | App config |
| `RATE_LIMIT_WINDOW_MS` | 60000 | App config |
| `RATE_LIMIT_MAX_REQUESTS` | 100 | App config |
| `IDEMPOTENCY_TTL_HOURS` | 24 | App config |
| `LOG_LEVEL` | info | App config |

---

## How to Add Credentials

1. Open `.env` in your editor
2. Find the placeholder you want to fill (e.g., `[YOUR-KEY]`)
3. Get the key from the service dashboard (URLs listed above)
4. Replace the placeholder with the real key
5. Save the file

**Example:**
```
# Before
RESEND_API_KEY="[YOUR-KEY]"

# After
RESEND_API_KEY="re_abc123def456"
```

---

## Security Notes

- `.env` is in `.gitignore` — it will NOT be committed
- Never share `.env` with anyone
- Never paste credentials in chat or tickets
- Rotate keys immediately if compromised
- Use sandbox/test keys for development
- Use production keys only in production environment

---

## Related

- [[PRODUCTION-AUDIT|Production Audit]]
- [[PHASE-SUMMARY|Phase Summary]]
