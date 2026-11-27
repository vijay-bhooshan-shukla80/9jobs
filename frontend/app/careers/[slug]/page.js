import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, MapPin, Layers, Laptop, Target, ClipboardList, GraduationCap, Info, Check, Sparkles, Rocket, CodeXml, UsersRound, Megaphone, Headset, Settings, Bot } from 'lucide-react';
import { roles } from '@/data/careers';
import SaveRoleButton from '@/components/careers/SaveRoleButton';
import styles from './role-details.module.css';

export const metadata = {title: 'Illustrative Role Details | 9Jobs Careers', robots: {index: false, follow: false}};
const roleIcons = {person_search: UsersRound, code: CodeXml, campaign: Megaphone, business_center: BriefcaseBusiness, support_agent: Headset, settings_accessibility: Settings, smart_toy: Bot};
const responsibilities = [
  'Design, build, and maintain responsive web applications and internal recruitment workflows.',
  'Develop clean, well-documented RESTful or GraphQL APIs and database integrations.',
  'Collaborate with UI/UX designers to ensure accessibility, performance, and design-system consistency.',
  'Participate in code reviews, automated testing, and continuous deployment improvements.',
];
const qualifications = [
  'Proven experience building modern web applications with JavaScript/TypeScript, React or Next.js, and Node.js.',
  'Solid understanding of relational databases, API security, and responsive CSS architecture.',
  'Strong written and verbal communication skills within a collaborative product team.',
];
const skills = ['React / Next.js', 'Node.js', 'JavaScript / TypeScript', 'REST / GraphQL', 'HR SaaS', 'AI workflows'];
const pendingDetails = 'Details will be published with an approved vacancy. This role is an illustrative preview and is not an active opening.';

function DetailCard({title, Icon, children}) {
  return <section className={styles.card}><span className={styles.iconTile}><Icon size={29} aria-hidden="true" /></span><div className={styles.cardBody}><h2>{title}</h2>{children}</div></section>;
}
function CheckList({items}) {
  return <ul className={styles.checkList}>{items.map(item => <li key={item}><span><Check size={12} strokeWidth={3} aria-hidden="true" /></span>{item}</li>)}</ul>;
}

export default async function RolePage({params}) {
  const {slug} = await params;
  const role = roles.find(item => item.slug === slug);
  if (!role) notFound();
  const developer = role.slug === 'full-stack-developer';
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
          <DetailCard title="About the Role" Icon={Target}><p>{role.description}</p></DetailCard>
          <DetailCard title="Key Responsibilities" Icon={ClipboardList}>{developer ? <CheckList items={responsibilities} /> : <p>{pendingDetails}</p>}</DetailCard>
          <DetailCard title="Required Qualifications" Icon={GraduationCap}>{developer ? <CheckList items={qualifications} /> : <p>{pendingDetails}</p>}</DetailCard>
          <DetailCard title="Preferred Skills" Icon={Layers}>{developer ? <ul className={styles.skills}>{skills.map(skill => <li key={skill}>{skill}</li>)}</ul> : <p>{pendingDetails}</p>}</DetailCard>
          <DetailCard title="Application Instructions" Icon={Info}><p>Click “Apply Now” to submit your resume (PDF or DOCX), LinkedIn profile and an optional portfolio link. Our recruitment team reviews all applications carefully — no application fee is ever charged.</p><p className={styles.notice}>Illustrative role preview. Submissions are expressions of interest for future opportunities, not applications for a confirmed vacancy.</p></DetailCard>
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
