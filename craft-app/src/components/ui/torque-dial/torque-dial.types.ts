import type { ComponentProps } from 'react'

export type TorqueDialProps = Omit<
  ComponentProps<'div'>,
  'children' | 'onChange' | 'defaultValue'
> & {
  /** The current value. The dial is controlled, so pair it with `onChange`. */
  value: number
  /** Called with each new value while dragging, spinning, scrolling or pressing keys. */
  onChange: (value: number) => void
  /** Called when a drag ends, or when its spin comes to rest. */
  onChangeEnd?: () => void
  /** @default 0 */
  min?: number
  /** @default 100 */
  max?: number
  /** Values snap to this. One key press or wheel notch moves one step. @default 1 */
  step?: number
  /** Names the slider for screen readers and sits under the value. @default 'Dial control' */
  label?: string
  /** Show the value and label under the dial. @default true */
  showValue?: boolean
  /** Diameter in px. @default 120 */
  size?: number
  /** @default false */
  disabled?: boolean
  /** Keep spinning after a flick, slowing with friction. Off with reduced motion. @default true */
  momentum?: boolean
  /** Suffix after the value, e.g. `%`, `dB` or `°`. @default '' */
  unit?: string
}
