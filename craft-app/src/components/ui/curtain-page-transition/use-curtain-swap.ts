import { animate, useMotionValue, type AnimationPlaybackControls } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type Key, type ReactNode } from 'react'

import {
  EASE_IN_OUT,
  EASE_OUT,
  REDUCED_FADE_S,
  TOTAL_RATIO,
} from './curtain-page-transition.constants'

type Shown = { key: Key; node: ReactNode }

/**
 * Holds the outgoing page and the incoming page for one stacked slide.
 * `progress` 0…1 is the whole AOD timeline. Reduced motion is a veil fade.
 */
export function useCurtainSwap({
  transitionKey,
  children,
  duration,
  reduced,
  onEnd,
}: {
  transitionKey: Key
  children: ReactNode
  duration: number
  reduced: boolean
  onEnd?: () => void
}) {
  const progress = useMotionValue(0)
  const veil = useMotionValue(0)
  const [shown, setShown] = useState<Shown>({ key: transitionKey, node: children })
  const [running, setRunning] = useState(false)

  const latest = useRef<Shown>({ key: transitionKey, node: children })
  const shownKey = useRef(transitionKey)
  const busy = useRef(false)
  const controls = useRef<AnimationPlaybackControls | null>(null)
  const alive = useRef(true)
  const settings = useRef({ duration, reduced, onEnd })

  useLayoutEffect(() => {
    latest.current = { key: transitionKey, node: children }
    settings.current = { duration, reduced, onEnd }
  })

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      controls.current?.stop()
    }
  }, [])

  useEffect(() => {
    if (transitionKey === shownKey.current || busy.current) return

    const step = async (
      value: typeof progress,
      to: number,
      seconds: number,
      ease: readonly [number, number, number, number],
    ) => {
      controls.current = animate(value, to, { duration: seconds, ease })
      await controls.current
    }

    const run = async () => {
      busy.current = true
      setRunning(true)
      const { duration: scale, reduced: plain, onEnd: done } = settings.current

      progress.set(0)
      veil.set(0)

      if (plain) {
        await step(veil, 1, REDUCED_FADE_S, EASE_OUT)
        if (!alive.current) return
        shownKey.current = latest.current.key
        setShown(latest.current)
        await step(veil, 0, REDUCED_FADE_S, EASE_OUT)
      } else {
        await step(progress, 1, scale * TOTAL_RATIO, EASE_IN_OUT)
        if (!alive.current) return
        shownKey.current = latest.current.key
        setShown(latest.current)
      }
      if (!alive.current) return

      progress.set(0)
      veil.set(0)
      busy.current = false
      setRunning(false)
      done?.()

      if (latest.current.key !== shownKey.current) void run()
    }

    void run()
  }, [transitionKey, progress, veil])

  const outgoing = running ? shown.node : children
  const incoming = running ? latest.current.node : null

  return { progress, veil, outgoing, incoming, running }
}
