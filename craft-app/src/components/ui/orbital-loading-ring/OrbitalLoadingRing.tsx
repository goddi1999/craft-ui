import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CORE_GLOW,
  CORE_PULSE,
  INNER_EASE,
  INNER_GLOW,
  INNER_TRACK_OPACITY,
  INNER_TURN,
  KEYFRAMES,
  OUTER_GLOW,
  OUTER_TRACK_OPACITY,
  OUTER_TURN,
  PULSE,
  SPIN_CCW,
  SPIN_CW,
} from './orbital-loading-ring.constants'
import type { OrbitalLoadingRingProps } from './orbital-loading-ring.types'

/**
 * A loader of two counter-rotating orbits around a pulsing core: the outer satellite turns at a
 * steady pace, the inner one eases the other way. Reduced motion holds every part where it starts.
 */
export function OrbitalLoadingRing({
  size = 72,
  speed = 1,
  variant = 'default',
  label = 'Loading',
  className,
  style,
  ...props
}: OrbitalLoadingRingProps) {
  const reduced = useReducedMotion() ?? false
  const still = reduced || !(speed > 0)
  const run = (name: string, seconds: number, ease: string) =>
    still ? undefined : `${name} ${seconds / speed}s ${ease} infinite`

  return (
    <div
      role="status"
      aria-label={label}
      data-slot="orbital-loading-ring"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center text-foreground select-none',
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {/* react hoists this into the head once, however many rings render */}
      <style href="orbital-loading-ring" precedence="default">
        {KEYFRAMES}
      </style>
      <span className="sr-only">{label}</span>

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="pointer-events-none absolute inset-0 size-full"
      >
        <circle cx="50" cy="50" r="44" strokeOpacity={OUTER_TRACK_OPACITY} strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="30" strokeOpacity={INNER_TRACK_OPACITY} />
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ animation: run(SPIN_CW, OUTER_TURN, 'linear') }}
      >
        <span
          className={cn(
            'absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-current',
            OUTER_GLOW,
          )}
        />
        {variant !== 'minimal' && (
          <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-current/40" />
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-[18%] flex items-center justify-center"
        style={{ animation: run(SPIN_CCW, INNER_TURN, INNER_EASE) }}
      >
        <span
          className={cn(
            'absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-current/85',
            INNER_GLOW,
          )}
        />
        {variant === 'dense' && (
          <span className="absolute top-1/2 -right-1 size-1.5 -translate-y-1/2 rounded-full bg-current/30" />
        )}
      </div>

      <div
        aria-hidden
        className={cn('size-3 rounded-full bg-current', CORE_GLOW)}
        style={{ animation: run(PULSE, CORE_PULSE, 'ease-in-out') }}
      />
    </div>
  )
}
