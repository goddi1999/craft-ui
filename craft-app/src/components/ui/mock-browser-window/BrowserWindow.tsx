import { cn } from '@/lib/utils'

import { DEFAULT_SIDEBAR_ITEMS, DEFAULT_URL } from './mock-browser-window.constants'
import type { BrowserWindowProps } from './mock-browser-window.types'
import { AddressBar, SidebarContent, TextureOverlay, WindowControls } from './mock-browser-window-parts'
import { browserWindowVariants, sidebarVariants } from './mock-browser-window-variants'

export function BrowserWindow({
  children,
  className,
  variant = 'chrome',
  headerStyle = 'minimal',
  size = 'md',
  showSidebar = false,
  sidebarPosition = 'left',
  url = DEFAULT_URL,
  sidebarItems = DEFAULT_SIDEBAR_ITEMS,
}: BrowserWindowProps) {
  const sidebar = showSidebar && (
    <aside className={sidebarVariants({ size, position: sidebarPosition })}>
      <SidebarContent items={sidebarItems} />
    </aside>
  )

  return (
    <div data-slot="browser-window" className={cn(browserWindowVariants({ size }), className)}>
      <div className="flex h-11 items-center overflow-hidden border-b border-foreground/5 bg-muted/10 px-4">
        <WindowControls variant={variant} headerStyle={headerStyle} />
        {headerStyle === 'full' && <AddressBar url={url} variant={variant} className="ml-4" />}
      </div>
      <div className="flex h-0 flex-1">
        {sidebarPosition === 'left' && sidebar}
        <div className="relative h-full min-w-0 flex-1">
          {children === undefined ? <TextureOverlay /> : children}
        </div>
        {sidebarPosition === 'right' && sidebar}
      </div>
    </div>
  )
}
