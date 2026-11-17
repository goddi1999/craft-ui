import { useEffect, useRef } from 'react'
import {
  animate,
  useMotionValue,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'

import {
  DOCK_GIVE,
  DOCK_GIVE_VELOCITY,
  DOCK_HEIGHT_SPRING,
  DOCK_MAX_RADIUS,
  DOCK_MIN_HEIGHT,
  DOCK_SHRINK_STIFFNESS,
  DOCK_WIDTH_SPRING,
} from './image-pin-dock.constants'

type Spring = {
  type: 'spring'
  stiffness: number
  damping: number
  mass: number
}

type Size = { width: number; height: number }

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const withReducedMotion = (spring: Spring, reduced: boolean): Spring =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

const giveFor = (heightVelocity: number) =>
  clamp(-heightVelocity / DOCK_GIVE_VELOCITY, -DOCK_GIVE, DOCK_GIVE)

function springTo(
  value: MotionValue<number>,
  to: number,
  spring: Spring,
  reduced: boolean,
) {
  animate(value, to, withReducedMotion(spring, reduced))
}

/**
 * Springs the dock's width and height separately (width first), with a little
 * width give while height is moving — same morph feel as MorphIsland.
 */
export function useImagePinDockMorph(target: Size, reduced: boolean) {
  const width = useMotionValue(Math.max(target.width, 1))
  const height = useMotionValue(Math.max(target.height, DOCK_MIN_HEIGHT))
  const heightVelocity = useVelocity(height)
  const previous = useRef(target)
  const ready = useRef(false)

  const renderedWidth = useTransform(
    () => width.get() * (1 + giveFor(heightVelocity.get())),
  )
  const renderedHeight = useTransform(height, (h) =>
    Math.max(h, DOCK_MIN_HEIGHT),
  )
  const borderRadius = useTransform(renderedHeight, (h) =>
    Math.min(h / 2, DOCK_MAX_RADIUS),
  )

  useEffect(() => {
    if (target.width <= 0 || target.height <= 0) return

    if (!ready.current) {
      width.jump(target.width)
      height.jump(target.height)
      previous.current = target
      ready.current = true
      return
    }

    const last = previous.current
    if (last.width === target.width && last.height === target.height) return
    previous.current = target

    const grow =
      target.width * target.height > last.width * last.height
    const heightSpring = {
      ...DOCK_HEIGHT_SPRING,
      stiffness:
        DOCK_HEIGHT_SPRING.stiffness * (grow ? 1 : DOCK_SHRINK_STIFFNESS),
    }

    springTo(width, target.width, DOCK_WIDTH_SPRING, reduced)
    springTo(height, target.height, heightSpring, reduced)
  }, [target.width, target.height, reduced, width, height])

  useEffect(
    () => () => {
      width.stop()
      height.stop()
    },
    [width, height],
  )

  return { width: renderedWidth, height: renderedHeight, borderRadius }
}
