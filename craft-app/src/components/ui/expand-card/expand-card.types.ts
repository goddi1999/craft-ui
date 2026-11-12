import type { ComponentProps, ReactNode } from 'react'

export type ExpandCardItem = {
  id: string
  title: string
  subtitle?: string
  /** Right side of the row, e.g. a price. */
  aside?: string
  /** Shown once the card opens. Two lines fit. */
  description?: string
  tags?: string[]
  /** Label of the button in the open card. No button without it. */
  action?: string
  /** Fills the photo slot that grows into the cover, e.g. an `<img>` or a gradient. */
  media?: ReactNode
}

export type ExpandCardProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'children'> & {
  items: ExpandCardItem[]
  /** Id of the open card, or `null` for none. Controlled. */
  value?: string | null
  /** Id of the card open at first render. Uncontrolled. @default null */
  defaultValue?: string | null
  /** Called with the id of the card that opens, or `null` when it folds back. */
  onValueChange?: (value: string | null) => void
  /** Called when the button in an open card is pressed. */
  onAction?: (item: ExpandCardItem) => void
}
