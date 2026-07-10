'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalCreators: number;
  activeLists: number;
  creditsUsed: number;
  creditsRemaining: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await api.getWorkspaceAnalytics('current_month');
        const analytics = result.data?.analytics;
        if (analytics) {
          setStats({
            totalCreators: analytics.creatorMetrics?.totalCreators ?? 0,
            activeLists: 0,
            creditsUsed: analytics.creditUsage?.total ?? 0,
            creditsRemaining: 0,
          });
        } else {
          setStats(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Dashboard</h1>
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', background: 'var(--secondary)', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Total Creators</p>
          <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats?.totalCreators ?? 0}</p>
        </div>
        <div style={{ padding: '20px', background: 'var(--secondary)', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Active Lists</p>
          <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats?.activeLists ?? 0}</p>
        </div>
        <div style={{ padding: '20px', background: 'var(--secondary)', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Credits Used</p>
          <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats?.creditsUsed ?? 0}</p>
        </div>
        <div style={{ padding: '20px', background: 'var(--secondary)', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Credits Remaining</p>
          <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats?.creditsRemaining ?? 0}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Recent Activity</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>No recent activity</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/dashboard/search" className="primary" style={{ textAlign: 'center', padding: '10px' }}>
              Search Creators
            </a>
            <a href="/dashboard/lists" className="secondary" style={{ textAlign: 'center', padding: '10px' }}>
              Create List
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
