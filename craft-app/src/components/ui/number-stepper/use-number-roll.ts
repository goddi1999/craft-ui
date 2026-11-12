import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, useMotionValue, useTransform } from 'motion/react'

import { ROLL_SPRING } from './number-stepper.constants'
import { clamp, withReducedMotion } from './number-stepper.utils'

type Shown = { value: number; previous: number; direction: 1 | -1 }

/**
 * A change jumps the roll back to 1 and lets it settle to 0: the new number comes in
 * from below (from above going down) while the old one leaves the other way.
 */
export function useNumberRoll(value: number, reduced: boolean) {
  const [shown, setShown] = useState<Shown>({ value, previous: value, direction: 1 })
  // keep the outgoing number around while it leaves; Object.is so NaN cannot loop
  if (!Object.is(shown.value, value)) {
    setShown({ value, previous: shown.value, direction: value > shown.value ? 1 : -1 })
  }

  const roll = useMotionValue(0)
  const direction = useMotionValue(1)
  const previousShown = useRef(shown)

  const incomingY = useTransform(() => `${direction.get() * roll.get() * 100}%`)
  const incomingOpacity = useTransform(roll, (r) => clamp(1 - Math.abs(r), 0, 1))
  const outgoingY = useTransform(() => `${(roll.get() - 1) * direction.get() * 100}%`)
  const outgoingOpacity = useTransform(roll, (r) => clamp(r, 0, 1))

  // before paint, so the new number never flashes at rest before it rolls in
  useLayoutEffect(() => {
    if (previousShown.current === shown) return
    previousShown.current = shown
    direction.set(shown.direction)
    // a change mid-roll starts over, like stepper.js setting the spring back to 1
    roll.jump(1)
    animate(roll, 0, { ...withReducedMotion(ROLL_SPRING, reduced), velocity: 0 })
  }, [shown, reduced, roll, direction])

  useEffect(() => () => roll.stop(), [roll])

  return {
    current: shown.value,
    previous: shown.previous,
    incomingY,
    incomingOpacity,
    outgoingY,
    outgoingOpacity,
  }
}
