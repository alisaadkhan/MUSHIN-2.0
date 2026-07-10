# Redis Token Fix Instructions

## Problem
Current token has read-only permissions. Operations like SET, INCR, INFO, DBSIZE fail with "NOPERM".

## Fix Steps

1. Go to https://console.upstash.com
2. Select your Redis instance (boss-racer-79284)
3. Navigate to **Settings** → **Token**
4. Click **Create Token**
5. Set permissions to **Read-Write** (or Full Access)
6. Copy the new token
7. Update `.env`:
   ```
   UPSTASH_REDIS_REST_TOKEN="<new-token-here>"
   ```

## Verification
After updating the token, run:
```bash
npx tsx scripts/verify-redis.ts
```

## Alternative: Create a new instance
If the current instance has restrictions, create a new Redis instance with full permissions:
1. Upstash Console → Redis → New Instance
2. Copy the REST URL and token
3. Update `.env` with new values
