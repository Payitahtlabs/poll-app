import { AnswerOption } from '../models/answer-option';
import { QuestionWithOptions } from '../models/question';
import { QuestionResult } from '../models/question-result';

const PERCENT = 100;

/**
 * Adds up the votes of all answers of one question.
 * @param options - The answers of the question.
 * @returns The number of votes the question received.
 */
export function countVotes(options: AnswerOption[]): number {
  return options.reduce((sum, option) => sum + option.votes, 0);
}

/**
 * Works out which share of all votes on a question one answer received.
 * @param votes - The votes of the answer.
 * @param totalVotes - The votes of all answers of the same question.
 * @returns The share in whole percent, 0 while the question has no votes.
 */
export function getVoteShare(votes: number, totalVotes: number): number {
  if (totalVotes === 0) {
    return 0;
  }
  return Math.round((votes / totalVotes) * PERCENT);
}

/**
 * Turns a question with its answers into the values its result bars need.
 * @param question - The question with the votes of every answer.
 * @returns The question with the share of every answer in percent.
 */
export function toQuestionResult(question: QuestionWithOptions): QuestionResult {
  const totalVotes = countVotes(question.answer_options);
  return {
    id: question.id,
    position: question.position,
    text: question.text,
    answers: question.answer_options.map((option) => ({
      id: option.id,
      position: option.position,
      share: getVoteShare(option.votes, totalVotes),
    })),
  };
}
