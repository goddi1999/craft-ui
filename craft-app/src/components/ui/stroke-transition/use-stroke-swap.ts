import { animate, useMotionValue, type AnimationPlaybackControls } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type Key, type ReactNode } from 'react'

import { EASE_IN_OUT, REDUCED_FADE_S } from './stroke-transition.constants'

type Shown = { key: Key; node: ReactNode }

/**
 * Runs cover → swap → reveal whenever the key changes. `head` and `tail` are how far along the
 * path the stroke's two ends are (0 to 1); `veil` is the plain fade used with reduced motion.
 * A key that changes mid-run waits and plays its own run once the current one has cleared.
 */
export function useStrokeSwap({
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
  const head = useMotionValue(0)
  const tail = useMotionValue(0)
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

    const step = async (value: typeof head, to: number, seconds: number) => {
      controls.current = animate(value, to, { duration: seconds, ease: EASE_IN_OUT })
      await controls.current
    }

    const run = async () => {
      busy.current = true
      setRunning(true)
      const { duration: half, reduced: plain } = settings.current

      if (plain) await step(veil, 1, REDUCED_FADE_S)
      else {
        head.set(0)
        tail.set(0)
        await step(head, 1, half)
      }
      if (!alive.current) return

      // the stage is covered: swap in whatever the newest content is
      shownKey.current = latest.current.key
      setShown(latest.current)

      if (plain) await step(veil, 0, REDUCED_FADE_S)
      else await step(tail, 1, half)
      if (!alive.current) return

      head.set(0)
      tail.set(0)
      busy.current = false
      setRunning(false)
      settings.current.onEnd?.()
      if (latest.current.key !== shownKey.current) void run()
    }

    void run()
  }, [transitionKey, head, tail, veil])

  // between runs the live children render, so state inside the page keeps updating
  const node = transitionKey === shown.key ? children : shown.node
  return { head, tail, veil, node, running }
}
