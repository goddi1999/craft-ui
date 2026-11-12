import { useEffect, useEffectEvent, useState } from 'react'

type GreetingCycleOptions = {
  count: number
  interval: number
  /** How long the last greeting lingers on top of its interval. */
  finalHold: number
  reduced: boolean
  skippable: boolean
  onComplete?: () => void
}

/** Steps through the greetings once, then ends. Escape ends it early when skippable. */
export function useGreetingCycle({
  count,
  interval,
  finalHold,
  reduced,
  skippable,
  onComplete,
}: GreetingCycleOptions) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [run, setRun] = useState(0)
  const last = Math.max(count - 1, 0)

  const finish = () => {
    setPlaying(false)
    onComplete?.()
  }
  // timers call the latest onComplete, so a new callback does not restart the cycle
  const end = useEffectEvent(finish)

  useEffect(() => {
    if (!playing) return
    // reduced motion skips straight to the end
    if (reduced) {
      const timer = setTimeout(() => end(), 0)
      return () => clearTimeout(timer)
    }
    const timer =
      index < last
        ? setTimeout(() => setIndex((current) => current + 1), interval)
        : setTimeout(() => end(), interval + finalHold)
    return () => clearTimeout(timer)
  }, [playing, reduced, index, last, interval, finalHold])

  useEffect(() => {
    if (!playing || !skippable) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      end()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [playing, skippable])

  const replay = () => {
    setIndex(0)
    setPlaying(true)
    setRun((current) => current + 1)
  }

  return { index: Math.min(index, last), playing, run, finish, replay }
}
