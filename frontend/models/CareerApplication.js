import mongoose from 'mongoose';

const delivery = new mongoose.Schema({
  state: {type: String, enum: ['pending', 'sending', 'sent', 'failed', 'disabled'], default: 'pending'},
  attempts: {type: Number, default: 0}, attemptedAt: Date, sentAt: Date, messageId: String,
  errorCode: String,
}, {_id: false});
const schema = new mongoose.Schema({
  reference: {type: String, required: true, unique: true},
  idempotencyKey: {type: String, required: true, unique: true, select: false},
  fingerprint: {type: String, required: true, select: false},
  duplicateKey: {type: String, required: true, unique: true, select: false},
  fullName: String, email: String, phone: String, location: String, position: String,
  positionTitle: String, preferredDepartment: String, experience: String, linkedin: String,
  portfolio: String, coverLetter: String, additionalInformation: String,
  consentAt: Date, privacyPolicyPath: String,
  applicationKind: {type: String, enum: ['Expression of Interest', 'Vacancy Application'], required: true},
  status: {type: String, default: 'Pending', enum: ['Pending']},
  source: {type: String, default: 'Careers Website', enum: ['Careers Website']},
  persistenceState: {type: String, enum: ['uploading', 'complete'], default: 'uploading'},
  resume: {id: mongoose.Schema.Types.ObjectId, fileName: String, contentType: String, size: Number, sha256: String},
  emails: {applicant: {type: delivery, default: () => ({})}, recruitment: {type: delivery, default: () => ({})}},
}, {timestamps: true, collection: 'career_applications'});
export default mongoose.models.CareerApplication || mongoose.model('CareerApplication', schema);
