'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, name);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Create your account</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Start discovering creators with AI</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
