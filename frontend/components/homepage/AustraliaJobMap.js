"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  MapPin,
  ArrowRight,
  ExternalLink,
  Building2,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

// Regional & State Data with Corridors and Pricing
const locationAreas = {
  vic: {
    key: "vic",
    title: "Melbourne Metro & Victorian Corridors",
    stateName: "Victoria",
    stateCode: "VIC",
    stepNo: "01",
    stepColor: "green",
    stepClass: "step-vic",
    stepTitle: "VICTORIA · MELBOURNE",
    stepDesc: "CBD, Docklands, Richmond, Southbank · FinTech & Enterprise IT",
    slug: "melbourne",
    pricing: {
      standard: "$149 AUD",
      fortnight: "$199 AUD",
      placement: "2 Weeks Salary (1st Month)",
      quota: "20 Jobs/Day Applied · 100+/Wk",
    },
    platforms: "SEEK Australia · LinkedIn AU · Indeed AU · Jora",
    corridors: [
      { name: "Melbourne CBD", desc: "Banking, FinTech, Corporate Advisory & Big 4 Consulting", slug: "melbourne" },
      { name: "Docklands Precinct", desc: "Enterprise Platforms, Cloud & Multinational HQs", slug: "melbourne" },
      { name: "Richmond & Cremorne", desc: "Tech Unicorns, Silicon Yarra Startups & Scaleups", slug: "melbourne" },
      { name: "Southbank & St Kilda Rd", desc: "Corporate Operations, Commercial & Professional Services", slug: "melbourne" },
      { name: "Clayton & Monash Hub", desc: "HealthTech, Robotics, Advanced Engineering & Hardware", slug: "melbourne" },
      { name: "Geelong Regional Corridor", desc: "NDIS HQ, TAC, Healthcare Logistics & Advanced Materials", slug: "geelong" },
    ],
  },
  nsw: {
    key: "nsw",
    title: "Sydney Metro & NSW Financial Corridor",
    stateName: "New South Wales",
    stateCode: "NSW",
    stepNo: "02",
    stepColor: "cyan",
    stepClass: "step-nsw",
    stepTitle: "NEW SOUTH WALES · SYDNEY",
    stepDesc: "CBD, North Sydney, Parramatta · Investment Banking & Cloud",
    slug: "sydney",
    pricing: {
      standard: "$149 AUD",
      fortnight: "$199 AUD",
      placement: "2 Weeks Salary (1st Month)",
      quota: "20 Jobs/Day Applied · 100+/Wk",
    },
    platforms: "SEEK Australia · LinkedIn AU · Indeed AU · Jora",
    corridors: [
      { name: "Sydney CBD & Martin Place", desc: "National Financial Capital, Global Investment Banks & FinTech", slug: "sydney" },
      { name: "Parramatta CBD", desc: "Western Sydney Commercial Hub & Enterprise Services", slug: "sydney" },
      { name: "North Sydney & St Leonards", desc: "Telecom, Cloud Infrastructure & Corporate Centers", slug: "sydney" },
      { name: "Surry Hills & Pyrmont", desc: "Product Engineering, Design Tech, Media & Creative Startups", slug: "sydney" },
      { name: "Macquarie Park Innovation", desc: "Biomedical, Pharmaceutical Majors & Global Tech Campuses", slug: "sydney" },
      { name: "Barangaroo Tech Precinct", desc: "Global Software Platforms, Trading Firms & Top Tier Law", slug: "sydney" },
    ],
  },
  qld: {
    key: "qld",
    title: "Brisbane & Southeast Queensland Corridor",
    stateName: "Queensland",
    stateCode: "QLD",
    stepNo: "03",
    stepColor: "pink",
    stepClass: "step-qld",
    stepTitle: "QUEENSLAND · BRISBANE",
    stepDesc: "CBD, Fortitude Valley, Gold Coast · HealthTech & Engineering",
    slug: "brisbane",
    pricing: {
      standard: "$149 AUD",
      fortnight: "$199 AUD",
      placement: "2 Weeks Salary (1st Month)",
      quota: "20 Jobs/Day Applied · 100+/Wk",
    },
    platforms: "SEEK Australia · LinkedIn AU · Indeed AU · Jora",
    corridors: [
      { name: "Brisbane CBD & Golden Triangle", desc: "Energy & Resources HQs, Corporate Services & Legal", slug: "brisbane" },
      { name: "Fortitude Valley Tech Precinct", desc: "Digital Agencies, High-Growth SaaS & Innovation Labs", slug: "brisbane" },
      { name: "South Brisbane & West End", desc: "Biomedical, Creative Studios & Consulting Practices", slug: "brisbane" },
      { name: "Gold Coast Innovation Corridor", desc: "HealthTech, SportsTech & Remote Global Tech Hubs", slug: "brisbane" },
      { name: "Sunshine Coast Tech Corridor", desc: "Subsea Broadband Landing & CleanTech Startups", slug: "brisbane" },
      { name: "Milton & Toowong", desc: "Engineering Consultancies, Infrastructure & Enterprise Tech", slug: "brisbane" },
    ],
  },
  wasa: {
    key: "wasa",
    title: "Perth, Adelaide & Western/Southern Corridors",
    stateName: "WA & South Australia",
    stateCode: "WA / SA",
    stepNo: "04",
    stepColor: "orange",
    stepClass: "step-wasa",
    stepTitle: "WA & SA · PERTH & ADELAIDE",
    stepDesc: "Perth CBD, Adelaide CBD · Mining Resources, Tech & AgTech",
    slug: "perth",
    pricing: {
      standard: "$149 AUD",
      fortnight: "$199 AUD",
      placement: "2 Weeks Salary (1st Month)",
      quota: "20 Jobs/Day Applied · 100+/Wk",
    },
    platforms: "SEEK Australia · LinkedIn AU · Indeed AU · Jora",
    corridors: [
      { name: "Perth CBD & St Georges Tce", desc: "Mining Majors, Global Energy & ASX 100 Corporate HQs", slug: "perth" },
      { name: "West Perth Resource Hub", desc: "Exploration, Mining Engineering & Technical Services", slug: "perth" },
      { name: "Adelaide CBD & Lot Fourteen", desc: "Australian Space Agency, AI & DeepTech Innovation", slug: "adelaide" },
      { name: "Mawson Lakes Tech Hub", desc: "Systems Engineering, Cyber & Advanced Technology", slug: "adelaide" },
      { name: "Fremantle & Kwinana Industrial", desc: "Maritime Logistics, Port Operations & Clean Energy Hub", slug: "perth" },
      { name: "Tonsley Innovation District", desc: "Renewables, Advanced Manufacturing & Medical Devices", slug: "adelaide" },
    ],
  },
};

