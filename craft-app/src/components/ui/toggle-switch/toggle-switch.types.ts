import type { ComponentProps } from 'react'

import type { TRACK_COLORS } from './toggle-switch.constants'

export type ToggleSwitchColor = keyof typeof TRACK_COLORS

export type ToggleSwitchProps = Omit<
  ComponentProps<'button'>,
  'children' | 'color' | 'value' | 'defaultValue' | 'type' | 'role'
> & {
  /** Controlled state. */
  checked?: boolean
  /** Starting state when uncontrolled. @default false */
  defaultChecked?: boolean
  /** Called with the next state on every flip. */
  onCheckedChange?: (checked: boolean) => void
  /** Fill when on: iOS green, or your theme's primary. @default 'green' */
  color?: ToggleSwitchColor
}
