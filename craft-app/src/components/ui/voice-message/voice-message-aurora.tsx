import { motion } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'

import { pointOnPill } from './voice-message.utils'

const GLOW = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const
const INSTANT = { duration: 0 } as const
const BLUR_RATIO = 0.32
const PULSE_SPEED = 0.6
// seconds for the orbit to reach full speed, and to coast back down
const SPIN_UP = 0.45
// the laps only drift the lights apart over time, so start mid-flow
const START_AT = 6.2

const MIDDLE_MASK =
  'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.3) 46%, rgba(0,0,0,0.3) 54%, #000 100%)'

// each light is centred on the outline, so the clip keeps only its inner half
const BLOBS = [
  { size: 2, alpha: 0.5, lap: 11, offset: 0.04, pulse: 0.12 },
  { size: 1.5, alpha: 0.4, lap: 17, offset: 0.19, pulse: 0.14 },
  { size: 2.3, alpha: 0.45, lap: 23, offset: 0.47, pulse: 0.1 },
  { size: 1.2, alpha: 0.35, lap: 13, offset: 0.71, pulse: 0.16 },
] as const

type VoiceMessageAuroraProps = {
  accent: string
  height: number
  glow: number
  playing: boolean
  reduced: boolean
}

/** Soft lights that orbit the pill's outline while the message plays. */
export function VoiceMessageAurora({
  accent,
  height,
  glow,
  playing,
  reduced,
}: VoiceMessageAuroraProps) {
  // lap time advances only while playing, so pausing leaves every light in place
  const clock = useRef(START_AT)
  const rate = useRef(0)
  const fieldRef = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLSpanElement | null)[]>([])
  const width = useRef(0)

  const place = useCallback(
    (t: number) => {
      if (width.current === 0) return
      const perimeter = 2 * Math.max(0, width.current - height) + Math.PI * height
      BLOBS.forEach((blob, i) => {
        const node = nodes.current[i]
        if (!node) return
        const travelled = blob.offset + t / blob.lap
        const [x, y] = pointOnPill(travelled * perimeter, width.current, height)
        const phase = blob.offset * Math.PI * 2
        const scale = 1 + Math.sin(t * PULSE_SPEED + phase) * blob.pulse
        node.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
      })
    },
    [height],
  )

  useEffect(() => {
    const node = fieldRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      width.current = entry.contentRect.width
      // place at once, so a resize or reduced motion never shows them stacked
      place(clock.current)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [place])

  useEffect(() => {
    if (reduced) return
    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      // a long gap from a background tab must not fling the lights across the bar
      const delta = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = playing ? 1 : 0
      rate.current += (target - rate.current) * (1 - Math.exp(-delta / SPIN_UP))
      clock.current += delta * rate.current
      place(clock.current)
      if (playing || rate.current > 0.002) {
        frame = requestAnimationFrame(loop)
        return
      }
      rate.current = 0
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [playing, reduced, place])

  return (
    <div
      data-slot="voice-message-glow"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full mix-blend-multiply dark:mix-blend-screen"
    >
      <motion.div
        ref={fieldRef}
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          filter: `blur(${height * BLUR_RATIO}px)`,
          maskImage: MIDDLE_MASK,
          WebkitMaskImage: MIDDLE_MASK,
        }}
        // without this the field paints at full strength for a frame first
        initial={false}
        animate={{ opacity: glow }}
        transition={reduced ? INSTANT : GLOW}
      >
        <span
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 170% at 8% 115%, ${accent} 0%, transparent 62%), radial-gradient(55% 150% at 40% 130%, ${accent} 0%, transparent 58%)`,
          }}
        />
        {BLOBS.map((blob, i) => (
          <span
            key={i}
            ref={(node) => {
              nodes.current[i] = node
            }}
            className="absolute top-0 left-0 rounded-full"
            style={{
              width: blob.size * height,
              height: blob.size * height,
              marginLeft: (-blob.size * height) / 2,
              marginTop: (-blob.size * height) / 2,
              background: accent,
              opacity: blob.alpha,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
