import type { EmojiData } from './emoji-reaction.types'

// only the default set, the full emoji map ships 380kb of json
export const DEFAULT_EMOJI_DATA: EmojiData = {
  baseUrl: 'https://em-content.zobj.net/source/apple/419/',
  emojis: {
    'smiling-face-with-hearts': 'smiling-face-with-hearts_1f970.png',
    'star-struck': 'star-struck_1f929.png',
    'confused-face': 'confused-face_1f615.png',
    'pleading-face': 'pleading-face_1f97a.png',
    'grinning-face-with-smiling-eyes': 'grinning-face-with-smiling-eyes_1f604.png',
  },
}

export const DEFAULT_EMOJIS = Object.keys(DEFAULT_EMOJI_DATA.emojis)

export const SURFACE = 'bg-muted'

export const BURST_COUNT = 5
export const HOLD_INTERVAL = 550
export const MAX_PARTICLES = 60
export const RISE = 450
export const LAUNCH_SPREAD = 6
export const CLIMB_SPREAD = 78
// soft ease out, roughly 65% of the distance by the halfway point so it keeps moving
export const EASE = [0.4, 0.3, 0.5, 1] as const
export const SWAY = [0, 0.3, 0.65, 1]

export const GAP = 16
export const EDGE = 8

export const SIZES = {
  sm: {
    trigger: 'size-8',
    icon: 'size-4',
    emoji: 26,
    pill: 'gap-0.5 p-1',
    burst: 26,
  },
  md: {
    trigger: 'size-10',
    icon: 'size-5',
    emoji: 34,
    pill: 'gap-1 p-1.5',
    burst: 34,
  },
  lg: {
    trigger: 'size-12',
    icon: 'size-6',
    emoji: 42,
    pill: 'gap-1.5 p-2',
    burst: 42,
  },
} as const
