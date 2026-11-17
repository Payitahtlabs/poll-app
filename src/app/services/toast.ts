import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Toast {
  private readonly messageState = signal('');
  private readonly visibleState = signal(false);
  readonly message = this.messageState.asReadonly();
  readonly isVisible = this.visibleState.asReadonly();

  /**
   * Shows a short message that needs no answer.
   * @param message - The sentence to show.
   */
  show(message: string): void {
    this.messageState.set(message);
    this.visibleState.set(true);
  }

  /** Hides the message; the text stays, so it can still be read while it slides away. */
  hide(): void {
    this.visibleState.set(false);
  }
}
