import { beforeEach, afterEach, describe, expect, jest, test } from '@jest/globals';

const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }));
jest.doMock('nodemailer', () => ({ __esModule: true, default: { createTransport: mockCreateTransport } }));
const keys = ['EMAIL_PROVIDER', 'GMAIL_USER', 'GMAIL_PASS', 'MAIL_FROM', 'SENDGRID_API_KEY'];
const originalEnv = Object.fromEntries(keys.map(key => [key, process.env[key]]));
const originalFetch = global.fetch;
const mockFetch = jest.fn();

describe('authenticated agreement email delivery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_PROVIDER = 'gmail';
    process.env.GMAIL_USER = 'Info@9jobs.co';
    process.env.GMAIL_PASS = 'test-app-password';
    process.env.MAIL_FROM = 'accounts@9jobs.co';
    process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
    global.fetch = mockFetch;
    mockSendMail.mockResolvedValue({ messageId: 'test-id', accepted: ['client@example.com'], rejected: [] });
  });
  afterEach(() => {
    global.fetch = originalFetch;
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  });

  test('local SMTP preference bypasses unauthenticated SendGrid and sends text, HTML, and the PDF', async () => {
    const { sendEmail } = await import('@/lib/email/delivery');
    const attachments = [{ filename: 'agreement.pdf', content: Buffer.from('%PDF'), contentType: 'application/pdf' }];
    const result = await sendEmail({ to: 'client@example.com', subject: 'Your agreement', html: '<p>Review &amp; sign</p><a href="http://localhost:3000/review">View Agreement PDF</a>', attachments });
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockCreateTransport.mock.calls[0][0].auth.user).toBe('Info@9jobs.co');
    expect(mockSendMail.mock.calls[0][0]).toMatchObject({
      from: { address: 'accounts@9jobs.co' },
      text: 'Review & sign\nView Agreement PDF (http://localhost:3000/review)', attachments,
    });
    expect(result.provider).toBe('gmail');
  });

  test('a personal Gmail account uses its authenticated From address for a different domain', async () => {
    process.env.GMAIL_USER = 'sender@gmail.com';
    const { sendEmail } = await import('@/lib/email/delivery');
    await sendEmail({ to: 'client@example.com', subject: 'Agreement', html: '<p>Review your agreement</p>' });
    expect(mockSendMail.mock.calls[0][0].from.address).toBe('sender@gmail.com');
    expect(mockSendMail.mock.calls[0][0].replyTo).toBe('accounts@9jobs.co');
  });

  test('SendGrid preserves direct review links and includes both MIME text types', async () => {
    delete process.env.EMAIL_PROVIDER;
    mockFetch.mockResolvedValue({ ok: true, headers: new Headers({ 'x-message-id': 'sendgrid-id' }) });
    const { sendEmail } = await import('@/lib/email/delivery');
    await sendEmail({ to: 'client@example.com', subject: 'Agreement', html: '<p>Read your agreement</p>' });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.content.map(part => part.type)).toEqual(['text/plain', 'text/html']);
    expect(body.tracking_settings.click_tracking.enable).toBe(false);
    expect(body.tracking_settings.open_tracking.enable).toBe(false);
  });
});
