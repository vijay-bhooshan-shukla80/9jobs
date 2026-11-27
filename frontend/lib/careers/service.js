import { createHash, randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import connectDB from '@/utils/db';
import CareerApplication from '@/models/CareerApplication';
import { roles } from '@/data/careers';
import { deliverCareerEmails } from './email';

const hash = value => createHash('sha256').update(value).digest('hex');

export function assertCareersDatabase({requireEnabled = true} = {}) {
  if (requireEnabled && process.env.CAREERS_APPLICATIONS_ENABLED !== 'true') throw Object.assign(new Error('Careers submissions are not configured.'), {status: 503});
  // Never use the repository's remote/production credentials during local development.
  if (process.env.NODE_ENV !== 'production') {
    const uri = process.env.MONGODB_URI || '';
    if (!/^mongodb:\/\/(127\.0\.0\.1|localhost|\[::1\]):\d+\/9jobs_careers_test(?:\?|$)/.test(uri) || (mongoose.connection.readyState === 1 && mongoose.connection.name !== '9jobs_careers_test')) {
      throw Object.assign(new Error('A local Careers test database is required.'), {status: 503});
    }
  }
}

export async function submitCareerApplication(data, resume, key, ip) {
  assertCareersDatabase();
  await connectDB();
  const db = mongoose.connection.db;
  // Dedicated indexes/collections; existing rate-limit records remain untouched.
  const limits = db.collection('career_rate_limits');
  await limits.createIndex({expiresAt: 1}, {expireAfterSeconds: 0});
  const window = Math.floor(Date.now() / 900000);
  const limit = await limits.findOneAndUpdate({_id: hash(`careers:${ip}:${window}`)}, {$inc: {attempts: 1}, $setOnInsert: {expiresAt: new Date((window + 2) * 900000)}}, {upsert: true, returnDocument: 'after'});
  if (limit.attempts > 5) throw Object.assign(new Error('Too many applications. Please try again in 15 minutes.'), {status: 429});
  await CareerApplication.init();
  const digest = hash(resume.buffer);
  const fingerprint = hash(JSON.stringify(data) + digest);
  const idempotencyKey = hash(key);
  const existing = await CareerApplication.findOne({idempotencyKey}).select('+fingerprint');
  if (existing) {
    if (existing.fingerprint !== fingerprint || existing.persistenceState !== 'complete') throw Object.assign(new Error('This submission is already being processed. Please wait before retrying.'), {status: 409});
    return {reference: existing.reference, duplicate: true};
  }
  const role = roles.find(role => role.slug === data.position || role.title.toLowerCase() === data.position.toLowerCase());
  const positionTitle = role?.title || (data.position === 'expression-of-interest' ? 'Expression of Interest' : data.position);
  const positionKey = role?.slug || data.position.toLowerCase();
  const application = await CareerApplication.create({
    ...data, consent: undefined, consentAt: new Date(), privacyPolicyPath: '/privacy-policy',
    positionTitle, applicationKind: 'Expression of Interest',
    reference: `9J-${randomUUID().toUpperCase()}`, idempotencyKey, fingerprint,
    duplicateKey: hash(`${data.email}:${positionKey}:${Math.floor(Date.now() / 86400000)}`),
  }).catch(error => { if (error.code === 11000) throw Object.assign(new Error('An application for this position has already been received recently. Please do not resubmit.'), {status: 409}); throw error; });
  const bucket = new mongoose.mongo.GridFSBucket(db, {bucketName: 'career_resumes'});
  const upload = bucket.openUploadStream(`${randomUUID()}.${resume.extension}`, {contentType: resume.contentType, metadata: {applicationId: application._id}});
  try {
    await new Promise((resolve, reject) => { upload.once('finish', resolve); upload.once('error', reject); upload.end(resume.buffer); });
    application.resume = {id: upload.id, fileName: `resume.${resume.extension}`, contentType: resume.contentType, size: resume.size, sha256: digest};
    application.persistenceState = 'complete';
    await application.save();
  } catch {
    try { if (!upload.writableFinished) await upload.abort(); else await bucket.delete(upload.id); } catch { /* Retain uploading record if cleanup cannot be confirmed. */ throw Object.assign(new Error('Unable to finish storing your resume. Please contact 9Jobs before retrying.'), {status: 503}); }
    await CareerApplication.deleteOne({_id: application._id, persistenceState: 'uploading'});
    throw Object.assign(new Error('Unable to save your application. Your information has not been submitted; please retry.'), {status: 503});
  }
  // Persistence is final even if delivery fails. Delivery states are retained for reconciliation.
  try { await deliverCareerEmails(application); } catch { /* Never report a saved application as failed. */ }
  return {reference: application.reference, duplicate: false};
}
