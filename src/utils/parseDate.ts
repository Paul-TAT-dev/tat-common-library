import { parse, parseISO, isValid } from "date-fns";

/**
 * Date formats DatePicker accepts when the user types manually.
 * Ordered from most specific to most ambiguous.
 */
export const COMMON_DATE_FORMATS: ReadonlyArray<string> = [
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "MM-dd-yyyy",
  "MM.dd.yyyy",
  "MM dd yyyy",
  "MM/dd/yy",
  "MM.dd.yy",
  "MM-dd-yy",
  "MM dd yy",
  "ddMMMyy",
  "dd MMM yy",
  "dd MMM yyyy",
  "MMM dd yyyy",
  "MMMM dd yyyy",
  "ddMMM",
  "MMMM dd",
  "MMM dd",
  "MMMM d, yyyy",
  "MMM d, yyyy",
  "MMMM d",
  "MMM d",
  "MM/dd",
  "MM.dd",
  "MM-dd",
  "MM dd",
];

/**
 * Formats with no year token. date-fns fills in any component missing from
 * the format string using the reference date passed to `parse` — since we
 * pass "now", these always land in the *current* year, even when that
 * month/day already happened. Mirrors Zoho's own Validate.DateYearAdjust
 * (the Deluge helper the invoice360 form scripts use for exactly this
 * shape of input, e.g. "23oct", "23 Oct", "10/23"): a depart/return date
 * typed without a year is assumed to mean the next upcoming occurrence of
 * that month/day, not one that may have already passed this year.
 */
const YEARLESS_FORMATS = new Set<string>([
  "ddMMM",
  "MMMM dd",
  "MMM dd",
  "MMMM d",
  "MMM d",
  "MM/dd",
  "MM.dd",
  "MM-dd",
  "MM dd",
]);

/**
 * If `date` (already defaulted to `referenceDate`'s year by date-fns) falls
 * chronologically before `referenceDate` within that shared year, bump it
 * to next year instead — the same-day case (e.g. typing today's own
 * month/day) is left alone, only a month/day that's already passed moves
 * forward.
 */
function adjustYearIfAlreadyPassed(date: Date, referenceDate: Date): Date {
  const refMonthDay = referenceDate.getMonth() * 100 + referenceDate.getDate();
  const dateMonthDay = date.getMonth() * 100 + date.getDate();
  if (dateMonthDay < refMonthDay) {
    const adjusted = new Date(date);
    adjusted.setFullYear(date.getFullYear() + 1);
    return adjusted;
  }
  return date;
}

/** Best-effort parse of a user-typed date string. */
export function parseDate(val: string): Date | null {
  if (!val) return null;
  const trimmed = val.trim();

  const iso = parseISO(trimmed);
  if (isValid(iso)) return iso;

  const now = new Date();
  for (const fmt of COMMON_DATE_FORMATS) {
    const parsed = parse(trimmed, fmt, now);
    if (isValid(parsed)) {
      return YEARLESS_FORMATS.has(fmt)
        ? adjustYearIfAlreadyPassed(parsed, now)
        : parsed;
    }
  }

  const jsDate = new Date(trimmed);
  return isValid(jsDate) ? jsDate : null;
}
