'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '240px',
        background: '#1f2937',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>MUSHIN Admin</h2>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Staff Panel</p>
        </div>

        <nav style={{ flex: 1 }}>
          <Link href="/admin" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: 'white',
          }}>
            Overview
          </Link>
          <Link href="/admin/workspaces" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#d1d5db',
          }}>
            Workspaces
          </Link>
          <Link href="/admin/creators" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#d1d5db',
          }}>
            Creators
          </Link>
          <Link href="/admin/audit" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#d1d5db',
          }}>
            Audit Log
          </Link>
          <Link href="/admin/health" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#d1d5db',
          }}>
            System Health
          </Link>
        </nav>

        <div style={{ borderTop: '1px solid #374151', paddingTop: '16px' }}>
          <Link href="/dashboard" style={{ color: '#9ca3af', fontSize: '13px' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', background: '#f9fafb' }}>
        {children}
      </main>
    </div>
  );
}
