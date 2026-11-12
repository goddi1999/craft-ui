import {
  ARC_POINTS,
  BLINK,
  BLINK_CLOSE,
  BLINK_LENGTH,
  BLINK_LOOP,
  FIT,
  RADII,
  SCALE,
  SHAPE_RECIPES,
  WANDER,
} from './agent-computer-icon.constants'
import type {
  ArcFrame,
  ArcSeed,
  BotShape,
  FacePose,
  Gaze,
  Point,
  ShapeRecipe,
  Silhouette,
} from './agent-computer-icon.types'

export const TAU = Math.PI * 2

export const clamp = (value: number, min = 0, max = 1) =>
  value < min ? min : value > max ? max : value
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t
export const easeOutQuint = (t: number) => 1 - (1 - t) ** 5
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
export const round = (value: number) => Math.round(value * 100) / 100
export const radians = (degrees: number) => (degrees * Math.PI) / 180

/** A seeded random stream, so "random" layouts are the same on every load. */
export function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

const ANGLES = Array.from({ length: RADII }, (_, index) => (index / RADII) * TAU)
const COS = ANGLES.map(Math.cos)
const SIN = ANGLES.map(Math.sin)
export const UNIT: readonly number[] = ANGLES.map(() => 1)

/* Shapes: 64 radii, one every 5.625°. */

const normalize = (radii: number[], peak = 1) => {
  const max = Math.max(...radii)
  return max > 0 ? radii.map((radius) => (radius * peak) / max) : radii
}

/** Distance from (cx, cy) to the polygon's edge along each of the 64 directions. */
export function castRadii(polygon: Point[], cx = 0, cy = 0) {
  return ANGLES.map((_, index) => {
    const dx = COS[index]
    const dy = SIN[index]
    let reach = 0
    for (let k = 0; k < polygon.length; k += 1) {
      const a = polygon[k]
      const b = polygon[(k + 1) % polygon.length]
      const ex = b.x - a.x
      const ey = b.y - a.y
      const cross = dx * ey - dy * ex
      if (Math.abs(cross) < 1e-9) continue
      const along = ((a.x - cx) * ey - (a.y - cy) * ex) / cross
      const edge = ((a.x - cx) * dy - (a.y - cy) * dx) / cross
      if (along > reach && edge >= 0 && edge <= 1) reach = along
    }
    return reach
  })
}

/** Outline around two circles `[x, y, r]`, like a capsule or a drop. */
export function hull([x1, y1, r1]: readonly number[], [x2, y2, r2]: readonly number[], steps = 96) {
  const distance = Math.hypot(x2 - x1, y2 - y1) || 1e-6
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const wrap = Math.acos(clamp((r1 - r2) / distance, -1, 1))
  const points: Point[] = []
  for (let k = 0; k <= steps / 2; k += 1) {
    const a = angle + wrap + ((TAU - 2 * wrap) * k) / (steps / 2)
    points.push({ x: x1 + Math.cos(a) * r1, y: y1 + Math.sin(a) * r1 })
  }
  for (let k = 0; k <= steps / 2; k += 1) {
    const a = angle - wrap + (2 * wrap * k) / (steps / 2)
    points.push({ x: x2 + Math.cos(a) * r2, y: y2 + Math.sin(a) * r2 })
  }
  return points
}

/** A straight-edged closed path through the points. */
export const polygonPath = (points: Point[]) =>
  `${points.map((point, index) => `${index ? 'L' : 'M'}${round(point.x)} ${round(point.y)}`).join('')}Z`

