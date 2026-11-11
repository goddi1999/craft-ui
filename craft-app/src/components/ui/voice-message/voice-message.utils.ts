import type { VoiceMessageSize } from './voice-message.types'

export const SIZES: Record<
  VoiceMessageSize,
  { height: number; gap: number; bar: number; barGap: number; pad: number; text: string }
> = {
  sm: { height: 40, gap: 8, bar: 2, barGap: 2, pad: 12, text: 'text-[11px]' },
  default: { height: 52, gap: 10, bar: 3, barGap: 3, pad: 14, text: 'text-xs' },
  lg: { height: 64, gap: 12, bar: 3, barGap: 4, pad: 16, text: 'text-sm' },
}

const MIN_AMPLITUDE = 0.14

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

export const formatTime = (seconds: number) => {
  const whole = Math.max(0, Math.round(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

/**
 * A speech-like waveform from a seed: a sine envelope (quiet ends, loud
 * middle) shaped by seeded noise. Rounded so server and client agree.
 */
export const buildWaveform = (count: number, seed: number) => {
  let state = (seed >>> 0) + 0x9e3779b9
  return Array.from({ length: count }, (_, i) => {
    state = (state * 1664525 + 1013904223) >>> 0
    const noise = state / 0x100000000
    const envelope = Math.sin((Math.PI * (i + 0.5)) / count) ** 0.55
    const swell = 0.5 + 0.5 * Math.sin(i * 0.9 + seed)
    const amplitude = envelope * (0.3 + 0.5 * noise + 0.2 * swell)
    return Math.round(clamp(amplitude, MIN_AMPLITUDE, 1) * 1000) / 1000
  })
}

/** Walks the outline of a pill: top edge, right cap, bottom edge, left cap. */
export const pointOnPill = (distance: number, width: number, height: number) => {
  const radius = height / 2
  const straight = Math.max(0, width - height)
  const arc = Math.PI * radius
  const perimeter = 2 * straight + 2 * arc

  let d = distance % perimeter
  if (d < 0) d += perimeter

  if (d < straight) return [radius + d, 0]
  d -= straight
  if (d < arc) {
    const a = -Math.PI / 2 + d / radius
    return [width - radius + radius * Math.cos(a), radius + radius * Math.sin(a)]
  }
  d -= arc
  if (d < straight) return [width - radius - d, height]
  d -= straight
  const a = Math.PI / 2 + d / radius
  return [radius + radius * Math.cos(a), radius + radius * Math.sin(a)]
}
