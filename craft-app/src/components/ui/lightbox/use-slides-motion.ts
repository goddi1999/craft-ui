import { animate, useMotionValue } from 'motion/react'
import { useCallback, useMemo, useRef } from 'react'

import type { LightboxSlidesMotion } from './lightbox.types'
import { SETTLE_SPRING } from './lightbox.utils'

/**
 * The slide track's motion values. The track rests at `-index * step`; a
 * swipe adds a live `dragX` on top, and releasing hands the finger's velocity
 * to the spring so the slide keeps moving the way the finger was.
 */
export function useSlidesMotion(): LightboxSlidesMotion {
  const baseX = useMotionValue(0)
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const stepRef = useRef(0)
  const targetRef = useRef(0)

  const glideTo = useCallback(
    (index: number, velocity = 0) => {
      targetRef.current = index
      animate(baseX, -index * stepRef.current, { ...SETTLE_SPRING, velocity })
    },
    [baseX],
  )

  const settle = useCallback(
    (target: number, velocity: number) => {
      // Fold the finger offset into the base so the spring starts where the slide is.
      baseX.jump(baseX.get() + dragX.get())
      dragX.jump(0)
      glideTo(target, velocity)
    },
    [baseX, dragX, glideTo],
  )

  return useMemo(
    () => ({ baseX, dragX, dragY, stepRef, targetRef, glideTo, settle }),
    [baseX, dragX, dragY, glideTo, settle],
  )
}
