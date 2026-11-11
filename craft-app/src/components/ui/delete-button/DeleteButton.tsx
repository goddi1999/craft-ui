import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { DeleteButtonBin, DeleteButtonCircle, DeleteButtonDone } from './delete-button-parts'
import {
  CHECK_PATH,
  DEFAULT_ACCENT,
  FOCUS,
  HOLD,
  INSTANT,
  LID,
  PANEL,
  RECESS,
  SETTLE,
  SWAP,
  TAP,
  TILE,
  WALL,
  WALL_BASE,
  WALL_TOP,
  WALL_TOP_OPEN,
  WIDTH,
  panelMotion,
} from './delete-button.constants'
import type { DeleteButtonProps, DeleteButtonStatus } from './delete-button.types'

/**
 * A delete button that asks for confirmation in place, no dialog needed.
 * Clicking the bin lifts its lid and slides out a confirm/cancel panel;
 * confirming draws a check where the bin was, backing out settles the bin.
 */
export function DeleteButton({
  className,
  onConfirm,
  onCancel,
  onKeyDown,
  accentColor = DEFAULT_ACCENT,
  ...props
}: DeleteButtonProps) {
  const reduced = useReducedMotion() ?? false
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<DeleteButtonStatus>('idle')
  const trigger = useRef<HTMLButtonElement>(null)
  const timing = (transition: Transition) => (reduced ? INSTANT : transition)

  const top = useMotionValue(WALL_TOP)
  const wall = useTransform(top, (y) => WALL_BASE - y)
  const bin = useMotionTemplate`M19 ${top}v${wall}a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V${top}`
  const settle = useMotionValue(1)

  useEffect(() => {
    const walls = animate(top, isOpen ? WALL_TOP_OPEN : WALL_TOP, reduced ? INSTANT : WALL)
    return () => walls.stop()
  }, [isOpen, reduced, top])

  useEffect(() => {
    if (status === 'idle') return
    const nudge = status === 'kept' && !reduced ? animate(settle, [1, 0.86, 1], SETTLE) : null
    const done = setTimeout(() => setStatus('idle'), HOLD[status])
    return () => {
      nudge?.stop()
      clearTimeout(done)
    }
  }, [status, reduced, settle])

  const resolve = (next: Exclude<DeleteButtonStatus, 'idle'>) => {
    setIsOpen(false)
    setStatus(next)
    trigger.current?.focus()
    ;(next === 'deleted' ? onConfirm : onCancel)?.()
  }

  const handleTriggerClick = () => {
    if (isOpen) return resolve('kept')
    setStatus('idle')
    setIsOpen(true)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.key === 'Escape' && isOpen) resolve('kept')
  }

  return (
    <motion.div
      data-slot="delete-button"
      data-state={isOpen ? 'open' : 'closed'}
      data-status={status}
      className={cn('relative h-12 rounded-2xl bg-muted text-muted-foreground', className)}
      animate={{ width: isOpen ? TILE + PANEL : TILE }}
      transition={timing(WIDTH)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <motion.button
        ref={trigger}
        type="button"
        aria-label="Delete"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        transition={TAP}
        className={cn('relative z-10 grid size-12 place-items-center rounded-2xl', FOCUS)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === 'deleted' ? (
            <DeleteButtonDone
              key="done"
              color={accentColor}
              swap={timing(SWAP)}
              reduced={reduced}
            />
          ) : (
            <DeleteButtonBin
              key="bin"
              d={bin}
              scale={settle}
              isOpen={isOpen}
              swap={timing(SWAP)}
              lid={timing(LID)}
            />
          )}
        </AnimatePresence>
      </motion.button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === 'deleted' ? 'Deleted' : status === 'kept' ? 'Kept' : ''}
      </span>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="panel"
            data-slot="delete-button-panel"
            style={{ width: PANEL }}
            className={cn(
              'absolute inset-y-0 right-0 flex items-center justify-center gap-2 rounded-2xl',
              RECESS,
            )}
            variants={reduced ? undefined : panelMotion}
            initial="hidden"
            animate="shown"
            exit="hidden"
          >
            {/* the notch points back at the bin the panel came out of */}
            <span
              aria-hidden
              className={cn(
                'absolute top-1/2 -left-1.25 z-20 h-2.5 w-1.5 -translate-y-1/2 [clip-path:polygon(100%_0,0_50%,100%_100%)]',
                RECESS,
              )}
            />
            <DeleteButtonCircle label="Confirm delete" onClick={() => resolve('deleted')}>
              <path d={CHECK_PATH} stroke={accentColor} />
            </DeleteButtonCircle>
            <DeleteButtonCircle label="Cancel" onClick={() => resolve('kept')}>
              <path d="M6 6 18 18M18 6 6 18" />
            </DeleteButtonCircle>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
