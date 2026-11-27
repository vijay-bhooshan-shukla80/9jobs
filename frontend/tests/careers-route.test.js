import { jest } from '@jest/globals';

const submit = jest.fn(), assertDatabase = jest.fn(), validateResume = jest.fn();
jest.doMock('@/lib/careers/service', () => ({submitCareerApplication: submit, assertCareersDatabase: assertDatabase}));
jest.doMock('@/lib/careers/resume', () => ({validateResume, ResumeError: class ResumeError extends Error {}}));
let POST;
beforeAll(async () => {({POST} = await import('@/app/api/careers/applications/route'));});
const data = {fullName: 'Test Candidate', email: 'candidate@example.test', phone: '+61400000000', location: 'Sydney', position: 'full-stack-developer', experience: '1–3', linkedin: 'https://linkedin.com/in/test', portfolio: '', coverLetter: '', additionalInformation: '', consent: 'true'};
function request(overrides = {}, options = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({...data, ...overrides})) form.set(key, value);
  form.set('resume', new File(['fake-only-in-mocked-upload-test'], 'resume.pdf', {type: 'application/pdf'}));
  return new Request('http://localhost:3000/api/careers/applications', {method:'POST', body:form, headers:{origin:'http://localhost:3000', 'idempotency-key':'12345678-1234-1234-1234-123456789012', ...options}});
}
beforeEach(() => {jest.clearAllMocks(); assertDatabase.mockImplementation(() => {}); validateResume.mockResolvedValue({buffer:Buffer.from('test')}); submit.mockResolvedValue({reference:'9J-TEST', duplicate:false});});
test('returns success only after persistence service resolves and exposes no private data', async () => {
  const response = await POST(request()); expect(response.status).toBe(201);
  expect(await response.json()).toEqual({success:true, reference:'9J-TEST'}); expect(submit).toHaveBeenCalledTimes(1);
});
test('idempotent replay uses 200', async () => {submit.mockResolvedValue({reference:'9J-TEST', duplicate:true}); expect((await POST(request())).status).toBe(200);});
test('invalid fields are rejected before upload or persistence', async () => {const response = await POST(request({email:'invalid', consent:'false'})); expect(response.status).toBe(422); expect((await response.json()).fields.email).toBeTruthy(); expect(submit).not.toHaveBeenCalled();});
test('cross-origin requests are rejected', async () => {expect((await POST(request({}, {origin:'https://evil.test'}))).status).toBe(403); expect(submit).not.toHaveBeenCalled();});
test('missing idempotency key is rejected', async () => {expect((await POST(request({}, {'idempotency-key':''}))).status).toBe(400);});
test('oversized body is rejected', async () => {expect((await POST(request({}, {'content-length':'9000000'}))).status).toBe(413);});
test('missing local configuration is reported without persistence', async () => {assertDatabase.mockImplementation(() => {throw Object.assign(new Error('A local Careers test database is required.'), {status:503});}); expect((await POST(request())).status).toBe(503); expect(submit).not.toHaveBeenCalled();});
test('rate limiting has Retry-After', async () => {submit.mockRejectedValue(Object.assign(new Error('Too many applications.'), {status:429})); const response = await POST(request()); expect(response.status).toBe(429); expect(response.headers.get('Retry-After')).toBe('900');});
test('database failure has no false success or internal error disclosure', async () => {submit.mockRejectedValue(new Error('private-connection-secret')); const response = await POST(request()); expect(response.status).toBe(500); expect(JSON.stringify(await response.json())).not.toContain('private-connection-secret');});
