import { useLayoutEffect, useRef, useState } from 'react'

/** Measures an element's width. 0 until measured; a hidden element keeps its last width. */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = (next: number) => {
      if (next > 0) setWidth(Math.round(next))
    }
    measure(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}
