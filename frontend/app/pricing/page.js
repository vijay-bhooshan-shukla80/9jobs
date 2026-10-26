import { ArrowRight, Check, Sparkles, Rocket, ChartNoAxesColumnIncreasing, Crown, Zap, Gift, ShieldCheck, Headphones, FileText, MapPinned } from "lucide-react";
import styles from "./pricing.module.css";
import { CalendlyLink } from "../../components/CalendlyWidget";
import PricingCheckoutButton from "../../components/PricingCheckoutButton";
import ResumePricingSection from "../../components/ResumePricingSection";
import { JsonLd, createBreadcrumbSchema, createSeoMetadata, getRouteSeo } from "../../data/seo";
import { Reveal, StaggerContainer, StaggerItem, HoverCard, PageTransition } from "../../components/homepage/HomeMotion";

const plans = [
  {
    name: "Trial Plan",
    icon: "trial",
    price: "AUD $49",
    period: "/ 2 days",
    billing: "One-time payment",
    highlights: ["Experience our complete job application process with no commitment."],
    items: [
      "2-day guided job application trial",
      "Australian job search & application demo",
      "Resume review",
      "Cover letter support",
      "LinkedIn, SEEK, Indeed & Jora workflow overview",
      "Applications submitted on your behalf",
      "2-day support window",
    ],
    ctaLabel: "Pay Now",
  },
  {
    name: "Standard Plan",
    checkoutPlanName: "Standard Plan + GST",
    icon: "standard",
    price: "AUD $149",
    period: "/ week",
    billing: "Recurring billing",
    highlights: ["100+ Job Applications / Week", "Just A$1.49 per application (before GST)"],
    items: [
      "100+ targeted job applications every week",
      "Professional resume creation & optimization",
      "Tailored cover letter creation",
      "LinkedIn optimization",
      "SEEK, Indeed & Jora profile optimization",
      "Applications submitted on your behalf",
      "Weekly progress tracking",
      "Dedicated job-search support",
    ],
    highlighted: true,
    ctaLabel: "Pay Now",
  },
  {
    name: "Premium Plan",
    icon: "premium",
    price: "AUD $1,499",
    period: "/ one-time payment",
    billing: "2 months",
    highlights: ["Everything managed for your job search"],
    items: [
      "Everything in Standard",
      "Dedicated job-search manager",
      "Resume creation and updates",
      "Tailored cover letter creation",
      "LinkedIn, SEEK, Indeed & Jora optimization",
      "Priority application management",
      "Custom job targeting strategy",
      "Weekly progress updates and tracking",
      "1 interview free preparation session",
      "10 interview opportunities target",
    ],
    dark: true,
    ctaLabel: "Pay Now",
  },
];

const planIcons = { trial: Rocket, standard: ChartNoAxesColumnIncreasing, premium: Crown };
const trustItems = [
  { icon: ShieldCheck, title: "Secure Payments", detail: "SSL encrypted & safe checkout" },
  { icon: Headphones, title: "Dedicated Support", detail: "Real human support team" },
  { icon: FileText, title: "Transparent Pricing", detail: "No hidden fees. GST clearly shown." },
  { icon: MapPinned, title: "Australian Focus", detail: "Jobs from SEEK, Indeed, Jora & more" },
];

const routeSeo = getRouteSeo("/pricing");

export const metadata = createSeoMetadata(routeSeo);

export default function PricingPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
  ]);

  return (
    <PageTransition>
      <main className="site-main fj-page" data-fj-motion-root="true">
        <JsonLd schema={breadcrumbSchema} />
        <section className={styles.section} aria-labelledby="pricing-title">
          <div className={styles.container}>
            <Reveal direction="down" duration={0.6}>
              <header className={styles.heading}>
                <h1 id="pricing-title">Choose <span>Your Plan</span></h1>
                <p>Flexible support for every stage of your Australian job search.</p>
              </header>
            </Reveal>
            <StaggerContainer as="div" className={styles.grid} stagger={0.1}>
              {plans.map((plan) => {
                const Icon = planIcons[plan.icon];
                return (
                  <StaggerItem as="div" className={styles.cardSlot} key={plan.name}>
                    <HoverCard className={`${styles.card} ${plan.dark ? styles.dark : ""} ${plan.highlighted ? styles.popular : ""}`}>
                      {plan.highlighted && <span className={styles.popularBadge}>Most Popular</span>}
                      {plan.dark && <span className={styles.valueBadge}>Best Value</span>}
                      <div className={styles.planHeading}>
                        <span className={styles.icon}><Icon size={30} strokeWidth={2.6} aria-hidden="true" /></span>
                        <div>
                          <h2>{plan.name}</h2>
                        </div>
                      </div>
                      <div className={styles.price}><strong>{plan.price}</strong><span>+ 10% GST</span></div>
                      <p className={styles.period}>{plan.period}<span>·</span>{plan.billing}</p>
                      <div className={styles.highlights}>
                        {plan.highlights.map((highlight, index) => {
                          const HighlightIcon = plan.dark ? Gift : plan.highlighted ? (index === 0 ? Zap : ChartNoAxesColumnIncreasing) : Sparkles;
                          return <div className={styles.highlight} key={highlight}><HighlightIcon size={23} aria-hidden="true" /><span>{highlight}</span></div>;
                        })}
                      </div>
                      <ul className={styles.features}>
                        {plan.items.map((item) => <li key={item}><Check size={21} strokeWidth={3} aria-hidden="true" /><span>{item}</span></li>)}
                      </ul>
                      <div className={styles.actions}>
                        <PricingCheckoutButton plan={plan} className={`${styles.button} ${styles.payButton}`} />
                        <CalendlyLink className={styles.button}>Get a schedule <ArrowRight size={23} aria-hidden="true" /></CalendlyLink>
                      </div>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            <div className={styles.trust}>
              {trustItems.map(({ icon: Icon, title, detail }) => (
                <div className={styles.trustItem} key={title}><Icon size={38} strokeWidth={1.8} aria-hidden="true" /><div><strong>{title}</strong><span>{detail}</span></div></div>
              ))}
            </div>
          </div>
        </section>

        <ResumePricingSection />

        <section className="fj-section fj-section--tight">
          <div className="fj-container">
            <Reveal direction="up" distance={24}>
              <div className="fj-final-cta">
                <Sparkles size={28} />
                <span>Need a custom setup</span>
                <h2>Book a short demo and we will map the right <span className="heading-mark">flow.</span></h2>
                <CalendlyLink className="fj-button fj-button--dark">
                  Schedule a demo
                </CalendlyLink>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
