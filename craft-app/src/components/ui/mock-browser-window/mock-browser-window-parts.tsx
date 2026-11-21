import { Lock } from 'lucide-react'

import { cn } from '@/lib/utils'

import { DOTS_TEXTURE } from './mock-browser-window.constants'
import type {
  BrowserHeaderStyle,
  BrowserSidebarItem,
  BrowserVariant,
} from './mock-browser-window.types'
import { addressBarVariants, windowDotVariants } from './mock-browser-window-variants'

const DOT_COLORS = ['red', 'yellow', 'green'] as const

type WindowControlsProps = {
  variant: BrowserVariant
  headerStyle: BrowserHeaderStyle
}

export function WindowControls({ variant, headerStyle }: WindowControlsProps) {
  const isMuted = variant === 'safari' && headerStyle === 'minimal'
  return (
    <div className={cn('flex', variant === 'safari' ? 'gap-2' : 'gap-1.5')} aria-hidden>
      {DOT_COLORS.map((color) => (
        <span key={color} className={windowDotVariants({ color: isMuted ? 'muted' : color })} />
      ))}
    </div>
  )
}

type AddressBarProps = {
  url: string
  variant: BrowserVariant
  className?: string
}

export function AddressBar({ url, variant, className }: AddressBarProps) {
  return (
    <div className={cn('flex flex-1 justify-center', className)}>
      <div className={addressBarVariants({ variant })}>
        <Lock className="size-3 shrink-0 text-muted-foreground/60" aria-label="Secure" />
        <span className="truncate">{url}</span>
      </div>
    </div>
  )
}

type SidebarContentProps = {
  items: BrowserSidebarItem[]
}

export function SidebarContent({ items }: SidebarContentProps) {
  return (
    <ul className="space-y-1 p-3">
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          className={cn(
            'flex items-center gap-2 rounded border px-2 py-1.5 text-sm transition-colors',
            item.active
              ? 'border-primary/5 bg-primary/5 text-primary'
              : 'border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground',
          )}
        >
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="min-w-4 rounded-full bg-primary/5 px-1.5 py-0.5 text-center text-xs text-primary">
              {item.badge}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

/** Vendored cult-ui TextureOverlay (dots preset), shown when the window has no children. */
export function TextureOverlay({ className }: { className?: string }) {
  return <div className={cn('pointer-events-none absolute inset-0', DOTS_TEXTURE, className)} />
}
