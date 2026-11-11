import type { ToastType } from './toast.types'
import { squirclePath } from './toast.utils'

// card radius = tile radius + padding, so the corners stay concentric
export const PADDING = 10
export const TILE = 36
export const TILE_RADIUS = 11
export const CARD_RADIUS = TILE_RADIUS + PADDING

export const TILE_CLIP = `path('${squirclePath(TILE, TILE, TILE_RADIUS)}')`

// status colours are Apple's system palette, light and dark — deliberate, not theme tokens
export const TONES: Record<Exclude<ToastType, 'default'>, string> = {
  success: 'bg-[#34C759] text-white dark:bg-[#30D158]',
  error: 'bg-[#FF3B30] text-white dark:bg-[#FF453A]',
  warning: 'bg-[#FF9500] text-white dark:bg-[#FF9F0A]',
  info: 'bg-[#007AFF] text-white dark:bg-[#0A84FF]',
  loading: 'bg-muted text-muted-foreground',
}

export const POP = { type: 'spring', stiffness: 520, damping: 30 } as const
// critically damped, so the tile eases in without the glyph's bounce
export const SETTLE = { type: 'spring', stiffness: 320, damping: 36 } as const
export const DRAW = { duration: 0.3, delay: 0.1, ease: 'easeOut' } as const
// sonner's enter slide is 400ms, so the icon waits for most of it before popping in
export const ARRIVAL = 0.32
export const INSTANT = { duration: 0 } as const
// a promise result waits for the spinner to leave, then the tile gives one small bump
export const LEAVE = { duration: 0.14, ease: 'easeIn' } as const
export const BUMP = {
  duration: 0.4,
  delay: LEAVE.duration,
  ease: 'easeOut' as const,
  times: [0, 0.4, 1],
}