/** A regular polygon whose corners are rounded with circles of radius `corner`. */
function roundedPolygon(sides: number, radius: number, corner: number, rotate: number, steps = 10) {
  const start = radians(rotate)
  const corners = Array.from({ length: sides }, (_, index) => {
    const a = start + (index / sides) * TAU
    return { x: Math.cos(a) * (radius - corner), y: Math.sin(a) * (radius - corner) }
  })
  const normal = (from: Point, to: Point) => {
    const length = Math.hypot(to.x - from.x, to.y - from.y) || 1
    return Math.atan2(-(to.x - from.x) / length, (to.y - from.y) / length)
  }
  const points: Point[] = []
  corners.forEach((point, index) => {
    const before = corners[(index - 1 + sides) % sides]
    const after = corners[(index + 1) % sides]
    const first = normal(before, point)
    let turn = normal(point, after) - first
    while (turn > Math.PI) turn -= TAU
    while (turn < -Math.PI) turn += TAU
    for (let k = 0; k <= steps; k += 1) {
      const a = first + (turn * k) / steps
      points.push({ x: point.x + Math.cos(a) * corner, y: point.y + Math.sin(a) * corner })
    }
  })
  return castRadii(points)
}

/** The outer edge of overlapping circles, like a cloud. */
function circleUnion(circles: readonly (readonly number[])[]) {
  return ANGLES.map((_, index) => {
    let reach = 0
    for (const [x, y, r] of circles) {
      const along = COS[index] * x + SIN[index] * y
      const disc = along * along - (x * x + y * y - r * r)
      if (disc >= 0) reach = Math.max(reach, along + Math.sqrt(disc))
    }
    return reach
  })
}

function buildRadii(recipe: ShapeRecipe): number[] {
  switch (recipe.kind) {
    case 'circle':
      return [...UNIT]
    case 'waves':
      return normalize(
        ANGLES.map((a) =>
          recipe.waves.reduce((sum, [n, amp, phase]) => sum + amp * Math.cos(n * a + phase), 1),
        ),
        recipe.peak,
      )
    case 'superellipse': {
      const n = recipe.exponent
      const radii = ANGLES.map(
        (_, index) => (Math.abs(COS[index]) ** n + Math.abs(SIN[index]) ** n) ** (-1 / n),
      )
      return normalize(radii, recipe.peak)
    }
    case 'hull': {
      const radii = castRadii(hull(recipe.from, recipe.to))
      return recipe.peak ? normalize(radii, recipe.peak) : radii
    }
    case 'polygon':
      return roundedPolygon(recipe.sides, recipe.radius, recipe.corner, recipe.rotate)
    case 'circles':
      return normalize(circleUnion(recipe.circles), recipe.peak)
  }
}

export const SHAPE_RADII = Object.fromEntries(
  Object.entries(SHAPE_RECIPES).map(([key, recipe]) => [key, buildRadii(recipe)]),
) as Record<BotShape, number[]>

/** A plain silhouette: every radius `radius`, or the given radii. */
export const silhouette = (
  radii: number | readonly number[],
  rest: Partial<Omit<Silhouette, 'radii'>> = {},
): Silhouette => ({
  radii: typeof radii === 'number' ? UNIT.map(() => radii) : [...radii],
  rot: 0,
  cx: 0,
  cy: 0,
  sx: 1,
  sy: 1,
  ...rest,
})

/** The radius between samples, for any angle. */
export function radiusAt(radii: readonly number[], angle: number) {
  const index = ((((angle / TAU) % 1) + 1) % 1) * radii.length
  const low = Math.floor(index)
  return lerp(radii[low % radii.length] ?? 1, radii[(low + 1) % radii.length] ?? 1, index - low)
}

export function outline(sil: Silhouette): Point[] {
  const cos = Math.cos(sil.rot)
  const sin = Math.sin(sil.rot)
  return sil.radii.map((radius, index) => {
    const x = radius * COS[index]
    const y = radius * SIN[index]
    return {
      x: ((x * cos - y * sin) * sil.sx + sil.cx) * SCALE,
      y: ((x * sin + y * cos) * sil.sy + sil.cy) * SCALE,
    }
  })
}

/** A closed cubic path through every point, each tangent parallel to its neighbours' chord. */
export function smoothPath(points: Point[], tension = 1 / 6) {
  const count = points.length
  let d = `M${round(points[0].x)} ${round(points[0].y)}`
  for (let index = 0; index < count; index += 1) {
    const prev = points[(index - 1 + count) % count]
    const from = points[index]
    const to = points[(index + 1) % count]
    const next = points[(index + 2) % count]
    d += `C${round(from.x + (to.x - prev.x) * tension)} ${round(from.y + (to.y - prev.y) * tension)} ${round(to.x - (next.x - from.x) * tension)} ${round(to.y - (next.y - from.y) * tension)} ${round(to.x)} ${round(to.y)}`
  }
  return `${d}Z`
}

