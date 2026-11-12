import {
  animate,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react'
import { useEffect, useRef } from 'react'

import { MORPH } from './interactive-area-chart.constants'
import { blend, sameSeries } from './interactive-area-chart.utils'

/**
 * The drawn curve, morphing to `target` whenever it changes. A change mid-morph starts
 * from what is on screen, so switching ranges quickly never jumps.
 */
export function useCurveMorph(target: Float64Array, reduced: boolean) {
  const progress = useMotionValue(1)
  const from = useMotionValue(target)
  const to = useMotionValue(target)
  const morph = useRef<AnimationPlaybackControls | null>(null)

  useEffect(() => {
    if (sameSeries(to.get(), target)) return
    morph.current?.stop()
    from.set(blend(from.get(), to.get(), progress.get()))
    to.set(target)
    if (reduced) {
      progress.set(1)
      return
    }
    progress.set(0)
    morph.current = animate(progress, 1, MORPH)
  }, [target, reduced, from, to, progress])

  useEffect(() => () => morph.current?.stop(), [])

  return useTransform(() => blend(from.get(), to.get(), progress.get()))
}
