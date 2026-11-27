import { handleJobWrite } from '@/lib/careers/job-routes';
export const runtime = 'nodejs';
export async function PATCH(request, {params}) { const {id} = await params; return handleJobWrite(request, id); }
