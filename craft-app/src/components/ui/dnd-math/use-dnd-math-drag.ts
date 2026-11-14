import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { animate, useMotionValue } from 'motion/react'

import { DRAG_THRESHOLD, RETURN } from './dnd-math.constants'
import type { DnDMathBlock, DnDMathValue } from './dnd-math.types'

/** What is being carried: a new block from the palette, or a worked-out value. */
export type DragPayload =
  { type: 'block'; block: DnDMathBlock } | { type: 'value'; from: string; value: DnDMathValue }

/** Where it would land: between rows (with the line's y in the canvas), or onto a row. */
export type DropTarget = { type: 'gap'; index: number; y: number } | { type: 'row'; rowId: string }

export type DragSession = {
  payload: DragPayload
  /** Size of the picked-up element, so the floating copy matches it. */
  width: number
  height: number
  phase: 'dragging' | 'returning'
}

type Options = {
  /** Where the pointer would drop the payload right now, or `null` for nowhere. */
  resolveTarget: (payload: DragPayload, x: number, y: number) => DropTarget | null
  /** Applies the drop. `false` rejects it and the copy springs back. */
  onDrop: (payload: DragPayload, target: DropTarget) => boolean
  disabled?: boolean
  reducedMotion?: boolean
}

const sameTarget = (a: DropTarget | null, b: DropTarget | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    (a.type === 'gap' && b.type === 'gap'
      ? a.index === b.index && a.y === b.y
      : a.type === 'row' && b.type === 'row' && a.rowId === b.rowId))

/**
 * Pointer drag for the canvas: a press becomes a drag after a few pixels, a floating copy follows
 * the pointer from where it was grabbed (no jump to the centre), the drop target is resolved on
 * every move, and a drop nowhere (or Escape) springs the copy back to where it came from.
 * A press that never moves is a click, so every source also works by tap and keyboard.
 */
export function useDnDMathDrag({ resolveTarget, onDrop, disabled, reducedMotion }: Options) {
  const [session, setSession] = useState<DragSession | null>(null)
  const [target, setTarget] = useState<DropTarget | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const draggedRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const latest = useRef({ resolveTarget, onDrop })

  useEffect(() => {
    latest.current = { resolveTarget, onDrop }
  })
  useEffect(() => () => cleanupRef.current?.(), [])

  const startPress = (event: PointerEvent<HTMLElement>, payload: DragPayload) => {
    // one pointer at a time; a second finger mid-drag is ignored
    if (disabled || cleanupRef.current || event.button !== 0) return
    const element = event.currentTarget
    const origin = element.getBoundingClientRect()
    const grabX = event.clientX - origin.left
    const grabY = event.clientY - origin.top
    const startX = event.clientX
    const startY = event.clientY
    let started = false
    let current: DropTarget | null = null
    draggedRef.current = false

    const place = (clientX: number, clientY: number) => {
      x.set(clientX - grabX)
      y.set(clientY - grabY)
    }

    const move = (moveEvent: globalThis.PointerEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return
      if (!started) {
        if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < DRAG_THRESHOLD)
          return
        started = true
        draggedRef.current = true
        document.documentElement.dataset.dndMathDragging = 'true'
        setSession({ payload, width: origin.width, height: origin.height, phase: 'dragging' })
      }
      moveEvent.preventDefault()
      place(moveEvent.clientX, moveEvent.clientY)
      const next = latest.current.resolveTarget(payload, moveEvent.clientX, moveEvent.clientY)
      if (!sameTarget(next, current)) {
        current = next
        setTarget(next)
      }
    }

    const finish = (commit: boolean) => {
      cleanup()
      if (!started) return
      // the drag's own click fires right after pointerup; any later click is a real one,
      // even when the drag ended over another element and the source never saw that click
      window.setTimeout(() => {
        draggedRef.current = false
      })
      setTarget(null)
      const landed = commit && current !== null && latest.current.onDrop(payload, current)
      if (landed || reducedMotion) {
        setSession(null)
        return
      }
      // nowhere to land: spring back to where it was picked up
      setSession((s) => (s ? { ...s, phase: 'returning' } : s))
      animate(x, origin.left, RETURN)
      animate(y, origin.top, RETURN).then(() => setSession(null))
    }

    const up = (upEvent: globalThis.PointerEvent) => {
      if (upEvent.pointerId === event.pointerId) finish(true)
    }
    const cancel = (cancelEvent: globalThis.PointerEvent) => {
      if (cancelEvent.pointerId === event.pointerId) finish(false)
    }
    const key = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') finish(false)
    }
    const cleanup = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      window.removeEventListener('keydown', key)
      delete document.documentElement.dataset.dndMathDragging
      cleanupRef.current = null
    }

    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    window.addEventListener('keydown', key)
    cleanupRef.current = cleanup
  }

  /** Props for anything that can be picked up. `onActivate` runs on a plain click or Enter. */
  const sourceProps = (payload: DragPayload, onActivate: () => void) => ({
    onPointerDown: (event: PointerEvent<HTMLElement>) => startPress(event, payload),
    onClick: (event: MouseEvent<HTMLElement>) => {
      // the click that ends a drag is not an activation
      if (draggedRef.current) {
        draggedRef.current = false
        event.preventDefault()
        return
      }
      if (!disabled) onActivate()
    },
  })

  return { session, target, x, y, sourceProps }
}
