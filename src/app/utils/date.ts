const GERMAN_TIME_ZONE = 'Europe/Berlin';
const ISO_DATE_LOCALE = 'en-CA';
const MILLISECONDS_PER_DAY = 86_400_000;

/**
 * Returns today's date as it is in Germany, the same day the database uses.
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
 * Writes a date the way the design shows it.
 * @param isoDate - A date in the form "YYYY-MM-DD".
 * @returns The date in the form "DD.MM.YYYY".
 */
export function formatDate(isoDate: string): string {
  return isoDate.split('-').reverse().join('.');
}
