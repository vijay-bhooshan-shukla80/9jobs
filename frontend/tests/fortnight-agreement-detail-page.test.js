import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, jest, test } from '@jest/globals';

const mockGetAgreement = jest.fn();
const mockGetDocument = jest.fn();
const mockGeneratePdf = jest.fn();

jest.doMock('@/lib/admin/auth/require-admin', () => ({ requireAdminPageSession: jest.fn() }));
jest.doMock('@/lib/fortnight-agreements/service', () => ({
  getAgreementById: mockGetAgreement,
  getAgreementDocumentById: mockGetDocument,
  generateAndStoreAgreementPdf: mockGeneratePdf,
}));
jest.doMock('@/components/admin/AdminShell', () => ({ __esModule: true, default: ({ children }) => children }));
jest.doMock('@/components/admin/FortnightAgreementActions', () => ({ __esModule: true, default: () => null }));
jest.doMock('@/components/admin/StatusBadge', () => ({ __esModule: true, default: () => null }));
jest.doMock('@/components/AgreementPdfPreview', () => ({
  __esModule: true,
  default: ({ src }) => React.createElement('div', { 'data-pdf-src': src }),
}));

beforeEach(() => jest.clearAllMocks());

test.each([
  ['previewed', '', '/api/fortnight-agreements/agreement-1/preview-pdf'],
  ['completed', 'signed.pdf', '/api/fortnight-agreements/agreement-1/preview-pdf?variant=signed'],
])('renders the %s agreement detail page with the correct PDF preview', async (status, signedPdfUrl, expectedUrl) => {
  const agreement = { _id: 'agreement-1', clientName: 'Test Client', generatedPdfUrl: 'generated.pdf', status, signedPdfUrl };
  mockGetDocument.mockResolvedValue(agreement);
  mockGetAgreement.mockResolvedValue(agreement);
  const { default: Page } = await import('@/app/admin/fortnight-agreements/[id]/page');
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: 'agreement-1' }) }));
  expect(html).toContain('Fortnight Agreement Overview');
  expect(html).toContain(`href="${expectedUrl}"`);
  expect(html).toContain(`data-pdf-src="${expectedUrl}"`);
});
