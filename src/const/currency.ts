/**
 * Currency constants (erasable syntax)
 */
export const CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
  CNY: 'CNY',
  AUD: 'AUD',
  CAD: 'CAD',
  CHF: 'CHF',
  INR: 'INR',
  BRL: 'BRL',
  RUB: 'RUB',
} as const;

/**
 * Currency type (union of all currency values)
 */
export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY] | (string & {});
