import { animate, useMotionValue, useTransform } from 'motion/react'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'

import {
  DONE_POP,
  HEIGHT,
  HOLD_KEYS,
  MORPH_SPRING,
  PRESS_SCALE,
  PRESS_SPRING,
  RELEASE_SPRING,
  SHAKE_KICK,
  SHAKE_SPRING,
  UNMORPH_SPRING,
} from './hold-button.constants'
import { springFor } from './hold-button.utils'

type Mode = 'idle' | 'holding' | 'done'

type HoldOptions = {
  duration: number
  doneDuration: number
  width: number
  reduced: boolean
  onComplete?: () => void
}

/**
 * Fills linearly while held, springs back with a head-shake when let go early,
 * and morphs into a circle when the fill reaches the end.
 */
export function useHold({ duration, doneDuration, width, reduced, onComplete }: HoldOptions) {
  const progress = useMotionValue(0)
  const pillWidth = useMotionValue(width)
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  // the spring dips below zero on release, the fill should not
  const fillWidth = useTransform(() => Math.max(0, progress.get()) * pillWidth.get())
  // the inverted label only shows where the fill is
  const clipPath = useTransform(
    () => `inset(0 ${Math.max(0, pillWidth.get() - fillWidth.get())}px 0 0)`,
  )
  const mode = useRef<Mode>('idle')
  const resetTimer = useRef<number | undefined>(undefined)
  // reset reads this, so a width change while the check shows is not lost
  const widthRef = useRef(width)
  const [done, setDone] = useState(false)

  // a new width applies right away while it is a pill, and on reset while it is a circle
  useEffect(() => {
    widthRef.current = width
    if (mode.current !== 'done') pillWidth.jump(width)
  }, [width, pillWidth])

  useEffect(() => {
    return () => {
      window.clearTimeout(resetTimer.current)
      progress.stop()
      pillWidth.stop()
      scale.stop()
      x.stop()
    }
  }, [progress, pillWidth, scale, x])

  function reset() {
    mode.current = 'idle'
    setDone(false)
    progress.jump(0)
    animate(pillWidth, widthRef.current, springFor(UNMORPH_SPRING, reduced))
  }

  function complete() {
    mode.current = 'done'
    setDone(true)
    animate(pillWidth, HEIGHT, springFor(MORPH_SPRING, reduced))
    animate(scale, 1, {
      ...springFor(PRESS_SPRING, reduced),
      velocity: scale.getVelocity() + DONE_POP,
    })
    onComplete?.()
    resetTimer.current = window.setTimeout(reset, doneDuration)
  }

  function start() {
    if (mode.current !== 'idle') return
    mode.current = 'holding'
    animate(scale, PRESS_SCALE, springFor(PRESS_SPRING, reduced))
    // linear while held, it is a progress bar; a spring only takes over on release.
    // a quick re-press picks up from wherever the spring-back has got to
    animate(progress, 1, {
      duration: ((1 - progress.get()) * duration) / 1000,
      ease: 'linear',
      onComplete: complete,
    })
  }

  function release() {
    if (mode.current !== 'holding') return
    mode.current = 'idle'
    const reached = progress.get()
    animate(scale, 1, springFor(PRESS_SPRING, reduced))
    // held progress has no velocity in the source, so the spring starts from rest
    animate(progress, 0, { ...springFor(RELEASE_SPRING, reduced), velocity: 0 })
    if (reduced) return
    animate(x, 0, {
      ...SHAKE_SPRING,
      velocity: x.getVelocity() + SHAKE_KICK * Math.min(1, reached * 2 + 0.3),
    })
  }

  const handlers = {
    onPointerDown(event: PointerEvent<HTMLButtonElement>) {
      if (event.button !== 0) return
      start()
      // keep getting pointerup even when the finger slides off the pill
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // the pointer is already gone
      }
    },
    onPointerUp: release,
    onPointerCancel: release,
    onLostPointerCapture: release,
    onBlur: release,
    onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
      if (!HOLD_KEYS.includes(event.key)) return
      event.preventDefault()
      if (!event.repeat) start()
    },
    onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
      if (!HOLD_KEYS.includes(event.key)) return
      event.preventDefault()
      release()
    },
    // a long press on touch would open the context menu
    onContextMenu(event: MouseEvent<HTMLButtonElement>) {
      event.preventDefault()
    },
  }

  return { done, pillWidth, fillWidth, clipPath, scale, x, handlers }
}
