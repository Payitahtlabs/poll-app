import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreateDialog } from '../../services/create-dialog';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  private readonly createDialog = inject(CreateDialog);
  readonly isDialogOpen = this.createDialog.isOpen;

  /** Opens the dialog for creating a survey. */
  openDialog(): void {
    this.createDialog.open();
  }
}
