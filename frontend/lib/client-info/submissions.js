// Billing can create a ClientInfo before the client completes onboarding.
// Hide only its exact placeholder profile; never delete or modify stored data.
export function isClientSubmission(client) {
  if (client.submittedAt || client.resumeUrl || client.resumeStorageKey || client.resumeFileName ||
      client.coverLetterUrl || client.coverLetterStorageKey || client.coverLetterFileName) {
    return true;
  }

  const isBillingPlaceholder = client.dob === '1990-01-01' &&
    client.password === 'TempPassword@123' &&
    client.workType === 'Full-time' &&
    ['workingRights', 'address', 'expectedSalary', 'preferredJobLocation', 'noticePeriod', 'preferredRole']
      .every((field) => client[field] === 'Pending update');

  return !isBillingPlaceholder;
}
