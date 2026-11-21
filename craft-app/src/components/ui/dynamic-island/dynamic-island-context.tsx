import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

import { SIZE_PRESETS } from './dynamic-island.constants'
import { DynamicIslandContext } from './use-dynamic-island'
import type {
  DynamicIslandProviderProps,
  DynamicIslandState,
  ScheduledAnimation,
  SizePresets,
} from './dynamic-island.types'

type Action =
  | { type: 'SET_SIZE'; size: SizePresets }
  | { type: 'INIT_QUEUE'; animations: ScheduledAnimation[] }
  | { type: 'ANIMATION_END' }

function reducer(state: DynamicIslandState, action: Action): DynamicIslandState {
  switch (action.type) {
    case 'SET_SIZE':
      if (state.size === action.size) return state
      return { ...state, size: action.size, previousSize: state.size, isAnimating: true }
    case 'INIT_QUEUE':
      return { ...state, animationQueue: action.animations, isAnimating: action.animations.length > 0 }
    case 'ANIMATION_END':
      return { ...state, isAnimating: false }
  }
}

export function DynamicIslandProvider({
  children,
  initialSize = 'default',
  initialAnimation = [],
}: DynamicIslandProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    size: initialSize,
    previousSize: undefined,
    animationQueue: initialAnimation,
    isAnimating: initialAnimation.length > 0,
  })
  const timers = useRef<number[]>([])

  const setSize = useCallback((size: SizePresets) => dispatch({ type: 'SET_SIZE', size }), [])
  const scheduleAnimation = useCallback(
    (animations: ScheduledAnimation[]) => dispatch({ type: 'INIT_QUEUE', animations }),
    [],
  )

  // play the queue: each step waits its delay after the previous one
  useEffect(() => {
    const queue = state.animationQueue
    if (queue.length === 0) return
    let elapsed = 0
    timers.current = queue.map(({ size, delay }) => {
      elapsed += delay
      return window.setTimeout(() => dispatch({ type: 'SET_SIZE', size }), elapsed)
    })
    timers.current.push(window.setTimeout(() => dispatch({ type: 'ANIMATION_END' }), elapsed + 400))
    return () => timers.current.forEach(window.clearTimeout)
  }, [state.animationQueue])

  // a single setSize also locks the island until the spring has mostly settled
  useEffect(() => {
    if (!state.isAnimating || state.animationQueue.length > 0) return
    const id = window.setTimeout(() => dispatch({ type: 'ANIMATION_END' }), 400)
    return () => window.clearTimeout(id)
  }, [state.size, state.isAnimating, state.animationQueue])

  const value = useMemo(
    () => ({ state, setSize, scheduleAnimation, presets: SIZE_PRESETS }),
    [state, setSize, scheduleAnimation],
  )

  return <DynamicIslandContext.Provider value={value}>{children}</DynamicIslandContext.Provider>
}
