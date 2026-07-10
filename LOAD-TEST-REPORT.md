# LOAD-TEST-REPORT.md

*Generated: 2026-07-09*

---

## Test Configuration

- **Index:** 1000 creators (100 per batch × 10 batches)
- **Platforms:** instagram, youtube, tiktok, twitter
- **Niches:** fashion, technology, food, travel, gaming, beauty, fitness, lifestyle
- **Meilisearch:** Cloud instance, Singapore region

---

## Single-Request Latency

| Search Type | Min | Avg | P50 | P95 | P99 |
|-------------|-----|-----|-----|-----|-----|
| Filtered (platform = "instagram") | 102ms | 113ms | 105ms | 110ms | 319ms |
| Text ("fashion technology") | 107ms | 110ms | 110ms | 111ms | 122ms |
| Sort (followers desc) | 108ms | 111ms | 110ms | 120ms | 121ms |

**Target: P95 < 500ms** → **PASSED** (all under 120ms)

---

## Concurrent Load

| Users | Requests | P50 | P95 | P99 | Errors |
|-------|----------|-----|-----|-----|--------|
| 10 | 10 | 335ms | 350ms | 350ms | 0 |
| 50 | 50 | 392ms | 442ms | 449ms | 0 |

**Target: P95 < 500ms** → **PASSED** (all under 450ms)

---

## Throughput

| Scenario | RPS | Notes |
|----------|-----|-------|
| Sequential | ~9 req/s | 107ms avg latency |
| Concurrent (10) | ~28 req/s | 335ms avg latency |
| Concurrent (50) | ~127 req/s | 392ms avg latency |

---

## Recommendations

1. **Current capacity:** Meilisearch Cloud handles 50 concurrent users with P95 < 450ms
2. **Scaling:** For >100 concurrent users, consider Meilisearch Cloud auto-scaling or self-hosted cluster
3. **Caching:** Add Upstash Redis caching for hot queries (once token permissions fixed)
4. **Monitoring:** Set up latency alerting at P95 > 400ms threshold

---

*Load test scripts: `scripts/load-test.ts`, `scripts/quick-load-test.ts`*
