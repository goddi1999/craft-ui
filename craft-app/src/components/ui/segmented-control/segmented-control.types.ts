import type { ReactNode } from 'react'

export type SegmentedOption<T extends string = string> = {
  value: T
  label: ReactNode
  disabled?: boolean
}

export type SegmentedProps<T extends string = string> = {
  options: SegmentedOption<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  /** Accessible name for the group. */
  label: string
  /** @default 'sm' */
  size?: 'sm' | 'md'
  className?: string
}
