import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { hashToken, hashOtp } from '@/utils/cryptoUtils';
import { generateAuditTrail } from '@/utils/auditTrail';
import { parsePdfSignatureCoords, resolvePdfSignatureCoords } from '@/utils/pdfCoords';
import { generateAgreementPdfArtifact, generateAgreementPdfBuffer } from '@/lib/fortnight-agreements/pdf';
import { sanitizeAndReencodePng } from '@/utils/pngUtils';

// Mock all external modules
const mockIsRateLimited = jest.fn().mockResolvedValue(false);
jest.doMock('@/utils/rateLimiter', () => ({
  isRateLimited: mockIsRateLimited
}));

const mockSendOtpEmail = jest.fn().mockResolvedValue(true);
const mockSendClientSigningInvite = jest.fn().mockResolvedValue(true);
const mockSendProviderSigningInvite = jest.fn().mockResolvedValue(true);
const mockSendAgreementCompletedEmail = jest.fn().mockResolvedValue(true);

jest.doMock('@/lib/fortnight-agreements/email', () => ({
  sendOtpEmail: mockSendOtpEmail,
  sendClientSigningInvite: mockSendClientSigningInvite,
  sendProviderSigningInvite: mockSendProviderSigningInvite,
  sendAgreementCompletedEmail: mockSendAgreementCompletedEmail
}));

const mockUploadPrivatePdf = jest.fn().mockResolvedValue({ url: 'https://storage/signed.pdf', path: 'signed.pdf' });
const mockFetchBlobBuffer = jest.fn().mockResolvedValue(Buffer.from('%PDF-1.4 test buffer'));
const mockFetchBlobBufferByKey = jest.fn().mockResolvedValue(Buffer.from('%PDF-1.4 test buffer'));
const mockDeleteStoredFileByKey = jest.fn().mockResolvedValue(1);

jest.doMock('@/lib/storage/blob', () => ({
  uploadPrivatePdf: mockUploadPrivatePdf,
  fetchBlobBuffer: mockFetchBlobBuffer,
  fetchBlobBufferByKey: mockFetchBlobBufferByKey,
  deleteStoredFileByKey: mockDeleteStoredFileByKey
}));

jest.doMock('@/utils/pdfSealer', () => ({
  sealAgreementPdf: jest.fn().mockResolvedValue(Buffer.from('%PDF-1.4 sealed buffer'))
}));

const mockExecuteFinalSealing = jest.fn().mockResolvedValue({ status: 'completed' });
jest.doMock('@/lib/fortnight-agreements/completion', () => ({
  executeFinalSealing: mockExecuteFinalSealing,
  retryFailedAgreementCompletion: jest.fn(),
}));

// Mock Database Connection
jest.doMock('@/utils/db', () => jest.fn());

// Mock Agreement Model
const mockFindOne = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockUpdateOne = jest.fn();
const mockSave = jest.fn();

class MockAgreement {
  constructor(data) {
    Object.assign(this, data);
    this.save = mockSave;
  }
}
MockAgreement.findOne = mockFindOne;
MockAgreement.findOneAndUpdate = mockFindOneAndUpdate;
MockAgreement.updateOne = mockUpdateOne;

jest.doMock('@/models/FortnightAgreement', () => MockAgreement);

// Helper to load POST handler
async function loadSignRoute() {
  jest.resetModules();
  return import('@/app/api/fortnight-agreements/[id]/sign/route');
}

describe('fortnight provider pre-signed completion', () => {
  beforeEach(() => { jest.clearAllMocks(); mockIsRateLimited.mockResolvedValue(false); });
  test.each(['completed', 'completion_processing_failed'])('client signing a pre-signed agreement returns %s without inviting the provider again', async (finalStatus) => {
    const agreement = new MockAgreement({
      _id: 'agreement-1', clientName: 'Jane Client', clientEmail: 'jane@example.com',
      clientSigningTokenHash: hashToken('valid-token'),
      clientTokenExpiresAt: new Date(Date.now() + 100000), clientTokenUsedAt: null,
      clientOtpVerifiedAt: new Date(), status: 'sent_to_client',
      providerSignature: { name: 'Aditya Singh', signedAt: new Date(), signatureType: 'typed' },
    });
    mockFindOne.mockResolvedValue(agreement);
    const updated = new MockAgreement({ ...agreement, status: 'completion_processing', clientSignature: { name: 'Jane Client', signedAt: new Date() } });
    mockFindOneAndUpdate.mockResolvedValue(updated);
    if (finalStatus === 'completed') mockExecuteFinalSealing.mockResolvedValueOnce({ status: 'completed' });
    else mockExecuteFinalSealing.mockRejectedValueOnce(new Error('Storage unavailable'));
    const { POST } = await loadSignRoute();
    const response = await POST(new Request('http://localhost/api/fortnight-agreements/agreement-1/sign', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'submit_signature', token: 'valid-token', consentAccepted: true, signatureType: 'typed', signatureName: 'Jane Client' }),
    }), { params: Promise.resolve({ id: 'agreement-1' }) });
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe(finalStatus);
    expect(mockFindOneAndUpdate.mock.calls[0][1].$set.status).toBe('completion_processing');
    expect(mockExecuteFinalSealing).toHaveBeenCalledWith(updated);
    expect(mockSendProviderSigningInvite).not.toHaveBeenCalled();
  });

});
