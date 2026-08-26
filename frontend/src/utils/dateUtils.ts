/**
 * Utility functions for handling date-only values (no time component)
 * to avoid timezone-related off-by-one day errors.
 *
 * Problem: JavaScript's `new Date("YYYY-MM-DD")` parses as UTC midnight.
 * In negative UTC offsets (e.g. UTC-3 Argentina), this becomes the previous
 * day in local time, causing Mantine's DatePickerInput to display one day behind.
 *
 * Solution:
 * - parseLocalDate: extracts YYYY-MM-DD and creates a LOCAL midnight Date
 *   so that getDate() returns the correct day for UI display.
 * - formatLocalDate: uses getUTC*() methods because Mantine's DatePickerInput
 *   creates Date objects at UTC midnight when the user picks a date.
 */

/**
 * Parses a date string (e.g. "1996-05-29" or "1996-05-29T00:00:00.000Z")
 * into a Date at local midnight, safe for display in Mantine components.
 */
export const parseLocalDate = (dateString?: string | null): Date | null => {
  if (!dateString) return null;
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
};

/**
 * Formats a Date into an ISO string preserving the correct calendar day,
 * safe for sending to the backend. Uses UTC methods because Mantine's
 * DatePickerInput creates Date objects at UTC midnight.
 */
export const formatLocalDate = (dateValue?: any): string | undefined => {
  if (!dateValue) return undefined;

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

  if (!(date instanceof Date) || isNaN(date.getTime())) return undefined;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}T12:00:00.000Z`;
};
