import type { ComponentType } from 'react'

export type CardSwipeItem = {
  id: string
  title: string
  description: string
  /** Rendered at the top of the card; inherits the card's text colour. */
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  actionLabel?: string
}

export type CardSwipeProps = {
  items?: CardSwipeItem[]
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  onAction?: (item: CardSwipeItem) => void
  className?: string
}
