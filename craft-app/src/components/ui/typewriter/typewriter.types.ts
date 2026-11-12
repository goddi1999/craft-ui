import type { HTMLAttributes } from 'react'

export type TypewriterSequence = {
  text: string
  /** Erase the phrase before the next one. The last phrase is always erased when looping. */
  deleteAfter?: boolean
  /** Milliseconds to hold this phrase before moving on. Overrides `pauseBeforeDelete`. */
  pauseAfter?: number
}

export type TypewriterElement = 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3'

/**
 * `backspace` removes the phrase one character at a time; `select` highlights
 * it right to left, as with Shift+Home, then cuts it in one go.
 */
export type TypewriterDeleteMode = 'backspace' | 'select'

export type TypewriterProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  /** Phrases to type, in order. */
  sequences?: readonly TypewriterSequence[]
  /** Milliseconds per character. @default 50 */
  typingSpeed?: number
  /** Milliseconds before the first key. @default 200 */
  startDelay?: number
  /** Start over after the last phrase. @default true */
  autoLoop?: boolean
  /** Milliseconds between the last phrase and the first again. @default 1000 */
  loopDelay?: number
  /** Milliseconds per character when backspacing. @default 30 */
  deleteSpeed?: number
  /** Milliseconds a finished phrase holds before it is erased. @default 1000 */
  pauseBeforeDelete?: number
  /** Vary the rhythm like a person: hesitations, bursts, +/- 40%. @default true */
  naturalVariance?: boolean
  /** How a phrase is erased. @default 'backspace' */
  deleteMode?: TypewriterDeleteMode
  /**
   * Hit a neighbouring key now and then, pause, backspace and correct it.
   * `true` is about a 4% chance per letter; a number sets the chance. @default false
   */
  typos?: boolean | number
  /** Seed for the variance and typos, so every visit types the same way. @default 7 */
  seed?: number
  /**
   * Stops the typing where it is. Wire it to a pause control so people can
   * stop the endless loop (WCAG 2.2.2). It also pauses while off screen.
   * @default false
   */
  paused?: boolean
  /** Element to render, e.g. `h1` when it is the page title. @default 'div' */
  as?: TypewriterElement
  /** Classes for the text itself, e.g. to fix the font size. The wrapper's width sets it otherwise. */
  textClassName?: string
}
