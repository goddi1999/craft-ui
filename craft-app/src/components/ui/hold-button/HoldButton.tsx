import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CHECK_COLOR,
  CHECK_DRAW,
  CHECK_FADE,
  DONE_MS,
  DONE_SURFACE,
  HOLD_MS,
  INSTANT,
  WIDTH,
} from './hold-button.constants'
import type { HoldButtonProps } from './hold-button.types'
import { chain } from './hold-button.utils'
import { useHold } from './use-hold'

const LABEL =
  'pointer-events-none absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap transition-[opacity,filter] duration-200 ease-[ease] [&_svg]:size-[18px] [&_svg]:shrink-0'
const LABEL_GONE = 'opacity-0 blur-[4px]'

/**
 * A pill you press and hold to confirm. The fill sweeps in with the label inverting under it;
 * let go early and it springs back with a shake, hold to the end and it morphs into a check.
 */
export function HoldButton({
  children,
  icon,
  doneLabel = 'Done',
  duration = HOLD_MS,
  doneDuration = DONE_MS,
  width = WIDTH,
  onComplete,
  className,
  style,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onBlur,
  onKeyDown,
  onKeyUp,
  onContextMenu,
  ...props
}: HoldButtonProps) {
  const reduced = useReducedMotion() === true
  const hold = useHold({ duration, doneDuration, width, reduced, onComplete })
  const { done, handlers } = hold

  const label = (
    <>
      {icon}
      {children}
    </>
  )

  return (
    <motion.button
      type="button"
      data-slot="hold-button"
      data-state={done ? 'done' : 'idle'}
      className={cn(
        'relative h-14 shrink-0 cursor-pointer touch-none overflow-hidden rounded-full p-0 text-sm font-medium tracking-[-0.01em] outline-none select-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        done ? DONE_SURFACE : 'bg-muted',
        className,
      )}
      style={{ ...style, width: hold.pillWidth, x: hold.x, scale: hold.scale }}
      onPointerDown={chain(onPointerDown, handlers.onPointerDown)}
      onPointerUp={chain(onPointerUp, handlers.onPointerUp)}
      onPointerCancel={chain(onPointerCancel, handlers.onPointerCancel)}
      onLostPointerCapture={chain(onLostPointerCapture, handlers.onLostPointerCapture)}
      onBlur={chain(onBlur, handlers.onBlur)}
      onKeyDown={chain(onKeyDown, handlers.onKeyDown)}
      onKeyUp={chain(onKeyUp, handlers.onKeyUp)}
      onContextMenu={chain(onContextMenu, handlers.onContextMenu)}
      {...props}
    >
      <span aria-hidden={done} className={cn(LABEL, 'text-foreground', done && LABEL_GONE)}>
        {label}
      </span>
      <motion.span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 rounded-[inherit] bg-primary',
          done && 'opacity-0',
        )}
        style={{ width: hold.fillWidth }}
      />
      <motion.span
        aria-hidden
        className={cn(LABEL, 'text-primary-foreground', done && LABEL_GONE)}
        style={{ clipPath: hold.clipPath }}
      >
        {label}
      </motion.span>
      <motion.svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'pointer-events-none absolute top-1/2 left-1/2 size-[26px] -translate-x-1/2 -translate-y-1/2',
          CHECK_COLOR,
        )}
        initial={false}
        animate={{ opacity: done ? 1 : 0 }}
        transition={done ? CHECK_FADE : INSTANT}
      >
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={false}
          animate={{ pathLength: done ? 1 : 0 }}
          transition={done ? CHECK_DRAW : INSTANT}
        />
      </motion.svg>
      <span role="status" className="sr-only">
        {done ? doneLabel : ''}
      </span>
    </motion.button>
  )
}
