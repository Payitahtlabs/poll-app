import { Component, input } from '@angular/core';
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
}
