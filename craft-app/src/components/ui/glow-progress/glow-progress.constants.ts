import type { GlowProgressSize, GlowProgressToneColors } from './glow-progress.types'

/**
 * The agent bot's studio palette (`agent-computer-icon` BOT_COLORS), copied here so this
 * folder stays self-contained.
 */
const BASE_COLORS = {
  ink: '#0a0a0c',
  brown: '#8b5e3c',
  red: '#e8483f',
  orange: '#f08a24',
  amber: '#f0b429',
  green: '#3ecf8e',
  turquoise: '#2fbfa0',
  blue: '#3b93f0',
  purple: '#8b5cf6',
  pink: '#e152b0',
  grey: '#a3a3a3',
} as const

/** Fill runs from the base colour to a pale tint of it; the halo is that tint, half see-through. */
function toTone(base: string): GlowProgressToneColors {
  const tint = `color-mix(in oklab, ${base} 45%, white)`
  return { from: base, to: tint, glow: `color-mix(in oklab, ${tint} 60%, transparent)` }
}

export const GLOW_PROGRESS_TONES = {
  // The default: a hand-tuned green-to-yellow that no single base colour produces.
  lime: { from: '#58cc02', to: '#e9f53d', glow: 'rgb(246 240 112 / 0.6)' },
  ink: toTone(BASE_COLORS.ink),
  brown: toTone(BASE_COLORS.brown),
  red: toTone(BASE_COLORS.red),
  orange: toTone(BASE_COLORS.orange),
  amber: toTone(BASE_COLORS.amber),
  green: toTone(BASE_COLORS.green),
  turquoise: toTone(BASE_COLORS.turquoise),
  blue: toTone(BASE_COLORS.blue),
  purple: toTone(BASE_COLORS.purple),
  pink: toTone(BASE_COLORS.pink),
  grey: toTone(BASE_COLORS.grey),
} satisfies Record<string, GlowProgressToneColors>

export const GLOW_PROGRESS_TONE_NAMES = Object.keys(GLOW_PROGRESS_TONES) as Array<
  keyof typeof GLOW_PROGRESS_TONES
>

/** Bar height in px. The sparkle, highlight and halo scale with it. */
export const GLOW_PROGRESS_HEIGHTS: Record<GlowProgressSize, number> = {
  sm: 10,
  md: 18,
  lg: 28,
}
