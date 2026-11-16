import { AbstractControl, ValidationErrors } from '@angular/forms';
import { toAnswerLetter } from './text';

const PAST_DATE_MESSAGE = "The end date can't be in the past.";

/**
 * Turns the errors of a form field into one sentence that names the cause.
 * @param errors - The errors of the field, or null when it is valid.
 * @param requiredMessage - The sentence for a field that was left empty.
 * @returns The sentence for the first error, or null when there is none.
 */
export function describeError(
  errors: ValidationErrors | null,
  requiredMessage: string,
): string | null {
  const maxLength = errors?.['maxlength'] as { requiredLength: number } | undefined;
  if (errors?.['required']) {
    return requiredMessage;
  }
  if (maxLength) {
    return `Use at most ${maxLength.requiredLength} characters.`;
  }
  return errors?.['pastDate'] ? PAST_DATE_MESSAGE : null;
}

/**
 * Decides whether a field may show its error yet: once the visitor typed in it and left it,
 * or once they tried to publish. Fields skipped while building the survey stay quiet.
 * @param control - The field to check.
 * @param isPublishAttempted - Whether the visitor has already pressed Publish.
 * @returns True when the field is invalid and its error should be shown.
 */
export function isErrorVisible(control: AbstractControl, isPublishAttempted: boolean): boolean {
  const isLeftAfterTyping = control.dirty && control.touched;
  return control.invalid && (isPublishAttempted || isLeftAfterTyping);
}

/**
 * Names the first answer of a question that the visitor left empty or made too long.
 * @param answers - The answer fields of one question, in order.
 * @param isPublishAttempted - Whether the visitor has already pressed Publish.
 * @returns For example "Please fill in answer B.", or an empty string while all are fine.
 */
export function describeAnswerError(
  answers: AbstractControl<string>[],
  isPublishAttempted: boolean,
): string {
  const index = answers.findIndex((answer) => isErrorVisible(answer, isPublishAttempted));
  if (index === -1) {
    return '';
  }
  const letter = toAnswerLetter(index + 1);
  const errors = answers[index].errors;
  if (errors?.['required']) {
    return `Please fill in answer ${letter}.`;
  }
  return `Answer ${letter}: ${describeError(errors, '') ?? ''}`;
}
