export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** `75` → `1:15`. */
export function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

/** Index of the chapter playing at `time`: the last one that has already started. */
export function chapterAt(starts: readonly number[], time: number) {
  let index = 0
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] <= time) index = i
    else break
  }
  return index
}
