'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import styles from '@/app/careers/[slug]/role-details.module.css';

export default function SaveRoleButton({slug}) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  const storageKey = '9jobs-saved-role:' + slug;
  useEffect(() => {
    try { setSaved(localStorage.getItem(storageKey) === 'true'); } catch { /* Storage may be unavailable. */ }
  }, [storageKey]);
  function toggle() {
    try {
      if (saved) localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, 'true');
      setSaved(!saved); setMessage('');
    } catch { setMessage('Your browser could not save this role. Please bookmark this page instead.'); }
  }
  const Icon = saved ? Check : Bookmark;
  return <><button className={styles.save} type="button" onClick={toggle} aria-pressed={saved}><Icon size={19} aria-hidden="true" />{saved ? 'Saved for Later' : 'Save for Later'}</button>{message && <p className={styles.notice} role="status">{message}</p>}</>;
}
