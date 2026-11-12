import type { ComponentProps, ReactNode } from 'react'

export type ParallaxTicketDetail = { label: string; value: string }

export type ParallaxTicketProps = Omit<ComponentProps<'div'>, 'children' | 'title'> & {
  /** Big text on the front, near the glass. Use `<br />` to break it. */
  title: ReactNode
  /** Small line under the title, e.g. date, time and place. */
  subtitle?: ReactNode
  /** Right side of that line, e.g. a ticket number. */
  code?: ReactNode
  /** Front picture, set far back so it moves least. Without one the front is a faint grid. */
  image?: string
  /** Shown under the code on the back, e.g. row, seat and gate. @default [] */
  details?: readonly ParallaxTicketDetail[]
  /** Small text at the bottom of the back. @default 'Tap to flip back' */
  hint?: ReactNode
  /** Controlled side. Use together with `onFlippedChange`. */
  flipped?: boolean
  /** Starting side when uncontrolled. @default false */
  defaultFlipped?: boolean
  /** Called when the ticket is clicked, or Enter / Space is pressed on it. */
  onFlippedChange?: (flipped: boolean) => void
  /** Degrees it tilts at the edge under the pointer. @default 14 */
  tilt?: number
  /** Px the front layer slides at full tilt; the picture moves a quarter of that. @default 12 */
  depth?: number
}
