import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const CENTRED = 'translate(-50%, -50%)'

export type PinDropRippleProps = {
  /** Centre in 0..1 image space. */
  x: number
  y: number
  /** Outer ring radius in px. */
  radius: number
  /** Ring travel time in ms. */
  duration: number
  className?: string
}

/** Two shock rings that leave a dropped pin, the inner one a beat behind. */
export function PinDropRipple({ x, y, radius, duration, className }: PinDropRippleProps) {
  const seconds = duration / 1000
  const ring = 'absolute top-1/2 left-1/2 rounded-full border-2 border-white/90 shadow-[0_0_14px_white]'

  return (
    <span
      aria-hidden
      data-slot="pin-drop-ripple"
      className={cn('pointer-events-none absolute size-0', className)}
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <motion.span
        className={ring}
        style={{ width: radius * 2, height: radius * 2 }}
        initial={{ transform: `${CENTRED} scale(0.18)`, opacity: 0.95 }}
        animate={{ transform: `${CENTRED} scale(1)`, opacity: 0 }}
        transition={{ duration: seconds, ease: EASE_OUT }}
      />
      <motion.span
        className={ring}
        style={{ width: radius * 2, height: radius * 2 }}
        initial={{ transform: `${CENTRED} scale(0.14)`, opacity: 0.78 }}
        animate={{ transform: `${CENTRED} scale(0.7)`, opacity: 0 }}
        transition={{ duration: seconds * 0.85, delay: 0.065, ease: EASE_OUT }}
      />
    </span>
  )
}
