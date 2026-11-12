import type { ComponentProps, ReactNode } from 'react'

export type CommandButtonModifier = 'mod' | 'ctrl' | 'alt' | 'shift'

export type CommandButtonProps = Omit<
  ComponentProps<'div'>,
  | 'children'
  | 'onPointerDown'
  | 'onPointerUp'
  | 'onPointerLeave'
  | 'onAnimationStart'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
> & {
  /** The button's label. @default 'Search' */
  children?: ReactNode
  /** `+`-joined: `mod` (⌘ on Mac, Ctrl elsewhere), `ctrl`, `alt`, `shift`, then one key. @default 'mod+k' */
  shortcut?: string
  /** Also the field's accessible name. @default 'Search' */
  placeholder?: string
  /** Called with the trimmed text when Enter is pressed in the open field. */
  onSearch?: (query: string) => void
  /** Whether the field is open. Pass it with `onOpenChange` to control it. */
  open?: boolean
  /** @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Width of the open field, in px. @default 300 */
  width?: number
  /** How springy the open is, 0 to 100. @default 30 */
  bounce?: number
  /** Fold back by itself after this many ms with nothing typed (demos). */
  autoClose?: number
}
