// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { RollingNumberDigit } from './rolling-number-parts'
import type { RollingNumberProps } from './rolling-number.types'
import { DIGITS } from './rolling-number.utils'

/**
 * Odometer-style number: each digit rolls to its new value on its own wheel,
 * the rightmost first. Characters are keyed from the right, so units and
 * separators ("k", "%", "$") stay put while the digits change.
 */
export function RollingNumber({
  value,
  format,
  stagger = 24,
  className,
}: RollingNumberProps) {
  const reduce = useReducedMotion()
  const text =
    typeof value === 'number'
      ? format
        ? format(value)
        : value.toLocaleString('en-US')
      : value
  const chars = Array.from(text)

  return (
    <span data-slot="rolling-number" className={cn('inline-flex tabular-nums', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, i) => {
          const fromRight = chars.length - 1 - i
          return DIGITS.includes(char) ? (
            <RollingNumberDigit
              key={fromRight}
              digit={Number(char)}
              delay={reduce ? 0 : fromRight * stagger}
              instant={!!reduce}
            />
          ) : (
            <span key={`${fromRight}${char}`} className="whitespace-pre">
              {char}
            </span>
          )
        })}
      </span>
    </span>
  )
}
