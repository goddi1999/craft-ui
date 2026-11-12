import { useReducedMotion } from 'motion/react'
import { useState, type MouseEvent } from 'react'

import { cn } from '@/lib/utils'

import type { LikeBurstProps } from './like-burst.types'
import { BurstDots, CountRoll, Heart } from './like-burst-parts'
import { useLikeMotion } from './use-like-motion'

/**
 * A like button. The heart squashes, bounces back filled red and throws a ring of
 * dots while the count rolls up by one; unliking drains it with a small dip.
 */
export function LikeBurst({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  count,
  burst = true,
  label = 'Like',
  className,
  onClick,
  ...props
}: LikeBurstProps) {
  const reduced = useReducedMotion() ?? false
  const [innerPressed, setInnerPressed] = useState(defaultPressed)
  const controlled = pressedProp !== undefined
  const pressed = controlled ? pressedProp : innerPressed
  const like = useLikeMotion(pressed, reduced, burst)
  const showCount = count !== undefined

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (!controlled) setInnerPressed(!pressed)
    onPressedChange?.(!pressed)
  }

  return (
    <button
      type="button"
      data-slot="like-burst"
      data-state={pressed ? 'on' : 'off'}
      aria-pressed={pressed}
      onClick={handleClick}
      className={cn(
        // --like-heart is a fixed red the source uses in both themes; override it with a class
        'inline-flex h-14 shrink-0 items-center rounded-full bg-muted text-[17px] font-semibold text-foreground outline-none select-none [--like-heart:#ff4d6d] focus-visible:ring-2 focus-visible:ring-ring',
        showCount ? 'gap-2.5 pr-5 pl-4' : 'w-14 justify-center',
        className,
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden className="relative size-[26px] shrink-0">
        {burst && <BurstDots progress={like.burst} />}
        <Heart squash={like.squash} fill={like.fill} />
      </span>
      {showCount && <CountRoll count={count} roll={like.roll} pressed={pressed} />}
    </button>
  )
}
