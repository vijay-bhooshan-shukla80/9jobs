'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, LockKeyhole, ShieldCheck } from 'lucide-react';

import { useToast } from '@/components/admin/ToastProvider';
import { loginRetryDeadline, loginRetrySeconds, formatLoginRetry, readLoginRetry, storeLoginRetry, subscribeLoginRetry, readLoginClock, subscribeLoginClock, loginRetryServerSnapshot } from '@/lib/admin/auth/login-retry';
import styles from '@/app/admin/login/login.module.css';

export default function AdminLoginForm({ nextPath = '/admin/dashboard' }) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const submitting = useRef(false);
  const retryKey = '9jobs-admin-login-retry:' + email.trim().toLowerCase();
  const getRetrySnapshot = useCallback(() => readLoginRetry(retryKey), [retryKey]);
  const retryUntil = useSyncExternalStore(subscribeLoginRetry, getRetrySnapshot, loginRetryServerSnapshot);
  const now = useSyncExternalStore(subscribeLoginClock, readLoginClock, loginRetryServerSnapshot);
  const retrySeconds = loginRetrySeconds(retryUntil, now);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current || retryUntil > Date.now()) return;
    submitting.current = true;
    setError('');
    setIsPending(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const deadline = loginRetryDeadline(response.headers.get('retry-after'));
          storeLoginRetry(retryKey, deadline);
          return;
        }
        setError(data.error || 'Unable to log in.');
        pushToast({ title: data.error || 'Unable to log in.', tone: 'error' });
        return;
      }

      pushToast({
        title: 'Admin login successful.',
        tone: 'success',
      });
      router.push(nextPath || '/admin/dashboard');
    } catch {
      setError('Unable to connect. Your details are still here; please try again.');
    } finally {
      submitting.current = false;
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}><span className={styles.accessBadge}><ShieldCheck size={13} aria-hidden="true" />Admin access</span><h1>Login</h1><p>Welcome back. Sign in to your 9Jobs workspace.</p></div>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Email address</span>
        <div className={styles.inputRow}><Mail size={17} aria-hidden="true" />
        <input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
          placeholder="Enter your email address"
        />
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Password</span>
        <div className={styles.password}>
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.visibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        </div>
      </label>

      <p className={styles.security}><ShieldCheck size={17} aria-hidden="true" />Secure administrator access</p>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {retrySeconds > 0 && <p className={styles.error} role="status">Login is temporarily locked. Try again in {formatLoginRetry(retrySeconds)}.</p>}

      <button className={styles.submit} disabled={isPending || retrySeconds > 0} type="submit">
        {isPending ? 'Signing in...' : retrySeconds > 0 ? 'Try again in ' + formatLoginRetry(retrySeconds) : 'Login'}
      </button>
      <div className={styles.footer}><span />9Jobs Australia<span /></div>
    </form>
  );
}
