/**
 * Credit-card helpers extracted from CreditCardInput so they can be unit-tested
 * and reused.
 */

const CARD_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/^3[47][0-9]{0,13}$/, "American Express"],
  [/^3(?:0[0-5]|[68][0-9])[0-9]{0,11}$/, "Diners Club"],
  [/^6(?:011|5[0-9]{2})[0-9]{0,12}$/, "Discover"],
  [/^63[7-9][0-9]{0,13}$/, "InstaPayment"],
  [/^(?:2131|1800|35\d{0,3})\d{0,11}$/, "JCB"],
  [/^(6304|6706|6709|6771)[0-9]{0,15}$/, "Laser"],
  [/^(5018|5020|5038|6304|6759|676[1-3]|0604|6390)[0-9]{0,15}$/, "Maestro"],
  [
    /^(5[1-5][0-9]{0,14}|2(2[2-9][0-9]{0,12}|[3-6][0-9]{0,13}|7[01][0-9]{0,12}|720[0-9]{0,12}))$/,
    "MasterCard",
  ],
  [/^4[0-9]{0,15}$/, "Visa"],
];

/** Returns the card brand for a (possibly partial) number, or undefined. */
export function detectCardType(number: string): string | undefined {
  const cleaned = number.replace(/\D/g, "");
  for (const [pattern, name] of CARD_PATTERNS) {
    if (pattern.test(cleaned)) return name;
  }
  return undefined;
}

/**
 * Formats an MMYY expiry as MM/YY while the user is typing, handling
 * the auto-inserted slash and deletion through it.
 */
export function formatExpiry(input: string, prev: string): string {
  const digits = input.replace(/\D/g, "");
  const prevDigits = prev.replace(/\D/g, "");
  const isDeleting = digits.length < prevDigits.length;

  if (!digits) return "";

  if (isDeleting) {
    // Remove slash cleanly (e.g. "03/" → "03").
    if (prev.endsWith("/") && digits.length === 2) return digits;
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
  }

  // Single-digit month: auto-pad and add slash for 2-9.
  if (digits.length === 1) {
    const first = parseInt(digits, 10);
    if (first > 1 && first <= 9) return `0${first}/`;
    return digits;
  }

  // Two digits — complete month.
  if (digits.length === 2) {
    let month = parseInt(digits, 10);
    if (month === 0) return "";
    if (month > 12) month = 12;
    return `${month.toString().padStart(2, "0")}/`;
  }

  return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
}
