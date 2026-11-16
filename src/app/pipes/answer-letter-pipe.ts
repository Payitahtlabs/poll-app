import { Pipe, PipeTransform } from '@angular/core';
import { toAnswerLetter } from '../utils/text';

@Pipe({ name: 'answerLetter' })
export class AnswerLetterPipe implements PipeTransform {
  /**
   * Turns the position of an answer into its letter.
   * @param position - The position of the answer, starting at 1.
   * @returns "A" for 1, "B" for 2 and so on.
   */
  transform(position: number): string {
    return toAnswerLetter(position);
  }
}
