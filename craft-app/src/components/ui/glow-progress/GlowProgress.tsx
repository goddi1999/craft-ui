import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { GLOW_PROGRESS_HEIGHTS, GLOW_PROGRESS_TONES } from './glow-progress.constants'
import type { GlowProgressProps } from './glow-progress.types'
import './glow-progress.css'

// A four-point star, drawn once so it scales with the bar.
const SPARKLE_PATH =
  'M12 0C12.7 6.4 17.6 11.3 24 12C17.6 12.7 12.7 17.6 12 24C11.3 17.6 6.4 12.7 0 12C6.4 11.3 11.3 6.4 12 0Z'

function clampValue(value: number, max: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(value, 0), max)
}

export function GlowProgress({
  value = 0,
  max = 100,
  tone = 'lime',
  size = 'md',
  sparkle = true,
  className,
  style,
  ...props
}: GlowProgressProps) {
  const safeMax = max > 0 ? max : 100
  const current = clampValue(value, safeMax)
  const percent = (current / safeMax) * 100
  const { from, to, glow } = GLOW_PROGRESS_TONES[tone]
  const height = GLOW_PROGRESS_HEIGHTS[size]

  const vars = {
    '--glow-progress-h': `${height}px`,
    '--glow-progress-from': from,
    '--glow-progress-to': to,
    '--glow-progress-glow': glow,
    height,
    ...style,
  } as CSSProperties

  return (
    <ProgressPrimitive.Root
      data-slot="glow-progress"
      value={current}
      max={safeMax}
      className={cn('bg-foreground/12 relative w-full rounded-full', className)}
      style={vars}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="glow-progress-indicator"
        className={cn(
          'glow-progress-fill absolute inset-y-0 left-0 rounded-full',
          'bg-[linear-gradient(90deg,var(--glow-progress-from),var(--glow-progress-to))]',
          percent === 0 && 'opacity-0',
        )}
        // At least one bar-height wide, so a small value still shows a round pill.
        style={{ width: `max(var(--glow-progress-h), ${percent}%)` }}
      >
        <span
          aria-hidden
          className="absolute inset-y-[32%] right-[calc(var(--glow-progress-h)*0.9)] left-[calc(var(--glow-progress-h)*0.5)] rounded-full bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.7))]"
        />
        {sparkle ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-[calc(var(--glow-progress-h)*0.5)] size-0"
          >
            <span className="glow-progress-halo absolute top-1/2 left-1/2 size-[calc(var(--glow-progress-h)*3)] -translate-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-progress-glow)_0%,transparent_68%)]" />
            <svg
              viewBox="0 0 24 24"
              className="glow-progress-sparkle absolute top-1/2 left-1/2 size-[calc(var(--glow-progress-h)*0.95)] -translate-1/2 fill-white drop-shadow-[0_0_4px_rgb(255_255_255/0.9)]"
            >
              <path d={SPARKLE_PATH} />
            </svg>
          </span>
        ) : null}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}
