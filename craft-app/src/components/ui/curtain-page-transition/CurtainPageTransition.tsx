import { motion, useReducedMotion, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_BRAND,
  DEFAULT_DURATION,
  PAGE_SCALE,
  SCALE_IN_START,
  SCALE_OUT_END,
  SLIDE_END,
  SLIDE_START,
  STAGE,
} from './curtain-page-transition.constants'
import type { CurtainPageTransitionProps } from './curtain-page-transition.types'
import { useCurtainSwap } from './use-curtain-swap'

/**
 * Art of Documentary page transition: the current page scales to 0.8166 against a
 * #121212 stage, both pages slide up one viewport, then the incoming page scales to 1.
 * Adapted from DashDigital `_app` Transition (`io2`, 0.8s + 1s).
 */
export function CurtainPageTransition({
  transitionKey,
  children,
  duration = DEFAULT_DURATION,
  curtainColor = STAGE,
  brand = DEFAULT_BRAND,
  onTransitionEnd,
  className,
  ...props
}: CurtainPageTransitionProps) {
  const reduced = useReducedMotion() === true
  const { progress, veil, outgoing, incoming, running } = useCurtainSwap({
    transitionKey,
    children,
    duration,
    reduced,
    onEnd: onTransitionEnd,
  })

  const outgoingTransform = useTransform(progress, (t) => {
    const s = 1 + (PAGE_SCALE - 1) * span(t, 0, SCALE_OUT_END)
    return `scale(${s.toFixed(4)})`
  })

  const incomingTransform = useTransform(progress, (t) => {
    const s = PAGE_SCALE + (1 - PAGE_SCALE) * span(t, SCALE_IN_START, 1)
    return `scale(${s.toFixed(4)})`
  })

  // 200% stack: translateY -50% moves one viewport.
  const stackTransform = useTransform(progress, (t) => {
    const y = -50 * span(t, SLIDE_START, SLIDE_END)
    return `translateY(${y.toFixed(3)}%)`
  })

  const brandOpacity = useTransform(progress, (t) => {
    const inS = span(t, 0.28, 0.42)
    const outS = 1 - span(t, 0.62, 0.78)
    return inS * outS
  })
  const brandTransform = useTransform(
    brandOpacity,
    (o) => `translateY(calc(-50% + ${((1 - o) * 10).toFixed(2)}%))`,
  )

  return (
    <div
      data-slot="curtain-page-transition"
      data-running={running || undefined}
      aria-busy={running || undefined}
      className={cn('relative isolate overflow-hidden', className)}
      style={{ backgroundColor: curtainColor }}
      {...props}
    >
      {running && incoming ? (
        <motion.div
          className="absolute inset-x-0 top-0 h-[200%] w-full origin-top will-change-transform"
          style={{ transform: stackTransform }}
        >
          <div className="h-1/2 w-full overflow-hidden">
            <motion.div
              className="h-full w-full origin-center will-change-transform"
              style={{ transform: outgoingTransform }}
            >
              {outgoing}
            </motion.div>
          </div>
          <div className="h-1/2 w-full overflow-hidden">
            <motion.div
              className="h-full w-full origin-center will-change-transform"
              style={{ transform: incomingTransform }}
            >
              {incoming}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="h-full w-full">{outgoing}</div>
      )}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundColor: curtainColor, opacity: veil }}
      />

      {brand !== null && (
        <motion.p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 px-6 text-center font-mono text-[11px] tracking-[0.28em] text-white uppercase sm:text-xs"
          style={{ opacity: brandOpacity, transform: brandTransform }}
        >
          [ {brand} ]
        </motion.p>
      )}

      {running && <div aria-hidden className="absolute inset-0 z-20" />}
    </div>
  )
}

function span(t: number, from: number, to: number) {
  if (to <= from) return t >= to ? 1 : 0
  return Math.min(1, Math.max(0, (t - from) / (to - from)))
}
