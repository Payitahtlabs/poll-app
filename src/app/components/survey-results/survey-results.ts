import { Component, computed, input, signal } from '@angular/core';
import { QuestionWithOptions } from '../../models/question';
import { AnswerLetterPipe } from '../../pipes/answer-letter-pipe';
import { countVotes, toQuestionResult } from '../../utils/votes';

@Component({
  imports: [AnswerLetterPipe],
  selector: 'app-survey-results',
  styleUrl: './survey-results.scss',
  templateUrl: './survey-results.html',
})
export class SurveyResults {
  readonly questions = input.required<QuestionWithOptions[]>();
  readonly isOpen = signal(true);
  readonly results = computed(() => this.questions().map(toQuestionResult));
  readonly hasVotes = computed(() =>
    this.questions().some((question) => countVotes(question.answer_options) > 0),
  );
  readonly toggleLabel = computed(() => (this.isOpen() ? 'Close results' : 'Show results'));

  /** Closes the results when they are open and opens them when they are closed. */
  toggleResults(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
