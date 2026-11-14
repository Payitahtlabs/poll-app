import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, hasEnded } from '../utils/date';

@Pipe({ name: 'deadlineDate' })
export class DeadlineDatePipe implements PipeTransform {
  /**
   * Turns a survey's end date into the date line of its detail page.
   * @param endDate - The end date in the form "YYYY-MM-DD", or null when the survey never ends.
   * @returns The line, for example "Ends on 18.11.2026" or "Ended on 09.11.2026".
   */
  transform(endDate: string | null): string {
    if (endDate === null) {
      return 'No end date';
    }
    const verb = hasEnded(endDate) ? 'Ended' : 'Ends';
    return `${verb} on ${formatDate(endDate)}`;
  }
}
