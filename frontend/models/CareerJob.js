import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  slug: {type: String, required: true, unique: true},
  title: {type: String, required: true, maxlength: 160},
  department: {type: String, required: true, maxlength: 160},
  location: {type: String, required: true, maxlength: 160},
  type: {type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true},
  arrangement: {type: String, enum: ['On-site', 'Hybrid', 'Remote'], required: true},
  description: {type: String, required: true, maxlength: 600},
  about: {type: String, required: true, maxlength: 10000},
  responsibilities: [String], qualifications: [String], skills: [String],
  instructions: {type: String, maxlength: 4000, default: ''},
  status: {type: String, enum: ['draft', 'published', 'closed'], default: 'draft', index: true},
  createdBy: String, updatedBy: String,
}, {timestamps: true, collection: 'career_jobs'});
schema.index({status: 1, createdAt: -1});
export default mongoose.models.CareerJob || mongoose.model('CareerJob', schema);
