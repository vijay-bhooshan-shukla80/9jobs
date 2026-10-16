"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  ArrowRight,
  LayoutGrid,
  GraduationCap,
  Zap,
  Heart,
} from "lucide-react";
import styles from "./HomeVideoSection.module.css";

// Easily replaceable video configuration with 2400x1500 Retina-sharp preview thumbnails
export const videoCardsData = [
  {
    id: "01",
    title: "Stop Applying Alone. Let 9Jobs Handle It.",
    description:
      "From job searching and applications to LinkedIn updates and interview preparation, let 9Jobs simplify your journey.",
    videoSrc: "/home-reels/reel-01.mp4",
    posterSrc: "/home-reels/reel-01.jpg",
  },
  {
    id: "02",
    title: "Less Job Search Stress. More Results.",
    description:
      "Skip the repetitive applications and let 9Jobs manage the hard work while you focus on your next opportunity.",
    videoSrc: "/home-reels/reel-02.mp4",
    posterSrc: "/home-reels/reel-02.jpg",
  },
  {
    id: "03",
    title: "9Jobs Australia – Job Search News & Updates",
    description:
      "Discover the latest insights about job searching and how 9Jobs supports Australian job seekers.",
    videoSrc: "/home-reels/reel-03.mp4",
    posterSrc: "/home-reels/reel-03.jpg",
  },
];
 
// --- 100% Crisp Native Vector Previews (Never Blurry on any screen or zoom) ---

function AtsCardPreview() {
  return (
    <div className={styles.cardAts}>
      <div className={styles.atsWin}>
        <div className={styles.atsSide}>
          <div className={styles.atsLogo}>
            9<span style={{ color: "#65a30d" }}>•</span>jobs{" "}
            <span style={{ fontSize: "1.6cqw", color: "#94a3b8" }}>▾</span>
          </div>
          <div className={styles.atsNavActive}>⊞ Dashboard</div>
          <div className={styles.atsNav}>💼 Jobs</div>
          <div className={styles.atsNav}>👥 Candidates</div>
          <div className={styles.atsNav}>📅 Interviews</div>
          <div className={styles.atsNav}>📊 Reports</div>
          <div className={styles.atsNav}>⚙ Settings</div>
        </div>
        <div className={styles.atsMain}>
          <div className={styles.atsBread}>← Dashboard</div>
          <div className={styles.atsHead}>
            <div className={styles.atsTitle}>Candidates (248)</div>
            <div className={styles.atsActions}>
              <span className={styles.atsBtnSort}>Sort ▾</span>
              <span className={styles.atsBtnShort}>+ Shortlist</span>
            </div>
          </div>
          <div className={styles.atsFilters}>
            <span className={styles.atsFilter}>Applied (140) ▾</span>
            <span className={styles.atsFilter}>Shortlisted (42)</span>
            <span className={styles.atsFilter}>Interview (16)</span>
          </div>
          <div className={styles.atsRows}>
            <div className={styles.atsRow}>
              <img
                src="/framer/portrait-02.jpg"
                alt="Costa Developer"
                className={styles.atsAvatar}
              />
              <div className={styles.atsInfo}>
                <div className={styles.atsName}>Costa Developer</div>
                <div className={styles.atsRole}>
                  Senior Full Stack Engineer · Sydney
                </div>
              </div>
              <div className={styles.atsPillGroup}>
                <span className={`${styles.atsPill} ${styles.atsPillShort}`}>
                  Shortlisted
                </span>
                <span className={styles.atsCount}>2</span>
              </div>
            </div>
            <div className={styles.atsRow}>
              <img
                src="/framer/portrait-01.jpg"
                alt="Ecoco Optimizer"
                className={styles.atsAvatar}
              />
              <div className={styles.atsInfo}>
                <div className={styles.atsName}>Ecoco Optimizer</div>
                <div className={styles.atsRole}>
                  Product Operations Lead · Sydney
                </div>
              </div>
              <div className={styles.atsPillGroup}>
                <span className={`${styles.atsPill} ${styles.atsPillInt}`}>
                  Interview
                </span>
                <span className={styles.atsCount}>2</span>
              </div>
            </div>
            <div className={styles.atsRow}>
              <img
                src="/framer/portrait-03.jpg"
                alt="Danilo Opsimovic"
                className={styles.atsAvatar}
              />
              <div className={styles.atsInfo}>
                <div className={styles.atsName}>Danilo Opsimovic</div>
                <div className={styles.atsRole}>Frontend UI / UX Designer</div>
              </div>
              <div className={styles.atsPillGroup}>
                <span className={`${styles.atsPill} ${styles.atsPillShort}`}>
                  Shortlisted
                </span>
                <span className={styles.atsCount}>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cPlay}>
        <div className={styles.cTri} />
      </div>
      <div className={styles.cBadge}>02:47</div>
    </div>
  );
}

