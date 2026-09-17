"use client";

import React from "react";

export default function AustraliaMapCanvas({ viewKey = "melbourne" }) {
  switch (viewKey) {
    case "all":
      return <AllAustraliaMap />;
    case "sydney":
      return <SydneyMap />;
    case "brisbane":
      return <BrisbaneMap />;
    case "perth":
      return <PerthMap />;
    case "adelaide":
      return <AdelaideMap />;
    case "geelong":
      return <GeelongMap />;
    case "melbourne":
    default:
      return <MelbourneMap />;
  }
}

// ==========================================
// 1. MELBOURNE & VICTORIA MAP (Corporate Minimal)
// ==========================================
function MelbourneMap() {
  return (
    <svg
      viewBox="0 0 1000 500"
      className="fj-map-svg-canvas"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="corpWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        <pattern id="corpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
        </pattern>
      </defs>

      {/* Pristine Land Base */}
      <rect width="1000" height="500" fill="#f8fafc" />

      {/* Urban Grid Pattern */}
      <rect x="340" y="60" width="560" height="340" fill="url(#corpGrid)" opacity="0.6" />

      {/* Soft Parklands */}
      <path
        d="M 860,110 Q 940,140 960,280 Q 900,320 860,230 Z"
        fill="#f0fdf4"
        stroke="#bbf7d0"
        strokeWidth="1.2"
      />
      <text x="880" y="200" fill="#16a34a" fontSize="9" fontWeight="700" letterSpacing="0.1em" opacity="0.8">
        DANDENONG RANGES
      </text>

      <rect x="520" y="100" width="40" height="26" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
      <text x="526" y="117" fill="#16a34a" fontSize="7" fontWeight="700">Royal Park</text>

      <ellipse cx="595" cy="225" rx="20" ry="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
      <ellipse cx="595" cy="225" rx="10" ry="6" fill="#bae6fd" />
      <text x="580" y="244" fill="#0284c7" fontSize="7" fontWeight="600">Albert Park</text>

      {/* Water Bodies: Bass Strait */}
      <path
        d="M 0,440 Q 250,420 420,450 Q 560,480 720,450 Q 860,430 1000,450 L 1000,500 L 0,500 Z"
        fill="url(#corpWaterGrad)"
        stroke="#7dd3fc"
        strokeWidth="1.2"
      />

      {/* Port Phillip Bay */}
      <path
        d="M 470,450 
           C 450,380 430,300 460,240 
           C 490,180 540,175 580,180
           C 630,185 680,210 710,270 
           C 740,330 735,400 680,445 
           C 640,430 580,435 550,455 
           C 525,470 495,470 470,450 Z"
        fill="url(#corpWaterGrad)"
        stroke="#7dd3fc"
        strokeWidth="1.5"
      />

      {/* Corio Bay */}
      <path
        d="M 450,330 
           C 400,320 330,325 290,345 
           C 260,360 270,390 320,395 
           C 370,400 420,380 450,365 Z"
        fill="url(#corpWaterGrad)"
        stroke="#7dd3fc"
        strokeWidth="1.2"
      />

      {/* Yarra River */}
      <path
        d="M 950,150 Q 850,180 770,155 T 660,165 T 585,180 T 565,195"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Subtle Architectural Transit Corridors (M1, M2, M3) */}
      <path
        d="M 80,360 Q 280,350 430,260 T 555,195 T 670,230 T 820,290 T 960,350"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 570,185 Q 550,120 490,40"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 590,175 Q 680,145 880,150"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sleek Highway Route Badges */}
      <g transform="translate(360, 290)">
        <rect x="-11" y="-7" width="22" height="14" rx="3" fill="#0f172a" />
        <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">M1</text>
      </g>
      <g transform="translate(520, 80)">
        <rect x="-11" y="-7" width="22" height="14" rx="3" fill="#0f172a" />
        <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">M2</text>
      </g>
      <g transform="translate(730, 145)">
        <rect x="-11" y="-7" width="22" height="14" rx="3" fill="#0f172a" />
        <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">M3</text>
      </g>

      {/* Clean Corporate Water Labels */}
      <text
        x="580"
        y="320"
        fill="#0284c7"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.25em"
        opacity="0.8"
        textAnchor="middle"
      >
        PORT PHILLIP BAY
      </text>
      <text
        x="360"
        y="360"
        fill="#0284c7"
        fontSize="10"
        fontWeight="700"
        letterSpacing="0.1em"
        opacity="0.75"
        textAnchor="middle"
      >
        CORIO BAY
      </text>
      <text
        x="500"
        y="485"
        fill="#0369a1"
        fontSize="12"
        fontWeight="800"
        letterSpacing="0.25em"
        opacity="0.7"
        textAnchor="middle"
      >
        BASS STRAIT
      </text>
      <text x="730" y="165" fill="#0284c7" fontSize="8" fontStyle="italic" fontWeight="600">
        Yarra River ~
      </text>

      {/* Cartographic Compass */}
      <g transform="translate(940, 40)" opacity="0.6">
        <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M 0,-9 L 2.5,-2 L 0,0 L -2.5,-2 Z" fill="#0f172a" />
        <path d="M 0,9 L 2.5,2 L 0,0 L -2.5,2 Z" fill="#94a3b8" />
        <text x="0" y="-11" fill="#0f172a" fontSize="6.5" fontWeight="800" textAnchor="middle">N</text>
      </g>

      <text x="18" y="475" fill="#94a3b8" fontSize="8" fontFamily="monospace" opacity="0.8">
        VIC · 37°48&apos;S 144°57&apos;E · 1:50,000 METRO CORRIDOR
      </text>
    </svg>
  );
}

