'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface SystemHealth {
  status: string;
  uptime: number;
  checks: Record<string, { status: string; latencyMs?: number }>;
}

interface AdminStats {
  workspaces: number;
  creators: number;
}

export default function AdminOverviewPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const healthResult = await api.healthCheck();
        setHealth(healthResult as unknown as SystemHealth);
      } catch {
        setHealth(null);
      }

      try {
        const statsResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') ?? ''}`,
            'X-Workspace-ID': localStorage.getItem('workspaceId') ?? '',
          },
        });
        if (statsResult.ok) {
          const data = await statsResult.json();
          setStats(data.data);
        }
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <p>Loading system status...</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Admin Overview</h1>

      {error && (
        <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
      )}

      {/* System Health */}
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>System Health</h2>
        {health ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: health.status === 'healthy' ? '#22c55e' : health.status === 'degraded' ? '#f59e0b' : '#ef4444',
              }} />
              <span style={{ fontWeight: 500 }}>{health.status.toUpperCase()}</span>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
              </span>
            </div>
            {Object.entries(health.checks).map(([name, check]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f3f4f6' }}>
                <span>{name}</span>
                <span style={{ color: check.status === 'healthy' ? '#22c55e' : '#ef4444' }}>
                  {check.status} {check.latencyMs ? `(${check.latencyMs}ms)` : ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>Unable to fetch system health</p>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Total Workspaces</p>
          <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats?.workspaces ?? '—'}</p>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Total Creators</p>
          <p style={{ fontSize: '28px', fontWeight: 600 }}>{stats?.creators ?? '—'}</p>
        </div>
      </div>
    </div>
  );
}
