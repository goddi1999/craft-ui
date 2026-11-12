import type { ComponentProps } from 'react'

// no ref: the component measures its own words through it
export type ReadAlongProps = Omit<ComponentProps<'div'>, 'children' | 'ref'> & {
  /** The sentence to read. Split on spaces; punctuation stays with its word. */
  text: string
  /** The word being read, when controlled. -1 means none (before the start). */
  index?: number
  /** The starting word, when uncontrolled. @default -1 */
  defaultIndex?: number
  /** Called when it moves to another word, by itself, by a click or by the arrow keys. */
  onIndexChange?: (index: number) => void
  /** Reads on by itself. When false the pill stays where it is. @default true */
  playing?: boolean
  /** Starts over after the last word. When false it stops on the last word. @default true */
  loop?: boolean
  /** Reading speed; 2 reads twice as fast. Must be above 0. @default 1 */
  speed?: number
}
