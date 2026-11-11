import type { ReactNode } from 'react'

/*
 * A local port of figma-squircle's getSvgPath, cut down to what the toast
 * uses: one radius on every corner, cornerSmoothing 1, preserveSmoothing off.
 * Each corner is a short cubic, a circular arc and another cubic, so the
 * curvature eases in instead of jumping like a plain border-radius.
 */

const toRadians = (degrees: number) => (degrees * Math.PI) / 180
const round = (n: number) => Math.round(n * 1e4) / 1e4

type Corner = {
  a: number
  b: number
  c: number
  d: number
  p: number
  r: number
  arc: number
}

function corner(radius: number, smoothing: number, budget: number): Corner {
  // without preserveSmoothing, the smoothing shrinks to whatever fits the shorter side
  const s = Math.min(smoothing, budget / radius - 1)
  const p = Math.min((1 + smoothing) * radius, budget)

  const arcMeasure = 90 * (1 - s)
  const arc = Math.sin(toRadians(arcMeasure / 2)) * radius * Math.SQRT2
  const alpha = (90 - arcMeasure) / 2
  const p3ToP4 = radius * Math.tan(toRadians(alpha / 2))
  const beta = 45 * s
  const c = p3ToP4 * Math.cos(toRadians(beta))
  const d = c * Math.tan(toRadians(beta))
  const b = (p - arc - c - d) / 3
  const a = 2 * b

  return { a, b, c, d, p, r: radius, arc }
}

/** SVG path for a `width` × `height` squircle, for `clip-path: path(...)` or an outline stroke. */
export function squirclePath(width: number, height: number, cornerRadius: number, smoothing = 1) {
  const budget = Math.min(width, height) / 2
  const radius = Math.min(cornerRadius, budget)
  if (radius <= 0) return `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`

  const { a, b, c, d, p, r, arc } = corner(radius, smoothing, budget)
  const n = (value: number) => round(value)

  return [
    `M ${n(width - p)} 0`,
    // top right
    `c ${n(a)} 0 ${n(a + b)} 0 ${n(a + b + c)} ${n(d)}`,
    `a ${n(r)} ${n(r)} 0 0 1 ${n(arc)} ${n(arc)}`,
    `c ${n(d)} ${n(c)} ${n(d)} ${n(b + c)} ${n(d)} ${n(a + b + c)}`,
    `L ${n(width)} ${n(height - p)}`,
    // bottom right
    `c 0 ${n(a)} 0 ${n(a + b)} ${n(-d)} ${n(a + b + c)}`,
    `a ${n(r)} ${n(r)} 0 0 1 ${n(-arc)} ${n(arc)}`,
    `c ${n(-c)} ${n(d)} ${n(-(b + c))} ${n(d)} ${n(-(a + b + c))} ${n(d)}`,
    `L ${n(p)} ${n(height)}`,
    // bottom left
    `c ${n(-a)} 0 ${n(-(a + b))} 0 ${n(-(a + b + c))} ${n(-d)}`,
    `a ${n(r)} ${n(r)} 0 0 1 ${n(-arc)} ${n(-arc)}`,
    `c ${n(-d)} ${n(-c)} ${n(-d)} ${n(-(b + c))} ${n(-d)} ${n(-(a + b + c))}`,
    `L 0 ${n(p)}`,
    // top left
    `c 0 ${n(-a)} 0 ${n(-(a + b))} ${n(d)} ${n(-(a + b + c))}`,
    `a ${n(r)} ${n(r)} 0 0 1 ${n(arc)} ${n(-arc)}`,
    `c ${n(c)} ${n(-d)} ${n(b + c)} ${n(-d)} ${n(a + b + c)} ${n(-d)}`,
    'Z',
  ].join(' ')
}

/** A promise message is either fixed or built from the result. */
export const message = <V>(value: ReactNode | ((input: V) => ReactNode), input: V) =>
  typeof value === 'function' ? value(input) : value
