import { Pipe, PipeTransform } from '@angular/core';

const LETTER_A_CODE = 'A'.charCodeAt(0);

@Pipe({ name: 'answerLetter' })
export class AnswerLetterPipe implements PipeTransform {
  /**
   * Turns the position of an answer into its letter.
   * @param position - The position of the answer, starting at 1.
   * @returns "A" for 1, "B" for 2 and so on.
   */
  transform(position: number): string {
    return String.fromCharCode(LETTER_A_CODE + position - 1);
  }
}
