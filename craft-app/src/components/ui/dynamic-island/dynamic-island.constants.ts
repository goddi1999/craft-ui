import type { IslandSize, SizePresets } from './dynamic-island.types'

export const SIZE_PRESETS: Record<SizePresets, IslandSize> = {
  reset: { width: 150, height: 44, borderRadius: 46 },
  empty: { width: 0, height: 0, borderRadius: 0 },
  default: { width: 150, height: 44, borderRadius: 46 },
  minimalLeading: { width: 52.33, height: 44, borderRadius: 22 },
  minimalTrailing: { width: 52.33, height: 44, borderRadius: 22 },
  compact: { width: 235, height: 44, borderRadius: 46 },
  compactLong: { width: 300, height: 44, borderRadius: 46 },
  compactMedium: { width: 351, height: 64, borderRadius: 44 },
  long: { width: 371, height: 84, borderRadius: 42 },
  medium: { width: 371, height: 210, borderRadius: 22 },
  large: { width: 371, height: 84, borderRadius: 42 },
  tall: { width: 371, height: 210, borderRadius: 42 },
  ultra: { width: 630, height: 800, borderRadius: 42 },
  massive: { width: 891, height: 1900, borderRadius: 42 },
}

// a soft spring for the shell, quicker one for the content inside
export const ISLAND_SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const
export const CONTENT_SPRING = { type: 'spring', bounce: 0.35 } as const

// minimalLeading/Trailing sit to the side instead of being centred
export const MIN_SIDE_OFFSET = 136
