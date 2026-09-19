import HeroLaptop from "./HeroLaptop";
import { CheckCircle2, ChevronsDown } from "lucide-react";
import { CalendlyLink } from "../CalendlyWidget";
import styles from "./HomeHero.module.css";

export default function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.copy}>

            <h1 id="home-hero-title">9Jobs - <span className={styles.lime}>Everything<br />You Need</span> to Get<br />Hired in <span className={styles.mark}>Australia</span></h1>
            <p>From smarter job search and ATS-optimized resumes to LinkedIn optimization, tailored applications and interview support – 9Jobs helps you at every step of your career journey.</p>
            <div className={styles.actions}>
              <CalendlyLink className={styles.trial}>2 Days Trial</CalendlyLink>
              <CalendlyLink className={styles.demo}>Get a demo</CalendlyLink>
            </div>
          </div>
          <HeroLaptop />
        </div>
        <div className={styles.trust}>
          {["Trusted by 100+ job seekers", "100% Secure & Private", "Australia-Focused", "Real People, Real Support"].map(text => <span key={text}><CheckCircle2 size={15} fill="currentColor" stroke="white" /><span>{text}</span></span>)}
        </div>
        <a className={styles.watchDemoCue} href="#how-9jobs-works" aria-label="Watch demo videos">
          <span>Watch Demo</span>
          <ChevronsDown size={38} strokeWidth={2.1} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}



