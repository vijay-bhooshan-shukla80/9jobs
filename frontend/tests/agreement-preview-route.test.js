import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockConnectDb = jest.fn();
const mockFindOne = jest.fn();
const mockFortnightFindOne = jest.fn();
const mockIsRateLimited = jest.fn().mockResolvedValue(false);
const mockOpenDownloadStreamByKey = jest.fn();
const mockHashToken = jest.fn(() => 'same-hash');
const mockFetchBlobBufferByKey = jest.fn();
const mockSealAgreementPdf = jest.fn();
jest.doMock('@/utils/pdfSealer', () => ({ sealAgreementPdf: mockSealAgreementPdf }));
const mockConstantTimeCompare = jest.fn((left, right) => left === right);

jest.doMock('@/utils/db', () => ({
  __esModule: true,
  default: mockConnectDb,
}));

jest.doMock('@/utils/rateLimiter', () => ({
  isRateLimited: mockIsRateLimited,
}));

jest.doMock('@/utils/cryptoUtils', () => ({
  hashToken: mockHashToken,
  constantTimeCompare: mockConstantTimeCompare,
}));

jest.doMock('@/lib/storage/blob', () => ({
  fetchBlobBuffer: jest.fn(),
  fetchBlobBufferByKey: mockFetchBlobBufferByKey,
  openDownloadStreamByKey: mockOpenDownloadStreamByKey,
}));

jest.doMock('@/models/Agreement', () => {
  class MockAgreement {}
  MockAgreement.findOne = mockFindOne;
  return MockAgreement;
});

jest.doMock('@/models/FortnightAgreement', () => {
  class MockFortnightAgreement {}
  MockFortnightAgreement.findOne = mockFortnightFindOne;
  return MockFortnightAgreement;
});

function makeStream() {
  const { Readable } = require('node:stream');
  return Readable.from(Buffer.from('%PDF-1.4 test pdf'));
}

async function loadWeeklyRoute() {
  jest.resetModules();
  return import('@/app/api/agreements/[id]/preview-original/route');
}

async function loadFortnightRoute() {
  jest.resetModules();
  return import('@/app/api/fortnight-agreements/[id]/preview-original/route');
}

describe('agreement preview routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDb.mockResolvedValue(undefined);
    mockIsRateLimited.mockResolvedValue(false);
    mockOpenDownloadStreamByKey.mockResolvedValue({ stream: makeStream() });
  });

  test.each(['agreements', 'fortnight-agreements'])('%s client PDF review includes the provider signature before the client signs', async (kind) => {
    const agreement = {
      _id: 'agreement-1', status: 'sent_to_client', clientSigningTokenHash: 'same-hash',
      clientTokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      originalPdfStorageKey: 'original.pdf', providerSignature: { signedAt: new Date() },
    };
    (kind === 'agreements' ? mockFindOne : mockFortnightFindOne).mockResolvedValue(agreement);
    mockFetchBlobBufferByKey.mockResolvedValue(Buffer.from('%PDF unsigned'));
    mockSealAgreementPdf.mockResolvedValue(Buffer.from('%PDF provider signed'));
    const { GET } = await (kind === 'agreements' ? loadWeeklyRoute() : loadFortnightRoute());
    const response = await GET(new Request(`http://localhost/api/${kind}/agreement-1/preview-original?token=test-token`), { params: Promise.resolve({ id: 'agreement-1' }) });
    expect(response.status).toBe(200);
    expect(Buffer.from(await response.arrayBuffer())).toEqual(Buffer.from('%PDF provider signed'));
    expect(mockSealAgreementPdf).toHaveBeenCalledWith(Buffer.from('%PDF unsigned'), agreement, { providerOnly: true });
  });

  test.each(['agreements', 'fortnight-agreements'])('%s completed client review opens the PDF with both signatures', async (kind) => {
    (kind === 'agreements' ? mockFindOne : mockFortnightFindOne).mockResolvedValue({
      _id: 'agreement-1', status: 'completed', clientSigningTokenHash: 'same-hash',
      clientTokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      clientTokenUsedAt: new Date(), originalPdfStorageKey: 'original.pdf', signedPdfStorageKey: 'signed.pdf',
    });
    const { GET } = await (kind === 'agreements' ? loadWeeklyRoute() : loadFortnightRoute());
    const response = await GET(new Request(`http://localhost/api/${kind}/agreement-1/preview-original?token=test-token`), { params: Promise.resolve({ id: 'agreement-1' }) });
    expect(response.status).toBe(200);
    await response.arrayBuffer();
    expect(mockOpenDownloadStreamByKey).toHaveBeenCalledWith('signed.pdf');
    expect(response.headers.get('content-disposition')).toContain('inline');
  });

  test.each(['agreements', 'fortnight-agreements'])('%s email PDF link opens the original document before signing', async (kind) => {
    const findOne = kind === 'agreements' ? mockFindOne : mockFortnightFindOne;
    findOne.mockResolvedValue({
      _id: 'agreement-1',
      status: 'sent_to_client',
      clientSigningTokenHash: 'same-hash',
      providerSigningTokenHash: 'provider-hash',
      clientTokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      clientTokenUsedAt: null,
      originalPdfStorageKey: 'original.pdf',
    });
    const { GET } = await (kind === 'agreements' ? loadWeeklyRoute() : loadFortnightRoute());
    const response = await GET(
      new Request(`http://localhost/api/${kind}/agreement-1/preview-original?token=test-token`),
      { params: Promise.resolve({ id: 'agreement-1' }) }
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
    expect(Buffer.from(await response.arrayBuffer())).toEqual(Buffer.from('%PDF-1.4 test pdf'));
    expect(mockOpenDownloadStreamByKey).toHaveBeenCalledWith('original.pdf');
  });

  test('weekly preview remains accessible to client token after client signs and provider step starts', async () => {
    mockFindOne.mockResolvedValue({
      _id: 'agreement-1',
      status: 'sent_to_provider',
      clientSigningTokenHash: 'same-hash',
      providerSigningTokenHash: 'provider-hash',
      clientTokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      clientTokenUsedAt: new Date('2026-08-18T09:00:00.000Z'),
      originalPdfStorageKey: 'agreements/original.pdf',
    });

    const { GET } = await loadWeeklyRoute();
    const response = await GET(
      new Request('http://localhost/api/agreements/agreement-1/preview-original?token=test-token'),
      { params: Promise.resolve({ id: 'agreement-1' }) }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
  });

  test('fortnight preview remains accessible to client token after client signs and provider step starts', async () => {
    mockFortnightFindOne.mockResolvedValue({
      _id: 'agreement-1',
      status: 'sent_to_provider',
      clientSigningTokenHash: 'same-hash',
      providerSigningTokenHash: 'provider-hash',
      clientTokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      clientTokenUsedAt: new Date('2026-08-18T09:00:00.000Z'),
      originalPdfStorageKey: 'fortnight/original.pdf',
    });

    const { GET } = await loadFortnightRoute();
    const response = await GET(
      new Request('http://localhost/api/fortnight-agreements/agreement-1/preview-original?token=test-token'),
      { params: Promise.resolve({ id: 'agreement-1' }) }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
  });
});
