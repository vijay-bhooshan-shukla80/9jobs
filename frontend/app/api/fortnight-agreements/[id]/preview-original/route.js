import { NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import connectDB from '@/utils/db';
import FortnightAgreement from '@/models/FortnightAgreement';
import { hashToken, constantTimeCompare } from '@/utils/cryptoUtils';
import { fetchBlobBuffer, fetchBlobBufferByKey, openDownloadStreamByKey } from '@/lib/storage/blob';
import { isRateLimited } from '@/utils/rateLimiter';
import { sealAgreementPdf } from '@/utils/pdfSealer';
import { PDF_PREVIEW_HEADERS } from '@/lib/agreements/preview-headers';

export const dynamic = 'force-dynamic';

function canPreviewAfterTokenUse({ isClient, status }) {
  if (isClient) {
    return ['client_signed', 'sent_to_provider', 'completion_processing', 'completed'].includes(status);
  }

  return ['completion_processing', 'completed'].includes(status);
}

export async function GET(request, { params }) {
  await connectDB();
  const id = (await params).id;

  const { searchParams } = new URL(request.url);
  const rawToken = searchParams.get('token') || '';

  // 1. Rate Limiting Protection (max 10 preview requests per IP per minute)
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const isLimited = await isRateLimited(`ip:${clientIp}:fortnight-preview-original`, 10, 60 * 1000);
  if (isLimited) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { 'content-type': 'application/json' }
    });
  }

  if (!rawToken) {
    return new NextResponse(JSON.stringify({ error: 'Missing token parameter.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  // 2. Resolve token securely
  const tokenHash = hashToken(rawToken);
  
  // Find the agreement where the hash matches either client or provider token
  const agreement = await FortnightAgreement.findOne({
    _id: id,
    $or: [
      { clientSigningTokenHash: tokenHash },
      { providerSigningTokenHash: tokenHash }
    ]
  });

  if (!agreement) {
    return new NextResponse(JSON.stringify({ error: 'Access denied: Invalid token.' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    });
  }

  // Determine signer details based on which token matched
  const isClient = constantTimeCompare(agreement.clientSigningTokenHash, tokenHash);
  const expiry = isClient ? agreement.clientTokenExpiresAt : agreement.providerTokenExpiresAt;
  const usedAt = isClient ? agreement.clientTokenUsedAt : agreement.providerTokenUsedAt;

  // 3. Validate Token Expiration & Used Status
  if (usedAt && !canPreviewAfterTokenUse({ isClient, status: agreement.status })) {
    return new NextResponse(JSON.stringify({ error: 'Access denied: Token has already been used.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    });
  }

  if (new Date() > expiry) {
    return new NextResponse(JSON.stringify({ error: 'Access denied: Token has expired.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    });
  }

  // 4. Validate Sequential State
  const allowUsedPreview = Boolean(usedAt) && canPreviewAfterTokenUse({ isClient, status: agreement.status });

  if (isClient && agreement.status !== 'sent_to_client' && !allowUsedPreview) {
    return new NextResponse(JSON.stringify({ error: 'Access denied: Agreement is not in a signable state for client.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    });
  }
  if (!isClient && agreement.status !== 'sent_to_provider' && !allowUsedPreview) {
    return new NextResponse(JSON.stringify({ error: 'Access denied: Agreement is not in a signable state for provider.' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    });
  }

  // 5. Fetch Original PDF Buffer
  try {
    if (agreement.status === 'completed' && agreement.signedPdfStorageKey) {
      const { stream } = await openDownloadStreamByKey(agreement.signedPdfStorageKey);
      return new NextResponse(Readable.toWeb(stream), { headers: PDF_PREVIEW_HEADERS });
    }
    if (agreement.providerSignature?.signedAt && agreement.status === 'sent_to_client') {
      const key = agreement.originalPdfStorageKey || agreement.generatedPdfPath;
      const url = agreement.originalPdfUrl || agreement.generatedPdfUrl;
      const original = key ? await fetchBlobBufferByKey(key)
        : url?.startsWith('data:application/pdf;base64,') ? Buffer.from(url.split(',')[1], 'base64')
          : await fetchBlobBuffer(url);
      const preview = await sealAgreementPdf(original, agreement, { providerOnly: true });
      return new NextResponse(preview, { headers: PDF_PREVIEW_HEADERS });
    }
    if (agreement.originalPdfStorageKey) {
      const { stream } = await openDownloadStreamByKey(agreement.originalPdfStorageKey);
      return new NextResponse(Readable.toWeb(stream), {
        status: 200,
        headers: PDF_PREVIEW_HEADERS,
      });
    }

    const fallbackKey = agreement.generatedPdfPath;
    if (fallbackKey) {
      const { stream } = await openDownloadStreamByKey(fallbackKey);
      return new NextResponse(Readable.toWeb(stream), {
        status: 200,
        headers: PDF_PREVIEW_HEADERS,
      });
    }

    const url = agreement.originalPdfUrl || agreement.generatedPdfUrl;
    if (!url) {
      return new NextResponse(JSON.stringify({ error: 'Original PDF is not available.' }), {
        status: 404,
        headers: { 'content-type': 'application/json' }
      });
    }
    let pdfBuffer;
    if (url.startsWith('data:application/pdf;base64,')) {
      const base64Data = url.substring(url.indexOf(',') + 1);
      pdfBuffer = Buffer.from(base64Data, 'base64');
    } else if (url.startsWith('gridfs://')) {
      pdfBuffer = await fetchBlobBuffer(url);
    } else {
      pdfBuffer = await fetchBlobBuffer(url);
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: PDF_PREVIEW_HEADERS,
    });
  } catch (err) {
    console.error('Failed to fetch original PDF:', err);
    return new NextResponse(JSON.stringify({ error: 'Failed to retrieve original PDF file from storage.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }

}
