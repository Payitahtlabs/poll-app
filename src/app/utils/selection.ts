import { QuestionWithOptions } from '../models/question';

/**
 * Works out the chosen answers after one answer of a question was clicked.
 * @param selectedIds - The ids of all answers chosen so far.
 * @param question - The question the clicked answer belongs to.
 * @param optionId - The id of the clicked answer.
 * @returns A new list: multiple choice flips the answer, single choice swaps it in.
 */
export function toggleAnswer(
  selectedIds: number[],
  question: QuestionWithOptions,
  optionId: number,
): number[] {
  if (question.allow_multiple) {
    return toggleId(selectedIds, optionId);
  }
  const questionIds = question.answer_options.map((option) => option.id);
  return [...selectedIds.filter((id) => !questionIds.includes(id)), optionId];
}

/**
 * Removes an id that is in the list and adds one that is not.
 * @param ids - The list to change.
 * @param id - The id to flip.
 * @returns A new list with the id flipped.
 */
function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id];
}
