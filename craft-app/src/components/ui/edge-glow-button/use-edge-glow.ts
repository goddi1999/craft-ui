import { useEffect, useRef } from 'react'

import {
  EDGE_BRIGHTNESS,
  EDGE_OVERSHOOT,
  EDGE_SATURATION,
  GLOW_RISE,
  HUE_SHIFT_DEG,
  MAX_FRAME_STEP,
  REST_DISTANCE,
  REST_VELOCITY,
  SPRING_DAMPING,
  SPRING_FREQUENCY,
} from './edge-glow-button.constants'

/**
 * Drives the light inside the button and the glow on its edges with a damped spring.
 * Everything is written straight to element styles, so moving the pointer never re-renders React.
 */
export function useEdgeGlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const lightRef = useRef<HTMLSpanElement>(null)
  const rightGlowRef = useRef<HTMLSpanElement>(null)
  const leftGlowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const button = buttonRef.current
    const light = lightRef.current
    const rightGlow = rightGlowRef.current
    const leftGlow = leftGlowRef.current
    if (!container || !button || !light || !rightGlow || !leftGlow) return

    let bound = 0
    let x = 0
    let velocity = 0
    let target = 0
    let inside = false
    let last = 0
    let frameId: number | null = null

    const measure = () => {
      bound = container.getBoundingClientRect().width / 2 + EDGE_OVERSHOOT
    }

    const paint = () => {
      light.style.transform = `translateX(${x.toFixed(2)}px) translateZ(0)`
      const normalized = Math.max(-1, Math.min(1, x / bound))
      const magnitude = Math.abs(normalized)
      const intensity = Math.pow(magnitude, GLOW_RISE)
      const tuning =
        `hue-rotate(${HUE_SHIFT_DEG}deg)` +
        ` saturate(${(1 + EDGE_SATURATION * magnitude).toFixed(3)})` +
        ` brightness(${(1 + EDGE_BRIGHTNESS * magnitude).toFixed(3)})`
      rightGlow.style.opacity = (normalized > 0 ? intensity : 0).toFixed(3)
      leftGlow.style.opacity = (normalized < 0 ? intensity : 0).toFixed(3)
      rightGlow.style.filter = tuning
      leftGlow.style.filter = tuning
    }

    // Rest on the right edge, lit, until the pointer arrives.
    measure()
    x = bound
    target = bound
    paint()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => resizeObserver.disconnect()
    }

    const step = (now: number) => {
      const delta = Math.min((now - last) / 1000, MAX_FRAME_STEP)
      last = now
      const omega = 2 * Math.PI * SPRING_FREQUENCY
      velocity += (omega * omega * (target - x) - 2 * SPRING_DAMPING * omega * velocity) * delta
      x += velocity * delta
      paint()

      const moving = Math.abs(target - x) > REST_DISTANCE || Math.abs(velocity) > REST_VELOCITY
      if (inside || moving) {
        frameId = requestAnimationFrame(step)
        return
      }
      frameId = null
      x = target
      velocity = 0
      paint()
    }

    const start = () => {
      if (frameId !== null) return
      last = performance.now()
      frameId = requestAnimationFrame(step)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      inside = true
      target = Math.max(-bound, Math.min(bound, event.clientX - (rect.left + rect.width / 2)))
      start()
    }

    // Leave the light where the pointer left it, letting the spring coast to a stop.
    const handlePointerLeave = () => {
      inside = false
      target = x
      start()
    }

    // Keyboard focus centres the light, so the focused button reads as lit, not pushed aside.
    const handleFocus = () => {
      inside = false
      target = 0
      start()
    }

    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)
    button.addEventListener('focus', handleFocus)
    button.addEventListener('blur', handlePointerLeave)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      button.removeEventListener('focus', handleFocus)
      button.removeEventListener('blur', handlePointerLeave)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  return { containerRef, buttonRef, lightRef, rightGlowRef, leftGlowRef }
}
