'use client';

import { useEffect, useState } from 'react';

interface StaffUser {
  staffUserId: string;
  displayName: string;
  email: string;
  role: 'admin' | 'support';
  department: string | null;
  createdAt: string;
}

export default function StaffManagementPage() {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'support' as 'admin' | 'support',
    department: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    loadStaffUsers();
  }, []);

  async function loadStaffUsers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/staff`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('mushin_token') ?? ''}`,
            'X-Workspace-ID': localStorage.getItem('workspaceId') ?? '',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStaffUsers(data.data ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!createForm.email || !createForm.password || !createForm.displayName) {
      setCreateError('Email, password, and name are required');
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/staff`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('mushin_token') ?? ''}`,
            'X-Workspace-ID': localStorage.getItem('workspaceId') ?? '',
          },
          body: JSON.stringify(createForm),
        }
      );

      if (response.ok) {
        setShowCreateForm(false);
        setCreateForm({ email: '', password: '', displayName: '', role: 'support', department: '' });
        loadStaffUsers();
      } else {
        const data = await response.json();
        setCreateError(data.error?.message ?? 'Failed to create staff user');
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create staff user');
    } finally {
      setCreateLoading(false);
    }
  }

  if (loading) {
    return <p>Loading staff users...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Staff Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {showCreateForm ? 'Cancel' : 'Create Staff User'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Create Staff User</h2>

          {createError && (
            <p style={{ color: '#ef4444', marginBottom: '16px' }}>{createError}</p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Email</label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Password</label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Display Name</label>
              <input
                type="text"
                value={createForm.displayName}
                onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Role</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'admin' | 'support' })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="support">Support</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Department (optional)</label>
              <input
                type="text"
                value={createForm.department}
                onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={createLoading}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: createLoading ? 'not-allowed' : 'pointer',
              opacity: createLoading ? 0.7 : 1,
            }}
          >
            {createLoading ? 'Creating...' : 'Create Staff User'}
          </button>
        </div>
      )}

      {/* Staff Users Table */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Department</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {staffUsers.map((user) => (
              <tr key={user.staffUserId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{user.displayName}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{user.email}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: user.role === 'admin' ? '#fef3c7' : '#dbeafe',
                    color: user.role === 'admin' ? '#92400e' : '#1e40af',
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{user.department ?? '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
