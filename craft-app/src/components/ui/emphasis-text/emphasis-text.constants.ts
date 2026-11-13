import type { EmphasisWeight } from './emphasis-text.types'

export const DEFAULT_STEPS: EmphasisWeight[] = [
  { name: 'Regular', value: 400 },
  { name: 'Bold', value: 700 },
  { name: 'Light', value: 300 },
]

// the pill slides between words in ~0.2s in the reference, stretching over the ones it crosses
export const PILL_SPRING = { type: 'spring', duration: 0.32, bounce: 0.12 } as const
export const PILL_IN = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } as const
// keyboard moves are instant; `custom` tells an exiting pill which kind of move removed it
export const PILL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.85 },
  shown: { opacity: 1, scale: 1 },
  gone: (instant: boolean) => ({ opacity: 0, transition: instant ? { duration: 0 } : PILL_IN }),
}
// the weight eases in slowly, so you watch the word thicken
export const WEIGHT_MS = 700
export const DIM_MS = 200
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
