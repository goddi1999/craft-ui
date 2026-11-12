import type { ComponentProps, ReactNode } from 'react'

export type HoldButtonProps = Omit<
  ComponentProps<'button'>,
  'children' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** The label, e.g. "Hold to publish". It is drawn twice: plain, and inverted under the fill. */
  children: ReactNode
  /** Icon before the label, sized to 18px. */
  icon?: ReactNode
  /** Announced when the hold completes and the pill turns into a check. @default 'Done' */
  doneLabel?: string
  /** How long to hold, in ms. @default 1200 */
  duration?: number
  /** How long the check stays before it turns back into the pill, in ms. @default 1700 */
  doneDuration?: number
  /** Pill width in px. It shrinks to a 56px circle when done. @default 220 */
  width?: number
  /** Fires once, when the fill reaches the end. */
  onComplete?: () => void
}
