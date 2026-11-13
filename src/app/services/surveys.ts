import { computed, Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../models/survey';
import { hasEnded } from '../utils/date';

@Injectable({ providedIn: 'root' })
export class Surveys {
  private readonly supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  private readonly surveyList = signal<Survey[]>([]);
  readonly surveys = this.surveyList.asReadonly();
  readonly activeSurveys = computed(() =>
    this.surveyList().filter((survey) => !hasEnded(survey.end_date)),
  );
  readonly pastSurveys = computed(() =>
    this.surveyList().filter((survey) => hasEnded(survey.end_date)),
  );

  /** Starts loading the surveys as soon as the service is created. */
  constructor() {
    this.loadSurveys();
  }

  /** Loads all surveys from the database, newest first. */
  private async loadSurveys(): Promise<void> {
    const { data } = await this.supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });
    this.surveyList.set((data ?? []) as Survey[]);
  }
}
