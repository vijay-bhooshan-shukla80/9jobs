import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockSendEmail = jest.fn().mockResolvedValue(undefined);
jest.doMock('@/lib/email/delivery', () => ({ sendEmail: mockSendEmail }));

describe.each(['agreements', 'fortnight-agreements'])('%s client invitation email', (kind) => {
  beforeEach(() => jest.clearAllMocks());

  test('includes the original PDF and a direct review link before the unchanged signing link', async () => {
    const { sendClientSigningInvite } = await import(`@/lib/${kind}/email`);
    const pdfBuffer = Buffer.from('%PDF-1.4 original agreement bytes');
    await sendClientSigningInvite({ _id: 'agreement-1', clientName: 'Client', clientEmail: 'client@example.com' }, 'client-token', pdfBuffer);

    const email = mockSendEmail.mock.calls[0][0];
    expect(email.to).toBe('client@example.com');
    expect(email.attachments).toEqual([{
      filename: '9jobs-agreement-agreement-1.pdf', content: pdfBuffer, contentType: 'application/pdf',
    }]);
    expect(email.attachments[0].content).toBe(pdfBuffer);
    expect(email.html).toContain(`/api/${kind}/agreement-1/preview-original?token=client-token`);
    expect(email.html).toContain(`/${kind}/agreement-1/sign?token=client-token`);
    expect(email.html.indexOf('View Agreement PDF')).toBeLessThan(email.html.indexOf('>Review and Sign Contract'));
    expect(email.html).toContain('phone or computer');
  });

  test('keeps secure PDF review available when the PDF exceeds the attachment limit', async () => {
    const { sendClientSigningInvite } = await import(`@/lib/${kind}/email`);
    await sendClientSigningInvite({ _id: 'agreement-1', clientName: 'Client', clientEmail: 'client@example.com' }, 'client-token', Buffer.alloc(20 * 1024 * 1024 + 1));
    const email = mockSendEmail.mock.calls[0][0];
    expect(email.attachments).toEqual([]);
    expect(email.html).toContain('View Agreement PDF');
    expect(email.html).not.toContain('PDF attached to this email');
  });

  test('uses the local origin and explains that only the client needs to sign', async () => {
    const { sendClientSigningInvite } = await import(`@/lib/${kind}/email`);
    await sendClientSigningInvite({ _id: 'agreement-1', clientName: 'Client', clientEmail: 'client@example.com', providerSignature: { signedAt: new Date() } }, 'client-token', Buffer.from('%PDF'), 'http://localhost:3000/api/send');
    const email = mockSendEmail.mock.calls[0][0];
    expect(email.html).toContain(`http://localhost:3000/${kind}/agreement-1/sign`);
    expect(email.html).toContain('already signed');
  });
});

test('local invitations use the localhost origin and explain the provider signature', async () => {
  mockSendEmail.mockClear();
  const { sendClientSigningInvite } = await import('@/lib/agreements/email');
  await sendClientSigningInvite({ _id: 'agreement-1', clientName: '<Client>', clientEmail: 'client@example.com', providerSignature: { signedAt: new Date() } }, 'client-token', Buffer.from('%PDF'), 'http://localhost:3000/api/docusign/send/agreement-1');
  const email = mockSendEmail.mock.calls[0][0];
  expect(email.html).toContain('http://localhost:3000/agreements/agreement-1/sign');
  expect(email.html).toContain('already signed');
  expect(email.html).toContain('&lt;Client&gt;');
  expect(email.html).toContain('role="presentation"');
});
