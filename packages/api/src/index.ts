/**
 * MUSHIN API — Hono Application Composition.
 *
 * Wires all middleware and routes into a single Hono application.
 * Middleware order (non-negotiable):
 *   1. request-id
 *   2. error handler (wraps everything)
 *   3. CORS
 *   4. webhook routes (no tenancy, no rate limit)
 *   5. tenancy resolution (protected routes only)
 *   6. rate limiting (after tenancy — keys by workspaceId)
 *   7. RBAC (per-route)
 *   8. audit logging (per-route)
 *   9. route handlers
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Database } from '@mushin/database';
import { getDb } from '@mushin/database';
import type { MeilisearchAdapter, LLMAdapter, BillingProvider } from '@mushin/adapters';
import { createMeilisearchAdapter, createLLMAdapter, createPaddleAdapter } from '@mushin/adapters';
import { createLogger, registerHealthCheck, createDatabaseCheck } from '@mushin/shared';
import { tenancyMiddleware, staffOnly } from './middleware/tenancy.js';
import { errorHandler } from './middleware/error-handler.js';
import { rateLimitMiddleware } from './middleware/rate-limit.js';
import { createM1Routes } from './routes/m1-workspace/index.js';
import { createM2Routes } from './routes/m2-creator/index.js';
import { createM3Routes } from './routes/m3-search/index.js';
import { createBillingWebhookRoutes } from './routes/m4-billing/index.js';
import { createCRMListRoutes } from './routes/m8-crm/list.routes.js';
import { createAnalyticsRoutes } from './routes/m12-analytics/analytics.routes.js';
import { createHealthRoutes } from './routes/health/health.routes.js';
import { createAuthRoutes } from './routes/auth/auth.routes.js';
import { createAdminRoutes } from './routes/admin/admin.routes.js';
import { createCRMService } from './services/crm.service.js';
import { createAnalyticsService } from './services/analytics.service.js';

const logger = createLogger('api:app');

// ── Configuration ─────────────────────────────────────────────

export interface AppConfig {
  db?: Database;
  databaseUrl?: string;
  meilisearchHost?: string;
  meilisearchApiKey?: string;
  groqApiKey?: string;
  anthropicApiKey?: string;
  paddleApiKey?: string;
  paddleWebhookSecret?: string;
  paddleEnvironment?: 'sandbox' | 'production';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  jwtIssuer?: string;
  jwtAudience?: string;
  jwksUri?: string;
  corsOrigins?: string[];
}

// ── App Factory ───────────────────────────────────────────────

export function createApp(config: AppConfig = {}): Hono {
  const app = new Hono();

  // ── 1. Request ID (global) ─────────────────────────────────
  app.use('*', async (c, next) => {
    const requestId = c.req.header('X-Request-ID') ?? crypto.randomUUID();
    c.set('requestId', requestId);
    c.header('X-Request-ID', requestId);
    await next();
  });

  // ── 2. Error handler (wraps everything below) ──────────────
  app.use('*', errorHandler);

  // ── 3. CORS (env-driven origins) ───────────────────────────
  const corsOrigins = config.corsOrigins
    ?? process.env['CORS_ORIGINS']?.split(',').map(s => s.trim())
    ?? ['http://localhost:3001', 'http://localhost:3000'];

  app.use('*', cors({
    origin: corsOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Workspace-ID', 'X-Request-ID'],
    exposeHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials: true,
  }));

  // ── Resolve dependencies ───────────────────────────────────
  const db = config.db ?? (config.databaseUrl ? getDb(config.databaseUrl) : getDb(process.env['DATABASE_URL']!));

  const meilisearch: MeilisearchAdapter = createMeilisearchAdapter({
    host: config.meilisearchHost ?? process.env['MEILISEARCH_HOST']!,
    apiKey: config.meilisearchApiKey ?? process.env['MEILISEARCH_API_KEY']!,
  });

  const llm: LLMAdapter = createLLMAdapter({
    groqApiKey: config.groqApiKey ?? process.env['GROQ_API_KEY']!,
    anthropicApiKey: config.anthropicApiKey ?? process.env['ANTHROPIC_API_KEY'],
  });

  // ── Billing adapter (with webhook secret validation) ───────
  const paddleApiKey = config.paddleApiKey ?? process.env['PADDLE_API_KEY'];
  const paddleWebhookSecret = config.paddleWebhookSecret ?? process.env['PADDLE_WEBHOOK_SECRET'];

  let billing: BillingProvider | null = null;
  if (paddleApiKey) {
    if (!paddleWebhookSecret) {
      logger.error('PADDLE_API_KEY is set but PADDLE_WEBHOOK_SECRET is empty — webhook signature verification will fail');
    }
    billing = createPaddleAdapter({
      apiKey: paddleApiKey,
      webhookSecret: paddleWebhookSecret ?? '',
      environment: (config.paddleEnvironment ?? process.env['PADDLE_ENVIRONMENT'] as 'sandbox' | 'production') ?? 'sandbox',
    });
  }

  // Register health checks
  registerHealthCheck('database', createDatabaseCheck(db as unknown as { execute: (query: unknown) => Promise<unknown> }));

  // Register Meilisearch health check (adapter-level)
  registerHealthCheck('meilisearch', async () => {
    try {
      const health = await meilisearch.health();
      return { status: health.status === 'healthy' ? 'healthy' : 'degraded', message: health.status };
    } catch {
      return { status: 'unhealthy' as const, message: 'Meilisearch unreachable' };
    }
  });

  // ── 4. Unauthenticated routes ──────────────────────────────

  // Health endpoints (no auth, no rate limit)
  app.route('/health', createHealthRoutes(db));

  // Auth endpoints (no tenancy — Supabase Auth handles session)
  app.route('/auth', createAuthRoutes({
    supabaseUrl: config.supabaseUrl ?? process.env['SUPABASE_URL']!,
    supabaseAnonKey: config.supabaseAnonKey ?? process.env['SUPABASE_ANON_KEY']!,
  }));

  // ── 5. Webhook routes (raw body, NO tenancy, NO rate limit) ──
  // MUST be mounted before tenancy middleware to avoid 401 on webhook delivery
  if (billing) {
    app.route('/api/v1/webhooks', createBillingWebhookRoutes(db, billing));
  }

  // ── 6. Tenancy middleware (protected routes) ────────────────
  app.use('/api/*', tenancyMiddleware({
    jwksUri: config.jwksUri ?? process.env['JWKS_URI']!,
    jwtIssuer: config.jwtIssuer ?? process.env['JWT_ISSUER']!,
    jwtAudience: config.jwtAudience ?? process.env['JWT_AUDIENCE']!,
    db,
  }));

  // ── 7. Rate limiting (AFTER tenancy — keys by workspaceId) ──
  app.use('/api/*', rateLimitMiddleware());

  // ── 8. Protected route groups ──────────────────────────────

  // M1 — Workspace CRUD
  app.route('/api/v1', createM1Routes(db));

  // M2 — Creator CRUD
  app.route('/api/v1', createM2Routes(db, meilisearch));

  // M3 — Search (filtered + NL + quote)
  app.route('/api/v1', createM3Routes(meilisearch, llm));

  // M8 — CRM (lists)
  const crmService = createCRMService(db);
  app.route('/api/v1', createCRMListRoutes(crmService));

  // M12 — Analytics
  const analyticsService = createAnalyticsService(db);
  app.route('/api/v1', createAnalyticsRoutes(analyticsService));

  // Admin (staff-only routes mounted separately)
  app.use('/api/v1/admin/*', async (c, next) => staffOnly(c, next));
  app.route('/api/v1', createAdminRoutes(db));

  logger.info('Application composed successfully');

  return app;
}
