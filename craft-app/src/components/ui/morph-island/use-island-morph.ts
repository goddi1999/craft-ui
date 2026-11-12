import { useEffect, useRef } from 'react'
import {
  animate,
  useMotionValue,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'

import {
  GROW_KICK,
  HEIGHT_SPRING,
  MAX_RADIUS,
  MIN_HEIGHT,
  PRESS_SPRING,
  PRESSED_SCALE,
  SHRINK_KICK,
  SHRINK_STIFFNESS,
  SIZES,
  WIDTH_SPRING,
} from './morph-island.constants'
import type { MorphIslandState } from './morph-island.types'
import { giveFor, withReducedMotion, type Spring } from './morph-island.utils'

// the kick pushes the value down on top of whatever it is already doing
function springTo(
  value: MotionValue<number>,
  to: number,
  spring: Spring,
  reduced: boolean,
  kick = 0,
) {
  animate(value, to, {
    ...withReducedMotion(spring, reduced),
    velocity: value.getVelocity() - kick,
  })
}

/**
 * Springs the island's width, height and press scale. Width is stiffer than height,
 * so every change lands sideways first and then drops into place.
 */
export function useIslandMorph(state: MorphIslandState, reduced: boolean) {
  const width = useMotionValue(SIZES[state].width)
  const height = useMotionValue(SIZES[state].height)
  const scale = useMotionValue(1)
  const heightVelocity = useVelocity(height)
  const target = useRef(SIZES[state])
  const pressed = useRef(false)

  const renderedWidth = useTransform(() => width.get() * (1 + giveFor(heightVelocity.get())))
  const renderedHeight = useTransform(height, (h) => Math.max(h, MIN_HEIGHT))
  const borderRadius = useTransform(renderedHeight, (h) => Math.min(h / 2, MAX_RADIUS))

  useEffect(() => {
    const next = SIZES[state]
    const previous = target.current
    if (next === previous) return
    target.current = next

    const grow = next.width * next.height > previous.width * previous.height
    const heightSpring = {
      ...HEIGHT_SPRING,
      stiffness: HEIGHT_SPRING.stiffness * (grow ? 1 : SHRINK_STIFFNESS),
    }
    springTo(width, next.width, WIDTH_SPRING, reduced)
    springTo(height, next.height, heightSpring, reduced)
    springTo(
      scale,
      pressed.current ? PRESSED_SCALE : 1,
      PRESS_SPRING,
      reduced,
      grow ? GROW_KICK : SHRINK_KICK,
    )
  }, [state, reduced, width, height, scale])

  // let go anywhere on the page, like the source
  useEffect(() => {
    const release = () => {
      if (!pressed.current) return
      pressed.current = false
      springTo(scale, 1, PRESS_SPRING, reduced)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [scale, reduced])

  useEffect(
    () => () => {
      width.stop()
      height.stop()
      scale.stop()
    },
    [width, height, scale],
  )

  const press = () => {
    pressed.current = true
    springTo(scale, PRESSED_SCALE, PRESS_SPRING, reduced)
  }

  return { width: renderedWidth, height: renderedHeight, borderRadius, scale, press }
}
