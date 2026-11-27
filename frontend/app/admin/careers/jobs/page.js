import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import JobActions from '@/components/careers/JobActions';
import { requireAdminPageSession } from '@/lib/admin/auth/require-admin';
import { listAdminJobs } from '@/lib/careers/jobs';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Job Posting | 9Jobs Admin'};
export default async function JobPostingPage() {
  await requireAdminPageSession();
  let jobs;
  try { jobs = await listAdminJobs(); } catch {
    return <AdminShell title="Job Posting" eyebrow="Careers"><section className="admin-panel"><h2>Job postings are unavailable</h2><p>Please check the Careers database connection and refresh this page.</p></section></AdminShell>;
  }
  return <AdminShell title="Job Posting" eyebrow="Careers"><section className="admin-panel">
    <div className="admin-panel__header"><div><h2>Manage Careers Jobs</h2><p>Create, edit, publish or close roles for your internal team.</p></div><Link className="admin-primary-button" href="/admin/careers/jobs/new">Create Job</Link></div>
    {jobs.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Job title</th><th>Department</th><th>Location</th><th>Employment</th><th>Status</th><th>Actions</th></tr></thead><tbody>{jobs.map(job => <tr key={job.id}><td><strong>{job.title}</strong></td><td>{job.department}</td><td>{job.location}</td><td>{job.type} · {job.arrangement}</td><td>{job.status[0].toUpperCase() + job.status.slice(1)}</td><td><JobActions id={job.id} slug={job.slug} title={job.title} published={job.status === 'published'} /></td></tr>)}</tbody></table></div> : <p>No jobs have been posted yet. Create a job and set its publication status to Published to show it on Careers.</p>}
  </section></AdminShell>;
}
