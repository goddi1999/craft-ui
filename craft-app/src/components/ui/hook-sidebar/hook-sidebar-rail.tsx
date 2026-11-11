import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

/** Radius of the hook where the rail turns into the row. */
export const HOOK_CORNER = 6

const DASH =
  'repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)'
const TRAVEL = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const
const FADE = { duration: 0.2 } as const
const INSTANT = { duration: 0 } as const

type HookSidebarRailProps = {
  /** Top of the vertical line, in px from the list top. */
  from?: number
  /** Centre of the row the hook turns into; null hides the rail. */
  y: number | null
  visible: boolean
  dashed: boolean
  /** Any CSS color; defaults to the inherited text color. */
  color?: string
  className?: string
}

/** A vertical line that springs down to a row and hooks into it. */
export function HookSidebarRail({
  from = 0,
  y,
  visible,
  dashed,
  color,
  className,
}: HookSidebarRailProps) {
  const reduced = useReducedMotion()
  const travel = reduced ? INSTANT : TRAVEL

  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      style={{ color }}
      animate={{ opacity: visible && y !== null ? 1 : 0 }}
      transition={reduced ? INSTANT : FADE}
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      <motion.span
        initial={false}
        animate={{ top: from, height: Math.max(0, (y ?? 0) - HOOK_CORNER - from) }}
        transition={travel}
        style={dashed ? { backgroundImage: DASH } : { backgroundColor: 'currentColor' }}
        className="absolute left-0.5 w-px"
      />
      <motion.svg
        initial={false}
        animate={{ top: (y ?? 0) - HOOK_CORNER }}
        transition={travel}
        width="12"
        height="7"
        viewBox="0 0 12 7"
        fill="none"
        className="absolute left-0.5"
      >
        <path
          d="M0.5 0a6 6 0 0 0 6 6H12"
          stroke="currentColor"
          strokeDasharray={dashed ? '2 2' : undefined}
        />
      </motion.svg>
    </motion.span>
  )
}
