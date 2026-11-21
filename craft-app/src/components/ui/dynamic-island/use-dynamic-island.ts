import { createContext, useContext, useEffect, useRef } from 'react'

import type { DynamicIslandContextValue, ScheduledAnimation } from './dynamic-island.types'

export const DynamicIslandContext = createContext<DynamicIslandContextValue | null>(null)

export function useDynamicIslandSize() {
  const context = useContext(DynamicIslandContext)
  if (!context) throw new Error('useDynamicIslandSize must be used inside a DynamicIslandProvider')
  return context
}

export function useScheduledAnimations(animations: ScheduledAnimation[]) {
  const { scheduleAnimation } = useDynamicIslandSize()
  const first = useRef(animations)
  useEffect(() => {
    scheduleAnimation(first.current)
  }, [scheduleAnimation])
}
