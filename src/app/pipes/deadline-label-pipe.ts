import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, getDaysUntil } from '../utils/date';

@Pipe({ name: 'deadlineLabel' })
export class DeadlineLabelPipe implements PipeTransform {
  /**
   * Turns a survey's end date into the text of its deadline badge.
   * @param endDate - The end date in the form "YYYY-MM-DD", or null when the survey never ends.
   * @returns The badge text, for example "Ends in 3 Days" or "Ended on 09.11.2026".
   */
  transform(endDate: string | null): string {
    if (endDate === null) {
      return 'No end date';
    }
    const daysLeft = getDaysUntil(endDate);
    if (daysLeft < 0) {
      return `Ended on ${formatDate(endDate)}`;
    }
    if (daysLeft === 0) {
      return 'Ends today';
    }
    return `Ends in ${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'}`;
  }
}
