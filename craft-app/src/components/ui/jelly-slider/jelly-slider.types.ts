import type { ComponentProps } from 'react'

export type JellySliderProps = Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> & {
  /** Controlled value. Use together with `onValueChange`. */
  value?: number
  /** Starting value when uncontrolled. @default min */
  defaultValue?: number
  /** Called on every change while dragging and on each key press. */
  onValueChange?: (value: number) => void
  /** Called once the user lets go, or after a key press. */
  onValueCommit?: (value: number) => void
  /** @default 0 */
  min?: number
  /** @default 100 */
  max?: number
  /** Drag granularity. Arrow keys move one scale mark (5% of the range). @default 1 */
  step?: number
  /** Text for the drop, the scale numbers and `aria-valuetext`. Keep it short, the drop is 36px. */
  formatValue?: (value: number) => string
  /** The marks and numbers under the track. @default true */
  showScale?: boolean
  disabled?: boolean
}
