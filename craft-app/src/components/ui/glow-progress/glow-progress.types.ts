import type * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentProps } from 'react'

export type GlowProgressTone = 'lime' | 'orange' | 'sky' | 'violet'
export type GlowProgressSize = 'sm' | 'md' | 'lg'

export type GlowProgressToneColors = {
  /** Fill colour at the start of the bar. */
  from: string
  /** Fill colour at the leading edge, next to the sparkle. */
  to: string
  /** Halo colour around the sparkle. */
  glow: string
}

export type GlowProgressProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Root>,
  'value' | 'max' | 'children'
> & {
  /** Current progress. Clamped between 0 and `max`. @default 0 */
  value?: number
  /** Value that counts as complete. @default 100 */
  max?: number
  /** Fill gradient and glow colour. @default 'lime' */
  tone?: GlowProgressTone
  /** Bar height: 10, 18 or 28px. @default 'md' */
  size?: GlowProgressSize
  /** Show the glowing sparkle on the leading edge. @default true */
  sparkle?: boolean
}