/** A pill centred on the origin. */
export function pillPath(width: number, height: number) {
  const x = Math.max(width, 0.01) / 2
  const y = Math.max(height, 0.01) / 2
  const r = round(Math.min(x, y))
  const [l, t, rr, b] = [round(-x), round(-y), round(x), round(y)]
  return `M${l} ${round(-y + r)}A${r} ${r} 0 0 1 ${round(-x + r)} ${t}L${round(x - r)} ${t}A${r} ${r} 0 0 1 ${rr} ${round(-y + r)}L${rr} ${round(y - r)}A${r} ${r} 0 0 1 ${round(x - r)} ${b}L${round(-x + r)} ${b}A${r} ${r} 0 0 1 ${l} ${round(y - r)}Z`
}

/* Eyes: two points on a sphere, turned by the gaze and spread `split` degrees apart. */

export type Projected = {
  x: number
  y: number
  a: number
  b: number
  c: number
  d: number
  depth: number
}
type Vec = [number, number, number]

const turn = (u: Vec, v: Vec, angle: number): [Vec, Vec] => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [
    [u[0] * cos + v[0] * sin, u[1] * cos + v[1] * sin, u[2] * cos + v[2] * sin],
    [v[0] * cos - u[0] * sin, v[1] * cos - u[1] * sin, v[2] * cos - u[2] * sin],
  ]
}

export function projectEyes(gaze: Gaze, split: number): [Projected, Projected] {
  let forward: Vec = [0, 0, 1]
  let right: Vec = [1, 0, 0]
  let up: Vec = [0, 1, 0]
  ;[forward, right] = turn(forward, right, radians(gaze.yaw))
  ;[up, forward] = turn(up, forward, radians(gaze.pitch))
  ;[right, up] = turn(right, up, radians(gaze.roll))
  const place = (side: number): Projected => {
    const [point, across] = turn(forward, right, radians(split * side))
    return {
      x: point[0] * SCALE,
      y: point[1] * SCALE,
      a: across[0],
      b: across[1],
      c: up[0],
      d: up[1],
      depth: point[2],
    }
  }
  return [place(-1), place(1)]
}

/** The eye's 2×2 transform: the sphere's tangent frame, turned by the eye's own tilt. */
export function eyeMatrix(p: Projected, tilt: number) {
  const cos = Math.cos(radians(tilt))
  const sin = Math.sin(radians(tilt))
  return [
    p.a * cos + p.c * sin,
    p.b * cos + p.d * sin,
    -p.a * sin + p.c * cos,
    -p.b * sin + p.d * cos,
  ] as const
}

/* Eye fit: some faces push the eyes past a narrow outline, so find the smallest nudge that keeps them inside. */

type Print = { x: number; y: number; ax: number; ay: number; r: number; m: readonly number[] }

function footprints(face: FacePose, radii: readonly number[]): Print[] {
  const prints: Print[] = []
  projectEyes(face.gaze, face.split).forEach((p, side) => {
    if (p.depth <= 0.02) return
    const eye = face.eyes[side]
    const m = eyeMatrix(p, eye.tilt)
    const halfW = Math.max(SCALE * eye.w, 0.01) / 2
    const halfH = Math.max(SCALE * eye.h, 0.01) / 2
    const r = Math.min(halfW, halfH)
    const tall = halfH > halfW
    const half = tall ? halfH - r : halfW - r
    const k = radiusAt(radii, Math.atan2(p.y, p.x))
    prints.push({
      x: p.x * k,
      y: p.y * k,
      ax: (tall ? m[2] : m[0]) * half,
      ay: (tall ? m[3] : m[1]) * half,
      r,
      m,
    })
  })
  return prints
}

