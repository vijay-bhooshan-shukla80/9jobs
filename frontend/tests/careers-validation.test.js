import { applicationSchema, fieldErrors } from '@/lib/careers/validation';
import { validateResume, ResumeError } from '@/lib/careers/resume';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

export const applicant = {fullName: 'Test Candidate', email: 'candidate@example.test', phone: '+61 400 000 000', location: 'Sydney', position: 'full-stack-developer', experience: '1–3', linkedin: 'https://linkedin.com/in/test-candidate', portfolio: '', coverLetter: '', additionalInformation: '', consent: 'true'};
describe('Careers validation', () => {
  test('validates and sanitises only approved form fields', () => {
    const parsed = applicationSchema.parse({...applicant, fullName: ' <Test Candidate> ', email: 'CANDIDATE@EXAMPLE.TEST', status: 'Approved'});
    expect(parsed.fullName).toBe('Test Candidate'); expect(parsed.email).toBe(applicant.email); expect(parsed.status).toBeUndefined();
  });
  test.each([['email', 'invalid'], ['phone', '1'], ['consent', 'false'], ['linkedin', 'https://evil.test/in/name'], ['portfolio', 'javascript:alert(1)'], ['position', ''], ['fullName', '']])('rejects invalid %s', (key, value) => {
    const parsed = applicationSchema.safeParse({...applicant, [key]: value});
    expect(parsed.success).toBe(false); expect(fieldErrors(parsed.error)[key]).toBeTruthy();
  });
  test('expression of interest requires a department', () => {
    expect(applicationSchema.safeParse({...applicant, position: 'expression-of-interest'}).success).toBe(false);
    expect(applicationSchema.safeParse({...applicant, position: 'expression-of-interest', preferredDepartment: 'Client Success'}).success).toBe(true);
  });
  test('accepts a typed position title and sanitises it', () => {
    expect(applicationSchema.parse({...applicant, position: '  <Senior Recruitment Coordinator>  '}).position).toBe('Senior Recruitment Coordinator');
    expect(applicationSchema.safeParse({...applicant, position: 'x'.repeat(161)}).success).toBe(false);
  });
  test('accepts a real PDF and rejects forged, empty, oversized, wrong-MIME and scripted files', async () => {
    const pdf = await PDFDocument.create(); pdf.addPage();
    const buffer = await pdf.save();
    await expect(validateResume(new File([buffer], 'resume.pdf', {type: 'application/pdf'}))).resolves.toMatchObject({extension: 'pdf', size: buffer.length});
    await expect(validateResume(new File(['%PDF-fake%%EOF'], 'resume.pdf', {type: 'application/pdf'}))).rejects.toBeInstanceOf(ResumeError);
    await expect(validateResume(new File([], 'resume.pdf', {type: 'application/pdf'}))).rejects.toBeInstanceOf(ResumeError);
    await expect(validateResume({size: 6 * 1024 * 1024, arrayBuffer: async () => buffer})).rejects.toBeInstanceOf(ResumeError);
    await expect(validateResume(new File([buffer], 'resume.pdf', {type: 'text/plain'}))).rejects.toBeInstanceOf(ResumeError);
    pdf.catalog.set(PDFName.of('OpenAction'), pdf.context.obj({S: 'JavaScript', JS: PDFString.of('alert(1)')}));
    await expect(validateResume(new File([await pdf.save()], 'resume.pdf', {type: 'application/pdf'}))).rejects.toBeInstanceOf(ResumeError);
  });
  test('rejects a ZIP masquerading as DOCX', async () => {
    await expect(validateResume(new File(['PK\x03\x04not-a-word-file'], 'resume.docx', {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}))).rejects.toBeInstanceOf(ResumeError);
  });
});
