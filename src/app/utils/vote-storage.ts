const STORAGE_KEY = 'poll-app-votes';

type StoredVotes = Record<string, number[]>;

/**
 * Reads the answers this browser sent for one survey.
 * @param surveyId - The id of the survey.
 * @returns The ids of the sent answers, or null when this browser has not voted yet.
 */
export function readVote(surveyId: number): number[] | null {
  return readAllVotes()[surveyId] ?? null;
}

/**
 * Remembers in this browser which answers were sent for one survey.
 * @param surveyId - The id of the survey.
 * @param optionIds - The ids of the sent answers.
 * @returns True when the browser could store the vote.
 */
export function saveVote(surveyId: number, optionIds: number[]): boolean {
  try {
    const votes = { ...readAllVotes(), [surveyId]: optionIds };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads every vote this browser remembers.
 * @returns The sent answers by survey id; empty when nothing usable is stored.
 */
function readAllVotes(): StoredVotes {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return isStoredVotes(stored) ? stored : {};
  } catch {
    return {};
  }
}

/**
 * Checks that stored data still has the expected shape, since anyone can edit it.
 * @param value - The parsed content of the storage entry.
 * @returns True when every entry is a list of answer ids.
 */
function isStoredVotes(value: unknown): value is StoredVotes {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every(
    (ids) => Array.isArray(ids) && ids.every((id) => typeof id === 'number'),
  );
}
