type Spring = { type: 'spring'; stiffness: number; damping: number; mass: number }

/** Critically damped under reduced motion (no overshoot), the same thing the source engine does. */
export function springFor(spring: Spring, reduced: boolean): Spring {
  return reduced ? { ...spring, damping: 2 * Math.sqrt(spring.stiffness) } : spring
}

/** Runs the caller's handler first, then ours. */
export function chain<E>(theirs: ((event: E) => void) | undefined, ours: (event: E) => void) {
  return (event: E) => {
    theirs?.(event)
    ours(event)
  }
}
