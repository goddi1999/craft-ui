import type { ComponentProps, ReactNode } from 'react'

import type { BADGE_COLORS } from './notification-bell.constants'

export type NotificationBellColor = keyof typeof BADGE_COLORS

export type NotificationBellProps = Omit<
  ComponentProps<'button'>,
  'children' | 'color' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Unread count. Anything that is not a finite number counts as 0. @default 0 */
  count?: number
  /** Above this the badge shows `max+`. @default 99 */
  max?: number
  /** A number in the badge, or a plain dot. @default 'count' */
  variant?: 'count' | 'dot'
  /** Button size in px; the bell and badge scale with it. @default 48 */
  size?: number
  /** Badge colour. @default 'red' */
  color?: NotificationBellColor
  /** Render your own trigger and only add the label and badge to it. */
  asChild?: boolean
  children?: ReactNode
}
