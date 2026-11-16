import { Component, effect, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { SurveyCategory } from '../../models/survey-category';
import { QuestionForm, SurveyFieldName } from '../../models/survey-form';
import { CreateDialog } from '../../services/create-dialog';
import { getTodayInGermany } from '../../utils/date';
import { focusAfterRender } from '../../utils/focus';
import { describeError, isErrorVisible } from '../../utils/form-errors';
import {
  createQuestionGroup,
  createSurveyForm,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  removeOrClear,
} from '../../utils/survey-form';
import { AddIcon } from '../add-icon/add-icon';
import { CategoryFilter } from '../category-filter/category-filter';
import { DeleteButton } from '../delete-button/delete-button';
import { QuestionFields } from '../question-fields/question-fields';

const REQUIRED_MESSAGES: Partial<Record<SurveyFieldName, string>> = {
  title: 'Please enter a survey name.',
  category: 'Please choose a category.',
};
const FALLBACK_REQUIRED_MESSAGE = 'Please fill in this field.';

@Component({
  imports: [ReactiveFormsModule, AddIcon, CategoryFilter, DeleteButton, QuestionFields],
  selector: 'app-create-survey-dialog',
  styleUrl: './create-survey-dialog.scss',
  templateUrl: './create-survey-dialog.html',
})
export class CreateSurveyDialog {
  private readonly createDialog = inject(CreateDialog);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly form = signal(createSurveyForm());
  protected readonly isPublishAttempted = signal(false);
  protected readonly today = getTodayInGermany();
  protected readonly maxQuestions = MAX_QUESTIONS;

  get questions(): FormArray<QuestionForm> {
    return this.form().controls.questions;
  }

  constructor() {
    effect(() => this.syncDialog(this.createDialog.isOpen()));
  }

  /** Closes the dialog and drops every input; the Escape key ends up here as well. */
  closeDialog(): void {
    this.createDialog.close();
    this.form.set(createSurveyForm());
    this.isPublishAttempted.set(false);
  }

  /**
   * Stores the chosen category in the form.
   * @param category - The chosen category; null never comes, as the menu offers no "all" entry.
   */
  selectCategory(category: SurveyCategory | null): void {
    const control = this.form().controls.category;
    control.setValue(category);
    control.markAsTouched();
  }

  /**
   * Empties one field, as the bin next to it promises.
   * @param name - The field to empty.
   */
  clearField(name: SurveyFieldName): void {
    this.form().controls[name].reset();
  }

  /**
   * Describes what is wrong with a field once it may be shown.
   * @param name - The field to check.
   * @returns One sentence naming the cause, or an empty string while there is nothing to show.
   */
  getError(name: SurveyFieldName): string {
    const control = this.form().controls[name];
    if (!isErrorVisible(control, this.isPublishAttempted())) {
      return '';
    }
    return (
      describeError(control.errors, REQUIRED_MESSAGES[name] ?? FALLBACK_REQUIRED_MESSAGE) ?? ''
    );
  }

  /** Adds an empty question below the others and puts the cursor into it. */
  addQuestion(): void {
    if (this.isQuestionLimitReached()) {
      return;
    }
    this.questions.push(createQuestionGroup());
    focusAfterRender(this.host, `question-${this.questions.length}`, this.injector);
  }

  /**
   * Deletes a question, or empties it while it is the only one.
   * @param index - The position of the question, starting at 0.
   */
  removeQuestion(index: number): void {
    removeOrClear(this.questions, index, MIN_QUESTIONS, createQuestionGroup);
  }

  /**
   * Tells whether the survey already holds as many questions as allowed.
   * @returns True once no further question may be added.
   */
  isQuestionLimitReached(): boolean {
    return this.questions.length >= MAX_QUESTIONS;
  }

  /**
   * Turns the index of a question into the number shown in front of it.
   * @param index - The position of the question, starting at 0.
   * @returns The number of the question, starting at 1.
   */
  getPosition(index: number): number {
    return index + 1;
  }

  /**
   * Tells whether a field shows an error, so assistive technology can announce it.
   * @param name - The field to check.
   * @returns True while the field shows an error.
   */
  hasError(name: SurveyFieldName): boolean {
    return this.getError(name) !== '';
  }

  /**
   * Shows or hides the native dialog so it matches the requested state; it always opens at the top.
   * @param isOpen Whether the dialog should be visible.
   */
  private syncDialog(isOpen: boolean): void {
    const dialog = this.dialog().nativeElement;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    }
    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }
}
