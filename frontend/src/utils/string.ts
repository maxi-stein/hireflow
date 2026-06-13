/**
 * Normalizes a string or an array of strings by converting to lowercase,
 * removing accents/diacritics, and trimming whitespace.
 * If an array is provided, it also removes duplicates and empty strings.
 */
export function normalizeText(text: string): string;
export function normalizeText(tags: string[]): string[];
export function normalizeText(input: string | string[]): string | string[] {
  if (Array.isArray(input)) {
    const normalized = input.map((tag) =>
      tag
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    ).filter(tag => tag.length > 0);

    return [...new Set(normalized)];
  }

  if (typeof input === 'string') {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  return input;
}
