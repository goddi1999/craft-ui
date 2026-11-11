import type { RingTone } from './avatar-rings.types'

export const RING_TONES: RingTone[] = [
  'purple',
  'teal',
  'red',
  'indigo',
  'blue',
  'green',
  'orange',
  'pink',
]

/** Each tone defines `--ring-tone` with a light and a dark value. */
export const TONE_CLASS: Record<RingTone, string> = {
  purple: '[--ring-tone:oklch(0.62_0.19_305)] dark:[--ring-tone:oklch(0.7_0.17_305)]',
  teal: '[--ring-tone:oklch(0.7_0.12_200)] dark:[--ring-tone:oklch(0.75_0.12_200)]',
  red: '[--ring-tone:oklch(0.62_0.21_25)] dark:[--ring-tone:oklch(0.7_0.19_25)]',
  indigo: '[--ring-tone:oklch(0.5_0.2_275)] dark:[--ring-tone:oklch(0.62_0.19_275)]',
  blue: '[--ring-tone:oklch(0.65_0.17_245)] dark:[--ring-tone:oklch(0.72_0.15_245)]',
  green: '[--ring-tone:oklch(0.75_0.19_145)] dark:[--ring-tone:oklch(0.78_0.17_145)]',
  orange: '[--ring-tone:oklch(0.75_0.17_55)] dark:[--ring-tone:oklch(0.78_0.16_55)]',
  pink: '[--ring-tone:oklch(0.72_0.19_350)] dark:[--ring-tone:oklch(0.76_0.17_350)]',
}

export const toneAt = (index: number, ring?: RingTone): RingTone =>
  ring ?? RING_TONES[index % RING_TONES.length]

export const SPRING = { type: 'spring', stiffness: 420, damping: 26, mass: 0.7 } as const
export const INSTANT = { duration: 0 } as const
export const STAGGER = 0.06

/** How far a neighbour is pushed away from the hovered avatar, in px. */
export const pushFor = (index: number, hovered: number | null): number => {
  if (hovered === null || index === hovered) return 0
  const distance = Math.abs(index - hovered)
  const amount = Math.max(0, 10 - (distance - 1) * 4)
  return index > hovered ? amount : -amount
}
