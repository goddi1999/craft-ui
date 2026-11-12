import { useRef, type PointerEvent } from 'react'

import { clamp } from './color-picker.utils'

/**
 * Tracks one pointer dragging over an element and reports where it is as fractions of the
 * element's box. Spread the result onto the element.
 */
export function usePointerPad(
  onMove: (x: number, y: number) => void,
  onActive: (active: boolean) => void,
) {
  const pointer = useRef<number | null>(null)

  const read = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    onMove(
      clamp((event.clientX - box.left) / box.width),
      clamp((event.clientY - box.top) / box.height),
    )
  }

  const release = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerId !== pointer.current) return
    pointer.current = null
    onActive(false)
  }

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0 || pointer.current !== null) return
      pointer.current = event.pointerId
      event.currentTarget.setPointerCapture(event.pointerId)
      onActive(true)
      read(event)
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (event.pointerId === pointer.current) read(event)
    },
    onPointerUp: release,
    onPointerCancel: release,
  }
}
