/**
 * M3 Search — Deterministic Filtered Search (FS-02.01, NFR-P01).
 * Brain 1: Meilisearch query → deterministic ranking → sub-second, zero LLM cost.
 */
import { Hono } from 'hono';
import { z } from 'zod';
import type { TenancyContext } from '@mushin/shared';
import type { MeilisearchAdapter } from '@mushin/adapters';
import { rankHits, DEFAULT_RANKING_WEIGHTS } from './ranking.js';

// ── Filter Schema (Doc 15 B3 — all filterable attributes) ────

const searchFiltersSchema = z.object({
  platform: z.enum(['instagram', 'tiktok', 'youtube', 'twitter', 'facebook']).optional(),
  follower_min: z.coerce.number().int().min(0).optional(),
  follower_max: z.coerce.number().int().min(0).optional(),
  engagement_rate_min: z.coerce.number().min(0).max(1).optional(),
  engagement_rate_max: z.coerce.number().min(0).max(1).optional(),
  geo: z.string().optional(),
  language: z.string().optional(),
  niche: z.string().optional(),
  authenticity_band: z.enum(['strong', 'moderate', 'weak']).optional(),
  audience_pk_share_min: z.coerce.number().min(0).max(1).optional(),
  audience_gcc_share_min: z.coerce.number().min(0).max(1).optional(),
  completeness_tier: z.enum(['rich', 'standard', 'sparse', 'minimal']).optional(),
  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  // Sorting
  sort_by: z
    .enum(['relevance', 'follower_count', 'engagement_rate', 'quality_score', 'freshness'])
    .default('relevance'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

type SearchFilters = z.infer<typeof searchFiltersSchema>;

// ── Meilisearch Filter Builder ───────────────────────────────

/** Sanitize a string value for safe interpolation into Meilisearch filter expressions */
function sanitizeFilterValue(value: string): string {
  // Escape double quotes and backslashes to prevent filter injection
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildMeilisearchFilter(filters: SearchFilters): string[] {
  const parts: string[] = [];

  if (filters.platform) parts.push(`platform = "${sanitizeFilterValue(filters.platform)}"`);
  if (filters.follower_min !== undefined) parts.push(`followerCount >= ${filters.follower_min}`);
  if (filters.follower_max !== undefined) parts.push(`followerCount <= ${filters.follower_max}`);
  if (filters.engagement_rate_min !== undefined)
    parts.push(`engagementRate >= ${filters.engagement_rate_min}`);
  if (filters.engagement_rate_max !== undefined)
    parts.push(`engagementRate <= ${filters.engagement_rate_max}`);
  if (filters.niche) parts.push(`primaryNiche = "${sanitizeFilterValue(filters.niche)}"`);
  if (filters.authenticity_band)
    parts.push(`authenticityBand = "${sanitizeFilterValue(filters.authenticity_band)}"`);
  if (filters.completeness_tier)
    parts.push(`completenessTier = "${sanitizeFilterValue(filters.completeness_tier)}"`);
  if (filters.audience_pk_share_min !== undefined)
    parts.push(`audiencePkShare >= ${filters.audience_pk_share_min}`);
  if (filters.audience_gcc_share_min !== undefined)
    parts.push(`audienceGccShare >= ${filters.audience_gcc_share_min}`);

  return parts;
}

// ── Route Factory ────────────────────────────────────────────

export function createSearchRoutes(meilisearch: MeilisearchAdapter) {
  const routes = new Hono();

  /**
   * GET /api/v1/creators/search
   * Deterministic filtered search (Brain 1, FS-02.01, NFR-P01).
   * Zero LLM tokens. Identical query + index state = identical results (FS-02.03).
   */
  routes.get('/search', async (c) => {
    const tenancy = c.get('tenancy') as TenancyContext;
    const requestId = c.get('requestId');

    // Parse and validate filters
    const rawParams = Object.fromEntries(new URL(c.req.url).searchParams);
    const parsed = searchFiltersSchema.safeParse(rawParams);
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid search parameters',
            details: parsed.error.flatten(),
            request_id: requestId,
          },
        },
        400,
      );
    }

    const filters = parsed.data;
    const offset = (filters.page - 1) * filters.limit;
    const meiliFilters = buildMeilisearchFilter(filters);

    // Query Meilisearch (Brain 1)
    const result = await meilisearch.search(
      '',
      meiliFilters.join(' AND '),
      filters.limit,
      offset,
    );

    if (result.status === 'error') {
      return c.json(
        {
          error: {
            code: 'ADAPTER_DEGRADED',
            message: 'Search index unavailable',
            request_id: requestId,
          },
        },
        503,
      );
    }

    if (result.status === 'degraded') {
      return c.json(
        {
          data: [],
          total: 0,
          page: filters.page,
          limit: filters.limit,
          meta: { request_id: requestId, degraded: true, reason: result.reason },
        },
        200,
      );
    }

    // Apply deterministic ranking (Doc 15 B3)
    const filterParams: Record<string, unknown> = { ...filters };
    const ranked = rankHits(result.hits, filterParams, DEFAULT_RANKING_WEIGHTS);

    return c.json({
      data: ranked,
      total: ranked.length,
      page: filters.page,
      limit: filters.limit,
      meta: { request_id: requestId },
    });
  });

  return routes;
}
