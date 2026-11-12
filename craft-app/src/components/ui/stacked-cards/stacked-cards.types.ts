import type { ComponentProps } from 'react'

export type StackedCard = {
  id: string | number
  title: string
  description: string
  /** Image URL for the picture half of the card. */
  image: string
  /** Alt text for the image. @default the card title */
  imageAlt?: string
  /** Where the call to action goes. The button only shows with both `href` and `ctaLabel`. */
  href?: string
  /** Text of the call to action. */
  ctaLabel?: string
}

export type StackedCardTheme = 'dark' | 'light'

/**
 * A column of cards that pin under each other as the page scrolls. Each card sticks a little
 * lower than the one before, so their top edges show like tabs, and shrinks as the next ones
 * slide over it. The page keeps its native scroll.
 */
export type StackedCardsProps = Omit<ComponentProps<'section'>, 'children' | 'title'> & {
  /** The cards, top to bottom. Renders nothing when empty. */
  cards: StackedCard[]
  /** Heading above the cards. */
  title?: string
  /** Line under the heading. */
  subtitle?: string
}
