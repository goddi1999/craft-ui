import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'

import {
  BAR_OVERSHOOT,
  BAR_SPRING,
  BAR_STAGGER_MS,
  EYE_SPRING,
  PUPIL_HIDDEN,
  SLASH_LENGTH,
  WORD_RISE,
  WORD_SPRING,
} from './password-strength.constants'
import { clamp, springFor } from './password-strength.utils'

export function StrengthBar({
  filled,
  index,
  color,
  reduced,
}: {
  filled: boolean
  index: number
  color: string
  reduced: boolean
}) {
  const fill = useMotionValue(0)
  const width = useTransform(fill, (v) => `${clamp(v, 0, BAR_OVERSHOOT) * 100}%`)

  // each bar waits a beat after the one before, so they fill (and empty) left to right
  useEffect(() => {
    const timer = window.setTimeout(
      () => animate(fill, filled ? 1 : 0, springFor(BAR_SPRING, reduced)),
      index * BAR_STAGGER_MS,
    )
    return () => window.clearTimeout(timer)
  }, [filled, index, reduced, fill])

  // stopped only on unmount, so a quick re-type keeps the bar's speed instead of freezing it
  useEffect(() => () => fill.stop(), [fill])

  return (
    <span className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-foreground/[0.14]">
      <motion.span
        className={cn('absolute inset-y-0 left-0 rounded-full', color)}
        style={{ width }}
      />
    </span>
  )
}

export function StrengthWord({
  id,
  score,
  word,
  color,
  reduced,
}: {
  id: string
  score: number
  word: string
  color: string
  reduced: boolean
}) {
  const rise = useMotionValue(0)
  const opacity = useTransform(rise, (v) => clamp(v, 0, 1))
  const y = useTransform(rise, (v) => (1 - clamp(v, 0, 1)) * WORD_RISE)

  // every new score rises in from below, even mid-rise
  useEffect(() => {
    rise.jump(0)
    const controls = animate(rise, 1, springFor(WORD_SPRING, reduced))
    return () => controls.stop()
  }, [score, reduced, rise])

  return (
    <motion.span
      id={id}
      aria-live="polite"
      className={cn('font-semibold', color)}
      style={{ opacity, y }}
    >
      {word}
    </motion.span>
  )
}

export function EyeToggle({
  visible,
  controls,
  reduced,
  onToggle,
}: {
  visible: boolean
  controls: string
  reduced: boolean
  onToggle: () => void
}) {
  const open = useMotionValue(visible ? 1 : 0)
  const slashOffset = useTransform(open, (v) => SLASH_LENGTH * clamp(v, 0, 1))
  const pupil = useTransform(open, (v) => PUPIL_HIDDEN + (1 - PUPIL_HIDDEN) * clamp(v, 0, 1))

  useEffect(() => {
    animate(open, visible ? 1 : 0, springFor(EYE_SPRING, reduced))
  }, [visible, reduced, open])

  useEffect(() => () => open.stop(), [open])

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      aria-controls={controls}
      className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[22px]"
      >
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
        <motion.circle
          cx="12"
          cy="12"
          r="2.8"
          style={{ scale: pupil, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        {/* drawn while hidden, wiped away when shown */}
        <motion.path
          d="M4.5 4.5l15 15"
          style={{ strokeDasharray: SLASH_LENGTH, strokeDashoffset: slashOffset }}
        />
      </svg>
    </button>
  )
}
