import type { ComponentProps, MouseEvent, ReactNode } from 'react'

export type DynamicMenuItem = {
  /** Link text; also the React key, so keep it unique. */
  label: string
  href: string
  /** A small chip at the end of the row: a count, "New". */
  badge?: ReactNode
}

export type DynamicMenuProps = Omit<
  ComponentProps<'nav'>,
  'children' | 'onSelect' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Name in the pill, next to the toggle. */
  brand: ReactNode
  items: readonly DynamicMenuItem[]
  /** Controlled open state. */
  open?: boolean
  /** Open state on mount when uncontrolled. @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called when a link is clicked, before the menu closes. Call `event.preventDefault()` to route yourself. */
  onSelect?: (item: DynamicMenuItem, event: MouseEvent<HTMLAnchorElement>) => void
  /** Width of the open panel in px; it never grows past its container. @default 300 */
  openWidth?: number
  /** Width of the closed pill in px. @default 150 */
  closedWidth?: number
}
