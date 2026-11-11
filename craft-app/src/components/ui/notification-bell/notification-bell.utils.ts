import { BADGE, DOT, ORBIT, ROLL_FADE, ROLL_VELOCITY } from './notification-bell.constants'

export const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

export const digitOf = (value: number) => ((value % 10) + 10) % 10

export function badgeMetrics(size: number, dot: boolean) {
  const side = size * (dot ? DOT : BADGE)
  return {
    side,
    // puts the badge on the circle so it lines up at any size
    inset: size / 2 - (ORBIT * size * Math.SQRT1_2) / 2 - side / 2,
  }
}

/** Fades the top and bottom of a digit column in proportion to how fast it rolls. */
export function rollMask(velocity: number) {
  const fade = Math.min(ROLL_FADE, (Math.abs(velocity) / ROLL_VELOCITY) * ROLL_FADE)
  return `linear-gradient(to bottom, transparent 0%, #000 ${fade}%, #000 ${100 - fade}%, transparent 100%)`
}
