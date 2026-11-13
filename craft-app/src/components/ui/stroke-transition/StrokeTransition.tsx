import { motion, useReducedMotion, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_STROKE,
  HALF_S,
  STROKE_PATH,
  STROKE_WIDTH,
  VIEW_H,
  VIEW_W,
} from './stroke-transition.constants'
import type { StrokeTransitionProps } from './stroke-transition.types'
import { useStrokeSwap } from './use-stroke-swap'

/**
 * A page transition drawn with one fat brush stroke. When `transitionKey` changes the stroke
 * spirals in until it covers the stage, the new content swaps in underneath, and the stroke's
 * tail chases its head off screen to reveal it.
 */
export function StrokeTransition({
  transitionKey,
  children,
  direction = 'forward',
  duration = HALF_S,
  strokeClassName = DEFAULT_STROKE,
  onTransitionEnd,
  className,
  ...props
}: StrokeTransitionProps) {
  const reduced = useReducedMotion() ?? false
  const { head, tail, veil, node, running } = useStrokeSwap({
    transitionKey,
    children,
    duration,
    reduced,
    onEnd: onTransitionEnd,
  })

  // pathLength is 1, so the dash is the visible stretch between the tail and the head
  const dashArray = useTransform(() => `${Math.max(head.get() - tail.get(), 0)} 3`)
  const dashOffset = useTransform(() => -tail.get())
  const visible = useTransform(() => (head.get() - tail.get() > 0.0005 ? 1 : 0))

  return (
    <div
      data-slot="stroke-transition"
      data-running={running || undefined}
      aria-busy={running || undefined}
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
    >
      {node}

      <svg
        aria-hidden
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        // stretched to the stage so the whole spiral shows at any aspect; the rings scale with
        // the axes, so the gaps between them close the same way and coverage holds
        preserveAspectRatio="none"
        className={cn('pointer-events-none absolute inset-0 z-10 size-full', strokeClassName)}
      >
        <g transform={direction === 'backward' ? `translate(${VIEW_W} 0) scale(-1 1)` : undefined}>
          <motion.path
            d={STROKE_PATH}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset, opacity: visible }}
          />
        </g>
        <motion.rect width={VIEW_W} height={VIEW_H} fill="currentColor" style={{ opacity: veil }} />
      </svg>

      {/* blocks clicks on content that is about to be swapped out */}
      {running && <div aria-hidden className="absolute inset-0 z-20" />}
    </div>
  )
}
