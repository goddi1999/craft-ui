import { useCallback, useLayoutEffect, useRef, useState } from 'react'

type ControllableStateOptions<T> = {
  value: T | undefined
  defaultValue: T
  onChange?: (next: T) => void
}

/**
 * State that is controlled when `value` is passed and uncontrolled otherwise.
 * `onChange` fires for both, but only when the value actually changes.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>) {
  const [inner, setInner] = useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner

  const latest = useRef({ current, onChange })
  useLayoutEffect(() => {
    latest.current = { current, onChange }
  })

  const set = useCallback(
    (next: T) => {
      if (Object.is(next, latest.current.current)) return
      if (!controlled) setInner(next)
      latest.current.onChange?.(next)
    },
    [controlled],
  )

  return [current, set] as const
}
