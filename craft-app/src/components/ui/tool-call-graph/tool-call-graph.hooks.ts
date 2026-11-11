// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { useLayoutEffect, useRef, useState } from 'react'

/** Measures the edge column. Returns the ref, the width, and whether it was measured. */
export function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  // null until measured, so the edges draw once at their real size.
  const [width, setWidth] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width ?? 80, width !== null] as const
}
