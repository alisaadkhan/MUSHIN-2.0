/**
 * Deterministic Ranking (Doc 15 B3, FS-02.03).
 * Identical query + index state = identical results.
 * All factors are precomputed GCP attributes — zero LLM at query time (ADR-018).
 */

// ── Ranking Weights (configurable, flag-tunable) ─────────────

export interface RankingWeights {
  relevance: number;
  criteriaMatch: number;
  authenticityWeight: number;
  qualityScore: number;
  freshnessDecay: number;
  longTailFairness: number;
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  relevance: 0.25,
  criteriaMatch: 0.20,
  authenticityWeight: 0.20,
  qualityScore: 0.15,
  freshnessDecay: 0.10,
  longTailFairness: 0.10,
};

// ── Follower Bands (T5 long-tail fairness) ───────────────────

type FollowerBand = 'nano' | 'micro' | 'mid' | 'macro' | 'mega';

const FOLLOWER_BANDS: Array<{ name: FollowerBand; min: number; max: number }> = [
  { name: 'nano', min: 0, max: 10_000 },
  { name: 'micro', min: 10_000, max: 100_000 },
  { name: 'mid', min: 100_000, max: 500_000 },
  { name: 'macro', min: 500_000, max: 1_000_000 },
  { name: 'mega', min: 1_000_000, max: Infinity },
];

function getFollowerBand(followerCount: number): FollowerBand {
  for (const band of FOLLOWER_BANDS) {
    if (followerCount >= band.min && followerCount < band.max) return band.name;
  }
  return 'mega';
}

// ── Scoring Functions ────────────────────────────────────────

/**
 * Authenticity band weight (Doc 15 B3).
 */
function getAuthenticityWeight(band: string | null): number {
  switch (band) {
    case 'strong': return 1.0;
    case 'moderate': return 0.7;
    case 'weak': return 0.4;
    default: return 0.2; // None / insufficient_data
  }
}

/**
 * Freshness decay — exponential with 30-day half-life.
 */
function computeFreshnessDecay(lastEnrichedAt: string | null): number {
  if (!lastEnrichedAt) return 0;
  const daysSince = (Date.now() - new Date(lastEnrichedAt).getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-daysSince / 30);
}

/**
 * T5 long-tail fairness — size-band normalization.
 * Creators compete within their follower band, not against all sizes.
 * A 15k-follower creator can rank #1 for a micro-band query.
 */
function computeLongTailFairness(followerCount: number): number {
  const band = getFollowerBand(followerCount);
  const bandDef = FOLLOWER_BANDS.find((b) => b.name === band)!;
  const bandRange = bandDef.max - bandDef.min;
  const normalizedInRange = bandRange === Infinity
    ? 1.0
    : (followerCount - bandDef.min) / bandRange;
  // Score: 1.0 at top of band, 0.5 at bottom
  return 0.5 + normalizedInRange * 0.5;
}

/**
 * Criteria match — how well creator attributes match explicit filter criteria.
 */
function computeCriteriaMatch(
  hit: Record<string, unknown>,
  filters: Record<string, unknown>,
): number {
  const filterKeys = Object.keys(filters).filter(
    (k) => filters[k] !== undefined && filters[k] !== null && k !== 'sort_by' && k !== 'sort_order' && k !== 'page' && k !== 'limit',
  );
  if (filterKeys.length === 0) return 1.0;

  let matchCount = 0;
  for (const key of filterKeys) {
    const filterVal = filters[key];
    const hitVal = hit[key];
    if (hitVal === undefined || hitVal === null) continue;

    if (typeof filterVal === 'string' && typeof hitVal === 'string') {
      if (hitVal.toLowerCase() === filterVal.toLowerCase()) matchCount++;
    } else if (typeof filterVal === 'number' && typeof hitVal === 'number') {
      // For min/max ranges, check if within range
      if (key.endsWith('_min') && hitVal >= filterVal) matchCount++;
      else if (key.endsWith('_max') && hitVal <= filterVal) matchCount++;
      else if (hitVal === filterVal) matchCount++;
    }
  }
  return matchCount / filterKeys.length;
}

// ── Ranking Explanation (CC-001) ─────────────────────────────

export interface RankingExplanation {
  relevance: { score: number; weight: number };
  criteriaMatch: { score: number; weight: number };
  authenticityWeight: { score: number; weight: number };
  qualityScore: { score: number; weight: number };
  freshnessDecay: { score: number; weight: number };
  longTailFairness: { score: number; weight: number };
  totalScore: number;
}

export interface RankedHit {
  [key: string]: unknown;
  _rankingScore: number;
  _explanation: RankingExplanation;
}

// ── Main Ranking Function ────────────────────────────────────

/**
 * Apply deterministic ranking to Meilisearch results.
 * All factors are from precomputed GCP attributes — zero LLM at query time.
 */
export function rankHits(
  hits: unknown[],
  filters: Record<string, unknown>,
  weights: RankingWeights = DEFAULT_RANKING_WEIGHTS,
): RankedHit[] {
  return hits
    .map((hit) => {
      const h = hit as Record<string, unknown>;

      const relevanceScore = (h['_rankingScore'] as number) ?? 1.0; // Meilisearch relevance
      const criteriaScore = computeCriteriaMatch(h, filters);
      const authenticityScore = getAuthenticityWeight(h['authenticityBand'] as string | null);
      const qualityScore = ((h['qualityScore'] as number) ?? 0) / 100; // Normalize 0-100 → 0-1
      const freshnessScore = computeFreshnessDecay(h['lastEnrichedAt'] as string | null);
      const fairnessScore = computeLongTailFairness((h['followerCount'] as number) ?? 0);

      const totalScore =
        relevanceScore * weights.relevance +
        criteriaScore * weights.criteriaMatch +
        authenticityScore * weights.authenticityWeight +
        qualityScore * weights.qualityScore +
        freshnessScore * weights.freshnessDecay +
        fairnessScore * weights.longTailFairness;

      const explanation: RankingExplanation = {
        relevance: { score: relevanceScore, weight: weights.relevance },
        criteriaMatch: { score: criteriaScore, weight: weights.criteriaMatch },
        authenticityWeight: { score: authenticityScore, weight: weights.authenticityWeight },
        qualityScore: { score: qualityScore, weight: weights.qualityScore },
        freshnessDecay: { score: freshnessScore, weight: weights.freshnessDecay },
        longTailFairness: { score: fairnessScore, weight: weights.longTailFairness },
        totalScore,
      };

      return {
        ...h,
        _rankingScore: totalScore,
        _explanation: explanation,
      };
    })
    .sort((a, b) => b._rankingScore - a._rankingScore);
}
