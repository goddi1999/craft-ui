import type {
  GlowProgressSize,
  GlowProgressTone,
  GlowProgressToneColors,
} from './glow-progress.types'

export const GLOW_PROGRESS_TONES: Record<GlowProgressTone, GlowProgressToneColors> = {
  lime: { from: '#58cc02', to: '#e9f53d', glow: 'rgb(246 240 112 / 0.6)' },
  orange: { from: '#f97316', to: '#fcd34d', glow: 'rgb(253 200 120 / 0.6)' },
  sky: { from: '#0ea5e9', to: '#a5f3fc', glow: 'rgb(165 243 252 / 0.6)' },
  violet: { from: '#8b5cf6', to: '#f0abfc', glow: 'rgb(240 171 252 / 0.55)' },
}

/** Bar height in px. The sparkle, highlight and halo scale with it. */
export const GLOW_PROGRESS_HEIGHTS: Record<GlowProgressSize, number> = {
  sm: 10,
  md: 18,
  lg: 28,
}
