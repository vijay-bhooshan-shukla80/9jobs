import { describe, expect, test } from '@jest/globals';
import { fortnightAgreementInputSchema } from '@/lib/fortnight-agreements/schema';
import { buildFortnightAgreementTemplate } from '@/lib/fortnight-agreements/template';
import FortnightAgreement from '@/models/FortnightAgreement';

const input = {
  clientName: 'Test Client', clientEmail: 'client@example.com', clientPhone: '+61400000000',
  providerName: 'Aditya', providerEmail: 'provider@example.com', providerPhone: '+61400000001',
  providerSignatureName: 'Aditya Singh', agreementDate: '2026-09-08',
  servicePrice: 'AUD $200', initialTerm: '2 month',
};

describe('fortnight success fee days', () => {
  test('legacy agreements retain their original fee wording', () => {
    const parsed = fortnightAgreementInputSchema.parse(input);
    expect(parsed.permanentSuccessFeeDays).toBe(14);
    expect(parsed.shortTermSuccessFeeDays).toBe(7);
    const section = buildFortnightAgreementTemplate(input).sections[3];
    expect(section.paragraphs[1]).toContain('fourteen (14) days');
    expect(section.paragraphs[2]).toContain('seven (7) days');
  });

  test('custom form values survive validation and model serialization into the PDF template', () => {
    const parsed = fortnightAgreementInputSchema.parse({
      ...input, permanentSuccessFeeDays: '21', shortTermSuccessFeeDays: '10',
    });
    const saved = new FortnightAgreement(parsed).toObject();
    expect(saved.permanentSuccessFeeDays).toBe(21);
    expect(saved.shortTermSuccessFeeDays).toBe(10);
    const template = buildFortnightAgreementTemplate(saved);
    expect(template.sections[3].paragraphs[1]).toContain('21 days');
    expect(template.sections[3].paragraphs[2]).toContain('10 days');
    expect(template.sections[4].paragraphs[0]).toContain('within seven (7) days');
  });

  test.each(['', 'abc', 0, -1, 1.5, null])('rejects invalid day value %p', (value) => {
    for (const field of ['permanentSuccessFeeDays', 'shortTermSuccessFeeDays']) {
      expect(fortnightAgreementInputSchema.safeParse({ ...input, [field]: value }).success).toBe(false);
    }
  });
});
