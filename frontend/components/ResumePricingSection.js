"use client";

import { Check, FileText, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import PricingCheckoutButton from "./PricingCheckoutButton";
import styles from "./ResumePricingSection.module.css";

const resumePlans = [
  {
    name: "Resume Makeover",
    checkoutPlanName: "Resume Makeover + GST",
    price: "$49",
    period: "one-time",
    description: "Professional resume redesign tailored for ATS systems to get you noticed.",
    items: [
      "Resume redesign (ATS-friendly)",
      "Optimized formatting & structure",
      "Grammar & wording improvements",
      "Industry-specific keyword optimization",
      "Achievement-focused content",
      "PDF delivery (ATS & Recruiter friendly)"
    ],
    dark: true
  },
  {
    name: "Resume, LinkedIn & SEEK Optimisation",
    checkoutPlanName: "Resume, LinkedIn & SEEK Optimisation + GST",
    price: "$89",
    period: "one-time",
    description: "Complete professional branding to boost your Resume, LinkedIn, and SEEK profile visibility.",
    items: [
      "Everything in Resume Makeover",
      "LinkedIn profile optimization",
      "SEEK profile optimization",
      "Headline & About section rewrite",
      "Experience & skills enhancement",
      "ATS & search keyword targeting",
      "Profile visibility improvements",
      "PDF delivery & profile guides"
    ],
    dark: false
  }
];

export default function ResumePricingSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="resume-pricing-title">
      <motion.header
        className={styles.heading}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
      >
        <div className={styles.eyebrow}><span>One-Time Packages</span> Premium upgrades</div>
        <h2 id="resume-pricing-title">Resume & <span>Profile Optimization</span></h2>
        <p>One-time professional upgrades for job seekers who don’t need weekly support.</p>
      </motion.header>
      <div className={styles.grid}>
        {resumePlans.map((plan, index) => (
          <motion.article
            key={plan.name}
            data-resume-card
            className={`${styles.card} ${plan.dark ? styles.dark : styles.light}`}
            initial={{ opacity: 0, y: 28, scale: 0.95, rotate: plan.dark ? -2 : 2, skewY: -1.5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: reduceMotion ? 0 : plan.dark ? -2 : 2, skewY: reduceMotion ? 0 : -1.5 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduceMotion ? undefined : { y: -6, scale: 1.025, transition: { duration: 0.25, delay: 0 } }}
          >
            <div className={styles.icon} aria-hidden="true">
              {plan.dark ? <FileText size={20} /> : <UsersRound size={20} />}
            </div>
            <div className={styles.content}>
            <div className={styles.intro}>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>
            <div className={styles.price}><strong>AUD {plan.price}</strong><span>+ 10% GST</span></div>
            <div className={styles.period}>/ {plan.period}</div>
            <ul className={styles.features}>
              {plan.items.map((item) => (
                <li key={item}><Check size={15} strokeWidth={2} aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
            <PricingCheckoutButton plan={plan} className={styles.button} />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