function DifferentCardPreview() {
  return (
    <div className={styles.cardDiff}>
      <div className={styles.diffLeft}>
        <div className={styles.diffHead}>
          <div className={styles.diffTitle}>Create a Job Post</div>
          <div className={styles.diffArrows}>‹ ›</div>
        </div>
        <div className={styles.diffSteps}>
          <span className={styles.diffStepAct}>
            <span className={styles.diffSnum}>1</span> Job Details
          </span>
          <span className={styles.diffStepInact}>
            <span className={`${styles.diffSnum} ${styles.diffSnumGray}`}>2</span>{" "}
            Screening
          </span>
          <span className={styles.diffStepInact}>
            <span className={`${styles.diffSnum} ${styles.diffSnumGray}`}>3</span>{" "}
            Publish
          </span>
        </div>
        <div className={styles.diffFields}>
          <div className={styles.diffField}>
            <span className={styles.diffLabel}>Job Title</span>
            <div className={styles.diffInput}>Frontend Developer</div>
          </div>
          <div className={styles.diffField}>
            <span className={styles.diffLabel}>Location</span>
            <div className={styles.diffInput}>Remote</div>
          </div>
          <div className={styles.diffField}>
            <span className={styles.diffLabel}>Experience</span>
            <div className={styles.diffRow}>
              <div className={styles.diffSelect}>2-5 years ▾</div>
              <div className={styles.diffBtn}>Post Job</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.diffRight}>
        <svg className={styles.diffSpark} viewBox="0 0 28 28" fill="none">
          <path
            d="M14 2V8M22 6L18 10M26 14H20"
            stroke="#65a30d"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <img
          src="/framer/portrait-01.jpg"
          alt="Great Candidate"
          className={styles.diffFavatar}
        />
        <div className={styles.diffRtitle}>
          Great Candidates
          <br />
          Start Here
        </div>
      </div>
      <div className={styles.cPlay}>
        <div className={styles.cTri} />
      </div>
      <div className={styles.cBadge}>01:08</div>
    </div>
  );
}

function PricingCardPreview() {
  return (
    <div className={styles.cardPrice}>
      <div className={styles.pHead}>
        <span className={styles.pLeaf}>🌱</span>
        <div className={styles.pTitle}>Choose the Right Plan</div>
      </div>
      <div className={styles.pCols}>
        {/* Starter */}
        <div className={styles.pCol}>
          <div className={styles.pName}>Starter</div>
          <div className={styles.pSub}>For small teams</div>
          <div className={styles.pCost}>
            ₹999<span className={styles.pMo}> /mo</span>
          </div>
          <div className={styles.pList}>
            <div>
              <span className={styles.pCheck}>✓</span> 5 Job Posts
            </div>
            <div>
              <span className={styles.pCheck}>✓</span> Basic ATS
            </div>
            <div>
              <span className={styles.pCheck}>✓</span> Email Support
            </div>
          </div>
          <div className={styles.pBtn}>Get Started</div>
        </div>

        {/* Growth */}
        <div className={styles.pColFeat}>
          <div className={styles.pRibbon}>Most Popular</div>
          <div className={styles.pName}>Growth</div>
          <div className={styles.pSub}>For growing businesses</div>
          <div className={styles.pCost}>
            ₹2,499<span className={styles.pMo}> /mo</span>
          </div>
          <div className={styles.pList}>
            <div>
              <span className={styles.pCheck}>✓</span> Unlimited Posts
            </div>
            <div>
              <span className={styles.pCheck}>✓</span> Advanced ATS
            </div>
            <div>
              <span className={styles.pCheck}>✓</span> Priority Support
            </div>
          </div>
          <div className={styles.pBtnAct}>Get Started</div>
        </div>

        {/* Enterprise */}
        <div className={styles.pCol}>
          <div className={styles.pName}>Enterprise</div>
          <div className={styles.pSub}>For large teams</div>
          <div
            className={styles.pCost}
            style={{ fontSize: "2.4cqw", marginBottom: "1.9cqw" }}
          >
            Custom Pricing
          </div>
          <div className={styles.pList}>
            <div>
              <span className={styles.pCheck}>✓</span> All Features
            </div>
            <div>
              <span className={styles.pCheck}>✓</span> Dedicated Manager
            </div>
            <div>
              <span className={styles.pCheck}>✓</span> Custom Integrations
            </div>
          </div>
          <div className={styles.pBtn}>Contact Sales</div>
        </div>
      </div>
      <div className={styles.cPlay}>
        <div className={styles.cTri} />
      </div>
      <div className={styles.cBadge}>00:54</div>
    </div>
  );
}

