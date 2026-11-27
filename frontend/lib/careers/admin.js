import mongoose from 'mongoose';
import connectDB from '@/utils/db';
import CareerApplication from '@/models/CareerApplication';
import { assertCareersDatabase } from './database';

export async function listCareerApplications({page = 1, search = ''} = {}) {
  assertCareersDatabase({requireEnabled: false});
  await connectDB();
  const query = {persistenceState: 'complete', deletedAt: null};
  const term = String(search).trim().slice(0, 120);
  if (term) {
    const escaped = Array.from(term, char => '\\^$.*+?()[]{}|'.includes(char) ? '\\' + char : char).join('');
    query.$or = ['fullName', 'email', 'positionTitle', 'reference'].map(field => ({[field]: {$regex: escaped, $options: 'i'}}));
  }
  const currentPage = Math.max(1, Math.min(10000, Number.parseInt(page, 10) || 1));
  const [applications, total] = await Promise.all([
    CareerApplication.find(query).sort({createdAt: -1}).skip((currentPage - 1) * 25).limit(25).lean(),
    CareerApplication.countDocuments(query),
  ]);
  return {applications, total, page: currentPage, pages: Math.max(1, Math.ceil(total / 25))};
}

export async function getCareerApplication(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  assertCareersDatabase({requireEnabled: false});
  await connectDB();
  return CareerApplication.findOne({_id: id, persistenceState: 'complete', deletedAt: null}).lean();
}
