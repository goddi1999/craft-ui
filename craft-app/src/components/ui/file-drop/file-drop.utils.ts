import { NAME_LIMIT } from './file-drop.constants'

type Spring = { stiffness: number; damping: number }

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const clamp01 = (value: number) => clamp(value, 0, 1)

/** Reduced motion keeps each spring's speed but makes it critically damped, so nothing overshoots. */
export const settle = <T extends Spring>(spring: T, reduced: boolean): T =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

/** Simulated upload curve: a quick start, a stall around the middle, then it runs home. */
export const pace = (x: number) =>
  x < 0.35 ? x * 1.4 : x < 0.6 ? 0.49 + (x - 0.35) * 0.4 : 0.59 + (x - 0.6) * 1.025

export const formatBytes = (bytes: number) =>
  bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`

export const shortName = (name: string) =>
  name.length > NAME_LIMIT ? `${name.slice(0, 10)}…${name.slice(-8)}` : name

/** What the zone shows for the files it was given: the file's name, or a count when there are several. */
export function describeFiles(files: File[]) {
  const size = files.reduce((total, file) => total + file.size, 0)
  return { name: files.length === 1 ? files[0].name : `${files.length} files`, size }
}

/**
 * Opacity of a status line at `position`: 1 is below and entering, 0 in place, -1 gone above.
 * The new line waits for the old one to clear before it shows.
 */
export const lineOpacity = (position: number) =>
  position >= 0 ? clamp01((0.65 - position) / 0.65) : clamp01(1 + position * 1.8)
