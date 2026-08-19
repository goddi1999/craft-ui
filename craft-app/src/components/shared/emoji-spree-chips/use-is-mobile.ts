import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 640

function subscribe(onChange: () => void) {
  const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** Tracks the `sm` breakpoint so particle arcs can be scaled down on phones. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth < MOBILE_BREAKPOINT,
    () => false,
  )
}
