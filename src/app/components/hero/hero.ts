import { Component, inject } from '@angular/core';
import { CreateDialog } from '../../services/create-dialog';

@Component({
  selector: 'app-hero',
  styleUrl: './hero.scss',
  templateUrl: './hero.html',
})
export class Hero {
  private readonly createDialog = inject(CreateDialog);

  /** Opens the dialog for creating a survey. */
  openDialog(): void {
    this.createDialog.open();
  }
}
