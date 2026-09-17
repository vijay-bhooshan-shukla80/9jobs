"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./ApplicationCreditsSection.module.css";

// 9Jobs Australian Pricing Options
export const STANDARD_DURATIONS = {
  1: {
    weeks: 1,
    label: "1 Week",
    jobsCount: "100+ Jobs",
    price: 150,
    discountAmount: 0,
    rateText: "AU$150 / week",
    savingsNotice: "STANDARD 1-WEEK RATE • 20 JOBS/DAY (100+/WEEK)",
    saveTag: null,
  },
  2: {
    weeks: 2,
    label: "2 Weeks",
    jobsCount: "200+ Jobs",
    price: 270,
    discountAmount: 30,
    rateText: "AU$135 / week",
    savingsNotice: "SAVE AU$30 (10% OFF) • 2 WEEKS • 200+ JOBS",
    saveTag: "Save 10%",
  },
  4: {
    weeks: 4,
    label: "4 Weeks (1 Mo)",
    jobsCount: "400+ Jobs",
    price: 500,
    discountAmount: 100,
    rateText: "AU$125 / week",
    savingsNotice: "SAVE AU$100 (17% OFF) • 1 MONTH • 400+ JOBS",
    saveTag: "Save 17%",
  },
};

const INCLUDED_SERVICES = [
  {
    id: "01",
    title: "100+ Jobs Applied Weekly (20 Jobs/Day)",
    description:
      "Human recruiters manually search and apply to 20 matching roles/day (100+ per week) across SEEK, LinkedIn, Indeed & Jora to avoid bot rejections.",
  },
  {
    id: "02",
    title: "ATS Resume Optimization (Australian Standard)",
    description:
      "Tailored specifically for Australian hiring systems, target Job Descriptions (JD), and local industry keywords to pass recruiter screening.",
  },
  {
    id: "03",
    title: "LinkedIn, SEEK, Indeed & Jora Optimization",
    description:
      "Comprehensive profile branding and keyword tuning across Australia's 4 major job portals to attract direct recruiter reach.",
  },
  {
    id: "04",
    title: "Interview Preparation & Mock Sessions Conducted",
    description:
      "Targeted interview preparation, Australian employer screening coaching, and mock interview practice conducted to secure offers.",
  },
  {
    id: "05",
    title: "Personal Recruiter & Job Sourcing",
    description:
      "Dedicated recruiter scouts verified, high-match roles based on your custom profile criteria across Australia.",
  },
  {
    id: "06",
    title: "AI Custom Cover Letters",
    description:
      "Dynamically custom-crafted for each role to stand out to Australian hiring managers and recruiters.",
  },
  {
    id: "07",
    title: "Proof of Each Job Application (Screenshots)",
    description:
      "Full transparency with verified screenshots of every submitted application showing details filled in the job portal.",
  },
  {
    id: "08",
    title: "Live Dashboard Tracker (JD & Link) + WhatsApp Support",
    description:
      "All applied jobs logged live on your candidate dashboard + direct real-time WhatsApp communication with your applying squad.",
  },
];

