import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

import { MAX_STEP } from './chapter-player.constants'
import { clamp } from './chapter-player.utils'

type ClockOptions = {
  duration: number
  loop: boolean
  autoPlay: boolean
  /** When set, the video is the clock and this hook only mirrors it. */
  videoRef: RefObject<HTMLVideoElement | null>
  hasVideo: boolean
  /** Runs every frame with the current time; write to the DOM here, not to state. */
  onFrame: (time: number) => void
}

/**
 * The playhead as a ref, not state, so a running clock never re-renders the tree.
 * Without a video it counts time itself; with one it follows `video.currentTime`.
 */
export function useChapterClock({
  duration,
  loop,
  autoPlay,
  videoRef,
  hasVideo,
  onFrame,
}: ClockOptions) {
  const time = useRef(0)
  const [playing, setPlaying] = useState(autoPlay)
  const frame = useRef(onFrame)

  useLayoutEffect(() => {
    frame.current = onFrame
  })

  const report = useCallback(() => frame.current(time.current), [])

  // the frame loop only runs while playing
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const video = videoRef.current
      if (hasVideo) {
        if (video) time.current = video.currentTime
      } else {
        const step = Math.min((now - last) / 1000, MAX_STEP)
        let next = time.current + step
        if (next >= duration) {
          if (!loop) {
            time.current = duration
            report()
            setPlaying(false)
            return
          }
          next = duration > 0 ? next % duration : 0
        }
        time.current = next
      }
      last = now
      report()
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, duration, loop, hasVideo, videoRef, report])

  // keep the video element in step with `playing`
  useEffect(() => {
    const video = videoRef.current
    if (!hasVideo || !video) return
    if (playing) {
      if (video.ended) video.currentTime = 0
      video.play().catch(() => setPlaying(false))
    } else {
      video.pause()
    }
  }, [playing, hasVideo, videoRef])

  const seek = useCallback(
    (to: number) => {
      const next = clamp(to, 0, duration)
      time.current = next
      const video = videoRef.current
      if (hasVideo && video) video.currentTime = next
      report()
    },
    [duration, hasVideo, videoRef, report],
  )

  const toggle = useCallback(() => {
    // pressing play at the very end replays from the top
    if (!playing && time.current >= duration) seek(0)
    setPlaying(!playing)
  }, [playing, duration, seek])

  return { time, playing, setPlaying, seek, toggle, report }
}
