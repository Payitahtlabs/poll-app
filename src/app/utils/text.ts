const LETTER_A_CODE = 'A'.charCodeAt(0);

/**
 * Turns the position of an answer into its letter.
 * @param position - The position of the answer, starting at 1.
 * @returns "A" for 1, "B" for 2 and so on.
 */
export function toAnswerLetter(position: number): string {
  return String.fromCharCode(LETTER_A_CODE + position - 1);
}

/**
 * Joins numbers into an English list with "and" before the last one.
 * @param numbers - The numbers to join, at least one.
 * @returns The list as text, for example "1, 2 and 4".
 */
export function joinAsList(numbers: number[]): string {
  const head = numbers.slice(0, -1).join(', ');
  const last = String(numbers.at(-1));
  return head ? `${head} and ${last}` : last;
}

/**
 * Builds the hint that names the questions still missing an answer.
 * @param positions - The numbers of the unanswered questions, at least one.
 * @returns For example "Please answer questions 2 and 4."
 */
export function describeUnanswered(positions: number[]): string {
  const noun = positions.length === 1 ? 'question' : 'questions';
  return `Please answer ${noun} ${joinAsList(positions)}.`;
}
