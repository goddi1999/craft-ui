import type { ComponentProps, MouseEvent } from 'react'

export type LineNavItem = {
  title: string
  href: string
}

export type LineNavProps = Omit<ComponentProps<'nav'>, 'children'> & {
  items: LineNavItem[]
  /** Href of the active item. */
  activeHref?: string
  /** Scroll the active item into view on mount. @default true */
  scrollActiveIntoView?: boolean
  /** Called when an item is clicked. */
  onItemClick?: (item: LineNavItem, event: MouseEvent<HTMLAnchorElement>) => void
}
