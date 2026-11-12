import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import {
  CONTENT_REVEAL,
  DEFAULT_SCAN_DURATION,
  DEFAULT_SIZE,
  EASE_IN_OUT,
  EASE_OUT,
  INSTANT,
  MESSAGE_TONE,
  SCAN_CLIP,
  SHAKE_DURATION,
  SHAKE_KEYFRAMES,
  STATUS_MESSAGES,
  TONE,
  VIEWBOX,
} from './unlock-face-id.constants'
import type { UnlockFaceIdProps, UnlockStatus } from './unlock-face-id.types'
import { CheckGlyph, FaceGlyph } from './unlock-face-id-parts'

/**
 * A Face ID unlock: the mark draws itself in, a scan band sweeps the face, and
 * it either shakes on a miss or turns into a check and unblurs what it guards.
 */
export function UnlockFaceId({
  children,
  status: statusProp,
  defaultStatus = 'idle',
  onStatusChange,
  onScan,
  onComplete,
  scanDuration = DEFAULT_SCAN_DURATION,
  size = DEFAULT_SIZE,
  label = 'Scan to unlock',
  errorMessage = 'Face not recognized. Try again.',
  className,
  ...props
}: UnlockFaceIdProps) {
  const animated = !useReducedMotion()
  const isControlled = statusProp !== undefined
  const [internalStatus, setInternalStatus] = useState(defaultStatus)
  const status = isControlled ? statusProp : internalStatus
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  // useId can hold characters that break url(#id) references
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const messageId = `unlock-face-id-status-${uid}`
  const clipId = `unlock-face-id-clip-${uid}`
  const gradientId = `unlock-face-id-gradient-${uid}`

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const setStatus = (next: UnlockStatus) => {
    if (!isControlled) setInternalStatus(next)
    onStatusChange?.(next)
  }

  const handleClick = () => {
    // after a miss, a press resets to idle; the next one scans again
    if (status === 'error') {
      onScan?.()
      setStatus('idle')
      return
    }
    if (status !== 'idle') return
    onScan?.()
    setStatus('scanning')
    // controlled: you decide how the scan ends
    if (isControlled) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setStatus('success')
      onComplete?.()
    }, scanDuration)
  }

  const scanning = status === 'scanning'
  const unlocked = status === 'success'
  const message = status === 'error' ? errorMessage : STATUS_MESSAGES[status]

  return (
    <div
      data-slot="unlock-face-id"
      className={cn('flex w-full flex-col items-center gap-4', className)}
      {...props}
    >
      <button
        type="button"
        aria-busy={scanning}
        aria-describedby={messageId}
        aria-label={label}
        disabled={scanning || unlocked}
        onClick={handleClick}
        className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-3xl text-foreground outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-[0.97] disabled:cursor-default disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100"
        style={{ width: size, height: size }}
      >
        <motion.svg
          aria-hidden
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className="size-full overflow-visible"
          animate={{ x: status === 'error' && animated ? SHAKE_KEYFRAMES : 0 }}
          transition={animated ? { duration: SHAKE_DURATION, ease: EASE_IN_OUT } : INSTANT}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                height={SCAN_CLIP.height}
                rx={SCAN_CLIP.rx}
                width={SCAN_CLIP.width}
                x={SCAN_CLIP.x}
                y={SCAN_CLIP.y}
              />
            </clipPath>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.45} />
            </linearGradient>
          </defs>

          <AnimatePresence mode="wait">
            {unlocked ? (
              <CheckGlyph key="check" animated={animated} />
            ) : (
              <FaceGlyph
                key="face"
                animated={animated}
                clipId={clipId}
                gradientId={gradientId}
                scanning={scanning}
                tone={TONE[status]}
              />
            )}
          </AnimatePresence>
        </motion.svg>
      </button>

      <p
        id={messageId}
        role="status"
        aria-live="polite"
        className={cn(
          'text-center text-sm font-medium transition-colors duration-200',
          MESSAGE_TONE[status],
        )}
      >
        {message}
      </p>

      {children ? (
        <motion.div
          className={cn('w-full', !unlocked && 'pointer-events-none')}
          // locked content stays out of the tab order and the accessibility tree
          inert={!unlocked}
          initial={false}
          animate={{
            filter: unlocked ? 'blur(0px)' : 'blur(9px)',
            opacity: unlocked ? 1 : 0.5,
          }}
          transition={animated ? { duration: CONTENT_REVEAL, ease: EASE_OUT } : INSTANT}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  )
}
