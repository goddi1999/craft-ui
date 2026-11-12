import {
  HIGHLIGHT_ALPHA,
  HIGHLIGHT_SPEED,
  LINE_GAP,
  MAX_MS,
  MIN_MS,
  PEN_SPEED,
} from './marker-text.constants'
import type { Box, MarkEntry, MarkType, Point, Stroke, StrokeShape } from './marker-text.types'

/** Deterministic noise, so a resize redraws the same wobble. */
export function random(seed: number) {
  let n = seed
  return () => {
    n += 1
    const x = Math.sin(n * 12.9898 + seed * 78.233) * 43_758.5453
    return x - Math.floor(x)
  }
}

export function hash(text: string) {
  let h = 7
  for (const char of text) h = (h * 31 + (char.codePointAt(0) as number)) % 1_000_003
  return h
}

const r1 = (n: number) => Math.round(n * 10) / 10

function polyline(points: Point[]) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r1(x)} ${r1(y)}`).join('')
}

function lengthOf(points: Point[]) {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  }
  return total
}

/**
 * A pen stroke as a filled shape: the centre line offset to both sides by half
 * the width at each point, with round ends. Unlike an SVG stroke, the width can
 * change along the way, which is what makes it read as ink.
 */
function outline(points: Point[], widths: number[]) {
  const left: Point[] = []
  const right: Point[] = []
  const last = points.length - 1
  for (let i = 0; i <= last; i++) {
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(last, i + 1)]
    const dx = next[0] - prev[0]
    const dy = next[1] - prev[1]
    // two equal points have no direction; any length keeps the offset at zero
    const len = Math.hypot(dx, dy) || 1
    const half = widths[i] / 2
    const nx = (-dy / len) * half
    const ny = (dx / len) * half
    left.push([points[i][0] + nx, points[i][1] + ny])
    right.push([points[i][0] - nx, points[i][1] - ny])
  }
  const endCap = r1(widths[last] / 2)
  const startCap = r1(widths[0] / 2)
  const back = right.reverse()
  return `${polyline(left)}A${endCap} ${endCap} 0 0 0 ${r1(back[0][0])} ${r1(back[0][1])}${polyline(
    back,
  ).replace('M', 'L')}A${startCap} ${startCap} 0 0 0 ${r1(left[0][0])} ${r1(left[0][1])}Z`
}

/** Pressure along a stroke: the pen lands, presses, then lifts off. */
function pressure(t: number, base: number) {
  const land = Math.min(1, t / 0.1)
  const lift = Math.min(1, (1 - t) / 0.18)
  return base * (0.45 + 0.55 * Math.sin((land * Math.PI) / 2)) * (0.55 + 0.45 * lift)
}

/** A slow, uneven wave for edges that should look hand drawn. */
function wobble(rand: () => number, amp: number) {
  const p1 = rand() * Math.PI * 2
  const p2 = rand() * Math.PI * 2
  const f1 = 1 + rand() * 1.5
  const f2 = 3 + rand() * 3
  return (t: number) =>
    amp * (0.7 * Math.sin(t * f1 * Math.PI + p1) + 0.3 * Math.sin(t * f2 * Math.PI + p2))
}

function sample(count: number, at: (t: number) => Point) {
  const points: Point[] = []
  for (let i = 0; i <= count; i++) points.push(at(i / count))
  return points
}

function penStroke(
  points: Point[],
  width: number,
  key: string,
  type: MarkType,
  color: string | undefined,
): StrokeShape {
  const widths = points.map((_, i) => pressure(i / (points.length - 1), width))
  return {
    key,
    type,
    shape: outline(points, widths),
    pen: polyline(points),
    penWidth: width * 4,
    length: lengthOf(points),
    color,
    under: false,
    alpha: 1,
  }
}

function circleStroke(
  box: Box,
  rand: () => number,
  width: number,
  key: string,
  color: string | undefined,
) {
  const cx = (box.left + box.right) / 2
  const cy = (box.top + box.bottom) / 2
  const rx = (box.right - box.left) / 2 + 8
  const ry = (box.bottom - box.top) / 2 + 4
  const tilt = ((rand() - 0.5) * 6 * Math.PI) / 180
  const start = -Math.PI * (0.62 + rand() * 0.12)
  // a hand never closes a loop exactly: it runs past the start and drifts
  // outward, so the two ends cross instead of meeting
  const sweep = Math.PI * 2 + 0.45 + rand() * 0.2
  const drift = 0.05 + rand() * 0.04
  const wave = wobble(rand, 0.025)
  const steps = Math.max(48, Math.round((rx + ry) / 3))
  const points = sample(steps, (t) => {
    const a = start + sweep * t
    const grow = 1 - drift / 2 + drift * t + wave(t)
    const x = Math.cos(a) * rx * grow
    const y = Math.sin(a) * ry * grow
    return [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]
  })
  return penStroke(points, width, key, 'circle', color)
}

/** One continuous stroke round four slightly bowed sides, overshooting the first corner at the end. */
function boxStroke(
  box: Box,
  rand: () => number,
  width: number,
  key: string,
  color: string | undefined,
) {
  const padX = 5
  const padY = 3
  const corners: Point[] = [
    [box.left - padX - rand() * 2, box.top - padY + (rand() - 0.5) * 2],
    [box.right + padX + rand() * 2, box.top - padY + (rand() - 0.5) * 2],
    [box.right + padX + (rand() - 0.5) * 2, box.bottom + padY + rand() * 2],
    [box.left - padX + (rand() - 0.5) * 2, box.bottom + padY + rand() * 2],
  ]
  const points: Point[] = []
  for (let side = 0; side < 4; side++) {
    const a = corners[side]
    const b = corners[(side + 1) % 4]
    const bow = (rand() - 0.5) * 3
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const nx = -(b[1] - a[1]) / len
    const ny = (b[0] - a[0]) / len
    const steps = Math.max(6, Math.round(len / 8))
    for (let s = side === 0 ? 0 : 1; s <= steps; s++) {
      const t = s / steps
      const lift = Math.sin(t * Math.PI) * bow
      points.push([a[0] + (b[0] - a[0]) * t + nx * lift, a[1] + (b[1] - a[1]) * t + ny * lift])
    }
  }
  const first = corners[0]
  const second = corners[1]
  const over = 14 / Math.hypot(second[0] - first[0], second[1] - first[1])
  points.push([
    first[0] + (second[0] - first[0]) * over,
    first[1] + (second[1] - first[1]) * over + 1.5,
  ])
  return penStroke(points, width, key, 'box', color)
}

/** The pen width that suits the line height, unless the mark sets one. */
const penWidthFor = (entry: MarkEntry, lineHeight: number) =>
  entry.strokeWidth === undefined
    ? Math.min(4.5, Math.max(1.6, lineHeight * 0.085))
    : entry.strokeWidth

/** Every stroke one mark needs, one per line it wraps onto. */
export function strokesFor(entry: MarkEntry, lines: Box[], seed: number, index: number) {
  const rand = random(seed)
  const { type, color } = entry
  const width = penWidthFor(entry, lines[0].bottom - lines[0].top)

  if (type === 'highlight') {
    return lines.map((line, i): StrokeShape => {
      const h = line.bottom - line.top
      const top = wobble(rand, 0.9)
      const bottom = wobble(rand, 0.9)
      // the chisel tip leaves slanted ends, and the stroke drifts a little off level
      const chisel = h * 0.2
      const tilt = (rand() - 0.5) * Math.min(3, h * 0.08)
      const x0 = line.left - 3 - rand() * 2
      const x1 = line.right + 3 + rand() * 3
      const y0 = line.top + h * 0.08
      const y1 = line.bottom - h * 0.02
      const steps = Math.max(6, Math.round((x1 - x0) / 14))
      const edge = (y: number, wave: (t: number) => number, dx: number) =>
        sample(steps, (t) => [x0 + dx + (x1 - x0) * t, y + wave(t) + tilt * (t - 0.5)])
      const upper = edge(y0, top, chisel * 0.5)
      const lower = edge(y1, bottom, -chisel * 0.5).reverse()
      const mid = (y0 + y1) / 2
      const pen: Point[] = [
        [x0 - chisel, mid],
        [x1 + chisel, mid + tilt * 0.5],
      ]
      return {
        key: `${index}-${i}`,
        type,
        shape: `${polyline(upper)}${polyline(lower).replace('M', 'L')}Z`,
        pen: polyline(pen),
        penWidth: h * 1.8,
        length: lengthOf(pen),
        color,
        under: true,
        alpha: HIGHLIGHT_ALPHA,
      }
    })
  }

  if (type === 'underline' || type === 'strike') {
    return lines.map((line, i) => {
      const h = line.bottom - line.top
      const bow = (rand() - 0.5) * 3
      const slope = (rand() - 0.5) * (type === 'strike' ? 4 : 2.4)
      const wave = wobble(rand, 0.5)
      const x0 = line.left - 2 - rand() * 3
      const x1 = line.right + 2 + rand() * 4
      const y = type === 'strike' ? line.top + h * 0.56 : line.bottom + Math.max(1, h * 0.04)
      const steps = Math.max(8, Math.round((x1 - x0) / 6))
      const points = sample(steps, (t) => [
        x0 + (x1 - x0) * t,
        y + Math.sin(t * Math.PI) * bow + slope * (t - 0.5) + wave(t),
      ])
      return penStroke(points, width, `${index}-${i}`, type, color)
    })
  }

  // circles and boxes don't wrap (see Mark), but if the phrase is longer than
  // a line anyway, each line gets its own
  return lines.map((line, i) =>
    type === 'circle'
      ? circleStroke(line, rand, width, `${index}-${i}`, color)
      : boxStroke(line, rand, width, `${index}-${i}`, color),
  )
}

/** Puts each stroke on the clock: one after another in reading order, a pen lift between lines. */
export function schedule(marks: { entry: MarkEntry; lines: Box[] }[], gap: number) {
  const strokes: Stroke[] = []
  let clock = 0
  marks.forEach(({ entry, lines }, index) => {
    // a mark with no box (hidden, empty) still keeps its place in the seed order
    if (lines.length === 0) return
    const seed = hash(`${entry.el.textContent}${index}`)
    const speed = entry.type === 'highlight' ? HIGHLIGHT_SPEED : PEN_SPEED
    const made = strokesFor(entry, lines, seed, index)
    made.forEach((stroke, i) => {
      const duration = Math.min(MAX_MS, Math.max(MIN_MS, stroke.length / speed))
      strokes.push({ ...stroke, delay: clock, duration })
      clock += duration + (i < made.length - 1 ? LINE_GAP : 0)
    })
    clock += gap
  })
  return strokes
}
