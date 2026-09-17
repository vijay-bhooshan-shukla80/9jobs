import paymentEmailLogo from './payment-email-logo';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

export function buildPaymentLinkEmailHtml(invoice, checkoutUrl, paymentMode) {
  const durationLabel = String(invoice.duration || '').trim();
  const rawDeadline = String(invoice.dueDate || '').trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDeadline)
    ? new Date(rawDeadline + 'T00:00:00Z') : null;
  const deadline = date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    : rawDeadline || 'the invoice due date';
  const modeCopy = paymentMode === 'monthly_autopay'
    ? 'Your first monthly payment will activate automatic monthly billing until cancelled.'
    : paymentMode === 'upfront'
      ? 'This is an upfront one-time invoice and will not activate autopay.'
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<title>Payment Request — 9JOBS</title>
<style>
html,body{margin:0!important;padding:0!important;width:100%!important;background:#fff!important;}
body{font-family:Arial,Helvetica,sans-serif;color:#171717;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
table{border-collapse:collapse!important;mso-table-lspace:0pt;mso-table-rspace:0pt;}
img{border:0;outline:none;text-decoration:none;display:block;height:auto;}
a{text-decoration:none;}
.wrap{width:100%;max-width:620px;margin:0 auto;}
@media only screen and (max-width:600px){
 .pad{padding-left:18px!important;padding-right:18px!important;}
 .payment-card{height:auto!important;}
 .shadow-pad{padding-left:0!important;padding-right:0!important;}
 .card-pad{padding-left:22px!important;padding-right:22px!important;}
 .amount{font-size:38px!important;}
 .subject{font-size:16px!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#171717;">
<table role="presentation" width="100%" style="background:#fff;">
<tr><td align="center">

<table role="presentation" width="100%" class="wrap" style="width:100%;max-width:620px;margin:0 auto;">

<!-- EMAIL HEADER -->
<tr>
<td class="pad" align="center" style="padding:22px 30px 16px;">
<img src="data:image/png;base64,${paymentEmailLogo}" width="165" alt="9JOBS - Job Application Service" style="width:165px;max-width:165px;">
</td>
</tr>

<!-- MAIN CARD -->
<tr>
<td class="shadow-pad" style="padding:8px 0 18px;">
<!-- Soft table shadow remains visible when CSS shadows are stripped. -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#ffffff" style="background:#ffffff;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#ffffff" style="background:#ffffff;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fefefe" style="background:#fefefe;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fefefe" style="background:#fefefe;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fdfdfd" style="background:#fdfdfd;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fdfdfd" style="background:#fdfdfd;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fcfcfc" style="background:#fcfcfc;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fbfbfb" style="background:#fbfbfb;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fafafa" style="background:#fafafa;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#fafafa" style="background:#fafafa;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f8f8f8" style="background:#f8f8f8;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f7f7f7" style="background:#f7f7f7;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f6f6f6" style="background:#f6f6f6;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f5f5f5" style="background:#f5f5f5;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f4f4f4" style="background:#f4f4f4;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f2f2f2" style="background:#f2f2f2;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f1f1f1" style="background:#f1f1f1;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#efefef" style="background:#efefef;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#eeeeee" style="background:#eeeeee;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#ececec" style="background:#ececec;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#eaeaea" style="background:#eaeaea;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#e8e8e8" style="background:#e8e8e8;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#e6e6e6" style="background:#e6e6e6;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#e4e4e4" style="background:#e4e4e4;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#e2e2e2" style="background:#e2e2e2;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#e0e0e0" style="background:#e0e0e0;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#dedede" style="background:#dedede;padding:0 1px 1px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#dcdcdc" style="background:#dcdcdc;padding:0 1px 3px;">
<table role="presentation" class="payment-card" width="100%" height="564" style="height:564px;background:#fff;border:1px solid #e2e2e2;border-radius:0;box-shadow:0 20px 40px rgba(0,0,0,.18),0 8px 18px rgba(0,0,0,.10);">

<!-- LIME TOP BORDER -->
<tr>
<td style="height:8px;background:#D8FF3F;font-size:0;line-height:0;box-shadow:0 3px 0 #b7db22,0 6px 10px rgba(0,0,0,.12);">&nbsp;</td>
</tr>

<!-- PAYMENT INTRO -->
<tr>
<td class="card-pad" align="center" style="padding:24px 32px 20px;background:#faffea;box-shadow:inset 0 -3px 10px rgba(0,0,0,.035);">
<div style="font-size:18px;line-height:1.5;color:#111;">Dear <strong>${escapeHtml(invoice.billedToName)}</strong>,</div>

<div style="font-size:16px;line-height:1.65;margin-top:19px;color:#171717;">
Please complete your payment to activate your <strong>9JOBS</strong> service.
</div>

<div class="amount" style="font-size:46px;line-height:1.1;font-weight:900;color:#111;margin-top:18px;text-shadow:0 2px 0 #fff,0 5px 10px rgba(0,0,0,.16);">
AUD $${escapeHtml(invoice.total)}
</div>
</td>
</tr>

<!-- DESCRIPTION -->
<tr>
<td class="card-pad" align="center" style="padding:20px 32px 8px;">
<div style="font-size:13px;letter-spacing:1.2px;color:#333;font-weight:700;">DESCRIPTION</div>
<div style="font-size:18px;line-height:1.5;color:#111;font-weight:700;margin-top:11px;">
<strong>${escapeHtml(invoice.description)}</strong>
</div>
<div style="font-size:14px;line-height:1.5;color:#333;font-weight:600;margin-top:6px;">
${escapeHtml(durationLabel)}
</div>
</td>
</tr>

${modeCopy ? `<tr><td align="center" style="padding:8px 32px 0;font-size:14px;line-height:1.6;color:#333;">${modeCopy}</td></tr>` : ''}

<!-- PAY BUTTON -->
<tr>
<td align="center" style="padding:20px 25px 9px;">
<table role="presentation" width="273" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:273px;margin:0 auto;"><tr>
<td align="center" bgcolor="#D8FF3F" style="background:#D8FF3F;border-bottom:5px solid #b7db22;">
<a href="${escapeHtml(checkoutUrl)}" style="display:block;background:#D8FF3F;color:#111;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:24px;font-weight:900;letter-spacing:.2px;padding:15px 20px;text-align:center;text-decoration:none;border:0;border-radius:0;">
<strong style="font-weight:900;">PAY NOW</strong>
</a>
</td></tr></table>
</td>
</tr>

<!-- DEADLINE -->
<tr>
<td align="center" style="padding:10px 25px 20px;">
<div style="font-size:14px;line-height:1.6;color:#333;">
Kindly complete your payment by
<strong style="color:#222;">${escapeHtml(deadline)}</strong>.
</div>
</td>
</tr>

<!-- REGARDS -->
<tr>
<td align="center" style="padding:5px 25px 7px;">
<div style="font-size:15px;line-height:1.65;color:#171717;">
Regards,<br>
<a href="https://9jobs.co/" style="color:#111;font-weight:700;">9jobs.co</a><br>
<strong>9JOBS Team</strong><br>
<a href="tel:+61422279428" style="color:#111;"></a>
</div>
</td>
</tr>

</table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td class="pad" align="center" style="padding:0 28px 25px;border-top:1px solid #e4e4e4;">
<div style="font-size:10px;line-height:1.6;color:#444;padding-top:13px;">
9JOBS — Your Job Search. Our Expertise.<br>
Professional Job Application Service
</div>
</td>
</tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}
