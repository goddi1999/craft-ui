import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  SPINNER_STYLE,
  SUCCESS_FILL,
  SUCCESS_MS,
  SUCCESS_TEXT,
  TICK_LENGTH,
} from './loading-success.constants'
import type { LoadingSuccessButtonProps, LoadingSuccessStatus } from './loading-success.types'
import { useStatusMorph } from './use-status-morph'

/**
 * A submit pill that closes into a round spinner while the work runs, then opens
 * into a green pill with a check that draws itself, and settles back.
 */
export function LoadingSuccessButton({
  action,
  status: statusProp,
  defaultStatus = 'idle',
  onStatusChange,
  children = 'Submit',
  successLabel = 'Done',
  loadingLabel = 'Loading',
  successDuration = SUCCESS_MS,
  className,
  style,
  onClick,
  ...props
}: LoadingSuccessButtonProps) {
  const reduced = useReducedMotion() ?? false
  const [innerStatus, setInnerStatus] = useState(defaultStatus)
  const isControlled = statusProp !== undefined
  const status = isControlled ? statusProp : innerStatus

  const labelRef = useRef<HTMLSpanElement>(null)
  const doneRef = useRef<HTMLSpanElement>(null)
  // a promise that settles after unmount, or after a newer run, must not move the status
  const run = useRef(0)
  const alive = useRef(true)
  const morph = useStatusMorph(status, reduced, labelRef, doneRef)

  const setStatus = (next: LoadingSuccessStatus) => {
    if (!isControlled) setInnerStatus(next)
    onStatusChange?.(next)
  }

  const settle = useEffectEvent(() => setStatus('idle'))

  useEffect(() => {
    if (status !== 'success' || !Number.isFinite(successDuration)) return
    const timer = window.setTimeout(settle, successDuration)
    return () => window.clearTimeout(timer)
  }, [status, successDuration])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const runAction = async (work: () => Promise<unknown>) => {
    run.current += 1
    const id = run.current
    setStatus('loading')
    try {
      await work()
      if (alive.current && id === run.current) setStatus('success')
    } catch {
      if (alive.current && id === run.current) setStatus('idle')
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    // busy clicks are ignored, like the source
    if (event.defaultPrevented || status !== 'idle' || !action) return
    void runAction(action)
  }

  const announcement =
    status === 'loading' ? loadingLabel : status === 'success' ? successLabel : null

  return (
    <motion.button
      type="button"
      data-slot="loading-success-button"
      data-status={status}
      aria-busy={status === 'loading'}
      aria-disabled={status !== 'idle' || undefined}
      className={cn(
        'relative inline-flex h-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-base font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-default',
        className,
      )}
      style={{ ...style, width: morph.width }}
      onClick={handleClick}
      {...props}
    >
      <motion.span
        aria-hidden
        className={cn('absolute inset-0', SUCCESS_FILL)}
        style={{ opacity: morph.tintOpacity }}
      />

      <motion.span
        // the label names the button while idle; otherwise the status line does
        aria-hidden={status !== 'idle'}
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
        style={{ opacity: morph.labelOpacity, y: morph.labelY }}
      >
        <span ref={labelRef} className="shrink-0">
          {children}
        </span>
      </motion.span>

      <motion.span
        aria-hidden
        className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6"
        style={{ opacity: morph.spinnerOpacity, scale: morph.spinnerScale }}
      >
        <span className="block size-full animate-spin rounded-full" style={SPINNER_STYLE} />
      </motion.span>

      <motion.span
        aria-hidden
        className={cn(
          'absolute inset-0 flex items-center justify-center whitespace-nowrap',
          SUCCESS_TEXT,
        )}
        style={{ opacity: morph.doneOpacity, y: morph.doneY }}
      >
        <span ref={doneRef} className="flex shrink-0 items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="size-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              strokeDasharray={TICK_LENGTH}
              style={{ strokeDashoffset: morph.tickOffset }}
            />
          </svg>
          {successLabel}
        </span>
      </motion.span>

      <span role="status" className="sr-only">
        {announcement}
      </span>
    </motion.button>
  )
}
