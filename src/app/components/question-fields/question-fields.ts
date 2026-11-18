import { Component, computed, ElementRef, inject, Injector, input, output } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { QuestionForm } from '../../models/survey-form';
import { focusAfterRender } from '../../utils/focus';
import { describeAnswerError, describeError, isErrorVisible } from '../../utils/form-errors';
import {
  createAnswerControl,
  MAX_ANSWERS,
  MIN_ANSWERS,
  removeOrClear,
} from '../../utils/survey-form';
import { toAnswerLetter } from '../../utils/text';
import { AddIcon } from '../add-icon/add-icon';
import { DeleteButton } from '../delete-button/delete-button';

@Component({
  imports: [ReactiveFormsModule, AddIcon, DeleteButton],
  selector: 'app-question-fields',
  styleUrl: './question-fields.scss',
  templateUrl: './question-fields.html',
})
export class QuestionFields {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  readonly question = input.required<QuestionForm>();
  readonly position = input.required<number>();
  readonly isPublishAttempted = input(false);
  readonly removed = output<void>();
  protected readonly maxAnswers = MAX_ANSWERS;
  protected readonly fieldId = computed(() => `question-${this.position()}`);
  protected readonly errorId = computed(() => `${this.fieldId()}-error`);
  protected readonly answersTitleId = computed(() => `${this.fieldId()}-answers`);
  protected readonly answerErrorId = computed(() => `${this.fieldId()}-answer-error`);
  protected readonly deleteLabel = computed(() => `Delete question ${this.position()}`);

  /**
   * Gives the template the answer fields of this question to loop over.
   * @returns The answer controls of the question.
   */
  get answers(): FormArray<FormControl<string>> {
    return this.question().controls.answers;
  }

  /** Asks the dialog to delete this question; it decides whether the question goes or empties. */
  removeQuestion(): void {
    this.removed.emit();
  }

  /** Adds an empty answer below the others and puts the cursor into it. */
  addAnswer(): void {
    if (this.isAnswerLimitReached()) {
      return;
    }
    this.answers.push(createAnswerControl());
    focusAfterRender(this.host, this.getAnswerId(this.answers.length - 1), this.injector);
  }

  /**
   * Deletes an answer, or empties it while the question has only the answers it needs.
   * @param index - The position of the answer, starting at 0.
   */
  removeAnswer(index: number): void {
    removeOrClear(this.answers, index, MIN_ANSWERS, createAnswerControl);
  }

  /**
   * Tells whether the question already holds as many answers as allowed.
   * @returns True once no further answer may be added.
   */
  isAnswerLimitReached(): boolean {
    return this.answers.length >= MAX_ANSWERS;
  }

  /**
   * Builds the id of an answer field, so its label and the focus can find it.
   * @param index - The position of the answer, starting at 0.
   * @returns For example "question-1-answer-2".
   */
  getAnswerId(index: number): string {
    return `${this.fieldId()}-answer-${index + 1}`;
  }

  /**
   * Turns the position of an answer into the letter shown next to it.
   * @param index - The position of the answer, starting at 0.
   * @returns "A" for 0, "B" for 1 and so on.
   */
  getAnswerLetter(index: number): string {
    return toAnswerLetter(index + 1);
  }

  /**
   * Names the bin of an answer for assistive technology.
   * @param index - The position of the answer, starting at 0.
   * @returns For example "Delete answer B of question 1".
   */
  getAnswerDeleteLabel(index: number): string {
    return `Delete answer ${this.getAnswerLetter(index)} of question ${this.position()}`;
  }

  /**
   * Describes what is wrong with the question text once it may be shown.
   * @returns One sentence naming the cause, or an empty string while there is nothing to show.
   */
  getQuestionError(): string {
    const control = this.question().controls.text;
    if (!isErrorVisible(control, this.isPublishAttempted())) {
      return '';
    }
    return describeError(control.errors, 'Please enter a question.') ?? '';
  }

  /**
   * Tells whether the question text shows an error, so assistive technology can announce it.
   * @returns True while the question text shows an error.
   */
  hasQuestionError(): boolean {
    return this.getQuestionError() !== '';
  }

  /**
   * Tells whether an answer field is wrong and may say so, so the focus can find it.
   * @param answer - The answer field to check.
   * @returns True while the answer is wrong and its error may be shown.
   */
  hasAnswerError(answer: FormControl<string>): boolean {
    return isErrorVisible(answer, this.isPublishAttempted());
  }

  /**
   * Describes the first problem among the answers that may be shown.
   * @returns One sentence naming the answer and the cause, or an empty string.
   */
  getAnswerError(): string {
    return describeAnswerError(this.answers.controls, this.isPublishAttempted());
  }
}
