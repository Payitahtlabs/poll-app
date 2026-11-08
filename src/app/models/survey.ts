import { SurveyCategory } from './survey-category';

export interface Survey {
  id: number;
  created_at: string;
  title: string;
  category: SurveyCategory;
  description: string | null;
  end_date: string | null;
}
