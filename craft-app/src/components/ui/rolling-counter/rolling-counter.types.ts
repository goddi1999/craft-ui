import type { ComponentProps, ReactNode } from 'react'

/** `western` groups by thousands (1,234,567); `indian` by lakh/crore (12,34,567). */
export type RollingCounterGrouping = 'western' | 'indian'

export type RollingCounterProps = Omit<
  ComponentProps<'span'>,
  'children' | 'prefix' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  value: number
  /** Digits after the decimal separator (0–15). @default 0 */
  decimals?: number
  /** Spring length of each roll, in seconds. @default 0.6 */
  duration?: number
  /** Minimum whole digits, padded with zeros. @default 1 */
  padStart?: number
  /** Thousands separator; '' turns grouping off. @default ',' */
  separator?: string
  /** @default '.' */
  decimalSeparator?: string
  /** @default 'western' */
  grouping?: RollingCounterGrouping
  prefix?: ReactNode
  suffix?: ReactNode
}
