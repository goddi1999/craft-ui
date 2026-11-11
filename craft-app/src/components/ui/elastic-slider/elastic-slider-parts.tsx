import { motion, type MotionValue } from 'motion/react'
import type { Ref } from 'react'

import { cn } from '@/lib/utils'

type HashMarksProps = {
  count: number
  positionAt: (index: number) => number
}

/** Tick marks at each step (coarse sliders) or each decile; visible while active. */
export function ElasticSliderHashMarks({ count, positionAt }: HashMarksProps) {
  return (
    <div
      data-slot="elastic-slider-hash-marks"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn(
            'absolute top-1/2 h-2 w-px -translate-1/2 rounded-full transition-colors duration-200',
            'bg-transparent group-data-[active=true]/elastic-slider:bg-(--elastic-slider-hash)',
          )}
          style={{ left: `${positionAt(i)}%` }}
        />
      ))}
    </div>
  )
}

export function ElasticSliderFill({ width }: { width: MotionValue<string> }) {
  return (
    <motion.div
      data-slot="elastic-slider-fill"
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 left-0 transition-colors',
        'bg-(--elastic-slider-fill) group-data-[active=true]/elastic-slider:bg-(--elastic-slider-fill-active)',
      )}
      style={{ width }}
    />
  )
}

type HandleProps = {
  left: MotionValue<string>
  isActive: boolean
  valueDodge: boolean
  opacity: number
  reduceMotion: boolean
}

export function ElasticSliderHandle({
  left,
  isActive,
  valueDodge,
  opacity,
  reduceMotion,
}: HandleProps) {
  return (
    <motion.div
      data-slot="elastic-slider-handle"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 h-5 w-1 rounded-full bg-(--elastic-slider-handle)"
      style={{ left, y: '-50%' }}
      animate={{
        opacity,
        scaleX: isActive ? 1 : 0.25,
        scaleY: isActive && valueDodge ? 0.75 : 1,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              scaleX: { type: 'spring', visualDuration: 0.25, bounce: 0.15 },
              scaleY: { type: 'spring', visualDuration: 0.2, bounce: 0.1 },
              opacity: { duration: 0.15 },
            }
      }
    />
  )
}

export function ElasticSliderLabel({
  ref,
  children,
}: {
  ref: Ref<HTMLSpanElement>
  children: string
}) {
  return (
    <span
      ref={ref}
      data-slot="elastic-slider-label"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3 inline-flex -translate-y-1/2 items-center text-sm/none font-medium text-(--elastic-slider-label) transition-colors"
    >
      {children}
    </span>
  )
}

export function ElasticSliderValue({
  ref,
  children,
}: {
  ref: Ref<HTMLSpanElement>
  children: string
}) {
  return (
    <span
      ref={ref}
      data-slot="elastic-slider-value"
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm/none font-medium transition-colors',
        'text-(--elastic-slider-label) group-data-[active=true]/elastic-slider:text-(--elastic-slider-focus)',
      )}
    >
      {children}
    </span>
  )
}
