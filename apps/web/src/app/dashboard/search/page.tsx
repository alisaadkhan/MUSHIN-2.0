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
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const result = await api.searchCreators(query);
      setResults(result.data as unknown as Creator[]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Search Creators</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, handle, niche, or platform..."
          style={{ flex: 1 }}
        />
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <p>Searching...</p>}

      {!loading && searched && results.length === 0 && (
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
