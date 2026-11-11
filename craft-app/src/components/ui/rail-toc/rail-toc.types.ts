import type { ComponentProps, RefObject } from 'react'

/** One heading the TOC tracks. `id` must match an element id in the content. */
export type RailTocItem = {
  id: string
  label: string
  /** Indent level; 0 sits on the outer rail. @default 0 */
  depth?: number
}

export type RailTocProps = ComponentProps<'nav'> & {
  /** Headings in document order. */
  items: RailTocItem[]
  /** Scroll container to track and scroll within. Defaults to the window. */
  containerRef?: RefObject<HTMLElement | null>
  /** Pixels below the scroller's top edge where a heading counts as reached. @default 96 */
  offset?: number
  /** Horizontal step in pixels for each depth level. @default 14 */
  indent?: number
  /** Text above the list; also names the nav for screen readers. @default 'On this page' */
  title?: string
}

export type RailTocPoint = { x: number; y: number }

export type RailTocGeometry = {
  nodes: RailTocPoint[]
  d: string
  width: number
  height: number
}
