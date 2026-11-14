import { Component, input } from '@angular/core';
import { Survey } from '../../models/survey';
import { DeadlineLabelPipe } from '../../pipes/deadline-label-pipe';

@Component({
  imports: [DeadlineLabelPipe],
  selector: 'app-highlight-card',
  styleUrl: './highlight-card.scss',
  templateUrl: './highlight-card.html',
})
export class HighlightCard {
  readonly survey = input.required<Survey>();
}
