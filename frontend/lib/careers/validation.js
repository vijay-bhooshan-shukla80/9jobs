import { z } from 'zod';
import { departments } from '@/data/careers';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const clean = (value) => typeof value === 'string' ? value.normalize('NFKC').trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g, '') : value;
const text = (max, min = 1) => z.preprocess(clean, z.string().min(min, 'This field is required.').max(max, `Use ${max} characters or fewer.`));
const url = (required = false) => z.preprocess(clean, z.string().max(500).refine(value => {
  if (!value) return !required;
  try { const parsed = new URL(value); return parsed.protocol === 'https:' && !parsed.username && !parsed.password; } catch { return false; }
}, 'Enter a valid HTTPS URL.'));
export const applicationSchema = z.object({
  fullName: text(120, 2),
  email: z.preprocess(value => typeof value === 'string' ? value.trim().toLowerCase() : value, z.email('Enter a valid email address.').max(254)),
  phone: text(32).refine(value => /^\+?[\d\s().-]{7,32}$/.test(value) && value.replace(/\D/g, '').length >= 7 && value.replace(/\D/g, '').length <= 15, 'Enter a valid phone number.'),
  location: text(160),
  position: text(160, 2),
  submissionType: z.enum(['expression-of-interest', 'role-interest']).optional(),
  experience: z.enum(['0–1', '1–3', '3–5', '5–10', '10+'], {error: 'Select your experience.'}),
  linkedin: url(true).refine(value => { try { return /^(www\.)?linkedin\.com$/.test(new URL(value).hostname) && new URL(value).pathname.startsWith('/in/'); } catch { return false; } }, 'Enter a LinkedIn profile URL.'),
  portfolio: url(), coverLetter: text(5000, 0), additionalInformation: text(2000, 0),
  consent: z.literal('true', {error: 'Please agree to the privacy policy.'}),
  preferredDepartment: z.string().optional(),
}).superRefine((data, context) => {
  if ((data.submissionType === 'expression-of-interest' || data.position === 'expression-of-interest') && !departments.includes(data.preferredDepartment)) context.addIssue({code: 'custom', path: ['preferredDepartment'], message: 'Select your preferred department.'});
});
export function fieldErrors(error) {
  return Object.fromEntries(error.issues.map(issue => [issue.path[0], issue.message]));
}
