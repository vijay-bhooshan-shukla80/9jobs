'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './job-editor.module.css';

export default function JobEditor({job}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [errors, setErrors] = useState({});
  const value = name => Array.isArray(job?.[name]) ? job[name].join('\n') : job?.[name] || '';
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    for (const key of ['responsibilities', 'qualifications', 'skills']) data[key] = data[key].split('\n').map(line => line.trim()).filter(Boolean);
    setBusy(true); setError(''); setErrors({});
    try {
      const response = await fetch('/api/admin/careers/jobs' + (job ? '/' + job.id : ''), {method: job ? 'PATCH' : 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
      const result = await response.json();
      if (!response.ok) {setError(result.error || 'Unable to save this job.'); setErrors(result.fields || {}); return;}
      router.push('/admin/careers/jobs'); router.refresh();
    } catch { setError('Connection interrupted. Your entries are still here; please retry.'); }
    finally { setBusy(false); }
  }
  const field = (name, label, {textarea = false, options, maxLength, optional = false, hint} = {}) => <label className={textarea ? styles.wide : undefined}>{label}{!optional && ' *'}{hint && <small>{hint}</small>}{options ? <select name={name} defaultValue={value(name) || (name === 'status' ? 'draft' : '')} required aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined}><option value="" disabled>Select {label.toLowerCase()}</option>{options.map(option => <option value={option} key={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}</select> : textarea ? <textarea name={name} defaultValue={value(name)} maxLength={maxLength} required={!optional} rows={name === 'about' ? 5 : 4} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined} /> : <input name={name} defaultValue={value(name)} maxLength={maxLength} required={!optional} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined} />}{errors[name] && <span className={styles.error} id={name + '-error'}>{errors[name]}</span>}</label>;
  return <form onSubmit={submit} className={styles.form} aria-busy={busy}>
    <p className={styles.help}>Only published jobs appear on the Careers page. Draft and closed jobs remain private. Existing applications are retained when a job is closed.</p>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <fieldset disabled={busy} className={styles.fields}>
      {field('title', 'Job title', {maxLength: 160})}
      {field('department', 'Department', {maxLength: 160})}
      {field('location', 'Location', {maxLength: 160})}
      {field('type', 'Employment type', {options: ['Full-time', 'Part-time', 'Contract']})}
      {field('arrangement', 'Work arrangement', {options: ['On-site', 'Hybrid', 'Remote']})}
      {field('status', 'Publication status', {options: ['draft', 'published', 'closed']})}
      {field('description', 'Short description', {textarea: true, maxLength: 600, hint: 'Shown on the Careers listing and application summary.'})}
      {field('about', 'About the role', {textarea: true, maxLength: 10000})}
      {field('responsibilities', 'Key responsibilities', {textarea: true, maxLength: 18000, hint: 'One responsibility per line, up to 30 lines.'})}
      {field('qualifications', 'Required qualifications', {textarea: true, maxLength: 18000, hint: 'One qualification per line, up to 30 lines.'})}
      {field('skills', 'Preferred skills', {textarea: true, maxLength: 3000, hint: 'One skill per line, up to 30 skills.'})}
      {field('instructions', 'Application instructions', {textarea: true, maxLength: 4000, optional: true})}
      <div className={styles.actions}><Link className="admin-secondary-button" href="/admin/careers/jobs">Cancel</Link><button className="admin-primary-button" type="submit">{busy ? 'Saving…' : 'Save Job'}</button></div>
    </fieldset>
  </form>;
}
