import type { ComponentProps, Key, ReactNode } from 'react'

export type StrokeDirection = 'forward' | 'backward'

export type StrokeTransitionProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Change this to transition. The stroke covers the old content, swaps in the new, then clears. */
  transitionKey: Key
  children: ReactNode
  /** `backward` mirrors the stroke so it enters from the other side. @default 'forward' */
  direction?: StrokeDirection
  /** Seconds for each half: drawing over, then clearing off. @default 0.85 */
  duration?: number
  /** Classes for the stroke; it paints with `currentColor`. @default a lavender */
  strokeClassName?: string
  /** Called once the new content is fully revealed. */
  onTransitionEnd?: () => void
}
