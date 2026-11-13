import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Survey } from '../models/survey';
import { hasEnded } from '../utils/date';

const SURVEYS_CHANNEL = 'surveys-live';
const SURVEYS_TABLE = { schema: 'public', table: 'surveys' };

@Injectable({ providedIn: 'root' })
export class Surveys implements OnDestroy {
  private readonly supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  private readonly channel = this.supabase.channel(SURVEYS_CHANNEL);
  private readonly surveyList = signal<Survey[]>([]);
  private readonly loadFinished = signal(false);
  readonly surveys = this.surveyList.asReadonly();
  readonly hasLoaded = this.loadFinished.asReadonly();
  readonly activeSurveys = computed(() =>
    this.surveyList().filter((survey) => !hasEnded(survey.end_date)),
  );
  readonly pastSurveys = computed(() =>
    this.surveyList().filter((survey) => hasEnded(survey.end_date)),
  );

  /** Starts loading the surveys and listening for changes as soon as the service is created. */
  constructor() {
    this.loadSurveys();
    this.listenForChanges();
  }

  /** Stops listening for changes when the service is destroyed. */
  ngOnDestroy(): void {
    this.supabase.removeChannel(this.channel);
  }

  /** Loads all surveys from the database, newest first. */
  private async loadSurveys(): Promise<void> {
    const { data } = await this.supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });
    this.surveyList.set((data ?? []) as Survey[]);
    this.loadFinished.set(true);
  }
  /** Keeps the list in step with surveys that are created or changed in the database. */
  private listenForChanges(): void {
    this.channel
      .on('postgres_changes', { event: 'INSERT', ...SURVEYS_TABLE }, (payload) =>
        this.addSurvey(payload.new as Survey),
      )
      .on('postgres_changes', { event: 'UPDATE', ...SURVEYS_TABLE }, (payload) =>
        this.replaceSurvey(payload.new as Survey),
      )
      .subscribe();
  }

  /**
   * Puts a new survey at the top of the list, where the newest belongs.
   * @param survey - The survey that was just created.
   */
  private addSurvey(survey: Survey): void {
    this.surveyList.update((list) => [survey, ...list]);
  }

  /**
   * Swaps a changed survey into the place of its old version.
   * @param survey - The survey with its new values.
   */
  private replaceSurvey(survey: Survey): void {
    this.surveyList.update((list) => list.map((item) => (item.id === survey.id ? survey : item)));
  }
}
