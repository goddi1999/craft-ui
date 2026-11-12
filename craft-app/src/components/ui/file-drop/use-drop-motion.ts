import { useEffect, useRef } from 'react'
import {
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
  type ValueAnimationTransition,
} from 'motion/react'

import {
  BOB_SPEED,
  CARRY_SPRING,
  CHECK_SPRING,
  DONE_SCALE,
  DROP_SPRING,
  FADE_SPRING,
  FED_SCALE,
  FLOOD_SPRING,
  GULP_SCALE,
  GULP_SPRING,
  ICON_SPRING,
  LIFT_SPRING,
  PRESS_SCALE,
  RING_SPRING,
  SAMPLE_FROM,
  SAMPLE_PASS,
  SHRINK_SPRING,
  ZONE_SPRING,
} from './file-drop.constants'
import type { FileDropPhase } from './file-drop.types'
import { settle } from './file-drop.utils'

type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

function useSpringTo(
  value: MotionValue<number>,
  target: number,
  spring: Spring,
  reduced: boolean,
) {
  useEffect(() => {
    const controls = animate(value, target, settle(spring, reduced))
    return () => controls.stop()
  }, [value, target, spring, reduced])
}

/**
 * Every spring in the zone. The ones that follow the phase settle on their own;
 * the pokes (gulp, press, the sample's flight) are fired from the event handlers.
 */
export function useDropMotion(phase: FileDropPhase, lifted: boolean, reduced: boolean) {
  const lift = useMotionValue(0)
  const zone = useMotionValue(1)
  const circle = useMotionValue(1)
  const arrow = useMotionValue(1)
  const percent = useMotionValue(0)
  const ring = useMotionValue(0)
  const flood = useMotionValue(0)
  const check = useMotionValue(0)
  const progress = useMotionValue(0)
  // radians, only advanced while something hovers
  const bob = useMotionValue(0)
  // the chip rests shrunk inside the circle, so it never widens the page while hidden
  const chipX = useMotionValue(0)
  const chipY = useMotionValue(0)
  const chipScale = useMotionValue(0)
  const chipOpacity = useMotionValue(0)
  const running = useRef(new Map<MotionValue<number>, AnimationPlaybackControls>())

  const busy = phase === 'upload' || phase === 'done'
  useSpringTo(lift, lifted && !busy ? 1 : 0, LIFT_SPRING, reduced)
  useSpringTo(arrow, busy ? 0 : 1, ICON_SPRING, reduced)
  useSpringTo(percent, phase === 'upload' ? 1 : 0, ICON_SPRING, reduced)
  useSpringTo(ring, phase === 'upload' ? 1 : 0, RING_SPRING, reduced)
  useSpringTo(flood, phase === 'done' ? 1 : 0, FLOOD_SPRING, reduced)
  useSpringTo(check, phase === 'done' ? 1 : 0, CHECK_SPRING, reduced)

  // the bob loop only runs while it can be seen; stopped, its height still eases out with the lift
  useEffect(() => {
    if (!lifted || busy || reduced) return
    const start = bob.get()
    const controls = animate(bob, [start, start + Math.PI * 2], {
      duration: (Math.PI * 2) / BOB_SPEED,
      ease: 'linear',
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [lifted, busy, reduced, bob])

  useEffect(() => {
    const playing = running.current
    return () => playing.forEach((animation) => animation.stop())
  }, [])

  const run = (
    value: MotionValue<number>,
    target: number,
    transition: ValueAnimationTransition<number>,
  ) => {
    running.current.set(value, animate(value, target, transition))
  }

  // jumps somewhere and springs back to rest; pure decoration, so reduced motion skips it
  const poke = (value: MotionValue<number>, from: number, spring: Spring) => {
    if (reduced) return
    value.jump(from)
    run(value, 1, spring)
  }

  const glide = (to: { x: number; y: number }, spring: Spring) => {
    run(chipX, to.x, settle(spring, reduced))
    run(chipY, to.y, settle(spring, reduced))
  }

  return {
    values: { lift, zone, circle, arrow, percent, ring, flood, check, progress, bob },
    chip: { x: chipX, y: chipY, scale: chipScale, opacity: chipOpacity },
    press: () => poke(zone, PRESS_SCALE, ZONE_SPRING),
    /** The zone takes a file: the circle gulps and the zone gives a little. */
    feed: () => {
      poke(circle, GULP_SCALE, GULP_SPRING)
      poke(zone, FED_SCALE, ZONE_SPRING)
    },
    finish: () => poke(circle, DONE_SCALE, GULP_SPRING),
    launchChip: () => {
      chipX.jump(SAMPLE_FROM.x)
      chipY.jump(SAMPLE_FROM.y)
      chipScale.jump(1)
      chipOpacity.jump(0)
      run(chipOpacity, 1, settle(FADE_SPRING, reduced))
      glide(SAMPLE_PASS, CARRY_SPRING)
    },
    glideChip: glide,
    dropChip: () => {
      glide({ x: 0, y: 0 }, DROP_SPRING)
      run(chipScale, 0, settle(SHRINK_SPRING, reduced))
    },
    hideChip: () => run(chipOpacity, 0, settle(FADE_SPRING, reduced)),
  }
}

export type DropValues = ReturnType<typeof useDropMotion>['values']
export type ChipValues = ReturnType<typeof useDropMotion>['chip']
