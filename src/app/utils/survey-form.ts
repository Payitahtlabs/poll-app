import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyCategory } from '../models/survey-category';
import { QuestionForm, SurveyForm } from '../models/survey-form';
import { notInPast, trimmedMaxLength, trimmedRequired } from './form-validators';

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;
export const QUESTION_MAX_LENGTH = 150;
export const ANSWER_MAX_LENGTH = 80;
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 6;

/**
 * Creates an empty text field that must be filled.
 * @param maxLength - The most characters allowed after trimming.
 * @returns A field that rejects blank and too long text.
 */
function createRequiredText(maxLength: number): FormControl<string> {
  return new FormControl('', {
    nonNullable: true,
    validators: [trimmedRequired, trimmedMaxLength(maxLength)],
  });
}

/**
 * Creates an empty answer field.
 * @returns A field for one answer.
 */
export function createAnswerControl(): FormControl<string> {
  return createRequiredText(ANSWER_MAX_LENGTH);
}

/**
 * Creates an empty question with the two answer fields every question needs.
 * @returns A question with its text, the multiple-answers switch and two answers.
 */
export function createQuestionGroup(): QuestionForm {
  const answers = Array.from({ length: MIN_ANSWERS }, () => createAnswerControl());
  return new FormGroup({
    text: createRequiredText(QUESTION_MAX_LENGTH),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    answers: new FormArray(answers, [
      Validators.minLength(MIN_ANSWERS),
      Validators.maxLength(MAX_ANSWERS),
    ]),
  });
}

/**
 * Creates the empty survey form with one question, limited like the database.
 * @returns The form behind the create survey dialog.
 */
export function createSurveyForm(): SurveyForm {
  return new FormGroup({
    title: createRequiredText(TITLE_MAX_LENGTH),
    endDate: new FormControl('', { nonNullable: true, validators: [notInPast] }),
    category: new FormControl<SurveyCategory | null>(null, [Validators.required]),
    description: new FormControl('', {
      nonNullable: true,
      validators: [trimmedMaxLength(DESCRIPTION_MAX_LENGTH)],
    }),
    questions: new FormArray(
      [createQuestionGroup()],
      [Validators.minLength(MIN_QUESTIONS), Validators.maxLength(MAX_QUESTIONS)],
    ),
  });
}

/**
 * Removes an entry from a list, or empties it when the list is already at its minimum.
 * @param list - The questions or answers of the form.
 * @param index - The position of the entry in the list, starting at 0.
 * @param minimum - The fewest entries the list may hold.
 * @param createEmpty - Builds an empty entry to put in its place.
 */
export function removeOrClear<T extends AbstractControl>(
  list: FormArray<T>,
  index: number,
  minimum: number,
  createEmpty: () => T,
): void {
  if (list.length > minimum) {
    list.removeAt(index);
    return;
  }
  list.setControl(index, createEmpty());
}
