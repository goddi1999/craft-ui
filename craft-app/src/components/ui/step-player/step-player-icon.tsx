import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'

export type StepPlayerIconState = 'play' | 'pause' | 'replay'

const ICON_SPRING = { type: 'spring', duration: 0.32, bounce: 0.22 } as const
const ICON_FADE = { duration: 0.26, ease: [0.32, 0.72, 0, 1] } as const
const ENTER_SCALE = 0.82

// Play is split down the middle into two four-point quads, so it morphs
// point for point into the two pause bars without a path-morphing library.
const PLAY_SHAPE = [
  8.6, 6.4, 13.2, 9.2, 13.2, 14.8, 8.6, 17.6, 13.2, 9.2, 17.8, 12, 17.8, 12,
  13.2, 14.8,
]
const PAUSE_SHAPE = [
  8.4, 5.9, 10.4, 5.9, 10.4, 18.1, 8.4, 18.1, 13.6, 5.9, 15.6, 5.9, 15.6, 18.1,
  13.6, 18.1,
]
const REPLAY_PATH =
  'M17.44 6.56 A7.7 7.7 0 1 1 10.66 4.42 L10.32 2.45 L14.86 4.59 L11.32 8.16 L10.91 5.8 A6.3 6.3 0 1 0 16.45 7.55 Z'

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

const RESTING: Record<StepPlayerIconState, string> = {
  play: toPath(PLAY_SHAPE),
  pause: toPath(PAUSE_SHAPE),
  replay: REPLAY_PATH,
}

// replay has no point-for-point match, so it cross-dissolves instead
const canMorph = (from: StepPlayerIconState, to: StepPlayerIconState) =>
  from !== 'replay' && to !== 'replay'

// stroke rounds the corners the quads leave sharp
const ICON_PAINT = {
  fill: 'currentColor',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const

type StepPlayerIconProps = {
  state: StepPlayerIconState
  size: number
  reduced: boolean
}

export function StepPlayerIcon({ state, size, reduced }: StepPlayerIconProps) {
  const shape = useMotionValue(RESTING[state])
  const leaving = useMotionValue(RESTING[state])
  const shapeOpacity = useMotionValue(1)
  const leavingOpacity = useMotionValue(0)
  const shapeScale = useTransform(
    shapeOpacity,
    (o) => ENTER_SCALE + (1 - ENTER_SCALE) * o,
  )
  const leavingScale = useTransform(
    leavingOpacity,
    (o) => ENTER_SCALE + (1 - ENTER_SCALE) * o,
  )
  const previous = useRef(state)

  useEffect(() => {
    if (previous.current === state) return
    const from = previous.current
    previous.current = state
    shape.set(RESTING[state])
    shapeOpacity.set(1)
    leavingOpacity.set(0)
    if (reduced) return

    if (canMorph(from, state)) {
      const fromShape = from === 'play' ? PLAY_SHAPE : PAUSE_SHAPE
      const toShape = state === 'play' ? PLAY_SHAPE : PAUSE_SHAPE
      const controls = animate(0, 1, {
        ...ICON_SPRING,
        onUpdate: (t) => shape.set(morph(fromShape, toShape, Math.min(1, Math.max(0, t)))),
        // the spring can overshoot, so land on the exact path
        onComplete: () => shape.set(RESTING[state]),
      })
      return () => controls.stop()
    }

    leaving.set(RESTING[from])
    shapeOpacity.set(0)
    leavingOpacity.set(1)
    const controls = animate(0, 1, {
      ...ICON_FADE,
      onUpdate: (t) => {
        shapeOpacity.set(t)
        leavingOpacity.set(1 - t)
      },
      onComplete: () => {
        shapeOpacity.set(1)
        leavingOpacity.set(0)
      },
    })
    return () => controls.stop()
  }, [state, reduced, shape, leaving, shapeOpacity, leavingOpacity])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <motion.g
        style={{
          opacity: leavingOpacity,
          scale: leavingScale,
          transformOrigin: '12px 12px',
        }}
      >
        <motion.path d={leaving} {...ICON_PAINT} />
      </motion.g>
      <motion.g
        style={{
          opacity: shapeOpacity,
          scale: shapeScale,
          transformOrigin: '12px 12px',
        }}
      >
        <motion.path d={shape} {...ICON_PAINT} />
      </motion.g>
    </svg>
  )
}
