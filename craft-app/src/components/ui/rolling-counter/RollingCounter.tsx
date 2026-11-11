import { AnimatePresence, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import {
  RollingCounterDigit,
  RollingCounterFixed,
  RollingCounterMark,
  type SlotProps,
} from './rolling-counter-parts'
import type { RollingCounterProps } from './rolling-counter.types'
import { INSTANT, format, measure, spring, toCells } from './rolling-counter.utils'

/**
 * A number whose digits roll like an odometer: each column spins the short
 * way to its new face on a spring, places fade in and out, and the whole
 * thing re-flows with layout animation. Screen readers get the plain value.
 */
export function RollingCounter({
  value,
  decimals = 0,
  duration = 0.6,
  padStart = 1,
  separator = ',',
  decimalSeparator = '.',
  grouping = 'western',
  prefix,
  suffix,
  className,
  ...props
}: RollingCounterProps) {
  const reduced = useReducedMotion() ?? false

  const shape = measure(value, decimals, padStart, duration)
  const chars = format(shape, separator, decimalSeparator, grouping)
  const cells = toCells(chars, shape.width)
  const negative = shape.amount < 0 && shape.scaled > 0

  // direction of travel, derived during render from the previous value
  const [previous, setPrevious] = useState(shape.amount)
  const [dir, setDir] = useState(1)
  if (previous !== shape.amount) {
    setDir(shape.amount >= previous ? 1 : -1)
    setPrevious(shape.amount)
  }

  // faces at mount; a place that appears later starts from 0 and rolls in
  const [seed] = useState(() => {
    const faces: Record<number, number> = {}
    for (const cell of cells) {
      if (cell.kind === 'digit') faces[cell.key] = cell.digit
    }
    return faces
  })

  const slot: SlotProps = {
    reduced,
    dep: chars.length,
    shift: reduced ? INSTANT : spring(shape.pace),
  }

  return (
    <span
      data-slot="rolling-counter"
      className={cn('inline-flex items-center tabular-nums', className)}
      {...props}
    >
      {prefix != null ? <RollingCounterFixed {...slot}>{prefix}</RollingCounterFixed> : null}

      <span className="sr-only">
        {negative ? '-' : ''}
        {chars}
      </span>

      <span aria-hidden="true" className="inline-flex items-center select-none">
        {negative ? <RollingCounterFixed {...slot}>-</RollingCounterFixed> : null}
        <AnimatePresence mode="popLayout" initial={false}>
          {cells.map((cell) =>
            cell.kind === 'digit' ? (
              <RollingCounterDigit
                key={cell.key}
                {...slot}
                digit={cell.digit}
                from={seed[cell.key] ?? 0}
                dir={dir}
                duration={shape.pace}
              />
            ) : (
              <RollingCounterMark key={cell.key} {...slot} char={cell.char} />
            ),
          )}
        </AnimatePresence>
      </span>

      {suffix != null ? <RollingCounterFixed {...slot}>{suffix}</RollingCounterFixed> : null}
    </span>
  )
}
