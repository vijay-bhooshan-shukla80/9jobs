import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminPageSession } from '@/lib/admin/auth/require-admin';
import { getCareerApplication } from '@/lib/careers/admin';

export const dynamic = 'force-dynamic';

export default async function CareerApplicationDetailPage({params}) {
  await requireAdminPageSession();
  const {id} = await params;
  const a = await getCareerApplication(id);
  if (!a) notFound();
  const rows = [['Application Reference', a.reference], ['Full Name', a.fullName], ['Email', a.email], ['Phone', a.phone], ['Current Location', a.location], ['Position Applying For', a.positionTitle], ['Years of Experience', a.experience], ['LinkedIn Profile', a.linkedin], ['Portfolio', a.portfolio], ['Preferred Department', a.preferredDepartment], ['Cover Letter', a.coverLetter], ['Additional Information', a.additionalInformation], ['Status', a.status === 'Pending' ? 'Received' : a.status], ['Submission Source', a.source], ['Application Kind', a.applicationKind], ['Privacy Consent', a.consentAt ? new Date(a.consentAt).toISOString() : 'Not recorded'], ['Submitted At (UTC)', new Date(a.createdAt).toISOString()]];
  return <AdminShell title="Careers Application" eyebrow={a.reference}><section className="admin-panel"><div className="admin-panel__header"><div><h2>{a.fullName}</h2><p>{a.positionTitle}</p></div><Link className="admin-secondary-button" href="/admin/careers">Back to applications</Link></div><div className="admin-table-wrap"><table className="admin-table"><tbody>{rows.map(([label, value]) => <tr key={label}><th scope="row" style={{width: '30%', verticalAlign: 'top'}}>{label}</th><td style={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{value || 'Not provided'}</td></tr>)}</tbody></table></div><p style={{marginTop: 20}}><a className="admin-primary-button" href={'/api/admin/careers/' + id + '/resume'}>Download Resume</a></p><h3 style={{marginTop: 28}}>Email Delivery</h3><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Recipient</th><th>State</th><th>Attempts</th><th>Last Attempt (UTC)</th></tr></thead><tbody>{[['Applicant', a.emails?.applicant], ['Admin', a.emails?.recruitment]].map(([label, delivery]) => <tr key={label}><td>{label}</td><td>{delivery?.state || 'pending'}</td><td>{delivery?.attempts || 0}</td><td>{delivery?.attemptedAt ? new Date(delivery.attemptedAt).toISOString() : 'Not attempted'}</td></tr>)}</tbody></table></div></section></AdminShell>;
}
