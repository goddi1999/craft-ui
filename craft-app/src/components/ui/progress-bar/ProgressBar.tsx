// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { cn } from '@/lib/utils'

import type { BarSize, BarTone, ProgressBarProps } from './progress-bar.types'

const fills: Record<BarTone, string> = {
  brand: 'bg-primary',
  positive: 'bg-[oklch(0.65_0.17_150)] dark:bg-[oklch(0.74_0.17_150)]',
  negative: 'bg-[oklch(0.6_0.22_27)] dark:bg-[oklch(0.68_0.19_25)]',
  warning: 'bg-[oklch(0.76_0.16_75)] dark:bg-[oklch(0.8_0.15_80)]',
  neutral: 'bg-foreground/40',
}

const heights: Record<BarSize, string> = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

const STRIPES =
  'repeating-linear-gradient(-45deg, rgb(255 255 255 / 0.16) 0 3px, transparent 3px 7px)'
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

/**
 * Horizontal bar. The fill is revealed with clip-path instead of scaled, so
 * the stripe pattern never stretches while it animates.
 */
export function ProgressBar({
  value,
  max = 100,
  tone = 'brand',
  color,
  size = 'md',
  striped = false,
  kind = 'progress',
  label,
  valueText,
  className,
  ...props
}: ProgressBarProps) {
  const ratio = Math.min(Math.max(value / max, 0), 1)
  return (
    <div
      data-slot="progress-bar"
      role={kind === 'meter' ? 'meter' : 'progressbar'}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText ?? `${Math.round(ratio * 100)}%`}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-foreground/[0.07]',
        heights[size],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-[clip-path,background-color] duration-500 motion-reduce:transition-none',
          !color && fills[tone],
        )}
        style={{
          backgroundColor: color,
          clipPath: `inset(0 ${(1 - ratio) * 100}% 0 0 round 9999px)`,
          transitionTimingFunction: EASE,
          backgroundImage: striped ? STRIPES : undefined,
        }}
      />
    </div>
  )
}
