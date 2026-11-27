'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, MapPin, Laptop } from 'lucide-react';
import { departments } from '@/data/careers';
import { Asset, SectionHeading } from './Primitives';
import styles from '@/app/careers/careers.module.css';

export default function JobListings({roles = [], unavailable = false}) {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const clear = () => {setQuery(''); setDepartment(''); setLocation(''); setType('');};
  const departmentOptions = [...new Set([...departments, ...roles.map(role => role.department)])];
  const filtered = roles.filter(role => (!department || role.department === department) && (!location || role.location === location) && (!type || role.type === type) && `${role.title} ${role.department} ${role.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <section id="opportunities" className={`${styles.section} ${styles.opportunities}`}>
    <div className={styles.container}>
      <div className={styles.headingRow}><SectionHeading eyebrow="Open opportunities" description="Explore current openings within the 9Jobs team and find a role that matches your experience.">Find Your Next <span className={styles.opportunityHighlight}>Opportunity</span></SectionHeading></div>
      <div className={styles.filters}>
        <label className={styles.search}><span className={styles.srOnly}>Search by job title or keyword</span><Asset name="278ab.svg" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by job title or keyword..." type="search" /></label>
        <label><span className={styles.srOnly}>Department</span><select value={department} onChange={e => setDepartment(e.target.value)}><option value="">All Departments</option>{departmentOptions.map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span className={styles.srOnly}>Location</span><select value={location} onChange={e => setLocation(e.target.value)}><option value="">All Locations</option>{[...new Set(roles.map(r => r.location))].map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span className={styles.srOnly}>Employment type</span><select value={type} onChange={e => setType(e.target.value)}><option value="">All Types</option>{['Full-time', 'Part-time', 'Contract'].map(value => <option key={value}>{value}</option>)}</select></label>
        <button className={styles.textButton} onClick={clear}>Clear Filters</button>
      </div>
      <div aria-live="polite" className={styles.srOnly}>{filtered.length} roles match your filters.</div>
      <div className={styles.jobList}>{filtered.map(role => <article key={role.slug} className={styles.job}>
        <div className={styles.jobBody}><span className={styles.iconBox}><BriefcaseBusiness aria-hidden="true" size={30} strokeWidth={1.8} /></span><div><div className={styles.roleTitle}><h3>{role.title}</h3></div><div className={styles.jobMetadata}><span><BriefcaseBusiness aria-hidden="true" size={16} />{role.department}</span><span><MapPin aria-hidden="true" size={16} />{role.location}</span><span><Laptop aria-hidden="true" size={17} />{role.type} · {role.arrangement}</span></div><p className={styles.jobDescription}>{role.description}</p>
          <div className={styles.jobActions}><Link className={styles.jobApplyButton} href={`/careers/${role.slug}/apply`}>Apply Now <ArrowRight aria-hidden="true" size={15} /></Link><Link className={styles.jobDetailsButton} href={`/careers/${role.slug}`}>View Details <ArrowRight aria-hidden="true" size={15} /></Link></div>
        </div></div>
      </article>)}{!filtered.length && <div className={styles.empty}><Asset name="278ab.svg" /><h3>{unavailable ? 'Opportunities are temporarily unavailable.' : 'No matching 9Jobs openings right now.'}</h3><p>{unavailable ? 'Please try again shortly.' : 'Try another filter or share your profile for future opportunities with the 9Jobs team.'}</p><div className={styles.actions}><button className={styles.secondary} onClick={clear}>Clear Filters</button><Link className={styles.primary} href="/careers/expression-of-interest">Submit Your Profile</Link></div></div>}</div>
    </div>
  </section>;
}
