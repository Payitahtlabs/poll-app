import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../models/survey';
import { DeadlineLabelPipe } from '../../pipes/deadline-label-pipe';

@Component({
  imports: [DeadlineLabelPipe, RouterLink],
  selector: 'app-survey-card',
  styleUrl: './survey-card.scss',
  templateUrl: './survey-card.html',
})
export class SurveyCard {
  readonly survey = input.required<Survey>();
}
