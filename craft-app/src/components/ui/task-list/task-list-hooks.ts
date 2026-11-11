import { useReducedMotion, type Transition } from 'motion/react'

import { INSTANT } from './task-list.constants'

/** Returns each transition as given, or instant when the user asks for less motion. */
export function useTiming() {
  const reduced = useReducedMotion() ?? false
  return (transition: Transition) => (reduced ? INSTANT : transition)
}
