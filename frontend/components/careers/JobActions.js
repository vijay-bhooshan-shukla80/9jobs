'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { MoreVertical, Eye, Pencil } from 'lucide-react';
import styles from './application-actions.module.css';

export default function JobActions({id, slug, title, published}) {
  const trigger = useRef(null), menu = useRef(null);
  const [anchor, setAnchor] = useState(null);
  useEffect(() => {
    if (!anchor) return;
    function outside(event) {if (!menu.current?.contains(event.target) && !trigger.current?.contains(event.target)) setAnchor(null);}
    function escape(event) {if (event.key === 'Escape') {setAnchor(null);trigger.current?.focus();}}
    const close = () => setAnchor(null);
    document.addEventListener('pointerdown', outside);document.addEventListener('keydown', escape);window.addEventListener('resize', close);window.addEventListener('scroll', close, true);
    menu.current?.querySelector('a')?.focus();
    return () => {document.removeEventListener('pointerdown', outside);document.removeEventListener('keydown', escape);window.removeEventListener('resize', close);window.removeEventListener('scroll', close, true);};
  }, [anchor]);
  function open() {
    if (anchor) {setAnchor(null);return;}
    const rect = trigger.current.getBoundingClientRect(), height = published ? 96 : 56;
    setAnchor({left: Math.max(8, Math.min(rect.right - 190, window.innerWidth - 198)), top: rect.bottom + height + 6 > window.innerHeight ? Math.max(8, rect.top - height - 6) : rect.bottom + 6});
  }
  function navigate(event) {
    if (event.key === 'Tab') {setAnchor(null);return;}
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const items = [...menu.current.querySelectorAll('[role="menuitem"]')], current = items.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  }
  return <><button ref={trigger} type="button" className={styles.trigger} aria-label={'Job actions for ' + title} aria-haspopup="menu" aria-expanded={Boolean(anchor)} onClick={open}><MoreVertical size={21} aria-hidden="true" /></button>{anchor && createPortal(<div ref={menu} role="menu" aria-label={'Actions for ' + title} className={styles.menu} style={anchor} onKeyDown={navigate}><Link role="menuitem" href={'/admin/careers/jobs/' + id + '/edit'}><Pencil size={17} aria-hidden="true" />Edit Job</Link>{published && <Link role="menuitem" href={'/careers/' + slug}><Eye size={17} aria-hidden="true" />View Job</Link>}</div>, document.body)}</>;
}
