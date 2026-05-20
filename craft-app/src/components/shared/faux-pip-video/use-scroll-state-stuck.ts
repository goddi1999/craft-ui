import { useEffect, type RefObject } from 'react'

/**
 * Sets `data-stuck` on `:root` when the sentinel leaves the viewport.
 * Matches css-container-scroll-state-faux-pip-video fallback behavior.
 * Runs alongside native `@container scroll-state` when supported.
 */
export function useScrollStateStuck(
  sentinelRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const isStuck = !entries[0]?.isIntersecting
        document.documentElement.dataset.stuck = isStuck ? 'true' : 'false'
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      delete document.documentElement.dataset.stuck
    }
  }, [sentinelRef])
}
