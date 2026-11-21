import type { DynamicIslandSize, PhoneFrameColor } from './phone-frame.types'

export const FRAME_COLORS: Record<PhoneFrameColor, { gradient: string; button: string }> = {
  graphite: {
    gradient:
      'linear-gradient(145deg, #454549 0%, #3d3d41 15%, #363839 30%, #3a3a3e 50%, #424246 70%, #3b3b3f 85%, #343438 100%)',
    button: 'linear-gradient(180deg, #424246 0%, #3a3a3e 30%, #363839 50%, #3a3a3e 70%, #424246 100%)',
  },
  silver: {
    gradient:
      'linear-gradient(145deg, #e8e8e8 0%, #d4d4d4 15%, #c0c0c0 30%, #d0d0d0 50%, #e0e0e0 70%, #cccccc 85%, #b8b8b8 100%)',
    button: 'linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 30%, #b0b0b0 50%, #c8c8c8 70%, #e0e0e0 100%)',
  },
  gold: {
    gradient:
      'linear-gradient(145deg, #ff9544 0%, #f88535 15%, #f77e2d 30%, #f88535 50%, #ff9040 70%, #f88030 85%, #f77e2d 100%)',
    button: 'linear-gradient(180deg, #ff9040 0%, #f88535 30%, #f77e2d 50%, #f88535 70%, #ff9040 100%)',
  },
  blue: {
    gradient:
      'linear-gradient(145deg, #3f4459 0%, #383c50 15%, #32374b 30%, #383c50 50%, #3d4256 70%, #363a4e 85%, #32374b 100%)',
    button: 'linear-gradient(180deg, #3d4256 0%, #383c50 30%, #32374b 50%, #383c50 70%, #3d4256 100%)',
  },
}

/** Lighting for the left rail buttons; gold has warm shadows, the rest share the graphite preset. */
export const RAIL_LIGHTING = {
  neutral: {
    beforeShadow:
      'before:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.28)]',
    afterClasses: 'after:bg-gradient-to-b after:from-black/50 after:via-black/20 after:to-transparent',
    boxShadow:
      '-1px 0 0 0 rgba(255,255,255,0.16), -2px 3px 5px -1px rgba(0,0,0,0.34), -4px 5px 12px -2px rgba(0,0,0,0.2), inset 1px 0 1px rgba(255,255,255,0.12)',
  },
  gold: {
    beforeShadow:
      'before:shadow-[inset_0_1px_0_rgba(255,228,195,0.5),inset_1px_0_0_rgba(255,240,215,0.3),inset_0_-1px_0_rgba(115,52,18,0.38)]',
    afterClasses:
      'after:bg-gradient-to-b after:from-[rgba(72,36,14,0.58)] after:via-[rgba(72,36,14,0.22)] after:to-transparent',
    boxShadow:
      '-1px 0 0 0 rgba(255,246,225,0.24), -2px 3px 5px -1px rgba(48,24,8,0.34), -4px 5px 12px -2px rgba(80,40,14,0.2), inset 1px 0 1px rgba(255,232,205,0.22)',
  },
} as const

export const POWER_BUTTON_SHADOW =
  '1px 0 0 0 rgba(255,255,255,0.15), 2px 1px 3px -1px rgba(0,0,0,0.25), 3px 2px 6px 0 rgba(0,0,0,0.15), inset -1px 0 1px rgba(255,255,255,0.1)'

export const ISLAND_SIZES: Record<DynamicIslandSize, { width: number; height: number; borderRadius: number }> = {
  default: { width: 110, height: 32, borderRadius: 16 },
  expanded: { width: 280, height: 56, borderRadius: 32 },
  large: { width: 290, height: 120, borderRadius: 32 },
  ultra: { width: 300, height: 180, borderRadius: 36 },
}

export const ISLAND_LABELS: Record<DynamicIslandSize, string> = {
  default: 'Dynamic island, collapsed',
  expanded: 'Dynamic island, expanded',
  large: 'Dynamic island, large',
  ultra: 'Dynamic island, ultra',
}

export const ISLAND_SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const

export const SIGNAL_BARS = [1, 2, 3, 4] as const

export const WAVEFORM_BARS = [8, 18, 12, 12, 17, 24, 15, 20, 16, 21, 14, 18] as const

export const ISLAND_ART =
  'bg-linear-to-br from-pink-500 via-orange-400 to-violet-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]'

export const PROGRESS_RING_RADIUS = 15
