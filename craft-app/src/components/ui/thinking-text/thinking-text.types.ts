import type { ComponentProps } from 'react'

export type ThinkingTextProps = Omit<ComponentProps<'output'>, 'children'> & {
  /** Words to cycle through, in order. @default ['Thinking...', 'Processing...', …] */
  texts?: readonly string[]
  /** Milliseconds each word stays before the next. @default 1500 */
  interval?: number
  /** Stable status for screen readers; the cycling words are hidden from them. @default 'Loading' */
  label?: string
  /** Show the seconds spent so far next to the words. @default false */
  showElapsed?: boolean
}
