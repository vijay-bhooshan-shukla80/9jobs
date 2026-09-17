"use client";

import Link from "next/link";
import { Quote, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Marquee, Reveal, StaggerContainer, StaggerItem } from "./homepage/HomeMotion";

const defaultTestimonials = [
  {
    name: "Jisvitha Athaluri",
    role: "Software Developer • Placed at TechFlow",
    quote: "Excellent experience! 9Jobs helped me optimize my resume and improve its ATS compatibility. The platform was easy to use, provided useful suggestions, and helped me tailor my resume to job descriptions quickly. Highly recommended!",
    rating: 5,
  },
  {
    name: "Mounika",
    role: "Financial Accountant • Placed at Bluebird",
    quote: "I had a positive experience working with 9Jobs. Their resume optimization process was thorough and helped improve the overall quality of my resume. Communication was prompt and professional.",
    rating: 5,
  },
  {
    name: "Bhavani Pspk",
    role: "Full Stack Developer • Placed at Thryv",
    quote: "9Jobs is a great service for job seekers who want to save time on applications. Their assistants customize resumes, write personalized cover letters, and apply to jobs professionally.",
    rating: 5,
  },
  {
    name: "Saireddy Koteru",
    role: "Cloud & DevOps • Placed at Dynamic Outreach",
    quote: "Got to know from a friend. In this tough job market, took a leap of faith and started my job search with them. Onboarding was smooth, transparent about work and communication was top notch!",
    rating: 5,
  },
  {
    name: "Lachlan Smith",
    role: "Senior Full Stack • Placed at KFM Logistics",
    quote: "Honestly, the job application automation saved me so much time. Ended up getting three interview calls in two weeks and accepted an offer from KFM Logistics.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Financial Analyst • Placed at Bluebird",
    quote: "My resume was completely overhauled to meet Australian ATS standards. The writers knew exactly what local recruiters look for. I saw a noticeable increase in responses from employers.",
    rating: 5,
  },
  {
    name: "Oliver Davies",
    role: "Supply Chain • Placed at Too Good To Go",
    quote: "Highly recommend their LinkedIn and Seek profile optimization services. They polished my profiles, added the right keywords, and made them look incredibly professional.",
    rating: 5,
  },
  {
    name: "Amelia Campbell",
    role: "People & Talent • Placed at AR Recruitment",
    quote: "The interview coaching was a game-changer for me. The mock sessions gave me the confidence I needed to handle tough questions and present my experience effectively.",
    rating: 5,
  },
  {
    name: "Nafisa Khan",
    role: "Business Analyst • Placed at Circlecastle",
    quote: "Great experience with 9Jobs. The team is professional, responsive, and truly supportive. They refined my CV for Australian hiring managers and kept me updated.",
    rating: 4,
  },
];

function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial }) {
  return (
    <motion.article
      className="fj-feature-card fj-testimonial-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "var(--card-width, 400px)",
        flexShrink: 0,
        padding: "32px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "24px", position: "relative" }}>
        <div className="fj-quote-wrapper">
          <Quote size={18} strokeWidth={2.5} />
        </div>
        <p className="fj-testimonial-quote-text">
          {testimonial.quote}
        </p>
      </div>

      <div className="fj-testimonial-user-row">
        <span className="fj-testimonial-avatar" aria-hidden="true">
          {getInitials(testimonial.name)}
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <strong style={{ fontSize: "0.95rem", color: "var(--fj-ink)", fontWeight: 700 }}>{testimonial.name}</strong>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: testimonial.rating || 5 }).map((_, index) => (
                <Star key={index} size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
              ))}
            </div>
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--fj-muted)" }}>{testimonial.role}</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const listToUse = [...defaultTestimonials];
  let filledList = [...listToUse];
  while (filledList.length > 0 && filledList.length < 6) {
    filledList = [...filledList, ...listToUse];
  }

  return (
    <section className="fj-section fj-home-section--grid" style={{ overflow: "hidden" }}>
      <div className="fj-container">
        <Reveal as="div" direction="up" distance={28}>
          <div className="fj-section-head" style={{ textAlign: "center", marginBottom: "64px" }}>
            <span className="fj-label" style={{ display: "block", marginBottom: "16px" }}>
              Testimonials
            </span>
            <h2 style={{ fontSize: "clamp(1rem, 3vw, 1.8rem)", fontWeight: 800, margin: 0, color: "var(--fj-ink)" }}>
              What people are <span className="heading-mark">saying.</span>
            </h2>
          </div>
        </Reveal>

        {/* Desktop gets a premium marquee; mobile falls back to scroll-snap cards. */}
        <div className="fj-testimonial-marquee">
          <Marquee className="fj-home-marquee-shell" itemClassName="fj-testimonial-marquee__item" speed="30s" mobileStatic>
            {filledList.map((testimonial) => (
              <TestimonialCard key={`desktop-${testimonial.name}-${testimonial.quote.slice(0, 18)}`} testimonial={testimonial} />
            ))}
          </Marquee>
        </div>

        <StaggerContainer as="div" className="fj-testimonial-scrollsnap" stagger={0.12} delayChildren={0.06}>
          {listToUse.map((testimonial) => (
            <StaggerItem as="div" key={`mobile-${testimonial.name}`}>
              <TestimonialCard testimonial={testimonial} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal as="div" direction="up" distance={20} className="fj-flex-center" style={{ marginTop: "44px", textAlign: "center" }}>
          <Link
            href="/testimonials"
            className="fj-clean-reviews-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "13px 30px",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              fontWeight: 600,
              fontSize: "0.92rem",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              letterSpacing: "-0.01em",
              transition: "all 0.25s ease",
            }}
          >
            <span>Explore All Verified Client Reviews & Placements</span>
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
