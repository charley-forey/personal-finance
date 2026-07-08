import type OpenAI from 'openai';

export type ParsedDocumentType = 'w2' | '1099' | 'statement' | 'receipt' | 'tax_return' | 'other';

const DOCUMENT_PROMPTS: Record<string, string> = {
  w2: 'Extract W-2 fields: employerName, employerEin, employeeName, employeeSsnLast4, wagesTipsCompensation, federalTaxWithheld, socialSecurityWages, socialSecurityTaxWithheld, medicareWages, medicareTaxWithheld, stateWages, stateTaxWithheld, taxYear.',
  '1099': 'Extract 1099 fields: payerName, payerTin, recipientName, recipientTinLast4, formType (1099-INT, 1099-DIV, 1099-NEC, etc.), boxAmounts (object mapping box numbers to amounts), taxYear.',
  default: 'Extract key financial fields: documentType, issuer, recipient, amounts (array of {label, amount}), taxYear, dates.',
};

export async function parseDocumentText(
  client: OpenAI,
  documentType: ParsedDocumentType | string,
  rawText: string,
): Promise<Record<string, unknown>> {
  const fieldGuide = DOCUMENT_PROMPTS[documentType] ?? DOCUMENT_PROMPTS.default;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You extract structured data from financial document text. ${fieldGuide} Return JSON only with extracted fields. Use null for missing values.`,
      },
      {
        role: 'user',
        content: rawText.slice(0, 12000),
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content) as Record<string, unknown>;
}
