import type { ComponentProps } from 'react'

export type SwipeDeckDirection = 'left' | 'right'

export type SwipeDeckItem = {
  id: string
  title: string
  /** Right of the title, e.g. a price. */
  aside?: string
  /** One line under the title. */
  description?: string
  tags?: string[]
  /** Cover image URL. Without one the cover shows a small page sketch. */
  image?: string
}

export type SwipeDeckProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The cards, first on top. A thrown card goes to the back, so the deck never runs out. */
  items: SwipeDeckItem[]
  /** Called when a card is thrown, by drag, arrow key or button. */
  onSwipe?: (item: SwipeDeckItem, direction: SwipeDeckDirection) => void
  /** Px of drag that counts as a decision; a fast flick decides sooner. @default 110 */
  threshold?: number
  /** Stamp and button label for a throw to the left. @default 'Skip' */
  leftLabel?: string
  /** Stamp and button label for a throw to the right. @default 'Save' */
  rightLabel?: string
  /** Show the two buttons under the deck. @default true */
  showControls?: boolean
}
