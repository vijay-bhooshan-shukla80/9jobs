const DEFAULT_FROM_EMAIL = 'accounts@9jobs.co';

function getFromEmail() {
  return process.env.MAIL_FROM || DEFAULT_FROM_EMAIL;
}

function getFromName() {
  return '9Jobs Contract Service';
}

function htmlToText(html) {
  return String(html || '')
    .replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<\/?(?:p|div|h[1-6]|tr|br)\b[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ').replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

async function sendViaSendGrid({ to, bcc, subject, html, text, attachments = [] }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not configured.');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        personalizations: [
        {
          to: [{ email: to }],
          ...(bcc?.length ? { bcc: bcc.map((email) => ({ email })) } : {}),
          subject,
        },
      ],
      from: {
        email: getFromEmail(),
        name: getFromName(),
      },
      reply_to: {
        email: getFromEmail(),
        name: getFromName(),
      },
      content: [
        { type: 'text/plain', value: text },
        {
          type: 'text/html',
          value: html,
        },
      ],
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false },
        open_tracking: { enable: false },
      },
      attachments: attachments.map((attachment) => ({
        content: attachment.content.toString('base64'),
        filename: attachment.filename,
        type: attachment.contentType || 'application/octet-stream',
        disposition: 'attachment',
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`SendGrid delivery failed (${response.status}): ${errorText || 'unknown error'}`);
  }
  return { provider: 'sendgrid', messageId: response.headers.get('x-message-id') || '' };
}

async function sendViaGmail({ to, bcc, subject, html, text, attachments = [] }) {
  const nodemailer = (await import('nodemailer')).default;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailPass) {
    throw new Error('Email delivery cannot proceed: GMAIL_PASS is not configured.');
  }

  const smtpUser = process.env.GMAIL_USER || getFromEmail();
  const configuredFrom = getFromEmail();
  // A personal Gmail login cannot authenticate a different From domain.
  const fromEmail = smtpUser.split('@')[1]?.toLowerCase() === configuredFrom.split('@')[1]?.toLowerCase()
    ? configuredFrom : smtpUser;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: gmailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });

  const result = await transporter.sendMail({
    from: { name: getFromName(), address: fromEmail },
    replyTo: getFromEmail(),
    to,
    ...(bcc?.length ? { bcc } : {}),
    subject,
    html,
    text,
    attachments,
  });
  return { provider: 'gmail', messageId: result.messageId, accepted: result.accepted, rejected: result.rejected };
}

export async function sendEmail(options) {
  options = { ...options, text: options.text || htmlToText(options.html) };
  const provider = String(process.env.EMAIL_PROVIDER || '').trim().toLowerCase();
  if (provider === 'gmail') return sendViaGmail(options);
  if (process.env.SENDGRID_API_KEY) {
    try {
      return await sendViaSendGrid(options);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const canFallbackToGmail =
        /Maximum credits exceeded/i.test(message) ||
        /SendGrid delivery failed \(401\)/i.test(message) ||
        /SendGrid delivery failed \(402\)/i.test(message) ||
        /SendGrid delivery failed \(403\)/i.test(message);

      if (!canFallbackToGmail) {
        throw error;
      }

      console.warn('[email-delivery] SendGrid unavailable, falling back to Gmail SMTP:', message);
      return sendViaGmail(options);
    }
  }

  return sendViaGmail(options);
}
