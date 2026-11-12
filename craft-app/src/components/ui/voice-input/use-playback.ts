import { animate, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'

import { toClipPath } from './voice-input.utils'

/**
 * A playhead that sweeps the take at real speed. There is no audio: it shows
 * where your own player is, or previews the take. Every play starts from the top.
 */
export function usePlayback(duration: number) {
  const [playing, setPlaying] = useState(false)
  const [playhead, setPlayhead] = useState(0)
  const progress = useMotionValue(0)
  const clipPath = useTransform(progress, toClipPath)

  useEffect(() => {
    if (!playing) return
    const length = Math.max(duration, 1)
    let shown = -1
    progress.jump(0)
    // the clip moves every frame; React only hears about it when the timer's second changes
    const unsubscribe = progress.on('change', (value) => {
      const position = value * length
      if (Math.floor(position) === shown) return
      shown = Math.floor(position)
      setPlayhead(Math.max(position, Number.EPSILON))
    })
    const controls = animate(progress, 1, {
      duration: length,
      ease: 'linear',
      onComplete: () => {
        setPlayhead(length)
        setPlaying(false)
      },
    })
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [playing, duration, progress])

  const rewind = () => {
    progress.jump(0)
    setPlayhead(0)
  }

  return { playing, setPlaying, playhead, clipPath, rewind }
}
