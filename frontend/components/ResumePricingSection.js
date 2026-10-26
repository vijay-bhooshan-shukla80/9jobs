"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, ArrowRight, FileCheck, Zap, PenTool, FileText, UsersRound } from "lucide-react";
import { CalendlyLink } from "./CalendlyWidget";
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
    delay: 0,
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
    delay: 0.15,
    dark: false
  }
];

const trustItems = [
  { icon: FileCheck, label: "ATS-friendly" },
  { icon: Zap, label: "Fast turnaround" },
  { icon: PenTool, label: "Human-written" }
];

export default function ResumePricingSection() {
  const containerRef = useRef(null);
  
  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax shifts for floating background rhombus shapes
  const yParallax1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yParallax2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yParallax3 = useTransform(scrollYProgress, [0, 1], [-90, 90]);

  return (
    <section ref={containerRef} className={`fj-section fj-resume-section ${styles.compact}`}>
      {/* Background Blobs */}
      <div className="fj-resume-bg-blob fj-resume-bg-blob--1" />
      <div className="fj-resume-bg-blob fj-resume-bg-blob--2" />

      {/* Floating Parallax Rhombus Outlines */}
      <motion.div
        style={{
          position: "absolute",
          width: "110px",
          height: "110px",
          border: "1.5px solid rgba(16, 185, 129, 0.16)",
          borderRadius: "20px",
          top: "15%",
          left: "6%",
          y: yParallax1,
          zIndex: 2,
          pointerEvents: "none"
        }}
        animate={{ rotate: [45, 52, 45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, rgba(132, 204, 22, 0.04) 0%, rgba(16, 185, 129, 0.08) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.18)",
          borderRadius: "16px",
          bottom: "22%",
          right: "8%",
          y: yParallax2,
          zIndex: 2,
          pointerEvents: "none"
        }}
        animate={{ rotate: [45, 38, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "44px",
          height: "44px",
          border: "1px solid rgba(132, 204, 22, 0.22)",
          borderRadius: "8px",
          top: "35%",
          right: "48%",
          y: yParallax3,
          zIndex: 2,
          pointerEvents: "none"
        }}
        animate={{ rotate: [45, 65, 45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content Container */}
      <div className="fj-container fj-resume-container">
        {/* Section Heading & Subheading */}
        <motion.div 
          className="fj-section-head"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span 
            className="fj-announcement" 
            style={{ margin: "0 auto 16px" }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span>One-Time Packages</span> Premium upgrades
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Resume & <span className="heading-mark">Profile Optimization</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            One-time professional upgrades for job seekers who don’t need weekly support.
          </motion.p>
        </motion.div>

        <div className={styles.grid}>
          {resumePlans.map((plan) => (
            <motion.article
              key={plan.name}
              data-resume-card
              className={`${styles.card} ${plan.dark ? styles.dark : styles.light}`}
              initial={{ opacity: 0, y: 24, rotate: plan.dark ? -2 : 2, skewY: -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: plan.dark ? -2 : 2, skewY: -1.5 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: plan.delay }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.floatingIcon} aria-hidden="true">
                {plan.dark ? <FileText size={30} /> : <UsersRound size={30} />}
              </div>
              <div className={styles.content}>
                <div className={styles.intro}>
                  <h2>{plan.name}</h2>
                  <p>{plan.description}</p>
                </div>
                <div className={styles.price}>
                  <strong>AUD {plan.price}</strong>
                  <span>+ 10% GST</span>
                </div>
                <div className={styles.period}>/ {plan.period}</div>
                <ul className={styles.features}>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className={styles.check} aria-hidden="true"><Check size={12} strokeWidth={2.8} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.actions}>
                  <PricingCheckoutButton plan={plan} className={`${styles.button} ${styles.pay}`} />
                  <CalendlyLink className={`${styles.button} ${styles.secondary}`}>
                    Get started <ArrowRight size={17} />
                  </CalendlyLink>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Small Trust Strip */}
        <motion.div 
          className="fj-resume-trust-strip"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="fj-resume-trust-item">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
