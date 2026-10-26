import { describe, expect, jest, test } from '@jest/globals';
import { ONE_TIME_CHECKOUT_PLANS } from '@/lib/billing/constants';

const checkoutCreate = jest.fn().mockResolvedValue({ url: 'https://checkout.example.com/session' });
jest.doMock('@/lib/billing/stripe', () => ({ getStripeClient: () => ({ checkout: { sessions: { create: checkoutCreate } } }) }));
jest.doMock('@/utils/db', () => ({ __esModule: true, default: jest.fn() }));

describe('pricing page GST checkout amounts', () => {
  test.each([
    ['Trial Plan', 5390, 'payment'],
    ['Standard Plan + GST', 16390, 'subscription'],
    ['Premium Plan', 164890, 'payment'],
    ['Resume Makeover + GST', 5390, 'payment'],
    ['Resume, LinkedIn & SEEK Optimisation + GST', 9790, 'payment'],
  ])('%s uses the advertised price plus 10 percent GST', async (planName, amount, mode) => {
    checkoutCreate.mockClear();
    const { createOneTimePlanCheckout } = await import('@/lib/billing/service');
    await createOneTimePlanCheckout({ planName, origin: 'http://localhost:3000' });
    const checkout = checkoutCreate.mock.calls[0][0];
    expect(checkout.mode).toBe(mode);
    expect(checkout.line_items[0].price_data.unit_amount).toBe(amount);
    expect(checkout.line_items[0].price_data.currency).toBe('aud');
    expect(checkout.line_items[0].price_data.product_data.description).toContain('10% GST');
    if (mode === 'subscription') expect(checkout.line_items[0].price_data.recurring).toEqual({ interval: 'week' });
    else expect(checkout.line_items[0].price_data.recurring).toBeUndefined();
  });

  test('preserves all other existing checkout amounts', () => {
    expect(ONE_TIME_CHECKOUT_PLANS.Trial.unitAmount).toBe(4900);
    expect(ONE_TIME_CHECKOUT_PLANS['Standard Plan'].unitAmount).toBe(14900);
    expect(ONE_TIME_CHECKOUT_PLANS['Two-Month Success-Based'].unitAmount).toBe(19900);
    expect(ONE_TIME_CHECKOUT_PLANS['Resume Makeover'].unitAmount).toBe(4900);
    expect(ONE_TIME_CHECKOUT_PLANS['Standard 2-Week Sprint'].unitAmount).toBe(27000);
    expect(ONE_TIME_CHECKOUT_PLANS['Standard 4-Week Sprint'].unitAmount).toBe(50000);
  });
});
