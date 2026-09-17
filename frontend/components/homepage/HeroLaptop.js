import HeroVisualMotion from "./HeroVisualMotion";
import AustralianFlag from "./AustralianFlag";
import AustralianGreeting from "./AustralianGreeting";
import { Bell, FileText, LayoutDashboard, Search, Send, Settings, UsersRound, Check, BriefcaseBusiness, PanelTop, CircleHelp } from "lucide-react";
import styles from "./HeroLaptop.module.css";

function Linkedin() { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3ZM6.5 7.7A1.7 1.7 0 1 1 6.5 4.3a1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-5.2c0-1.5-.6-2-1.4-2-1 0-1.6.7-1.6 2V19h-3V9h2.9v1.4c.5-.9 1.5-1.6 2.8-1.6 2.3 0 3.3 1.4 3.3 4Z" /></svg>; }

const services = [
  ["ATS Resume Builder", "Get past the ATS", FileText, "resume"],
  ["LinkedIn Optimization", "Stand out to recruiters", Linkedin, "linkedin"],
  ["Job Search Support", "Find the right opportunities", Search, "search"],
  ["Job Automation Tools", "Save time, apply smarter", Settings, "automation"],
  ["Manual Apply", "Get tailored applications", Send, "apply"],
  ["Interview Support", "Be interview ready", UsersRound, "interview"],
];
const navigation = [[LayoutDashboard, "Dashboard"], [BriefcaseBusiness, "My Applications"], [FileText, "Resume Builder"], [Linkedin, "LinkedIn Optimizer"], [Search, "Job Search"], [UsersRound, "Interview Support"], [Settings, "Settings"]];

export default function HeroLaptop() {
  return (
    <HeroVisualMotion className={styles.scene}>
      <svg data-hero-layer="decoration" className={styles.orbits} viewBox="0 0 740 440" fill="none" aria-hidden="true">
        <path d="M163 55C-24 22 53 142 258 146S618 126 594 242 213 413 104 320" stroke="#d9ffb2" strokeWidth="18" opacity=".5" />
        <path d="M134 101C169 13 318-8 331 94M473 65C545 139 653 105 659 37M52 190C23 285 160 280 202 206M121 311C140 406 253 407 276 352M509 344C570 414 647 378 645 333" stroke="#83cc36" strokeWidth="1.3" strokeDasharray="4 6" />
        <path d="M466 51l-12-13M480 45V26M495 51l12-13" stroke="#93e500" strokeWidth="4" strokeLinecap="round" />
        <path d="M681 221q10 37-21 69m0 0 4-18m-4 18 19-4" stroke="#a6e85d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className={styles.ground} aria-hidden="true" />
      <div className={styles.laptop} data-hero-layer="laptop">
        <div className={styles.lid}>
          <div className={styles.camera} />
          <div className={styles.screen}>
            <header className={styles.topbar}><strong><i />9Jobs</strong><div><Bell /><CircleHelp /><span>JD</span></div></header>
            <div className={styles.workspace}>
              <aside className={styles.sidebar}>{navigation.map(([Icon, label], index) => <div key={label} className={index === 0 ? styles.active : undefined}><Icon /><span>{label}</span></div>)}</aside>
              <div className={styles.dashboard}>
                <div className={styles.greeting}><AustralianGreeting /><span>Let’s get you hired in Australia <AustralianFlag className={styles.flag} /></span></div>
                <div className={styles.stats}>
                  {[["Your resume", "ATS-ready", "Built for recruiters"], ["Applications", "Tailored", "Matched to your goals"], ["Interview prep", "Supported", "Ready for your next step"]].map(([label, value, detail]) => <div key={label}><span>{label}</span><strong>{value}</strong><small><Check />{detail}</small></div>)}
                </div>
                <div className={styles.activityTitle}><strong>Your career toolkit</strong><span>PREVIEW</span></div>
                <div className={styles.activities}>
                  {[[FileText, "A resume that opens doors", "ATS-friendly and recruiter aligned"], [BriefcaseBusiness, "Applications made for you", "Relevant roles. Personalised support."], [Linkedin, "A profile that stands out", "Show recruiters what you bring"]].map(([Icon, title, subtitle]) => <div key={title}><span className={styles.activityIcon}><Icon /></span><div><strong>{title}</strong><small>{subtitle}</small></div><Check className={styles.done} /></div>)}
                </div>
                <div className={styles.screenFooter}><PanelTop />Your next chapter starts here.</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.base}><span /></div>
        <div className={styles.baseEdge} />
      </div>
      {services.map(([title, subtitle, Icon, position], index) => <div className={`${styles.card} ${styles[position]}`} data-hero-layer="card" key={title} style={{ "--delay": `${index * 80}ms` }}><span className={styles.icon}><Icon /></span><div><strong>{title}</strong><span>{subtitle}</span></div></div>)}
      <span className={styles.note}>Your next<br />opportunity is<br />closer than<br />you think.</span>
    </HeroVisualMotion>
  );
}

