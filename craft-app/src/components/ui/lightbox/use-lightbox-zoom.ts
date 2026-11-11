import { animate, useMotionValue, useMotionValueEvent } from 'motion/react'
import { useCallback, useRef, useState } from 'react'

import type {
  LightboxZoomConfig,
  LightboxZoomController,
  Point,
  ZoomBounds,
} from './lightbox.types'
import { SETTLE_SPRING, clamp } from './lightbox.utils'

const DEFAULT_CONFIG: LightboxZoomConfig = {
  minZoom: 1,
  maxZoom: 4,
  zoomStep: 2,
  scrollToZoom: false,
  wheelSensitivity: 100,
}

const CENTER: Point = { x: 0, y: 0 }

/**
 * Zoom state for the open slide: three motion values (scale + pan) that the
 * active slide's wrapper renders, and the maths to change them. Points are
 * relative to the slide's centre, which is also the transform origin.
 */
export function useLightboxZoom(): LightboxZoomController {
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const configRef = useRef(DEFAULT_CONFIG)
  const boundsRef = useRef<(() => ZoomBounds) | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [canZoomIn, setCanZoomIn] = useState(true)

  useMotionValueEvent(scale, 'change', (value) => {
    setZoomed(value > 1.01)
    setCanZoomIn(value < configRef.current.maxZoom - 0.01)
  })

  // Panning stops at the photo's edge; a photo smaller than the slide stays centred.
  const clampPan = useCallback((panX: number, panY: number, zoom: number) => {
    const bounds = boundsRef.current?.()
    if (!bounds || zoom <= 1.001) return CENTER
    const maxX = Math.max(0, (bounds.media.width * zoom - bounds.container.width) / 2)
    const maxY = Math.max(0, (bounds.media.height * zoom - bounds.container.height) / 2)
    return { x: clamp(panX, -maxX, maxX), y: clamp(panY, -maxY, maxY) }
  }, [])

  const zoomTo = useCallback(
    (next: number, point: Point = CENTER, animated = true) => {
      const { minZoom, maxZoom } = configRef.current
      const current = scale.get()
      const target = clamp(next, minZoom, maxZoom)
      const ratio = target / current
      // Keeps the point under the cursor fixed while the scale changes.
      const pan = clampPan(
        point.x - (point.x - x.get()) * ratio,
        point.y - (point.y - y.get()) * ratio,
        target,
      )
      if (animated) {
        animate(scale, target, SETTLE_SPRING)
        animate(x, pan.x, SETTLE_SPRING)
        animate(y, pan.y, SETTLE_SPRING)
      } else {
        scale.set(target)
        x.set(pan.x)
        y.set(pan.y)
      }
    },
    [clampPan, scale, x, y],
  )

  const zoomBy = useCallback(
    (factor: number, point?: Point) => {
      const target = scale.get() * factor
      // Zooming out lands exactly on 1 instead of hovering just above it.
      zoomTo(target < 1.05 ? 1 : target, point)
    },
    [scale, zoomTo],
  )

  const panTo = useCallback(
    (nextX: number, nextY: number) => {
      const pan = clampPan(nextX, nextY, scale.get())
      x.set(pan.x)
      y.set(pan.y)
    },
    [clampPan, scale, x, y],
  )

  const panBy = useCallback(
    (dx: number, dy: number) => panTo(x.get() + dx, y.get() + dy),
    [panTo, x, y],
  )

  const reset = useCallback(
    (animated = false) => {
      if (animated) {
        animate(scale, 1, SETTLE_SPRING)
        animate(x, 0, SETTLE_SPRING)
        animate(y, 0, SETTLE_SPRING)
      } else {
        scale.jump(1)
        x.jump(0)
        y.jump(0)
      }
    },
    [scale, x, y],
  )

  return {
    scale,
    x,
    y,
    configRef,
    boundsRef,
    zoomed,
    canZoomIn,
    canZoomOut: zoomed,
    zoomTo,
    zoomBy,
    panBy,
    panTo,
    reset,
  }
}
