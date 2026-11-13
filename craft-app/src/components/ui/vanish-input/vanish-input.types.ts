import type { ComponentProps, ReactNode } from 'react'

export type VanishInputProps = Omit<
  ComponentProps<'input'>,
  'value' | 'onSubmit' | 'type' | 'size'
> & {
  /** Called with the text when Enter is pressed, just before it dissolves. */
  onSubmit?: (value: string) => void
  /** Called whenever the text changes, including when it is cleared. */
  onValueChange?: (value: string) => void
  /** Escape dissolves the text without submitting it. @default true */
  clearOnEscape?: boolean
  /** Leading icon. Pass `null` for none. @default a search glass */
  icon?: ReactNode
  /** Classes for the wrapping box; `className` goes on the input itself. */
  containerClassName?: string
}

export type Grain = {
  /** where the pixel sat in the text; decides when the sweep lets it go */
  home: number
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  born: number
}
