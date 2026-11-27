import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminPageSession } from '@/lib/admin/auth/require-admin';
import { getAdminJob } from '@/lib/careers/jobs';
import JobEditor from '@/components/careers/JobEditor';
export const dynamic = 'force-dynamic';
export default async function EditCareerJobPage({params}) {
  await requireAdminPageSession();
  const {id} = await params;
  const job = await getAdminJob(id);
  if (!job) notFound();
  return <AdminShell title="Edit Job" eyebrow="Job Posting"><section className="admin-panel"><h2>{job.title}</h2><JobEditor job={job} /></section></AdminShell>;
}
