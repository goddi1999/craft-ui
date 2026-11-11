import { useEffect, useRef } from 'react'
import {
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
} from 'motion/react'

import {
  BURST,
  CLAPPER_SPRING,
  CLAPPER_SWEEP,
  CLAPPER_VELOCITY,
  IMPULSE,
  MAX_VELOCITY,
  SWING_SPRING,
} from './notification-bell.constants'
import { clamp } from './notification-bell.utils'

/** Swings the bell whenever the total goes up; bursts of new items swing it harder. */
export function useBellRing(total: number, reduced: boolean) {
  const swing = useMotionValue(0)
  const swingVelocity = useVelocity(swing)
  // clapper follows the bell's speed, so it lags behind on its own
  const clapperLag = useTransform(
    swingVelocity,
    [-CLAPPER_VELOCITY, 0, CLAPPER_VELOCITY],
    [CLAPPER_SWEEP, 0, -CLAPPER_SWEEP],
    { clamp: true },
  )
  const clapper = useSpring(clapperLag, CLAPPER_SPRING)
  const previous = useRef(total)
  const ringing = useRef<AnimationPlaybackControls | null>(null)

  useEffect(() => {
    const delta = total - previous.current
    previous.current = total
    if (delta <= 0 || reduced) return

    const weight = 0.7 + (0.6 * Math.min(delta, BURST)) / BURST
    const moving = swing.getVelocity()
    // push it the way it is already moving so it swings harder
    const along = moving > 1 ? 1 : -1

    ringing.current = animate(swing, 0, {
      ...SWING_SPRING,
      velocity: clamp(moving + along * IMPULSE * weight, MAX_VELOCITY),
    })
  }, [total, reduced, swing])

  useEffect(() => () => ringing.current?.stop(), [])

  return { swing, clapper }
}
