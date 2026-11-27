import {jest} from '@jest/globals';
import {Readable} from 'node:stream';

const auth = jest.fn(), getApplication = jest.fn(), hasNext = jest.fn();
jest.doMock('@/lib/admin/auth/require-admin', () => ({requireAdminApiSession:auth}));
jest.doMock('@/lib/careers/admin', () => ({getCareerApplication:getApplication}));
jest.doMock('mongoose', () => ({__esModule:true,default:{connection:{db:{}},mongo:{GridFSBucket:class {find(){return {hasNext};}openDownloadStream(){return Readable.from([Buffer.from('private-test-resume')]);}}}}}));
let GET;
beforeAll(async () => {({GET}=await import('@/app/api/admin/careers/[id]/resume/route'));});
beforeEach(() => {jest.clearAllMocks();auth.mockResolvedValue({role:'admin'});hasNext.mockResolvedValue(true);getApplication.mockResolvedValue({resume:{id:'file-id',contentType:'application/pdf'}});});
test('unauthenticated requests cannot access applicant data or resume storage', async () => {auth.mockResolvedValue(null);const response=await GET(new Request('http://localhost/api/admin/careers/app/resume'),{params:Promise.resolve({id:'app'})});expect(response.status).toBe(401);expect(getApplication).not.toHaveBeenCalled();});
test('authenticated admin can download a private resume with no-store headers', async () => {const response=await GET(new Request('http://localhost/api/admin/careers/app/resume'),{params:Promise.resolve({id:'app'})});expect(response.status).toBe(200);expect(await response.text()).toBe('private-test-resume');expect(response.headers.get('cache-control')).toContain('no-store');expect(response.headers.get('content-disposition')).toContain('attachment');});
test('missing application and missing stored file are safely rejected', async () => {getApplication.mockResolvedValueOnce(null);expect((await GET(new Request('http://localhost'),{params:Promise.resolve({id:'app'})})).status).toBe(404);hasNext.mockResolvedValue(false);expect((await GET(new Request('http://localhost'),{params:Promise.resolve({id:'app'})})).status).toBe(404);});
test('storage errors do not disclose private data', async () => {getApplication.mockRejectedValue(new Error('private-storage-details'));const response=await GET(new Request('http://localhost'),{params:Promise.resolve({id:'app'})});expect(response.status).toBe(503);expect(JSON.stringify(await response.json())).not.toContain('private-storage-details');});
