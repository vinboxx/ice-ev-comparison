export function formatCurrencyTHB(value: number, locale: string = 'en-TH') {
  if (!isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
