/**
 * Reveals a short headline or sentence once, as it mounts: each word rises out of its own clip
 * while it sharpens from a soft blur. Use `\n` in `text` for a deliberate line break, and change
 * the element's `key` to replay it.
 */
export type HeadlineRevealProps = {
  /** The copy to reveal. Use `\n` for a line break that works at every width. */
  text: string
  /** Rendered element. `p` uses a softer blur. @default 'h2' */
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Seconds to wait before the first word rises. @default 0 */
  delay?: number
  /** Forwarded to the rendered element, e.g. for `aria-labelledby`. */
  id?: string
  className?: string
}

/** One line of words, and the index of its first word across the whole text. */
export type RevealLine = { words: string[]; start: number }
