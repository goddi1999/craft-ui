export type InterestItem = {
  id: string
  label: string
  emoji: string
}

export type EmojiSpreeChipsProps = {
  interests: InterestItem[]
  /** Heading above the chip rows. */
  title?: string
  /** Noun in the running total pill, e.g. `3 Interests`. */
  countLabel?: string
  onChange?: (selectedIds: string[]) => void
  className?: string
}
