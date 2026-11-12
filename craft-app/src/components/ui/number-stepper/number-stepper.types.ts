import type { ComponentProps, ReactNode } from 'react'

export type NumberStepperProps = Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Controlled value. */
  value?: number
  /** Value on mount when uncontrolled. @default 0 */
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Lowest value; pressing − here kicks instead. @default 0 */
  min?: number
  /** Highest value; pressing + here kicks instead. @default 99 */
  max?: number
  /** How much one press moves the value. The last press before a limit lands on it. @default 1 */
  step?: number
  /** Title on the left, also the group's accessible name. */
  label?: ReactNode
  /** Smaller line under the label. */
  description?: ReactNode
  /** Accessible name of the − button. @default 'Decrease' */
  decrementLabel?: string
  /** Accessible name of the + button. @default 'Increase' */
  incrementLabel?: string
}
