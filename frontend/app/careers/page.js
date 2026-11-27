import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, GraduationCap, House, Laptop, TrendingUp, Users } from 'lucide-react';
import JobListings from '@/components/careers/JobListings';
import { listPublishedJobs } from '@/lib/careers/jobs';
import { Asset, IconBox, SectionHeading } from '@/components/careers/Primitives';
import { culture, faqs } from '@/data/careers';
import styles from './careers.module.css';

const missions = [
  ['person_celebrate', 'Empowering Job Seekers', 'Help Australian job seekers present their experience clearly through ATS-friendly resumes, stronger profiles and practical career support.'],
  ['psychology', 'Innovation Through Technology', 'Support the technology and organised application workflows behind 9Jobs’ resume, profile and job application services.'],
  ['public', 'Making a Real Impact', 'Contribute to services that help IT and non-IT professionals across Australia prepare, apply and approach interviews with confidence.'],
];
const steps = [
  ['60a0d.svg', 'Submit Application', 'Apply for an advertised 9Jobs role with your resume, experience and relevant profile links.'],
  ['a1b5f.svg', 'Application Review', 'The 9Jobs team reviews your experience against the responsibilities and requirements of the advertised role.'],
  ['08f86.svg', 'Interview & Assessment', 'If shortlisted, discuss your skills, relevant work and potential contribution to 9Jobs. Any assessment depends on the role.'],
  ['2d75d.svg', 'Offer & Onboarding', 'Successful candidates receive the role details and next steps for joining the 9Jobs team.'],
];

export const dynamic = 'force-dynamic';
export default async function CareersPage() {
  let jobs = [], jobsUnavailable = false;
  try { jobs = await listPublishedJobs(); } catch { jobsUnavailable = true; }
  return <>
    <section className={`${styles.hero} ${styles.heroRefresh}`}><div className={`${styles.container} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}>
        <span className={styles.pill}><i aria-hidden="true" />Careers at 9Jobs</span>
        <h1>Build Your Career with 9Jobs<br /><span>Help Careers Move Forward.</span></h1>
        <p>Help 9Jobs support Australian job seekers with stronger resumes, better profiles and organised job applications.</p>
        <div className={styles.actions}><a className={styles.primary} href="#opportunities">Explore Roles <ArrowRight aria-hidden="true" size={22} /></a><a className={styles.secondary} href="#life">About Our Work</a></div>
        <ul className={styles.heroBenefits}>
          <li><span><Laptop aria-hidden="true" /></span>Career Support</li>
          <li><span><TrendingUp aria-hidden="true" /></span>Targeted<br />Applications</li>
          <li><span><Users aria-hidden="true" /></span>Job Seeker<br />Focus</li>
        </ul>
      </div>
      <div className={styles.heroArt}>
        <div className={styles.heroAura} aria-hidden="true" />
        <svg className={styles.heroOrbit} viewBox="0 0 800 620" fill="none" aria-hidden="true"><path d="M54 387C-67 320 29 211 168 165C321 115 352 -39 501 13C659 68 575 210 693 276C866 372 686 464 563 532C402 621 278 594 256 501" stroke="#91cd38" strokeWidth="1.2" strokeLinecap="round" /></svg>
        <div className={styles.heroVisual}>
          <div className={styles.heroImage}><Image src="/careers/4dc2c.png" alt="Representative image of a diverse team collaborating in a bright modern workplace" fill priority sizes="(max-width: 767px) 90vw, (min-width: 1600px) 700px, 46vw" /></div>
          <div className={`${styles.heroFeatureCard} ${styles.heroOpenRoles}`}><span className={styles.heroFeatureIcon}><BriefcaseBusiness aria-hidden="true" /></span><div><strong>{jobsUnavailable ? 'Explore' : jobs.length}</strong><p>Open Roles</p></div></div>
          <div className={`${styles.heroFeatureCard} ${styles.heroLearning}`}><span className={styles.heroFeatureIcon}><GraduationCap aria-hidden="true" /></span><div><strong>Profile Support</strong><p>Resumes, LinkedIn<br />and SEEK profiles.</p></div></div>
          <div className={`${styles.heroFeatureCard} ${styles.heroFlexible}`}><span className={styles.heroFeatureIcon}><House aria-hidden="true" /></span><div><strong>Job Search</strong><p>Applications and<br />interview support.</p></div></div>
        </div>
      </div>
    </div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.container}><SectionHeading eyebrow="Our mission" description="9Jobs helps IT and non-IT professionals across Australia prepare for their next opportunity. We combine resume writing, LinkedIn and SEEK profile optimisation, targeted job applications and interview support.">Helping Australia’s Job Seekers Move Forward</SectionHeading><div className={styles.threeGrid}>{missions.map(([icon, title, copy]) => <article className={styles.missionCard} key={title}><IconBox>{icon}</IconBox><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <JobListings roles={jobs} unavailable={jobsUnavailable} />
    <section id="life" className={styles.section}><div className={styles.container}><div className={styles.headingRow}><SectionHeading eyebrow="Why work with us">Our Work. Your Contribution.<br />Better Career Support.</SectionHeading><p className={styles.caption}>Contribute to the career services and application workflows behind 9Jobs.</p></div><div className={styles.threeGrid}>{culture.map(([icon, title, copy]) => <article className={styles.cultureCard} key={title}><IconBox>{icon}</IconBox><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.container}><SectionHeading eyebrow="Our hiring process">Your Application to 9Jobs</SectionHeading><div className={styles.process}>{steps.map(([asset, title, copy], i) => <article key={title}><div className={styles.stepHeader}><span><Asset name={asset} /></span><small>Step 0{i + 1}</small></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={styles.section}><div className={styles.container}><div className={styles.eoi}><div><h2>Don’t See the Right Role Yet?</h2><p>Interested in contributing to 9Jobs’ career services or technology? Share your experience and preferred area of work for consideration when a relevant internal role becomes available.</p></div><div className={styles.actions}><Link className={styles.primary} href="/careers/expression-of-interest">Submit Your Profile <Asset name="d9608.svg" /></Link><Link className={styles.secondary} href="/contact">Connect With Us</Link></div></div></div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.faq}><SectionHeading eyebrow="Frequently asked questions">Applying to Work at 9Jobs</SectionHeading><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Asset name="f8920.svg" /></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}
