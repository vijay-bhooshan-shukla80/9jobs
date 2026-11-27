import { handleJobWrite } from '@/lib/careers/job-routes';
export const runtime = 'nodejs';
export async function POST(request) { return handleJobWrite(request); }
