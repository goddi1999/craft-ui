import { GIVE, MARGIN, STRETCH } from './image-compare.constants'

type Point = [number, number]

export const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value))

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

/** iOS style resistance: travel past a limit gives less and less, and never more than `limit` px. */
export const rubber = (distance: number, limit = STRETCH) =>
  Math.sign(distance) * (1 - 1 / ((Math.abs(distance) * 0.55) / limit + 1)) * limit

// the handle keeps the line's pace in the middle and slows smoothly near an edge, so it is never
// cut off and never stops dead
const give = (distance: number) => GIVE * (1 - 1 / (distance / GIVE + 1))

export const soften = (at: number, size: number) =>
  at < MARGIN
    ? MARGIN - give(MARGIN - at)
    : at > size - MARGIN
      ? size - MARGIN + give(at - size + MARGIN)
      : at

/** A caption's opacity from how much room the divider leaves it. */
export const fade = (room: number) => clamp(room / 28, 0, 1)

/** The before side of a line through `center` at `angle`: the clip while the divider turns. */
export function halfPlane(w: number, h: number, center: Point, angle: number) {
  const nx = -Math.cos(angle)
  const ny = -Math.sin(angle)
  const side = ([x, y]: Point) => (x - center[0]) * nx + (y - center[1]) * ny
  const corners: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ]
  const points: Point[] = []
  corners.forEach((corner, index) => {
    const next = corners[(index + 1) % 4]
    const a = side(corner)
    const b = side(next)
    if (a >= 0) points.push(corner)
    if (a >= 0 !== b >= 0) {
      const t = a / (a - b)
      points.push([corner[0] + (next[0] - corner[0]) * t, corner[1] + (next[1] - corner[1]) * t])
    }
  })
  return points.length
    ? `polygon(${points.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(', ')})`
    : 'inset(50%)'
}
