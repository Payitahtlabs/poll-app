import { Component, computed, inject, signal } from '@angular/core';
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
  readonly isShowingPast = signal(false);
  readonly isShowingActive = computed(() => !this.isShowingPast());
  readonly visibleSurveys = computed(() =>
    this.isShowingPast() ? this.surveysService.pastSurveys() : this.surveysService.activeSurveys(),
  );

  /** Switches the list to the surveys that are still running. */
  showActive(): void {
    this.isShowingPast.set(false);
  }

  /** Switches the list to the surveys that have ended. */
  showPast(): void {
    this.isShowingPast.set(true);
  }
}
