import { useEffect, useState, type PointerEvent, type RefObject } from 'react'

import { toElementPoint, type ImagePinPoint } from '@/components/ui/image-pin'

import { TOUCH_LIFT_PX } from './pin-shatter.constants'

export type PinDrag = {
  clientX: number
  clientY: number
  lift: number
  /** Whether the lifted pin is over the surface right now. */
  overSurface: boolean
}

/**
 * Drags the docked pin over `surfaceRef`. `onDrop` gets the 0..1 point inside
 * the surface, or null when the pin is released outside it. Window listeners
 * keep the drag alive after the dock pin unmounts under the pointer.
 */
export function usePinDrag(
  surfaceRef: RefObject<HTMLElement | null>,
  onDrop: (point: ImagePinPoint | null) => void,
) {
  const [drag, setDrag] = useState<PinDrag | null>(null)
  const isDragging = drag !== null
  const lift = drag?.lift ?? 0

  useEffect(() => {
    if (!isDragging) return
    const handleMove = (event: globalThis.PointerEvent) =>
      setDrag({
        clientX: event.clientX,
        clientY: event.clientY,
        lift,
        overSurface:
          toElementPoint(surfaceRef.current, event.clientX, event.clientY - lift) !==
          null,
      })
    const handleUp = (event: globalThis.PointerEvent) => {
      onDrop(toElementPoint(surfaceRef.current, event.clientX, event.clientY - lift))
      setDrag(null)
    }
    const handleCancel = () => setDrag(null)
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleCancel)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleCancel)
    }
  }, [isDragging, lift, onDrop, surfaceRef])

  const start = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.focus()
    setDrag({
      clientX: event.clientX,
      clientY: event.clientY,
      lift: event.pointerType === 'touch' ? TOUCH_LIFT_PX : 0,
      overSurface: false,
    })
  }

  return { drag, start }
}
