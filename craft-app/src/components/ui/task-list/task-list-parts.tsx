import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  ACCENT_VAR,
  FILL,
  INSTANT,
  POP,
  POP_SCALE,
  RING_DASH,
  RING_R,
  SIZES,
  STRIKE,
  STRIKE_STYLE,
  TICK,
} from './task-list.constants'
import { useTiming } from './task-list-hooks'
import type { TaskSize } from './task-list.types'

/** The dashed ring that fills with the accent, pops, and draws a tick. */
export function TaskCheck({
  filled,
  size,
  onDrawn,
}: {
  filled: boolean
  size: TaskSize
  onDrawn: () => void
}) {
  const timing = useTiming()

  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('shrink-0 text-muted-foreground/40', SIZES[size].check)}
      initial={false}
      animate={{ scale: filled ? POP_SCALE : 1 }}
      transition={filled ? timing(POP) : INSTANT}
    >
      <motion.circle
        cx="12"
        cy="12"
        r={RING_R}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={RING_DASH}
        initial={false}
        animate={{ opacity: filled ? 0 : 1 }}
        transition={timing(FILL)}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="12"
        fill={`var(${ACCENT_VAR})`}
        style={{ transformBox: 'view-box', transformOrigin: '12px 12px' }}
        initial={false}
        animate={{ scale: filled ? 1 : 0 }}
        transition={timing(FILL)}
      />
      <motion.path
        d="M7.4 12.4 10.6 15.5 16.6 8.9"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
        transition={timing(TICK)}
        onAnimationComplete={onDrawn}
      />
    </motion.svg>
  )
}

/** The label, struck through by a background line that grows across it. */
export function TaskLabel({
  label,
  struck,
  size,
  onStruck,
}: {
  label: string
  struck: boolean
  size: TaskSize
  onStruck: () => void
}) {
  const timing = useTiming()
  const { text, line } = SIZES[size]

  return (
    <span className="min-w-0 flex-1">
      <motion.span
        style={STRIKE_STYLE}
        className={cn(
          'font-medium tracking-[-0.01em] transition-colors duration-300',
          text,
          struck ? 'text-muted-foreground/70' : 'text-foreground',
        )}
        initial={false}
        animate={{ backgroundSize: `${struck ? 100 : 0}% ${line}` }}
        transition={timing(STRIKE)}
        onAnimationComplete={onStruck}
      >
        {label}
      </motion.span>
    </span>
  )
}
