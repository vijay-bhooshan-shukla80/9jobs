"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardCheck,
  Contact,
  CreditCard,
  FileCheck2,
  FileSignature,
  MessageCircle,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import styles from "./JobSupportProcess.module.css";

// Vector icons (42x42 / 38x38)
function ReadyToStartCheckIcon({ color = "#84cc16" }) {
  return (
    <svg width="42" height="42" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="16.5" stroke={color} strokeWidth="1.2" strokeDasharray="2.5 2.5" opacity="0.8" />
      <circle cx="18" cy="18" r="13" fill={color} />
      <path d="M12.5 18L16.2 21.7L23.5 14.5" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OnboardingClipboardIcon({ color = "#22c55e" }) {
  return (
    <svg width="42" height="42" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="7" y="6" width="18" height="24" rx="2.5" stroke={color} strokeWidth="2.2" />
      <path d="M12 4h8a1.5 1.5 0 0 1 1.5 1.5V7H10.5V5.5A1.5 1.5 0 0 1 12 4Z" fill="#ffffff" stroke={color} strokeWidth="1.8" />
      <path d="M11 12h10M11 16h10M11 20h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="25" r="5.5" fill="#ffffff" stroke={color} strokeWidth="2" />
      <path d="m22.8 25 1.6 1.6 3.6-3.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppBubbleIcon({ color = "#166534" }) {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.762.455 3.486 1.325 5.006L2 22l5.127-1.305a9.948 9.948 0 0 0 4.877 1.31h.005c5.52 0 10-4.48 10-10.001C22.009 6.48 17.524 2 12.004 2zm5.122 13.626c-.225.63-1.306 1.205-1.791 1.25-.432.04-1.002.062-2.909-.723-2.437-1.002-3.993-3.483-4.113-3.644-.12-.16-.98-1.307-.98-2.493 0-1.186.621-1.768.841-2.009.22-.24.48-.301.641-.301h.461c.12 0 .28-.04.441.321.16.361.54 1.323.591 1.423.05.1.09.221.02.361-.07.14-.15.301-.26.422-.11.12-.22.25-.32.36-.11.12-.23.25-.09.492.14.241.621 1.022 1.332 1.654.912.812 1.683 1.063 1.923 1.183.24.12.381.1.521-.06.14-.161.601-.702.762-.942.16-.24.32-.2.54-.12.22.08 1.4.661 1.64.781.24.12.4.18.46.28.06.1.06.582-.16 1.212z" />
    </svg>
  );
}

function TargetArrowIcon({ color = "#eab308" }) {
  return (
    <svg width="42" height="42" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="18" r="14" />
      <circle cx="18" cy="18" r="9" />
      <circle cx="18" cy="18" r="4" />
      <circle cx="18" cy="18" r="1.5" fill={color} />
      <path d="M23 13L29 7" strokeWidth="2.4" />
      <path d="M25 7H29V11" strokeWidth="2.2" />
    </svg>
  );
}

function InterviewSceneIcon({ color = "#f97316" }) {
  return (
    <svg width="42" height="42" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M9 10h6" strokeWidth="2.2" />
      <path d="M6 24c0-3.3 2.7-6 6-6h1" />
      <rect x="13" y="19" width="6" height="8" rx="1" fill="#ffffff" stroke={color} strokeWidth="1.6" />
      <path d="M15 22h2M15 24h2" strokeWidth="1.4" />
      <circle cx="25" cy="15" r="3.5" />
      <path d="M20.5 25c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <path d="M18 7h6a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-3l-2.5 2v-2h-0.5A1.5 1.5 0 0 1 18 10.5v-2A1.5 1.5 0 0 1 18 7Z" fill="#ffffff" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

function EmploymentGiftIcon({ color = "#ef4444" }) {
  return (
    <svg width="42" height="42" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="16" width="20" height="13" rx="2" fill="#ffffff" />
      <rect x="6" y="12" width="24" height="5" rx="1.5" fill="#ffffff" />
      <path d="M18 12v17" strokeWidth="2.4" />
      <path d="M18 12c-2-3.5-6-3-5-.5s4.5 1.5 5 .5Z" strokeWidth="1.8" />
      <path d="M18 12c2-3.5 6-3 5-.5s-4.5 1.5-5 .5Z" strokeWidth="1.8" />
    </svg>
  );
}

// 6 process steps with exact enriched details matching Reference Image
const stepsData = [
  {
    number: "01",
    title: "Ready to Start",
    headlineLead: "Ready to Start",
    headlineAccent: "Your Journey?",
    desc: "Client confirms they are ready to proceed with our Australian job support program.",
    benefits: [["Faster Applications", Rocket], ["Dedicated Support", ShieldCheck], ["Better Opportunities", BarChart3]],
    icon: ReadyToStartCheckIcon,
    accent: "#84cc16",
    halo: "#bade57",
    glow: "rgba(132, 204, 22, 0.45)",
  },
  {
    number: "02",
    title: "Onboarding",
    headlineLead: "Smooth",
    headlineAccent: "Onboarding",
    desc: "We send the Agreement & Invoice. The client signs and completes payment.",
    benefits: [["Clear Agreement", FileSignature], ["Secure Payment", CreditCard], ["Quick Setup", ClipboardCheck]],
    icon: OnboardingClipboardIcon,
    accent: "#22c55e",
    halo: "#7ab796",
    glow: "rgba(34, 197, 94, 0.45)",
  },
  {
    number: "03",
    title: "Profile Setup & Optimisation",
    headlineLead: "Profile Setup &",
    headlineAccent: "Optimisation",
    desc: "Dedicated WhatsApp group created, details collected, Resume/CV and profiles optimised.",
    benefits: [["WhatsApp Support", MessageCircle], ["ATS Resume", FileCheck2], ["Stronger Profile", Contact]],
    icon: WhatsAppBubbleIcon,
    accent: "#166534",
    halo: "#457f62",
    glow: "rgba(22, 101, 52, 0.45)",
  },
  {
    number: "04",
    title: "Active Job Search",
    headlineLead: "Active Job",
    headlineAccent: "Search",
    desc: "20+ targeted applications daily, with regular updates shared in your WhatsApp group.",
    benefits: [["Targeted Search", Search], ["Daily Applications", Send], ["Live Updates", BellRing]],
    icon: TargetArrowIcon,
    accent: "#eab308",
    halo: "#f2b84b",
    glow: "rgba(234, 179, 8, 0.45)",
  },
  {
    number: "05",
    title: "Interview Opportunities",
    headlineLead: "Interview",
    headlineAccent: "Opportunities",
    desc: "When an interview opportunity comes in, we immediately inform and coordinate with you.",
    benefits: [["Fast Coordination", CalendarCheck], ["Personal Guidance", Users], ["Better Preparation", BadgeCheck]],
    icon: InterviewSceneIcon,
    accent: "#f97316",
    halo: "#f07c52",
    glow: "rgba(249, 115, 22, 0.45)",
  },
  {
    number: "06",
    title: "Employment",
    headlineLead: "Secure Your",
    headlineAccent: "Employment",
    desc: "You secure a suitable job opportunity, completing the journey to your dream career.",
    benefits: [["Right Opportunity", BriefcaseBusiness], ["Career Success", Trophy], ["New Beginning", Sparkles]],
    icon: EmploymentGiftIcon,
    accent: "#ef4444",
    halo: "#e84c4c",
    glow: "rgba(239, 68, 68, 0.45)",
  },
];

// Hexagon clusters across the entire section
const layer1Hexagons = [[50,90,38],[95,64,38],[95,142,38],[50,168,38],[140,90,38],[140,168,38],[260,280,42],[305,254,42],[305,334,42],[260,360,42],[350,280,42],[395,254,42],[50,560,38],[95,534,38],[95,612,38],[50,638,38],[140,560,38],[140,638,38]];
const layer2Hexagons = [[260,100,38],[305,74,38],[305,152,38],[260,178,38],[350,100,38],[395,74,38],[395,152,38],[45,330,44],[90,304,44],[90,384,44],[45,410,44],[135,330,44],[180,304,44],[260,600,40],[305,574,40],[305,652,40],[260,678,40],[350,600,40],[395,574,40]];
const layer3Hexagons = [[185,42,36],[230,16,36],[485,120,38],[530,94,38],[530,172,38],[485,198,38],[460,340,42],[505,314,42],[505,394,42],[460,420,42],[550,340,42],[460,560,38],[505,534,38],[505,612,38],[460,638,38],[550,560,38],[185,710,36],[230,684,36]];

function createHexagonPath(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = +(cx + r * Math.cos(angle)).toFixed(1);
    const y = +(cy + r * Math.sin(angle)).toFixed(1);
    points.push(x + "," + y);
  }
  return "M " + points.join(" L ") + " Z";
}

// Six process icons placed evenly around the outer orbit.
const WHEEL_NODES = stepsData.map((step, i) => ({
  nodeIndex: i,
  stepIndex: i,
  angleDeg: i * 60,
  step,
}));

// Geometry
const TRACK_RADIUS = 170;
const BADGE_RADIUS = 310;
const TOTAL_STEPS = stepsData.length;
const STEP_ROTATION_DEG = 60;
const TOTAL_ROTATION_DEG = (TOTAL_STEPS - 1) * STEP_ROTATION_DEG;

// Wheel badge subcomponent
function WheelStepBadge({ node, wheelRotation, counterRotation, onJump, activeVirtualStep }) {
  const { step, angleDeg, nodeIndex } = node;
  const IconComponent = step.icon;
  const rad = (angleDeg * Math.PI) / 180;
  const posX = +(BADGE_RADIUS * Math.cos(rad)).toFixed(2);
  const posY = +(BADGE_RADIUS * Math.sin(rad)).toFixed(2);

  const blurFilter = useTransform(wheelRotation, (rot) => {
    const currentAngle = (((angleDeg + rot) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(currentAngle);
    if (absDist <= 12) return "blur(0px)";
    if (absDist <= 72) return "blur(3px)";
    return "blur(5px)";
  });

  const opacity = useTransform(wheelRotation, (rot) => {
    const currentAngle = (((angleDeg + rot) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(currentAngle);
    if (absDist <= 12) return 1;
    if (absDist <= 72) return 0.3;
    return 0.12;
  });

  const scale = useTransform(wheelRotation, (rot) => {
    const currentAngle = (((angleDeg + rot) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(currentAngle);
    if (absDist <= 12) return 1.16;
    return 0.82;
  });

  const isActive = (activeVirtualStep % TOTAL_STEPS) === nodeIndex;

  return (
    <motion.div
      className={styles.wheelBadge}
      style={{
        left: posX,
        top: posY,
        x: "-50%",
        y: "-50%",
        width: 104,
        height: 104,
        background: step.halo,
        boxShadow: isActive
          ? "0 22px 48px -4px " + step.glow + ", 0 0 0 6px rgba(255, 255, 255, 0.82), 0 8px 18px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.7)"
          : "0 8px 18px -2px rgba(0,0,0,0.08)",
        filter: blurFilter,
        opacity,
        scale,
        zIndex: isActive ? 10 : 4,
      }}
      onClick={() => onJump(nodeIndex)}
    >
      <motion.div
        style={{
          rotate: counterRotation,
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          className={styles.badgeInner}
          style={{
            width: 80,
            height: 80,
          }}
        >
          <IconComponent color={step.accent} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function WheelTrackNode({ node, wheelRotation, activeVirtualStep }) {
  const { step, angleDeg, nodeIndex } = node;
  const rad = (angleDeg * Math.PI) / 180;
  const xNode = +(TRACK_RADIUS * Math.cos(rad)).toFixed(2);
  const yNode = +(TRACK_RADIUS * Math.sin(rad)).toFixed(2);
  const xBadgeEdge = +((BADGE_RADIUS - 52) * Math.cos(rad)).toFixed(2);
  const yBadgeEdge = +((BADGE_RADIUS - 52) * Math.sin(rad)).toFixed(2);
  const isActive = (activeVirtualStep % TOTAL_STEPS) === nodeIndex;

  const opacity = useTransform(wheelRotation, (rot) => {
    const currentAngle = (((angleDeg + rot) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(currentAngle);
    if (absDist <= 12) return 1;
    if (absDist <= 72) return 0.34;
    return 0.16;
  });

  const filter = useTransform(wheelRotation, (rot) => {
    const currentAngle = (((angleDeg + rot) % 360) + 540) % 360 - 180;
    return Math.abs(currentAngle) <= 12 ? "blur(0px)" : "blur(2px)";
  });

  return (
    <motion.g style={{ opacity, filter }}>
      <line
        x1={xNode}
        y1={yNode}
        x2={xBadgeEdge}
        y2={yBadgeEdge}
        stroke={step.accent}
        strokeWidth={isActive ? 3 : 2}
        strokeLinecap="round"
      />
      <circle
        cx={xNode}
        cy={yNode}
        r={isActive ? 21 : 15}
        fill={step.accent}
        opacity={isActive ? 0.2 : 0.1}
      />
      <circle
        cx={xNode}
        cy={yNode}
        r={isActive ? 13 : 10}
        fill="#ffffff"
        stroke={step.accent}
        strokeWidth={isActive ? 4 : 3}
        style={{ filter: isActive ? "drop-shadow(0 0 8px " + step.glow + ")" : "none" }}
      />
    </motion.g>
  );
}

export default function JobSupportProcessSection() {
  const containerRef = useRef(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeVirtualStep, setActiveVirtualStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const wheelRotation = useTransform(scrollYProgress, [0, 1], [0, -TOTAL_ROTATION_DEG]);
  const counterRotation = useTransform(wheelRotation, (r) => -r);

  // Subtle Parallax depth on hexagon background boxes
  const hexParallax = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const virtualIndex = Math.round(latest * (TOTAL_STEPS - 1));
    const stepIdx = Math.min(virtualIndex, TOTAL_STEPS - 1);
    setActiveVirtualStep(virtualIndex);
    setActiveStepIndex(stepIdx);
  });

  const handleJumpToStep = (nodeIdx) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetStep = nodeIdx % TOTAL_STEPS;
    const targetScrollY = containerTop + (targetStep / (TOTAL_STEPS - 1)) * totalDistance;
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  const currentStep = stepsData[activeStepIndex];
  return (
    <section ref={containerRef} className={styles.scrollSectionWrapper} id="job-support-process">
      <div className={styles.stickyViewport}>
        <header className={styles.header}>
          <h2 className={styles.heading}>
            OUR JOB <span className={styles.supportAccent}>SUPPORT</span> PROCESS
          </h2>
        </header>

        {/* 6,6 Split Full-Width Grid (>= 1024px) */}
        <div className={styles.fullScreenStage}>
          {/* LEFT 6 (50%): Tyre Wheel Stage with Animated Hexagon Boxes */}
          <div className={styles.wheelColumn}>
            {/* Animated Hexagon Boxes spreading across the entire section with floating & parallax */}
            <motion.svg
              className={styles.hexagonBg}
              style={{ y: hexParallax }}
              viewBox="0 0 750 750"
              fill="none"
              aria-hidden="true"
            >
              {/* Layer 1 - Smooth Continuous Floating Cluster A */}
              <motion.g
                className={styles.hexLayer1}
                animate={{
                  y: [0, -14, 0, 12, 0],
                  x: [0, 7, 0, -5, 0],
                  rotate: [0, 1, 0, -0.8, 0],
                }}
                transition={{
                  duration: 8.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "200px 300px" }}
              >
                {layer1Hexagons.map(([cx, cy, r], idx) => (
                  <path
                    key={"hex-l1-" + idx}
                    d={createHexagonPath(cx, cy, r)}
                    stroke="rgba(0, 0, 0, 0.045)"
                    strokeWidth="0.95"
                    fill="none"
                  />
                ))}
              </motion.g>

              {/* Layer 2 - Smooth Continuous Floating Cluster B */}
              <motion.g
                className={styles.hexLayer2}
                animate={{
                  y: [0, 13, 0, -11, 0],
                  x: [0, -8, 0, 6, 0],
                  rotate: [0, -1.2, 0, 1, 0],
                }}
                transition={{
                  duration: 10.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "320px 420px" }}
              >
                {layer2Hexagons.map(([cx, cy, r], idx) => (
                  <path
                    key={"hex-l2-" + idx}
                    d={createHexagonPath(cx, cy, r)}
                    stroke="rgba(0, 0, 0, 0.04)"
                    strokeWidth="0.95"
                    fill="none"
                  />
                ))}
              </motion.g>

              {/* Layer 3 - Smooth Continuous Floating Cluster C */}
              <motion.g
                className={styles.hexLayer3}
                animate={{
                  y: [0, -10, 0, 12, 0],
                  x: [0, -5, 0, 7, 0],
                  scale: [1, 1.02, 1, 0.985, 1],
                }}
                transition={{
                  duration: 13,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "160px 580px" }}
              >
                {layer3Hexagons.map(([cx, cy, r], idx) => (
                  <path
                    key={"hex-l3-" + idx}
                    d={createHexagonPath(cx, cy, r)}
                    stroke="rgba(0, 0, 0, 0.035)"
                    strokeWidth="0.9"
                    fill="none"
                  />
                ))}
              </motion.g>
            </motion.svg>

            {/* SINGLE CONCENTRIC ANCHOR for Tyre Arc, Hub, and Rotating Badges */}
            <div className={styles.wheelStageAnchor}>
              {/* Full outer orbit */}
              <svg
                style={{
                  position: "absolute",
                  left: -300,
                  top: -300,
                  width: 600,
                  height: 600,
                  pointerEvents: "none",
                  zIndex: 2,
                  overflow: "visible",
                }}
                viewBox="-300 -300 600 600"
                fill="none"
              >
                <circle
                  cx="0"
                  cy="0"
                  r={TRACK_RADIUS}
                  stroke="#65c500"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.72"
                />
              </svg>

              {/* 9Jobs 3D Hub Disc (250px) */}
              <div
                className={styles.hubCircle}
                style={{
                  position: "absolute",
                  left: -130,
                  top: -130,
                  width: 260,
                  height: 260,
                  zIndex: 5,
                }}
              >
                <Image
                  src="/job-process-logo.png"
                  alt="9Jobs Job Application Service"
                  width={235}
                  height={235}
                  priority
                  className={styles.hubImg}
                />
              </div>

              {/* Rotating Wheel Pivot */}
              <motion.div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  rotate: wheelRotation,
                  zIndex: 3,
                }}
              >
                <svg
                  style={{
                    position: "absolute",
                    left: -380,
                    top: -380,
                    width: 760,
                    height: 760,
                    pointerEvents: "none",
                    overflow: "visible",
                  }}
                  viewBox="-380 -380 760 760"
                  aria-hidden="true"
                >
                  {WHEEL_NODES.map((node) => (
                    <WheelTrackNode
                      key={"track-node-" + node.nodeIndex}
                      node={node}
                      wheelRotation={wheelRotation}
                      activeVirtualStep={activeVirtualStep}
                    />
                  ))}
                </svg>

                {WHEEL_NODES.map((node) => (
                  <WheelStepBadge
                    key={"wheel-badge-" + node.nodeIndex}
                    node={node}
                    wheelRotation={wheelRotation}
                    counterRotation={counterRotation}
                    onJump={handleJumpToStep}
                    activeVirtualStep={activeVirtualStep}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* RIGHT 6 (50%): Text Content Column */}
          <div className={styles.textColumn}>
            <AnimatePresence mode="wait">
              <motion.div
                key={"content-" + currentStep.number}
                initial={{ opacity: 0, x: 26, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.97 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className={styles.activeTextWrapper}
              >
                <div className={styles.trustPill}>
                  <span aria-hidden="true" />
                  Trusted by Job Seekers
                </div>

                <h3 className={styles.activeTitle}>
                  <span>{currentStep.headlineLead}</span>
                  <span className={styles.activeTitleAccent}>{currentStep.headlineAccent}</span>
                </h3>

                <p className={styles.activeDesc}>
                  <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                  <span className={styles.descText}>{currentStep.desc}</span>
                  <span className={styles.quoteMark} aria-hidden="true">&rdquo;</span>
                </p>

                <div className={styles.stepBenefits}>
                  {currentStep.benefits.map(([label, BenefitIcon]) => (
                    <div className={styles.stepBenefit} key={label}>
                      <span className={styles.stepBenefitIcon}>
                        <BenefitIcon aria-hidden="true" />
                      </span>
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
