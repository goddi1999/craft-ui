// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
export const round = (n: number) => Math.round(n * 100) / 100
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** 41.8 → "00:41.8" */
export function clock(seconds: number) {
  const t = Math.max(0, Math.floor(seconds * 10) / 10)
  const m = Math.floor(t / 60)
  const s = t - m * 60
  return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`
}

/** Signed delta with a real minus sign: "−0.8", "+0.4". */
export function signed(delta: number) {
  const d = Math.round(delta * 10) / 10
  if (d === 0) return '±0.0'
  return `${d < 0 ? '−' : '+'}${Math.abs(d).toFixed(1)}`
}

/** Point at angle `a` (degrees, 0 at the top, clockwise) and radius `r` around (ox, oy). */
export function polar(a: number, r: number, ox: number, oy: number) {
  const rad = ((a - 90) * Math.PI) / 180
  return [round(ox + r * Math.cos(rad)), round(oy + r * Math.sin(rad))] as const
}

/** SVG arc path from angle `a0` to `a1` around (ox, oy). */
export function arc(a0: number, a1: number, r: number, ox: number, oy: number) {
  const end = Math.min(a1, a0 + 359.9)
  const [x0, y0] = polar(a0, r, ox, oy)
  const [x1, y1] = polar(end, r, ox, oy)
  return `M${x0} ${y0}A${r} ${r} 0 ${end - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`
}
