import type { AvatarConstellationTint } from './avatar-constellation.types'

/** Tints are CSS variables with a light and a dark value. */
export const TINT_CLASS: Record<AvatarConstellationTint, string> = {
  lavender: '[--ac-tint:oklch(0.9_0.05_285)] dark:[--ac-tint:oklch(0.84_0.07_285)]',
  mint: '[--ac-tint:oklch(0.92_0.06_165)] dark:[--ac-tint:oklch(0.84_0.08_165)]',
  peach: '[--ac-tint:oklch(0.92_0.06_55)] dark:[--ac-tint:oklch(0.85_0.08_55)]',
  sky: '[--ac-tint:oklch(0.92_0.05_235)] dark:[--ac-tint:oklch(0.84_0.07_235)]',
  rose: '[--ac-tint:oklch(0.92_0.05_5)] dark:[--ac-tint:oklch(0.84_0.07_5)]',
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const toDepth = (depth: number | undefined) => clamp(depth ?? 0.5, 0, 1)

/** Stacking order: far tiles tuck behind the centre disc (z 10), near ones sit in front. */
export const stackOrder = (depth: number) => (depth > 0.6 ? 20 : 1)

/** Deterministic 0-1 value per index, so drift is desynced yet stable across renders. */
const unit = (index: number, salt: number) => {
  const raw = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return raw - Math.floor(raw)
}

/** Keyframes tracing a small circle, started at a per-tile phase. */
export function orbit(index: number) {
  const radius = 4 + unit(index, 1) * 5
  const phase = unit(index, 2) * Math.PI * 2
  const steps = 9
  const points = Array.from({ length: steps }, (_, step) => {
    const angle = phase + (step / (steps - 1)) * Math.PI * 2
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
  })
  return {
    x: points.map((point) => point.x),
    y: points.map((point) => point.y),
    duration: 9 + unit(index, 3) * 7,
  }
}

/** Unit vector pointing from the stage centre to a tile, and its distance (in %). */
export function outward(x: number, y: number) {
  const dx = x - 50
  const dy = y - 50
  const distance = Math.hypot(dx, dy) || 1
  return { ux: dx / distance, uy: dy / distance, distance }
}
