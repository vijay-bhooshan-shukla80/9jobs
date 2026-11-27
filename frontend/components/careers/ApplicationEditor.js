'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './job-editor.module.css';

export default function ApplicationEditor({application}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [errors, setErrors] = useState({});
  async function submit(event) {
    event.preventDefault();if (busy) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);setError('');setErrors({});
    try {
      const response = await fetch('/api/admin/careers/' + application.id, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
      const result = await response.json();
      if (!response.ok) {setError(result.error || 'Unable to update the application.');setErrors(result.fields || {});return;}
      router.push('/admin/careers');router.refresh();
    } catch {setError('Connection interrupted. Your entries are still here; please retry.');} finally {setBusy(false);}
  }
  const field = (name, label, {type = 'text', options, textarea = false, maxLength, optional = false} = {}) => <label className={textarea ? styles.wide : undefined}>{label}{!optional && ' *'}{options ? <select name={name} defaultValue={application[name]} required aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select> : textarea ? <textarea name={name} defaultValue={application[name]} maxLength={maxLength} rows={4} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined} /> : <input name={name} type={type} defaultValue={application[name]} maxLength={maxLength} required={!optional} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined} />}{errors[name] && <span className={styles.error} id={name + '-error'}>{errors[name]}</span>}</label>;
  return <form className={styles.form} onSubmit={submit} aria-busy={busy}><p className={styles.help}>Update applicant details or review status. Saving does not resend emails or change the original resume or privacy consent.</p>{error && <p className={styles.error} role="alert">{error}</p>}<fieldset disabled={busy} className={styles.fields}>
    {field('fullName', 'Full name', {maxLength: 120})}{field('email', 'Email address', {type: 'email', maxLength: 254})}
    {field('phone', 'Phone number', {type: 'tel', maxLength: 32})}{field('location', 'Current location', {maxLength: 160})}
    {field('position', 'Position applying for', {maxLength: 160})}{field('experience', 'Years of experience', {options: ['0–1', '1–3', '3–5', '5–10', '10+'].map(x => [x, x + ' years'])})}
    {field('linkedin', 'LinkedIn profile', {type: 'url', maxLength: 500})}{field('portfolio', 'Portfolio', {type: 'url', maxLength: 500, optional: true})}
    {field('status', 'Review status', {options: [['Pending', 'Received'], ...['Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map(x => [x, x])]})}
    {field('coverLetter', 'Cover letter', {textarea: true, maxLength: 5000, optional: true})}{field('additionalInformation', 'Additional information', {textarea: true, maxLength: 2000, optional: true})}
    <div className={styles.actions}><Link className="admin-secondary-button" href="/admin/careers">Cancel</Link><button className="admin-primary-button" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save Changes'}</button></div>
  </fieldset></form>;
}
