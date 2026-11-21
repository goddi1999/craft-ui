import type { ReactNode } from 'react'

export type BrowserVariant = 'chrome' | 'safari'
export type BrowserHeaderStyle = 'minimal' | 'full'
export type BrowserSize = 'sm' | 'md' | 'lg' | 'xl'
export type BrowserSidebarPosition = 'left' | 'right'

export type BrowserSidebarItem = {
  label: string
  active?: boolean
  badge?: string | number
}

export type BrowserWindowProps = {
  children?: ReactNode
  className?: string
  variant?: BrowserVariant
  headerStyle?: BrowserHeaderStyle
  size?: BrowserSize
  showSidebar?: boolean
  sidebarPosition?: BrowserSidebarPosition
  url?: string
  sidebarItems?: BrowserSidebarItem[]
}
