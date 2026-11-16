import { ValidationErrors } from '@angular/forms';

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
