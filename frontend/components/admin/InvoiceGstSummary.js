import { calculateInvoiceGst } from '@/lib/invoices/gst';

export default function InvoiceGstSummary({ amount }) {
  const breakdown = calculateInvoiceGst(amount);
  if (!breakdown) return null;

  return (
    <div className="admin-field admin-field--full" aria-live="polite">
      <span>Subtotal: AUD ${breakdown.subtotal}</span>
      <span>+ GST (10%): AUD ${breakdown.gstAmount}</span>
      <strong>Total including GST: AUD ${breakdown.total}</strong>
    </div>
  );
}
