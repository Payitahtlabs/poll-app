import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  styleUrl: './delete-button.scss',
  templateUrl: './delete-button.html',
})
export class DeleteButton {
  readonly label = input.required<string>();
  readonly pressed = output<void>();

  /** Reports the click to the parent, which decides what gets deleted. */
  press(): void {
    this.pressed.emit();
  }
}
