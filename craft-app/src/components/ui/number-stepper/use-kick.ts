import { useEffect } from 'react'
import { animate, useMotionValue, useTransform } from 'motion/react'

import { withReducedMotion, type Spring } from './number-stepper.utils'

/** A spring resting at 0 that gets kicked: velocity in stepper.js units, read out in px. */
export function useKick(spring: Spring, pxPerUnit: number, reduced: boolean) {
  const offset = useMotionValue(0)
  const x = useTransform(offset, (value) => value * pxPerUnit)

  useEffect(() => () => offset.stop(), [offset])

  // sets the velocity rather than adding to it, so mashing the button never builds up
  const kick = (velocity: number) => {
    animate(offset, 0, { ...withReducedMotion(spring, reduced), velocity })
  }

  return { x, kick }
}
