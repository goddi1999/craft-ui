import { useEffect, useEffectEvent, useLayoutEffect, useRef, type RefObject } from 'react'
import { animate, useMotionValue, useTransform } from 'motion/react'

import {
  DONE_RISE,
  DONE_SPRING,
  LABEL_DELAY_MS,
  LABEL_DROP,
  LABEL_SPRING,
  SPINNER_MIN_SCALE,
  SPINNER_SPRING,
  TICK_DELAY_MS,
  TICK_LENGTH,
  TICK_SPRING,
  TINT_SPRING,
  WIDTH_SPRING,
} from './loading-success.constants'
import type { LoadingSuccessStatus } from './loading-success.types'
import { clamp, springFor, widthFor } from './loading-success.utils'

// where each part rests in each status; 1 = fully in
const RESTING = {
  idle: { label: 1, spinner: 0, done: 0, tint: 0, tick: 0 },
  loading: { label: 0, spinner: 1, done: 0, tint: 0, tick: 0 },
  success: { label: 0, spinner: 0, done: 1, tint: 1, tick: 1 },
} as const

/**
 * One spring per moving part, all retargeted whenever the status changes, so a
 * status that flips mid-flight just bends the motion instead of restarting it.
 */
export function useStatusMorph(
  status: LoadingSuccessStatus,
  reduced: boolean,
  labelRef: RefObject<HTMLSpanElement | null>,
  doneRef: RefObject<HTMLSpanElement | null>,
) {
  const rest = RESTING[status]
  // measured in the layout effect below, before the first paint
  const content = useRef({ label: 0, done: 0 })
  const width = useMotionValue(widthFor(status, { label: 0, done: 0 }))
  const label = useMotionValue<number>(rest.label)
  const spinner = useMotionValue<number>(rest.spinner)
  const done = useMotionValue<number>(rest.done)
  const tint = useMotionValue<number>(rest.tint)
  const tick = useMotionValue<number>(rest.tick)

  // measure the labels so longer copy gets a wider pill
  const refit = useEffectEvent((instant: boolean) => {
    const labelNode = labelRef.current
    const doneNode = doneRef.current
    if (!labelNode || !doneNode) return
    content.current = { label: labelNode.offsetWidth, done: doneNode.offsetWidth }
    const target = widthFor(status, content.current)
    if (instant) width.jump(target)
    else animate(width, target, springFor(WIDTH_SPRING, reduced))
  })

  useLayoutEffect(() => {
    refit(true)
    const observer = new ResizeObserver(() => refit(false))
    if (labelRef.current) observer.observe(labelRef.current)
    if (doneRef.current) observer.observe(doneRef.current)
    return () => observer.disconnect()
  }, [labelRef, doneRef])

  useEffect(() => {
    const target = RESTING[status]
    animate(width, widthFor(status, content.current), springFor(WIDTH_SPRING, reduced))
    // back to idle: the label waits a beat so it does not collide with the leaving check
    animate(label, target.label, {
      ...springFor(LABEL_SPRING, reduced),
      delay: status === 'idle' ? LABEL_DELAY_MS / 1000 : 0,
    })
    animate(spinner, target.spinner, springFor(SPINNER_SPRING, reduced))
    animate(done, target.done, springFor(DONE_SPRING, reduced))
    animate(tint, target.tint, springFor(TINT_SPRING, reduced))
    // the check draws once the pill has started to open
    animate(tick, target.tick, {
      ...springFor(TICK_SPRING, reduced),
      delay: status === 'success' ? TICK_DELAY_MS / 1000 : 0,
    })
  }, [status, reduced, width, label, spinner, done, tint, tick])

  useEffect(
    () => () => [width, label, spinner, done, tint, tick].forEach((value) => value.stop()),
    [width, label, spinner, done, tint, tick],
  )

  const tintOpacity = useTransform(tint, [0, 1], [0, 1])
  const labelOpacity = useTransform(label, [0, 1], [0, 1])
  const labelY = useTransform(label, (t) => (1 - t) * LABEL_DROP)
  const spinnerOpacity = useTransform(spinner, [0, 1], [0, 1])
  const spinnerScale = useTransform(
    spinner,
    (p) => SPINNER_MIN_SCALE + (1 - SPINNER_MIN_SCALE) * clamp(p, 0, 1.2),
  )
  const doneOpacity = useTransform(done, [0, 1], [0, 1])
  const doneY = useTransform(done, (d) => (1 - d) * DONE_RISE)
  const tickOffset = useTransform(tick, (k) => TICK_LENGTH * (1 - clamp(k, 0, 1)))

  return {
    width,
    tintOpacity,
    labelOpacity,
    labelY,
    spinnerOpacity,
    spinnerScale,
    doneOpacity,
    doneY,
    tickOffset,
  }
}
