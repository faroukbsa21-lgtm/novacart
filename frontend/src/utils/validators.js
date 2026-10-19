/**
 * Security Email Domain Validation
 * Restricts emails to famous, reputable email providers (Google, Microsoft, Yahoo, Apple, Proton)
 * to prevent spam bots, disposable email fraud, and malicious accounts.
 */

export const TRUSTED_EMAIL_DOMAINS = [
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft (Outlook, Hotmail, Live, MSN)
  'outlook.com', 'outlook.fr', 'outlook.dz', 'outlook.es', 'outlook.de', 'outlook.co.uk',
  'hotmail.com', 'hotmail.fr', 'hotmail.dz', 'hotmail.es', 'hotmail.de', 'hotmail.co.uk', 'hotmail.it',
  'live.com', 'live.fr', 'live.dz', 'live.co.uk',
  'msn.com',
  // Yahoo
  'yahoo.com', 'yahoo.fr', 'yahoo.dz', 'yahoo.co.uk', 'yahoo.es', 'yahoo.ca', 'ymail.com',
  // Apple / iCloud
  'icloud.com', 'me.com', 'mac.com',
  // Proton
  'proton.me', 'protonmail.com'
];

/**
 * Check if an email is from a trusted, famous email provider
 * @param {string} email 
 * @param {boolean} allowDev 
 * @returns {boolean}
 */
export function isTrustedEmailDomain(email, allowDev = false) {
  if (!email || typeof email !== 'string') return false;
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1];

  // In development, allow test domain
  if (allowDev && (domain === 'ecommerce.test' || domain === 'localhost')) {
    return true;
  }

  // Exact match
  if (TRUSTED_EMAIL_DOMAINS.includes(domain)) {
    return true;
  }

  // Dynamic regex for outlook.*, hotmail.*, live.*, yahoo.*
  const famousCompanyRegex = /^(outlook|hotmail|live|yahoo)\.[a-z]{2,3}(\.[a-z]{2,3})?$/i;
  return famousCompanyRegex.test(domain);
}
