import type { ComponentProps } from 'react'

import type { STREAK_COLORS, STREAK_SIZES } from './streak-widget.constants'

export type StreakColor = (typeof STREAK_COLORS)[number]

export type StreakSize = (typeof STREAK_SIZES)[number]

/** `compact`: the streak tile alone. `week`: the tile beside today's goal and the week's days. */
export type StreakWidgetVariant = 'compact' | 'week'

export type StreakWidgetProps = Omit<ComponentProps<'section'>, 'color'> & {
  /** Days in a row the goal was met. */
  days: number
  /** Line under the day count. @default 'Steps streak' */
  label?: string
  /** @default 'week' */
  variant?: StreakWidgetVariant
  /** Size of the streak tile: flame, day count and label. @default 'md' */
  size?: StreakSize
  /** Today's progress, e.g. steps walked. Used by `week`. */
  value?: number
  /** Today's target. Used by `week`. */
  goal?: number
  /** Whether the goal was met, Monday first; up to 7 entries, missing days count as not yet. Used by `week`. */
  week?: boolean[]
  /** Day labels, Monday first. @default Mon–Sun */
  weekdays?: readonly string[]
  /** Theme accent for the flame and the met days. @default 'pink' */
  color?: StreakColor
}
