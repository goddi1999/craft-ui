import { useState } from 'react'

/**
 * Holds a demo's settings as one object so every page gets Reset and a
 * "changed from default" check for free, and the usage snippet can print
 * only the props that differ from their defaults.
 */
export function useDemoSettings<T extends Record<string, unknown>>(defaults: T) {
  const [values, setValues] = useState(defaults)

  const set = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const reset = () => setValues(defaults)

  const isDirty = (Object.keys(defaults) as (keyof T)[]).some(
    (key) => !Object.is(values[key], defaults[key]),
  )

  return { values, set, reset, isDirty, defaults }
}
