import type { ComponentProps, ReactNode } from 'react'

export type TocItem = {
  /** id of the heading in the article; the link scrolls to it and scroll-spy watches it */
  id: string
  label: string
  /** 1 indents the item under the one before it. @default 0 */
  depth?: 0 | 1
}

export type CollapsibleTocProps = Omit<ComponentProps<'div'>, 'title'> & {
  items: TocItem[]
  /** Controlled open state. */
  open?: boolean
  /** @default open on wide screens, folded on phones */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Heading over the list. @default 'On this page' */
  title?: string
  /** Toggle text in each state. @default { hide: 'Hide menu', show: 'Open menu' } */
  labels?: { hide: string; show: string }
  /** The article. Headings inside it should carry the ids in `items`. */
  children: ReactNode
}
