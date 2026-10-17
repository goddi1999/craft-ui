/** A sampled point: position in pad units, pen pressure between 0 and 1 (or -1 when the device has none), and ms since the stroke began. */
export type InkPoint = { x: number; y: number; p: number; t: number }
export type InkColor = 'black' | 'blue' | 'violet'
export type InkWidth = 'fine' | 'medium' | 'bold'
export type InkStroke = {
  id: string
  points: InkPoint[]
  color: InkColor
  width: InkWidth
  /** When the stroke began, in ms. Replay keeps the real rhythm between strokes. */
  at: number
}

export type OutlineOptions = {
  /** Diameter of the stroke at half pressure, in pad units. */
  size: number
  /** How much pressure changes the width, from 0 to 1. */
  thinning?: number
  /** How far each point trails the pointer, from 0 to 1. Higher is smoother but lags more. */
  streamline?: number
  /** Derive pressure from speed when the device reports none: fast is thin, slow is full. */
  simulatePressure?: boolean
  /** Length over which the start and the end taper, in pad units. */
  taperStart?: number
  taperEnd?: number
  /** False while the stroke is still being drawn, so the end does not taper yet. */
  last?: boolean
}

/** Pad coordinates. Strokes are stored in this space and scale with the pad. */
export const PAD_WIDTH = 600,
  PAD_HEIGHT = 260

export const INK: Record<InkColor, { label: string; export: string }> = {
  black: { label: 'Black ink', export: '#17171a' },
  blue: { label: 'Blue ink', export: '#1d3fae' },
  violet: { label: 'Violet ink', export: '#5b35c8' },
}
export const WIDTHS: Record<InkWidth, { label: string; size: number }> = {
  fine: { label: 'Fine', size: 3.4 },
  medium: { label: 'Medium', size: 5.6 },
  bold: { label: 'Bold', size: 8.4 },
}
export const COLORS = Object.keys(INK) as InkColor[]
export const SIZES = Object.keys(WIDTHS) as InkWidth[]

type Vec = [number, number]
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]]
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]]
const mul = (a: Vec, n: number): Vec => [a[0] * n, a[1] * n]
const lerp = (a: Vec, b: Vec, t: number): Vec => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
]
const dist = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1])
const norm = (a: Vec): Vec => {
  const l = Math.hypot(a[0], a[1])
  return l ? [a[0] / l, a[1] / l] : [0, 0]
}
const perp = (a: Vec): Vec => [a[1], -a[0]]
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1]
const rotAround = (p: Vec, c: Vec, r: number): Vec => {
  const s = Math.sin(r),
    co = Math.cos(r),
    px = p[0] - c[0],
    py = p[1] - c[1]
  return [px * co - py * s + c[0], px * s + py * co + c[1]]
}
const easeOut = (t: number) => t * (2 - t)

/**
 * Turns sampled points into the outline of a variable width stroke, in the spirit of perfect-freehand. Points are streamlined
 * toward the pointer, width follows pen pressure or, for a mouse or finger, speed, the ends taper, sharp turns get round joins,
 * and both ends get round caps. Returns the outline polygon; pass it to `outlineToPath` for SVG.
 */
