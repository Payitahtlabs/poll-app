import { SurveyCategory } from './survey-category';

export interface NewQuestion {
  text: string;
  allowMultiple: boolean;
  answers: string[];
}

export interface NewSurvey {
  title: string;
  category: SurveyCategory;
  description: string;
  endDate: string | null;
  questions: NewQuestion[];
}
