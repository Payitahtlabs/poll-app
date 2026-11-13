/** Loads every font the styles declare, so that the first render already uses them. */
export async function loadFonts(): Promise<void> {
  await Promise.allSettled([...document.fonts].map((font) => font.load()));
}
