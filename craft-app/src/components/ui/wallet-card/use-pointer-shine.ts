import { useMotionTemplate, useMotionValue } from 'motion/react'
import { useRef, type PointerEvent } from 'react'

import { SHINE_COLOR, SHINE_PARKED, SHINE_RADIUS } from './wallet-card.constants'

/**
 * A radial shine that follows the pointer over the surface. It runs on motion values,
 * so moving the pointer never re-renders the card.
 */
export function usePointerShine(reduced: boolean) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(SHINE_PARKED)
  const y = useMotionValue(SHINE_PARKED)
  const background = useMotionTemplate`radial-gradient(${SHINE_RADIUS}px circle at ${x}px ${y}px, ${SHINE_COLOR}, transparent 70%)`

  // measured from the surface the shine paints on, not the whole card
  const track = (event: PointerEvent<HTMLElement>) => {
    const surface = surfaceRef.current
    if (reduced || !surface) return
    const rect = surface.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  const park = () => {
    x.set(SHINE_PARKED)
    y.set(SHINE_PARKED)
  }

  return { surfaceRef, background, track, park }
}
