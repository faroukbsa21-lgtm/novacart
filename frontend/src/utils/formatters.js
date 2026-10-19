/**
 * Currency & Formatting Utilities for Algerian E-Commerce Market
 * 100% Native Algerian Dinars (DZD / DA / د.ج)
 * No USD or foreign currencies.
 */

/**
 * Format a native DZD price with Algerian standard space separator and language-aware symbol
 * @param {number|string} amount 
 * @param {string} lang - 'ar' | 'en' | 'fr'
 * @returns {string} e.g. "34 900 د.ج" or "34 900 DZD" or "34 900 DA"
 */
export function formatDZD(amount, lang = 'fr') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  const rounded = Math.round(num);

  // Format with space as thousands separator (Algerian national standard)
  const formattedNumber = rounded.toLocaleString('fr-DZ').replace(/,/g, ' ');

  if (lang === 'ar') {
    return `${formattedNumber} د.ج`;
  }
  if (lang === 'en') {
    return `${formattedNumber} DZD`;
  }
  return `${formattedNumber} DA`;
}

/**
 * Format a native DZD amount
 * @param {number|string} amountDZD 
 * @param {string} lang 
 * @returns {string}
 */
export function formatNativeDZD(amountDZD, lang = 'fr') {
  return formatDZD(amountDZD, lang);
}

/**
 * Format currency helper
 * @param {number|string} amount 
 * @param {string} lang 
 * @returns {string}
 */
export function formatCurrency(amount, lang = 'fr') {
  return formatDZD(amount, lang);
}

/**
 * Backward compatibility adapter for components migrating from formatDualPrice
 * Returns strictly DZD values without any foreign currency
 * @param {number|string} priceDZD 
 * @param {string} lang 
 * @returns {{ dzd: string, rawDzd: number }}
 */
export function formatDualPrice(priceDZD, lang = 'fr') {
  const num = typeof priceDZD === 'number' ? priceDZD : parseFloat(priceDZD || 0);
  const rawDzd = Math.round(num);
  return {
    dzd: formatDZD(rawDzd, lang),
    usd: '', // No USD on entire site
    rawDzd
  };
}
