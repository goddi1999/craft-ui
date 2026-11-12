import type { ComponentProps, ReactNode } from 'react'

export type PasswordStrengthProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'children'
> & {
  /** The password, when controlled. */
  value?: string
  /** The starting password, when uncontrolled. @default '' */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Whether the password is shown as text, when controlled. */
  visible?: boolean
  /** Whether it starts shown, when uncontrolled. @default false */
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  /** Label above the field. @default 'Password' */
  label?: ReactNode
  /** The rules, under the bars on the right. @default '8+ chars, a number, a symbol' */
  hint?: ReactNode
}
