import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

const root = path.resolve(process.cwd());

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('pricing billing content regression', () => {
  test('offers direct Stripe checkout for all three pricing plans', () => {
    const pricingPage = read('app/pricing/page.js');
    const checkoutButton = read('components/PricingCheckoutButton.js');
    const resumePricingSection = read('components/ResumePricingSection.js');
    const applicationCredits = read('components/homepage/ApplicationCreditsSection.js');
    const dreamCompanyCta = read('components/homepage/DreamCompanyCtaSection.js');
    const billingConstants = read('lib/billing/constants.js');
    const billingService = read('lib/billing/service.js');

    expect(pricingPage).toContain('AUD $49');
    expect(pricingPage).toContain('ctaLabel: "Pay Now"');
    expect(pricingPage).toContain('/ 2 days');
    expect(pricingPage).toContain('Standard Plan');
    expect(pricingPage.match(/ctaLabel: "Pay Now"/g)).toHaveLength(3);
    expect(pricingPage).toContain('Two-Month Success-Based');
    expect(pricingPage).toContain('AUD $149');
    expect(pricingPage).toContain('AUD $199');
    expect(pricingPage).not.toContain('action: "contact"');
    expect(checkoutButton).toContain('/api/billing/one-time-checkout');
    expect(checkoutButton).toContain('fetch(endpoint');
    expect(checkoutButton).not.toContain('NEXT_PUBLIC_API_URL');
    expect(billingConstants).toContain("'Standard Plan'");
    expect(billingConstants).toContain('unitAmount: 14900');
    expect(billingConstants).toContain("mode: 'subscription'");
    expect(billingConstants).toContain("interval: 'week'");
    expect(billingConstants).toContain("'Two-Month Success-Based'");
    expect(billingConstants).toContain('unitAmount: 19900');
    expect(billingConstants).toContain("'Standard 2-Week Sprint'");
    expect(billingConstants).toContain('unitAmount: 27000');
    expect(billingConstants).toContain("'Standard 4-Week Sprint'");
    expect(billingConstants).toContain('unitAmount: 50000');
    expect(billingService).toContain("...(recurring ? { recurring } : {})");
    expect(applicationCredits).toContain('fetch("/api/billing/one-time-checkout"');
    expect(applicationCredits).not.toContain('/contact?intent=');
    expect(dreamCompanyCta).toContain('PricingCheckoutButton');
    expect(dreamCompanyCta).toContain('name: "Standard Plan"');
    expect(resumePricingSection).toContain('PricingCheckoutButton');
    expect(resumePricingSection).toContain('Resume Makeover');
    expect(resumePricingSection).toContain('Resume, LinkedIn & SEEK Optimisation');
  });

  test('adds a personalized billing page with recurring disclosure language', () => {
    const billingPage = read('app/billing/[token]/page.js');

    expect(billingPage).toContain('Secure personalised checkout');
    expect(billingPage).toContain('Charged automatically every week');
    expect(billingPage).toContain('stop future recurring charges');
    expect(billingPage).toContain('Two-Month Success-Based Onboarding');
  });
});
