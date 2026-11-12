import type { GreetingItem } from './intro-loader.types'

export const DEFAULT_GREETINGS: GreetingItem[] = [
  { text: 'Hello', lang: 'EN' },
  { text: 'Hola', lang: 'ES' },
  { text: 'Bonjour', lang: 'FR' },
  { text: 'Ciao', lang: 'IT' },
  { text: 'こんにちは', lang: 'JA' },
  { text: 'नमस्कार', lang: 'HI' },
]

// easyui motion tokens, inlined so the folder copies on its own
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const SPRING_GENTLE = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const

// the shortest a greeting may hold, whatever the speed
export const MIN_INTERVAL = 100
// how long the last greeting lingers on top of its own interval
export const FINAL_HOLD = 450

export const OVERLAY_EXIT = { duration: 0.65, ease: EASE_OUT } as const
export const GREETING_IN = { duration: 0.22, ease: EASE_OUT } as const
export const PROGRESS = { duration: 0.22, ease: 'easeOut' } as const
export const SKIP_IN = { delay: 0.1, duration: 0.3 } as const
export const FADE = { duration: 0.3 } as const

export const FOCUS_RING = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'
