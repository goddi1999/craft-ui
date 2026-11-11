import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

import { LEAVE_DELAY } from './web-search.constants'

export function useSize<T extends HTMLElement>(side: 'width' | 'height') {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<number | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    // offsetWidth rounds down, which is enough to tip the label into an ellipsis
    const observer = new ResizeObserver(() =>
      setSize(Math.ceil(node.getBoundingClientRect()[side])),
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [side])

  return [ref, size] as const
}

export function useHoverIntent(enterDelay: number) {
  const [active, setActive] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const set = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive(next), delay)
  }

  // touch has no hover, so a tap never leaves anything stuck open
  const hover = {
    onPointerEnter: (event: ReactPointerEvent) =>
      event.pointerType === 'mouse' && set(true, enterDelay),
    onPointerLeave: () => set(false, LEAVE_DELAY),
  }

  return { active, set, hover }
}
