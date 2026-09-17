import Link from "next/link";

export default function DreamCompanyCtaSection() {
  return (
    <section className="fj-section fj-cta-card-section">
      <div className="fj-container">
        <div className="fj-cta-card">
          <span className="fj-cta-card-tag">Found Your Dream Company?</span>
          <h2 className="fj-cta-card-title">We Apply to These Jobs for You</h2>
          <p className="fj-cta-card-desc">
            See a role at Intel, Adobe, Salesforce, or Stripe you want to apply to? Our team handles everything &mdash; tailored resume for each JD, cover letter, and screenshot proof of submission. From $149/month.
          </p>
          <div className="fj-cta-card-actions">
            <Link href="/pricing" className="fj-cta-card-btn-primary" prefetch={false}>
              Get Started &mdash; from $149/mo
            </Link>
            <Link href="/features" className="fj-cta-card-btn-secondary" prefetch={false}>
              Explore Free Tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
