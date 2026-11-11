// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { useLayoutEffect, useRef, useState } from 'react'

import { MAX_DIAL } from './lap-timer.constants'

/** Measures the dial container. Returns the ref, the width, and whether it was measured. */
export function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  // null until measured: the dial draws once at its real size.
  const [width, setWidth] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width ?? MAX_DIAL, width !== null] as const
}
