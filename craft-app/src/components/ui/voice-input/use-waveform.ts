import { useEffect, useRef } from 'react'

import {
  BAR_IDS,
  BAR_PITCH,
  MAX_FRAME_MS,
  REST_LEVEL,
  RING_OPACITY,
  RING_OPACITY_GAIN,
  RING_SMOOTHING,
  RING_SWELL,
  SAMPLE_MS,
  STILL_LEVELS,
} from './voice-input.constants'
import { condense, createVoiceSimulator, setScales } from './voice-input.utils'

/**
 * Scrolls the waveform and swells the ring while recording, then lays the take
 * down for review. One rAF loop writes transforms straight to the DOM, so a
 * frame never re-renders React.
 */
export function useWaveform({
  recording,
  reviewing,
  reduced,
  level,
}: {
  recording: boolean
  reviewing: boolean
  reduced: boolean
  level: number | undefined
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const barRefs = useRef<(HTMLSpanElement | null)[]>([])
  const playedBarRefs = useRef<(HTMLSpanElement | null)[]>([])
  const takeRef = useRef<number[]>([])
  const levelRef = useRef(level)

  useEffect(() => {
    levelRef.current = level
  }, [level])

  useEffect(() => {
    const bars = barRefs.current
    const row = rowRef.current
    const ring = ringRef.current
    const root = rootRef.current
    if (!(recording && row && ring && root)) return
    takeRef.current = []

    if (reduced) {
      setScales(bars, STILL_LEVELS)
      takeRef.current = STILL_LEVELS.slice()
      return
    }

    const simulate = createVoiceSimulator()
    const samples = BAR_IDS.map(() => REST_LEVEL)
    let phase = 0
    let smooth = 0
    let last = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const dt = Math.min(now - last, MAX_FRAME_MS)
      last = now
      phase += dt / SAMPLE_MS
      while (phase >= 1) {
        phase -= 1
        const live = levelRef.current
        const sample =
          live === undefined ? simulate(now) : Math.max(REST_LEVEL, Math.min(1, live))
        samples.shift()
        samples.push(sample)
        takeRef.current.push(sample)
      }
      row.style.transform = `translateX(${(-phase * BAR_PITCH).toFixed(2)}px)`
      setScales(bars, samples)
      smooth += (samples[samples.length - 1] - smooth) * RING_SMOOTHING
      const lift = Math.max(0, smooth - REST_LEVEL)
      ring.style.transform = `scale(${(1 + lift * RING_SWELL).toFixed(3)})`
      ring.style.opacity = (RING_OPACITY + lift * RING_OPACITY_GAIN).toFixed(3)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    // pauses offscreen
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
      else cancelAnimationFrame(frame)
    })
    observer.observe(root)
    start()

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      ring.style.transform = 'scale(1)'
      ring.style.opacity = '0'
    }
  }, [recording, reduced])

  // review shows the whole take squeezed into the row, idle lays it flat;
  // the bars carry a css transition outside recording, so both glide
  useEffect(() => {
    const row = rowRef.current
    if (recording || !row) return
    row.style.transform = 'translateX(0px)'
    const levels = reviewing ? condense(takeRef.current) : BAR_IDS.map(() => REST_LEVEL)
    setScales(barRefs.current, levels)
    setScales(playedBarRefs.current, levels)
  }, [recording, reviewing])

  return { rootRef, rowRef, ringRef, barRefs, playedBarRefs, takeRef }
}
