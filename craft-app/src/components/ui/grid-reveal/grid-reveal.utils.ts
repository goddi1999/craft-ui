// hold short of the end so the run can never finish before the image does
export const HOLD = 0.9
// the grid stops splitting here while waiting, leaving arrival somewhere to go
export const WAIT_CAP = 0.72
// how long one cell takes to separate, in progress units
export const MORPH = 0.055
export const COLOR_MS = 420

// written as comparisons so NaN falls through to 0
export const clamp01 = (n: number) => (n > 0 ? (n < 1 ? n : 1) : 0)
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// never reaches its ceiling, so a job that outruns the estimate keeps creeping
export function selfPaced(elapsed: number, duration: number) {
  const span = duration > 0 ? duration : 1
  return HOLD * (1 - Math.exp(-elapsed / span))
}

export function hash(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return n - Math.floor(n)
}

export function coverRect(iw: number, ih: number, w: number, h: number) {
  const s = Math.max(w / iw, h / ih)
  return { dx: (w - iw * s) / 2, dy: (h - ih * s) / 2, dw: iw * s, dh: ih * s }
}
