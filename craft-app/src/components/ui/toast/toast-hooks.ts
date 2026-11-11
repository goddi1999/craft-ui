import { useLayoutEffect, useRef, useState } from 'react'

// offset size, not getBoundingClientRect: sonner scales stacked toasts and that would skew the path
export function useBoxSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      setSize({ width: el.offsetWidth, height: el.offsetHeight }),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}
