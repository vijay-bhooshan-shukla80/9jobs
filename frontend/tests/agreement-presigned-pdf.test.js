import { describe, expect, test } from '@jest/globals';
import { PDFDocument, PDFArray, PDFRawStream, StandardFonts, decodePDFRawStream } from 'pdf-lib';
import { generateAgreementPdfArtifact } from '@/lib/agreements/pdf';
import { generateAgreementPdfArtifact as generateFortnightPdfArtifact } from '@/lib/fortnight-agreements/pdf';
import { sealAgreementPdf } from '@/utils/pdfSealer';

async function pageContent(buffer, pageIndex) {
  const pdf = await PDFDocument.load(buffer);
  const content = pdf.getPages()[pageIndex].node.Contents();
  const streams = content instanceof PDFArray ? content.asArray() : [content];
  return streams.map(ref => pdf.context.lookup(ref, PDFRawStream))
    .map(stream => Buffer.from(decodePDFRawStream(stream).decode()).toString()).join('\n');
}

describe('provider-first PDF signatures', () => {
  test.each([['weekly', generateAgreementPdfArtifact], ['fortnight', generateFortnightPdfArtifact]])('%s: client receives only provider ink initially; completed PDF contains each signature once', async (_kind, generatePdf) => {
    const artifact = await generatePdf({
      clientName: 'Client Example', clientEmail: 'client@example.com', clientPhone: '+61 400 111 222',
      providerName: '9Jobs', providerEmail: 'accounts@9jobs.co', providerPhone: '+61 422 279 428',
      providerSignatureName: 'Provider Example', agreementDate: '2026-10-14', packageName: 'Standard',
      servicePrice: '$100', weeklyJobTarget: '100', initialTerm: '1 week',
    });
    const agreement = {
      pdfAnchorCoords: artifact.anchorCoords,
      clientSignature: { name: 'ClientInk', signatureType: 'typed', signedAt: new Date('2026-10-15') },
      providerSignature: { name: 'ProviderInk', signatureType: 'typed', signedAt: new Date('2026-10-14') },
    };
    const fontPdf = await PDFDocument.create();
    const font = await fontPdf.embedFont(StandardFonts.TimesRomanItalic);
    const bodyFont = await fontPdf.embedFont(StandardFonts.Helvetica);
    const headerContent = await pageContent(artifact.buffer, 0);
    expect(headerContent).toContain(bodyFont.encodeText('accounts@9jobs.co').toString());
    const clientInk = font.encodeText('ClientInk').toString();
    const providerInk = font.encodeText('ProviderInk').toString();
    const initial = await sealAgreementPdf(artifact.buffer, agreement, { providerOnly: true });
    const initialContent = await pageContent(initial, artifact.anchorCoords.providerSign.pageIndex);
    expect(initialContent).toContain(providerInk);
    expect(initialContent).not.toContain(clientInk);
    const completed = await sealAgreementPdf(artifact.buffer, agreement);
    const completedContent = await pageContent(completed, artifact.anchorCoords.providerSign.pageIndex);
    expect(completedContent.split(providerInk)).toHaveLength(2);
    expect(completedContent.split(clientInk)).toHaveLength(2);
  });
});
