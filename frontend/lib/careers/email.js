import CareerApplication from '@/models/CareerApplication';
import { sendEmail } from '@/lib/email/delivery';

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));

export function getCareersNotificationEmail() {
  return String(process.env.CAREERS_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || '').trim();
}

function localMailTransport() {
  return process.env.NODE_ENV !== 'production' && process.env.CAREERS_EMAIL_TRANSPORT === 'local';
}

async function sendCareersMessage(message) {
  if (!localMailTransport()) return sendEmail(message);
  // Development integration tests can use an actual loopback SMTP capture service.
  // Never permit external delivery or real addresses through this testing transport.
  if (!message.to.endsWith('.test') || !['127.0.0.1', 'localhost', '::1'].includes(process.env.CAREERS_SMTP_HOST || '127.0.0.1')) throw new Error('Invalid local test transport.');
  const nodemailer = (await import('nodemailer')).default;
  const transport = nodemailer.createTransport({host: process.env.CAREERS_SMTP_HOST || '127.0.0.1', port: Number(process.env.CAREERS_SMTP_PORT || 2525), secure: false, ignoreTLS: true, connectionTimeout: 5000, socketTimeout: 10000});
  const result = await transport.sendMail({...message, from: {name: '9Jobs Recruitment Team', address: 'careers@example.test'}});
  return {messageId: result.messageId, rejected: result.rejected};
}

export function careersEmailConfiguration() {
  const missing = [];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getCareersNotificationEmail())) missing.push('CAREERS_NOTIFICATION_EMAIL or ADMIN_EMAIL');
  if (localMailTransport()) {
    if (!getCareersNotificationEmail().endsWith('.test')) missing.push('A .test admin recipient for local SMTP capture');
    return missing;
  }
  if (!process.env.MAIL_FROM) missing.push('MAIL_FROM');
  if (process.env.EMAIL_PROVIDER === 'gmail' ? !process.env.GMAIL_PASS : !(process.env.SENDGRID_API_KEY || process.env.GMAIL_PASS)) missing.push(process.env.EMAIL_PROVIDER === 'gmail' ? 'GMAIL_PASS' : 'SENDGRID_API_KEY or GMAIL_PASS');
  return missing;
}

// Each recipient is claimed atomically before calling the existing delivery service.
// A crash leaves "sending" for manual reconciliation, rather than automatically resending.
export async function deliverCareerEmails(application) {
  const liveDeliveryAllowed = process.env.NODE_ENV === 'production' || process.env.CAREERS_ALLOW_LIVE_EMAIL_IN_DEVELOPMENT === 'true';
  if ((!localMailTransport() && !liveDeliveryAllowed) || process.env.CAREERS_EMAIL_ENABLED !== 'true' || careersEmailConfiguration().length) {
    await CareerApplication.updateOne({_id: application._id}, {$set: {'emails.applicant.state': 'disabled', 'emails.recruitment.state': 'disabled'}});
    return;
  }
  const a = application;
  const applicantDetails = [
    ['Applicant', a.fullName], ['Email', a.email], ['Phone', a.phone],
    ['Current location', a.location], ['Position', a.positionTitle],
    ['Years of experience', a.experience], ['LinkedIn', a.linkedin],
    ['Portfolio', a.portfolio], ['Preferred department', a.preferredDepartment],
    ['Cover letter', a.coverLetter], ['Additional information', a.additionalInformation],
  ].filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n');
  const messages = {
    applicant: {
      to: a.email, subject: 'Application Received – 9Jobs Careers',
      text: `Hi ${a.fullName},\n\nThank you for your interest in the ${a.positionTitle} role at 9Jobs. We’ve received your details and will contact you if a suitable opportunity is available.\n\nKind regards,\n9Jobs Recruitment Team`,
    },
    recruitment: {
      to: getCareersNotificationEmail(), subject: `New Careers Application – ${a.positionTitle}`,
      text: `Hi Team,\n\nA new application has been received for ${a.positionTitle}.\n\n${applicantDetails}\n\nPlease review the applicant’s profile in the Careers section of the Admin Panel.\n\nKind regards,\n9Jobs Recruitment Team`,
    },
  };
  for (const [recipient, message] of Object.entries(messages)) {
    const stateKey = `emails.${recipient}.state`;
    const claimed = await CareerApplication.updateOne({_id: a._id, persistenceState: 'complete', [stateKey]: 'pending'}, {$set: {[stateKey]: 'sending', [`emails.${recipient}.attemptedAt`]: new Date()}, $inc: {[`emails.${recipient}.attempts`]: 1}});
    if (!claimed.modifiedCount) continue;
    try {
      const result = await sendCareersMessage({...message, html: `<div style="font-family:Arial,sans-serif;line-height:1.7">${escape(message.text).replace(/\n/g, '<br>')}</div>`});
      if (result.rejected?.length) throw new Error('recipient-rejected');
      await CareerApplication.updateOne({_id: a._id}, {$set: {[stateKey]: 'sent', [`emails.${recipient}.sentAt`]: new Date(), [`emails.${recipient}.messageId`]: result.messageId || ''}});
    } catch {
      await CareerApplication.updateOne({_id: a._id}, {$set: {[stateKey]: 'failed', [`emails.${recipient}.errorCode`]: 'DELIVERY_FAILED'}});
    }
  }
}
