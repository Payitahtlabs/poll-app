import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SurveyCategory } from '../../models/survey-category';
import { SurveyFieldName } from '../../models/survey-form';
import { CreateDialog } from '../../services/create-dialog';
import { getTodayInGermany } from '../../utils/date';
import { describeError } from '../../utils/form-errors';
import { createSurveyForm } from '../../utils/survey-form';
import { CategoryFilter } from '../category-filter/category-filter';
import { DeleteButton } from '../delete-button/delete-button';

const REQUIRED_MESSAGES: Partial<Record<SurveyFieldName, string>> = {
  title: 'Please enter a survey name.',
  category: 'Please choose a category.',
};
const FALLBACK_REQUIRED_MESSAGE = 'Please fill in this field.';

@Component({
  imports: [ReactiveFormsModule, CategoryFilter, DeleteButton],
  selector: 'app-create-survey-dialog',
  styleUrl: './create-survey-dialog.scss',
  templateUrl: './create-survey-dialog.html',
})
export class CreateSurveyDialog {
  private readonly createDialog = inject(CreateDialog);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly form = signal(createSurveyForm());
  protected readonly today = getTodayInGermany();

  constructor() {
    effect(() => this.syncDialog(this.createDialog.isOpen()));
  }

  /** Closes the dialog and drops every input; the Escape key ends up here as well. */
  closeDialog(): void {
    this.createDialog.close();
    this.form.set(createSurveyForm());
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
   * Describes what is wrong with a field once the visitor has left it.
   * @param name - The field to check.
   * @returns One sentence naming the cause, or an empty string while there is nothing to show.
   */
  getError(name: SurveyFieldName): string {
    const control = this.form().controls[name];
    if (!control.touched) {
      return '';
    }
    return (
      describeError(control.errors, REQUIRED_MESSAGES[name] ?? FALLBACK_REQUIRED_MESSAGE) ?? ''
    );
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
