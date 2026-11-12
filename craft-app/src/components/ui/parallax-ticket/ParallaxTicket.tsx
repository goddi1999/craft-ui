import { motion, useReducedMotion } from 'motion/react'
import { useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { DEPTH, TILT } from './parallax-ticket.constants'
import type { ParallaxTicketProps } from './parallax-ticket.types'
import { TicketBack, TicketFront } from './parallax-ticket-parts'
import { useTicketMotion } from './use-ticket-motion'

/**
 * A layered ticket that tilts toward the pointer with real depth, a glare riding on
 * top, and flips over on a spring to show its code on the back.
 */
export function ParallaxTicket({
  title,
  subtitle,
  code,
  image,
  details = [],
  hint = 'Tap to flip back',
  flipped: flippedProp,
  defaultFlipped = false,
  onFlippedChange,
  tilt = TILT,
  depth = DEPTH,
  className,
  'aria-label': ariaLabel,
  ...props
}: ParallaxTicketProps) {
  const reduced = useReducedMotion() ?? false
  const [uncontrolled, setUncontrolled] = useState(defaultFlipped)
  const isFlipped = flippedProp !== undefined ? flippedProp : uncontrolled
  const { transform, stageHandlers, ...layers } = useTicketMotion({
    flipped: isFlipped,
    tilt,
    depth,
    reduced,
  })

  function handleToggle() {
    const next = !isFlipped
    if (flippedProp === undefined) setUncontrolled(next)
    onFlippedChange?.(next)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleToggle()
  }

  return (
    <div
      data-slot="parallax-ticket"
      data-state={isFlipped ? 'flipped' : 'front'}
      className={cn('relative h-89 w-66 perspective-[900px]', className)}
      {...props}
      {...stageHandlers}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={ariaLabel}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="relative size-full cursor-pointer rounded-3xl outline-none transform-3d will-change-transform focus-visible:ring-2 focus-visible:ring-ring"
        style={{ transform }}
      >
        <TicketFront
          title={title}
          subtitle={subtitle}
          code={code}
          image={image}
          hidden={isFlipped}
          {...layers}
        />
        <TicketBack details={details} hint={hint} hidden={!isFlipped} />
      </motion.div>
    </div>
  )
}
