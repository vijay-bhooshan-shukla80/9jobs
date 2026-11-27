import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/utils/db';
import CareerJob from '@/models/CareerJob';
import { departments } from '@/data/careers';
import { assertCareersDatabase } from './database';

const clean = value => typeof value === 'string' ? value.normalize('NFKC').trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g, '') : value;
const text = (max, min = 1) => z.preprocess(clean, z.string().min(min, 'This field is required.').max(max, `Use ${max} characters or fewer.`));
const lines = z.array(text(600)).min(1, 'Enter at least one item.').max(30, 'Use 30 items or fewer.');
export const careerJobSchema = z.object({
  title: text(160, 2), department: text(160), location: text(160),
  type: z.enum(['Full-time', 'Part-time', 'Contract']), arrangement: z.enum(['On-site', 'Hybrid', 'Remote']),
  description: text(600), about: text(10000), responsibilities: lines, qualifications: lines,
  skills: z.array(text(100)).min(1, 'Enter at least one skill.').max(30),
  instructions: text(4000, 0).default(''), status: z.enum(['draft', 'published', 'closed']),
});
const publicFields = 'slug title department location type arrangement description about responsibilities qualifications skills instructions';
const icons = ['person_search', 'code', 'business_center', 'campaign', 'support_agent', 'settings_accessibility'];
function serialise(job) {
  return {id: String(job._id), slug: job.slug, title: job.title, department: job.department, location: job.location, type: job.type, arrangement: job.arrangement, description: job.description, about: job.about, responsibilities: job.responsibilities || [], qualifications: job.qualifications || [], skills: job.skills || [], instructions: job.instructions || '', icon: icons[departments.indexOf(job.department)] || 'business_center', ...(job.status ? {status: job.status} : {})};
}
async function connect() { assertCareersDatabase({requireEnabled: false}); await connectDB(); }
export async function listPublishedJobs() {
  await connect();
  return (await CareerJob.find({status: 'published'}).select(publicFields).sort({createdAt: -1}).lean()).map(serialise);
}
export async function getPublishedJob(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]{1,200}$/.test(slug)) return null;
  await connect();
  const job = await CareerJob.findOne({slug, status: 'published'}).select(publicFields).lean();
  return job ? serialise(job) : null;
}
export async function getPublishedJobById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connect();
  const job = await CareerJob.findOne({_id: id, status: 'published'}).select(publicFields).lean();
  return job ? serialise(job) : null;
}
export async function listAdminJobs() {
  await connect();
  return (await CareerJob.find({}).sort({createdAt: -1}).lean()).map(serialise);
}
export async function getAdminJob(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connect();
  const job = await CareerJob.findById(id).lean();
  return job ? serialise(job) : null;
}
export async function saveCareerJob(payload, admin, id) {
  const values = careerJobSchema.parse(payload);
  await connect();
  if (id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const job = await CareerJob.findByIdAndUpdate(id, {$set: {...values, updatedBy: admin.email}}, {returnDocument: 'after', runValidators: true}).lean();
    return job ? serialise(job) : null;
  }
  const base = values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 140) || 'career';
  const job = await CareerJob.create({...values, slug: `${base}-${randomUUID().slice(0, 8)}`, createdBy: admin.email, updatedBy: admin.email});
  return serialise(job);
}