/** Smallest gap between the eyes and the outline once moved by (dx, dy); negative means they poke out. */
function clearance(contour: Point[], prints: Print[], dx: number, dy: number) {
  let worst = Infinity
  for (const print of prints) {
    const x1 = print.x + dx - print.ax
    const y1 = print.y + dy - print.ay
    const sx = 2 * print.ax
    const sy = 2 * print.ay
    const length = sx * sx + sy * sy
    let best = Infinity
    let ux = 0
    let uy = 0
    for (const point of contour) {
      const t = length > 0 ? clamp(((point.x - x1) * sx + (point.y - y1) * sy) / length) : 0
      const rx = x1 + t * sx - point.x
      const ry = y1 + t * sy - point.y
      const distance = rx * rx + ry * ry
      if (distance < best) {
        best = distance
        ux = rx
        uy = ry
      }
    }
    const gap = Math.sqrt(best)
    ux = gap > 1e-9 ? ux / gap : 0
    uy = gap > 1e-9 ? uy / gap : 0
    const [m0, m1, m2, m3] = print.m
    const reach = print.r * Math.hypot(m0 * ux + m1 * uy, m2 * ux + m3 * uy) + FIT.margin
    worst = Math.min(worst, gap - reach)
  }
  return worst
}

/** How far to move the eyes, in body units, so they clear this outline as well as they would a circle. */
export function solveOffset(radii: readonly number[], face: FacePose): Point {
  const contour = outline(silhouette(radii))
  const circle = outline(silhouette(1))
  const samples = [-FIT.jitterYaw, FIT.jitterYaw].flatMap((yaw) =>
    [-FIT.jitterPitch, FIT.jitterPitch].map((pitch) => {
      const pose = {
        ...face,
        gaze: { ...face.gaze, yaw: face.gaze.yaw + yaw, pitch: face.gaze.pitch + pitch },
      }
      return { prints: footprints(pose, radii), reference: footprints(pose, UNIT) }
    }),
  )
  const fit = (dx: number, dy: number) =>
    Math.min(...samples.map((sample) => clearance(contour, sample.prints, dx, dy)))

  // the clearance the eyes have on a plain circle is the bar to meet
  let goal = Math.min(...samples.map((sample) => clearance(circle, sample.reference, 0, 0)))
  const first = samples[0].prints
  const cx = -first.reduce((sum, print) => sum + print.x, 0) / (first.length || 1)
  const cy = -first.reduce((sum, print) => sum + print.y, 0) / (first.length || 1)
  const reach = Math.max(FIT.minReach, FIT.reach * Math.hypot(cx, cy))
  goal = Math.min(goal, fit(cx, cy))
  const here = fit(0, 0)
  if (here >= goal && here >= 0) return { x: 0, y: 0 }

  const target = Math.max(goal, 0)
  let nearest = Infinity
  let best = { x: 0, y: 0 }
  let fallback = { x: 0, y: 0, fit: here }
  for (let k = 0; k < FIT.directions; k += 1) {
    const a = (k / FIT.directions) * TAU
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    if (fit(dx * reach, dy * reach) < target) {
      for (const probe of FIT.probes) {
        const value = fit(dx * reach * probe, dy * reach * probe)
        if (value > fallback.fit) fallback = { x: dx * reach * probe, y: dy * reach * probe, fit: value }
      }
      continue
    }
    let low = 0
    let high = reach
    for (let step = 0; step < FIT.steps; step += 1) {
      const mid = (low + high) / 2
      if (fit(dx * mid, dy * mid) >= target) high = mid
      else low = mid
    }
    if (high < nearest) {
      nearest = high
      best = { x: dx * high, y: dy * high }
    }
  }
  const pick = nearest === Infinity ? fallback : best
  return { x: pick.x / SCALE, y: pick.y / SCALE }
}

/* Idle life: a slow wander of the gaze, a drift and a breath, and blinks on a fixed random schedule. */

const wave = (t: number, period: number, phase: number) => {
  const r = (t / period) * TAU
  return (
    0.55 * Math.sin(r + phase) +
    0.3 * Math.sin(2 * r + 1.7 * phase + 1.1) +
    0.15 * Math.sin(3 * r + 2.3 * phase + 2.4)
  )
}
const waves = (t: number, list: readonly (readonly number[])[]) =>
  list.reduce((sum, [amp, period, phase]) => sum + amp * wave(t, period, phase), 0)