// ==========================================
// 2. ALL AUSTRALIA NATIONAL MAP (Corporate)
// ==========================================
function AllAustraliaMap() {
  return (
    <svg
      viewBox="0 0 1000 500"
      className="fj-map-svg-canvas"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="auCorpOcean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>

      <rect width="1000" height="500" fill="url(#auCorpOcean)" />

      {/* Accurate Australia Silhouette */}
      <path
        d="M 160,110 
           C 220,85 320,80 380,120 
           C 420,95 480,90 530,115 
           C 570,95 640,110 700,75 
           C 740,40 770,10 785,15
           C 795,25 780,80 820,110 
           C 870,130 920,170 930,230 
           C 940,290 925,340 890,380 
           C 860,415 810,425 760,415 
           C 720,425 640,440 560,405 
           C 500,390 460,340 440,340
           C 430,350 400,390 360,400 
           C 280,410 210,395 150,380 
           C 110,360 80,310 75,250 
           C 70,190 100,140 160,110 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      <path
        d="M 760,440 C 780,435 800,450 795,475 C 785,490 765,485 755,465 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />

      {/* State Boundaries */}
      <line x1="370" y1="125" x2="370" y2="390" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="370" y1="230" x2="550" y2="230" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="550" y1="125" x2="550" y2="270" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="550" y1="270" x2="680" y2="270" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="680" y1="270" x2="680" y2="405" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
      <path d="M 680,365 Q 730,360 790,390" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />

      {/* Subtle State Watermarks */}
      <text x="260" y="240" fill="#cbd5e1" fontSize="24" fontWeight="800" letterSpacing="0.1em">WA</text>
      <text x="450" y="170" fill="#cbd5e1" fontSize="22" fontWeight="800" letterSpacing="0.1em">NT</text>
      <text x="450" y="310" fill="#cbd5e1" fontSize="22" fontWeight="800" letterSpacing="0.1em">SA</text>
      <text x="670" y="190" fill="#cbd5e1" fontSize="24" fontWeight="800" letterSpacing="0.1em">QLD</text>
      <text x="740" y="320" fill="#cbd5e1" fontSize="24" fontWeight="800" letterSpacing="0.1em">NSW</text>
      <text x="710" y="390" fill="#cbd5e1" fontSize="18" fontWeight="800" letterSpacing="0.1em">VIC</text>
      <text x="745" y="465" fill="#cbd5e1" fontSize="12" fontWeight="800">TAS</text>

      {/* Ocean Labels */}
      <text x="60" y="220" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.25em" opacity="0.7">
        INDIAN OCEAN
      </text>
      <text x="860" y="180" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.25em" opacity="0.7">
        PACIFIC OCEAN
      </text>
      <text x="450" y="470" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.25em" opacity="0.7">
        SOUTHERN OCEAN
      </text>

      <text x="18" y="475" fill="#64748b" fontSize="8" fontFamily="monospace" opacity="0.8">
        COMMONWEALTH OF AUSTRALIA · 7 METRO RECRUITMENT HUBS
      </text>
    </svg>
  );
}

// ==========================================
// 3. SYDNEY MAP
// ==========================================
function SydneyMap() {
  return (
    <svg viewBox="0 0 1000 500" className="fj-map-svg-canvas" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1000" height="500" fill="#f8fafc" />
      <path d="M 850,0 Q 820,250 860,500 L 1000,500 L 1000,0 Z" fill="#bae6fd" />
      <path
        d="M 300,240 Q 520,250 680,230 Q 760,220 840,240 L 860,245 L 840,260 Q 760,240 680,255 Q 520,270 300,240 Z"
        fill="#bae6fd"
      />
      <ellipse cx="780" cy="400" rx="55" ry="35" fill="#bae6fd" />
      <path d="M 300,250 L 780,240" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M 780,50 L 780,480" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 3" />
      <text x="880" y="220" fill="#0284c7" fontSize="12" fontWeight="800" letterSpacing="0.2em">PACIFIC OCEAN</text>
      <text x="680" y="215" fill="#0284c7" fontSize="9" fontStyle="italic" fontWeight="700">Sydney Harbour</text>
      <text x="750" y="405" fill="#0284c7" fontSize="10" fontWeight="700">Botany Bay</text>
      <text x="18" y="475" fill="#64748b" fontSize="8" fontFamily="monospace">NSW · GREATER SYDNEY CORRIDOR</text>
    </svg>
  );
}

