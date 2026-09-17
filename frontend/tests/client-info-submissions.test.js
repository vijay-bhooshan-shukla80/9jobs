import { isClientSubmission } from '@/lib/client-info/submissions';

const placeholder = {
  fullName: 'Billing client', contactNo: '0400000000', email: 'client@example.com',
  dob: '1990-01-01', password: 'TempPassword@123', workType: 'Full-time',
  workingRights: 'Pending update', address: 'Pending update',
  expectedSalary: 'Pending update', preferredJobLocation: 'Pending update',
  noticePeriod: 'Pending update', preferredRole: 'Pending update',
};

test('hides the generated billing profile without changing its data', () => {
  const record = Object.freeze({ ...placeholder });
  expect(isClientSubmission(record)).toBe(false);
  expect(record).toEqual(placeholder);
});

test.each(['resumeUrl', 'resumeStorageKey', 'resumeFileName', 'coverLetterUrl',
  'coverLetterStorageKey', 'coverLetterFileName', 'submittedAt'])(
  'keeps submitted profiles with %s even when other fields match placeholders', (field) => {
    expect(isClientSubmission({ ...placeholder, [field]: 'submission-evidence' })).toBe(true);
  }
);

test.each(['dob', 'password', 'workType', 'workingRights', 'address', 'expectedSalary',
  'preferredJobLocation', 'noticePeriod', 'preferredRole'])(
  'preserves legacy profiles whose %s differs from the generated dummy data', (field) => {
    expect(isClientSubmission({ ...placeholder, [field]: 'client-provided-value' })).toBe(true);
  }
);

test('keeps real submissions for the same email as a billing-only record', () => {
  const submission = { ...placeholder, preferredRole: 'Analyst', resumeFileName: 'resume.pdf' };
  expect([placeholder, submission].filter(isClientSubmission)).toEqual([submission]);
});
