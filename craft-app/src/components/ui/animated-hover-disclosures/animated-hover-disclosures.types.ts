import type { ReactNode } from 'react'

export type HoverDisclosureItem = {
  /** Label shown rotated in the collapsed column. */
  title: string
  /** Copy revealed when the column is active. */
  description: string
  /** Small glyph above the description. */
  icon?: ReactNode
  /** Background image revealed in colour when active. */
  image?: string
  /** Target for the call-to-action link. */
  href?: string
}

export type AnimatedHoverDisclosuresProps = {
  /** Columns to render. @default HOVER_DISCLOSURE_ITEMS */
  items?: readonly HoverDisclosureItem[]
  /** Initially expanded column when uncontrolled. @default 0 */
  defaultActiveIndex?: number
  /** Controlled expanded column. */
  activeIndex?: number
  /** Called when pointer, focus, or click expands another column. */
  onActiveIndexChange?: (index: number) => void
  /** Call-to-action label. @default 'Watch now' */
  linkLabel?: string
  /** Extra classes for the root list. */
  className?: string
}
