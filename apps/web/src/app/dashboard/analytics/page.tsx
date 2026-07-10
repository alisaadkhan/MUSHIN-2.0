'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Analytics {
  creditUsage: { total: number; byCategory: Record<string, number> };
  outreachMetrics: { sent: number; delivered: number; opened: number; replied: number };
  creatorMetrics: { totalCreators: number; activeCreators: number };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const result = await api.getWorkspaceAnalytics('current_month');
        setAnalytics(result.data.analytics as Analytics);
      } catch {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Analytics</h1>

      {!analytics && (
        <p style={{ color: '#666' }}>No analytics data available yet.</p>
      )}

      {analytics && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Credit Usage */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Credit Usage</h2>
            <p style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
              {analytics.creditUsage.total} credits used
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {Object.entries(analytics.creditUsage.byCategory).map(([category, count]) => (
                <div key={category}>
                  <p style={{ fontSize: '14px', color: '#666' }}>{category}</p>
                  <p style={{ fontWeight: 600 }}>{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Outreach Metrics */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Outreach</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Sent</p>
                <p style={{ fontSize: '24px', fontWeight: 600 }}>{analytics.outreachMetrics.sent}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Delivered</p>
                <p style={{ fontSize: '24px', fontWeight: 600 }}>{analytics.outreachMetrics.delivered}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Opened</p>
                <p style={{ fontSize: '24px', fontWeight: 600 }}>{analytics.outreachMetrics.opened}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Replied</p>
                <p style={{ fontSize: '24px', fontWeight: 600 }}>{analytics.outreachMetrics.replied}</p>
              </div>
            </div>
          </div>

          {/* Creator Metrics */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Creators</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Total Creators</p>
                <p style={{ fontSize: '24px', fontWeight: 600 }}>{analytics.creatorMetrics.totalCreators}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Active Creators</p>
                <p style={{ fontSize: '24px', fontWeight: 600 }}>{analytics.creatorMetrics.activeCreators}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
