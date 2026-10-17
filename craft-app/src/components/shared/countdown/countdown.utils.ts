/** Offset of a zone from UTC at an instant, in milliseconds. */
function zoneOffset(epoch: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(epoch))
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)
  return (
    Date.UTC(
      get('year'),
      get('month') - 1,
      get('day'),
      get('hour'),
      get('minute'),
      get('second'),
    ) -
    Math.floor(epoch / 1000) * 1000
  )
}

/** Resolves a countdown target to epoch milliseconds without ever reading the device's own time zone. */
export function toEpoch(target: Date | number | string, timeZone?: string) {
  if (typeof target === 'number') return target
  if (target instanceof Date) return target.getTime()
  const wall =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/.exec(
      target.trim(),
    )
  if (!wall) return Date.parse(target)
  const utc = Date.UTC(
    +wall[1]!,
    +wall[2]! - 1,
    +wall[3]!,
    +(wall[4] ?? 0),
    +(wall[5] ?? 0),
    +(wall[6] ?? 0),
  )
  if (!timeZone) return utc
  // Two passes settle the offset across a daylight saving change.
  const guess = utc - zoneOffset(utc, timeZone)
  return utc - zoneOffset(guess, timeZone)
}
