"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Building2,
  Truck,
  Briefcase,
  Layers,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "./HomeMotion";

const EASE = [0.22, 1, 0.36, 1];

const industriesData = [
  {
    id: "it",
    name: "IT & Software",
    icon: Code2,
    clientCount: 18,
    subcategories: [
      { name: "Software & Web Development", count: 7 },
      { name: "Cloud & DevOps Infrastructure", count: 5 },
      { name: "Data Analytics & AI", count: 4 },
      { name: "IT Support & Cybersecurity", count: 2 },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: Cpu,
    clientCount: 14,
    subcategories: [
      { name: "Civil & Structural Engineering", count: 5 },
      { name: "Mechanical & Electrical Systems", count: 5 },
      { name: "Project Engineering & Planning", count: 4 },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    icon: Building2,
    clientCount: 16,
    subcategories: [
      { name: "Site Supervision & Management", count: 7 },
      { name: "Estimators & Quantity Surveyors", count: 5 },
      { name: "Trades & Project Coordinators", count: 4 },
    ],
  },
  {
    id: "logistics",
    name: "Logistics & Operations",
    icon: Truck,
    clientCount: 12,
    subcategories: [
      { name: "Warehouse & Supply Chain", count: 5 },
      { name: "Fleet & Distribution", count: 4 },
      { name: "Procurement & Inventory", count: 3 },
    ],
  },
  {
    id: "business",
    name: "Business & Corporate",
    icon: Briefcase,
    clientCount: 15,
    subcategories: [
      { name: "Accounting & Finance", count: 6 },
      { name: "HR & Administration", count: 4 },
      { name: "Sales & Marketing", count: 4 },
      { name: "Consulting", count: 1 },
    ],
  },
  {
    id: "other",
    name: "Other Industries",
    icon: Layers,
    clientCount: 10,
    subcategories: [
      { name: "Healthcare & Medical", count: 4 },
      { name: "Customer Support & Retail", count: 4 },
      { name: "Education & Training", count: 2 },
    ],
  },
];

export default function IndustryAccordion() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <section className="fj-section fj-home-section--grid fj-industry-section" id="industries">
      <div className="fj-container">
        <Reveal as="div" direction="up" distance={20}>
          <div className="fj-section-head fj-industry-head">
            <span className="fj-label">Client Track Record</span>
            <h2>
              Check If We&apos;ve Worked with Your{" "}
              <span className="heading-mark">Industry.</span>
            </h2>
            <p>
              Choose your industry below to explore our verified placement experience across Australia.
            </p>
          </div>
        </Reveal>

        <Reveal as="div" direction="up" distance={24} delay={0.1}>
          <div className="fj-industry-list" role="region" aria-label="Industry client breakdown">
            {industriesData.map((item) => {
              const isOpen = openId === item.id;
              const IconComponent = item.icon;

              return (
                <div
                  key={item.id}
                  className={`fj-industry-card${isOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="fj-industry-trigger"
                    aria-expanded={isOpen}
                    aria-controls={`industry-panel-${item.id}`}
                  >
                    <div className="fj-industry-trigger-left">
                      <div className="fj-industry-icon-box">
                        <IconComponent size={20} strokeWidth={2.2} />
                      </div>
                      <span className="fj-industry-title">{item.name}</span>
                    </div>

                    <div className="fj-industry-trigger-right">
                      <span className="fj-industry-count-badge">
                        <span className="fj-industry-dot" />
                        {item.clientCount} Clients
                      </span>
                      <motion.span
                        className="fj-industry-chevron-btn"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        aria-hidden="true"
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`industry-panel-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="fj-industry-content">
                          <div className="fj-industry-sub-grid">
                            {item.subcategories.map((sub) => (
                              <div key={sub.name} className="fj-industry-sub-card">
                                <span className="fj-industry-sub-title">{sub.name}</span>
                                <span className="fj-industry-sub-num">
                                  {sub.count} {sub.count === 1 ? "Client" : "Clients"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="fj-industry-meta-footer">
            <CheckCircle2 size={16} />
            <span>Verified client placements · Last updated: 27th August 2026</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
