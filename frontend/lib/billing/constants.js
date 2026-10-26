export const BILLING_STATES = {
  PENDING_AGREEMENT: 'PENDING_AGREEMENT',
  PENDING_CHECKOUT: 'PENDING_CHECKOUT',
  ACTIVE_SUBSCRIPTION: 'ACTIVE_SUBSCRIPTION',
  PAYMENT_ACTION_REQUIRED: 'PAYMENT_ACTION_REQUIRED',
  CANCEL_AT_PERIOD_END: 'CANCEL_AT_PERIOD_END',
  CANCELLED: 'CANCELLED',
  OVERDUE: 'OVERDUE',
  SUCCESS_FEE_DUE: 'SUCCESS_FEE_DUE',
  COMPLETED: 'COMPLETED',
};

export const BILLING_PLAN_TYPES = {
  NONE: 'none',
  STANDARD_WEEKLY: 'standard_weekly',
  SUCCESS_BASED: 'success_based',
};

export const DEFAULT_WEEKLY_TERMS_VERSION = 'weekly-subscription-v2';

export const ONE_TIME_CHECKOUT_PLANS = {
  'Trial Plan': {
    unitAmount: 5390,
    currency: 'aud',
    description: 'Trial Plan: AUD $49 + 10% GST ($4.90), total AUD $53.90 - 2 days',
    mode: 'payment',
  },
  'Standard Plan + GST': {
    unitAmount: 16390,
    currency: 'aud',
    description: 'Standard Plan: AUD $149 + 10% GST ($14.90), total AUD $163.90 per week',
    mode: 'subscription',
    recurring: { interval: 'week' },
  },
  'Premium Plan': {
    unitAmount: 164890,
    currency: 'aud',
    description: 'Premium Plan: AUD $1,499 + 10% GST ($149.90), total AUD $1,648.90 - one-time payment',
    mode: 'payment',
  },
  Trial: {
    unitAmount: 4900,
    currency: 'aud',
    description: 'Trial plan - / 2 days',
    mode: 'payment',
  },
  'Standard Plan': {
    unitAmount: 14900,
    currency: 'aud',
    description: 'Standard weekly job-support subscription',
    mode: 'subscription',
    recurring: {
      interval: 'week',
    },
  },
  'Standard 2-Week Sprint': {
    unitAmount: 27000,
    currency: 'aud',
    description: 'Standard two-week job-application sprint',
    mode: 'payment',
  },
  'Standard 4-Week Sprint': {
    unitAmount: 50000,
    currency: 'aud',
    description: 'Standard four-week job-application sprint',
    mode: 'payment',
  },
  'Two-Month Success-Based': {
    unitAmount: 19900,
    currency: 'aud',
    description: 'Two-Month Success-Based onboarding fee',
    mode: 'payment',
  },
  'Resume Makeover': {
    unitAmount: 4900,
    currency: 'aud',
    description: 'Resume Makeover plan - one-time',
  },
  'Resume Makeover + GST': {
    unitAmount: 5390,
    currency: 'aud',
    description: 'Resume Makeover: AUD $49 + 10% GST ($4.90), total AUD $53.90 - one-time payment',
    mode: 'payment',
  },
  'Resume, LinkedIn & SEEK Optimisation + GST': {
    unitAmount: 9790,
    currency: 'aud',
    description: 'Resume, LinkedIn & SEEK Optimisation: AUD $89 + 10% GST ($8.90), total AUD $97.90 - one-time payment',
    mode: 'payment',
  },
  'Resume + LinkedIn Optimisation': {
    unitAmount: 8900,
    currency: 'aud',
    description: 'Resume + LinkedIn Optimisation plan - one-time',
  },
  'Resume + LinkedIn + Seek Optimization': {
    unitAmount: 8900,
    currency: 'aud',
    description: 'Resume + LinkedIn + Seek Optimization plan - one-time',
  },
  'Resume + LinkedIn + SEEK Optimisation': {
    unitAmount: 8900,
    currency: 'aud',
    description: 'Resume + LinkedIn + SEEK Optimisation plan - one-time',
  },
  'Resume, LinkedIn & SEEK Optimisation': {
    unitAmount: 8900,
    currency: 'aud',
    description: 'Resume, LinkedIn & SEEK Optimisation plan - one-time',
  },
};

export const SUCCESS_FEE_DEFAULT_DESCRIPTION = '9Jobs success fee';
