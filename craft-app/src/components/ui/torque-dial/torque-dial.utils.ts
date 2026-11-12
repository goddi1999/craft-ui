import { START_ANGLE, SWEEP } from './torque-dial.constants'

/** Where `value` sits between `min` and `max`, from 0 to 1. */
export const toProgress = (value: number, min: number, max: number) =>
  Math.min(1, Math.max(0, (value - min) / (max - min || 1)))

/** The knob's rotation in degrees for a progress from 0 to 1. */
export const toAngle = (progress: number) => START_ANGLE + progress * SWEEP

/** Snaps to the nearest step counted from `min`, kept in range. */
export function snap(value: number, min: number, max: number, step: number) {
  const stepped = Math.round((value - min) / step) * step + min
  return Math.min(max, Math.max(min, Number(stepped.toFixed(2))))
}

/** The pointer's angle around the middle of `rect`: 0 at 12 o'clock, -180 to 180. */
export function pointerAngle(rect: DOMRect, x: number, y: number) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const degrees = (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI + 90
  return degrees > 180 ? degrees - 360 : degrees
}

/** The shorter turn from one angle to another, so crossing 6 o'clock does not spike. */
export function turnBetween(from: number, to: number) {
  const delta = to - from
  if (delta > 180) return delta - 360
  if (delta < -180) return delta + 360
  return delta
}

/** How much a turn of `degrees` changes the value. */
export const turnToValue = (degrees: number, min: number, max: number) =>
  (degrees / SWEEP) * (max - min)

/** The value a key moves the dial to, or null for keys the dial ignores. */
export function keyToValue(key: string, value: number, min: number, max: number, step: number) {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return snap(value + step, min, max, step)
    case 'ArrowLeft':
    case 'ArrowDown':
      return snap(value - step, min, max, step)
    case 'Home':
      return min
    case 'End':
      return max
    default:
      return null
  }
}
