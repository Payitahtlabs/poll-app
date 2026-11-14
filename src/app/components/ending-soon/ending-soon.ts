import { Component, computed, inject } from '@angular/core';
import { Surveys } from '../../services/surveys';
import { HighlightCard } from '../highlight-card/highlight-card';

@Component({
  imports: [HighlightCard],
  selector: 'app-ending-soon',
  styleUrl: './ending-soon.scss',
  templateUrl: './ending-soon.html',
})
export class EndingSoon {
  private readonly surveysService = inject(Surveys);
  readonly surveys = this.surveysService.endingSoonSurveys;
  readonly isVisible = computed(
    () => !this.surveysService.hasLoaded() || this.surveys().length > 0,
  );
}
