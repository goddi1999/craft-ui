// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { useState } from 'react'

/** Controlled when `value` is set, otherwise keeps its own state. */
export function useControllable<T>(
  value: T | undefined,
  initial: T,
  onChange?: (v: T) => void,
) {
  const [inner, setInner] = useState(initial)
  const current = value === undefined ? inner : value
  const set = (next: T) => {
    if (value === undefined) setInner(next)
    onChange?.(next)
  }
  return [current, set] as const
}
