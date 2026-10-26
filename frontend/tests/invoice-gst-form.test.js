import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from '@jest/globals';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ToastProvider } from '@/components/admin/ToastProvider';
import UnifiedInvoiceBuilder from '@/components/admin/UnifiedInvoiceBuilder';
import InvoiceForm from '@/components/admin/InvoiceForm';
import FortnightInvoiceForm from '@/components/admin/FortnightInvoiceForm';

function renderForm(form) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={{}}><ToastProvider>{form}</ToastProvider></AppRouterContext.Provider>
  );
}

const defaults = {
  invoiceNumber: 'GST-001', invoiceDate: '2026-10-26', issuedDate: '2026-10-26',
  validUntil: '2026-11-02', dueDate: '2026-10-27', billedToName: '', billedToEmail: '',
  billedToPhone: '', weekLabel: '1', monthLabel: '1', description: 'Weekly Plan', duration: '1 WEEK',
};

describe('GST invoice forms', () => {
  test('shows base amount plus GST and the payable total in the create builder', () => {
    const html = renderForm(<UnifiedInvoiceBuilder weeklyDefaults={defaults} fortnightDefaults={defaults} />);
    expect(html).toContain('Payment Amount (AUD, excluding GST)');
    expect(html).toContain('Subtotal: AUD $200.00');
    expect(html).toContain('+ GST (10%): AUD $20.00');
    expect(html).toContain('Total including GST: AUD $220.00');
  });

  test.each([InvoiceForm, FortnightInvoiceForm])('edits the base amount while preserving the inclusive total', (Form) => {
    const html = renderForm(<Form mode="edit" initialValues={{ ...defaults, subtotal: '200.00', gstRate: 10, gstAmount: '20.00', total: '220.00' }} />);
    expect(html).toContain('value="200.00"');
    expect(html).toContain('Total including GST: AUD $220.00');
    expect(html).not.toContain('value="220.00"');

    const legacyHtml = renderForm(<Form mode="edit" initialValues={{ ...defaults, total: '200' }} />);
    expect(legacyHtml).toContain('value="200"');
    expect(legacyHtml).not.toContain('Total including GST');
  });
});
