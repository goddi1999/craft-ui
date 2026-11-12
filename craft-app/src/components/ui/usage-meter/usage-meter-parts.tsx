import { CircleAlert, TriangleAlert } from 'lucide-react'
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  BADGE_ICON_TONES,
  BADGE_TONES,
  BLUR,
  COLUMN,
  DIGITS,
  FADE,
  FIT,
  GAP,
  INSTANT,
  POP,
  RISE,
  TURN,
} from './usage-meter.constants'
import type { Highlight, UsageStatus } from './usage-meter.types'
import { partsFor, segmentColor, soon, wheelOffset } from './usage-meter.utils'

/** Text that rises in from a soft blur whenever it changes. */
export function Swap({
  text,
  reduced,
  direction = 1,
}: {
  text: string
  reduced: boolean
  direction?: number
}) {
  return (
    <span className="relative block min-w-0">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={text}
          className="block truncate"
          custom={direction}
          variants={reduced ? FADE : RISE}
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** One digit on a wheel; its distance from the wheel position sets where and how clearly it shows. */
function Glyph({ position, digit }: { position: MotionValue<number>; digit: number }) {
  const offset = useTransform(position, (current) => wheelOffset(digit, current))
  const y = useTransform(offset, (current) => `${current}em`)
  const opacity = useTransform(offset, (current) => Math.max(0, 1 - Math.abs(current)))
  const filter = useTransform(offset, (current) => {
    const distance = Math.abs(current)
    return distance < 0.02 || distance >= 1 ? 'none' : `blur(${(distance * BLUR.subtle).toFixed(2)}px)`
  })

  return (
    <motion.span className="absolute inset-x-0 inset-y-[0.16em] text-center" style={{ y, opacity, filter }}>
      {digit}
    </motion.span>
  )
}

/** A digit wheel that turns the way the whole number moved, wrapping 9 → 0 like an odometer. */
function Column({ digit, direction, reduced }: { digit: number; direction: number; reduced: boolean }) {
  const position = useMotionValue(digit)
  const wheel = useRef({ digit, target: digit })
  const running = useRef<(() => void) | null>(null)

  useEffect(() => () => running.current?.(), [])
  useEffect(() => {
    const state = wheel.current
    if (state.digit === digit) return
    state.target +=
      direction < 0 ? -((state.digit - digit + 10) % 10) : (digit - state.digit + 10) % 10
    state.digit = digit
    running.current?.()
    if (reduced) {
      position.jump(state.target)
      running.current = null
      return
    }
    const target = state.target
    running.current = soon(() => animate(position, target, TURN))
  }, [digit, direction, position, reduced])

  // each wheel is clipped and feathers at its top and bottom edges
  return (
    <motion.span
      className="relative -my-[0.16em] inline-block overflow-hidden py-[0.16em] [mask-image:linear-gradient(to_bottom,transparent,#000_0.24em,#000_calc(100%-0.24em),transparent)]"
      {...COLUMN}
      transition={reduced ? INSTANT : FIT}
    >
      <span className="invisible">0</span>
      {DIGITS.map((item) => (
        <Glyph key={item} position={position} digit={item} />
      ))}
    </motion.span>
  )
}

/** A number that rolls to each new value. Decoration only; screen readers get text elsewhere. */
export function Ticker({
  value,
  decimals,
  reduced,
}: {
  value: number
  decimals: number
  reduced: boolean
}) {
  const [trend, setTrend] = useState({ value, direction: 1 })
  if (trend.value !== value) setTrend({ value, direction: value > trend.value ? 1 : -1 })

  return (
    <span
      className="relative inline-flex items-start whitespace-nowrap tabular-nums select-none"
      aria-hidden="true"
    >
      <AnimatePresence initial={false}>
        {partsFor(value, decimals).map((part) =>
          'digit' in part ? (
            <Column key={part.key} digit={part.digit} direction={trend.direction} reduced={reduced} />
          ) : (
            <motion.span
              key={part.key}
              className="inline-block overflow-x-clip"
              {...COLUMN}
              transition={reduced ? INSTANT : FIT}
            >
              {part.text}
            </motion.span>
          ),
        )}
      </AnimatePresence>
    </span>
  )
}

/** The plan status as a compact mark whose width springs to each message from the right edge. */
export function StatusBadge({
  status,
  text,
  reduced,
}: {
  status: UsageStatus
  text: string
  reduced: boolean
}) {
  const inner = useRef<HTMLSpanElement>(null)
  const width = useMotionValue<number | 'auto'>('auto')

  useLayoutEffect(() => {
    const node = inner.current
    if (!node || typeof ResizeObserver === 'undefined') return
    let measured = false
    const observer = new ResizeObserver(() => {
      const next = node.offsetWidth
      if (measured && !reduced) animate(width, next, FIT)
      else width.jump(next)
      measured = next > 0
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced, width])

  const Icon = status === 'over' ? TriangleAlert : CircleAlert

  return (
    <motion.span
      data-status={status}
      className={cn(
        'inline-flex h-7 flex-none justify-end overflow-hidden rounded-full text-xs leading-none font-medium transition-[background-color,color] duration-240 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
        BADGE_TONES[status],
      )}
      style={{ width }}
    >
      <span ref={inner} className="inline-flex flex-none items-center gap-1.5 px-3 whitespace-nowrap">
        <AnimatePresence mode="popLayout" initial={false}>
          {status !== 'ok' ? (
            <motion.span
              key={status}
              className={cn('grid place-items-center', BADGE_ICON_TONES[status])}
              variants={reduced ? FADE : POP}
              initial="hidden"
              animate="shown"
              exit="gone"
            >
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
            </motion.span>
          ) : null}
        </AnimatePresence>
        <Swap text={text} reduced={reduced} />
      </span>
    </motion.span>
  )
}

/** One category. It starts where the ones before it end, so growth anywhere pushes the rest along. */
export function Segment({
  index,
  amounts,
  span,
  width,
  highlight,
}: {
  index: number
  amounts: MotionValue<number>[]
  span: MotionValue<number>
  width: MotionValue<number>
  highlight: Highlight
}) {
  const x = useTransform(() => {
    let start = 0
    for (let at = 0; at < index; at++) start += amounts[at].get()
    return (start / span.get()) * width.get()
  })
  const scaleX = useTransform(() => {
    const total = width.get()
    if (!total) return 0
    const size = (amounts[index].get() / span.get()) * total
    const rest = total - x.get() - size
    return Math.max(0, size - Math.min(GAP, size, Math.max(0, rest))) / total
  })

  return (
    <motion.span
      data-index={index}
      data-highlight={highlight}
      className={cn(
        'absolute inset-0 transition-opacity duration-160 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
        segmentColor(index),
        highlight === 'off' && 'opacity-28',
      )}
      style={{ x, scaleX, originX: 0 }}
    />
  )
}
