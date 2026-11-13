import type { ComponentProps, ReactNode } from 'react'

export type ControlSliderProps = Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> & {
  /** Controlled value, 0 to 1. */
  value?: number
  /** @default 0.5 */
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Fires once when a drag or key press settles. */
  onValueCommit?: (value: number) => void
  /** Accessible name, e.g. `Brightness`. */
  label: string
  /** Glyph at the bottom; pass a function to draw it from the value. */
  icon?: ReactNode | ((value: number) => ReactNode)
  /** A tap flips between off and the last level, like the torch in Control Center. @default false */
  toggle?: boolean
  /** @default 72 */
  width?: number
  /** @default 168 */
  height?: number
  /** How far a drag past either end can stretch the tile, as a share of its height. 0 turns it off. @default 0.35 */
  stretch?: number
  /** Keyboard step. @default 0.05 */
  step?: number
}
