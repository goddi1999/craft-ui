import { animate } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'

import { useLightbox } from './lightbox.context'
import type { Point } from './lightbox.types'
import {
  DISMISS_DISTANCE,
  DISMISS_VELOCITY,
  DOUBLE_TAP_DELAY,
  DOUBLE_TAP_DISTANCE,
  DRAG_THRESHOLD,
  SETTLE_SPRING,
  SWIPE_DISTANCE,
  SWIPE_VELOCITY,
  clamp,
  distance,
  rubberBand,
} from './lightbox.utils'

type Mode = 'idle' | 'pending' | 'swipe' | 'pull' | 'pan' | 'pinch'

type Sample = { time: number; x: number; y: number }

/** Velocity (px/s) over the last 100ms of pointer samples. */
function velocityOf(samples: Sample[]) {
  const last = samples.at(-1)
  const first = samples.find((sample) => last && last.time - sample.time <= 100)
  if (!last || !first || last.time === first.time) return { x: 0, y: 0 }
  const seconds = (last.time - first.time) / 1000
  return { x: (last.x - first.x) / seconds, y: (last.y - first.y) / seconds }
}

/**
 * One pointer on one slide:
 * - zoomed out: a horizontal drag swipes between slides, a vertical drag
 *   pulls the photo down to dismiss;
 * - zoomed in: a drag pans, two fingers pinch, the wheel zooms or pans;
 * - a quick double tap/click toggles zoom at that point.
 * Native listeners, because `wheel` has to be non-passive to stop the page.
 */
export function useZoomGestures(ref: RefObject<HTMLElement | null>, active: boolean) {
  const lightbox = useLightbox()
  // Handlers read the latest context without re-binding mid-gesture.
  const latest = useRef(lightbox)
  useLayoutEffect(() => {
    latest.current = lightbox
  })

  useEffect(() => {
    const element = ref.current
    if (!element || !active) return

    const { zoom, slides } = latest.current
    const pointers = new Map<number, Point>()
    let mode: Mode = 'idle'
    let origin: Point = { x: 0, y: 0 }
    let panOrigin: Point = { x: 0, y: 0 }
    let pinch = { distance: 1, scale: 1, midpoint: { x: 0, y: 0 } }
    let samples: Sample[] = []
    let lastTap: (Point & { time: number }) | null = null
    // Decided on pointer down: a captured pointer retargets later events to the slide.
    let onMedia = false

    // Points are measured from the slide's centre, the transform origin.
    const fromCenter = (point: Point): Point => {
      const rect = element.getBoundingClientRect()
      return {
        x: point.x - (rect.left + rect.width / 2),
        y: point.y - (rect.top + rect.height / 2),
      }
    }

    const midpointOf = (): Point => {
      const [a, b] = [...pointers.values()]
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    }

    const track = (event: PointerEvent) => {
      samples.push({ time: event.timeStamp, x: event.clientX, y: event.clientY })
      samples = samples.filter((sample) => event.timeStamp - sample.time <= 200)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      element.setPointerCapture(event.pointerId)
      onMedia = !!(event.target as HTMLElement).closest('[data-slot="lightbox-media"]')
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (pointers.size === 1) {
        mode = 'pending'
        origin = { x: event.clientX, y: event.clientY }
        panOrigin = { x: zoom.x.get(), y: zoom.y.get() }
        samples = []
        track(event)
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        mode = 'pinch'
        latest.current.draggedRef.current = true
        pinch = {
          distance: Math.max(distance(a, b), 1),
          scale: zoom.scale.get(),
          midpoint: midpointOf(),
        }
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (mode === 'pinch' && pointers.size >= 2) {
        const [a, b] = [...pointers.values()]
        const midpoint = midpointOf()
        zoom.zoomTo(
          (pinch.scale * distance(a, b)) / pinch.distance,
          fromCenter(midpoint),
          false,
        )
        zoom.panBy(midpoint.x - pinch.midpoint.x, midpoint.y - pinch.midpoint.y)
        pinch.midpoint = midpoint
        return
      }
      if (pointers.size !== 1) return

      const dx = event.clientX - origin.x
      const dy = event.clientY - origin.y
      track(event)

      if (mode === 'pending' && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        latest.current.draggedRef.current = true
        if (zoom.scale.get() > 1.01) mode = 'pan'
        else mode = Math.abs(dx) > Math.abs(dy) ? 'swipe' : 'pull'
        if (mode === 'pull') latest.current.setPulling(true)
      }

      if (mode === 'pan') {
        zoom.panTo(panOrigin.x + dx, panOrigin.y + dy)
      } else if (mode === 'swipe') {
        const blocked =
          (dx > 0 && latest.current.indexRef.current === 0) ||
          (dx < 0 && latest.current.indexRef.current === latest.current.total - 1)
        slides.dragX.set(rubberBand(dx, blocked))
      } else if (mode === 'pull') {
        slides.dragY.set(dy * 0.6)
      }
    }

    const finish = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return
      pointers.delete(event.pointerId)
      if (pointers.size > 0) return

      const wasMode = mode
      mode = 'idle'
      const velocity = velocityOf(samples)

      if (wasMode === 'swipe') {
        const dx = event.clientX - origin.x
        const flick = Math.abs(velocity.x) > SWIPE_VELOCITY
        const direction =
          (Math.abs(dx) > SWIPE_DISTANCE || flick) && dx !== 0 ? (dx < 0 ? 1 : -1) : 0
        const current = latest.current.indexRef.current
        const target = clamp(current + direction, 0, Math.max(latest.current.total - 1, 0))
        latest.current.goTo(target)
        slides.settle(target, velocity.x)
      } else if (wasMode === 'pull') {
        const dy = slides.dragY.get()
        if (Math.abs(dy) > DISMISS_DISTANCE * 0.6 || Math.abs(velocity.y) > DISMISS_VELOCITY) {
          latest.current.close()
        } else {
          animate(slides.dragY, 0, SETTLE_SPRING).then(() => latest.current.setPulling(false))
        }
      } else if (wasMode === 'pending' && event.type === 'pointerup') {
        // A tap: two within a short time and distance toggle zoom.
        const tap = { x: event.clientX, y: event.clientY, time: event.timeStamp }
        if (
          lastTap &&
          tap.time - lastTap.time < DOUBLE_TAP_DELAY &&
          distance(tap, lastTap) < DOUBLE_TAP_DISTANCE &&
          onMedia
        ) {
          const { zoomStep } = zoom.configRef.current
          if (zoom.scale.get() > 1.01) zoom.zoomTo(1)
          else zoom.zoomTo(zoomStep, fromCenter(tap))
          lastTap = null
        } else {
          lastTap = tap
        }
      }
    }

    const onWheel = (event: WheelEvent) => {
      const { scrollToZoom, wheelSensitivity } = zoom.configRef.current
      if (event.ctrlKey || scrollToZoom) {
        event.preventDefault()
        // A trackpad pinch reports tiny deltas, a mouse wheel large ones.
        const divisor = event.ctrlKey ? wheelSensitivity : wheelSensitivity * 3
        zoom.zoomTo(
          zoom.scale.get() * Math.exp(-event.deltaY / divisor),
          fromCenter({ x: event.clientX, y: event.clientY }),
          false,
        )
      } else if (zoom.scale.get() > 1.01) {
        event.preventDefault()
        zoom.panBy(-event.deltaX, -event.deltaY)
      }
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', finish)
    element.addEventListener('pointercancel', finish)
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', finish)
      element.removeEventListener('pointercancel', finish)
      element.removeEventListener('wheel', onWheel)
    }
  }, [active, ref])
}
