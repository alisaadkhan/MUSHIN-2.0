'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (user) {
    router.push('/dashboard');
    return null;
  }

  router.push('/login');
  return null;
}
