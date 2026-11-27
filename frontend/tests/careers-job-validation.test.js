import {careerJobSchema} from '@/lib/careers/jobs';

const job = {title:'Approved Job',department:'Product Design & Research',location:'Sydney',type:'Full-time',arrangement:'Hybrid',description:'Approved role summary.',about:'Approved role details.',responsibilities:['Collaborate with the team.'],qualifications:['Relevant experience.'],skills:['Communication'],instructions:'',status:'draft'};
test('accepts and sanitises a custom typed department for job creation and updates', () => {
  expect(careerJobSchema.parse({...job,department:'  <Product Design & Research>  '}).department).toBe(job.department);
});
test.each(['', '   ', 'x'.repeat(161)])('rejects empty or excessive department values', department => {
  const result = careerJobSchema.safeParse({...job,department});
  expect(result.success).toBe(false);
  expect(result.error.issues.some(issue => issue.path[0] === 'department')).toBe(true);
});
