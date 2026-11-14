export interface AnswerResult {
  id: number;
  position: number;
  share: number;
}

export interface QuestionResult {
  id: number;
  position: number;
  text: string;
  answers: AnswerResult[];
}
