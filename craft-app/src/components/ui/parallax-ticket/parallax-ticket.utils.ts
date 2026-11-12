import { QR_CELLS, QR_SEED } from './parallax-ticket.constants'

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

/** Critically damped under reduced motion: same stiffness, no overshoot. */
export function settle<T extends { stiffness: number; damping: number }>(
  spring: T,
  reduced: boolean,
) {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}

const inFinder = (x: number, y: number) =>
  (x < 8 && y < 8) || (x > QR_CELLS - 9 && y < 8) || (x < 8 && y > QR_CELLS - 9)

/** The data cells of a fake QR as one path; same seed, same pattern as the source. */
export function qrPath() {
  let seed = QR_SEED
  const random = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  let path = ''
  for (let y = 0; y < QR_CELLS; y++) {
    for (let x = 0; x < QR_CELLS; x++) {
      // only draw from the generator outside the finders, so the pattern matches the source
      if (!inFinder(x, y) && random() > 0.52) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return path
}

export const QR_FINDERS = [
  [0, 0],
  [QR_CELLS - 7, 0],
  [0, QR_CELLS - 7],
] as const
