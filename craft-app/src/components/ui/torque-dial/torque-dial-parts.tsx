import { motion, type Transition } from 'motion/react'

import { cn } from '@/lib/utils'

import { ARC, CIRCUMFERENCE, KNOB, RADIUS, STROKE } from './torque-dial.constants'

// the blue is fixed rather than a theme token, it reads on light and dark alike

export function DialTrack({
  size,
  progress,
  transition,
}: {
  size: number
  progress: number
  transition: Transition
}) {
  // a 270deg dash on the circle, turned so it opens at the bottom
  const arc = {
    cx: 50,
    cy: 50,
    r: RADIUS,
    fill: 'none',
    strokeWidth: STROKE,
    strokeDasharray: `${ARC} ${CIRCUMFERENCE}`,
    strokeLinecap: 'round',
    transform: 'rotate(135 50 50)',
  } as const

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0"
      style={{ width: size, height: size }}
    >
      <circle {...arc} className="stroke-border" />
      <motion.circle
        {...arc}
        className="stroke-blue-500"
        initial={false}
        animate={{ strokeDashoffset: ARC * (1 - progress) }}
        transition={transition}
      />
    </svg>
  )
}

export function DialKnob({
  size,
  angle,
  dragging,
  transition,
}: {
  size: number
  angle: number
  dragging: boolean
  transition: Transition
}) {
  return (
    <motion.div
      aria-hidden
      style={{ width: size * KNOB, height: size * KNOB }}
      initial={false}
      animate={{ rotate: angle }}
      transition={transition}
      className={cn(
        'relative flex items-center justify-center rounded-full border border-border bg-card shadow-xs',
        dragging && 'border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      )}
    >
      {/* the notch shows where the knob points */}
      <span className="absolute top-2 h-3 w-1.5 rounded-full bg-blue-500 shadow-xs" />
      <span className="size-4 rounded-full border border-border bg-background" />
    </motion.div>
  )
}
