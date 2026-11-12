import {
  ARC,
  BAND_GIVE,
  BAND_LIMIT,
  FADE_LENGTH,
  FADE_START,
  FOUR_ANGLES,
  MAX_STRETCH,
  STRETCH_SPEED,
} from './goo-menu.constants'

export type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }
export type Point = { x: number; y: number }

export const ORIGIN: Point = { x: 0, y: 0 }

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Reduced motion keeps the stiffness but damps critically, so nothing overshoots. */
export const withReducedMotion = <T extends Spring>(spring: T, reduced: boolean): T =>
  reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring

/** How far a bubble follows a pull of `distance` px: all of it at first, never more than the limit. */
export const rubberBand = (distance: number) =>
  BAND_LIMIT * (1 - 1 / ((distance * BAND_GIVE) / BAND_LIMIT + 1))

function arcAngles(count: number): readonly number[] {
  if (count === FOUR_ANGLES.length) return FOUR_ANGLES
  if (count === 1) return [(ARC.start + ARC.end) / 2]
  return Array.from(
    { length: count },
    (_, i) => ARC.start + (i * (ARC.end - ARC.start)) / (count - 1),
  )
}

/** Where each bubble rests, relative to the centre of the +. */
export function bubbleHomes(count: number, radius: number): Point[] {
  return arcAngles(count).map((degrees) => {
    const angle = (degrees * Math.PI) / 180
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
  })
}

/** Moves the blob and squashes it along the way it travels, so fast drops look stretched. */
export function blobTransform(x: number, y: number, vx: number, vy: number, scale: number) {
  const stretch = 1 + Math.min(Math.hypot(vx, vy) / STRETCH_SPEED, MAX_STRETCH)
  const angle = Math.atan2(vy, vx)
  return `translate(${x}px, ${y}px) rotate(${angle}rad) scale(${scale * stretch}, ${scale / stretch})`
}

/** Icons stay hidden inside the + and fade in as their bubble peels away. */
export const iconOpacity = (x: number, y: number) =>
  clamp((Math.hypot(x, y) - FADE_START) / FADE_LENGTH, 0, 1)
