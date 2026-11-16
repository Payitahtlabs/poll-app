import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SurveyCategory } from './survey-category';

export type QuestionForm = FormGroup<{
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  answers: FormArray<FormControl<string>>;
}>;

export type SurveyForm = FormGroup<{
  title: FormControl<string>;
  endDate: FormControl<string>;
  category: FormControl<SurveyCategory | null>;
  description: FormControl<string>;
  questions: FormArray<QuestionForm>;
}>;

export type SurveyFieldName = Exclude<keyof SurveyForm['controls'], 'questions'>;
