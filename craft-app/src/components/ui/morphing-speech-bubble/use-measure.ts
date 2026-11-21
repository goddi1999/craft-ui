import { useLayoutEffect, useRef, useState } from 'react'

import { FALLBACK_SIZE } from './morphing-speech-bubble.constants'
import type { Size } from './morphing-speech-bubble.types'

/** Border-box size of an element, kept current with a ResizeObserver. */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<Size>(FALLBACK_SIZE)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const read = () => setSize({ width: node.offsetWidth, height: node.offsetHeight })
    read()
    const observer = new ResizeObserver(read)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}
