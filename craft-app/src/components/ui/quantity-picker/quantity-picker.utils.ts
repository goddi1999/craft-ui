/** Every whole number from `min` to `max`, one per line, for the rolling track. */
export function rangeLines(min: number, max: number) {
  const start = Math.ceil(min)
  const length = Math.max(0, Math.floor(max) - start + 1)
  return Array.from({ length }, (_, index) => start + index).join('\n')
}

/** Count of digits after the decimal point, so float steps stay tidy. */
export function decimalsOf(value: number) {
  const [, fraction = ''] = String(value).split('.')
  return fraction.length
}
