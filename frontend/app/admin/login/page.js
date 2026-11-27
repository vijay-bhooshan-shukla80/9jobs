import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { UsersRound, BriefcaseBusiness, TrendingUp } from 'lucide-react';

import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { getAdminSessionFromCookieStore } from '@/lib/admin/auth/require-admin';
import styles from './login.module.css';

export const metadata = {
  title: 'Admin Login | 9Jobs',
};

export default async function AdminLoginPage({ searchParams }) {
  const session = await getAdminSessionFromCookieStore(await cookies());

  if (session) {
    redirect('/admin/dashboard');
  }

  const resolvedSearchParams = await searchParams;
  const requestedNextPath =
    typeof resolvedSearchParams?.next === 'string' ? resolvedSearchParams.next : '/admin/dashboard';
  const nextPath = requestedNextPath.startsWith('/admin') ? requestedNextPath : '/admin/dashboard';

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true"><span /><span /></div>
      <div className={styles.backgroundWords} aria-hidden="true"><span>People first.</span><span>Build what’s next.</span><span>Keep moving forward.</span></div>
      <header className={styles.pageIntro}><span>9Jobs admin workspace</span><h2>Good people. <em>Great possibilities.</em></h2><p>Your team, opportunities and daily work — connected.</p></header>
      <div className={styles.frame}>
        <Link className={styles.brand} href="/" aria-label="9Jobs home"><svg width="22" height="24" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true"><rect y="3" width="22" height="7" rx="3.5" /><rect y="14" width="22" height="7" rx="3.5" /></svg><span>9Jobs</span></Link>
        <div className={styles.content}>
          <section className={styles.welcome} aria-label="Welcome to 9Jobs"><div className={styles.welcomeCopy}><h2>Make room for<br />what’s next.</h2><p>Connect with talented people, manage opportunities and keep your team moving forward.</p></div>
            <div className={styles.scene} aria-hidden="true">
              <Image className={styles.cubes} src="/images/admin-login-cubes.png" alt="" fill priority sizes="(max-width: 700px) 75vw, 380px" />
              <svg className={styles.orbits} viewBox="0 0 500 500" fill="none">
                <g transform="rotate(-22 250 215)"><ellipse cx="250" cy="215" rx="224" ry="82" stroke="#456541" strokeWidth="2.5" /><circle className={styles.orbitOne} r="10" fill="url(#login-orbit-dark)" /></g>
                <g transform="rotate(19 250 280)"><ellipse cx="250" cy="280" rx="224" ry="82" stroke="#a7be7c" strokeWidth="2.8" /><circle className={styles.orbitTwo} r="9" fill="url(#login-orbit-light)" /></g>
                <defs><radialGradient id="login-orbit-dark" cx="30%" cy="25%"><stop stopColor="#a9db61" /><stop offset="1" stopColor="#447b10" /></radialGradient><radialGradient id="login-orbit-light" cx="30%" cy="25%"><stop stopColor="#d8efa9" /><stop offset="1" stopColor="#69a124" /></radialGradient></defs>
              </svg>
            </div>
            <div className={styles.pillars}><span><UsersRound size={14} aria-hidden="true" />People</span><span><BriefcaseBusiness size={14} aria-hidden="true" />Opportunities</span><span><TrendingUp size={14} aria-hidden="true" />Growth</span></div>
          </section>
          <div className={styles.formPanel}>
          <AdminLoginForm nextPath={nextPath} />
          </div>
        </div>
      </div>
    </main>
  );
}