// ==========================================
// 4. BRISBANE MAP
// ==========================================
function BrisbaneMap() {
  return (
    <svg viewBox="0 0 1000 500" className="fj-map-svg-canvas" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1000" height="500" fill="#f8fafc" />
      <path d="M 780,0 Q 750,250 800,500 L 1000,500 L 1000,0 Z" fill="#bae6fd" />
      <path
        d="M 280,380 Q 420,350 480,280 T 580,240 T 660,190 T 780,180"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M 740,50 L 740,480" stroke="#cbd5e1" strokeWidth="2.5" />
      <text x="840" y="240" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.2em">MORETON BAY</text>
      <text x="560" y="220" fill="#0284c7" fontSize="9" fontStyle="italic" fontWeight="700">Brisbane River ~</text>
      <text x="18" y="475" fill="#64748b" fontSize="8" fontFamily="monospace">QLD · BRISBANE METRO &amp; SUNSHINE CORRIDOR</text>
    </svg>
  );
}

// ==========================================
// 5. PERTH MAP
// ==========================================
function PerthMap() {
  return (
    <svg viewBox="0 0 1000 500" className="fj-map-svg-canvas" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1000" height="500" fill="#f8fafc" />
      <path d="M 0,0 L 220,0 Q 240,250 200,500 L 0,500 Z" fill="#bae6fd" />
      <ellipse cx="90" cy="260" rx="20" ry="10" fill="#ffffff" stroke="#7dd3fc" strokeWidth="1.2" />
      <text x="65" y="285" fill="#0284c7" fontSize="8" fontWeight="700">Rottnest Is.</text>
      <path
        d="M 220,360 Q 320,320 400,280 T 560,200 T 780,130"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M 520,40 L 520,470" stroke="#cbd5e1" strokeWidth="2.5" />
      <text x="40" y="160" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.2em">INDIAN OCEAN</text>
      <text x="420" y="240" fill="#0284c7" fontSize="9" fontStyle="italic" fontWeight="700">Swan River ~</text>
      <text x="18" y="475" fill="#64748b" fontSize="8" fontFamily="monospace">WA · PERTH METRO CORRIDOR</text>
    </svg>
  );
}

// ==========================================
// 6. ADELAIDE MAP
// ==========================================
function AdelaideMap() {
  return (
    <svg viewBox="0 0 1000 500" className="fj-map-svg-canvas" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1000" height="500" fill="#f8fafc" />
      <path d="M 0,0 L 260,0 Q 280,250 240,500 L 0,500 Z" fill="#bae6fd" />
      <path d="M 260,250 Q 500,260 760,230" fill="none" stroke="#38bdf8" strokeWidth="3" />
      <rect x="520" y="180" width="80" height="60" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
      <text x="40" y="180" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.2em">GULF ST VINCENT</text>
      <text x="18" y="475" fill="#64748b" fontSize="8" fontFamily="monospace">SA · ADELAIDE INNOVATION &amp; TECH CORRIDOR</text>
    </svg>
  );
}

// ==========================================
// 7. GEELONG MAP
// ==========================================
function GeelongMap() {
  return (
    <svg viewBox="0 0 1000 500" className="fj-map-svg-canvas" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1000" height="500" fill="#f8fafc" />
      <path d="M 350,150 C 450,120 620,180 720,250 C 650,360 480,350 350,300 Z" fill="#bae6fd" />
      <path d="M 0,420 Q 500,400 1000,420 L 1000,500 L 0,500 Z" fill="#93c5fd" />
      <path d="M 280,260 Q 550,180 920,80" stroke="#cbd5e1" strokeWidth="2.5" />
      <text x="460" y="240" fill="#0284c7" fontSize="13" fontWeight="800" letterSpacing="0.2em">CORIO BAY</text>
      <text x="450" y="465" fill="#0284c7" fontSize="11" fontWeight="800" letterSpacing="0.2em">BASS STRAIT</text>
      <text x="18" y="475" fill="#64748b" fontSize="8" fontFamily="monospace">VIC · GEELONG &amp; SURF COAST CORRIDOR</text>
    </svg>
  );
}
