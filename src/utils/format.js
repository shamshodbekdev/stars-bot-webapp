/**
 * Formatting helpers. Numbers use a thin space as thousands separator,
 * which is the convention for so'm amounts in all three app languages.
 */

/** 1234567 -> "1 234 567" */
export function formatNumber(value) {
  const num = Math.floor(Number(value) || 0);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** 15000 -> "15 000 so'm" (currency label comes from translations) */
export function formatSom(amount, currency = "so'm") {
  return `${formatNumber(amount)} ${currency}`;
}

/** Normalises user input like " @Name " to "Name". */
export function cleanUsername(value = '') {
  return value.trim().replace(/^@+/, '');
}

/** Telegram usernames: 5–32 chars, letters, digits and underscores. */
export function isValidUsername(value = '') {
  return /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(cleanUsername(value));
}

/** Keeps only digits — used for numeric text inputs. */
export function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '');
}
