import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminPageSession } from '@/lib/admin/auth/require-admin';
import { getCareerApplication } from '@/lib/careers/admin';
import ApplicationEditor from '@/components/careers/ApplicationEditor';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Edit Careers Application | 9Jobs Admin'};
export default async function EditCareerApplicationPage({params}) {
  await requireAdminPageSession();const {id} = await params;
  const record = await getCareerApplication(id);if (!record) notFound();
  const application = {id: String(record._id)};
  for (const key of ['fullName','email','phone','location','experience','linkedin','portfolio','coverLetter','additionalInformation','status']) application[key] = record[key] || '';
  application.position = record.positionTitle || record.position || '';
  return <AdminShell title="Edit Careers Application" eyebrow="Applicant details" showCreateActions={false}><section className="admin-panel"><h2>{record.fullName}</h2><ApplicationEditor application={application} /></section></AdminShell>;
}
