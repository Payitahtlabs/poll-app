import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveyQuestion } from '../../components/survey-question/survey-question';
import { SurveyResults } from '../../components/survey-results/survey-results';
import { QuestionWithOptions } from '../../models/question';
import { DeadlineDatePipe } from '../../pipes/deadline-date-pipe';
import { Surveys } from '../../services/surveys';
import { hasEnded } from '../../utils/date';
import { getUnansweredPositions, toggleAnswer } from '../../utils/selection';
import { describeUnanswered } from '../../utils/text';
import { readVote, saveVote } from '../../utils/vote-storage';

const THANKS_MESSAGE = 'Thanks, your vote was counted.';
const SEND_FAILED_MESSAGE = 'Your vote could not be sent. Please try again.';
const ALREADY_VOTED_MESSAGE = 'You already voted in this survey.';

@Component({
  imports: [RouterLink, SurveyQuestion, SurveyResults, DeadlineDatePipe],
  selector: 'app-survey-detail',
  styleUrl: './survey-detail.scss',
  templateUrl: './survey-detail.html',
})
export class SurveyDetail {
  private readonly surveysService = inject(Surveys);
  readonly id = input.required({ transform: numberAttribute });
  readonly selectedOptionIds = signal<number[]>([]);
  readonly feedback = signal('');
  readonly isSending = signal(false);
  readonly hasVoted = signal(false);
  readonly survey = computed(() =>
    this.surveysService.surveys().find((survey) => survey.id === this.id()),
  );
  readonly questions = this.surveysService.questions;
  readonly hasLoadedQuestions = this.surveysService.hasLoadedQuestions;
  readonly isNotFound = computed(() => this.surveysService.hasLoaded() && !this.survey());
  readonly isRunning = computed(() => {
    const survey = this.survey();
    return survey !== undefined && !hasEnded(survey.end_date);
  });
  readonly isLocked = computed(() => !this.isRunning() || this.hasVoted());
  readonly isCompleteDisabled = computed(() => this.isLocked() || this.isSending());

  /** Opens the survey named in the address again whenever the address names another one. */
  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.openSurvey(id));
    });
  }

  /**
   * Keeps track of the chosen answers after one of them was clicked.
   * @param question - The question the clicked answer belongs to.
   * @param optionId - The id of the clicked answer.
   */
  updateSelection(question: QuestionWithOptions, optionId: number): void {
    this.selectedOptionIds.update((ids) => toggleAnswer(ids, question, optionId));
    this.feedback.set('');
  }

  /** Sends the vote once every question has an answer, otherwise names the missing ones. */
  async completeSurvey(): Promise<void> {
    if (this.isCompleteDisabled()) {
      return;
    }
    const unanswered = getUnansweredPositions(this.questions(), this.selectedOptionIds());
    if (unanswered.length > 0) {
      this.feedback.set(describeUnanswered(unanswered));
      return;
    }
    await this.sendVote();
  }

  /**
   * Loads the survey named in the address and forgets what was chosen in the one before.
   * @param id - The id of the survey to show.
   */
  private openSurvey(id: number): void {
    this.selectedOptionIds.set([]);
    this.hasVoted.set(false);
    this.feedback.set('');
    this.surveysService.openSurvey(id);
    this.restoreVote();
  }

  /** Sends the chosen answers and reports whether the vote was counted. */
  private async sendVote(): Promise<void> {
    this.isSending.set(true);
    const isCounted = await this.surveysService.submitVotes(this.selectedOptionIds());
    this.isSending.set(false);
    if (isCounted) {
      saveVote(this.id(), this.selectedOptionIds());
    }
    this.hasVoted.set(isCounted);
    this.feedback.set(isCounted ? THANKS_MESSAGE : SEND_FAILED_MESSAGE);
  }

  /** Shows the answers this browser already sent and locks the survey against a second vote. */
  private restoreVote(): void {
    const sentIds = readVote(this.id());
    if (sentIds === null) {
      return;
    }
    this.selectedOptionIds.set(sentIds);
    this.hasVoted.set(true);
    this.feedback.set(ALREADY_VOTED_MESSAGE);
  }
}
