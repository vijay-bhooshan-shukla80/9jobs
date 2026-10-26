import { describe, expect, test } from '@jest/globals';
import { calculateInvoiceGst } from '@/lib/invoices/gst';
import { invoiceInputSchema } from '@/lib/invoices/schema';
import { fortnightInvoiceInputSchema } from '@/lib/fortnight-invoices/schema';
import Invoice from '@/models/Invoice';
import FortnightInvoice from '@/models/FortnightInvoice';
import { generateInvoicePdfBuffer } from '@/lib/invoices/pdf';
import { generateFortnightInvoicePdfBuffer } from '@/lib/fortnight-invoices/pdf';
import { inflateSync } from 'node:zlib';

const input = {
  invoiceNumber: 'GST-001', invoiceDate: '2026-10-26',
  billedToName: 'Sample Client', billedToEmail: 'client@example.com',
  billedToPhone: '+61 400 000 000', weekLabel: '1', monthLabel: '1',
  issuedDate: '2026-10-26', validUntil: '2026-11-02', dueDate: '2026-10-27',
  description: 'Weekly Plan', duration: '1 WEEK', total: '200',
};

describe('invoice GST', () => {
  test.each([
    ['200', '20.00', '220.00'], ['99.99', '10.00', '109.99'],
    ['0.05', '0.01', '0.06'], ['0.04', '0.00', '0.04'],
  ])('rounds GST to cents for %s', (subtotal, gstAmount, total) => {
    expect(calculateInvoiceGst(subtotal)).toMatchObject({ gstAmount, total, gstRate: 10 });
  });

  test.each([invoiceInputSchema, fortnightInvoiceInputSchema])('validates and recalculates totals on the server', (schema) => {
    const result = schema.parse({ ...input, subtotal: '200', gstRate: 10, total: '1', gstAmount: '0' });
    expect(result).toMatchObject({ subtotal: '200.00', gstAmount: '20.00', total: '220.00' });
    expect(schema.parse(result)).toEqual(result); // Editing/revalidation must not add GST twice.
    expect(schema.parse(input).total).toBe('200'); // Historical invoices stay unchanged.
    expect(schema.safeParse({ ...input, gstRate: 10 }).success).toBe(false);
    expect(schema.safeParse({ ...input, subtotal: '2.001', gstRate: 10 }).success).toBe(false);
  });

  test.each([Invoice, FortnightInvoice])('persists the breakdown beside the payable total', (Model) => {
    const document = new Model({ ...input, ...calculateInvoiceGst('200') });
    expect(document.validateSync()).toBeUndefined();
    expect(document.toObject()).toMatchObject({ subtotal: '200.00', gstRate: 10, gstAmount: '20.00', total: '220.00' });
  });

  test.each([generateInvoicePdfBuffer, generateFortnightInvoicePdfBuffer])('prints GST and the inclusive total in the PDF', async (generate) => {
    const buffer = await generate({ ...input, ...calculateInvoiceGst('200') });
    // Inspect actual PDF text operations, which pdf-lib writes as hex in Flate streams.
    const raw = buffer.toString('latin1');
    const streams = [...raw.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)];
    const text = streams.flatMap((match) => {
      try {
        return [...inflateSync(Buffer.from(match[1], 'latin1')).toString().matchAll(/<([0-9A-F]+)>/gi)]
          .map((item) => Buffer.from(item[1], 'hex').toString());
      } catch { return []; }
    }).join(' ');
    expect(text).toContain('+ GST (10%):');
    expect(text).toContain('$20.00');
    expect(text).toContain('$200.00');
    expect(text).toContain('$220.00');
    if (process.env.GST_PREVIEW_PATH && generate === generateInvoicePdfBuffer) {
      require('node:fs').writeFileSync(process.env.GST_PREVIEW_PATH, buffer);
    }
  });
});
