import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Transition,
} from 'motion/react'
import { memo, useEffect, useRef, type ReactNode, type Ref } from 'react'

import { INSTANT, mod, spring } from './rolling-counter.utils'

const FACES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// the trailing 0 makes the wrap from 9 back to 0 land on an identical face
const WHEEL = [...FACES, 0]
// the air around each face is what the mask fades through, so a resting digit stays solid
const LINE = 1.5
// eased rather than linear; a linear fade of the same width reads as a hard edge
const FADE = `linear-gradient(to bottom,
  rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 5.5%, rgba(0,0,0,0.5) 11%, rgba(0,0,0,0.94) 16.5%,
  #000 22%, #000 78%,
  rgba(0,0,0,0.94) 83.5%, rgba(0,0,0,0.5) 89%, rgba(0,0,0,0.06) 94.5%, rgba(0,0,0,0) 100%)`

const EASE = [0.22, 1, 0.36, 1] as const
const LEAVE = { duration: 0.18, ease: EASE } as const

// built once so React skips reconciling 21 spans per digit on every change
const SIZER = FACES.map((face) => (
  <span key={face} aria-hidden="true" className="invisible [grid-area:1/1]">
    {face}
  </span>
))

const STACK = WHEEL.map((face, index) => (
  <span
    key={index}
    className="flex items-center justify-center"
    style={{ height: `${LINE}em` }}
  >
    {face}
  </span>
))

export type SlotProps = {
  reduced: boolean
  dep: number
  shift: Transition
}

const shifts = ({ reduced, dep, shift }: SlotProps) => ({
  layout: !reduced,
  layoutDependency: dep,
  transition: shift,
})

const fades = (reduced: boolean) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: reduced ? INSTANT : LEAVE },
})

function useWheel(from: number, digit: number, dir: number, duration: number, reduced: boolean) {
  const pos = useMotionValue(from)
  const goal = useRef(from)

  // read, not depended on: a reversal alone must not restart every column
  const heading = useRef(dir)
  useEffect(() => {
    heading.current = dir
  }, [dir])

  useEffect(() => {
    if (reduced) {
      goal.current = digit
      pos.set(digit)
      return
    }
    // re-aim only when the face changed, or a reversal sends the wheel the long way round
    if (mod(goal.current, 10) !== digit) {
      // aim from where the wheel is, so a moving value never queues up a backlog of turns
      const at = pos.get()
      goal.current =
        heading.current < 0 ? at - mod(at - digit, 10) : at + mod(digit - at, 10)
    }
    const roll = animate(pos, goal.current, spring(duration))
    return () => roll.stop()
  }, [digit, duration, reduced, pos])

  return useTransform(pos, (p) => `${(-mod(p, 10) * 100) / WHEEL.length}%`)
}

/** Prefix, suffix or minus sign — slides with layout, never rolls. */
export function RollingCounterFixed({ children, ...slot }: SlotProps & { children: ReactNode }) {
  return (
    <motion.span {...shifts(slot)} className="inline-block">
      {children}
    </motion.span>
  )
}

/** A separator, fading in and out as places come and go. */
export function RollingCounterMark({
  char,
  ref,
  ...slot
}: SlotProps & { char: string; ref?: Ref<HTMLSpanElement> }) {
  return (
    <motion.span
      ref={ref}
      data-slot="rolling-counter-mark"
      {...shifts(slot)}
      {...fades(slot.reduced)}
      className="inline-block"
    >
      {char}
    </motion.span>
  )
}

/** One digit column: a 0–9 wheel that rolls to its face on a spring. */
export const RollingCounterDigit = memo(function RollingCounterDigit({
  digit,
  from,
  dir,
  duration,
  ref,
  ...slot
}: SlotProps & {
  digit: number
  from: number
  dir: number
  duration: number
  // popLayout measures the leaving column through this
  ref?: Ref<HTMLSpanElement>
}) {
  const y = useWheel(from, digit, dir, duration, slot.reduced)

  return (
    <motion.span
      ref={ref}
      data-slot="rolling-counter-digit"
      {...shifts(slot)}
      {...fades(slot.reduced)}
      className="relative inline-grid overflow-hidden"
      style={{ height: `${LINE}em`, lineHeight: LINE, maskImage: FADE, WebkitMaskImage: FADE }}
    >
      {/* widest-face width, for fonts with no tabular figures */}
      {SIZER}
      <motion.span style={{ y }} className="absolute inset-x-0 top-0">
        {STACK}
      </motion.span>
    </motion.span>
  )
})
