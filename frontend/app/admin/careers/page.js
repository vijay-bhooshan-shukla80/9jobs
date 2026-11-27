import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdminPageSession } from '@/lib/admin/auth/require-admin';
import { listCareerApplications } from '@/lib/careers/admin';

export const dynamic = 'force-dynamic';
export const metadata = {title: 'Careers Applications | 9Jobs Admin'};

export default async function CareersApplicationsPage({searchParams}) {
  await requireAdminPageSession();
  const params = await searchParams;
  const search = typeof params?.search === 'string' ? params.search.slice(0, 120) : '';
  let result;
  try { result = await listCareerApplications({page: params?.page, search}); } catch {
    return <AdminShell title="Careers Applications" eyebrow="Internal recruitment submissions"><section className="admin-panel"><h2>Careers applications are unavailable</h2><p>Check the Careers database configuration and try again. Existing admin features are unaffected.</p></section></AdminShell>;
  }
  const {applications, total, page, pages} = result;
  const pageUrl = value => '/admin/careers?' + new URLSearchParams({search, page: String(value)});
  return <AdminShell title="Careers Applications" eyebrow="Internal recruitment submissions">
    <section className="admin-panel">
      <div className="admin-panel__header"><div><h2>Careers Application Register</h2><p>{total} applications · Internal recruitment and expressions of interest.</p></div><form method="get" action="/admin/careers" style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}><input name="search" aria-label="Search Careers applications" defaultValue={search} maxLength={120} placeholder="Name, email, position or reference" style={{padding: '10px 12px', border: '1px solid #dce2dc', borderRadius: 8}} /><button className="admin-primary-button" type="submit">Search</button><Link className="admin-secondary-button" href="/admin/careers">Refresh</Link></form></div>
      {applications.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Applicant</th><th>Position</th><th>Location</th><th>Received</th><th>Status</th><th>Email delivery</th><th>Details</th></tr></thead><tbody>{applications.map(a => <tr key={String(a._id)}><td>{a.reference}</td><td><strong>{a.fullName}</strong><span>{a.email}</span><span>{a.phone}</span></td><td>{a.positionTitle}</td><td>{a.location}</td><td>{new Date(a.createdAt).toLocaleString('en-AU', {timeZone: 'Australia/Sydney'})} AET</td><td>{a.status === 'Pending' ? 'Received' : a.status}</td><td><span>Applicant: {a.emails?.applicant?.state || 'pending'}</span><span>Admin: {a.emails?.recruitment?.state || 'pending'}</span></td><td><Link className="admin-secondary-button" href={'/admin/careers/' + a._id}>View application</Link></td></tr>)}</tbody></table></div> : <p>No Careers applications match your search.</p>}
      <div style={{display: 'flex', alignItems: 'center', gap: 16, paddingTop: 20}}>{page > 1 && <Link href={pageUrl(page - 1)}>Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={pageUrl(page + 1)}>Next</Link>}</div>
    </section>
  </AdminShell>;
}
