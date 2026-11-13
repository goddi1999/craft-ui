import {
  BOX_VAR,
  FORWARD_DIST,
  GRAIN,
  PAPER_H,
  PAPER_S0,
  TILT,
  TURN,
} from './package-box.constants'

type V3 = [number, number, number]

export const rad = (d: number) => (d * Math.PI) / 180

export const rotX = ([x, y, z]: V3, a: number): V3 => [
  x,
  y * Math.cos(a) - z * Math.sin(a),
  y * Math.sin(a) + z * Math.cos(a),
]

export const rotY = ([x, y, z]: V3, a: number): V3 => [
  x * Math.cos(a) + z * Math.sin(a),
  y,
  -x * Math.sin(a) + z * Math.cos(a),
]

/** Scene direction that points at the camera so the paper can step toward you. */
export const FORWARD = rotY(rotX([0, 0, 1], rad(-TILT)), rad(-TURN))

export const mix = (a: string, b: string, pct: number) =>
  `color-mix(in srgb, ${a}, ${b} ${pct}%)`

export const FACE = {
  left: `${GRAIN}, linear-gradient(165deg, ${mix(BOX_VAR, 'white', 6)}, ${mix(BOX_VAR, 'black', 7)})`,
  right: `${GRAIN}, linear-gradient(165deg, ${mix(BOX_VAR, 'black', 26)}, ${mix(BOX_VAR, 'black', 36)})`,
  top: `${GRAIN}, linear-gradient(135deg, ${mix(BOX_VAR, 'white', 14)}, ${mix(BOX_VAR, 'white', 3)})`,
  inside: `linear-gradient(180deg, ${mix(BOX_VAR, 'black', 42)} 0%, ${mix(BOX_VAR, 'black', 72)} 100%)`,
  underside: `linear-gradient(180deg, ${mix(BOX_VAR, 'black', 36)}, ${mix(BOX_VAR, 'black', 50)})`,
  floor: mix(BOX_VAR, 'black', 80),
} as const

/** Where the paper is as it rises (`r`) and then turns to face you (`s`). */
export function paperPose(r: number, s: number) {
  const scale = PAPER_S0 + (1 - PAPER_S0) * s
  const bottom = 96 - 208 * r - 14 * s
  const cy = bottom - (PAPER_H * scale) / 2
  const d = FORWARD_DIST * s
  return `translate3d(${(FORWARD[0] * d).toFixed(2)}px, ${(cy + FORWARD[1] * d).toFixed(2)}px, ${(FORWARD[2] * d).toFixed(2)}px) rotateY(${(-TURN * s).toFixed(2)}deg) rotateX(${(-TILT * s).toFixed(2)}deg) scale(${scale.toFixed(4)})`
}
