import { Component, computed, inject, signal } from '@angular/core';
import { SurveyCategory } from '../../models/survey-category';
import { Surveys } from '../../services/surveys';
import { CategoryFilter } from '../category-filter/category-filter';
import { SurveyCard } from '../survey-card/survey-card';

@Component({
  imports: [CategoryFilter, SurveyCard],
  selector: 'app-survey-list',
  styleUrl: './survey-list.scss',
  templateUrl: './survey-list.html',
})
export class SurveyList {
  private readonly surveysService = inject(Surveys);
  readonly isShowingPast = signal(false);
  readonly isShowingActive = computed(() => !this.isShowingPast());
  readonly selectedCategory = signal<SurveyCategory | null>(null);
  private readonly tabSurveys = computed(() =>
    this.isShowingPast() ? this.surveysService.pastSurveys() : this.surveysService.activeSurveys(),
  );
  readonly visibleSurveys = computed(() => {
    const category = this.selectedCategory();
    return this.tabSurveys().filter((survey) => category === null || survey.category === category);
  });
  readonly isEmpty = computed(
    () => this.surveysService.hasLoaded() && this.visibleSurveys().length === 0,
  );

  /** Switches the list to the surveys that are still running. */
  showActive(): void {
    this.isShowingPast.set(false);
  }

  /** Switches the list to the surveys that have ended. */
  showPast(): void {
    this.isShowingPast.set(true);
  }

  /**
   * Narrows the list to one category.
   * @param category - The category to show, or null for all surveys.
   */
  selectCategory(category: SurveyCategory | null): void {
    this.selectedCategory.set(category);
  }
}
