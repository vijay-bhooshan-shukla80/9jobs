import { notFound } from 'next/navigation';
import { getPublishedJob } from '@/lib/careers/jobs';
import ApplicationForm from '@/components/careers/ApplicationForm';

export const metadata = {title: 'Apply | 9Jobs Careers', robots: {index: false, follow: false}};
export const dynamic = 'force-dynamic';
export default async function ApplyPage({params}) {
  const {slug} = await params;
  const role = await getPublishedJob(slug);
  if (!role) notFound();
  return <ApplicationForm key={role.slug} role={role} />;
}
