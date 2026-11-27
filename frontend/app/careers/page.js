import Image from 'next/image';
import Link from 'next/link';
import JobListings from '@/components/careers/JobListings';
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

export default function CareersPage() {
  return <>
    <section className={styles.hero}><div className={`${styles.container} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}><h1>Build Your Career.<br /><span>Shape the Future of Hiring.</span></h1><p>Join a passionate team transforming how people discover opportunities, build their careers and get hired. Together, we’re making the job search smarter, simpler and more human.</p><div className={styles.actions}><a className={styles.primary} href="#opportunities">Explore Open Roles <Asset name="055f6.svg" /></a><a className={styles.secondary} href="#life">Life at 9Jobs</a></div></div>
      <div className={styles.heroArt}>
        <div className={styles.heroAura} aria-hidden="true" />
        <svg className={styles.heroOrbit} viewBox="0 0 800 620" fill="none" aria-hidden="true"><path d="M54 387C-67 320 29 211 168 165C321 115 352 -39 501 13C659 68 575 210 693 276C866 372 686 464 563 532C402 621 278 594 256 501" stroke="#75D100" strokeWidth="1.6" strokeDasharray="3 10" strokeLinecap="round" /></svg>
        <div className={styles.heroVisual}><div className={styles.heroImage}><Image src="/careers/4dc2c.png" alt="Representative image of a diverse team collaborating in a bright modern workplace" fill priority sizes="(max-width: 767px) 90vw, (min-width: 1600px) 700px, 46vw" /></div>{[['Career Growth', 'baa1c.svg'], ['AI & Innovation', '40ce9.svg'], ['People First', '0d846.svg'], ['Meaningful Work', 'c4a95.svg']].map(([label, asset], i) => <div key={label} className={`${styles.floating} ${styles[`float${i}`]}`}><span><Asset name={asset} /></span>{label}</div>)}</div>
      </div>
    </div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.container}><SectionHeading eyebrow="Our mission" description="At 9Jobs, our mission is to empower job seekers through technology, personalised career support and innovative recruitment solutions. We believe meaningful careers begin with the right opportunities.">Helping People Build Better Futures</SectionHeading><div className={styles.threeGrid}>{missions.map(([icon, title, copy]) => <article className={styles.missionCard} key={title}><IconBox>{icon}</IconBox><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <JobListings />
    <section id="life" className={styles.section}><div className={styles.container}><div className={styles.headingRow}><SectionHeading eyebrow="Why work with us">Great People. Meaningful<br />Work. Endless Possibilities.</SectionHeading><p className={styles.caption}>Proposed culture pillars subject to internal company approval.</p></div><div className={styles.threeGrid}>{culture.map(([icon, title, copy]) => <article className={styles.cultureCard} key={title}><IconBox>{icon}</IconBox><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.container}><SectionHeading eyebrow="Our hiring process">Your Journey Starts Here</SectionHeading><div className={styles.process}>{steps.map(([asset, title, copy], i) => <article key={title}><div className={styles.stepHeader}><span><Asset name={asset} /></span><small>Step 0{i + 1}</small></div><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className={styles.section}><div className={styles.container}><div className={styles.eoi}><div><h2>Don’t See the Right Role Yet?</h2><p>We’re always interested in connecting with talented people. Share your profile and express your interest in future opportunities at 9Jobs.</p></div><div className={styles.actions}><Link className={styles.primary} href="/careers/expression-of-interest">Submit Your Profile <Asset name="d9608.svg" /></Link><Link className={styles.secondary} href="/contact">Connect With Us</Link></div></div></div></section>
    <section className={`${styles.section} ${styles.soft}`}><div className={styles.faq}><SectionHeading eyebrow="Frequently asked questions">Everything You Need to Know</SectionHeading><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Asset name="f8920.svg" /></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}
