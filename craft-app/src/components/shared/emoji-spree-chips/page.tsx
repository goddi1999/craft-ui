import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

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

const DEFAULTS = {
  title: 'Interests',
  countLabel: 'Interests',
  count: INTERESTS.length,
}

const INTERESTS_PLACEHOLDER = '__interests__'

const PROPS: DemoPropDoc[] = [
  {
    name: 'interests',
    type: 'InterestItem[]',
    description: '`{ id, label, emoji }` per chip, spread over three draggable rows.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'Interests'",
    description: 'Heading above the chip rows.',
  },
  {
    name: 'countLabel',
    type: 'string',
    default: "'Interests'",
    description: 'Noun in the running total pill, e.g. "3 Interests".',
  },
  {
    name: 'onChange',
    type: '(selectedIds: string[]) => void',
    description: 'Called with the selected ids after every toggle.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root.',
  },
]

export function EmojiSpreeChipsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, countLabel, count } = settings.values
  // Remounting clears the component's own selection.
  const [round, setRound] = useState(0)

  const usage = toUsageSnippet({
    component: 'EmojiSpreeChips',
    from: '@/components/shared/emoji-spree-chips',
    props: {
      interests: INTERESTS_PLACEHOLDER,
      title: title || undefined,
      countLabel: countLabel || undefined,
    },
    defaults: DEFAULTS,
  }).replace(`interests="${INTERESTS_PLACEHOLDER}"`, 'interests={interests}')

  const handleClear = () => setRound((current) => current + 1)

  return (
    <DemoPage
      eyebrow="shared / emoji-spree-chips"
      title="Emoji spree chips"
      description="Draggable rows of choice chips. Selecting one throws its emoji up over the deck and drops it back down behind the chips, with the running total riding in on a spring."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(value) => settings.set('title', value)}
            maxLength={24}
          />
          <DemoTextField
            label="Count label"
            value={countLabel}
            onValueChange={(value) => settings.set('countLabel', value)}
            maxLength={16}
          />
          <DemoSlider
            label="Chips"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={3}
            max={INTERESTS.length}
          />
          <DemoAction onClick={handleClear}>Clear selection</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/emoji-spree-chips/'],
        usage,
        props: PROPS,
      }}
    >
      <EmojiSpreeChips
        key={`${round}-${count}`}
        interests={INTERESTS.slice(0, count)}
        title={title || undefined}
        countLabel={countLabel || undefined}
        className="mx-auto"
      />
    </DemoPage>
  )
}
