export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const pluralDays = (days: number) => `${days} ${days === 1 ? 'day' : 'days'}`

/**
 * A matt palette from one theme token, like Agent Bot's flat colours: one solid fill, a pale
 * tone for the flame's core, and a faint glow that sits behind. Uses CSS relative colour.
 */
export function accentRamp(token: string) {
  const base = `oklch(var(${token}))`
  return {
    '--streak': `oklch(from ${base} 0.72 0.15 h)`,
    '--streak-soft': `oklch(from ${base} 0.92 0.05 h)`,
    '--streak-glow': `oklch(from ${base} 0.72 0.15 h / 0.18)`,
  }
}
