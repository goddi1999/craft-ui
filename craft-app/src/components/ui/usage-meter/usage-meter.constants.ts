import type { Transition, Variants } from 'motion/react'

import type { UsageStatus } from './usage-meter.types'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const DURATION = { instant: 0.12, fast: 0.16, standard: 0.24, considered: 0.48 } as const
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const SPRING_SMOOTH = { visualDuration: 0.4, bounce: 0 } as const
export const SPRING_MORPH = { visualDuration: 0.42, bounce: 0 } as const
export const BLUR = { subtle: 2, soft: 4 } as const

// motion drops inherited velocity on time-defined springs, so values that retarget mid-flight
// run the same springs written as stiffness and damping
function physicalSpring(
  { visualDuration, bounce }: { visualDuration: number; bounce: number },
  restDelta = 0.001,
): Transition {
  const root = (2 * Math.PI) / (visualDuration * 1.2)
  return {
    type: 'spring',
    stiffness: root * root,
    damping: 2 * (1 - bounce) * root,
    restDelta,
    restSpeed: restDelta * 2,
  }
}

export const SETTLE = physicalSpring(SPRING_SMOOTH)
export const REVEAL = physicalSpring({ visualDuration: DURATION.considered + 0.1, bounce: 0 })
export const TURN = physicalSpring(SPRING_SMOOTH)
export const FIT = physicalSpring(SPRING_MORPH, 0.01)
export const INSTANT: Transition = { duration: 0 }

// segments grow in left to right, this far apart
export const REVEAL_STAGGER = 0.07
// a segment stops two pixels short of the next, so neighbours read apart without an outline
export const GAP = 2
export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// changed text rises from a soft blur and leaves a little faster than it arrives
export const RISE: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    y: `${0.3 * direction}em`,
    scale: 1,
    filter: `blur(${BLUR.soft}px)`,
  }),
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.standard, ease: EASE_ENTER },
  },
  gone: (direction: number) => ({
    opacity: 0,
    y: `${-0.3 * direction}em`,
    scale: 1,
    filter: `blur(${BLUR.subtle}px)`,
    transition: { duration: DURATION.instant, ease: EASE_STANDARD },
  }),
}

// icons cross through a small scale instead
export const POP: Variants = {
  hidden: { opacity: 0, y: 0, scale: 0.6, filter: `blur(${BLUR.subtle + 1}px)` },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...SPRING_SNAPPY,
      opacity: { duration: DURATION.fast, ease: EASE_ENTER },
      filter: { duration: DURATION.fast, ease: EASE_ENTER },
    },
  },
  gone: {
    opacity: 0,
    y: 0,
    scale: 0.6,
    filter: `blur(${BLUR.subtle + 1}px)`,
    transition: { duration: DURATION.instant, ease: EASE_STANDARD },
  },
}

export const FADE: Variants = {
  hidden: { opacity: 0, y: 0, scale: 1, filter: 'blur(0px)' },
  shown: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: DURATION.fast } },
  gone: { opacity: 0, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: DURATION.instant } },
}

// new digit columns open from zero width
export const COLUMN = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

// categories are steps of the primary colour, strongest first, so the meter reads as one allowance
export const SEGMENT_COLORS = [
  'bg-primary',
  'bg-[color-mix(in_oklab,var(--primary)_62%,var(--card))]',
  'bg-[color-mix(in_oklab,var(--primary)_36%,var(--card))]',
  'bg-[color-mix(in_oklab,var(--primary)_22%,var(--card))]',
] as const

// free space is the track itself
export const TRACK = 'bg-[color-mix(in_oklab,var(--foreground)_7%,var(--card))]'
export const FREE_SWATCH = `${TRACK} shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_25%,transparent)]`

export const BADGE_TONES: Record<UsageStatus, string> = {
  ok: 'bg-muted text-muted-foreground',
  near: 'bg-amber-500/15 text-foreground dark:bg-amber-400/15',
  over: 'bg-destructive/12 text-foreground',
}

export const BADGE_ICON_TONES: Record<UsageStatus, string> = {
  ok: '',
  near: 'text-amber-600 dark:text-amber-400',
  over: 'text-destructive',
}
