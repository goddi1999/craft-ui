import type { ComponentProps } from 'react'

export type WordRollProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Take turns at the end of the line. Renders nothing when empty. */
  words: readonly string[]
  /** Text before the rolling word, in a muted colour. */
  lead?: string
  /** Index of the word showing, when you control it. */
  index?: number
  /** Index of the first word when uncontrolled. @default 0 */
  defaultIndex?: number
  /** Called with the next index when the word turns, by itself or on a click. */
  onIndexChange?: (index: number) => void
  /** Turn to the next word by itself. @default true */
  autoPlay?: boolean
  /** How long each word stays before the next rolls in, in ms. @default 2400 */
  interval?: number
}