export default function ApplicationCreditsSection() {
  // Plan selection: "standard" or "success"
  const [selectedPlan, setSelectedPlan] = useState("standard");
  // Duration for standard plan: 1, 2, or 4 weeks
  const [standardDuration, setStandardDuration] = useState(1);

  const currentStandard =
    STANDARD_DURATIONS[standardDuration] || STANDARD_DURATIONS[1];

  const handlePurchase = () => {
    if (typeof window !== "undefined") {
      const intentParam =
        selectedPlan === "standard"
          ? `standard-${standardDuration}wk`
          : "success-based";
      const amount = selectedPlan === "standard" ? currentStandard.price : 200;
      window.location.href = `/contact?intent=${intentParam}&amount=${amount}&currency=AUD`;
    }
  };

  return (
    <section
      className={styles.creditsSection}
      id="application-credits"
      aria-label="Simple, Flexible Pricing"
    >
      <div className={styles.dotGridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          {/* Handwritten Decorative Notes (Desktop only) */}
          <div className={styles.decorLeft} aria-hidden="true">
            <span className={styles.decorLeftText}>
              &apos;Hire&apos;
              <br />
              Smarter
              <br />
              Faster
            </span>
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              className={styles.decorLeftArrow}
            >
              <path
                d="M10 8 C 12 24, 22 34, 34 32"
                stroke="#65a30d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="3 3"
              />
              <path
                d="M27 26 L 34 32 L 26 38"
                stroke="#65a30d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={styles.decorRight} aria-hidden="true">
            <span className={styles.decorRightText}>
              Great
              <br />
              People
              <br />
              Build
              <br />
              Great
              <br />
              Companies
            </span>
            <svg
              width="72"
              height="14"
              viewBox="0 0 72 14"
              fill="none"
              style={{ marginTop: "6px" }}
            >
              <path
                d="M3 8 C 22 3, 50 12, 69 7"
                stroke="#65a30d"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className={styles.topBadge}>
            <span>AUSTRALIAN JOB APPLICATION PLANS</span>
          </div>

          <h2 className={styles.title}>
            Simple, <span className={styles.highlight}>Transparent</span> Pricing
          </h2>

          <p className={styles.subtitle}>
            Choose the plan that fits your career goals. We apply to 100+ jobs
            every week (20 jobs/day) across SEEK, LinkedIn, Indeed &amp; Jora
            with tailored ATS resumes and interview coaching.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className={styles.pricingGrid}>
          {/* LEFT CARD — PRICING & PLAN SELECTOR */}
          <div className={styles.leftCard}>
            {/* Clean Plan Switcher Tabs */}
            <div className={styles.planSwitcher} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={selectedPlan === "standard"}
                onClick={() => setSelectedPlan("standard")}
                className={`${styles.planTab} ${
                  selectedPlan === "standard" ? styles.planTabActive : ""
                }`}
              >
                <span>Standard Plan</span>
                <span className={styles.planTabBadge}>AU$150/wk</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedPlan === "success"}
                onClick={() => setSelectedPlan("success")}
                className={`${styles.planTab} ${
                  selectedPlan === "success" ? styles.planTabActive : ""
                }`}
              >
                <span>Success-Based</span>
                <span className={styles.planTabBadge}>AU$200 Onboarding</span>
              </button>
            </div>

            {/* TAB 1: STANDARD PLAN */}
            {selectedPlan === "standard" && (
              <>
                <div className={styles.planHeaderBox}>
                  <div className={styles.planTopPill}>
                    Weekly Job Applications • Cancel Anytime
                  </div>

                  <div className={styles.priceDisplay}>
                    <span className={styles.priceAmount}>
                      AU${currentStandard.price}
                    </span>
                    <span className={styles.pricePeriod}>
                      {standardDuration === 1
                        ? "/ week"
                        : `/ ${currentStandard.label}`}
                    </span>
                  </div>

                  <p className={styles.planDescText}>
                    We scout verified Australian jobs, tailor your ATS resume
                    &amp; cover letter for each role, and apply to 100+ jobs
                    every week (20 jobs/day). <strong>Zero placement fee</strong>{" "}
                    — you keep 100% of your salary.
                  </p>

                  <div className={styles.pacePillsRow}>
                    <span className={styles.pacePill}>
                      <span>Speed:</span>
                      <strong className={styles.pacePillStrong}>
                        20 Jobs / Day (100+/Wk)
                      </strong>
                    </span>
                    <span className={styles.pacePill}>
                      <span>Portals:</span>
                      <strong className={styles.pacePillStrong}>
                        SEEK, LinkedIn, Indeed, Jora
                      </strong>
                    </span>
                    <span className={styles.pacePill}>
                      <span>Fee:</span>
                      <strong className={styles.pacePillStrong}>
                        0% Placement Fee
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Duration Commitment Selector */}
                <div className={styles.durationSection}>
                  <div className={styles.durationLabel}>
                    Select Application Sprint Duration:
                  </div>
                  <div className={styles.durationGrid}>
                    {Object.values(STANDARD_DURATIONS).map((dur) => {
                      const isActive = standardDuration === dur.weeks;
                      return (
                        <button
                          key={dur.weeks}
                          type="button"
                          onClick={() => setStandardDuration(dur.weeks)}
                          className={`${styles.durationBtn} ${
                            isActive ? styles.durationBtnActive : ""
                          }`}
                        >
                          {dur.saveTag && (
                            <span className={styles.durationSaveTag}>
                              {dur.saveTag}
                            </span>
                          )}
                          <span className={styles.durationTime}>
                            {dur.label}
                          </span>
                          <span className={styles.durationCost}>
                            AU${dur.price} ({dur.jobsCount})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Breakdown Card */}
                <div className={styles.breakdownCard}>
                  <div className={styles.breakdownRow}>
                    <span>Application Pace</span>
                    <span className={styles.breakdownRowStrong}>
                      20 Jobs/Day • 100+ Applied Every Week
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>Supported Portals</span>
                    <span className={styles.breakdownRowStrong}>
                      SEEK, LinkedIn, Indeed &amp; Jora
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>ATS Resume &amp; Cover Letter</span>
                    <span className={styles.breakdownRowStrong}>
                      Tailored per Job (Included)
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>Placement / Success Fee</span>
                    <span className={styles.breakdownRowStrong}>
                      AU$0.00 (Zero Placement Cut)
                    </span>
                  </div>

                  {currentStandard.discountAmount > 0 && (
                    <div className={styles.breakdownRow}>
                      <span>Commitment Discount</span>
                      <span className={styles.discountBadge}>
                        -AU${currentStandard.discountAmount}
                      </span>
                    </div>
                  )}

                  <div className={styles.divider} />

                  <div className={styles.totalPriceRow}>
                    <span className={styles.totalLabel}>TOTAL AMOUNT</span>
                    <span className={styles.totalValue}>
                      <span className={styles.totalAmount}>
                        AU${currentStandard.price}
                      </span>
                      <span className={styles.totalCurrency}>AUD</span>
                    </span>
                  </div>

                  <div className={styles.savingsNote}>
                    {currentStandard.savingsNotice}
                  </div>
                </div>

                {/* Social Proof */}
                <div className={styles.socialProof}>
                  <span className={styles.pulseDot} aria-hidden="true" />
                  <span>
                    <strong>128 Australian job seekers</strong> enrolled in
                    Standard Plan this week
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handlePurchase}
                  className={styles.ctaButton}
                >
                  START STANDARD PLAN (AU${currentStandard.price})
                </button>
              </>
            )}

            {/* TAB 2: SUCCESS-BASED PLAN */}
            {selectedPlan === "success" && (
              <>
                <div className={styles.planHeaderBox}>
                  <div className={styles.planTopPill}>
                    Low Upfront Risk • Pay After Placement
                  </div>

                  <div className={styles.priceDisplay}>
                    <span className={styles.priceAmount}>AU$200</span>
                    <span className={styles.pricePeriod}>
                      fortnight onboarding fee
                    </span>
                  </div>

                  <div className={styles.successFeeNotice}>
                    + 2 Weeks Salary from 1st Month (Only After Placement)
                  </div>

                  <p className={styles.planDescText}>
                    Start with an affordable fortnight onboarding fee of{" "}
                    <strong>AU$200</strong>. We actively apply to 100+ jobs/week
                    (20 jobs/day), optimize your profiles, and conduct mock
                    interviews. You only pay the placement fee (2 weeks salary
                    from your 1st month) after you get hired and receive your
                    paycheck!
                  </p>

                  <div className={styles.pacePillsRow}>
                    <span className={styles.pacePill}>
                      <span>Speed:</span>
                      <strong className={styles.pacePillStrong}>
                        20 Jobs / Day (100+/Wk)
                      </strong>
                    </span>
                    <span className={styles.pacePill}>
                      <span>Interview Prep:</span>
                      <strong className={styles.pacePillStrong}>
                        Mock Sessions Conducted
                      </strong>
                    </span>
                    <span className={styles.pacePill}>
                      <span>Fee:</span>
                      <strong className={styles.pacePillStrong}>
                        Pay After Placement
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Breakdown Card */}
                <div className={styles.breakdownCard}>
                  <div className={styles.breakdownRow}>
                    <span>Fortnight Onboarding Fee</span>
                    <span className={styles.breakdownRowStrong}>
                      AU$200.00
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>Weekly Job Applications</span>
                    <span className={styles.breakdownRowStrong}>
                      100+ Jobs / Week (20 Jobs / Day)
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>Supported Portals</span>
                    <span className={styles.breakdownRowStrong}>
                      SEEK, LinkedIn, Indeed &amp; Jora
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>Interview Coaching &amp; Prep</span>
                    <span className={styles.breakdownRowStrong}>
                      Mock Sessions Conducted (Included)
                    </span>
                  </div>

                  <div className={styles.breakdownRow}>
                    <span>After Placement Fee</span>
                    <span className={styles.breakdownRowStrong}>
                      2 Weeks Salary (from 1st Month)
                    </span>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.totalPriceRow}>
                    <span className={styles.totalLabel}>DUE TODAY</span>
                    <span className={styles.totalValue}>
                      <span className={styles.totalAmount}>AU$200</span>
                      <span className={styles.totalCurrency}>AUD</span>
                    </span>
                  </div>

                  <div className={styles.savingsNote}>
                    NO PLACEMENT, NO SUCCESS FEE • LOW UPFRONT COMMITMENT
                  </div>
                </div>

                {/* Social Proof */}
                <div className={styles.socialProof}>
                  <span className={styles.pulseDot} aria-hidden="true" />
                  <span>
                    <strong>94 Australian professionals</strong> secured offers
                    through Success-Based support
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handlePurchase}
                  className={styles.ctaButton}
                >
                  APPLY FOR SUCCESS-BASED PLAN (AU$200)
                </button>
              </>
            )}

            {/* Trust Info Bar (Clean Text Only, No Icons) */}
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <span className={styles.trustTitle}>Secure Payment</span>
                <span className={styles.trustSub}>100% Safe (Stripe AU)</span>
              </div>

              <div className={styles.trustItem}>
                <span className={styles.trustTitle}>Application Proof</span>
                <span className={styles.trustSub}>Daily Screenshots</span>
              </div>

              <div className={styles.trustItem}>
                <span className={styles.trustTitle}>Need Help?</span>
                <span className={styles.trustSub}>24/7 AU WhatsApp</span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD — WHAT'S INCLUDED (Clean Editorial Typography, No Icons) */}
          <div className={styles.rightCard}>
            <div className={styles.includedBadge}>
              <span className={styles.includedDot} />
              <span>Premium Career Infrastructure</span>
            </div>

            <h3 className={styles.includedHeading}>What&apos;s Included</h3>

            <p className={styles.includedSubtitle}>
              Every plan includes end-to-end hands-on support across the
              Australian job market.
            </p>

            <div className={styles.servicesList}>
              {INCLUDED_SERVICES.map((service) => (
                <div key={service.id} className={styles.serviceRow}>
                  <span className={styles.serviceIndex}>{service.id}</span>
                  <div className={styles.serviceInfo}>
                    <h4 className={styles.serviceTitle}>{service.title}</h4>
                    <p className={styles.serviceDesc}>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