// Client statistics per state / territory (Fixed <= 10 clients, no fake high numbers)
const clientStatsByState = {
  vic: {
    code: "VIC",
    name: "Victoria",
    hub: "Melbourne Metro & VIC",
    totalClients: 9,
    industries: [
      { name: "IT & Software", count: 3 },
      { name: "Logistics & Operations", count: 2 },
      { name: "Construction & Trades", count: 2 },
      { name: "Finance & Corporate", count: 1 },
      { name: "Engineering", count: 1 },
    ],
    anchor: { x: 75, y: 78 },
  },
  nsw: {
    code: "NSW",
    name: "New South Wales",
    hub: "Sydney Metro & NSW",
    totalClients: 10,
    industries: [
      { name: "Banking & FinTech", count: 3 },
      { name: "Cloud & IT", count: 3 },
      { name: "Construction", count: 2 },
      { name: "Logistics & Supply Chain", count: 1 },
      { name: "Professional Services", count: 1 },
    ],
    anchor: { x: 80, y: 64 },
  },
  qld: {
    code: "QLD",
    name: "Queensland",
    hub: "Brisbane & Gold Coast",
    totalClients: 8,
    industries: [
      { name: "Construction & Mining", count: 2 },
      { name: "IT & Digital", count: 2 },
      { name: "HealthTech & Medical", count: 2 },
      { name: "Logistics & Operations", count: 1 },
      { name: "Engineering", count: 1 },
    ],
    anchor: { x: 74, y: 38 },
  },
  wa: {
    code: "WA",
    name: "Western Australia",
    hub: "Perth & Mining Corridors",
    totalClients: 7,
    industries: [
      { name: "Mining & Resources", count: 3 },
      { name: "Engineering & Technical", count: 2 },
      { name: "Logistics & Warehousing", count: 1 },
      { name: "IT & Systems", count: 1 },
    ],
    anchor: { x: 26, y: 48 },
  },
  sa: {
    code: "SA",
    name: "South Australia",
    hub: "Adelaide & Regional SA",
    totalClients: 6,
    industries: [
      { name: "IT & Cloud Systems", count: 3 },
      { name: "Advanced Manufacturing (Non-IT)", count: 2 },
      { name: "Healthcare & Medical (Non-IT)", count: 1 },
    ],
    anchor: { x: 53, y: 65 },
  },
  nt: {
    code: "NT",
    name: "Northern Territory",
    hub: "Darwin & Regional NT",
    totalClients: 2,
    industries: [
      { name: "IT Support & Systems", count: 1 },
      { name: "Logistics & Civil (Non-IT)", count: 1 },
    ],
    anchor: { x: 51, y: 26 },
  },
  tas: {
    code: "TAS",
    name: "Tasmania",
    hub: "Hobart & Regional TAS",
    totalClients: 3,
    industries: [
      { name: "Renewables & Maritime (Non-IT)", count: 1 },
      { name: "Healthcare & Community (Non-IT)", count: 1 },
      { name: "IT & Software Support", count: 1 },
    ],
    anchor: { x: 77, y: 88 },
  },
  act: {
    code: "ACT",
    name: "Australian Capital Territory",
    hub: "Canberra",
    totalClients: 4,
    industries: [
      { name: "Cyber & Cloud IT", count: 2 },
      { name: "Corporate Advisory (Non-IT)", count: 1 },
      { name: "Operations & Logistics (Non-IT)", count: 1 },
    ],
    anchor: { x: 81, y: 69 },
  },
};

