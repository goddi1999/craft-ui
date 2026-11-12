import type { ComponentProps, ReactNode } from 'react'

export type TagInputProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> & {
  /** The tags, controlled. */
  value?: string[]
  /** The tags at first render, uncontrolled. @default [] */
  defaultValue?: string[]
  /** Called with the new list when a tag is added or removed. */
  onValueChange?: (value: string[]) => void
  /** Label above the field. Without one the placeholder names the input. */
  label?: ReactNode
  /** Help text under the field. */
  description?: ReactNode
  /** @default 'Add a tag' */
  placeholder?: string
}
