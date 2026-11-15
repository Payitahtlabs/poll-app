/**
 * Puts an item in the place of the item with the same id.
 * @param items - The list that holds the old version.
 * @param item - The new version.
 * @returns A new list with the new version in place of the old one.
 */
export function replaceById<T extends { id: number }>(items: T[], item: T): T[] {
  return items.map((current) => (current.id === item.id ? item : current));
}
