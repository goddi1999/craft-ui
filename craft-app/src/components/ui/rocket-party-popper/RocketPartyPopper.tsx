import { AnimatePresence, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { BURST_Y, LAUNCH_MS } from './rocket-party-popper.constants'
import type { RocketPartyPopperProps, RocketPartyStatus } from './rocket-party-popper.types'
import { Celebration, Launchpad } from './rocket-party-popper-parts'
import { useConfetti } from './use-confetti'

/**
 * A rocket idling on its launchpad. Launch it and it lifts off on a flame, bursts into confetti
 * past the edges of the box, and shows the milestone with a button to launch again. Reduced
 * motion skips the flight and the confetti and fades straight to the milestone.
 */
export function RocketPartyPopper({
  title,
  description,
  metric,
  triggerLabel = 'Launch celebration',
  confettiCount = 50,
  defaultLaunched = false,
  onLaunch,
  onReset,
  className,
  ...props
}: RocketPartyPopperProps) {
  const reduced = useReducedMotion() ?? false
  const [status, setStatus] = useState<RocketPartyStatus>(
    defaultLaunched ? 'celebrating' : 'idle',
  )
  // focus follows the swap only if it was inside, so a keyboard user is not dropped on the page
  const [refocus, setRefocus] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const launchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const { canvasRef, burst, clear } = useConfetti()

  useEffect(() => () => clearTimeout(launchTimer.current), [])

  const hasFocus = () => rootRef.current?.contains(document.activeElement) ?? false

  const launch = () => {
    if (status !== 'idle') return
    setRefocus(hasFocus())
    onLaunch?.()

    if (reduced) {
      setStatus('celebrating')
      return
    }

    setStatus('launching')
    launchTimer.current = setTimeout(() => {
      burst(confettiCount, BURST_Y)
      setStatus('celebrating')
    }, LAUNCH_MS)
  }

  const reset = () => {
    setRefocus(hasFocus())
    clearTimeout(launchTimer.current)
    clear()
    setStatus('idle')
    onReset?.()
  }

  const celebrating = status === 'celebrating'
  const announcement = [metric, title, description].filter(Boolean).join('. ') || 'Launched'

  return (
    <div
      ref={rootRef}
      data-slot="rocket-party-popper"
      data-state={status}
      className={cn('relative mx-auto w-full max-w-lg select-none', className)}
      {...props}
    >
      {/* bigger than the box, so the confetti flies past its edges */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute -inset-x-20 -top-32 -bottom-20 z-30 h-[calc(100%+208px)] w-[calc(100%+160px)] text-foreground"
      />

      <span role="status" className="sr-only">
        {celebrating ? announcement : ''}
      </span>

      <AnimatePresence mode="wait">
        {celebrating ? (
          <Celebration
            key="celebration"
            title={title}
            description={description}
            metric={metric}
            reduced={reduced}
            autoFocus={refocus}
            onReset={reset}
          />
        ) : (
          <Launchpad
            key="launchpad"
            launching={status === 'launching'}
            label={triggerLabel}
            reduced={reduced}
            autoFocus={refocus}
            onLaunch={launch}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
