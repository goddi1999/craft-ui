import { createContext, useContext } from 'react'

export type SpotlightPointerState = {
  x: number
  y: number
  active: boolean
}

export type SpotlightPointerGroup = {
  /** Mutated in place and read per frame — never routed through React state. */
  pointer: SpotlightPointerState
  register: (wake: () => void) => () => void
  wakeAll: () => void
}

export function createSpotlightPointerGroup(): SpotlightPointerGroup {
  const subscribers = new Set<() => void>()
  return {
    pointer: { x: 0.5, y: 0.5, active: false },
    register(wake) {
      subscribers.add(wake)
      return () => {
        subscribers.delete(wake)
      }
    },
    wakeAll() {
      for (const wake of subscribers) wake()
    },
  }
}

export const SpotlightPointerContext =
  createContext<SpotlightPointerGroup | null>(null)

export function useSpotlightPointerGroup() {
  return useContext(SpotlightPointerContext)
}
