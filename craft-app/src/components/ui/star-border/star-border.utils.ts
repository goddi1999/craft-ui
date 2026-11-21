import { WHITE, TAU } from './star-border.constants'
import type { Point, Rgb, Segment, Shape } from './star-border.types'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))
export const wrap = (value: number, total: number) => ((value % total) + total) % total
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (2 - 2 * t) ** 3 / 2)

export const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

export const rgba = (rgb: Rgb, alpha: number) =>
  `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${clamp(alpha, 0, 1).toFixed(3)})`

let colorContext: CanvasRenderingContext2D | null = null

/** Any CSS colour to RGB, by letting a canvas parse it. */
export function toRgb(color: string): Rgb {
  if (!colorContext) colorContext = document.createElement('canvas').getContext('2d')
  if (!colorContext) return WHITE
  colorContext.fillStyle = '#000000'
  colorContext.fillStyle = color
  const value = String(colorContext.fillStyle)
  if (value.startsWith('#')) {
    const hex = parseInt(value.slice(1, 7), 16)
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]
  }
  const parts = value.match(/[\d.]+/g)?.map(Number)
  if (!parts || parts.length < 3) return WHITE
  return [parts[0], parts[1], parts[2]]
}

/** The rounded-rect border as eight segments (four edges, four quarter arcs), clockwise from top-left. */
export function outline(width: number, height: number, radius: number): Shape {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  const arc = (Math.PI * r) / 2
  const across = Math.max(0, width - 2 * r)
  const down = Math.max(0, height - 2 * r)
  const segments: Segment[] = [
    { length: across, x: r, y: 0, dx: 1, dy: 0, angle: null },
    { length: arc, x: width - r, y: r, dx: 0, dy: 0, angle: -Math.PI / 2 },
    { length: down, x: width, y: r, dx: 0, dy: 1, angle: null },
    { length: arc, x: width - r, y: height - r, dx: 0, dy: 0, angle: 0 },
    { length: across, x: width - r, y: height, dx: -1, dy: 0, angle: null },
    { length: arc, x: r, y: height - r, dx: 0, dy: 0, angle: Math.PI / 2 },
    { length: down, x: 0, y: height - r, dx: 0, dy: -1, angle: null },
    { length: arc, x: r, y: r, dx: 0, dy: 0, angle: Math.PI },
  ]
  const total = segments.reduce((sum, segment) => sum + segment.length, 0)
  return { r, segments, total: Math.max(1, total) }
}

/** Writes the position and outward normal at `distance` along the border into `point`. */
export function pointAt(shape: Shape, distance: number, point: Point) {
  let s = wrap(distance, shape.total)
  for (const segment of shape.segments) {
    if (segment.length > 0 && s <= segment.length) {
      if (segment.angle === null) {
        point.x = segment.x + segment.dx * s
        point.y = segment.y + segment.dy * s
        point.nx = segment.dy
        point.ny = -segment.dx
      } else {
        const angle = segment.angle + s / shape.r
        point.nx = Math.cos(angle)
        point.ny = Math.sin(angle)
        point.x = segment.x + point.nx * shape.r
        point.y = segment.y + point.ny * shape.r
      }
      return point
    }
    s -= segment.length
  }
  return point
}

/** Distance along the border of the point nearest to (px, py). */
export function project(shape: Shape, px: number, py: number) {
  let best = Infinity
  let found = 0
  let offset = 0
  for (const segment of shape.segments) {
    if (segment.length > 0) {
      let s: number
      let x: number
      let y: number
      if (segment.angle === null) {
        s = clamp((px - segment.x) * segment.dx + (py - segment.y) * segment.dy, 0, segment.length)
        x = segment.x + segment.dx * s
        y = segment.y + segment.dy * s
      } else {
        let angle = wrap(Math.atan2(py - segment.y, px - segment.x) - segment.angle, TAU)
        if (angle > Math.PI / 2) angle = angle > Math.PI * 1.25 ? 0 : Math.PI / 2
        s = angle * shape.r
        x = segment.x + Math.cos(segment.angle + angle) * shape.r
        y = segment.y + Math.sin(segment.angle + angle) * shape.r
      }
      const distance = (px - x) ** 2 + (py - y) ** 2
      if (distance < best) {
        best = distance
        found = offset + s
      }
    }
    offset += segment.length
  }
  return found
}
