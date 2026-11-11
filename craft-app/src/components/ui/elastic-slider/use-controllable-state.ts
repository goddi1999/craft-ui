import { useCallback, useEffect, useRef, useState } from 'react'

type UseControllableStateParams<T> = {
  prop?: T
  defaultProp: T
  onChange?: (state: T) => void
}

/**
 * Minimal controlled/uncontrolled state (after Radix's useControllableState).
 * `onChange` fires for every change in both modes, but never for a no-op.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>) {
  const [uncontrolled, setUncontrolled] = useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolled

  // Always call the latest handler without re-creating `setValue`.
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const setValue = useCallback(
    (next: T) => {
      if (next === value) return
      if (!isControlled) setUncontrolled(next)
      onChangeRef.current?.(next)
    },
    [isControlled, value],
  )

  return [value, setValue] as const
}
