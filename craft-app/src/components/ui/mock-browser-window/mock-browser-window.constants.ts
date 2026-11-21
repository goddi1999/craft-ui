import type { BrowserSidebarItem } from './mock-browser-window.types'

export const DEFAULT_URL = 'https://example.com'

export const DEFAULT_SIDEBAR_ITEMS: BrowserSidebarItem[] = [
  { label: 'Dashboard', active: true },
  { label: 'Analytics', badge: '3' },
  { label: 'Settings' },
  { label: 'Profile' },
]

/** Dotted texture from cult-ui's texture-overlay, vendored for the empty content area. */
export const DOTS_TEXTURE =
  'bg-[radial-gradient(circle_at_1px_1px,var(--color-foreground)_1px,transparent_0)] bg-[length:8px_8px] opacity-10'

export const WINDOW_SHADOW =
  'shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0px_1px_1px_0px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.3)_inset,0px_0px_0px_1px_hsla(0,0%,0%,0.2)_inset,0px_0px_1px_0px_rgba(255,255,255,0.1)]'
