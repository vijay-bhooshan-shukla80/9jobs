// Explicitly opt in: localhost MongoDB + loopback SMTP only. Never uses repository credentials.
import {jest} from '@jest/globals';
import net from 'node:net';
import {randomUUID} from 'node:crypto';
import mongoose from 'mongoose';
import {PDFDocument} from 'pdf-lib';

jest.setTimeout(60000);
const enabled = process.env.RUN_LOCAL_CAREERS_INTEGRATION === 'true';
const run = enabled ? describe : describe.skip;
run('Careers database, admin query and real loopback SMTP', () => {
  let server, original, submit, model, list, get, file, data, key, saved;
  const messages=[];
  beforeAll(async () => {
    original={...process.env};
    process.env.MONGODB_URI='mongodb://127.0.0.1:27017/9jobs_careers_test';
    process.env.CAREERS_APPLICATIONS_ENABLED='true';
    process.env.CAREERS_EMAIL_ENABLED='true';
    process.env.CAREERS_EMAIL_TRANSPORT='local';
    process.env.CAREERS_SMTP_HOST='127.0.0.1';
    process.env.ADMIN_EMAIL='careers-admin@example.test';
    delete process.env.CAREERS_NOTIFICATION_EMAIL;
    server=net.createServer(socket => {
      let buffer='', inData=false, lines=[], recipients=[];
      socket.write('220 localhost Careers test SMTP\r\n');
      socket.on('data',chunk=>{
        buffer+=chunk.toString();
        while(buffer.includes('\r\n')){
          const at=buffer.indexOf('\r\n'), line=buffer.slice(0,at);buffer=buffer.slice(at+2);
          if(inData){if(line==='.') {messages.push({recipients:[...recipients],body:lines.join('\n')});lines=[];recipients=[];inData=false;socket.write('250 captured locally\r\n');}else lines.push(line);continue;}
          if(/^EHLO|^HELO/i.test(line))socket.write('250 localhost\r\n');
          else if(/^MAIL FROM:/i.test(line)){recipients=[];socket.write('250 ok\r\n');}
          else if(/^RCPT TO:/i.test(line)){recipients.push(line);socket.write('250 ok\r\n');}
          else if(/^DATA$/i.test(line)){inData=true;socket.write('354 end with dot\r\n');}
          else if(/^QUIT$/i.test(line)){socket.end('221 bye\r\n');}
          else socket.write('250 ok\r\n');
        }
      });
    });
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    process.env.CAREERS_SMTP_PORT=String(server.address().port);
    ({submitCareerApplication:submit}=await import('@/lib/careers/service'));
    ({default:model}=await import('@/models/CareerApplication'));
    ({listCareerApplications:list,getCareerApplication:get}=await import('@/lib/careers/admin'));
    const {applicationSchema}=await import('@/lib/careers/validation');
    const {validateResume}=await import('@/lib/careers/resume');
    key=randomUUID();
    data=applicationSchema.parse({fullName:'Local Careers Integration',email:'careers-'+key+'@example.test',phone:'+61400000000',location:'Sydney',position:'Senior Career Support Specialist',experience:'3–5',linkedin:'https://linkedin.com/in/local-careers-test',portfolio:'https://example.test/portfolio',coverLetter:'Controlled cover letter',additionalInformation:'Controlled additional details',consent:'true'});
    const pdf=await PDFDocument.create();pdf.addPage();file=await validateResume(new File([await pdf.save()],'resume.pdf',{type:'application/pdf'}));
  });
  afterAll(async () => {
    if(saved){const document=await model.findOne({reference:saved.reference});if(document?.resume?.id)await new mongoose.mongo.GridFSBucket(mongoose.connection.db,{bucketName:'career_resumes'}).delete(document.resume.id);await model.deleteOne({reference:saved.reference});}
    await mongoose.disconnect();
    if(server)await new Promise(resolve=>server.close(resolve));
    if(original)process.env={...original};
  });
  test('a saved typed-position application sends both real SMTP messages and is visible to admin queries', async () => {
    saved=await submit(data,file,key,'smtp-local-'+key);
    const record=await model.findOne({reference:saved.reference});
    expect(record.positionTitle).toBe(data.position);
    expect(record.emails.applicant.state).toBe('sent');
    expect(record.emails.recruitment.state).toBe('sent');
    expect(messages).toHaveLength(2);
    expect(messages[0].recipients.join()).toContain(data.email);
    expect(messages[1].recipients.join()).toContain('careers-admin@example.test');
    expect(messages[1].body).not.toContain(saved.reference);
    expect(messages[1].body).toContain('Controlled cover letter');
    expect(messages[1].body).toContain('Controlled additional details');
    const adminList=await list({search:saved.reference});
    expect(adminList.total).toBe(1);expect(adminList.applications[0].positionTitle).toBe(data.position);
    expect((await get(String(record._id))).email).toBe(data.email);
    const replay=await submit(data,file,key,'smtp-local-'+key);
    expect(replay.reference).toBe(saved.reference);expect(messages).toHaveLength(2);
    expect((await list({search:'[.*]'})).total).toBe(0);
  });
});
