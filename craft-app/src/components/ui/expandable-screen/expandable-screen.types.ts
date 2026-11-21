import type { ReactNode } from 'react'

export type ExpandableScreenContextValue = {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
  layoutId: string
  triggerRadius: string
  contentRadius: string
  animationDuration: number
}

export type ExpandableScreenProps = {
  children: ReactNode
  defaultExpanded?: boolean
  onExpandChange?: (expanded: boolean) => void
  layoutId?: string
  triggerRadius?: string
  contentRadius?: string
  /** Seconds for the morph. */
  animationDuration?: number
  /** Lock body scroll while expanded. */
  lockScroll?: boolean
}

export type ExpandableScreenTriggerProps = {
  children: ReactNode
  className?: string
}

export type ExpandableScreenContentProps = {
  children: ReactNode
  className?: string
  showCloseButton?: boolean
  closeButtonClassName?: string
}

export type ExpandableScreenBackgroundProps = {
  trigger?: ReactNode
  content?: ReactNode
  className?: string
}
