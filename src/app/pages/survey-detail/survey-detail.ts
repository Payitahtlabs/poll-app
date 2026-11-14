import { Component, computed, inject, input, numberAttribute, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveyQuestion } from '../../components/survey-question/survey-question';
import { DeadlineDatePipe } from '../../pipes/deadline-date-pipe';
import { Surveys } from '../../services/surveys';
import { hasEnded } from '../../utils/date';

@Component({
  imports: [RouterLink, SurveyQuestion, DeadlineDatePipe],
  selector: 'app-survey-detail',
  styleUrl: './survey-detail.scss',
  templateUrl: './survey-detail.html',
})
export class SurveyDetail implements OnInit {
  private readonly surveysService = inject(Surveys);
  readonly id = input.required({ transform: numberAttribute });
  readonly survey = computed(() =>
    this.surveysService.surveys().find((survey) => survey.id === this.id()),
  );
  readonly questions = this.surveysService.questions;
  readonly isNotFound = computed(() => this.surveysService.hasLoaded() && !this.survey());
  readonly isRunning = computed(() => {
    const survey = this.survey();
    return survey !== undefined && !hasEnded(survey.end_date);
  });

  /** Loads the questions of the survey named in the address. */
  ngOnInit(): void {
    this.surveysService.openSurvey(this.id());
  }
}
