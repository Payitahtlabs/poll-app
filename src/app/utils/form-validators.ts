import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { getTodayInGermany } from './date';

/**
 * Rejects text that is empty or holds only spaces, as the database does.
 * @param control - The field holding the text.
 * @returns A "required" error for blank text, otherwise null.
 */
export function trimmedRequired(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() === '' ? { required: true } : null;
}

/**
 * Builds a validator that counts characters without the surrounding spaces, as the database does.
 * @param maxLength - The most characters allowed after trimming.
 * @returns A validator that reports a "maxlength" error for longer text.
 */
export function trimmedMaxLength(maxLength: number): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const actualLength = control.value.trim().length;
    const isTooLong = actualLength > maxLength;
    return isTooLong ? { maxlength: { requiredLength: maxLength, actualLength } } : null;
  };
}

/**
 * Rejects an end date before today in Germany; an empty field means the survey never ends.
 * @param control - The field holding a date in the form "YYYY-MM-DD", or an empty string.
 * @returns A "pastDate" error for a date that has passed, otherwise null.
 */
export function notInPast(control: AbstractControl<string>): ValidationErrors | null {
  const isPast = control.value !== '' && control.value < getTodayInGermany();
  return isPast ? { pastDate: true } : null;
}
