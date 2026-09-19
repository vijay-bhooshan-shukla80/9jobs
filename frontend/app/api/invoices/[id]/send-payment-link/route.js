import nodemailer from 'nodemailer';
import { buildPaymentLinkEmailHtml } from '@/lib/billing/payment-link-email';
import { NextResponse } from 'next/server';

import { requireAdminApiSession } from '@/lib/admin/auth/require-admin';
import { createInvoicePaymentLink, getInvoiceDocumentById } from '@/lib/invoices/service';

function createMailer() {
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailPass) {
    throw new Error('GMAIL_PASS is not defined.');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'Info@9jobs.co',
      pass: gmailPass,
    },
  });
}

export async function POST(request, { params }) {
  const session = await requireAdminApiSession(request);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const invoice = await getInvoiceDocumentById(id);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
    }

    const origin = request.nextUrl?.origin || new URL(request.url).origin;
    const { checkoutUrl, whatsappShareUrl } = await createInvoicePaymentLink(id, origin);
    const transporter = createMailer();

    await transporter.sendMail({
      from: '"9 Jobs" <Info@9jobs.co>',
      to: invoice.billedToEmail,
      subject: '9Jobs Payment Details',
      attachDataUrls: true,
      html: buildPaymentLinkEmailHtml(invoice, checkoutUrl),
    });

    return NextResponse.json({ checkoutUrl, whatsappShareUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to send payment link email.' }, { status: 500 });
  }
}
