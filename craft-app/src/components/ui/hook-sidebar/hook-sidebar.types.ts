import type { ComponentProps } from 'react'

/** A plain label, or a label with a route to link to. */
export type HookSidebarItem = string | { label: string; href?: string }

export type HookSidebarColor =
  | 'orange'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'pink'
  | 'foreground'

export type HookSidebarProps = Omit<ComponentProps<'nav'>, 'onChange'> & {
  items: HookSidebarItem[]
  /** Heading above the list; also the nav's accessible name. */
  label?: string
  /** Controlled active index. With links, the current route wins when omitted. */
  value?: number
  /** Initial active index when uncontrolled. @default 0 */
  defaultValue?: number
  onChange?: (index: number) => void
  /** Color of the rail that hooks into the active row. @default 'orange' */
  color?: HookSidebarColor
  /** Draw the rail as a dashed line. @default true */
  dashed?: boolean
}
