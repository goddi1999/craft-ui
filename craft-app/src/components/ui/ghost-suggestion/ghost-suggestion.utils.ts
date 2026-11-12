import type { GhostWord } from './ghost-suggestion.types'

type Spring = {
  readonly type: 'spring'
  readonly stiffness: number
  readonly damping: number
  readonly mass: number
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Critically damped under reduced motion: same speed, no overshoot. */
export function springFor(spring: Spring, reduced: boolean) {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness * spring.mass) } : spring
}

/**
 * Splits a suggestion into words of letters, numbering the letters across the
 * whole run so the stagger flows left to right. Spaces are not letters.
 */
export function toGhostWords(text: string): GhostWord[] {
  let count = 0
  return text
    .split(/( )/)
    .filter((part) => part !== '')
    .map((part) =>
      part === ' '
        ? { kind: 'space' }
        : { kind: 'word', letters: Array.from(part, (char) => ({ char, index: count++ })) },
    )
}

export const countLetters = (text: string) => Array.from(text.replaceAll(' ', '')).length
