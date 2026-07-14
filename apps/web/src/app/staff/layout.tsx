'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StaffInfo {
  isStaff: boolean;
  role: 'admin' | 'support' | null;
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Check staff status from token claims
    if (user) {
      const token = localStorage.getItem('mushin_token');
      if (token) {
        try {
          // Decode JWT to check app_metadata
          const payload = JSON.parse(atob(token.split('.')[1]));
          const appMeta = payload.app_metadata ?? {};
          setStaffInfo({
            isStaff: appMeta.realm === 'staff',
            role: appMeta.staff_role ?? null,
          });
        } catch {
          setStaffInfo({ isStaff: false, role: null });
        }
      }
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

  if (!staffInfo?.isStaff) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Access denied. Staff authentication required.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Staff Sidebar */}
      <aside style={{
        width: '240px',
        background: '#1e293b',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>MUSHIN Staff</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            {staffInfo.role === 'admin' ? 'Admin Panel' : 'Support Panel'}
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          <Link href="/staff" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: 'white',
          }}>
            Overview
          </Link>
          <Link href="/staff/workspaces" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#cbd5e1',
          }}>
            Workspaces
          </Link>
          <Link href="/staff/customers" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#cbd5e1',
          }}>
            Customers
          </Link>
          <Link href="/staff/search" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#cbd5e1',
          }}>
            Search Diagnostics
          </Link>
          <Link href="/staff/audit" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#cbd5e1',
          }}>
            Audit Log
          </Link>
          <Link href="/staff/credits" style={{
            display: 'block',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#cbd5e1',
          }}>
            Credits
          </Link>

          {/* Admin-only links */}
          {staffInfo.role === 'admin' && (
            <>
              <div style={{ borderTop: '1px solid #334155', margin: '16px 0' }} />
              <Link href="/admin" style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: '6px',
                marginBottom: '4px',
                fontSize: '14px',
                color: '#f59e0b',
              }}>
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <Link href="/dashboard" style={{ color: '#94a3b8', fontSize: '13px' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', background: '#f8fafc' }}>
        {children}
      </main>
    </div>
  );
}
