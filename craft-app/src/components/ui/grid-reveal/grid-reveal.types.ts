import type { ComponentProps } from 'react'

export type GridRevealProps = Omit<ComponentProps<'div'>, 'children' | 'onError'> & {
  /** Image to reveal. Keep it `null` while the image is generating. */
  src?: string | null
  /** Describes the finished image; the frame is hidden from assistive tech without it. */
  alt?: string
  /** Wait position 0–1. Holds at 0.72 until the image decodes. Omit to self-pace. */
  progress?: number
  /** Width divided by height of the frame. @default 1 */
  aspect?: number
  /** Status text in a frosted pill, bottom left. */
  caption?: string
  /** Roughly how long the work takes in ms, pacing the grid when no progress is passed. @default 6000 */
  estimatedDuration?: number
  onRevealComplete?: () => void
  onError?: () => void
}
