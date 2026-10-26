// Calculate in whole cents so GST is rounded once, without floating-point drift.
export function calculateInvoiceGst(amount) {
  const value = String(amount ?? '').trim();
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const [dollars, cents = ''] = value.split('.');
  const subtotalCents = BigInt(dollars) * 100n + BigInt(cents.padEnd(2, '0'));
  const gstCents = (subtotalCents + 5n) / 10n;
  const money = (cents) => `${cents / 100n}.${String(cents % 100n).padStart(2, '0')}`;
  return {
    subtotal: money(subtotalCents),
    gstRate: 10,
    gstAmount: money(gstCents),
    total: money(subtotalCents + gstCents),
  };
}

export function applyInvoiceGst(payload) {
  return payload.gstRate === 10
    ? { ...payload, ...calculateInvoiceGst(payload.subtotal) }
    : payload;
}
