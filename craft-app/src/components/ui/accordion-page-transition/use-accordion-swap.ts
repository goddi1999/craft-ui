import { animate, useMotionValue, type AnimationPlaybackControls } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type Key, type ReactNode } from 'react'

import { EASE_IN_OUT, EASE_OUT, REDUCED_FADE_S } from './accordion-page-transition.constants'

type Shown = { key: Key; node: ReactNode }

/**
 * Cover (slats form, page clips to a slit) → swap → reveal (clip opens, slats clear).
 * `cover` 0…1, then after swap `reveal` 1…0. Reduced motion is a veil fade.
 */
export function useAccordionSwap({
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
  const cover = useMotionValue(0)
  const reveal = useMotionValue(1)
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
      value: typeof cover,
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
      const { duration: half, reduced: plain, onEnd: done } = settings.current

      cover.set(0)
      reveal.set(1)

      if (plain) await step(veil, 1, REDUCED_FADE_S, EASE_OUT)
      else await step(cover, 1, half, EASE_IN_OUT)
      if (!alive.current) return

      shownKey.current = latest.current.key
      setShown(latest.current)

      if (plain) await step(veil, 0, REDUCED_FADE_S, EASE_OUT)
      else {
        cover.set(1)
        await step(reveal, 0, half, EASE_IN_OUT)
      }
      if (!alive.current) return

      cover.set(0)
      reveal.set(1)
      veil.set(0)
      busy.current = false
      setRunning(false)
      done?.()

      if (latest.current.key !== shownKey.current) void run()
    }

    void run()
  }, [transitionKey, cover, reveal, veil])

  const node = transitionKey === shown.key ? children : shown.node
  return { cover, reveal, veil, node, running }
}
