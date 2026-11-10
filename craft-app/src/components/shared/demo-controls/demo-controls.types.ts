import type { ReactNode } from 'react'

export type DemoControlValue = string | number

export type DemoSettingsProps = {
  children?: ReactNode
  /** Restores every setting to its default. Omit to hide the Reset button. */
  onReset?: () => void
  /** Enables Reset — true once any setting differs from its default. */
  canReset?: boolean
  className?: string
}

/** A labelled row of mutually exclusive options — for a few named choices. */
export type DemoControlGroupProps<T extends DemoControlValue> = {
  title: string
  options: readonly T[]
  value: T
  onChange: (value: NoInfer<T>) => void
  /** Render a friendlier label than the raw value. */
  format?: (value: NoInfer<T>) => ReactNode
  className?: string
}

/** An on/off setting. */
export type DemoSwitchProps = {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

/** A numeric setting within a range. */
export type DemoSliderProps = {
  label: string
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  step?: number
  /** Suffix after the read-out value, e.g. `px`, `s`, `%`. */
  unit?: string
  className?: string
}

/** A free-text setting. */
export type DemoTextFieldProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  className?: string
}

/** @deprecated Use `DemoSettings`. */
export type DemoPanelProps = DemoSettingsProps

/** @deprecated Use `DemoSwitch`. */
export type DemoToggleProps = {
  label: ReactNode
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  className?: string
}

/** @deprecated Use `DemoSettings`, which lays controls out itself. */
export type DemoToggleRowProps = {
  children?: ReactNode
  className?: string
}
