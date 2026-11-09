export const COOKING_LETTERS_LINES = [
  'Everybody can cook.',
  'You can cook.',
  'Just cook it.',
  'CSS.',
] as const

export type SplitChar = {
  char: string
  /** Index of the character across the whole line, spaces excluded. */
  index: number
}

export type SplitWord = {
  chars: SplitChar[]
}

export type SplitLine = {
  words: SplitWord[]
  /** Character count across the line, spaces excluded. */
  total: number
}

/**
 * Splits a line into words and characters the way Splitting.js does: the
 * character index runs across the whole line and ignores whitespace.
 */
export function splitLine(text: string): SplitLine {
  let index = 0
  const words = text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({
      chars: Array.from(word, (char) => ({ char, index: index++ })),
    }))

  return { words, total: index }
}
