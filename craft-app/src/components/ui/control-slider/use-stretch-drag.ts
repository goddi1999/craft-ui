import { animate, useMotionValue, type MotionValue } from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'

import { SNAP_BACK, TAP_SLOP } from './control-slider.constants'
import { clamp01, rubberBand } from './control-slider.utils'

type DragOptions = {
  value: number
  height: number
  /** px the tile may stretch at most */
  limit: number
  reduced: boolean
  onChange: (value: number) => void
  onCommit: (value: number) => void
  onTap: () => void
}

/**
 * Relative drag, like Control Center: the press point does not jump the value, the movement
 * does. Past either end the drag turns into stretch (+ up, − down) that springs back on release.
 */
export function useStretchDrag({
  value,
  height,
  limit,
  reduced,
  onChange,
  onCommit,
  onTap,
}: DragOptions): {
  stretch: MotionValue<number>
  dragging: boolean
  handlers: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => void
    onPointerMove: (event: PointerEvent<HTMLElement>) => void
    onPointerUp: (event: PointerEvent<HTMLElement>) => void
    onPointerCancel: (event: PointerEvent<HTMLElement>) => void
  }
} {
  const stretch = useMotionValue(0)
  const [dragging, setDragging] = useState(false)
  // the pointer that owns the drag; capture alone is not enough when it is refused
  const start = useRef({ id: -1, y: 0, value: 0, moved: false, last: 0 })

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // a pointer the browser no longer tracks; the id check below still scopes the drag
    }
    start.current = { id: event.pointerId, y: event.clientY, value, moved: false, last: value }
    stretch.stop()
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerId !== start.current.id) return
    const dy = event.clientY - start.current.y
    if (Math.abs(dy) > TAP_SLOP) start.current.moved = true
    if (!start.current.moved) return

    const raw = start.current.value - dy / height
    const next = clamp01(raw)
    if (next !== start.current.last) {
      start.current.last = next
      onChange(next)
    }
    const over = raw > 1 ? (raw - 1) * height : raw < 0 ? raw * height : 0
    stretch.set(reduced ? 0 : rubberBand(over, limit))
  }

  const finish = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerId !== start.current.id) return
    start.current.id = -1
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
    if (start.current.moved) onCommit(start.current.last)
    else onTap()
    animate(stretch, 0, SNAP_BACK)
  }

  return {
    stretch,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
  }
}
