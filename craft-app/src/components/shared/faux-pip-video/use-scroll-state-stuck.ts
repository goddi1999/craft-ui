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

    const update = (isIntersecting: boolean) => {
      document.documentElement.dataset.stuck = isIntersecting ? 'false' : 'true'
    }

    const initialRect = sentinel.getBoundingClientRect()
    update(initialRect.bottom > 0 && initialRect.top < window.innerHeight)

    const observer = new IntersectionObserver(
      (entries) => {
        update(entries[0]?.isIntersecting ?? true)
      },
      {
        threshold: 0,
        rootMargin: '1px 0px 1px 0px',
      },
    )

    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      delete document.documentElement.dataset.stuck
    }
  }, [sentinelRef])
}
