'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness, MapPin, Laptop } from 'lucide-react';
import { departments, roles } from '@/data/careers';
import { Asset, IconBox, SectionHeading } from './Primitives';
import styles from '@/app/careers/careers.module.css';

export default function JobListings() {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const clear = () => {setQuery(''); setDepartment(''); setLocation(''); setType('');};
  const filtered = roles.filter(role => (!department || role.department === department) && (!location || role.location === location) && (!type || role.type === type) && `${role.title} ${role.department} ${role.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <section id="opportunities" className={`${styles.section} ${styles.opportunities}`}>
    <div className={styles.container}>
      <div className={styles.headingRow}><SectionHeading eyebrow="Open opportunities" description="Explore opportunities that match your skills, interests and ambitions.">Find Your Next <span className={styles.opportunityHighlight}>Opportunity</span></SectionHeading><p className={styles.previewNotice}><Asset name="44201.svg" />Illustrative role previews — final vacancies are confirmed from company data.</p></div>
      <div className={styles.filters}>
        <label className={styles.search}><span className={styles.srOnly}>Search by job title or keyword</span><Asset name="278ab.svg" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by job title or keyword..." type="search" /></label>
        <label><span className={styles.srOnly}>Department</span><select value={department} onChange={e => setDepartment(e.target.value)}><option value="">All Departments</option>{departments.map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span className={styles.srOnly}>Location</span><select value={location} onChange={e => setLocation(e.target.value)}><option value="">All Locations</option>{[...new Set(roles.map(r => r.location))].map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span className={styles.srOnly}>Employment type</span><select value={type} onChange={e => setType(e.target.value)}><option value="">All Types</option>{['Full-time', 'Part-time', 'Contract'].map(value => <option key={value}>{value}</option>)}</select></label>
        <button className={styles.textButton} onClick={clear}>Clear Filters</button>
      </div>
      <div aria-live="polite" className={styles.srOnly}>{filtered.length} illustrative roles match your filters.</div>
      <div className={styles.jobList}>{filtered.map(role => <article key={role.slug} className={styles.job}>
        <div className={styles.jobBody}><IconBox>{role.icon}</IconBox><div><div className={styles.roleTitle}><h3>{role.title}</h3><span className={styles.badge}>Preview Role</span></div><div className={styles.jobMetadata}><span><BriefcaseBusiness aria-hidden="true" size={16} />{role.department}</span><span><MapPin aria-hidden="true" size={16} />{role.location}</span><span><Laptop aria-hidden="true" size={17} />{role.type} · {role.arrangement}</span></div><p className={styles.jobDescription}>{role.description}</p></div></div>
        <div className={styles.actions}><Link className={styles.secondary} href={`/careers/${role.slug}`}>View Details <Asset name="b5c7a.svg" /></Link><Link className={styles.primary} href={`/careers/${role.slug}/apply`}>Apply Now</Link></div>
      </article>)}{!filtered.length && <div className={styles.empty}><Asset name="278ab.svg" /><h3>No open positions match your search.</h3><p>Please explore other departments or submit an expression of interest.</p><div className={styles.actions}><button className={styles.secondary} onClick={clear}>Clear Filters</button><Link className={styles.primary} href="/careers/expression-of-interest">Submit Your Profile</Link></div></div>}</div>
    </div>
  </section>;
}
