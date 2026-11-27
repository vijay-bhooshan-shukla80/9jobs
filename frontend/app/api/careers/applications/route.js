import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { applicationSchema, fieldErrors } from '@/lib/careers/validation';
import { ResumeError, validateResume } from '@/lib/careers/resume';
import { assertCareersDatabase, submitCareerApplication } from '@/lib/careers/service';

export const runtime = 'nodejs';
const MAX_BODY = 6 * 1024 * 1024;
const ingress = new Map();

function ingressAllowed(ip) {
  const now = Date.now();
  for (const [key, entry] of ingress) if (entry.until <= now) ingress.delete(key);
  const key = createHash('sha256').update(ip).digest('hex');
  if (!ingress.has(key)) {
    if (ingress.size >= 10000) return false;
    ingress.set(key, {until: now + 900000, count: 0});
  }
  return ++ingress.get(key).count <= 30;
}

export async function POST(request) {
  try {
    const origin = request.headers.get('origin');
    let sameOrigin = false;
    try { const parsedOrigin = new URL(origin); sameOrigin = parsedOrigin.origin === origin && parsedOrigin.host === (request.headers.get('host') || new URL(request.url).host) && ['http:', 'https:'].includes(parsedOrigin.protocol); } catch { /* Invalid or absent origins are rejected. */ }
    if (!sameOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({error: 'Please submit from the Careers website.'}, {status: 403});
    // Vercel overwrites this header. Other hosts share a conservative fallback bucket.
    const ip = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown' : 'local';
    if (!ingressAllowed(ip)) return NextResponse.json({error: 'Too many requests. Please try again in 15 minutes.'}, {status: 429, headers: {'Retry-After': '900'}});
    const key = request.headers.get('idempotency-key');
    if (!/^[a-f\d-]{36}$/i.test(key || '')) return NextResponse.json({error: 'Refresh the form and try again.'}, {status: 400});
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data; boundary=')) return NextResponse.json({error: 'Use the Careers application form.'}, {status: 415});
    if (Number(request.headers.get('content-length')) > MAX_BODY) return NextResponse.json({error: 'Upload a resume up to 5 MB.'}, {status: 413});
    const chunks = []; let size = 0;
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({error: 'Application data is required.'}, {status: 400});
    while (true) { const {done, value} = await reader.read(); if (done) break; size += value.length; if (size > MAX_BODY) { await reader.cancel(); return NextResponse.json({error: 'Upload a resume up to 5 MB.'}, {status: 413}); } chunks.push(value); }
    let form;
    try { form = await new Response(Buffer.concat(chunks), {headers: {'content-type': request.headers.get('content-type')}}).formData(); } catch { return NextResponse.json({error: 'Invalid form data.'}, {status: 400}); }
    const parsed = applicationSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) return NextResponse.json({error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error)}, {status: 422});
    const resume = await validateResume(form.get('resume'));
    assertCareersDatabase();
    const result = await submitCareerApplication(parsed.data, resume, key, ip);
    return NextResponse.json({success: true, reference: result.reference}, {status: result.duplicate ? 200 : 201, headers: {'Cache-Control': 'no-store'}});
  } catch (error) {
    if (error instanceof ResumeError) return NextResponse.json({error: error.message, fields: {resume: error.message}}, {status: 422});
    return NextResponse.json({error: error.status ? error.message : 'We could not process your application. Please try again later.'}, {status: error.status || 500, headers: {'Cache-Control': 'no-store', ...(error.status === 429 ? {'Retry-After': '900'} : {})}});
  }
}
