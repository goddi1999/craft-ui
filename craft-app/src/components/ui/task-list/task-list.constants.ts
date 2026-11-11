import type { CSSProperties } from 'react'
import type { Transition } from 'motion/react'

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const POP_SCALE = [1, 1.08, 1]
export const FLICK = [0, 8, -2, 0]
const FLICK_TIMES = [0, 0.35, 0.7, 1]

export const FILL: Transition = { duration: 0.24, ease: EASE_OUT }
export const POP: Transition = { duration: 0.34, ease: EASE_OUT, times: [0, 0.4, 1] }
export const TICK: Transition = { duration: 0.22, ease: EASE_OUT, delay: 0.06 }
export const STRIKE: Transition = { duration: 0.38, ease: EASE_IN_OUT }
export const NUDGE: Transition = { duration: 0.3, ease: EASE_OUT, times: FLICK_TIMES }
export const REORDER: Transition = { type: 'spring', stiffness: 320, damping: 30 }
export const INSTANT: Transition = { duration: 0 }

export const DEFAULT_ACCENT = '#FF5F2E'

// dashes divide the circumference, so the ring closes without a seam
export const RING_R = 11
export const RING_DASH = `1 ${(2 * Math.PI * RING_R) / 13 - 1}`

// the strike rides on the text itself, so a label that wraps gets a line per row
export const STRIKE_STYLE: CSSProperties = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 52%',
  boxDecorationBreak: 'clone',
  WebkitBoxDecorationBreak: 'clone',
}

// the check is one line box tall at every size, so it sits on the first line
export const SIZES = {
  sm: {
    row: 'gap-2.5 rounded-xl px-3 py-2',
    check: 'h-5 w-5',
    text: 'text-[13px] leading-5',
    line: '1.5px',
    list: 'gap-1.5',
  },
  md: {
    row: 'gap-3 rounded-[14px] px-3.5 py-2.5',
    check: 'h-6 w-6',
    text: 'text-[15px] leading-6',
    line: '2px',
    list: 'gap-2',
  },
  lg: {
    row: 'gap-3.5 rounded-2xl px-4 py-3',
    check: 'h-7 w-7',
    text: 'text-[17px] leading-7',
    line: '2.5px',
    list: 'gap-2.5',
  },
} as const

// ticking runs tick to strike to nudge, unticking runs the same road backwards
export const STAGE = {
  idle: 'idle',
  tick: 'tick',
  strike: 'strike',
  nudge: 'nudge',
  settled: 'settled',
  unstrike: 'unstrike',
  untick: 'untick',
} as const
export type Stage = (typeof STAGE)[keyof typeof STAGE]

export const FILLED: Stage[] = ['tick', 'strike', 'nudge', 'settled', 'unstrike']
export const STRUCK: Stage[] = ['strike', 'nudge', 'settled']

export const ACCENT_VAR = '--task-accent'
export const CARD =
  'bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_3px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_18px_rgba(0,0,0,0.09)] active:brightness-95 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_3px_10px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.45),0_6px_18px_rgba(0,0,0,0.4)] dark:active:brightness-110'
export const FOCUS =
  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--task-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background'
