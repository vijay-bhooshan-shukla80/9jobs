import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, GraduationCap, House, Laptop, TrendingUp, Users } from 'lucide-react';
import JobListings from '@/components/careers/JobListings';
import { listPublishedJobs } from '@/lib/careers/jobs';
import { Asset, IconBox, SectionHeading } from '@/components/careers/Primitives';
import { culture, faqs } from '@/data/careers';
import styles from './careers.module.css';

const missions = [
  ['person_celebrate', 'Empowering Job Seekers', 'Giving every candidate clearer visibility, tailored career guidance, and tools to present their strengths with confidence.'],
  ['psychology', 'Innovation Through Technology', 'Building intelligent recruitment workflows that reduce friction and help people connect with relevant roles faster.'],
  ['public', 'Making a Real Impact', 'Every product improvement and conversation directly supports someone’s next career milestone across Australia.'],
];
const steps = [
  ['60a0d.svg', 'Submit Application', 'Share your resume, background, and role preferences through our streamlined application form.'],
  ['a1b5f.svg', 'Application Review', 'Our recruitment specialists carefully review your experience and alignment with the team.'],
  ['08f86.svg', 'Interview & Assessment', 'Meet with hiring managers for a structured conversation and practical role-relevant discussion.'],
  ['2d75d.svg', 'Offer & Onboarding', 'Receive your formal offer and join a supportive onboarding programme designed for early success.'],
];

export const dynamic = 'force-dynamic';
export default async function CareersPage() {
  let jobs = [], jobsUnavailable = false;
  try { jobs = await listPublishedJobs(); } catch { jobsUnavailable = true; }
  return <>
    <section className={`${styles.hero} ${styles.heroRefresh}`}><div className={`${styles.container} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}>
        <span className={styles.pill}><i aria-hidden="true" />Careers at 9Jobs</span>
        <h1>Build Your Career with 9Jobs<br /><span>Create Impact. Grow Faster.</span></h1>
        <p>Join a passionate team building smarter hiring experiences for people and businesses everywhere.</p>
        <div className={styles.actions}><a className={styles.primary} href="#opportunities">Explore Roles <ArrowRight aria-hidden="true" size={22} /></a><a className={styles.secondary} href="#life">Meet the Team</a></div>
        <ul className={styles.heroBenefits}>
          <li><span><Laptop aria-hidden="true" /></span>Hybrid Culture</li>
          <li><span><TrendingUp aria-hidden="true" /></span>Growth<br />Opportunities</li>
          <li><span><Users aria-hidden="true" /></span>People-First<br />Team</li>
        </ul>
      </div>
      <div className={styles.heroArt}>
        <div className={styles.heroAura} aria-hidden="true" />
        <svg className={styles.heroOrbit} viewBox="0 0 800 620" fill="none" aria-hidden="true"><path d="M54 387C-67 320 29 211 168 165C321 115 352 -39 501 13C659 68 575 210 693 276C866 372 686 464 563 532C402 621 278 594 256 501" stroke="#91cd38" strokeWidth="1.2" strokeLinecap="round" /></svg>
        <div className={styles.heroVisual}>
          <div className={styles.heroImage}><Image src="/careers/4dc2c.png" alt="Representative image of a diverse team collaborating in a bright modern workplace" fill priority sizes="(max-width: 767px) 90vw, (min-width: 1600px) 700px, 46vw" /></div>
          <div className={`${styles.heroFeatureCard} ${styles.heroOpenRoles}`}><span className={styles.heroFeatureIcon}><BriefcaseBusiness aria-hidden="true" /></span><div><strong>{jobsUnavailable ? 'Explore' : jobs.length}</strong><p>Open Roles</p></div></div>
          <div className={`${styles.heroFeatureCard} ${styles.heroLearning}`}><span className={styles.heroFeatureIcon}><GraduationCap aria-hidden="true" /></span><div><strong>Learning</strong><p>Keep growing with<br />ongoing learning.</p></div></div>
          <div className={`${styles.heroFeatureCard} ${styles.heroFlexible}`}><span className={styles.heroFeatureIcon}><House aria-hidden="true" /></span><div><strong>Flexible Work</strong><p>Work where you<br />do your best.</p></div></div>
        </div>
      </div>
    </div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.container}><SectionHeading eyebrow="Our mission" description="At 9Jobs, our mission is to empower job seekers through technology, personalised career support and innovative recruitment solutions. We believe meaningful careers begin with the right opportunities.">Helping People Build Better Futures</SectionHeading><div className={styles.threeGrid}>{missions.map(([icon, title, copy]) => <article className={styles.missionCard} key={title}><IconBox>{icon}</IconBox><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <JobListings roles={jobs} unavailable={jobsUnavailable} />
    <section id="life" className={styles.section}><div className={styles.container}><div className={styles.headingRow}><SectionHeading eyebrow="Why work with us">Great People. Meaningful<br />Work. Endless Possibilities.</SectionHeading><p className={styles.caption}>Proposed culture pillars subject to internal company approval.</p></div><div className={styles.threeGrid}>{culture.map(([icon, title, copy]) => <article className={styles.cultureCard} key={title}><IconBox>{icon}</IconBox><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.container}><SectionHeading eyebrow="Our hiring process">Your Journey Starts Here</SectionHeading><div className={styles.process}>{steps.map(([asset, title, copy], i) => <article key={title}><div className={styles.stepHeader}><span><Asset name={asset} /></span><small>Step 0{i + 1}</small></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={styles.section}><div className={styles.container}><div className={styles.eoi}><div><h2>Don’t See the Right Role Yet?</h2><p>We’re always interested in connecting with talented people. Share your profile and express your interest in future opportunities at 9Jobs.</p></div><div className={styles.actions}><Link className={styles.primary} href="/careers/expression-of-interest">Submit Your Profile <Asset name="d9608.svg" /></Link><Link className={styles.secondary} href="/contact">Connect With Us</Link></div></div></div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.faq}><SectionHeading eyebrow="Frequently asked questions">Everything You Need to Know</SectionHeading><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Asset name="f8920.svg" /></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}
