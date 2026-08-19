import type { ReactNode } from 'react'

export type MacOSSidebarItem = {
  id: string
  label: string
}

export type MacOSSidebarProps = {
  items: MacOSSidebarItem[]
  defaultOpen?: boolean
  /** Id of the row selected on first render. Falls back to the first item. */
  defaultSelectedId?: string
  onSelect?: (item: MacOSSidebarItem) => void
  onAdd?: () => void
  children?: ReactNode
  className?: string
}
