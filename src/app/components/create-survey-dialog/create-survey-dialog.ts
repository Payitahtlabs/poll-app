import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { CreateDialog } from '../../services/create-dialog';

@Component({
  selector: 'app-create-survey-dialog',
  styleUrl: './create-survey-dialog.scss',
  templateUrl: './create-survey-dialog.html',
})
export class CreateSurveyDialog {
  private readonly createDialog = inject(CreateDialog);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => this.syncDialog(this.createDialog.isOpen()));
  }

  /** Closes the dialog; the Escape key ends up here as well. */
  closeDialog(): void {
    this.createDialog.close();
  }

  /**
   * Shows or hides the native dialog so it matches the requested state.
   * @param isOpen Whether the dialog should be visible.
   */
  private syncDialog(isOpen: boolean): void {
    const dialog = this.dialog().nativeElement;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    }
    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }
}
