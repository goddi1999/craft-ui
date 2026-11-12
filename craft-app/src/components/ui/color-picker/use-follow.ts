import { animate, useMotionValue } from 'motion/react'
import { useEffect } from 'react'

import { DRAG_SPRING, THUMB_SPRING } from './color-picker.constants'

/**
 * Springs a motion value to each new target, or jumps under reduced motion. Retargeting keeps
 * the current velocity, and a drag switches to a stiffer spring so the thumb never trails.
 */
export function useFollow(target: number, reduced: boolean, dragging = false) {
  const value = useMotionValue(target)

  useEffect(() => {
    if (reduced) {
      value.jump(target)
      return
    }
    const controls = animate(value, target, dragging ? DRAG_SPRING : THUMB_SPRING)
    return () => controls.stop()
  }, [dragging, reduced, target, value])

  return value
}
