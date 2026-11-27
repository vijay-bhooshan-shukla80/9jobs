import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/utils/db';
import CareerApplication from '@/models/CareerApplication';
import { applicationSchema } from './validation';
import { assertCareersDatabase } from './database';

export const applicationEditSchema = z.object({
  fullName: applicationSchema.shape.fullName, email: applicationSchema.shape.email,
  phone: applicationSchema.shape.phone, location: applicationSchema.shape.location,
  position: applicationSchema.shape.position, experience: applicationSchema.shape.experience,
  linkedin: applicationSchema.shape.linkedin, portfolio: applicationSchema.shape.portfolio,
  coverLetter: applicationSchema.shape.coverLetter, additionalInformation: applicationSchema.shape.additionalInformation,
  status: z.enum(['Pending', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected']),
});
async function connect(id) {
  if (!mongoose.isValidObjectId(id)) return false;
  assertCareersDatabase({requireEnabled: false}); await connectDB(); return true;
}
export async function updateCareerApplication(id, payload, admin) {
  const values = applicationEditSchema.parse(payload);
  if (!await connect(id)) return null;
  // Never change the original job, consent, resume, idempotency or email-delivery records.
  return CareerApplication.findOneAndUpdate({_id: id, persistenceState: 'complete', deletedAt: null}, {$set: {...values, positionTitle: values.position, updatedBy: admin.email}}, {returnDocument: 'after', runValidators: true}).select('_id').lean();
}
export async function deleteCareerApplication(id, admin) {
  if (!await connect(id)) return null;
  // Reversible deletion preserves private documents and the original submission audit trail.
  return CareerApplication.findOneAndUpdate({_id: id, persistenceState: 'complete', deletedAt: null}, {$set: {deletedAt: new Date(), deletedBy: admin.email}}, {returnDocument: 'after'}).select('_id').lean();
}
