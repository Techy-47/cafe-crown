'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  function getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect password. Please try again.';
      case 'auth/user-not-found':
        return 'No admin account found with this email.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Account temporarily locked.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'Sign-in failed. Please check your credentials.';
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success('Welcome back! Redirecting…', {
        style: {
          background: '#2D5A3D',
          color: '#F5F0E8',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '600',
        },
        iconTheme: { primary: '#E8A040', secondary: '#2D5A3D' },
      });
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      const msg  = getErrorMessage(code);
      setError(msg);
      toast.error(msg, {
        style: {
          background: '#2D1A18',
          color: '#FF8C7A',
          fontFamily: "'Outfit', sans-serif",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-center" />

      <div className={styles.page}>
        {/* Ambient grid background */}
        <div className={styles.bg} aria-hidden="true" />

        <div className={styles.card} role="main">
          {/* Logo */}
          <div className={styles.logoWrap}>
            <span className={styles.crownIcon} aria-label="Crown icon">♛</span>
            <span className={styles.brandName}>Cafe Crown</span>
            <span className={styles.brandTagline}>Admin Portal</span>
          </div>

          <p className={styles.title}>Sign in to your account</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="admin-email" className={styles.label}>
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                className={styles.input}
                placeholder="admin@cafecrown.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="admin-password" className={styles.label}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className={styles.errorMsg} role="alert">
                <span>⚠</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-signin-btn"
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !email || !password}
            >
              {loading && <span className={styles.spinner} aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className={styles.footerNote}>
            Authorized personnel only • Cafe Crown ©&nbsp;{new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
}