export function getStrokeOutline(
  input: InkPoint[],
  options: OutlineOptions,
): Vec[] {
  const {
    size,
    thinning = 0.62,
    streamline = 0.42,
    simulatePressure = true,
    taperStart = 0,
    taperEnd = 0,
    last = true,
  } = options
  const [head] = input
  if (!head) return []
  const usePen = !simulatePressure && input.some((point) => point.p > 0)

  // Streamline: each point eases toward the raw input, which removes jitter without a smoothing pass.
  const pts: { at: Vec; pressure: number; length: number; vector: Vec }[] = []
  let prev: Vec = [head.x, head.y],
    length = 0
  const start = {
    at: prev,
    pressure: usePen ? head.p : 0.5,
    length: 0,
    vector: [1, 0] as Vec,
  }
  pts.push(start)
  for (let i = 1; i < input.length; i++) {
    const sample = input[i]!
    const raw: Vec = [sample.x, sample.y]
    const at =
      i === input.length - 1 && last ? raw : lerp(prev, raw, 1 - streamline)
    const d = dist(at, prev)
    if (d < 0.4) continue
    length += d
    pts.push({
      at,
      pressure: usePen ? sample.p : 0.5,
      length,
      vector: norm(sub(prev, at)),
    })
    prev = at
  }
  const second = pts[1]
  if (second) start.vector = second.vector
  const total = length

  // A dot: a round mark sized by the first pressure.
  if (pts.length === 1) {
    const r = Math.max(
      0.6,
      size * (0.5 - thinning * (0.5 - start.pressure)) * 0.9,
    )
    return Array.from({ length: 18 }, (_, i) =>
      add(
        start.at,
        mul(
          [Math.cos((i / 18) * Math.PI * 2), Math.sin((i / 18) * Math.PI * 2)],
          r,
        ),
      ),
    )
  }

  const left: Vec[] = [],
    right: Vec[] = []
  let pressure = start.pressure,
    prevVector = start.vector
  const radii: number[] = []
  for (let i = 0; i < pts.length; i++) {
    const point = pts[i]!
    if (!usePen) {
      // Speed thins the line: a long step between samples reads as a fast stroke.
      const step = i === 0 ? 0 : dist(point.at, pts[i - 1]!.at)
      const speed = Math.min(1, step / size)
      const target = Math.min(1, 1 - speed)
      pressure = Math.min(1, pressure + (target - pressure) * speed * 0.3)
    } else {
      pressure = point.pressure
    }
    let radius = Math.max(0.25, size * (0.5 - thinning * (0.5 - pressure)))
    const ts = taperStart ? easeOut(Math.min(1, point.length / taperStart)) : 1
    const te =
      taperEnd && last
        ? easeOut(Math.min(1, (total - point.length) / taperEnd))
        : 1
    radius = Math.max(0.12 * size, radius * Math.min(ts, te))
    radii.push(radius)

    const next = pts[i + 1]?.vector ?? point.vector
    const offset = mul(perp(lerp(next, point.vector, 0.5)), radius)
    // A sharp turn: sweep round the corner so the outline does not pinch.
    if (i > 0 && i < pts.length - 1 && dot(point.vector, next) < -0.2) {
      const corner = mul(perp(prevVector), radius)
      for (let t = 0; t <= 1; t += 1 / 12) {
        left.push(rotAround(sub(point.at, corner), point.at, Math.PI * t))
        right.push(rotAround(add(point.at, corner), point.at, -Math.PI * t))
      }
    } else {
      left.push(sub(point.at, offset))
      right.push(add(point.at, offset))
    }
    prevVector = point.vector
  }

  // Round caps: half circles swept around the first and last points, on the side facing away from the stroke.
  const cap = (center: Vec, from: Vec, to: Vec, away: Vec) => {
    const out: Vec[] = []
    const r = dist(center, from),
      start = Math.atan2(from[1] - center[1], from[0] - center[0])
    const mid = start + Math.PI / 2
    const sign = dot([Math.cos(mid), Math.sin(mid)], away) >= 0 ? 1 : -1
    for (let k = 1; k < 12; k++) {
      const a = start + (sign * Math.PI * k) / 12
      out.push([center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r])
    }
    out.push(to)
    return out
  }
  const end = pts[pts.length - 1]!
  const endCap = cap(
    end.at,
    left[left.length - 1]!,
    right[right.length - 1]!,
    mul(end.vector, -1),
  )
  const startCap = cap(start.at, right[0]!, left[0]!, start.vector)
  return [...left, ...endCap, ...right.reverse(), ...startCap]
}

const round = (value: number) => Math.round(value * 100) / 100
/** Draws an outline as one smooth closed path, with quadratic curves through the midpoints of its edges. */
export function outlineToPath(points: Vec[]) {
  if (points.length < 3) return ''
  let d = `M${round(points[0]![0])} ${round(points[0]![1])} Q`
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i]!,
      [x1, y1] = points[(i + 1) % points.length]!
    d += `${round(x0)} ${round(y0)} ${round((x0 + x1) / 2)} ${round((y0 + y1) / 2)} `
  }
  return `${d}Z`
}

export function strokeOptions(
  stroke: Pick<InkStroke, 'width' | 'points'>,
  last: boolean,
): OutlineOptions {
  const size = WIDTHS[stroke.width].size
  const pen = stroke.points.some((point) => point.p > 0)
  return {
    size,
    simulatePressure: !pen,
    taperStart: size * 1.5,
    taperEnd: pen ? 0 : size * 5,
    last,
  }
}
/** The SVG path of a stroke, or of its first `upTo` ms while it is replayed. */
export function strokePath(
  stroke: Pick<InkStroke, 'width' | 'points'>,
  upTo = Infinity,
) {
  const all = stroke.points
  const done = upTo >= all[all.length - 1]!.t
  const points = done ? all : all.filter((point) => point.t <= upTo)
  return outlineToPath(getStrokeOutline(points, strokeOptions(stroke, done)))
}

/** Tight bounds of the ink, padded, for export. */
function inkBounds(strokes: InkStroke[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const stroke of strokes)
    for (const point of stroke.points) {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    }
  const pad = 16
  return {
    x: Math.floor(minX - pad),
    y: Math.floor(minY - pad),
    width: Math.ceil(maxX - minX + pad * 2),
    height: Math.ceil(maxY - minY + pad * 2),
  }
}

/** A standalone SVG of the signature, cropped to the ink, with print ink colors. */
export function signatureToSvg(strokes: InkStroke[]) {
  if (!strokes.length) return ''
  const box = inkBounds(strokes)
  const paths = strokes
    .map(
      (stroke) =>
        `<path d="${strokePath(stroke)}" fill="${INK[stroke.color].export}"/>`,
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" width="${box.width}" height="${box.height}">${paths}</svg>`
}

/** A transparent PNG of the signature, cropped to the ink, at `scale` times pad resolution. */
export function signatureToPng(strokes: InkStroke[], scale = 3): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!strokes.length) return reject(new Error('Nothing to export'))
    const box = inkBounds(strokes)
    const canvas = document.createElement('canvas')
    canvas.width = box.width * scale
    canvas.height = box.height * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return reject(new Error('Canvas is unavailable'))
    ctx.scale(scale, scale)
    ctx.translate(-box.x, -box.y)
    for (const stroke of strokes) {
      ctx.fillStyle = INK[stroke.color].export
      ctx.fill(new Path2D(strokePath(stroke)))
    }
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      'image/png',
    )
  })
}

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
