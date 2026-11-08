export interface Question {
  id: number;
  survey_id: number;
  position: number;
  text: string;
  allow_multiple: boolean;
}
