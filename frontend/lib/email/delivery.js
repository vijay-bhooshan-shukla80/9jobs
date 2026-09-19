const DEFAULT_FROM_EMAIL = 'accounts@9jobs.co';

function getFromEmail() {
  return process.env.MAIL_FROM || DEFAULT_FROM_EMAIL;
}

function getFromName() {
  return '9Jobs Contract Service';
}

async function sendViaSendGrid({ to, bcc, subject, html, attachments = [] }) {
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
        {
          type: 'text/html',
          value: html,
        },
      ],
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
}

async function sendViaGmail({ to, bcc, subject, html, attachments = [] }) {
  const nodemailer = (await import('nodemailer')).default;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailPass) {
    throw new Error('Email delivery cannot proceed: GMAIL_PASS is not configured.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER || getFromEmail(),
      pass: gmailPass,
    },
  });

  await transporter.sendMail({
    from: `"${getFromName()}" <${getFromEmail()}>`,
    replyTo: getFromEmail(),
    to,
    ...(bcc?.length ? { bcc } : {}),
    subject,
    html,
    attachments,
  });
}

export async function sendEmail(options) {
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
