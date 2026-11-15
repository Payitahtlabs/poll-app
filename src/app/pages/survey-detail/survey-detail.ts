import { Component, computed, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveyQuestion } from '../../components/survey-question/survey-question';
import { SurveyResults } from '../../components/survey-results/survey-results';
import { QuestionWithOptions } from '../../models/question';
import { DeadlineDatePipe } from '../../pipes/deadline-date-pipe';
import { Surveys } from '../../services/surveys';
import { hasEnded } from '../../utils/date';
import { toggleAnswer } from '../../utils/selection';

@Component({
  imports: [RouterLink, SurveyQuestion, SurveyResults, DeadlineDatePipe],
  selector: 'app-survey-detail',
  styleUrl: './survey-detail.scss',
  templateUrl: './survey-detail.html',
})
export class SurveyDetail implements OnInit {
  private readonly surveysService = inject(Surveys);
  readonly id = input.required({ transform: numberAttribute });
  readonly selectedOptionIds = signal<number[]>([]);
  readonly survey = computed(() =>
    this.surveysService.surveys().find((survey) => survey.id === this.id()),
  );
  readonly questions = this.surveysService.questions;
  readonly hasLoadedQuestions = this.surveysService.hasLoadedQuestions;
  readonly isNotFound = computed(() => this.surveysService.hasLoaded() && !this.survey());
  readonly isRunning = computed(() => {
    const survey = this.survey();
    return survey !== undefined && !hasEnded(survey.end_date);
  });

  /** Loads the questions of the survey named in the address. */
  ngOnInit(): void {
    this.surveysService.openSurvey(this.id());
  }

  /**
   * Keeps track of the chosen answers after one of them was clicked.
   * @param question - The question the clicked answer belongs to.
   * @param optionId - The id of the clicked answer.
   */
  updateSelection(question: QuestionWithOptions, optionId: number): void {
    this.selectedOptionIds.update((ids) => toggleAnswer(ids, question, optionId));
  }
}
