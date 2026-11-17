import { useEffect, useRef } from 'react'

import { IMAGE_PIN_FEATHER_MASK } from '@/components/ui/image-pin'
import { cn } from '@/lib/utils'

import { WAVE_REACH } from './pin-shatter.constants'
import { easeOutExpo } from './pin-shatter.wave'

/** A ring of the image magnified a touch, trailed by one shrunk a touch. */
const LAYERS = [
  { boost: 0.055, brightness: 1.14, lag: 0 },
  { boost: -0.028, brightness: 0.94, lag: -0.65 },
] as const

export type PinDropLensProps = {
  src: string
  /** Centre in CSS px inside the lens. */
  x: number
  y: number
  radius: number
  /** 0..1. */
  strength: number
  duration: number
  /** Fires when the ring has faded; unmount the lens here. */
  onDone: () => void
  className?: string
}

/**
 * The ripple for images WebGL cannot read (no CORS): two copies of the image
 * are masked to a ring that travels outward, one magnified and one shrunk, so
 * the picture seems to swell as the crest passes. Cheaper and flatter than the
 * pixel warp, but it works for any image.
 */
export function PinDropLens({
  src,
  x,
  y,
  radius,
  strength,
  duration,
  onDone,
  className,
}: PinDropLensProps) {
  const layers = useRef<(HTMLImageElement | null)[]>([])
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const total = duration * 1.12
    const reach = radius * WAVE_REACH
    const band = Math.max(14, reach * 0.24)
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = (now - start) / total
      if (t >= 1) {
        doneRef.current()
        return
      }
      const fade = (1 - t) ** 1.35
      const crest = 8 + easeOutExpo(t) * reach

      LAYERS.forEach((layer, i) => {
        const node = layers.current[i]
        if (!node) return
        const r = Math.max(4, crest + layer.lag * band)
        const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${Math.max(0, r - band)}px, rgba(0,0,0,0.92) ${r}px, transparent ${r + band}px)`
        node.style.maskImage = mask
        node.style.webkitMaskImage = mask
        node.style.transform = `scale(${1 + layer.boost * strength * fade})`
        node.style.filter = `brightness(${1 + (layer.brightness - 1) * strength * fade})`
        node.style.opacity = String(fade * 0.95)
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [x, y, radius, strength, duration])

  return (
    <span
      aria-hidden
      data-slot="pin-drop-lens"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={IMAGE_PIN_FEATHER_MASK}
    >
      {LAYERS.map((_, i) => (
        <img
          key={i}
          ref={(node) => {
            layers.current[i] = node
          }}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full opacity-0 select-none"
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </span>
  )
}
