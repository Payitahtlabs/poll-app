import { AnswerOption } from './answer-option';

export interface Question {
  id: number;
  survey_id: number;
  position: number;
  text: string;
  allow_multiple: boolean;
}

export interface QuestionWithOptions extends Question {
  answer_options: AnswerOption[];
}
