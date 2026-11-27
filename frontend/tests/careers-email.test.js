import {jest} from '@jest/globals';
const update = jest.fn(), send = jest.fn();
jest.doMock('@/models/CareerApplication', () => ({__esModule:true, default:{updateOne:update}}));
jest.doMock('@/lib/email/delivery', () => ({sendEmail:send}));
let deliverCareerEmails, careersEmailConfiguration;
beforeAll(async () => {({deliverCareerEmails, careersEmailConfiguration} = await import('@/lib/careers/email'));});
const original = {...process.env};
const application = {_id:'test-id', reference:'9J-TEST', fullName:'Test <Candidate>', email:'candidate@example.test', phone:'+61400000000', positionTitle:'Full Stack Developer', createdAt:new Date('2026-11-27T00:00:00Z'), applicationKind:'Expression of Interest', resume:{id:'private-file-id'}};
beforeEach(() => {jest.clearAllMocks(); delete process.env.CAREERS_EMAIL_TRANSPORT; delete process.env.ADMIN_EMAIL; process.env.NODE_ENV='production'; process.env.CAREERS_EMAIL_ENABLED='true'; process.env.CAREERS_NOTIFICATION_EMAIL='recruitment@example.test'; process.env.MAIL_FROM='careers@example.test'; process.env.SENDGRID_API_KEY='mock'; process.env.EMAIL_PROVIDER='sendgrid'; update.mockResolvedValue({modifiedCount:1}); send.mockResolvedValue({messageId:'mock-id'});});
afterEach(() => {process.env = {...original};});
test('delivers both messages through the mocked existing service after atomic claims', async () => {
  await deliverCareerEmails(application); expect(send).toHaveBeenCalledTimes(2);
  expect(send.mock.calls[0][0]).toMatchObject({to:'candidate@example.test', subject:'Application Received – 9Jobs Careers'});
  expect(send.mock.calls[0][0].html).toContain('Test &lt;Candidate&gt;');
  expect(send.mock.calls[1][0].to).toBe('recruitment@example.test');
  expect(update.mock.calls[0][0]).toMatchObject({persistenceState:'complete', 'emails.applicant.state':'pending'});
});
test('duplicate email claims never send again', async () => {update.mockResolvedValue({modifiedCount:0}); await deliverCareerEmails(application); expect(send).not.toHaveBeenCalled();});
test('email failure records attempts and still attempts the internal notification', async () => {send.mockRejectedValueOnce(new Error('sensitive-provider-error')); await deliverCareerEmails(application); expect(send).toHaveBeenCalledTimes(2); expect(update).toHaveBeenCalledWith({_id:'test-id'}, {$set:{'emails.applicant.state':'failed', 'emails.applicant.errorCode':'DELIVERY_FAILED'}});});
test('local mode cannot send live emails without explicit opt-in', async () => {process.env.NODE_ENV='development'; delete process.env.CAREERS_ALLOW_LIVE_EMAIL_IN_DEVELOPMENT; await deliverCareerEmails(application); expect(send).not.toHaveBeenCalled();});
test('explicit development opt-in sends through the existing provider', async () => {process.env.NODE_ENV='development'; process.env.CAREERS_ALLOW_LIVE_EMAIL_IN_DEVELOPMENT='true'; await deliverCareerEmails(application); expect(send).toHaveBeenCalledTimes(2);});
test('development opt-in still requires the email enabled flag', async () => {process.env.NODE_ENV='development'; process.env.CAREERS_ALLOW_LIVE_EMAIL_IN_DEVELOPMENT='true'; process.env.CAREERS_EMAIL_ENABLED='false'; await deliverCareerEmails(application); expect(send).not.toHaveBeenCalled();});
test('missing recruitment configuration is reported and prevents delivery', async () => {delete process.env.CAREERS_NOTIFICATION_EMAIL; expect(careersEmailConfiguration()).toContain('CAREERS_NOTIFICATION_EMAIL or ADMIN_EMAIL'); await deliverCareerEmails(application); expect(send).not.toHaveBeenCalled();});
test('uses the configured admin email and includes all form details', async () => {delete process.env.CAREERS_NOTIFICATION_EMAIL; process.env.ADMIN_EMAIL='admin@example.test'; await deliverCareerEmails({...application, location:'Sydney', experience:'3–5', coverLetter:'My cover letter', additionalInformation:'Available soon'}); const message=send.mock.calls[1][0];expect(message.to).toBe('admin@example.test');expect(message.text).toContain('My cover letter');expect(message.text).toContain('Available soon');expect(message.text).not.toContain('/admin/careers/');});

test('emails omit references, status, timestamps and internal storage links', async () => {await deliverCareerEmails(application);for(const [message] of send.mock.calls){for(const value of [application.reference,'Application Reference','Application reference','Submission:','Kind:','Expression of Interest','career_resumes','/api/admin/','/admin/careers/','Pending'])expect(message.text).not.toContain(value);}});