// Search Autocomplete List
const searchLocations = [
  { name: "Melbourne CBD", state: "VIC", areaKey: "vic", slug: "melbourne" },
  { name: "Docklands", state: "VIC", areaKey: "vic", slug: "melbourne" },
  { name: "Richmond", state: "VIC", areaKey: "vic", slug: "melbourne" },
  { name: "Southbank", state: "VIC", areaKey: "vic", slug: "melbourne" },
  { name: "Clayton", state: "VIC", areaKey: "vic", slug: "melbourne" },
  { name: "Geelong", state: "VIC", areaKey: "vic", slug: "geelong" },
  { name: "Sydney CBD", state: "NSW", areaKey: "nsw", slug: "sydney" },
  { name: "Parramatta", state: "NSW", areaKey: "nsw", slug: "sydney" },
  { name: "North Sydney", state: "NSW", areaKey: "nsw", slug: "sydney" },
  { name: "Surry Hills", state: "NSW", areaKey: "nsw", slug: "sydney" },
  { name: "Barangaroo", state: "NSW", areaKey: "nsw", slug: "sydney" },
  { name: "Brisbane CBD", state: "QLD", areaKey: "qld", slug: "brisbane" },
  { name: "Fortitude Valley", state: "QLD", areaKey: "qld", slug: "brisbane" },
  { name: "Gold Coast", state: "QLD", areaKey: "qld", slug: "brisbane" },
  { name: "Perth CBD", state: "WA", areaKey: "wasa", slug: "perth" },
  { name: "West Perth", state: "WA", areaKey: "wasa", slug: "perth" },
  { name: "Fremantle", state: "WA", areaKey: "wasa", slug: "perth" },
  { name: "Adelaide CBD", state: "SA", areaKey: "wasa", slug: "adelaide" },
  { name: "Mawson Lakes", state: "SA", areaKey: "wasa", slug: "adelaide" },
];

