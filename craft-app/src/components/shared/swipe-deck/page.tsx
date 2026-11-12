import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  SwipeDeck,
  type SwipeDeckDirection,
  type SwipeDeckItem,
} from '@/components/ui/swipe-deck'

const TEMPLATES: SwipeDeckItem[] = [
  {
    id: 'nova',
    title: 'Nova',
    aside: '$79',
    description: 'SaaS dashboard · 24 screens',
    tags: ['Next.js', 'Tailwind'],
  },
  {
    id: 'kalypso',
    title: 'Kalypso',
    aside: '$49',
    description: 'Docs site · 12 pages',
    tags: ['Astro', 'MDX'],
  },
  {
    id: 'cobalt',
    title: 'Cobalt',
    aside: '$69',
    description: 'Billing portal · 18 screens',
    tags: ['Next.js', 'Stripe'],
  },
  { id: 'shotreel', title: 'Shotreel', aside: '$59', description: 'Changelog · 9 pages', tags: ['Framer'] },
  {
    id: 'hale',
    title: 'Hale',
    aside: '$39',
    description: 'Status page · 7 pages',
    tags: ['Astro', 'Vercel'],
  },
]

const DEFAULTS = { threshold: 110, showControls: true }

const COMPONENT_DEFAULTS = { threshold: 110, showControls: true }

const EMPTY_TALLY: Record<SwipeDeckDirection, number> = { left: 0, right: 0 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'SwipeDeckItem[]',
    description:
      'The cards, first on top. Each has id and title, plus optional aside (e.g. a price), description, tags and image. Without an image the cover shows a small page sketch.',
  },
  {
    name: 'onSwipe',
    type: "(item, direction: 'left' | 'right') => void",
    description: 'Called when a card is thrown, by drag, arrow key or button.',
  },
  {
    name: 'threshold',
    type: 'number',
    default: '110',
    description: 'Px of drag that counts as a decision. A fast flick decides sooner.',
  },
  {
    name: 'leftLabel',
    type: 'string',
    default: "'Skip'",
    description: 'Stamp and button label for a throw to the left.',
  },
  {
    name: 'rightLabel',
    type: 'string',
    default: "'Save'",
    description: 'Stamp and button label for a throw to the right.',
  },
  {
    name: 'showControls',
    type: 'boolean',
    default: 'true',
    description: 'Show the skip and save buttons under the deck.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function SwipeDeckPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { threshold, showControls } = settings.values
  const [tally, setTally] = useState(EMPTY_TALLY)
  // a new key deals a fresh deck
  const [round, setRound] = useState(0)

  const handleSwipe = (_item: SwipeDeckItem, direction: SwipeDeckDirection) => {
    setTally((current) => ({ ...current, [direction]: current[direction] + 1 }))
  }

  const handleReset = () => {
    setRound((current) => current + 1)
    setTally(EMPTY_TALLY)
  }

  const usage = toUsageSnippet({
    component: 'SwipeDeck',
    from: '@/components/ui/swipe-deck',
    props: {
      items: { expression: 'templates' },
      onSwipe: { expression: 'handleSwipe' },
      threshold,
      showControls,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / swipe-deck"
      title="Swipe Deck"
      description="A stack of templates you throw left to skip or right to save. The top card follows the pointer and tilts around where you grabbed it, the cards behind rise as you drag, and a thrown card flies off and rejoins at the back; the arrow keys and buttons throw it too. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Threshold"
            value={threshold}
            onValueChange={(next) => settings.set('threshold', next)}
            min={60}
            max={200}
            step={10}
            unit="px"
          />
          <DemoSwitch
            label="Buttons"
            checked={showControls}
            onCheckedChange={(next) => settings.set('showControls', next)}
          />
          <DemoAction onClick={handleReset}>Deal again</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/swipe-deck/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-5">
        <SwipeDeck
          key={round}
          items={TEMPLATES}
          onSwipe={handleSwipe}
          threshold={threshold}
          showControls={showControls}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          {tally.right} saved · {tally.left} skipped
        </p>
      </div>
    </DemoPage>
  )
}
