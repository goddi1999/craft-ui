import type { ComponentProps } from 'react'

export type ElasticSliderProps = Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> & {
  /** Label shown inside the track. */
  label: string
  /** Controlled value. Use together with `onValueChange`. */
  value?: number
  /** Initial value for uncontrolled mode. Falls back to `min`. */
  defaultValue?: number
  /** Called with the new value on drag, click, or key press. */
  onValueChange?: (value: number) => void
  /** Minimum value. @default 0 */
  min?: number
  /** Maximum value. @default 1 */
  max?: number
  /** Smallest increment. @default 0.01 */
  step?: number
  /** Format the displayed value. Defaults to `value.toFixed(...)` based on `step`. */
  formatValue?: (value: number) => string
  /** Accessible name. Falls back to `label`. */
  'aria-label'?: string
}
