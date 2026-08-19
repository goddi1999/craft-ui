import { useEffect, useRef } from 'react'

/**
 * Grab-and-drag horizontal scrolling for a scroll container. Pointer events
 * cover mouse and pen; touch keeps the browser's native momentum scrolling.
 */
export function useDragScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T | null>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    let startX = 0
    let startScrollLeft = 0
    let activePointerId: number | null = null

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      activePointerId = event.pointerId
      startX = event.clientX
      startScrollLeft = element.scrollLeft
      element.setPointerCapture(event.pointerId)
      element.style.cursor = 'grabbing'
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return
      event.preventDefault()
      element.scrollLeft = startScrollLeft - (event.clientX - startX)
    }

    const handlePointerRelease = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return
      activePointerId = null
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId)
      }
      element.style.cursor = 'grab'
    }

    element.style.cursor = 'grab'
    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerup', handlePointerRelease)
    element.addEventListener('pointercancel', handlePointerRelease)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerup', handlePointerRelease)
      element.removeEventListener('pointercancel', handlePointerRelease)
    }
  }, [])

  return scrollRef
}
