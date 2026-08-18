import type { CSSProperties, HTMLAttributes } from 'react'

export type NumberAnimationSize = 'sm' | 'default' | 'lg' | 'xl'

/**
 * Which CSS mechanism carries the number to its new value.
 * `transition` tweens the registered custom property directly;
 * `animation` replays an additive keyframe from the previous value.
 */
export type NumberAnimationMode = 'transition' | 'animation'

export type NumberAnimationProps = {
  value: number
  size?: NumberAnimationSize
  mode?: NumberAnimationMode
  /** Appended after the counter, e.g. `%`. */
  suffix?: string
  /** Seconds the number takes to arrive. */
  duration?: number
  /** Accessible label describing what the number measures. */
  label?: string
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
