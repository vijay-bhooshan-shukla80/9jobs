"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Share2,
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Briefcase,
  Calendar,
  Sparkles,
  Info,
  Check,
  X,
  MessageSquarePlus,
} from "lucide-react";
import { clientReviews, reviewsStats, placedCompaniesList } from "../../data/reviewsData";
import { Marquee } from "../../components/homepage/HomeMotion";

const brandLogos = [
  { name: "kfm", src: "/assets/logo-1.png", width: 156, height: 90 },
  { name: "AR", src: "/assets/logo-2.png", width: 192, height: 80 },
  { name: "thryv", src: "/assets/logo-3.png", width: 180, height: 73 },
  { name: "Dynamic Outreach", src: "/assets/logo-4.png", width: 432, height: 83 },
  { name: "Too Good To Go", src: "/assets/logo-5.png", width: 148, height: 139 },
];

const categoryPills = [
  "All",
  "ATS Resume",
  "Application Automation",
  "Cloud & DevOps",
  "Finance",
  "Interview Prep",
  "Fast Placement",
];

export default function TestimonialsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showIntegrityInfo, setShowIntegrityInfo] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({ name: "", role: "", company: "", rating: 5, review: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const toggleHelpful = (id) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = (id, review) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/testimonials#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const filteredReviews = useMemo(() => {
    return clientReviews.filter((rev) => {
      // Rating filter
      if (selectedRating !== "all" && rev.rating !== Number(selectedRating)) {
        return false;
      }
      // Tag filter
      if (selectedTag !== "All") {
        const matchesTag = rev.tags.some(
          (t) => t.toLowerCase().includes(selectedTag.toLowerCase()) || selectedTag.toLowerCase().includes(t.toLowerCase())
        );
        const matchesCompany = rev.placement.company.toLowerCase().includes(selectedTag.toLowerCase());
        const matchesRole = rev.placement.role.toLowerCase().includes(selectedTag.toLowerCase());
        if (!matchesTag && !matchesCompany && !matchesRole) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = rev.name.toLowerCase().includes(q);
        const inReview = rev.review.toLowerCase().includes(q);
        const inTitle = rev.title.toLowerCase().includes(q);
        const inCompany = rev.placement.company.toLowerCase().includes(q);
        const inRole = rev.placement.role.toLowerCase().includes(q);
        const inTags = rev.tags.some((t) => t.toLowerCase().includes(q));
        if (!inName && !inReview && !inTitle && !inCompany && !inRole && !inTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "oldest") return a.id.localeCompare(b.id);
      return 0;
    });
  }, [searchQuery, selectedTag, selectedRating, sortBy]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowWriteReviewModal(false);
      setReviewSubmitted(false);
      setNewReviewForm({ name: "", role: "", company: "", rating: 5, review: "" });
    }, 2000);
  };

  return (
    <main className="tp-page-wrapper">
      {/* Breadcrumbs */}
      <div className="tp-container tp-breadcrumb-bar">
        <Link href="/" className="tp-breadcrumb-link">Home</Link>
        <span className="tp-breadcrumb-separator">/</span>
        <span className="tp-breadcrumb-link">Public & Local Services</span>
        <span className="tp-breadcrumb-separator">/</span>
        <span className="tp-breadcrumb-link">Employment Search Service</span>
        <span className="tp-breadcrumb-separator">/</span>
        <span className="tp-breadcrumb-current">9Jobs Verified Client Reviews</span>
      </div>

      {/* Main Profile Header matching Trustpilot Layout */}
      <section className="tp-profile-header-section">
        <div className="tp-container">
          <div className="tp-profile-grid">
            {/* Left Header info */}
            <div className="tp-profile-main">
              <div className="tp-profile-top-row">
                <div className="tp-avatar-box">
                  <div className="tp-company-logo-circle">
                    <span className="tp-company-logo-text">9J</span>
                  </div>
                </div>
                <div className="tp-profile-headline">
                  <div className="tp-claimed-pill">
                    <ShieldCheck size={14} className="tp-icon-verified" />
                    <span>Claimed profile • March 2026</span>
                  </div>
                  <h1 className="tp-company-name">9Jobs Australia</h1>
                  <div className="tp-rating-summary-row">
                    <span className="tp-reviews-counter">Reviews {reviewsStats.totalReviews}</span>
                    <span className="tp-dot">•</span>
                    <div className="tp-star-group">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="tp-star-box tp-star-box--filled">
                          <Star size={14} className="tp-star-svg" />
                        </span>
                      ))}
                    </div>
                    <span className="tp-score-badge">{reviewsStats.score}</span>
                    <button
                      type="button"
                      onClick={() => setShowScoreModal(true)}
                      className="tp-info-trigger"
                      title="How is the TrustScore calculated?"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <p className="tp-category-tags">
                    <span>Employment Search Service</span>
                    <span className="tp-dot">•</span>
                    <span>Resume Writing Australia</span>
                    <span className="tp-dot">•</span>
                    <span>Job Placement</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="tp-profile-actions">
                <button
                  type="button"
                  onClick={() => setShowWriteReviewModal(true)}
                  className="tp-btn-primary"
                >
                  <MessageSquarePlus size={16} />
                  <span>Write a review</span>
                </button>
                <a
                  href="tel:+61422279428"
                  className="tp-btn-secondary"
                >
                  <Phone size={16} />
                  <span>Book a call (+61 422 279 428)</span>
                </a>
                <Link
                  href="/"
                  className="tp-btn-outline"
                >
                  <span>Visit website</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>

            {/* Right TrustScore Overview Card */}
            <div className="tp-score-overview-card">
              <div className="tp-score-overview-header">
                <div className="tp-score-large">{reviewsStats.score}</div>
                <div>
                  <div className="tp-score-label">{reviewsStats.ratingLabel}</div>
                  <div className="tp-star-group">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="tp-star-box tp-star-box--filled">
                        <Star size={13} className="tp-star-svg" />
                      </span>
                    ))}
                  </div>
                  <div className="tp-total-subtext">{reviewsStats.totalReviews} verified reviews</div>
                </div>
              </div>

              {/* Star distribution bars */}
              <div className="tp-distribution-bars">
                {reviewsStats.breakdown.map((item) => (
                  <button
                    key={item.stars}
                    type="button"
                    onClick={() => setSelectedRating(selectedRating === String(item.stars) ? "all" : String(item.stars))}
                    className={`tp-bar-row ${selectedRating === String(item.stars) ? "tp-bar-row--active" : ""}`}
                  >
                    <span className="tp-bar-label">{item.stars}-star</span>
                    <div className="tp-bar-track">
                      <div
                        className="tp-bar-fill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="tp-bar-percentage">{item.percentage}%</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowScoreModal(true)}
                className="tp-score-explain-link"
              >
                How is the TrustScore calculated?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Integrity Notice Banner */}
      <div className="tp-container tp-mt-4">
        <div className="tp-integrity-banner">
          <div className="tp-integrity-icon-col">
            <ShieldCheck size={20} className="tp-shield-blue" />
          </div>
          <div className="tp-integrity-text-col">
            <div className="tp-integrity-title">
              We verify real candidate placement results across Australia
            </div>
            <p className="tp-integrity-desc">
              Every review on this page is from candidates who engaged 9Jobs for Australian resume ATS optimization, job application automation, and recruiter interview coaching. Placements at companies like KFM Logistics, Thryv, and Dynamic Outreach are independently documented.
            </p>
          </div>
          <button
            type="button"
            className="tp-integrity-toggle"
            onClick={() => setShowIntegrityInfo(!showIntegrityInfo)}
          >
            {showIntegrityInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Placed Companies Clean Marquee */}
      <section className="tp-placed-logos-strip">
        <div className="tp-container">
          <div className="tp-strip-headline">
            <span className="tp-strip-badge">
              <CheckCircle2 size={13} className="tp-icon-green" /> Verified Placements
            </span>
            <span>Companies where our reviewed candidates have secured roles</span>
          </div>
          <div className="tp-marquee-wrapper">
            <Marquee
              className="tp-logo-marquee"
              itemClassName="tp-logo-marquee__item"
              speed="24s"
              ariaLabel="Companies hiring 9Jobs candidates"
            >
              {brandLogos.map((logo) => (
                <div key={logo.name} className="tp-logo-card">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    className="tp-logo-img"
                    width={logo.width}
                    height={logo.height}
                    unoptimized
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Main Content Layout: Left = Reviews & Filters, Right = Company Info & Placed Roles */}
      <section className="tp-content-section">
        <div className="tp-container tp-layout-grid">
          {/* LEFT COLUMN: Search, Filters, Reviews List */}
          <div className="tp-reviews-column">
            {/* Header / Notice */}
            <div className="tp-column-heading-row">
              <div>
                <h2 className="tp-column-title">
                  All reviews <span className="tp-count-pill">({filteredReviews.length})</span>
                </h2>
                <p className="tp-subtext">{reviewsStats.totalReviews} reviews in the last 12 months</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWriteReviewModal(true)}
                className="tp-write-btn-compact"
              >
                <MessageSquarePlus size={14} />
                Write a review
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="tp-search-bar">
              <Search size={18} className="tp-search-icon" />
              <input
                type="text"
                placeholder="Search reviews by name, role, or company (e.g. Thryv, Developer, ATS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tp-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="tp-clear-search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Pills & Sorting */}
            <div className="tp-filter-bar">
              <div className="tp-pills-scroll">
                <span className="tp-pills-label">Top mentions:</span>
                {categoryPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setSelectedTag(pill)}
                    className={`tp-pill-btn ${selectedTag === pill ? "tp-pill-btn--active" : ""}`}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              <div className="tp-sort-dropdown-wrap">
                <SlidersHorizontal size={14} className="tp-sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="tp-sort-select"
                >
                  <option value="recent">Most recent</option>
                  <option value="highest">Highest rated (5★)</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {/* Active filters indicators */}
            {(selectedTag !== "All" || selectedRating !== "all" || searchQuery) && (
              <div className="tp-active-filter-chips">
                <span className="tp-active-filters-label">Active filters:</span>
                {selectedTag !== "All" && (
                  <span className="tp-chip">
                    Topic: {selectedTag}
                    <button onClick={() => setSelectedTag("All")}>&times;</button>
                  </span>
                )}
                {selectedRating !== "all" && (
                  <span className="tp-chip">
                    {selectedRating} Stars
                    <button onClick={() => setSelectedRating("all")}>&times;</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="tp-chip">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}>&times;</button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTag("All");
                    setSelectedRating("all");
                    setSearchQuery("");
                  }}
                  className="tp-clear-all-link"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Reviews Cards List */}
            <div className="tp-reviews-list">
              {filteredReviews.length === 0 ? (
                <div className="tp-empty-reviews">
                  <p>No reviews match your search or filter criteria.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTag("All");
                      setSelectedRating("all");
                      setSearchQuery("");
                    }}
                    className="tp-btn-secondary"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const isHelpful = helpfulReviews[rev.id];
                  const currentHelpfulCount = rev.helpfulCount + (isHelpful ? 1 : 0);
                  const isCopied = copiedId === rev.id;

                  return (
                    <article key={rev.id} id={rev.id} className="tp-review-card">
                      {/* Candidate info row */}
                      <div className="tp-card-header">
                        <div className="tp-author-details">
                          <div
                            className="tp-author-avatar"
                            style={{ backgroundColor: rev.avatarBg }}
                          >
                            {rev.initials}
                          </div>
                          <div>
                            <div className="tp-author-name-row">
                              <h3 className="tp-author-name">{rev.name}</h3>
                              <span className="tp-verified-badge" title="Verified Candidate Placement">
                                <CheckCircle2 size={13} className="tp-verified-check" />
                                Verified Placement
                              </span>
                            </div>
                            <div className="tp-author-meta">
                              <span>{rev.countryCode}</span>
                              <span className="tp-dot">•</span>
                              <span>{rev.reviewsCount} review</span>
                              <span className="tp-dot">•</span>
                              <span>{rev.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="tp-review-date">{rev.date}</div>
                      </div>

                      {/* Stars & Title */}
                      <div className="tp-card-rating-row">
                        <div className="tp-star-group">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i} className="tp-star-box tp-star-box--filled">
                              <Star size={13} className="tp-star-svg" />
                            </span>
                          ))}
                        </div>
                        <span className="tp-date-exp">Date of experience: {rev.experienceDate}</span>
                      </div>

                      {/* Placement Company Tag (Prominently Highlighted) */}
                      <div className="tp-placement-highlight">
                        <div className="tp-placement-badge">
                          <Briefcase size={14} className="tp-briefcase-icon" />
                          <span>Placed at:</span>
                          <strong className="tp-company-bold">{rev.placement.company}</strong>
                          <span className="tp-placement-role">({rev.placement.role})</span>
                        </div>
                      </div>

                      {/* Review Title */}
                      <h4 className="tp-review-heading">{rev.title}</h4>

                      {/* Review Body */}
                      <p className="tp-review-body-text">{rev.review}</p>

                      {/* Review Tags */}
                      <div className="tp-review-tags">
                        {rev.tags.map((t) => (
                          <span key={t} className="tp-review-tag-pill">
                            #{t}
                          </span>
                        ))}
                        {rev.unprompted && (
                          <span className="tp-unprompted-badge">Unprompted review</span>
                        )}
                      </div>

                      {/* Card Footer: Useful, Share */}
                      <div className="tp-card-footer">
                        <div className="tp-footer-actions">
                          <button
                            type="button"
                            onClick={() => toggleHelpful(rev.id)}
                            className={`tp-action-btn ${isHelpful ? "tp-action-btn--active" : ""}`}
                          >
                            <ThumbsUp size={14} />
                            <span>Useful ({currentHelpfulCount})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(rev.id, rev)}
                            className="tp-action-btn"
                          >
                            {isCopied ? <Check size={14} className="tp-icon-green" /> : <Share2 size={14} />}
                            <span>{isCopied ? "Link Copied!" : "Share"}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Company Details, Contact, Placement Statistics */}
          <aside className="tp-sidebar-column">
            {/* Company Details Card */}
            <div className="tp-sidebar-card">
              <h3 className="tp-sidebar-title">Company details</h3>
              <div className="tp-category-pill-group">
                <span className="tp-detail-pill">Employment Search Service</span>
                <span className="tp-detail-pill">Employment Consultant</span>
                <span className="tp-detail-pill">Resume Writing Australia</span>
              </div>
              <div className="tp-company-story">
                <h4 className="tp-story-heading">Written by 9Jobs</h4>
                <p>
                  The modern Australian job search demands significant time and attention—resources better allocated toward meaningful interview preparation and career development. 9Jobs offers a complete done-for-you solution.
                </p>
                <p>
                  Each client is paired with a dedicated Australian Career & Application Specialist who develops a thorough understanding of your professional background, career objectives, and target positions. Your specialist tailors your resume to Australian ATS standards, customizes cover letters, and submits strategic applications directly to hiring managers on SEEK and LinkedIn.
                </p>
              </div>
            </div>

            {/* Official Contact & Support Card */}
            <div className="tp-sidebar-card tp-contact-card">
              <div className="tp-card-title-row">
                <h3 className="tp-sidebar-title">Official Contact & Support</h3>
                <span className="tp-contact-verified-badge">Verified</span>
              </div>
              <ul className="tp-contact-list">
                <li className="tp-contact-item">
                  <div className="tp-contact-icon-box">
                    <MapPin size={16} className="tp-contact-icon" />
                  </div>
                  <div className="tp-contact-text-box">
                    <span className="tp-contact-label">Location</span>
                    <span className="tp-contact-val">Melbourne, Australia</span>
                  </div>
                </li>
                <li className="tp-contact-item">
                  <div className="tp-contact-icon-box">
                    <Phone size={16} className="tp-contact-icon" />
                  </div>
                  <div className="tp-contact-text-box">
                    <span className="tp-contact-label">Direct Support</span>
                    <a href="tel:+61422279428" className="tp-contact-link">+61 422 279 428</a>
                  </div>
                </li>
                <li className="tp-contact-item">
                  <div className="tp-contact-icon-box">
                    <Mail size={16} className="tp-contact-icon" />
                  </div>
                  <div className="tp-contact-text-box">
                    <span className="tp-contact-label">Email Inquiries</span>
                    <a href="mailto:9jobsapplicationservice@gmail.com" className="tp-contact-link tp-contact-link--email">
                      9jobsapplicationservice@gmail.com
                    </a>
                  </div>
                </li>
                <li className="tp-contact-item">
                  <div className="tp-contact-icon-box">
                    <Globe size={16} className="tp-contact-icon" />
                  </div>
                  <div className="tp-contact-text-box">
                    <span className="tp-contact-label">Official Portal</span>
                    <a href="https://9jobs.co" target="_blank" rel="noopener noreferrer" className="tp-contact-link">
                      9jobs.co
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Placed Companies List Card */}
            <div className="tp-sidebar-card">
              <h3 className="tp-sidebar-title">Candidate Placement Partners</h3>
              <p className="tp-sidebar-desc">
                Australian businesses and enterprises where our reviewed clients currently work:
              </p>
              <div className="tp-companies-list">
                {placedCompaniesList.map((comp) => (
                  <div key={comp.name} className="tp-comp-item">
                    <div className="tp-comp-logo-box">
                      <Image
                        src={comp.logo}
                        alt={comp.name}
                        width={80}
                        height={35}
                        className="tp-comp-logo-img"
                        unoptimized
                      />
                    </div>
                    <div className="tp-comp-info">
                      <strong className="tp-comp-name">{comp.name}</strong>
                      <span className="tp-comp-loc">{comp.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust & Safety Card */}
            <div className="tp-sidebar-card tp-sidebar-card--highlight">
              <div className="tp-guarantee-head">
                <ShieldCheck size={20} className="tp-icon-green" />
                <h4>Authenticity Assurance</h4>
              </div>
              <p>
                Companies on 9Jobs aren&apos;t allowed to offer incentives or pay to hide reviews. Every review reflects real candidates who landed interviews and job offers in Australia.
              </p>
              <Link href="/contact" className="tp-learn-more-link">
                Speak with our team ➔
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* TrustScore Calculation Modal */}
      {showScoreModal && (
        <div className="tp-modal-backdrop" onClick={() => setShowScoreModal(false)}>
          <div className="tp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3 className="tp-modal-title">How is the TrustScore calculated?</h3>
              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="tp-modal-close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="tp-modal-body">
              <p>
                The TrustScore is a measure of client satisfaction based on verified reviews collected by 9Jobs.
              </p>
              <ul className="tp-modal-list">
                <li>
                  <strong>Time-weighted algorithm:</strong> Recent reviews carry more weight in the score calculation than older ones.
                </li>
                <li>
                  <strong>Verified placement checks:</strong> Reviews submitted by candidates with confirmed Australian placement records are prioritized.
                </li>
                <li>
                  <strong>Bayesian average:</strong> 9Jobs applies a standard statistical formula that ensures a fair score representation based on consistent feedback.
                </li>
              </ul>
              <div className="tp-modal-score-highlight">
                <span className="tp-score-box-big">4.8</span>
                <div>
                  <strong>Excellent (4.8 / 5.0)</strong>
                  <div>Based on 13 verified candidate reviews across Australia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {showWriteReviewModal && (
        <div className="tp-modal-backdrop" onClick={() => setShowWriteReviewModal(false)}>
          <div className="tp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tp-modal-header">
              <h3 className="tp-modal-title">Write a review for 9Jobs</h3>
              <button
                type="button"
                onClick={() => setShowWriteReviewModal(false)}
                className="tp-modal-close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="tp-modal-body">
              {reviewSubmitted ? (
                <div className="tp-success-box">
                  <CheckCircle2 size={40} className="tp-icon-green" />
                  <h4>Thank you for your feedback!</h4>
                  <p>Your review has been submitted for platform verification.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="tp-review-form">
                  <div className="tp-form-field">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Henderson"
                      value={newReviewForm.name}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                    />
                  </div>
                  <div className="tp-form-field">
                    <label>Placed Company & Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Developer at KFM Logistics"
                      value={newReviewForm.company}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, company: e.target.value })}
                    />
                  </div>
                  <div className="tp-form-field">
                    <label>Rating</label>
                    <div className="tp-star-input-group">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewForm({ ...newReviewForm, rating: star })}
                          className={`tp-star-select-btn ${newReviewForm.rating >= star ? "tp-star-select-btn--active" : ""}`}
                        >
                          <Star size={20} fill={newReviewForm.rating >= star ? "#00b67a" : "none"} stroke="#00b67a" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="tp-form-field">
                    <label>Your Review *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your experience with resume optimization, job application support, and interview outcomes..."
                      value={newReviewForm.review}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, review: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="tp-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Submit Review for Verification
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
