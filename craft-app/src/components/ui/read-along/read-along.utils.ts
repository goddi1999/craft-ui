import { DWELL_MS, DWELL_PER_CHAR_MS, PAD_EM, PILL_EM } from './read-along.constants'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

/** Critically damped under reduced motion (no overshoot), the same thing the source engine does. */
export function springFor(spring: Spring, reduced: boolean): Spring {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Longer words are read a little longer. */
export const dwellOf = (word: string) => DWELL_MS + word.length * DWELL_PER_CHAR_MS

/** Where the pill goes for a word, in px relative to the text block. */
export function wordBox(root: HTMLElement, word: HTMLElement) {
  const fontSize = parseFloat(getComputedStyle(root).fontSize)
  const pad = fontSize * PAD_EM
  return {
    left: word.offsetLeft - pad,
    right: word.offsetLeft + word.offsetWidth + pad,
    top: word.offsetTop + (word.offsetHeight - fontSize * PILL_EM) / 2,
  }
}
