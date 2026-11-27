import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import mongoose from 'mongoose';
import { requireAdminApiSession } from '@/lib/admin/auth/require-admin';
import { getCareerApplication } from '@/lib/careers/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, {params}) {
  if (!await requireAdminApiSession(request)) return NextResponse.json({error: 'Unauthorized.'}, {status: 401, headers: {'Cache-Control': 'no-store'}});
  try {
    const {id} = await params;
    const a = await getCareerApplication(id);
    if (!a?.resume?.id) return NextResponse.json({error: 'Resume not found.'}, {status: 404});
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: 'career_resumes'});
    const exists = await bucket.find({_id: a.resume.id}).hasNext();
    if (!exists) return NextResponse.json({error: 'Resume not found.'}, {status: 404});
    const extension = a.resume.contentType === 'application/pdf' ? 'pdf' : 'docx';
    return new NextResponse(Readable.toWeb(bucket.openDownloadStream(a.resume.id)), {headers: {'Content-Type': a.resume.contentType, 'Content-Disposition': 'attachment; filename="resume.' + extension + '"', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow'}});
  } catch { return NextResponse.json({error: 'Unable to download resume.'}, {status: 503, headers: {'Cache-Control': 'no-store'}}); }
}
