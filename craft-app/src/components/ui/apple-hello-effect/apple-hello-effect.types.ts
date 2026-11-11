import type { ComponentProps } from 'react'
import type { motion } from 'motion/react'

export type AppleHelloEffectProps = Omit<
  ComponentProps<typeof motion.svg>,
  'durationScale' | 'onAnimationComplete'
> & {
  /**
   * Scales the duration and delay of the handwriting animation.
   * Values below 1 speed up, values above 1 slow down.
   * Defaults to 1 (0.8 for Hindi).
   */
  durationScale?: number
  /** Called when the full handwriting animation completes. */
  onAnimationComplete?: () => void
}

export type AppleHelloEffectLanguage =
  | 'english'
  | 'hindi'
  | 'spanish'
  | 'vietnamese'