const BLINKS = (() => {
  const random = seeded(BLINK.seed)
  const times: number[] = []
  let at = BLINK.first
  while (at < BLINK_LOOP) {
    times.push(at)
    at += BLINK.gap + BLINK.spread * random()
    if (random() < BLINK.double) {
      times.push(at)
      at += BLINK.doubleGap
    }
  }
  return times
})()

/** 1 when open, dipping to 0 and back during a blink. */
export function lidAt(time: number) {
  const t = time % BLINK_LOOP
  for (const at of BLINKS) {
    if (t < at) break
    const k = (t - at) / BLINK_LENGTH
    if (k >= 0 && k <= 1) return k < BLINK_CLOSE ? 1 - k / BLINK_CLOSE : (k - BLINK_CLOSE) / (1 - BLINK_CLOSE)
  }
  return 1
}

export function idleMotion(t: number, { wander, blink, float }: { wander: number; blink: boolean; float: boolean }) {
  const [breathAmp, breathPeriod] = WANDER.breath
  return {
    yaw: waves(t, WANDER.yaw) * wander,
    pitch: waves(t, WANDER.pitch) * wander,
    roll: waves(t, WANDER.roll) * wander,
    lid: blink ? lidAt(t) : 1,
    driftX: float ? WANDER.driftX[0] * wave(t, WANDER.driftX[1], WANDER.driftX[2]) : 0,
    driftY: float ? WANDER.driftY[0] * wave(t, WANDER.driftY[1], WANDER.driftY[2]) : 0,
    breath: float ? 1 + breathAmp * Math.sin((t / breathPeriod) * TAU) : 1,
  }
}

/* Arc rings for the Move states. */

/** A hue on the studio's soft rainbow: fixed saturation and lightness. */
function hue(degrees: number, saturation = 0.55, lightness = 0.62) {
  const h = ((degrees % 360) + 360) % 360
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lightness - chroma / 2
  const [r, g, b] =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x]
  const hex = (channel: number) => Math.round((channel + m) * 255).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

/** One ring at time `t`: the stretch in front of the body and the stretch behind it, and its gradient. */
export function renderArc(seed: ArcSeed, t: number, id: string, opacity: number): ArcFrame {
  const start = seed.phase + t * seed.speed * TAU
  const cos = Math.cos(seed.tilt)
  const sin = Math.sin(seed.tilt)
  const depth = Math.sqrt(Math.max(0, 1 - seed.k * seed.k))
  const sweep = seed.sweep * TAU
  let front = ''
  let back = ''
  let wasBehind: boolean | null = null
  for (let index = 0; index <= ARC_POINTS; index += 1) {
    const a = start + (index / ARC_POINTS) * sweep
    const c = Math.cos(a)
    const s = Math.sin(a)
    const x = round((seed.a * (c * cos - s * sin * seed.k) + seed.cx) * SCALE)
    const y = round((seed.a * (c * sin + s * cos * seed.k) + seed.cy) * SCALE)
    const behind = seed.a * s * depth < 0
    const segment = `${behind === wasBehind ? 'L' : 'M'}${x} ${y}`
    if (behind) back += segment
    else front += segment
    wasBehind = behind
  }
  const dx = cos * seed.a * SCALE
  const dy = sin * seed.a * SCALE
  return {
    id,
    front,
    back,
    width: seed.width * SCALE,
    opacity,
    gradient: {
      x1: round(seed.cx * SCALE - dx),
      y1: round(seed.cy * SCALE - dy),
      x2: round(seed.cx * SCALE + dx),
      y2: round(seed.cy * SCALE + dy),
      stops: [hue(seed.hue), hue(seed.hue + 0.5 * seed.hueSpan), hue(seed.hue + seed.hueSpan)],
    },
  }
}

/** A stable per-instance phase from a React id, so neighbours wander and blink out of step. */
export function phaseFrom(id: string) {
  let hash = 0
  for (const char of id) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0
  return (Math.abs(hash) % 6000) / 100
}
