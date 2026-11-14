const GERMAN_TIME_ZONE = 'Europe/Berlin';
const ISO_DATE_LOCALE = 'en-CA';
const MILLISECONDS_PER_DAY = 86_400_000;

/**
 * Returns today's date as it is in Germany.
 * @returns Today's date in the form "YYYY-MM-DD".
 */
export function getTodayInGermany(): string {
  return new Date().toLocaleDateString(ISO_DATE_LOCALE, { timeZone: GERMAN_TIME_ZONE });
}

/**
 * Counts the whole days from today in Germany until the given date.
 * @param isoDate - A date in the form "YYYY-MM-DD".
 * @returns 0 for today, a positive number for future dates, a negative one once it has passed.
 */
export function getDaysUntil(isoDate: string): number {
  const difference = Date.parse(isoDate) - Date.parse(getTodayInGermany());
  return Math.round(difference / MILLISECONDS_PER_DAY);
}

/**
 * Tells whether a survey has ended; on its end date it still counts as running.
 * @param endDate - The end date in the form "YYYY-MM-DD", or null when the survey never ends.
 * @returns True once the end date lies before today.
 */
export function hasEnded(endDate: string | null): boolean {
  return endDate !== null && getDaysUntil(endDate) < 0;
}

/**
 * Orders two dates so that the earlier one comes first; a missing date counts as the earliest.
 * @param first - A date in the form "YYYY-MM-DD", or null when there is none.
 * @param second - The date to compare it with, in the same form.
 * @returns Negative when the first date is earlier, positive when it is later, 0 when equal.
 */
export function compareDates(first: string | null, second: string | null): number {
  return (first ?? '').localeCompare(second ?? '');
}

/**
 * Writes a date the way the design shows it.
 * @param isoDate - A date in the form "YYYY-MM-DD".
 * @returns The date in the form "DD.MM.YYYY".
 */
export function formatDate(isoDate: string): string {
  return isoDate.split('-').reverse().join('.');
}
