import { useEffect, useState, type RefObject } from 'react'

import { SPY_MARGIN } from './collapsible-toc.constants'

/** The nearest ancestor that scrolls, or null for the page itself. */
function scrollParent(node: HTMLElement | null): HTMLElement | null {
  let current = node?.parentElement ?? null
  while (current && current !== document.body) {
    const { overflowY } = getComputedStyle(current)
    if (overflowY === 'auto' || overflowY === 'scroll') return current
    current = current.parentElement
  }
  return null
}

/** Id of the heading the reader is in: the last one that crossed the top band of the scroll area. */
export function useScrollSpy(ids: readonly string[], rootRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    const list = key ? key.split('|') : []
    const targets = list
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (targets.length === 0) return

    const passed = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const above = entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) + 1
          if (entry.isIntersecting || above) passed.add(entry.target.id)
          else passed.delete(entry.target.id)
        }
        const current = [...list].reverse().find((id) => passed.has(id))
        setActive(current ?? list[0])
      },
      { root: scrollParent(rootRef.current), rootMargin: SPY_MARGIN },
    )
    targets.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [key, rootRef])

  return [active, setActive] as const
}
