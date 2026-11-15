import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateDialog {
  private readonly openState = signal(false);
  readonly isOpen = this.openState.asReadonly();

  /** Opens the dialog for creating a survey. */
  open(): void {
    this.openState.set(true);
  }

  /** Closes the dialog for creating a survey. */
  close(): void {
    this.openState.set(false);
  }
}
