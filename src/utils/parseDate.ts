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

/** Best-effort parse of a user-typed date string. */
export function parseDate(val: string): Date | null {
  if (!val) return null;
  const trimmed = val.trim();

  const iso = parseISO(trimmed);
  if (isValid(iso)) return iso;

  for (const fmt of COMMON_DATE_FORMATS) {
    const parsed = parse(trimmed, fmt, new Date());
    if (isValid(parsed)) return parsed;
  }

  const jsDate = new Date(trimmed);
  return isValid(jsDate) ? jsDate : null;
}
