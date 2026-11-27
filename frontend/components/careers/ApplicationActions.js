'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import styles from './application-actions.module.css';

export default function ApplicationActions({id, name}) {
  const router = useRouter();
  const trigger = useRef(null), menu = useRef(null), dialog = useRef(null);
  const [anchor, setAnchor] = useState(null), [confirm, setConfirm] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    if (!anchor) return;
    function close(event) {if (!menu.current?.contains(event.target) && !trigger.current?.contains(event.target)) setAnchor(null);}
    function escape(event) {if (event.key === 'Escape') {setAnchor(null);trigger.current?.focus();}}
    const onScroll = () => setAnchor(null);
    document.addEventListener('pointerdown', close);document.addEventListener('keydown', escape);window.addEventListener('resize', onScroll);window.addEventListener('scroll', onScroll, true);
    menu.current?.querySelector('a')?.focus();
    return () => {document.removeEventListener('pointerdown', close);document.removeEventListener('keydown', escape);window.removeEventListener('resize', onScroll);window.removeEventListener('scroll', onScroll, true);};
  }, [anchor]);
  useEffect(() => {if (confirm && !dialog.current?.open) dialog.current?.showModal();}, [confirm]);
  async function remove() {
    if (busy) return;setBusy(true);setError('');
    try {
      const response = await fetch('/api/admin/careers/' + id, {method: 'DELETE'});
      const result = await response.json();
      if (!response.ok) {setError(result.error || 'Unable to delete this application.');return;}
      setConfirm(false);router.refresh();
    } catch {setError('Connection interrupted. Please try again.');} finally {setBusy(false);}
  }
  function closeDialog() {if (!busy) {setConfirm(false);setError('');trigger.current?.focus();}}
  function menuKeys(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();const items = [...menu.current.querySelectorAll('[role="menuitem"]')];const current = items.indexOf(document.activeElement);const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;items[next]?.focus();
  }
  return <>
    <button ref={trigger} className={styles.trigger} type="button" aria-label={'Actions for ' + name} aria-haspopup="menu" aria-expanded={Boolean(anchor)} onClick={() => {if (anchor) {setAnchor(null);return;}const rect = trigger.current.getBoundingClientRect();setAnchor({left: Math.max(8, Math.min(rect.right - 190, window.innerWidth - 198)), top: rect.bottom + 6 + 136 > window.innerHeight ? Math.max(8, rect.top - 142) : rect.bottom + 6});}}><MoreVertical size={21} aria-hidden="true" /></button>
    {anchor && createPortal(<div ref={menu} role="menu" aria-label={'Application actions for ' + name} className={styles.menu} style={anchor} onKeyDown={menuKeys}><Link role="menuitem" href={'/admin/careers/' + id}><Eye size={17} aria-hidden="true" />View application</Link><Link role="menuitem" href={'/admin/careers/' + id + '/edit'}><Pencil size={17} aria-hidden="true" />Edit / Update</Link><button role="menuitem" className={styles.danger} type="button" onClick={() => {setAnchor(null);setConfirm(true);}}><Trash2 size={17} aria-hidden="true" />Delete</button></div>, document.body)}
    {confirm && createPortal(<dialog ref={dialog} className={styles.dialog} aria-labelledby={'delete-title-' + id} onCancel={event => {event.preventDefault();closeDialog();}}><h2 id={'delete-title-' + id}>Delete application?</h2><p>Remove {name} from the application register? The record will be retained for recovery and its resume will no longer be accessible here.</p>{error && <p role="alert" className={styles.danger}>{error}</p>}<div className={styles.buttons}><button type="button" onClick={closeDialog} disabled={busy} autoFocus>Cancel</button><button type="button" className={styles.delete} onClick={remove} disabled={busy}>{busy ? 'Deleting…' : 'Delete application'}</button></div></dialog>, document.body)}
  </>;
}
