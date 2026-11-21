import { useCallback, useRef, useState } from 'react'

/** Minimal controlled/uncontrolled state, in place of @radix-ui/react-use-controllable-state. */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T
  defaultProp: T
  onChange?: (value: T) => void
}) {
  const [inner, setInner] = useState(defaultProp)
  const controlled = prop !== undefined
  const value = controlled ? prop : inner
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const valueRef = useRef(value)
  valueRef.current = value

  const setValue = useCallback(
    (next: T) => {
      if (Object.is(next, valueRef.current)) return
      if (!controlled) setInner(next)
      onChangeRef.current?.(next)
    },
    [controlled],
  )

  return [value, setValue] as const
}
