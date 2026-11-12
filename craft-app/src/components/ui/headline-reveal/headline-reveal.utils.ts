import type { RevealLine } from './headline-reveal.types'

/** Splits the text into lines of words, each with the running index of its first word. */
export function toLines(text: string) {
  const lines: RevealLine[] = []
  let count = 0
  for (const line of text.split('\n')) {
    const words = line.split(' ').filter(Boolean)
    lines.push({ words, start: count })
    count += words.length
  }
  return { lines, count }
}
