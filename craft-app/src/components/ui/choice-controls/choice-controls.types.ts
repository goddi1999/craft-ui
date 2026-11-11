// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { ComponentProps, ReactNode } from 'react'

type Labelled = {
  /** Visible label next to the control; clicking it toggles the control. */
  label?: ReactNode
  description?: ReactNode
  className?: string
}

type SwitchProps = Labelled &
  Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultChecked'> & {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }

type CheckboxProps = Labelled &
  Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultChecked'> & {
    /** `'mixed'` shows the indeterminate dash. */
    checked?: boolean | 'mixed'
    defaultChecked?: boolean | 'mixed'
    onCheckedChange?: (checked: boolean) => void
  }

type RadioGroupProps = Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Accessible name for the group. */
  label: string
}

type RadioProps = Labelled &
  Omit<ComponentProps<'button'>, 'value'> & { value: string }

type RadioContextValue = {
  value: string | undefined
  select: (value: string) => void
}

export type {
  CheckboxProps,
  Labelled,
  RadioContextValue,
  RadioGroupProps,
  RadioProps,
  SwitchProps,
}
