import { useEffect } from 'react'
import { animate, useMotionValue, useTransform } from 'motion/react'

import { RING_LENGTH, UPLOAD_SECONDS } from './morph-island.constants'
import type { MorphIslandState } from './morph-island.types'
import { clamp, formatClock } from './morph-island.utils'

/**
 * The live numbers inside the island: the timer counting down and the upload ring.
 * They are motion values, so the text ticks without re-rendering the island.
 */
export function useIslandActivity(
  state: MorphIslandState,
  timerSeconds: number,
  uploadProgress: number | undefined,
) {
  const remaining = useMotionValue(timerSeconds)
  const progress = useMotionValue(0)
  const clock = useTransform(remaining, formatClock)
  const percent = useTransform(progress, (p) => `${Math.round(p * 100)}%`)
  const dashOffset = useTransform(progress, (p) => RING_LENGTH * (1 - p))
  const simulated = uploadProgress === undefined

  // counts only while on show, from the top each time it opens
  useEffect(() => {
    if (state !== 'timer') return
    remaining.set(timerSeconds)
    const countdown = animate(remaining, 0, { duration: timerSeconds, ease: 'linear' })
    return () => countdown.stop()
  }, [state, timerSeconds, remaining])

  useEffect(() => {
    if (state !== 'upload' || !simulated) return
    progress.set(0)
    const fill = animate(progress, 1, { duration: UPLOAD_SECONDS, ease: 'linear' })
    return () => fill.stop()
  }, [state, simulated, progress])

  useEffect(() => {
    if (uploadProgress !== undefined) progress.set(clamp(uploadProgress, 0, 1))
  }, [uploadProgress, progress])

  return { clock, percent, dashOffset }
}
