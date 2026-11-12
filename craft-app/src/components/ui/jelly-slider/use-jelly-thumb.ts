import {
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import {
  ARROW_FRACTION,
  BUBBLE_SPRING,
  DROP_REST_SCALE,
  DROP_RISE,
  FOLLOW_SPRING,
  GLIDE_SPRING,
  HOVER_SCALE,
  LEAN_PER_PX,
  LEAN_SPRING,
  MAX_LEAN,
  MAX_STRETCH,
  PAGE_FRACTION,
  PRESS_SCALE,
  PRESS_SPRING,
  RELEASE_SPRING,
  STRETCH_SPEED,
  THUMB_RADIUS,
  TRACK_CENTER,
} from './jelly-slider.constants'
import { clamp, rubber, settle, snap, toPx, toValue, type Range } from './jelly-slider.utils'

type Spring = { stiffness: number; damping: number }

type UseJellyThumbOptions = Range & {
  value: number
  disabled: boolean
  reduced: boolean
  onChange: (value: number) => void
  onCommit: (value: number) => void
}

const R = THUMB_RADIUS

/**
 * The thumb, the drop and the fill as motion values, so dragging never re-renders.
 * The thumb follows the pointer through a spring and stretches with its speed;
 * the drop chases it a little late, so it leans the way it is dragged from.
 */
export function useJellyThumb({
  value,
  min,
  max,
  step,
  disabled,
  reduced,
  onChange,
  onCommit,
}: UseJellyThumbOptions) {
  const range = { min, max, step }
  const railRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  // width is 0 until measured, toPx and toValue stay inverse at any width
  const width = useMotionValue(0)
  const x = useMotionValue(toPx(value, 0, range))
  const target = useRef(toPx(value, 0, range))
  const dropX = useSpring(x, settle(LEAN_SPRING, reduced))
  const dropY = useMotionValue(TRACK_CENTER)
  const dropScale = useMotionValue(DROP_REST_SCALE)
  const press = useMotionValue(1)

  const dragging = useRef(false)
  const hovered = useRef(false)
  // the drop stays up while the thumb has keyboard focus, so the value is its focus state
  const lifted = useRef(false)
  const look = useRef({ up: false, scale: 1 })

  const velocity = useVelocity(x)
  const stretchOf = (speed: number) => 1 + Math.min(Math.abs(speed) / STRETCH_SPEED, MAX_STRETCH)
  // area preserving: longer along the track, thinner across it
  const thumbScaleX = useTransform([velocity, press], ([speed, scale]: number[]) => stretchOf(speed) * scale)
  const thumbScaleY = useTransform([velocity, press], ([speed, scale]: number[]) => scale / stretchOf(speed))
  const lean = useTransform([dropX, x], ([drop, thumb]: number[]) =>
    clamp((drop - thumb) * LEAN_PER_PX, -MAX_LEAN, MAX_LEAN),
  )
  const labelOpacity = useTransform(dropScale, (scale) => clamp((scale - 0.7) / 0.25, 0, 1))
  // the fill ends under the thumb centre and is gone by the time the thumb sits at the start
  const fillWidth = useTransform([x, width], ([px, w]: number[]) =>
    clamp(px, 0, Math.max(w, 0)) * clamp((px - R) / R, 0, 1),
  )
  const shown = useTransform([x, width], ([px, w]: number[]) => toValue(px, w, range))

  function moveTo(px: number, spring: Spring) {
    target.current = px
    animate(x, px, settle(spring, reduced))
  }

  function sync() {
    const up = dragging.current || lifted.current
    const scale = dragging.current ? PRESS_SCALE : hovered.current ? HOVER_SCALE : 1
    if (up !== look.current.up) {
      const bubble = settle(BUBBLE_SPRING, reduced)
      animate(dropY, up ? TRACK_CENTER + DROP_RISE : TRACK_CENTER, bubble)
      animate(dropScale, up ? 1 : DROP_REST_SCALE, bubble)
    }
    if (scale !== look.current.scale) animate(press, scale, settle(PRESS_SPRING, reduced))
    look.current = { up, scale }
  }

  const ends = () => [R, Math.max(width.get() - R, R)] as const

  function follow(clientX: number) {
    const rail = railRef.current
    if (!rail) return
    const [start, end] = ends()
    const px = rubber(clientX - rail.getBoundingClientRect().left, start, end)
    moveTo(px, FOLLOW_SPRING)
    onChange(toValue(px, width.get(), range))
  }

  useLayoutEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const measure = () => {
      const next = rail.clientWidth
      const previous = width.get()
      if (!next || next === previous) return
      // keep the thumb at the same spot along the track, without a spring
      const ratio = clamp((target.current - R) / Math.max(previous - 2 * R, 1), 0, 1)
      const px = R + ratio * Math.max(next - 2 * R, 1)
      width.set(next)
      target.current = px
      x.jump(px)
      dropX.jump(px)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [width, x, dropX])

  // a value from outside (controlled, or a reset) glides there; our own drags already moved
  useEffect(() => {
    if (dragging.current) return
    const bounds = { min, max, step }
    const w = width.get()
    if (toValue(target.current, w, bounds) === snap(value, bounds)) return
    target.current = toPx(value, w, bounds)
    animate(x, target.current, settle(GLIDE_SPRING, reduced))
  }, [value, min, max, step, reduced, width, x])

  useEffect(
    () => () => {
      x.stop()
      dropY.stop()
      dropScale.stop()
      press.stop()
    },
    [x, dropY, dropScale, press],
  )

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    // no text selection or native focus; focus moves to the thumb below
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragging.current = true
    follow(event.clientX)
    sync()
    thumbRef.current?.focus({ preventScroll: true })
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragging.current) follow(event.clientX)
  }

  function handlePointerEnd() {
    if (!dragging.current) return
    dragging.current = false
    const [start, end] = ends()
    // an over-drag snaps back with the bouncier release spring
    moveTo(clamp(target.current, start, end), RELEASE_SPRING)
    sync()
    onCommit(toValue(target.current, width.get(), range))
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    hovered.current = true
    sync()
  }

  function handlePointerLeave() {
    hovered.current = false
    sync()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const span = max - min
    const arrow = Math.max(step, span * ARROW_FRACTION)
    const page = Math.max(step, span * PAGE_FRACTION)
    const current = toValue(target.current, width.get(), range)
    const moves: Record<string, number> = {
      ArrowRight: current + arrow,
      ArrowUp: current + arrow,
      ArrowLeft: current - arrow,
      ArrowDown: current - arrow,
      PageUp: current + page,
      PageDown: current - page,
      Home: min,
      End: max,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = snap(moves[event.key], range)
    moveTo(toPx(next, width.get(), range), GLIDE_SPRING)
    onChange(next)
    onCommit(next)
    lifted.current = true
    sync()
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    // a click focuses the thumb too; only keyboard focus lifts the drop
    if (!event.currentTarget.matches(':focus-visible')) return
    lifted.current = true
    sync()
  }

  function handleBlur() {
    lifted.current = false
    sync()
  }

  return {
    railRef,
    thumbRef,
    values: {
      x,
      dropX,
      dropY,
      dropScale,
      thumbScaleX,
      thumbScaleY,
      lean,
      labelOpacity,
      fillWidth,
      shown,
    },
    railHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
      onLostPointerCapture: handlePointerEnd,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },
    thumbHandlers: {
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  }
}
