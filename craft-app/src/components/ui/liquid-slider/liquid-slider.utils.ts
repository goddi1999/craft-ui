/** Percentage (0–100) of `value` between `min` and `max`. */
export function toPercent(value: number, min: number, max: number) {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}

/**
 * How far the liquid fill reaches inside the thumb for a given track progress.
 * It races to 60% over the first 10% of travel, holds through the middle, and
 * fills the rest over the last 10% — so the thumb only looks "empty" or "full"
 * near the ends.
 */
export function toLiquid(percent: number) {
  if (percent <= 10) return (percent / 10) * 60
  if (percent < 90) return 60
  return 60 + ((percent - 90) / 10) * 40
}

/** Strip characters that are not valid in an SVG `url(#id)` reference. */
export function toSvgId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '')
}
