import { useEffect, useRef } from 'react'

import { CURSOR_FLOAT_STEP } from './illustration-cursor.constants'
import type { FloatParams } from './illustration-cursor.types'

function randomFloatParams(): FloatParams {
  return {
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    speedX: 0.55 + Math.random() * 0.35,
    speedY: 0.7 + Math.random() * 0.35,
    ampX: 3 + Math.random() * 5,
    ampY: 2 + Math.random() * 4,
  }
}

/** Drifts the referenced element on a layered sine path while `enabled`. */
export function useFloatingCursor<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null)
  const time = useRef(0)
  const params = useRef<FloatParams | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!enabled || !node) return
    if (!params.current) params.current = randomFloatParams()
    const p = params.current
    let frame = 0

    const tick = () => {
      time.current += CURSOR_FLOAT_STEP
      const t = time.current
      const x =
        Math.sin(t * p.speedX + p.phaseX) * p.ampX +
        Math.sin(t * p.speedX * 1.7 + p.phaseX * 0.5) * (p.ampX * 0.3)
      const y =
        Math.sin(t * p.speedY + p.phaseY) * p.ampY +
        Math.cos(t * p.speedY * 1.3 + p.phaseY * 0.7) * (p.ampY * 0.25)
      node.style.transform = `translate(${x}px, ${y}px)`
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      node.style.transform = ''
    }
  }, [enabled])

  return ref
}
