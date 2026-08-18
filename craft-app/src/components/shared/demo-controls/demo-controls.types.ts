import type { ReactNode } from 'react'

export type DemoControlValue = string | number

export type DemoPanelProps = {
  children?: ReactNode
  className?: string
}

export type DemoControlGroupProps<T extends DemoControlValue> = {
  title: string
  options: readonly T[]
  value: T
  onChange: (value: NoInfer<T>) => void
  /** Render a friendlier label than the raw value. */
  format?: (value: NoInfer<T>) => ReactNode
  className?: string
}

export type DemoToggleProps = {
  label: ReactNode
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  className?: string
}

export type DemoToggleRowProps = {
  children?: ReactNode
  className?: string
}
