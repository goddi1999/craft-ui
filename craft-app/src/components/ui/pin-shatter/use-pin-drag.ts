import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'

import { toElementPoint, type ImagePinPoint } from '@/components/ui/image-pin'

import { MOVE_THRESHOLD_PX, TOUCH_LIFT_PX } from './pin-shatter.constants'

/** Where the dragged pin came from: the dock, or the image it is being moved on. */
export type PinDragSource = 'dock' | 'move'

export type PinDrag = {
  source: PinDragSource
  clientX: number
  clientY: number
  /** Pointer offset from the pin's centre when it was grabbed, so it never jumps. */
  grabX: number
  grabY: number
  lift: number
  /** Whether the lifted pin is over the surface right now. */
  overSurface: boolean
}

type Session = PinDrag & {
  /** False until a press on a placed pin has travelled past the click threshold. */
  active: boolean
  startX: number
  startY: number
}

/**
 * Drags the pin over `surfaceRef`. A press on the docked pin lifts it at once;
 * a press on a placed pin waits until the pointer travels a few px, so a plain
 * click still reaches the pin. `onDrop` gets the 0..1 point inside the surface,
 * or null when the pin is released outside it. Window listeners keep the drag
 * alive after the pin unmounts under the pointer.
 * `drag` is set only while a pin is actually lifted.
 */
export function usePinDrag(
  surfaceRef: RefObject<HTMLElement | null>,
  onDrop: (point: ImagePinPoint | null, source: PinDragSource) => void,
) {
  const [session, setSession] = useState<Session | null>(null)
  const sessionRef = useRef<Session | null>(null)
  const isPressed = session !== null

  const update = (next: Session | null) => {
    sessionRef.current = next
    setSession(next)
  }

  useEffect(() => {
    if (!isPressed) return

    const handleMove = (event: globalThis.PointerEvent) => {
      const current = sessionRef.current
      if (!current) return
      const active =
        current.active ||
        Math.hypot(event.clientX - current.startX, event.clientY - current.startY) >
          MOVE_THRESHOLD_PX
      update({
        ...current,
        active,
        clientX: event.clientX,
        clientY: event.clientY,
        overSurface:
          toElementPoint(
            surfaceRef.current,
            event.clientX - current.grabX,
            event.clientY - current.grabY - current.lift,
          ) !== null,
      })
    }
    const handleUp = (event: globalThis.PointerEvent) => {
      const current = sessionRef.current
      update(null)
      if (!current?.active) return
      onDrop(
        toElementPoint(
          surfaceRef.current,
          event.clientX - current.grabX,
          event.clientY - current.grabY - current.lift,
        ),
        current.source,
      )
    }
    const handleCancel = () => update(null)

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleCancel)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleCancel)
    }
  }, [isPressed, onDrop, surfaceRef])

  const begin = (
    event: PointerEvent<HTMLElement>,
    source: PinDragSource,
  ) => {
    if (event.button !== 0) return
    const box = event.currentTarget.getBoundingClientRect()
    update({
      source,
      active: source === 'dock',
      startX: event.clientX,
      startY: event.clientY,
      clientX: event.clientX,
      clientY: event.clientY,
      grabX: source === 'move' ? event.clientX - (box.left + box.width / 2) : 0,
      grabY: source === 'move' ? event.clientY - (box.top + box.height / 2) : 0,
      lift: event.pointerType === 'touch' ? TOUCH_LIFT_PX : 0,
      overSurface: source === 'move',
    })
  }

  /** Press on the docked pin: lifts at once. */
  const start = (event: PointerEvent<HTMLElement>) => {
    event.preventDefault()
    event.currentTarget.focus()
    begin(event, 'dock')
  }

  /** Press on a placed pin: lifts only once the pointer travels, so a click still pops it. */
  const startMove = (event: PointerEvent<HTMLElement>) => begin(event, 'move')

  return { drag: session?.active ? session : null, start, startMove }
}
