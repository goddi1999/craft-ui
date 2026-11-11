import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'

import { clamp } from './voice-message.utils'

const ICON_SPRING = { type: 'spring', duration: 0.34, bounce: 0.2 } as const

// the triangle is split down the middle into the same two quads as the bars
const PLAY_SHAPE = [
  7.7, 5.8, 13, 8.9, 13, 15.1, 7.7, 18.2, 13, 8.9, 18.3, 12, 18.3, 12, 13, 15.1,
]
const PAUSE_SHAPE = [
  8.2, 6.8, 10.9, 6.8, 10.9, 17.2, 8.2, 17.2, 13.1, 6.8, 15.8, 6.8, 15.8, 17.2,
  13.1, 17.2,
]

const toPath = (shape: number[]) => {
  let d = ''
  for (let quad = 0; quad < shape.length; quad += 8) {
    d += `M${shape[quad]} ${shape[quad + 1]}`
    for (let point = 2; point < 8; point += 2) {
      d += ` L${shape[quad + point]} ${shape[quad + point + 1]}`
    }
    d += ' Z'
  }
  return d
}

const morph = (from: number[], to: number[], t: number) =>
  toPath(from.map((value, i) => value + (to[i] - value) * t))

const PLAY_PATH = toPath(PLAY_SHAPE)
const PAUSE_PATH = toPath(PAUSE_SHAPE)

// stroke rounds the corners the path leaves sharp
const ICON_PAINT = {
  fill: 'currentColor',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const

type VoiceMessageIconProps = {
  playing: boolean
  size: number
  reduced: boolean
}

/** Play ⇄ pause, morphing point for point. */
export function VoiceMessageIcon({ playing, size, reduced }: VoiceMessageIconProps) {
  const shape = useMotionValue(playing ? PAUSE_PATH : PLAY_PATH)
  const previous = useRef(playing)

  useEffect(() => {
    if (previous.current === playing) return
    previous.current = playing
    shape.set(playing ? PAUSE_PATH : PLAY_PATH)
    if (reduced) return

    const from = playing ? PLAY_SHAPE : PAUSE_SHAPE
    const to = playing ? PAUSE_SHAPE : PLAY_SHAPE
    const controls = animate(0, 1, {
      ...ICON_SPRING,
      onUpdate: (t) => shape.set(morph(from, to, clamp(t))),
      // the spring can overshoot, so land on the exact path
      onComplete: () => shape.set(playing ? PAUSE_PATH : PLAY_PATH),
    })
    return () => controls.stop()
  }, [playing, reduced, shape])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <motion.path d={shape} {...ICON_PAINT} />
    </svg>
  )
}
