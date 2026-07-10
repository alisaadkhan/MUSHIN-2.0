'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
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
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'var(--secondary)',
        borderRight: '1px solid var(--border)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>MUSHIN</h2>
          <p style={{ fontSize: '12px', color: '#666' }}>Creator Intelligence</p>
        </div>

        <nav style={{ flex: 1 }}>
          <Link href="/dashboard" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            Dashboard
          </Link>
          <Link href="/dashboard/search" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
          }}>
            Search Creators
          </Link>
          <Link href="/dashboard/lists" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
          }}>
            Lists
          </Link>
          <Link href="/dashboard/analytics" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
          }}>
            Analytics
          </Link>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>{user.email}</p>
          <button
            onClick={logout}
            className="secondary"
            style={{ width: '100%', fontSize: '13px' }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}
