import type { ComponentProps, ReactNode } from 'react'

export type SidebarCollapseItem = {
  value: string
  label: string
  /** Any icon; svgs are sized to 22 px. */
  icon: ReactNode
}

export type SidebarCollapseProps = Omit<
  ComponentProps<'aside'>,
  'children' | 'title' | 'defaultValue' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Product or workspace name next to the logo. */
  title: string
  /** Mark shown left of the title. @default the title's first letter on the primary colour */
  logo?: ReactNode
  items: SidebarCollapseItem[]
  /** The picked item, for controlled use. */
  value?: string
  /** The picked item on mount, for uncontrolled use. @default the first item */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Expanded or folded to the icon rail, for controlled use. */
  open?: boolean
  /** Expanded on mount, for uncontrolled use. @default true */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** ms between labels as they cascade back in on open. @default 40 */
  stagger?: number
}
