import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';

@Component({
  imports: [RouterLink],
  selector: 'app-survey-detail',
  styleUrl: './survey-detail.scss',
  templateUrl: './survey-detail.html',
})
export class SurveyDetail {
  private readonly surveysService = inject(Surveys);
  readonly id = input.required({ transform: numberAttribute });
  readonly survey = computed(() =>
    this.surveysService.surveys().find((survey) => survey.id === this.id()),
  );
  readonly isNotFound = computed(() => this.surveysService.hasLoaded() && !this.survey());
}
