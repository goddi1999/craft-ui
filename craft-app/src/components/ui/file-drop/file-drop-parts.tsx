import { useContext, useEffect, useEffectEvent, type ReactNode } from 'react'
import {
  AnimatePresence,
  PresenceContext,
  animate,
  motion,
  useMotionValue,
  usePresence,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'
import { ArrowUp, File } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  ARROW_RISE,
  BOB_HEIGHT,
  CHECK_LENGTH,
  CIRCUMFERENCE,
  DONE_GREEN,
  LEAN,
  LIFT_RISE,
  LINE_SHIFT,
  LINE_SPRING,
  MAX_LEAN,
  RING_RADIUS,
} from './file-drop.constants'
import { clamp, clamp01, formatBytes, lineOpacity, settle } from './file-drop.utils'
import type { ChipValues, DropValues } from './use-drop-motion'

/** The circle: arrow while idle, a ring around a rolling percentage while uploading, a green check when done. */
export function DropCore({ values }: { values: DropValues }) {
  const { lift, circle, arrow, bob, percent, ring, flood, check, progress } = values
  const y = useTransform(lift, (h) => LIFT_RISE * h)
  const arrowY = useTransform(
    [bob, lift, arrow],
    ([b, h, a]: number[]) =>
      -BOB_HEIGHT * clamp01(h) * (0.5 + 0.5 * Math.sin(b)) + (1 - a) * ARROW_RISE,
  )
  const arrowScale = useTransform(arrow, (a) => 0.6 + 0.4 * a)
  const arrowOpacity = useTransform(arrow, clamp01)
  const percentScale = useTransform(percent, (p) => 0.7 + 0.3 * p)
  const percentOpacity = useTransform(percent, clamp01)
  const percentText = useTransform(progress, (p) => String(Math.round(p * 100)))
  const ringOpacity = useTransform(ring, clamp01)
  const ringOffset = useTransform(progress, (p) => CIRCUMFERENCE * (1 - p))
  const floodScale = useTransform(flood, (g) => Math.max(0, g))
  // the check shows quickly, then draws over the rest of its spring
  const checkOpacity = useTransform(check, (k) => clamp01(k * 4))
  const checkOffset = useTransform(check, (k) => CHECK_LENGTH * (1 - clamp01(k)))

  return (
    <motion.span
      className="absolute top-[38px] left-1/2 z-1 -ml-9 size-18 rounded-full bg-foreground/[0.09]"
      style={{ y, scale: circle }}
    >
      <motion.span
        className={cn('absolute inset-0 rounded-full', DONE_GREEN)}
        style={{ scale: floodScale }}
      />
      <motion.svg
        viewBox="0 0 72 72"
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        className="absolute inset-0 size-full -rotate-90"
        style={{ opacity: ringOpacity }}
      >
        <circle cx={36} cy={36} r={RING_RADIUS} className="stroke-foreground/[0.14]" />
        <motion.circle
          cx={36}
          cy={36}
          r={RING_RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          className="stroke-primary"
          style={{ strokeDashoffset: ringOffset }}
        />
      </motion.svg>
      <motion.span
        className="absolute inset-0 grid place-items-center"
        style={{ y: arrowY, scale: arrowScale, opacity: arrowOpacity }}
      >
        <ArrowUp className="size-[26px]" strokeWidth={2} />
      </motion.span>
      <motion.span
        className="absolute inset-0 grid place-items-center text-[19px] font-semibold tracking-[-0.02em] tabular-nums"
        style={{ scale: percentScale, opacity: percentOpacity }}
      >
        {percentText}
      </motion.span>
      <motion.span
        className="absolute inset-0 grid place-items-center text-black"
        style={{ opacity: checkOpacity }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[30px]"
        >
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            strokeDasharray={CHECK_LENGTH}
            style={{ strokeDashoffset: checkOffset }}
          />
        </svg>
      </motion.span>
    </motion.span>
  )
}

function LineText({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const [isPresent, safeToRemove] = usePresence()
  // the first line is already in place; every later one rises in from below
  const appear = useContext(PresenceContext)?.initial !== false
  const position = useMotionValue(appear ? 1 : 0)
  const y = useTransform(position, (p) => p * LINE_SHIFT)
  const opacity = useTransform(position, lineOpacity)
  const handleGone = useEffectEvent(() => safeToRemove?.())

  useEffect(() => {
    const spring = settle(LINE_SPRING, reduced)
    const controls = isPresent
      ? animate(position, 0, spring)
      : animate(position, -1, { ...spring, onComplete: () => handleGone() })
    return () => controls.stop()
  }, [isPresent, reduced, position])

  return (
    <motion.span className="absolute inset-x-0 top-0 truncate" style={{ y, opacity }}>
      {children}
    </motion.span>
  )
}

/** One status line. A new `lineKey` rolls the old text up and out as the new text rises in. */
export function StatusLine({
  lineKey,
  reduced,
  className,
  children,
}: {
  lineKey: string
  reduced: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute inset-x-4 z-1 overflow-hidden text-center', className)}
    >
      <AnimatePresence initial={false}>
        <LineText key={lineKey} reduced={reduced}>
          {children}
        </LineText>
      </AnimatePresence>
    </span>
  )
}

export function UploadBytes({ progress, size }: { progress: MotionValue<number>; size: number }) {
  const text = useTransform(progress, (p) => `${formatBytes(p * size)} of ${formatBytes(size)}`)
  return <motion.span>{text}</motion.span>
}

/** The sample file autoplay carries in; it leans with its sideways speed. */
export function FileChip({
  name,
  chip,
  reduced,
}: {
  name: string
  chip: ChipValues
  reduced: boolean
}) {
  const velocity = useVelocity(chip.x)
  const rotate = useTransform(velocity, (v) => (reduced ? 0 : clamp(v * LEAN, -MAX_LEAN, MAX_LEAN)))
  const scale = useTransform(chip.scale, (s) => Math.max(0, s))
  const opacity = useTransform(chip.opacity, clamp01)

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute top-[74px] left-1/2 z-2 flex h-11 -translate-1/2 items-center gap-2 rounded-xl bg-foreground pr-4 pl-3 text-[13px] font-semibold whitespace-nowrap text-background"
      style={{ x: chip.x, y: chip.y, rotate, scale, opacity }}
    >
      <File className="size-5 shrink-0" strokeWidth={1.9} />
      {name}
    </motion.span>
  )
}
