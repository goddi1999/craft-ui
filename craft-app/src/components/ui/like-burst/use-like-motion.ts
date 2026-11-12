import { useEffect, useRef } from 'react'
import { animate, useMotionValue, type AnimationPlaybackControls, type MotionValue } from 'motion/react'

import {
  BURST_MS,
  FILL_SPRING,
  LIKE_KICK,
  ROLL_SPRING,
  SQUASH_SPRING,
  UNLIKE_KICK,
} from './like-burst.constants'
import { settle } from './like-burst.utils'

/** Drives the heart, fill, count and dots whenever `pressed` flips, from a click or from the parent. */
export function useLikeMotion(pressed: boolean, reduced: boolean, withBurst: boolean) {
  const squash = useMotionValue(1)
  const fill = useMotionValue(pressed ? 1 : 0)
  const roll = useMotionValue(pressed ? 1 : 0)
  // 1 means the burst is over, so the dots start hidden
  const burst = useMotionValue(1)
  const previous = useRef(pressed)
  const running = useRef(new Map<MotionValue<number>, AnimationPlaybackControls>())

  useEffect(() => {
    if (previous.current === pressed) return
    previous.current = pressed

    const target = pressed ? 1 : 0
    const playing = running.current
    playing.set(fill, animate(fill, target, settle(FILL_SPRING, reduced)))
    playing.set(roll, animate(roll, target, settle(ROLL_SPRING, reduced)))

    // the squash and the dots are decoration, so reduced motion skips them
    if (reduced) return
    const kick = pressed ? LIKE_KICK : UNLIKE_KICK
    squash.jump(kick.from)
    playing.set(squash, animate(squash, 1, { ...SQUASH_SPRING, velocity: kick.velocity }))

    if (!pressed || !withBurst) return
    burst.jump(0)
    playing.set(burst, animate(burst, 1, { duration: BURST_MS / 1000, ease: 'linear' }))
  }, [pressed, reduced, withBurst, squash, fill, roll, burst])

  useEffect(() => {
    const playing = running.current
    return () => playing.forEach((animation) => animation.stop())
  }, [])

  return { squash, fill, roll, burst }
}
