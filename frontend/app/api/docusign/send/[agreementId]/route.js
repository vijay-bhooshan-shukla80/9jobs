import { NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/admin/auth/require-admin';
import { createDocuSignEnvelope } from '@/lib/docusign/client';
import { resolveEsignProvider } from '@/lib/agreements/provider';
import { sealAgreementPdf } from '@/utils/pdfSealer';
import {
  getAgreementById,
  getAgreementDocumentById,
  generateAndStoreAgreementPdf,
  getAgreementPdfBuffer,
} from '@/lib/agreements/service';

export const dynamic = 'force-dynamic';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export async function POST(request, { params }) {
  const session = await requireAdminApiSession(request);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const agreementId = (await params).agreementId;
  const agreementDocument = await getAgreementDocumentById(agreementId);

  if (!agreementDocument) {
    return NextResponse.json({ error: 'Agreement not found.' }, { status: 404 });
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

  const hostname = new URL(request.url).hostname;
  const selectedProvider = resolveEsignProvider({
    configuredProvider: process.env.ESIGN_PROVIDER,
    hostname,
  });
  const useDocuSign = selectedProvider === 'docusign';

  console.info(
    '[agreement-send]',
    JSON.stringify({
      deploymentEnvironment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      selectedProvider,
      agreementId,
      routeBranch: useDocuSign ? 'docusign' : 'internal',
      hostname,
    })
  );

  if (useDocuSign) {
    try {
      const envelope = await createDocuSignEnvelope({
        agreement,
        pdfBuffer,
      });

      agreementDocument.docuSignEnvelopeId = envelope.envelopeId;
      agreementDocument.status = 'sent';
      agreementDocument.sentAt = new Date();
      agreementDocument.esignProvider = 'docusign';
      agreementDocument.envelopeEvents.push({
        status: 'sent',
        payload: envelope,
      });
      await agreementDocument.save();

      return NextResponse.json({
        success: true,
        envelopeId: envelope.envelopeId,
      });
    } catch (error) {
      console.error('Unable to send agreement via DocuSign:', error);
      agreementDocument.status = 'send_failed';
      agreementDocument.esignError = error instanceof Error ? error.message : 'DocuSign sending failed';
      await agreementDocument.save();
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Unable to send agreement via DocuSign.',
        },
        { status: 500 }
      );
    }
  }

  // Internal E-Signature Workflow
  try {
    const { hashPdf, generateSecureToken, hashToken } = require('@/utils/cryptoUtils');
    const { sendClientSigningInvite } = require('@/lib/agreements/email');

    const originalPdfSha256 = hashPdf(pdfBuffer);
    const clientToken = generateSecureToken();
    const clientTokenHash = hashToken(clientToken);

    // Save tokens and PDF hashes in document
    agreementDocument.esignProvider = 'internal';
    agreementDocument.esignError = '';
    agreementDocument.originalPdfSha256 = originalPdfSha256;
    agreementDocument.originalPdfUrl = agreementDocument.generatedPdfUrl;
    agreementDocument.originalPdfStorageKey = agreementDocument.generatedPdfPath;

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
    // Sending from the authenticated admin panel applies the configured
    // provider's typed signature before the client receives the document.
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
    agreementDocument.clientTokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
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
    const registerCache = globalThis.__nineJobsAdminAgreementListCache;
    if (registerCache) {
      registerCache.data = null;
      registerCache.expiresAt = 0;
      registerCache.promise = null;
    }

    // Send email invitation containing the raw token
    await sendClientSigningInvite(agreementDocument, clientToken, providerSignedPdf, request.url);

    return NextResponse.json({
      success: true,
      message: 'Agreement sent to client successfully.',
    });
  } catch (error) {
    console.error('Unable to send agreement internally:', error);
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