function InlineVideoCard({ card }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      document.querySelectorAll("[data-home-inline-video]").forEach((otherVideo) => {
        if (otherVideo !== video) otherVideo.pause();
      });
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  }

  return (
    <article className={styles.videoCard} data-public-reveal="scale">
      <div className={styles.thumbnailWrapper}>
        <video
          ref={videoRef}
          className={styles.inlineVideo}
          src={card.videoSrc}
          poster={card.posterSrc}
          preload="metadata"
          playsInline
          data-home-inline-video={card.id}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          aria-label={card.title}
        />
        <button
          type="button"
          className={styles.previewPlayButton}
          onClick={togglePlayback}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${card.title}`}
          aria-pressed={isPlaying}
          data-inline-reel={card.id}
        >
          {!isPlaying && (
            <span className={styles.inlinePlayIcon} aria-hidden="true">
              <Play />
            </span>
          )}
        </button>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.numberBadge} aria-hidden="true">{card.id}</div>
        <div className={styles.cardText}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDesc}>{card.description}</p>
          <button type="button" className={styles.cardInstagramLink} onClick={togglePlayback}>
            {isPlaying ? "Pause video" : "Play video here"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomeVideoSection() {
  function playFirstVideo() {
    const firstVideoButton = document.querySelector('[data-inline-reel="01"]');
    firstVideoButton?.scrollIntoView({ behavior: "smooth", block: "center" });
    firstVideoButton?.click();
  }

  return (
    <section className={styles.videoSection} id="how-9jobs-works" aria-label="About 9Jobs">
      {/* Background Dot Grid Matrix for Premium SaaS Feel */}
      <div className={styles.dotGridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.headerWrapper}>
          {/* Top Badge */}
          <div>
            <span className={styles.topBadge}>
              <span className={styles.topBadgeIcon}>
                <Play size={12} fill="#65a30d" color="#65a30d" />
              </span>
              <span>Learn • Explore • Grow</span>
            </span>
          </div>

          {/* Main Title */}
          <h2 className={styles.title}>
            About <span className={styles.highlight}>9Jobs</span>
          </h2>

          {/* Description matching exact reference */}
          <p className={styles.description}>
            Three short videos to help you understand our ATS process, what makes us different, and how much each plan costs.
          </p>
        </div>

        {/* 3 Video Cards Grid */}
        <div className={styles.cardsGrid} data-public-stagger="100">
          {videoCardsData.map((card) => <InlineVideoCard key={card.id} card={card} />)}
        </div>

        {/* CTA Buttons Row */}
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={playFirstVideo}
          >
            <Play className={styles.primaryBtnPlay} size={14} />
            <span>Watch All Videos</span>
            <ArrowRight size={17} />
          </button>

          <Link href="/features" className={styles.secondaryBtn} prefetch={false}>
            <LayoutGrid size={17} color="#65a30d" />
            <span>Explore 9Jobs</span>
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Bottom Benefits Row */}
        <div className={styles.benefitsRow} data-public-stagger="100">
          {/* Benefit 1 */}
          <div className={styles.benefitItem}>
            <div className={styles.benefitIconBox}>
              <GraduationCap size={22} />
            </div>
            <div className={styles.benefitText}>
              <h4 className={styles.benefitTitle}>Short & Simple Videos</h4>
              <p className={styles.benefitSubtitle}>Get the information you need, quickly</p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className={styles.benefitItem}>
            <div className={styles.benefitIconBox}>
              <Zap size={22} />
            </div>
            <div className={styles.benefitText}>
              <h4 className={styles.benefitTitle}>Make Smarter Hiring Decisions</h4>
              <p className={styles.benefitSubtitle}>See the real value of 9Jobs</p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className={styles.benefitItem}>
            <div className={styles.benefitIconBox}>
              <Heart size={22} />
            </div>
            <div className={styles.benefitText}>
              <h4 className={styles.benefitTitle}>Built for Growing Businesses</h4>
              <p className={styles.benefitSubtitle}>From startups to enterprises</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

