import gsap from 'gsap'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import {
  FRONT_OFFSET,
  LINE,
  RADIUS,
  STEP_DEG,
  TOTAL,
  mod,
  stepsFromOffset,
} from './barrel-time-input.utils'

/** Who moved the barrel: the person (commits values) or code (silent sync). */
export type BarrelDriver = 'user' | 'program'

type UseBarrelColumnOptions = {
  initialIndex: number
  /** Infinite ring (hours, minutes) or a bounded list of rows `0..max`. */
  wrap: boolean
  max: number
  onIndexChange: (index: number, previous: number, driver: BarrelDriver) => void
}

type DragState = {
  pointerId: number
  startY: number
  startPos: number
  moved: boolean
  samples: { time: number; pos: number }[]
}

const DRAG_THRESHOLD = 4
const VELOCITY_WINDOW = 100
const THROW_PROJECTION = 250
const WHEEL_SENSITIVITY = LINE * 1.25
const WHEEL_SETTLE_DELAY = 120
const OVERSCROLL_RESISTANCE = 0.3

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Drives one barrel: a continuous position (in rows) rendered straight to the
 * DOM, moved by pointer drags with inertia, the mouse wheel, taps on nearby
 * rows, and programmatic tweens.
 */
export function useBarrelColumn({
  initialIndex,
  wrap,
  max,
  onIndexChange,
}: UseBarrelColumnOptions) {
  const columnRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const posRef = useRef(initialIndex)
  const indexRef = useRef(initialIndex)
  const targetRef = useRef<number | null>(initialIndex)
  const driverRef = useRef<BarrelDriver>('program')
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const settleTimerRef = useRef(0)
  const onIndexChangeRef = useRef(onIndexChange)

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange
  })

  const clampIndex = useCallback(
    (index: number) => (wrap ? index : clamp(index, 0, max)),
    [wrap, max],
  )

  const setPosition = useCallback(
    (pos: number) => {
      posRef.current = pos

      const wheel = wheelRef.current
      const track = trackRef.current
      if (wheel) {
        wheel.style.transform = `translateZ(${-(RADIUS + FRONT_OFFSET)}px) rotateX(${pos * STEP_DEG}deg)`
      }
      if (track) {
        const row = wrap ? mod(pos, TOTAL) : pos
        track.style.transform = `translateY(${-row * LINE}px)`
      }

      const index = clampIndex(Math.round(pos))
      if (index === indexRef.current) return
      const previous = indexRef.current
      indexRef.current = index
      onIndexChangeRef.current(index, previous, driverRef.current)
    },
    [wrap, clampIndex],
  )

  const stop = useCallback(() => {
    tweenRef.current?.kill()
    tweenRef.current = null
    window.clearTimeout(settleTimerRef.current)
  }, [])

  const animateTo = useCallback(
    (target: number, duration: number) => {
      stop()
      targetRef.current = target
      if (duration <= 0 || prefersReducedMotion()) {
        setPosition(target)
        return
      }
      const proxy = { pos: posRef.current }
      tweenRef.current = gsap.to(proxy, {
        pos: target,
        duration,
        ease: 'power3.out',
        onUpdate: () => setPosition(proxy.pos),
        onComplete: () => {
          tweenRef.current = null
        },
      })
    },
    [setPosition, stop],
  )

  /** Silent move used to mirror external values — never commits. */
  const moveTo = useCallback(
    (index: number) => {
      driverRef.current = 'program'
      animateTo(clampIndex(index), 0.35)
    },
    [animateTo, clampIndex],
  )

  /** Person-driven step (keyboard), relative to where the barrel is heading. */
  const step = useCallback(
    (delta: number) => {
      driverRef.current = 'user'
      const base = targetRef.current ?? Math.round(posRef.current)
      animateTo(clampIndex(base + delta), 0.15)
    },
    [animateTo, clampIndex],
  )

  const getPosition = useCallback(() => posRef.current, [])

  const settle = useCallback(() => {
    animateTo(clampIndex(Math.round(posRef.current)), 0.2)
  }, [animateTo, clampIndex])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      stop()
      targetRef.current = null
      driverRef.current = 'user'
      dragRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startPos: posRef.current,
        moved: false,
        samples: [{ time: event.timeStamp, pos: posRef.current }],
      }
    },
    [stop],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      const deltaY = event.clientY - drag.startY
      if (!drag.moved && Math.abs(deltaY) < DRAG_THRESHOLD) return
      drag.moved = true

      let pos = drag.startPos - deltaY / LINE
      if (!wrap && pos < 0) pos *= OVERSCROLL_RESISTANCE
      if (!wrap && pos > max) pos = max + (pos - max) * OVERSCROLL_RESISTANCE

      setPosition(pos)
      drag.samples.push({ time: event.timeStamp, pos })
      if (drag.samples.length > 8) drag.samples.shift()
    },
    [wrap, max, setPosition],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      dragRef.current = null

      if (!drag.moved) {
        const rect = event.currentTarget.getBoundingClientRect()
        const steps = stepsFromOffset(
          event.clientY - (rect.top + rect.height / 2),
        )
        if (steps !== 0) {
          animateTo(clampIndex(Math.round(posRef.current) + steps), 0.3)
        }
        return
      }

      const recent = drag.samples.filter(
        (sample) => event.timeStamp - sample.time < VELOCITY_WINDOW,
      )
      const first = recent[0]
      const last = recent[recent.length - 1]
      const elapsed = first && last ? last.time - first.time : 0
      const velocity = elapsed > 0 ? (last.pos - first.pos) / elapsed : 0
      const projection = clamp(velocity * THROW_PROJECTION, -30, 30)

      const target = clampIndex(Math.round(posRef.current + projection))
      const distance = Math.abs(target - posRef.current)
      animateTo(target, Math.min(1.2, 0.3 + distance * 0.04))
    },
    [animateTo, clampIndex],
  )

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragRef.current?.pointerId !== event.pointerId) return
      dragRef.current = null
      settle()
    },
    [settle],
  )

  useLayoutEffect(() => {
    setPosition(posRef.current)
  }, [setPosition])

  useEffect(() => {
    const column = columnRef.current
    if (!column) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      stop()
      targetRef.current = null
      driverRef.current = 'user'

      const delta = event.deltaMode === 1 ? event.deltaY * LINE : event.deltaY
      let pos = posRef.current + delta / WHEEL_SENSITIVITY
      if (!wrap) pos = clamp(pos, 0, max)
      setPosition(pos)

      settleTimerRef.current = window.setTimeout(settle, WHEEL_SETTLE_DELAY)
    }

    column.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      column.removeEventListener('wheel', handleWheel)
      stop()
    }
  }, [wrap, max, setPosition, settle, stop])

  return useMemo(
    () => ({
      columnRef,
      wheelRef,
      trackRef,
      moveTo,
      step,
      getPosition,
      pointerHandlers: {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
      },
    }),
    [
      moveTo,
      step,
      getPosition,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    ],
  )
}

export type BarrelColumnController = ReturnType<typeof useBarrelColumn>
