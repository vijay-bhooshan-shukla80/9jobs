import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin/auth/require-admin';
import { updateCareerApplication, deleteCareerApplication } from '@/lib/careers/application-management';
import { fieldErrors } from '@/lib/careers/validation';

export const runtime = 'nodejs';
async function mutate(request, params, remove) {
  const admin = await requireAdminApiSession(request);
  if (!admin) return NextResponse.json({error: 'Unauthorized.'}, {status: 401});
  let sameOrigin = false;
  try {const origin = request.headers.get('origin'), parsed = new URL(origin);sameOrigin = parsed.origin === origin && parsed.host === (request.headers.get('host') || new URL(request.url).host) && ['http:', 'https:'].includes(parsed.protocol);} catch { /* Invalid origins are rejected. */ }
  if (!sameOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({error: 'Submit from the Admin Panel.'}, {status: 403});
  const {id} = await params;
  try {
    let result;
    if (remove) result = await deleteCareerApplication(id, admin);
    else {
      if (!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({error: 'Use JSON application details.'}, {status: 415});
      const reader = request.body?.getReader();
      if (!reader) return NextResponse.json({error: 'Application details are required.'}, {status: 400});
      const chunks = []; let size = 0;
      while (true) {const {done, value} = await reader.read();if (done) break;size += value.length;if (size > 32768) {await reader.cancel();return NextResponse.json({error: 'Application details are too large.'}, {status: 413});}chunks.push(value);}
      let data; try {data = JSON.parse(Buffer.concat(chunks).toString('utf8'));} catch {return NextResponse.json({error: 'Invalid application details.'}, {status: 400});}
      result = await updateCareerApplication(id, data, admin);
    }
    if (!result) return NextResponse.json({error: 'Application not found.'}, {status: 404});
    return NextResponse.json({success: true}, {headers: {'Cache-Control': 'no-store'}});
  } catch (error) {
    if (error.name === 'ZodError') return NextResponse.json({error: 'Please check the highlighted fields.', fields: fieldErrors(error)}, {status: 422});
    return NextResponse.json({error: 'Unable to update the application. Please try again.'}, {status: 503});
  }
}
export async function PATCH(request, {params}) {return mutate(request, params, false);}
export async function DELETE(request, {params}) {return mutate(request, params, true);}
