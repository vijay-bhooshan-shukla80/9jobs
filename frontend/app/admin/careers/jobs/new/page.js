import AdminShell from '@/components/admin/AdminShell';
import { requireAdminPageSession } from '@/lib/admin/auth/require-admin';
import JobEditor from '@/components/careers/JobEditor';
export const dynamic = 'force-dynamic';
export default async function NewCareerJobPage() {
  await requireAdminPageSession();
  return <AdminShell title="Create Job" eyebrow="Job Posting"><section className="admin-panel"><h2>New Careers Job</h2><JobEditor /></section></AdminShell>;
}
