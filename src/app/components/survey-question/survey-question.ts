import { Component, computed, input, output } from '@angular/core';
import { QuestionWithOptions } from '../../models/question';
import { AnswerLetterPipe } from '../../pipes/answer-letter-pipe';

@Component({
  imports: [AnswerLetterPipe],
  selector: 'app-survey-question',
  styleUrl: './survey-question.scss',
  templateUrl: './survey-question.html',
})
export class SurveyQuestion {
  readonly question = input.required<QuestionWithOptions>();
  readonly selectedIds = input.required<number[]>();
  readonly answerToggled = output<number>();
  readonly inputType = computed(() => (this.question().allow_multiple ? 'checkbox' : 'radio'));
  readonly groupName = computed(() => `question-${this.question().id}`);

  /**
   * Tells whether an answer is currently chosen.
   * @param optionId - The id of the answer.
   * @returns True when the answer is among the chosen ones.
   */
  isSelected(optionId: number): boolean {
    return this.selectedIds().includes(optionId);
  }
}
