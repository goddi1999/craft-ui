import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CLIP_X,
  CLIP_Y,
  DEFAULT_DURATION,
  DEFAULT_SLATS,
  WRAP_H,
  WRAP_W,
} from './accordion-page-transition.constants'
import type { AccordionPageTransitionProps } from './accordion-page-transition.types'
import { useAccordionSwap } from './use-accordion-swap'

/**
 * Accordion’s page mask: the outgoing page clips into a centre slit while equal-height
 * white slats shrink into the logo, two SVG curves cutting the concave silhouette.
 * Content swaps underneath, then the slit opens and the bars clear.
 * Adapted from Accordion / HOLOGRAPHIK (`runTransition`, power4.inOut, 1s).
 */
export function AccordionPageTransition({
  transitionKey,
  children,
  slats = DEFAULT_SLATS,
  duration = DEFAULT_DURATION,
  slatColor = '#ffffff',
  stageColor = '#020202',
  onTransitionEnd,
  className,
  ...props
}: AccordionPageTransitionProps) {
  const reduced = useReducedMotion() === true
  const { cover, reveal, veil, node, running } = useAccordionSwap({
    transitionKey,
    children,
    duration,
    reduced,
    onEnd: onTransitionEnd,
  })

  // 0 = open page, 1 = formed accordion. Cover drives it up, reveal drives it back down.
  const formed = useTransform([cover, reveal], ([c, r]) =>
    (r as number) < 0.999 ? (r as number) : (c as number),
  )

  const clipPath = useTransform(formed, (t) => clipFor(t))
  const wrapTransform = useTransform(formed, (t) => wrapScale(t))
  // Snap on/off with the mask so the slats stay opaque white, not grey.
  const overlayOpacity = useTransform(formed, (t) => (t > 0.001 ? 1 : 0))
  const stageOpacity = overlayOpacity

  const n = Math.max(3, Math.round(slats))
  const indices = Array.from({ length: n }, (_, i) => i)

  return (
    <div
      data-slot="accordion-page-transition"
      data-running={running || undefined}
      aria-busy={running || undefined}
      className={cn('relative isolate overflow-hidden', className)}
      {...props}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: stageColor, opacity: stageOpacity }}
      />

      <motion.div className="h-full w-full" style={{ clipPath }}>
        {node}
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundColor: stageColor, opacity: veil }}
      />

      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ opacity: overlayOpacity }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 flex origin-center will-change-transform"
            style={{
              width: `${WRAP_W * 100}%`,
              height: `${WRAP_H * 100}%`,
              transform: wrapTransform,
            }}
          >
            <div className="flex h-full w-full items-stretch gap-[1.65%]">
              {indices.map((i) => (
                <span
                  key={i}
                  className="min-w-0 flex-1"
                  style={{ backgroundColor: slatColor }}
                />
              ))}
            </div>
            <Curve edge="top" fill={stageColor} formed={formed} />
            <Curve edge="bottom" fill={stageColor} formed={formed} />
          </motion.div>
        </motion.div>
      )}

      {running && <div aria-hidden className="absolute inset-0 z-20" />}
    </div>
  )
}

/** Clip closes to Accordion’s 22.5vh / 48.5vw window, then seals for the swap. */
function clipFor(t: number) {
  const y = t < 0.8 ? (CLIP_Y * t) / 0.8 : CLIP_Y + ((50 - CLIP_Y) * (t - 0.8)) / 0.2
  const x = t < 0.8 ? (CLIP_X * t) / 0.8 : CLIP_X + ((50 - CLIP_X) * (t - 0.8)) / 0.2
  return `inset(${y.toFixed(2)}% ${x.toFixed(2)}%)`
}

/** Slat wrap starts at full stage (100vw × 100vh) and settles to 60vw × 45vh. */
function wrapScale(t: number) {
  const sx = 1 + (1 / WRAP_W - 1) * (1 - t)
  const sy = 1 + (1 / WRAP_H - 1) * (1 - t)
  return `translate(-50%, -50%) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
}

function Curve({
  edge,
  fill,
  formed,
}: {
  edge: 'top' | 'bottom'
  fill: string
  formed: MotionValue<number>
}) {
  // Curves start oversized / further off, then settle over the slat ends.
  const transform = useTransform(formed, (t) => {
    const extra = (1 - t) * 28
    const y = edge === 'top' ? -extra : extra
    const s = 1.35 - 0.35 * t
    return `translateY(${y.toFixed(2)}%) scale(${s.toFixed(4)})`
  })

  return (
    <motion.svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className={cn(
        'absolute inset-x-[-6%] h-[34%] w-[112%] origin-center',
        edge === 'top' ? 'top-[-14%]' : 'bottom-[-14%]',
      )}
      style={{ transform }}
    >
      {edge === 'top' ? (
        <path d="M0 0 H100 V14 Q50 32 0 14 Z" fill={fill} />
      ) : (
        <path d="M0 32 H100 V18 Q50 0 0 18 Z" fill={fill} />
      )}
    </motion.svg>
  )
}
