import { useEffect, useState } from 'react'

import { keyId } from './shortcut-recorder.utils'

const EMPTY: ReadonlySet<string> = new Set()
const MODIFIERS = ['ctrl', 'alt', 'shift']

/**
 * Keys held down right now, by physical id. Clears on window blur, and after Command lifts,
 * since macOS drops the other keyups while it is down.
 */
export function usePressedKeys(enabled = true): ReadonlySet<string> {
  const [held, setHeld] = useState<ReadonlySet<string>>(EMPTY)

  useEffect(() => {
    if (!enabled) return
    const update = (change: (next: Set<string>) => void) =>
      setHeld((current) => {
        const next = new Set(current)
        change(next)
        const same = next.size === current.size && [...next].every((key) => current.has(key))
        return same ? current : next
      })
    const down = (event: KeyboardEvent) => {
      const id = keyId(event)
      if (id) update((next) => next.add(id))
    }
    const up = (event: KeyboardEvent) => {
      const id = keyId(event)
      update((next) => {
        if (id) next.delete(id)
        if (id === 'meta') {
          for (const key of [...next]) if (!MODIFIERS.includes(key)) next.delete(key)
        }
        if (!event.metaKey) next.delete('meta')
        if (!event.ctrlKey) next.delete('ctrl')
        if (!event.altKey) next.delete('alt')
        if (!event.shiftKey) next.delete('shift')
      })
    }
    const clear = () => setHeld((current) => (current.size ? EMPTY : current))
    // capture phase, so keys still register while a focused recorder keeps the chord from bubbling
    window.addEventListener('keydown', down, true)
    window.addEventListener('keyup', up, true)
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', clear)
    return () => {
      window.removeEventListener('keydown', down, true)
      window.removeEventListener('keyup', up, true)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', clear)
    }
  }, [enabled])

  return enabled ? held : EMPTY
}
