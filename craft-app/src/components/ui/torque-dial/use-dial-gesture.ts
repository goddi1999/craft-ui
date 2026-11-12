import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { FLING_WINDOW, FRICTION, MIN_FLING, REST_VELOCITY } from './torque-dial.constants'
import { keyToValue, pointerAngle, snap, turnBetween, turnToValue } from './torque-dial.utils'

type DialGestureOptions = {
  value: number
  min: number
  max: number
  step: number
  disabled: boolean
  momentum: boolean
  onChange: (value: number) => void
  onChangeEnd?: () => void
}

/**
 * Turns the dial by drag, flick, wheel and keys. A drag adds up the exact turn, so slow
 * movements still count, and a flick keeps spinning until friction stops it.
 */
export function useDialGesture({
  value,
  min,
  max,
  step,
  disabled,
  momentum,
  onChange,
  onChangeEnd,
}: DialGestureOptions) {
  const dialRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  // the last value we know of, and the unsnapped value a drag or spin has turned to
  const latest = useRef(value)
  const exact = useRef(value)
  const spinFrame = useRef<number | null>(null)
  const endDrag = useRef<(() => void) | null>(null)
  // window listeners outlive the render they were added in, so they read callbacks from here
  const callbacks = useRef({ onChange, onChangeEnd })

  useEffect(() => {
    // a value from outside resets the exact turn too
    if (value !== latest.current) exact.current = value
    latest.current = value
  }, [value])

  useEffect(() => {
    callbacks.current = { onChange, onChangeEnd }
  }, [onChange, onChangeEnd])

  useEffect(
    () => () => {
      endDrag.current?.()
      if (spinFrame.current !== null) cancelAnimationFrame(spinFrame.current)
    },
    [],
  )

  const emit = (next: number) => {
    if (next === latest.current) return
    latest.current = next
    callbacks.current.onChange(next)
  }

  const setValue = (next: number) => {
    exact.current = next
    emit(next)
  }

  const turn = (degrees: number) => {
    exact.current = Math.min(max, Math.max(min, exact.current + turnToValue(degrees, min, max)))
    emit(snap(exact.current, min, max, step))
  }

  const stopSpin = () => {
    if (spinFrame.current === null) return
    cancelAnimationFrame(spinFrame.current)
    spinFrame.current = null
  }

  const spin = (velocity: number) => {
    const tick = () => {
      velocity *= FRICTION
      if (Math.abs(velocity) <= REST_VELOCITY) {
        spinFrame.current = null
        callbacks.current.onChangeEnd?.()
        return
      }
      turn(velocity)
      spinFrame.current = requestAnimationFrame(tick)
    }
    spinFrame.current = requestAnimationFrame(tick)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return
    stopSpin()
    setDragging(true)
    exact.current = latest.current

    // measured on every move, so scrolling mid-drag keeps the centre right
    const angleAt = (x: number, y: number) => {
      const rect = dialRef.current?.getBoundingClientRect()
      return rect ? pointerAngle(rect, x, y) : 0
    }
    let angle = angleAt(event.clientX, event.clientY)
    let velocity = 0
    let movedAt = event.timeStamp

    const move = (moveEvent: globalThis.PointerEvent) => {
      const next = angleAt(moveEvent.clientX, moveEvent.clientY)
      velocity = turnBetween(angle, next)
      angle = next
      movedAt = moveEvent.timeStamp
      turn(velocity)
    }

    const finish = (upEvent: globalThis.PointerEvent) => {
      endDrag.current?.()
      setDragging(false)
      // holding still before letting go, or a cancelled pointer, should not fling it
      const flung =
        upEvent.type === 'pointerup' &&
        upEvent.timeStamp - movedAt < FLING_WINDOW &&
        Math.abs(velocity) > MIN_FLING
      if (momentum && flung) spin(velocity)
      else callbacks.current.onChangeEnd?.()
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    endDrag.current = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      endDrag.current = null
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const next = keyToValue(event.key, latest.current, min, max, step)
    if (next === null) return
    event.preventDefault()
    setValue(next)
  }

  const onDoubleClick = () => {
    if (!disabled) setValue(snap((max + min) / 2, min, max, step))
  }

  const onWheel = useEffectEvent((event: WheelEvent) => {
    event.preventDefault()
    setValue(snap(latest.current + (event.deltaY < 0 ? step : -step), min, max, step))
  })

  // react's onWheel is passive and can't stop the page scrolling, so this listens directly
  useEffect(() => {
    const el = dialRef.current
    if (!el || disabled) return
    const listener = (event: WheelEvent) => onWheel(event)
    el.addEventListener('wheel', listener, { passive: false })
    return () => el.removeEventListener('wheel', listener)
  }, [disabled])

  return { dialRef, dragging, handlers: { onPointerDown, onKeyDown, onDoubleClick } }
}
