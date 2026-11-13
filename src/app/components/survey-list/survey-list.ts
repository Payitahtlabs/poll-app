import { Component, inject } from '@angular/core';
import { Surveys } from '../../services/surveys';
import { SurveyCard } from '../survey-card/survey-card';

@Component({
  imports: [SurveyCard],
  selector: 'app-survey-list',
  styleUrl: './survey-list.scss',
  templateUrl: './survey-list.html',
})
export class SurveyList {
  private readonly surveysService = inject(Surveys);
  readonly surveys = this.surveysService.surveys;
}
