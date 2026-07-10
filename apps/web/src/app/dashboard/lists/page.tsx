'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface List {
  listId: string;
  name: string;
  description: string | null;
  memberCount: number;
  createdAt: string;
}

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    try {
      const result = await api.listLists();
      setLists(result.data as List[]);
    } catch {
      setLists([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await api.createList(newListName, newListDesc);
      setNewListName('');
      setNewListDesc('');
      setShowCreate(false);
      loadLists();
    } catch {
      // Handle error
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Lists</h1>
        <button className="primary" onClick={() => setShowCreate(true)}>
          Create List
        </button>
      </div>

      {showCreate && (
        <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>New List</h2>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                required
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                placeholder="Description (optional)"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="primary">Create</button>
              <button type="button" className="secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading && <p>Loading lists...</p>}

      {!loading && lists.length === 0 && (
        <p style={{ color: '#666' }}>No lists yet. Create one to organize your creators.</p>
      )}

      {!loading && lists.length > 0 && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {lists.map((list) => (
            <div
              key={list.listId}
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
                <p style={{ fontWeight: 600 }}>{list.name}</p>
                {list.description && (
                  <p style={{ fontSize: '14px', color: '#666' }}>{list.description}</p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 600 }}>{list.memberCount} members</p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
