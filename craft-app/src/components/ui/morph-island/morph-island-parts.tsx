import type { ReactNode } from 'react'
import { Phone, Timer, X } from 'lucide-react'
import { motion, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  ACCEPT_COLOR,
  CONTENT_BLUR,
  CONTENT_IN,
  CONTENT_OUT,
  CONTENT_SCALE,
  CONTENT_WIDTHS,
  ORB_BACKGROUND,
  RING_LENGTH,
  TIMER_COLOR,
  UPLOAD_RING_COLOR,
  UPLOAD_TEXT_COLOR,
} from './morph-island.constants'

const SHOWN = { opacity: 1, filter: 'blur(0px)', scale: 1, transition: CONTENT_IN }
const HIDDEN = { opacity: 0, filter: CONTENT_BLUR, scale: CONTENT_SCALE, transition: CONTENT_OUT }
// reduced motion keeps the cross-fade and drops the blur and the scale
const HIDDEN_REDUCED = { opacity: 0, transition: CONTENT_OUT }

const NUMBER = 'text-sm font-semibold tracking-[-0.01em] tabular-nums'

const CALL_BUTTON =
  'pointer-events-auto grid size-11 shrink-0 cursor-pointer place-items-center rounded-full outline-none transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.88] motion-reduce:active:scale-100'

/** One activity's content, centred on the island and cross-fading with blur. */
function IslandLayer({
  active,
  width,
  reduced,
  className,
  children,
}: {
  active: boolean
  width: number
  reduced: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <motion.div
      // hidden layers drop out of the tab order and the accessibility tree
      inert={!active}
      className={cn(
        'pointer-events-none absolute top-1/2 left-1/2 flex items-center whitespace-nowrap',
        className,
      )}
      style={{ width, x: '-50%', y: '-50%' }}
      initial={false}
      animate={active ? SHOWN : reduced ? HIDDEN_REDUCED : HIDDEN}
    >
      {children}
    </motion.div>
  )
}

export function TimerContent({
  active,
  reduced,
  label,
  clock,
}: {
  active: boolean
  reduced: boolean
  label: string
  clock: MotionValue<string>
}) {
  return (
    <IslandLayer
      active={active}
      reduced={reduced}
      width={CONTENT_WIDTHS.timer}
      className="justify-between"
    >
      <span className={cn('flex items-center gap-[7px] text-[13px] font-medium', TIMER_COLOR)}>
        <Timer className="size-4 shrink-0" strokeWidth={2.2} aria-hidden />
        {label}
      </span>
      <motion.span className={cn(NUMBER, TIMER_COLOR)}>{clock}</motion.span>
    </IslandLayer>
  )
}

export function UploadContent({
  active,
  reduced,
  label,
  file,
  percent,
  dashOffset,
}: {
  active: boolean
  reduced: boolean
  label: string
  file: string
  percent: MotionValue<string>
  dashOffset: MotionValue<number>
}) {
  return (
    <IslandLayer
      active={active}
      reduced={reduced}
      width={CONTENT_WIDTHS.upload}
      className="gap-3"
    >
      {/* the ring is the animated thing, so it stays an svg */}
      <svg viewBox="0 0 32 32" className="size-8 shrink-0 -rotate-90" aria-hidden>
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          strokeWidth={3.5}
          className="stroke-foreground/[0.14]"
        />
        <motion.circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          className={UPLOAD_RING_COLOR}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-foreground">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{file}</span>
      </span>
      <motion.span className={cn(NUMBER, UPLOAD_TEXT_COLOR)}>{percent}</motion.span>
    </IslandLayer>
  )
}

export function CallContent({
  active,
  reduced,
  name,
  detail,
  avatar,
  onAccept,
  onDecline,
}: {
  active: boolean
  reduced: boolean
  name: string
  detail: string
  avatar: ReactNode
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <IslandLayer
      active={active}
      reduced={reduced}
      width={CONTENT_WIDTHS.call}
      className="gap-3"
    >
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full [&>img]:size-full [&>img]:object-cover"
        style={avatar === undefined ? { background: ORB_BACKGROUND } : undefined}
      >
        {avatar}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-foreground">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">{detail}</span>
      </span>
      <button
        type="button"
        aria-label="Decline"
        onClick={onDecline}
        className={cn(CALL_BUTTON, 'bg-foreground/[0.14] text-foreground')}
      >
        <X className="size-5" strokeWidth={2.2} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Accept"
        onClick={onAccept}
        className={cn(CALL_BUTTON, ACCEPT_COLOR)}
      >
        <Phone className="size-5" fill="currentColor" strokeWidth={1.5} aria-hidden />
      </button>
    </IslandLayer>
  )
}
