import { createContext, useContext, useEffect, useState } from 'react'

import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_CONTENT_RADIUS,
  DEFAULT_LAYOUT_ID,
  DEFAULT_TRIGGER_RADIUS,
} from './expandable-screen.constants'
import type { ExpandableScreenContextValue, ExpandableScreenProps } from './expandable-screen.types'

const ExpandableScreenContext = createContext<ExpandableScreenContextValue | null>(null)

export function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext)
  if (!context) throw new Error('useExpandableScreen must be used within an ExpandableScreen')
  return context
}

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  layoutId = DEFAULT_LAYOUT_ID,
  triggerRadius = DEFAULT_TRIGGER_RADIUS,
  contentRadius = DEFAULT_CONTENT_RADIUS,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  lockScroll = true,
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const expand = () => {
    setIsExpanded(true)
    onExpandChange?.(true)
  }

  const collapse = () => {
    setIsExpanded(false)
    onExpandChange?.(false)
  }

  useEffect(() => {
    if (!lockScroll || !isExpanded) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isExpanded, lockScroll])

  useEffect(() => {
    if (!isExpanded) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsExpanded(false)
      onExpandChange?.(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isExpanded, onExpandChange])

  return (
    <ExpandableScreenContext.Provider
      value={{ isExpanded, expand, collapse, layoutId, triggerRadius, contentRadius, animationDuration }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  )
}
