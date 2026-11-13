import { useLayoutEffect, useRef, useState } from 'react'

import { FALLBACK_WIDTH } from './funnel-chart.constants'

/** Measures an element's width. Falls back until the first measure. */
export function useWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width
      if (next > 0) setWidth(Math.round(next))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width ?? FALLBACK_WIDTH, width !== null] as const
}
