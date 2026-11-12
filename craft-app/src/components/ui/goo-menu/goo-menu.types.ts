import type { ComponentProps, ReactNode } from 'react'

export type GooMenuItem = {
  /** Identifies the action in `onSelect`; also the React key. */
  value: string
  /** Accessible name, and the tooltip over the bubble. */
  label: string
  /** Shown in the bubble, about 20px. */
  icon: ReactNode
  /** What the + morphs into after the action runs. Leave it out to just close the menu. */
  toast?: string
}

export type GooMenuProps = Omit<ComponentProps<'div'>, 'children' | 'onSelect'> & {
  /** The actions, fanned out above the + in order from left to right. */
  items: readonly GooMenuItem[]
  /** Controlled open state. */
  open?: boolean
  /** Open state on mount when uncontrolled. @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called with the item's `value` when a bubble is clicked or pressed with Enter or Space. */
  onSelect?: (value: string) => void
  /** Accessible name of the + button. @default 'Actions' */
  label?: string
  /** Distance in px from the + to each bubble. @default 112 */
  radius?: number
  /** Goo strength: the blur in px before the alpha threshold. @default 10 */
  blur?: number
  /** How long the toast stays, in ms. @default 2600 */
  toastDuration?: number
}
