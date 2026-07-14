'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface Creator {
  creatorId: string;
  displayName: string;
  primaryHandle: string;
  platform: string;
  followerCount: number;
  engagementRate: number;
  _rankingScore: number;
  _explanation?: {
    relevance: { score: number; weight: number };
    criteriaMatch: { score: number; weight: number };
    authenticityWeight: { score: number; weight: number };
    qualityScore: { score: number; weight: number };
    freshnessDecay: { score: number; weight: number };
    longTailFairness: { score: number; weight: number };
    risingScore: { score: number; weight: number };
    pakistanBoost: { score: number; weight: number; reason: string };
    totalScore: number;
  };
}

interface TrendingCreator extends Creator {
  trendingScore: number;
  trendingExplanation: {
    followerAcceleration: number;
    engagementAcceleration: number;
    recentGrowthRate: number;
    momentumDecay: number;
  };
  trendDirection: 'accelerating' | 'steady' | 'decelerating';
}

type SortOption = 'relevance' | 'trending' | 'quality_score' | 'freshness';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Creator[]>([]);
  const [trendingResults, setTrendingResults] = useState<TrendingCreator[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && sortBy !== 'trending') return;

    setLoading(true);
    setSearched(true);
    setTrendingResults([]);

    try {
      if (sortBy === 'trending') {
        const result = await api.getTrendingCreators({ limit: 20 });
        setTrendingResults(result.data as unknown as TrendingCreator[]);
        setResults([]);
      } else {
        const result = await api.searchCreators(query, { sort_by: sortBy });
        setResults(result.data as unknown as Creator[]);
      }
    } catch {
      setResults([]);
      setTrendingResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Search Creators</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={sortBy === 'trending' ? 'Trending creators...' : 'Search by name, handle, niche, or platform...'}
          style={{ flex: 1, minWidth: '200px' }}
          disabled={sortBy === 'trending'}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
        >
          <option value="relevance">Relevance</option>
          <option value="trending">Trending</option>
          <option value="quality_score">Quality</option>
          <option value="freshness">Freshness</option>
        </select>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {sortBy === 'relevance' && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '14px', color: '#666' }}>
          <input
            type="checkbox"
            checked={showExplanation}
            onChange={(e) => setShowExplanation(e.target.checked)}
          />
          Show ranking explanation
        </label>
      )}

      {loading && <p>Searching...</p>}

      {!loading && searched && results.length === 0 && trendingResults.length === 0 && (
        <p style={{ color: '#666' }}>No creators found matching &quot;{query}&quot;</p>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p style={{ marginBottom: '16px', color: '#666' }}>
            Found {results.length} creators
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {results.map((creator) => (
              <div
                key={creator.creatorId}
                style={{
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{creator.displayName}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {creator.primaryHandle} · {creator.platform}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600 }}>
                      {(creator.followerCount ?? 0).toLocaleString()} followers
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {(creator.engagementRate ?? 0).toFixed(1)}% engagement
                    </p>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      Score: {(creator._rankingScore ?? 0).toFixed(3)}
                    </p>
                  </div>
                </div>

                {showExplanation && creator._explanation && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '6px', fontSize: '12px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '8px' }}>Ranking Factors:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '4px' }}>
                      <span>Relevance: {(creator._explanation.relevance.score * 100).toFixed(1)}%</span>
                      <span>Criteria: {(creator._explanation.criteriaMatch.score * 100).toFixed(1)}%</span>
                      <span>Authenticity: {(creator._explanation.authenticityWeight.score * 100).toFixed(1)}%</span>
                      <span>Quality: {(creator._explanation.qualityScore.score * 100).toFixed(1)}%</span>
                      <span>Freshness: {(creator._explanation.freshnessDecay.score * 100).toFixed(1)}%</span>
                      <span>Fairness: {(creator._explanation.longTailFairness.score * 100).toFixed(1)}%</span>
                      <span>Rising: {(creator._explanation.risingScore.score * 100).toFixed(1)}%</span>
                      {creator._explanation.pakistanBoost.score > 0 && (
                        <span>PK Boost: +{(creator._explanation.pakistanBoost.score * 100).toFixed(1)}% ({creator._explanation.pakistanBoost.reason})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && trendingResults.length > 0 && (
        <div>
          <p style={{ marginBottom: '16px', color: '#666' }}>
            Found {trendingResults.length} trending creators
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {trendingResults.map((creator) => (
              <div
                key={creator.creatorId}
                style={{
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{creator.displayName}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {creator.primaryHandle} · {creator.platform}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600 }}>
                      {(creator.followerCount ?? 0).toLocaleString()} followers
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {(creator.engagementRate ?? 0).toFixed(1)}% engagement
                    </p>
                    <p style={{ fontSize: '12px', color: creator.trendDirection === 'accelerating' ? '#22c55e' : creator.trendDirection === 'decelerating' ? '#ef4444' : '#999' }}>
                      {creator.trendDirection === 'accelerating' ? '↗' : creator.trendDirection === 'decelerating' ? '↘' : '→'} Trending: {(creator.trendingScore * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '6px', fontSize: '12px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '8px' }}>Trending Factors:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '4px' }}>
                    <span>Follower Accel: {(creator.trendingExplanation.followerAcceleration * 100).toFixed(1)}%</span>
                    <span>Engagement Accel: {(creator.trendingExplanation.engagementAcceleration * 100).toFixed(1)}%</span>
                    <span>Recent Growth: {(creator.trendingExplanation.recentGrowthRate * 100).toFixed(1)}%</span>
                    <span>Momentum: {(creator.trendingExplanation.momentumDecay * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
