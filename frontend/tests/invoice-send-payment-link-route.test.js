import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const requireAdminApiSession = jest.fn();
const createInvoicePaymentLink = jest.fn();
const getInvoiceDocumentById = jest.fn();
const sendMail = jest.fn();
const createTransport = jest.fn(() => ({
  sendMail,
}));

async function loadSendPaymentLinkRoute() {
  jest.resetModules();
  jest.doMock('nodemailer', () => ({
    __esModule: true,
    default: {
      createTransport,
    },
  }));
  jest.doMock('@/lib/admin/auth/require-admin', () => ({
    requireAdminApiSession,
  }));
  jest.doMock('@/lib/invoices/service', () => ({
    createInvoicePaymentLink,
    getInvoiceDocumentById,
  }));

  return import('@/app/api/invoices/[id]/send-payment-link/route');
}

describe('invoice send payment-link route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GMAIL_PASS = 'test-password';
    requireAdminApiSession.mockResolvedValue({
      email: 'admin@9jobs.co',
    });
  });

  test('emails only the payment link without pdf attachment', async () => {
    const { POST } = await loadSendPaymentLinkRoute();
    getInvoiceDocumentById.mockResolvedValue({
      _id: 'invoice-1',
      billedToName: 'Neetu & Sharma <Client>',
      dueDate: '2026-09-25',
      duration: '2 MONTHS',
      billedToEmail: 'sharmamelbourne91@gmail.com',
      paymentStatus: 'pending',
      stripeCheckoutUrl: '',
      description: 'Job Application Services',
      total: '150',
    });
    createInvoicePaymentLink.mockResolvedValue({
      checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123',
      whatsappShareUrl: 'https://wa.me/61421803703?text=invoice',
    });

    const response = await POST(
      new Request('http://localhost/api/invoices/invoice-1/send-payment-link', {
        method: 'POST',
      }),
      {
        params: Promise.resolve({ id: 'invoice-1' }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(createInvoicePaymentLink).toHaveBeenCalledWith('invoice-1', 'http://localhost');
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'sharmamelbourne91@gmail.com',
        subject: '9Jobs Payment Details',
        html: expect.stringContaining('href="https://checkout.stripe.com/pay/cs_test_123"'),
      })
    );
    const mail = sendMail.mock.calls[0][0];
    expect(mail.attachments).toBeUndefined();
    expect(mail.attachDataUrls).toBe(true);
    expect(mail.html).toContain('Dear <strong>Neetu &amp; Sharma &lt;Client&gt;</strong>');
    expect(mail.html).toContain('AUD $150');
    expect(mail.html).toContain('2 MONTHS');
    expect(mail.html).toContain('25 September 2026');
    expect(mail.html).toContain('PAY NOW');
    expect(mail.html).toContain('background:#D8FF3F');
    expect(mail.html).not.toContain('[PAYMENT');
    expect(mail.html).not.toContain('Weekly / Monthly');
    expect(body.checkoutUrl).toBe('https://checkout.stripe.com/pay/cs_test_123');
    expect(body.whatsappShareUrl).toBe('https://wa.me/61421803703?text=invoice');
  });
});
