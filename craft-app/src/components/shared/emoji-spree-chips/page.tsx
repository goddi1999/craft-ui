import { DemoPage } from '../demo-page'

import { EmojiSpreeChips } from './EmojiSpreeChips'
import type { InterestItem } from './emoji-spree-chips.types'

const INTERESTS: InterestItem[] = [
  { id: 'music', label: 'Music', emoji: '🎧' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'films', label: 'Films', emoji: '🎬' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'gardening', label: 'Gardening', emoji: '🪴' },
  { id: 'cycling', label: 'Cycling', emoji: '🚲' },
]

export function EmojiSpreeChipsPage() {
  return (
    <DemoPage
      eyebrow="shared / emoji-spree-chips"
      title="Emoji spree chips"
      description="Draggable rows of choice chips. Selecting one throws its emoji up over the deck and drops it back down behind the chips, with the running total riding in on a spring."
    >
      <EmojiSpreeChips interests={INTERESTS} />
    </DemoPage>
  )
}
