import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, MapPin, Layers, Laptop, Target, ClipboardList, GraduationCap, Info, Check, Sparkles, Rocket, CodeXml, UsersRound, Megaphone, Headset, Settings, Bot } from 'lucide-react';
import { getPublishedJob } from '@/lib/careers/jobs';
import SaveRoleButton from '@/components/careers/SaveRoleButton';
import styles from './role-details.module.css';

export const metadata = {title: 'Role Details | 9Jobs Careers', robots: {index: false, follow: false}};
const roleIcons = {person_search: UsersRound, code: CodeXml, campaign: Megaphone, business_center: BriefcaseBusiness, support_agent: Headset, settings_accessibility: Settings, smart_toy: Bot};
function DetailCard({title, Icon, children}) {
  return <section className={styles.card}><span className={styles.iconTile}><Icon size={29} aria-hidden="true" /></span><div className={styles.cardBody}><h2>{title}</h2>{children}</div></section>;
}
function CheckList({items}) {
  return <ul className={styles.checkList}>{items.map(item => <li key={item}><span><Check size={12} strokeWidth={3} aria-hidden="true" /></span>{item}</li>)}</ul>;
}

export const dynamic = 'force-dynamic';
export default async function RolePage({params}) {
  const {slug} = await params;
  const role = await getPublishedJob(slug);
  if (!role) notFound();
  const RoleIcon = roleIcons[role.icon] || BriefcaseBusiness;
  return <div className={styles.page}><div className={styles.container}>
    <Link className={styles.back} href="/careers#opportunities"><ArrowLeft size={18} aria-hidden="true" />Back to Career Opportunities</Link>
    <div className={styles.layout}>
      <div className={styles.content}>
        <header className={styles.roleHeader}>
          <span className={styles.roleIcon}><RoleIcon size={36} aria-hidden="true" /></span>
          <div className={styles.roleHeading}><h1>{role.title}</h1><div className={styles.meta}><span><MapPin size={19} aria-hidden="true" />{role.location}</span><span><BriefcaseBusiness size={19} aria-hidden="true" />{role.type}</span><span><Layers size={20} aria-hidden="true" />{role.arrangement}</span><span className={styles.department}>{role.department}</span></div></div>
        </header>
        <div className={styles.cards}>
          <DetailCard title="About the Role" Icon={Target}><p style={{whiteSpace: 'pre-line'}}>{role.about}</p></DetailCard>
          <DetailCard title="Key Responsibilities" Icon={ClipboardList}><CheckList items={role.responsibilities} /></DetailCard>
          <DetailCard title="Required Qualifications" Icon={GraduationCap}><CheckList items={role.qualifications} /></DetailCard>
          <DetailCard title="Preferred Skills" Icon={Layers}><ul className={styles.skills}>{role.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></DetailCard>
          <DetailCard title="Application Instructions" Icon={Info}><p style={{whiteSpace: 'pre-line'}}>{role.instructions || 'Click “Apply Now” to submit your resume (PDF or DOCX), LinkedIn profile and an optional portfolio link. Our recruitment team reviews all applications carefully — no application fee is ever charged.'}</p></DetailCard>
        </div>
      </div>
      <aside className={styles.sidebar}>
        <section className={styles.summary}>
          <header className={styles.summaryHeader}><span className={styles.iconTile}><BriefcaseBusiness size={28} aria-hidden="true" /></span><div><h2>Role Summary</h2><p>Quick details about this opportunity.</p></div></header>
          <div className={styles.summaryBody}><dl>{[[Layers, 'Department', role.department], [MapPin, 'Location', role.location], [BriefcaseBusiness, 'Employment Type', role.type], [Laptop, 'Work Arrangement', role.arrangement]].map(([Icon, label, value]) => <div className={styles.summaryRow} key={label}><dt><Icon size={21} aria-hidden="true" /><span>{label}</span></dt><dd>{value}</dd></div>)}</dl>
            <Link className={styles.apply} href={`/careers/${role.slug}/apply`}>Apply Now<ArrowRight size={19} aria-hidden="true" /></Link>
            <SaveRoleButton key={role.slug} slug={role.slug} />
          </div>
        </section>
        <section className={styles.culture}><h2><span className={styles.iconTile}><Sparkles size={25} aria-hidden="true" /></span>Why Join 9Jobs?</h2><CheckList items={['Work on meaningful products', 'Collaborative and people-first culture', 'Growth and learning opportunities']} /><p className={styles.notice}>Proposed culture statements, subject to company approval.</p><Rocket className={styles.rocket} size={53} strokeWidth={1.4} aria-hidden="true" /></section>
      </aside>
    </div>
  </div></div>;
}
