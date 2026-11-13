import { Component, input } from '@angular/core';
import { Survey } from '../../models/survey';

@Component({
  selector: 'app-survey-card',
  styleUrl: './survey-card.scss',
  templateUrl: './survey-card.html',
})
export class SurveyCard {
  readonly survey = input.required<Survey>();
}
