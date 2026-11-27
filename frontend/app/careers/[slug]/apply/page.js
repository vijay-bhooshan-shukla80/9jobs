import { notFound } from 'next/navigation';
import { roles } from '@/data/careers';
import ApplicationForm from '@/components/careers/ApplicationForm';

export const metadata = {title: 'Apply | 9Jobs Careers', robots: {index: false, follow: false}};
export default async function ApplyPage({params}) {
  const {slug} = await params;
  const role = roles.find(role => role.slug === slug);
  if (!role) notFound();
  return <ApplicationForm key={role.slug} role={role} />;
}