export default function AustraliaJobMap() {
  const router = useRouter();
  const [selectedAreaKey, setSelectedAreaKey] = useState(null);
  const [hoveredAreaKey, setHoveredAreaKey] = useState("vic");
  const [hoveredStateKey, setHoveredStateKey] = useState("vic");
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const svgWrapRef = useRef(null);

  const activeArea = selectedAreaKey ? locationAreas[selectedAreaKey] : null;
  const currentStats = clientStatsByState[hoveredStateKey] || clientStatsByState.vic;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return searchLocations.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.state.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleOpenArea = (key) => {
    setSelectedAreaKey(key);
    setHoveredAreaKey(key);
  };

  const handleCloseArea = () => {
    setSelectedAreaKey(null);
  };

  const handleSelectSearch = (loc) => {
    setSearchQuery("");
    handleOpenArea(loc.areaKey);
  };

  // State highlight helper
  const isStateActive = (code) => {
    const key = hoveredStateKey || selectedAreaKey || hoveredAreaKey;
    if (code === "VIC" && (key === "vic" || key === "melbourne")) return true;
    if (code === "NSW" && (key === "nsw" || key === "sydney")) return true;
    if (code === "QLD" && (key === "qld" || key === "brisbane")) return true;
    if (code === "WA" && (key === "wa" || key === "wasa" || key === "perth")) return true;
    if (code === "SA" && (key === "sa" || key === "wasa" || key === "adelaide")) return true;
    if (code === "NT" && key === "nt") return true;
    if (code === "TAS" && key === "tas") return true;
    if (code === "ACT" && key === "act") return true;
    return false;
  };

  // State hover handlers
  const handleStateMouseEnter = (stateKey, e) => {
    setHoveredStateKey(stateKey);
    setIsCardVisible(true);

    const areaMapping = {
      vic: "vic",
      nsw: "nsw",
      qld: "qld",
      wa: "wasa",
      sa: "wasa",
    };
    if (areaMapping[stateKey]) {
      setHoveredAreaKey(areaMapping[stateKey]);
    }

    if (e && svgWrapRef.current) {
      const rect = svgWrapRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleWrapMouseMove = (e) => {
    if (!svgWrapRef.current) return;
    const rect = svgWrapRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleWrapMouseLeave = () => {
    setIsCardVisible(false);
  };

  const handleStepMouseEnter = (areaKey) => {
    setHoveredAreaKey(areaKey);
    const stateMap = { vic: "vic", nsw: "nsw", qld: "qld", wasa: "wa" };
    const sKey = stateMap[areaKey] || areaKey;
    setHoveredStateKey(sKey);
    setIsCardVisible(true);

    if (svgWrapRef.current && clientStatsByState[sKey]?.anchor) {
      const rect = svgWrapRef.current.getBoundingClientRect();
      const anchor = clientStatsByState[sKey].anchor;
      setTooltipPos({
        x: (anchor.x / 100) * rect.width,
        y: (anchor.y / 100) * rect.height,
      });
    }
  };

  const handleStepMouseLeave = () => {
    setIsCardVisible(false);
  };

  // Clamped tooltip style to keep card neatly inside wrap bounds
  const getClampedTooltipStyle = () => {
    if (!svgWrapRef.current) {
      return {
        left: `${tooltipPos.x}px`,
        top: `${tooltipPos.y}px`,
      };
    }
    const width = svgWrapRef.current.offsetWidth || 700;
    const cardWidth = 230;
    const cardHeight = 200;

    let left = tooltipPos.x;
    if (left - cardWidth / 2 < 12) {
      left = cardWidth / 2 + 12;
    } else if (left + cardWidth / 2 > width - 12) {
      left = width - cardWidth / 2 - 12;
    }

    let top = tooltipPos.y - 14;
    let translateY = "-100%";
    if (top - cardHeight < 10) {
      top = tooltipPos.y + 24;
      translateY = "0%";
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      transform: `translate(-50%, ${translateY})`,
    };
  };

  return (
    <div className="fj-infographic-shell">
      {/* TOPBAR HEADER (Corporate 9Jobs Theme) */}
      <div className="fj-info-topbar">
        <div className="fj-info-brand-block">
          <div className="fj-info-status-pill">
            <span className="fj-live-pulse-dot" />
            <span>Active Recruitment Hubs</span>
          </div>
          <div className="fj-info-title-row">
            <h3 className="fj-info-main-title">
              AUSTRALIA <span className="lime-txt">CAREER HUBS</span>
            </h3>
            <span className="fj-info-pill-badge">VERIFIED CORRIDORS</span>
          </div>
        </div>

        <div className="fj-info-top-actions">
          <div className="fj-info-search-input-wrap">
            <Search size={15} className="fj-info-search-icon" />
            <input
              type="text"
              className="fj-info-search-input"
              placeholder="Search Melbourne, Sydney, Perth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="fj-info-search-clear"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}

            {searchResults.length > 0 && (
              <div className="fj-info-search-results">
                {searchResults.map((loc) => (
                  <button
                    key={`${loc.name}-${loc.state}`}
                    type="button"
                    onClick={() => handleSelectSearch(loc)}
                    className="fj-info-search-item"
                  >
                    <span>{loc.name}</span>
                    <span className="fj-info-search-tag">{loc.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN SPLIT: CHEVRONS (LEFT) + AUSTRALIA MAP (RIGHT) */}
      <div className="fj-info-grid">
        {/* LEFT COLUMN: METRICS + 4 STEP CHEVRONS */}
        <div className="fj-info-left">
          {/* Key Metrics matching corporate theme */}
          <div className="fj-info-stats-card">
            <div className="fj-info-stat-box">
              <span className="fj-info-stat-icon">
                <CheckCircle2 size={16} />
              </span>
              <div className="fj-info-stat-text">
                <span className="fj-info-stat-lbl">DAILY PIPELINE</span>
                <span className="fj-info-stat-val">20 Jobs Applied / Day</span>
              </div>
            </div>
            <div className="fj-info-stat-box">
              <span className="fj-info-stat-icon">
                <TrendingUp size={16} />
              </span>
              <div className="fj-info-stat-text">
                <span className="fj-info-stat-lbl">WEEKLY VOLUME</span>
                <span className="fj-info-stat-val">100+ Applications / Wk</span>
              </div>
            </div>
          </div>

          {/* 4 Step Chevrons (Clean Corporate Typography, Zero Emojis) */}
          <div className="fj-info-steps-list">
            {Object.values(locationAreas).map((area) => {
              const isHovered = hoveredAreaKey === area.key;
              const isSelected = selectedAreaKey === area.key;

              return (
                <div
                  key={area.key}
                  className={`fj-info-step-card ${area.stepClass} ${isHovered || isSelected ? "is-active" : ""}`}
                  onMouseEnter={() => handleStepMouseEnter(area.key)}
                  onMouseLeave={handleStepMouseLeave}
                  onClick={() => handleOpenArea(area.key)}
                >
                  <div className="fj-info-step-badge">
                    <span>STEP</span>
                    <span>{area.stepNo}</span>
                  </div>
                  <div className="fj-info-step-content">
                    <span className="fj-info-step-tag">{area.stateCode}</span>
                    <div className="fj-info-step-meta">
                      <div className="fj-info-step-name">{area.stepTitle}</div>
                      <div className="fj-info-step-sub">{area.stepDesc}</div>
                    </div>
                    <span className="fj-info-step-arrow">➔</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: AUSTRALIA CONTINENT MAP */}
        <div className="fj-info-right">
          <div
            className="fj-info-svg-wrap"
            ref={svgWrapRef}
            onMouseMove={handleWrapMouseMove}
            onMouseLeave={handleWrapMouseLeave}
          >
            {/* Interactive Hover Card (Showing clients count & industries, <= 10 clients) */}
            {isCardVisible && currentStats && (
              <div className="fj-client-stats-card" style={getClampedTooltipStyle()}>
                <div className="fj-client-card-header">
                  <div className="fj-client-card-title">{currentStats.name}</div>
                  <div className="fj-client-card-count">
                    {currentStats.totalClients} clients supported
                  </div>
                </div>
                <div className="fj-client-card-divider" />
                <div className="fj-client-card-list">
                  {currentStats.industries.map((ind) => (
                    <div key={ind.name} className="fj-client-card-row">
                      <span className="fj-client-card-ind">{ind.name}</span>
                      <span className="fj-client-card-num">{ind.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <svg viewBox="0 0 1955 1795" className="fj-info-map-svg" aria-label="Australia Continent Map">
              <defs>
                <filter id="coastalGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Coastal Ripple Rings */}
              <g transform="translate(603, 162.64)" opacity="0.32">
                <path
                  d="m 141,46.362183 -32,-6 -13,-4 -31,-28.0000004 -17,-7 -13,-7 -11,0 -8,6.00000002 3,10.00000038 -7,4 -4,-4 -22,8 -9,23 -11,-7 -23,11 -9,13 11,12 -3,0 -9,3 2,18 -13,-3 -16,12.999997 -3,8 2,10 5,8 -9,11 3,8 -19,-2 -12,-3 -9,3 3,8 -4,13 15,16 -3,10 -6,-6 -4,28 c 0,0 -10,-5 -13,-9 -3,-4 -19,-40 -19,-40 l 0,-5 -7,4 -20,24 -12,15 -2,16 6,17 6,14 -7,11 -20,18 -11,37 -13,17 -31,18 -10,8 -27,6 -8,7 -28,-6 -9,17 -5,4 -30,8 -7,6 -7,12 -20,7 -21,-3 -17,2 -14,9 -21,23 -19,24 -28,14 -11,10 -5,32 -9,5 -7,0 -4,-31 -8,2 -10,39 12,17 1,11 -3,27 -7,17 0,27 14,15 9,20 21,23 13,16 1,24 -15,-8 -28,-29 -3,13 17,17 10,14 -23,-3 4,9 32,35 12,21 3,17 32,38 17,25 5,27 1,16 12,26 30,43.00002 7,17 5,44 3,23 -1,13 -5,17 -7,2 -15,-6 0,11 3,24 6,10 11,-4 21,7 17,16 15,6 28,1 28,-3 29,-11 9,-8 14,-19 15,-5 11,-5 3,-16 19,-11 43,-7 27,-5 23,5 38,-7 7,0 9,2 18,-9 12,-17 5,-26 7,-5 20,-4 57,-37.00002 18,-3 38,2 21,-12 34,-18 18,-8 -34,-905.999997 z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeDasharray="10 8"
                  strokeWidth="5"
                  transform="scale(1.025) translate(-15, -15)"
                />
                <path
                  d="m 141,46.362183 -32,-6 -13,-4 -31,-28.0000004 -17,-7 -13,-7 -11,0 -8,6.00000002 3,10.00000038 -7,4 -4,-4 -22,8 -9,23 -11,-7 -23,11 -9,13 11,12 -3,0 -9,3 2,18 -13,-3 -16,12.999997 -3,8 2,10 5,8 -9,11 3,8 -19,-2 -12,-3 -9,3 3,8 -4,13 15,16 -3,10 -6,-6 -4,28 c 0,0 -10,-5 -13,-9 -3,-4 -19,-40 -19,-40 l 0,-5 -7,4 -20,24 -12,15 -2,16 6,17 6,14 -7,11 -20,18 -11,37 -13,17 -31,18 -10,8 -27,6 -8,7 -28,-6 -9,17 -5,4 -30,8 -7,6 -7,12 -20,7 -21,-3 -17,2 -14,9 -21,23 -19,24 -28,14 -11,10 -5,32 -9,5 -7,0 -4,-31 -8,2 -10,39 12,17 1,11 -3,27 -7,17 0,27 14,15 9,20 21,23 13,16 1,24 -15,-8 -28,-29 -3,13 17,17 10,14 -23,-3 4,9 32,35 12,21 3,17 32,38 17,25 5,27 1,16 12,26 30,43.00002 7,17 5,44 3,23 -1,13 -5,17 -7,2 -15,-6 0,11 3,24 6,10 11,-4 21,7 17,16 15,6 28,1 28,-3 29,-11 9,-8 14,-19 15,-5 11,-5 3,-16 19,-11 43,-7 27,-5 23,5 38,-7 7,0 9,2 18,-9 12,-17 5,-26 7,-5 20,-4 57,-37.00002 18,-3 38,2 21,-12 34,-18 18,-8 -34,-905.999997 z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeDasharray="6 12"
                  strokeWidth="3"
                  transform="scale(1.05) translate(-30, -30)"
                  opacity="0.5"
                />
              </g>

              {/* Continental States Layer */}
              <g transform="translate(603, 162.64)">
                {/* Western Australia (WA) */}
                <path
                  d="m 141,46.362183 -32,-6 -13,-4 -31,-28.0000004 -17,-7 -13,-7 -11,0 -8,6.00000002 3,10.00000038 -7,4 -4,-4 -22,8 -9,23 -11,-7 -23,11 -9,13 11,12 -3,0 -9,3 2,18 -13,-3 -16,12.999997 -3,8 2,10 5,8 -9,11 3,8 -19,-2 -12,-3 -9,3 3,8 -4,13 15,16 -3,10 -6,-6 -4,28 c 0,0 -10,-5 -13,-9 -3,-4 -19,-40 -19,-40 l 0,-5 -7,4 -20,24 -12,15 -2,16 6,17 6,14 -7,11 -20,18 -11,37 -13,17 -31,18 -10,8 -27,6 -8,7 -28,-6 -9,17 -5,4 -30,8 -7,6 -7,12 -20,7 -21,-3 -17,2 -14,9 -21,23 -19,24 -28,14 -11,10 -5,32 -9,5 -7,0 -4,-31 -8,2 -10,39 12,17 1,11 -3,27 -7,17 0,27 14,15 9,20 21,23 13,16 1,24 -15,-8 -28,-29 -3,13 17,17 10,14 -23,-3 4,9 32,35 12,21 3,17 32,38 17,25 5,27 1,16 12,26 30,43.00002 7,17 5,44 3,23 -1,13 -5,17 -7,2 -15,-6 0,11 3,24 6,10 11,-4 21,7 17,16 15,6 28,1 28,-3 29,-11 9,-8 14,-19 15,-5 11,-5 3,-16 19,-11 43,-7 27,-5 23,5 38,-7 7,0 9,2 18,-9 12,-17 5,-26 7,-5 20,-4 57,-37.00002 18,-3 38,2 21,-12 34,-18 18,-8 -34,-905.999997 z"
                  className={`state-shape ${isStateActive("WA") ? "is-active is-wasa" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("wa", e)}
                  onClick={() => handleOpenArea("wasa")}
                />

                {/* Northern Territory (NT) */}
                <path
                  d="m 150,54.362183 15,-3 15,4 1,-13 -15,-15 -1,-10 6,-11.0000004 11,-1 6,-30.9999996 9,3 11,-14 -6,-12 0,-10 9,0 3,-9 12,-7 2,-14 15,0 8,-11 21,6 22,-3 12,4 17,-10.000003 15,-4 -4,-20 -10,-9 -14,-2 -10,-11 24,-10 20,22 10,-7 12,19 24,6 13,-7 2,9 44,8 6,1 15,12.000003 8,1 8,-8.000003 14,2 3,7.000003 13,-3 6,13 9,1 7,-10 -7,-8.000003 14,-7 3,0 6,9.000003 7,2 5,2 5,8 -10,11 -7,11 -8,1 2,13 -6,9 -9,-3 -20,13 0,17 6,5.9999996 -9,16 1,5.0000004 -9,7 -12,20 -4,3 4,14 38,25 4,8 17,9 4,12.999997 19,-3 20,13 16,8 8,15 -18,505 -98,-3 -123,-2 -163,5 -44,1 z"
                  className={`state-shape ${isStateActive("NT") ? "is-active is-nt" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("nt", e)}
                />
                <path d="m 193,-116.63782 20,4 16,-6 15,4 22,-13 8,-11 -1,-12 -11,-3 -27,10 -20,-6 -7,5 -9,11 1,5 z" className={`state-shape ${isStateActive("NT") ? "is-active is-nt" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("nt", e)} />
                <path d="m 536,17.362183 29,2 6,-7 -10,-8.0000004 3,-14 -20,-6.9999996 -2,6.9999996 -4,20.0000004 z" className={`state-shape ${isStateActive("NT") ? "is-active is-nt" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("nt", e)} />

                {/* Queensland (QLD) */}
                <path
                  d="m 625,149.36218 15,5 22,8 12,9 10,21 18,7 19,15 17,-4 17,-2 11,-15 12,-21 13,-17 9,-30 2,-19 13,-33.999997 -6,-16 5,-27 -3,-12 -5,-12.0000004 8,-15 8,-11.9999996 -2,-22 10,-5 7,-9 -13,-12 22,-34.000003 8,-34 3,-9 11,-6 10,-10 5,2 -1,7 12,10 1,43 6,7.000003 8,5 -8,14 17,20 0,8 5,15 -3,35.9999996 7,25.0000004 4,18 12,6 13,-12 16,-3 4,17 21,18 10,8 -1,28.999997 5,24 -1,15 -2,14 23,48 7,13 -1,22 -7,16 13,5 -3,24 -1,10 14,17 21,14 21,2 4,12 4,14 23,4 10,21 9,-7 16,15 -5,12 11,24 11,25 4,38 0,20 14,3 4,4 2,-22 9,6 22,24 9,16 -5,32 24,33 14,3 9,14 3,17 18,13 4,13 5,13 8,7 -1,17 8,14 -2,7 -6,9 1,39 -1,10 -8,-1 5,13 9,20 -2,25 -24,2 -20,-8 -30,16 -2,15 -12,-1 -5,-1 -9,11 -5,1 2,-10 -7,-8 -5,-7 -13,-5 -13,0 -6,-10 -24,4 -15,-8 -14,5 -14,14 -157,-15 -86,-10 -117,-8 -11,-1 11,-160 -142,-7 z"
                  className={`state-shape ${isStateActive("QLD") ? "is-active is-qld" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("qld", e)}
                  onClick={() => handleOpenArea("qld")}
                />
                <path d="m 682.5,156.86218 6.5,1 8,-2.5 11,-5.5 5.5,-1 1.5,-5.5 -2,-4.5 -15,-2.5 -8,2.5 -6.5,5 -4,5.5 -0.5,5.5 z" className={`state-shape ${isStateActive("QLD") ? "is-active is-qld" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("qld", e)} onClick={() => handleOpenArea("qld")} />
                <path d="m 1329,683.36218 3,14 7,2 9,-13 4,-18 -11,-8 -7,5 z" className={`state-shape ${isStateActive("QLD") ? "is-active is-qld" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("qld", e)} onClick={() => handleOpenArea("qld")} />

                {/* South Australia (SA) */}
                <path
                  d="m 700.5,1306.8622 -14,-2 -10.5,-12 -19,-34.5 -4,-13 4,-10 -5,-22 -3.5,-21.5 -13.5,-12 -14.5,-12 -11,1.5 -6.5,2 -13,-1.5 1,-6.5 12.5,-21 2.5,-11 -0.5,-11 -16.5,-26 -3.5,10 -11,37.5 -8.5,4 -23.5,0 -5,-11.5 5.5,-4 12.5,-0.5 2,-8 3,-26 5.5,-20 14,-12 3.5,-6 -0.5,-16 6.5,-3.5 2,-2.5 -11.5,-32 -4.5,1 -1,18 -7,7.5 -12.5,21.5 -6,12 -12,2 -18,12.5 -13.5,19.5 -11.5,18.5 -11.5,8.5 -11,-4.5 -11.5,-38.5 -0.5,-10 -14,-13.5 -9.5,-21.5 -12.5,-4.5 -9,-9 -4,-7.5 6,-11 -10,-5.50002 -5,-7.5 -6.5,-10.5 -9.5,-4.5 -15.5,5 -8,-6 -10.5,-5.5 -10.5,-2 -5,4 -8,0 -12,-8.5 -18,-11 -15.5,-7.5 -5.5,-1 -4.5,1 -7.5,4 -23.5,0.5 -58,4 -12.5,-297 181,-3.5 142.5,0.5 146.5,6 100,4 -37.5,644.00002 z"
                  className={`state-shape ${isStateActive("SA") ? "is-active is-wasa" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("sa", e)}
                  onClick={() => handleOpenArea("wasa")}
                />
                <path d="m 527,1164.3622 -1,11 8,6 10,0 28,-2 10,-10 -10,-11 -10,0 z" className={`state-shape ${isStateActive("SA") ? "is-active is-wasa" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("sa", e)} onClick={() => handleOpenArea("wasa")} />

                {/* New South Wales (NSW) */}
                <path
                  d="m 739,825.36218 146,12 107,10 120,13 15,-15 12,-3 10,3 21,-1 7,5 6,2 11,2 7,5 5,4 7,8 1,10 7,2 8,-4 5,-9 9,5 11,0 4,-10 -1,-9 24,-11 11,3 10,5 24,-5 -1,26 -13,24 -11,31 -13,29 0,18 -9,21 -11,24.00002 -10,12 -8,12 -5,14 -36,23 -28,33 -9,22 -11,20 -9,30 -13,13 -18,19 -10,25 -8,24 -6,36 -5,6 -66,-43 1,-15 -4,-10 0,-17 -18,-8 -21,3 -19,-4 -23,-1 -27,-9 -17,-7 -15,3 -1,6 1,6 -3,1 -7,-4 -11,-18 -12,-13 -16,-9 -5,-9 -7,-8 4,-17 -10,-4.5 -18.5,-6 -8.5,6.5 -7,-16 -1,-9 -19,-13 -9,-3 -9,5 -21,-8 z"
                  className={`state-shape ${isStateActive("NSW") ? "is-active is-nsw" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("nsw", e)}
                  onClick={() => handleOpenArea("nsw")}
                />

                {/* Victoria (VIC) */}
                <path
                  d="m 721,1096.3622 -12,215 24,17 12,-8 17,7 26,14 22,16 43,-20 9,-8 13,-19 6,11 -6,14 -2,6 24,14 14,9 4,7 38,-8 31,-28 27,-9 34,-1 31,2 12,-12 -68,-45 -3,-8 3,-12 -4,-4 -2,-16 -9,-3 -12,-2 -9,4 -13,-4 -9,-4 -12,5 -9,-4 -29,-10 -10,-4 -12,0 -2,11 -6,3 -9.5,-1 -9.5,-15 -8,-14 -15,-12 -14,-5 -7.5,-13.5 -1,-14.5 -3,-10 -10,-3 -8.5,-2 -8,7 -8,-12 -5,-7 0,-9 -17,-10 -9,3 -11,-2 z"
                  className={`state-shape ${isStateActive("VIC") ? "is-active is-vic" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("vic", e)}
                  onClick={() => handleOpenArea("vic")}
                />

                {/* ACT */}
                <path
                  d="m 1057,1200.3622 9,-14 12,0 4,11 -9,11 -5,20 -9,-10 -3,-10 z"
                  className={`state-shape ${isStateActive("ACT") ? "is-active is-act" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("act", e)}
                />

                {/* Tasmania (TAS) */}
                <path
                  d="m 924,1631.8622 9.5,-16 8,-3 10.5,-20.5 4.5,0 12,2 6,-7.5 8.5,-29 10,-9.5 2.5,-22.5 1,-19 4.5,-13 c 0,0 -10,-14 -12,-14 -2,0 -14.5,8.5 -14.5,8.5 l -26,0.5 -11,3 -18,4.5 -31,-15 -32,-16.5 -4.5,0.5 -3,10.5 -2.5,10.5 7.5,23.5 7.5,17.5 8.5,16 3.5,14 -3,9.5 -0.5,7.5 14.5,32 7.5,17 6,3 11,-1 10.5,6.5 z"
                  className={`state-shape ${isStateActive("TAS") ? "is-active is-tas" : ""}`}
                  onMouseEnter={(e) => handleStateMouseEnter("tas", e)}
                />
                <path d="m 985,1428.3622 6,-6 3.5,-0.5 6.5,9.5 5.5,10 -0.5,12.5 -9,2.5 -6.5,-11 -4.5,-12 z" className={`state-shape ${isStateActive("TAS") ? "is-active is-tas" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("tas", e)} />
                <path d="m 823.5,1395.3622 -4.5,12 0,15.5 3.5,5.5 4.5,1 4.5,-5.5 4,-12 -0.5,-9.5 -1.5,-4 -3,-4 z" className={`state-shape ${isStateActive("TAS") ? "is-active is-tas" : ""}`} onMouseEnter={(e) => handleStateMouseEnter("tas", e)} />
              </g>

              {/* State Labels (Centered) */}
              <text x="360" y="780" className="state-label-text">Western Australia</text>
              <text x="1000" y="440" className="state-label-text">Northern Territory</text>
              <text x="1500" y="650" className="state-label-text">Queensland</text>
              <text x="1040" y="1100" className="state-label-text">South Australia</text>
              <text x="1560" y="1180" className="state-label-text">New South Wales</text>
              <text x="1480" y="1410" className="state-label-text">Victoria</text>
              <text x="1510" y="1720" className="state-label-text" style={{ fontSize: "26px" }}>Tasmania</text>

              {/* Ocean Labels */}
              <text x="80" y="580" className="ocean-label-text">INDIAN OCEAN</text>
              <text x="1450" y="320" className="ocean-label-text">CORAL SEA</text>
              <text x="1600" y="1560" className="ocean-label-text">TASMAN SEA</text>
              <text x="750" y="1450" className="ocean-label-text">GREAT AUSTRALIAN BIGHT</text>

              {/* Interactive City Radar Pins */}
              {/* Melbourne (VIC) */}
              <g
                className={`city-marker ${isStateActive("VIC") ? "is-active" : ""}`}
                transform="translate(1520, 1440)"
                onMouseEnter={(e) => handleStateMouseEnter("vic", e)}
                onClick={() => handleOpenArea("vic")}
              >
                <circle r="22" className="ping" />
                <circle r="11" className="core" />
                <text x="24" y="8" className="city-name-tag">Melbourne</text>
              </g>

              {/* Sydney (NSW) */}
              <g
                className={`city-marker ${isStateActive("NSW") ? "is-active" : ""}`}
                transform="translate(1890, 1290)"
                onMouseEnter={(e) => handleStateMouseEnter("nsw", e)}
                onClick={() => handleOpenArea("nsw")}
              >
                <circle r="18" className="ping" />
                <circle r="9" className="core" />
                <text x="22" y="8" className="city-name-tag">Sydney</text>
              </g>

              {/* Brisbane (QLD) */}
              <g
                className={`city-marker ${isStateActive("QLD") ? "is-active" : ""}`}
                transform="translate(1910, 920)"
                onMouseEnter={(e) => handleStateMouseEnter("qld", e)}
                onClick={() => handleOpenArea("qld")}
              >
                <circle r="18" className="ping" />
                <circle r="9" className="core" />
                <text x="22" y="8" className="city-name-tag">Brisbane</text>
              </g>

              {/* Perth (WA) */}
              <g
                className={`city-marker ${isStateActive("WA") ? "is-active" : ""}`}
                transform="translate(180, 1050)"
                onMouseEnter={(e) => handleStateMouseEnter("wa", e)}
                onClick={() => handleOpenArea("wasa")}
              >
                <circle r="18" className="ping" />
                <circle r="9" className="core" />
                <text x="22" y="8" className="city-name-tag">Perth</text>
              </g>

              {/* Adelaide (SA) */}
              <g
                className={`city-marker ${isStateActive("SA") ? "is-active" : ""}`}
                transform="translate(1120, 1220)"
                onMouseEnter={(e) => handleStateMouseEnter("sa", e)}
                onClick={() => handleOpenArea("wasa")}
              >
                <circle r="18" className="ping" />
                <circle r="9" className="core" />
                <text x="22" y="8" className="city-name-tag">Adelaide</text>
              </g>
            </svg>
          </div>

          <div className="fj-info-bottom-title">AUSTRALIA CONTINENT CAREER HUBS</div>
          <div className="fj-info-bottom-hint">Interactive Map · Click Any State or City to Open Sourcing Pipeline</div>
        </div>
      </div>

      {/* LOCATION AREA OPEN DRAWER (Triggered on click of any step, state, or city) */}
      {selectedAreaKey && activeArea && (
        <div className="fj-location-drawer" role="dialog" aria-modal="true">
          <div className="fj-drawer-header">
            <div className="fj-drawer-title-group">
              <h3 className="fj-drawer-title">{activeArea.title}</h3>
              <span className="fj-drawer-state-badge">{activeArea.stateName} ({activeArea.stateCode})</span>
            </div>
            <button
              type="button"
              onClick={handleCloseArea}
              className="fj-drawer-close-btn"
              title="Close and return to National Map"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="fj-drawer-body">
            {/* Left: Pricing & Applications Guarantee */}
            <div className="fj-drawer-pricing-box">
              <div className="fj-drawer-pricing-title">Australian Standard Package</div>
              <div className="fj-pricing-item">
                <span>Standard Application Plan</span>
                <span className="fj-pricing-val">{activeArea.pricing.standard}</span>
              </div>
              <div className="fj-pricing-item">
                <span>Fortnight Onboarding Fee</span>
                <span className="fj-pricing-val">{activeArea.pricing.fortnight}</span>
              </div>
              <div className="fj-pricing-item">
                <span>Placement Success Fee</span>
                <span className="fj-pricing-val">{activeArea.pricing.placement}</span>
              </div>
              <div className="fj-pricing-item">
                <span>Application Guarantee</span>
                <span className="fj-pricing-val">{activeArea.pricing.quota}</span>
              </div>
              <div className="fj-pricing-item">
                <span>Sourcing Channels</span>
                <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "0.8rem" }}>{activeArea.platforms}</span>
              </div>
            </div>

            {/* Right: Metro Corridors & Suburbs */}
            <div className="fj-drawer-corridors-box">
              <div className="fj-corridors-title">Strategic Metro Corridors & Suburbs</div>
              <div className="fj-corridors-grid">
                {activeArea.corridors.map((c) => (
                  <div
                    key={c.name}
                    className="fj-corridor-mini-card"
                    onClick={() => router.push(`/jobs/${c.slug}`)}
                  >
                    <div className="fj-corridor-mini-name">{c.name}</div>
                    <div className="fj-corridor-mini-sub">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fj-drawer-footer">
            <div className="fj-drawer-metric-pill">
              <CheckCircle2 size={16} />
              <span>Active Australian Pipeline: 20 Jobs/Day Applied · 100+ Applications/Wk</span>
            </div>
            <Link href={`/jobs/${activeArea.slug}`} className="fj-drawer-cta-btn" prefetch={false}>
              <span>Explore All {activeArea.stateName} Roles</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
