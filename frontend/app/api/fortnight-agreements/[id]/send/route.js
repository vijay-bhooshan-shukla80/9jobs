import { NextResponse } from 'next/server';
import { sealAgreementPdf } from '@/utils/pdfSealer';

import { requireAdminApiSession } from '@/lib/admin/auth/require-admin';
import {
  getAgreementById,
  getAgreementDocumentById,
  generateAndStoreAgreementPdf,
  getAgreementPdfBuffer,
} from '@/lib/fortnight-agreements/service';

export const dynamic = 'force-dynamic';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export async function POST(request, { params }) {
  const session = await requireAdminApiSession(request);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const agreementId = (await params).id;
  const agreementDocument = await getAgreementDocumentById(agreementId);

  if (!agreementDocument) {
    return NextResponse.json({ error: 'Contract not found.' }, { status: 404 });
  }

  if (
    agreementDocument.status !== 'draft' &&
    agreementDocument.status !== 'previewed' &&
    agreementDocument.status !== 'send_failed'
  ) {
    return NextResponse.json(
      { error: 'This contract has already been sent to the client or signed.' },
      { status: 400 }
    );
  }

  const usesOldProviderEmail = normalizeEmail(agreementDocument.providerEmail) === '9jobsapplicationservice@gmail.com';
  if (usesOldProviderEmail) {
    agreementDocument.providerEmail = 'accounts@9jobs.co';
    agreementDocument.originalPdfStorageKey = '';
    agreementDocument.originalPdfUrl = '';
  }
  if (!agreementDocument.generatedPdfUrl || usesOldProviderEmail) {
    await generateAndStoreAgreementPdf(agreementDocument);
  }

  if (normalizeEmail(agreementDocument.clientEmail) === normalizeEmail(agreementDocument.providerEmail)) {
    return NextResponse.json(
      { error: 'Client email and service provider email must be different for the signing flow.' },
      { status: 400 }
    );
  }

  const agreement = await getAgreementById(agreementId);
  const pdfBuffer = await getAgreementPdfBuffer(agreement, 'generated');

  try {
    const { hashPdf, generateSecureToken, hashToken } = require('@/utils/cryptoUtils');
    const { sendClientSigningInvite } = require('@/lib/fortnight-agreements/email');

    const originalPdfSha256 = hashPdf(pdfBuffer);
    const clientToken = generateSecureToken();
    const clientTokenHash = hashToken(clientToken);

    agreementDocument.esignProvider = 'internal';
    agreementDocument.esignError = '';
    agreementDocument.originalPdfSha256 = originalPdfSha256;
    agreementDocument.originalPdfUrl = agreementDocument.generatedPdfUrl;
    agreementDocument.originalPdfStorageKey = agreementDocument.generatedPdfPath;

    // Apply the configured provider signature from the authenticated admin send action.
    agreementDocument.providerSigningTokenHash = '';
    agreementDocument.providerTokenExpiresAt = null;
    agreementDocument.providerTokenUsedAt = null;
    agreementDocument.providerOtpHash = '';
    agreementDocument.providerOtpExpiresAt = null;
    agreementDocument.providerOtpAttempts = 0;
    agreementDocument.providerOtpCooldownUntil = null;
    agreementDocument.providerOtpVerifiedAt = null;
    agreementDocument.providerDocumentViewedAt = null;
    agreementDocument.providerInvitationSentAt = null;
    agreementDocument.providerCompletionEmailSentAt = null;
    const providerSignedAt = new Date();
    agreementDocument.providerConsentAcceptedAt = providerSignedAt;
    agreementDocument.providerSignature = {
      name: agreementDocument.providerSignatureName || agreementDocument.providerName,
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'unknown',
      signedAt: providerSignedAt,
      signatureFileKey: '',
      signatureType: 'typed',
    };

    agreementDocument.clientSigningTokenHash = clientTokenHash;
    agreementDocument.clientTokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    agreementDocument.clientTokenUsedAt = null;
    agreementDocument.clientOtpHash = '';
    agreementDocument.clientOtpExpiresAt = null;
    agreementDocument.clientOtpAttempts = 0;
    agreementDocument.clientOtpCooldownUntil = null;
    agreementDocument.clientOtpVerifiedAt = null;
    agreementDocument.clientDocumentViewedAt = null;
    agreementDocument.clientConsentAcceptedAt = null;
    agreementDocument.clientCompletionEmailSentAt = null;
    agreementDocument.clientSignature = {
      name: '',
      ip: '',
      userAgent: '',
      signedAt: null,
      signatureFileKey: '',
      signatureType: '',
    };
    agreementDocument.clientDownloadTokenHash = '';
    agreementDocument.providerDownloadTokenHash = '';
    agreementDocument.downloadTokenExpiresAt = null;
    agreementDocument.signedPdfUrl = '';
    agreementDocument.signedPdfPath = '';
    agreementDocument.signedPdfStorageKey = '';
    agreementDocument.signedPdfSha256 = '';
    agreementDocument.auditTrailUrl = '';
    agreementDocument.auditTrailStorageKey = '';
    agreementDocument.auditTrailSha256 = '';
    agreementDocument.signedAt = null;
    agreementDocument.completionLockId = '';
    agreementDocument.completionStartedAt = null;
    agreementDocument.completionAttemptCount = 0;
    
    agreementDocument.status = 'sent_to_client';
    agreementDocument.sentAt = new Date();
    agreementDocument.clientInvitationSentAt = new Date();
    
    const providerSignedPdf = await sealAgreementPdf(pdfBuffer, agreementDocument, { providerOnly: true });
    await agreementDocument.save();

    await sendClientSigningInvite(agreementDocument, clientToken, providerSignedPdf, request.url);

    return NextResponse.json({
      success: true,
      message: 'Contract sent to client successfully.',
    });
  } catch (error) {
    console.error('Unable to send contract internally:', error);
    agreementDocument.status = 'send_failed';
    agreementDocument.esignError = error instanceof Error ? error.message : 'Internal sending failed';
    await agreementDocument.save();
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to initialize electronic signature request.',
      },
      { status: 500 }
    );
  }
}
