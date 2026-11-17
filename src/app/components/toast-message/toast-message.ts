import { Component, DestroyRef, effect, inject, untracked } from '@angular/core';
import { Toast } from '../../services/toast';

const DISPLAY_TIME_MS = 5000;

@Component({
  host: { role: 'status' },
  selector: 'app-toast-message',
  styleUrl: './toast-message.scss',
  templateUrl: './toast-message.html',
})
export class ToastMessage {
  private readonly toast = inject(Toast);
  private timerId: ReturnType<typeof setTimeout> | undefined;
  protected readonly message = this.toast.message;
  protected readonly isVisible = this.toast.isVisible;

  /** Starts the countdown whenever the message appears and stops it when the app closes. */
  constructor() {
    effect(() => {
      if (this.isVisible()) {
        untracked(() => this.startTimer());
      }
    });
    inject(DestroyRef).onDestroy(() => this.stopTimer());
  }

  /** Hides the message before its time is up. */
  close(): void {
    this.stopTimer();
    this.toast.hide();
  }

  /** Gives the message its full time again, for example after the pointer left it. */
  startTimer(): void {
    this.stopTimer();
    this.timerId = setTimeout(() => this.toast.hide(), DISPLAY_TIME_MS);
  }

  /** Holds the message while the pointer or the focus rests on it. */
  stopTimer(): void {
    clearTimeout(this.timerId);
  }
}
