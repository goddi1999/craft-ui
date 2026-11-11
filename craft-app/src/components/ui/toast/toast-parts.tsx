import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import {
  ARRIVAL,
  BUMP,
  DRAW,
  INSTANT,
  LEAVE,
  POP,
  SETTLE,
  TILE,
  TILE_CLIP,
  TONES,
} from './toast.constants'
import type { ToastType } from './toast.types'

function Glyph({ type, reduced, delay }: { type: ToastType; reduced: boolean; delay: number }) {
  const stroke = {
    initial: reduced ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: reduced ? INSTANT : { ...DRAW, delay: DRAW.delay + delay },
  } as const

  if (type === 'loading') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-[18px] animate-spin motion-reduce:animate-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.75}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="8" strokeOpacity={0.25} />
        <path d="M12 4a8 8 0 0 1 8 8" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === 'success' && <motion.path d="M6 12.5l4 4 8-9" {...stroke} />}
      {type === 'error' && (
        <>
          <motion.path d="M7.5 7.5l9 9" {...stroke} />
          <motion.path d="M16.5 7.5l-9 9" {...stroke} />
        </>
      )}
      {type === 'warning' && (
        <>
          <motion.path d="M12 6v7" {...stroke} />
          <circle cx="12" cy="18" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
      {type === 'info' && (
        <>
          <circle cx="12" cy="6.25" r="1.6" fill="currentColor" stroke="none" />
          <motion.path d="M12 11v7" {...stroke} />
        </>
      )}
    </svg>
  )
}

/** The squircle status tile: pops in as the toast lands, and swaps glyphs in place for a promise. */
export function ToastIcon({ type }: { type: Exclude<ToastType, 'default'> }) {
  const reduced = useReducedMotion() ?? false
  // only the first icon waits for the toast to land; a promise swap animates right away
  const [arrivingType] = useState(type)
  const settled = type !== arrivingType
  const delay = settled ? 0 : ARRIVAL

  return (
    <motion.span
      aria-hidden
      data-slot="toast-icon"
      initial={reduced ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: settled ? [1, 1.08, 1] : 1, opacity: 1 }}
      transition={
        reduced ? INSTANT : settled ? { scale: BUMP } : { ...SETTLE, delay: ARRIVAL - 0.08 }
      }
      style={{ width: TILE, height: TILE, clipPath: TILE_CLIP }}
      className={cn(
        'relative shrink-0 transition-colors duration-200 motion-reduce:transition-none',
        TONES[type],
      )}
    >
      <AnimatePresence initial={!reduced} mode="wait">
        <motion.span
          key={type}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0, transition: reduced ? INSTANT : LEAVE }}
          transition={reduced ? INSTANT : { ...POP, delay }}
          className="absolute inset-0 grid place-items-center"
        >
          <Glyph type={type} reduced={reduced} delay={delay} />
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}
