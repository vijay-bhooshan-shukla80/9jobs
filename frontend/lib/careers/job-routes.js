import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth/require-admin';
import { saveCareerJob } from './jobs';
import { fieldErrors } from './validation';

export async function handleJobWrite(request, id) {
  const admin = await requireAdminApiSession(request);
  if (!admin) return NextResponse.json({error: 'Unauthorized.'}, {status: 401});
  let sameOrigin = false;
  try { const origin = request.headers.get('origin'); const parsed = new URL(origin); sameOrigin = parsed.origin === origin && parsed.host === (request.headers.get('host') || new URL(request.url).host) && ['http:', 'https:'].includes(parsed.protocol); } catch { /* Missing/invalid origins are rejected. */ }
  if (!sameOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({error: 'Submit from the Admin Panel.'}, {status: 403});
  if (!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({error: 'Use JSON job details.'}, {status: 415});
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({error: 'Job details are required.'}, {status: 400});
  try {
    const chunks = []; let length = 0;
    while (true) { const {done, value} = await reader.read(); if (done) break; length += value.length; if (length > 65536) {await reader.cancel(); return NextResponse.json({error: 'Job details are too large.'}, {status: 413});} chunks.push(value); }
    let payload;
    try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return NextResponse.json({error: 'Invalid job details.'}, {status: 400}); }
    const job = await saveCareerJob(payload, admin, id);
    if (!job) return NextResponse.json({error: 'Job not found.'}, {status: 404});
    return NextResponse.json({success: true, job}, {status: id ? 200 : 201, headers: {'Cache-Control': 'no-store'}});
  } catch (error) {
    if (error.name === 'ZodError') return NextResponse.json({error: 'Please check the highlighted fields.', fields: fieldErrors(error)}, {status: 422});
    return NextResponse.json({error: 'Unable to save the job. Please try again.'}, {status: 503});
  }
}
