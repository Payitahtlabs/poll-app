import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AnswerOption } from '../models/answer-option';
import { NewSurvey } from '../models/new-survey';
import { QuestionWithOptions } from '../models/question';
import { Survey } from '../models/survey';
import { compareDates, hasEnded } from '../utils/date';
import { replaceById } from '../utils/lists';

const SURVEYS_CHANNEL = 'surveys-live';
const SURVEYS_TABLE = { schema: 'public', table: 'surveys' };
const ANSWER_OPTIONS_TABLE = { schema: 'public', table: 'answer_options' };
const ENDING_SOON_COUNT = 3;

@Injectable({ providedIn: 'root' })
export class Surveys implements OnDestroy {
  private readonly supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  private readonly channel = this.supabase.channel(SURVEYS_CHANNEL);
  private readonly surveyList = signal<Survey[]>([]);
  private readonly loadFinished = signal(false);
  private readonly questionList = signal<QuestionWithOptions[]>([]);
  private readonly questionsLoadFinished = signal(false);
  readonly surveys = this.surveyList.asReadonly();
  readonly hasLoaded = this.loadFinished.asReadonly();
  readonly questions = this.questionList.asReadonly();
  readonly hasLoadedQuestions = this.questionsLoadFinished.asReadonly();
  readonly activeSurveys = computed(() =>
    this.surveyList().filter((survey) => !hasEnded(survey.end_date)),
  );
  readonly pastSurveys = computed(() =>
    this.surveyList().filter((survey) => hasEnded(survey.end_date)),
  );
  readonly endingSoonSurveys = computed(() =>
    this.activeSurveys()
      .filter((survey) => survey.end_date !== null)
      .sort((first, second) => compareDates(first.end_date, second.end_date))
      .slice(0, ENDING_SOON_COUNT),
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

  /**
   * Loads the questions of one survey with their answer options, both in their set order.
   * @param surveyId - The id of the survey that was opened.
   */
  async openSurvey(surveyId: number): Promise<void> {
    this.questionList.set([]);
    this.questionsLoadFinished.set(false);
    const { data } = await this.supabase
      .from('questions')
      .select('*, answer_options(*)')
      .eq('survey_id', surveyId)
      .order('position')
      .order('position', { referencedTable: 'answer_options' });
    this.questionList.set((data ?? []) as QuestionWithOptions[]);
    this.questionsLoadFinished.set(true);
  }

  /**
   * Sends the chosen answers of one survey as a single vote.
   * @param optionIds - The ids of all chosen answers.
   * @returns True when the database counted the vote.
   */
  async submitVotes(optionIds: number[]): Promise<boolean> {
    const { error } = await this.supabase.rpc('submit_votes', { p_option_ids: optionIds });
    return error === null;
  }

  /**
   * Stores a new survey with its questions and answers in one step.
   * @param survey - The survey as the visitor filled it in.
   * @returns The id of the new survey, or null when the database refused it.
   */
  async createSurvey(survey: NewSurvey): Promise<number | null> {
    const { data, error } = await this.supabase.rpc('create_survey', {
      p_title: survey.title,
      p_category: survey.category,
      p_description: survey.description,
      p_end_date: survey.endDate,
      p_questions: survey.questions,
    });
    return error === null ? (data as number) : null;
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

  /** Keeps surveys and the votes of the open survey in step with the database. */
  private listenForChanges(): void {
    this.channel
      .on('postgres_changes', { event: 'INSERT', ...SURVEYS_TABLE }, (payload) =>
        this.addSurvey(payload.new as Survey),
      )
      .on('postgres_changes', { event: 'UPDATE', ...SURVEYS_TABLE }, (payload) =>
        this.replaceSurvey(payload.new as Survey),
      )
      .on('postgres_changes', { event: 'UPDATE', ...ANSWER_OPTIONS_TABLE }, (payload) =>
        this.replaceAnswerOption(payload.new as AnswerOption),
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

  /**
   * Swaps a changed answer into its question so the results show its new votes.
   * @param option - The answer with its new number of votes.
   */
  private replaceAnswerOption(option: AnswerOption): void {
    this.questionList.update((questions) =>
      questions.map((question) =>
        question.id === option.question_id
          ? { ...question, answer_options: replaceById(question.answer_options, option) }
          : question,
      ),
    );
  }
}
