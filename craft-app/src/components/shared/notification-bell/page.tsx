import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { NotificationBell, type NotificationBellColor } from '@/components/ui/notification-bell'

const COLORS: readonly NotificationBellColor[] = ['red', 'orange', 'green', 'blue', 'violet']
const VARIANTS = ['count', 'dot'] as const
const START_COUNT = 8
// enough to show the bell swinging harder than for a single item
const BURST = 5

const DEFAULTS = {
  color: 'red' as NotificationBellColor,
  variant: 'count' as (typeof VARIANTS)[number],
  size: 72,
  max: 99,
}

const COMPONENT_DEFAULTS = { color: 'red', variant: 'count', size: 48, max: 99 }

const STEP =
  'grid size-10 place-items-center rounded-full bg-muted text-muted-foreground outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-90 disabled:opacity-40 disabled:active:scale-100 motion-reduce:active:scale-100'

const PROPS: DemoPropDoc[] = [
  {
    name: 'count',
    type: 'number',
    default: '0',
    description: 'Unread count. Going up swings the bell; anything not finite counts as 0.',
  },
  { name: 'max', type: 'number', default: '99', description: 'Above this the badge shows `max+`.' },
  {
    name: 'variant',
    type: "'count' | 'dot'",
    default: "'count'",
    description: 'A rolling number in the badge, or a plain dot.',
  },
  {
    name: 'size',
    type: 'number',
    default: '48',
    description: 'Button size in px. The bell, badge and digits scale with it.',
  },
  {
    name: 'color',
    type: "'red' | 'orange' | 'green' | 'blue' | 'violet'",
    default: "'red'",
    description: 'Badge colour, iOS system colours in light and dark.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Merge onto your own trigger; only the status label and badge are added.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the button.' },
]

export function NotificationBellPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { color, variant, size, max } = settings.values
  const [count, setCount] = useState(START_COUNT)

  const usage = toUsageSnippet({
    component: 'NotificationBell',
    from: '@/components/ui/notification-bell',
    props: { count: { expression: 'unread' }, color, variant, size, max },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / notification-bell"
      title="Notification Bell"
      description="An iOS-style bell with an unread badge. Add a notification and the bell swings, with the clapper lagging behind; add a few fast and it swings harder. Each digit rolls the way the count moved, and the badge shrinks away at zero. Adapted from rare-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Colour"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
          />
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(next) => settings.set('size', next)}
            min={32}
            max={112}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Max"
            value={max}
            onValueChange={(next) => settings.set('max', next)}
            min={9}
            max={999}
          />
          <DemoAction onClick={() => setCount((value) => value + BURST)}>
            Add {BURST} at once
          </DemoAction>
          <DemoAction onClick={() => setCount(0)} disabled={count === 0}>
            Clear all
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/notification-bell/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-10">
        <NotificationBell count={count} max={max} variant={variant} size={size} color={color} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCount((value) => Math.max(0, value - 1))}
            disabled={count === 0}
            aria-label="Remove a notification"
            className={STEP}
          >
            <Minus className="size-[18px]" strokeWidth={2.2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            aria-label="Add a notification"
            className={STEP}
          >
            <Plus className="size-[18px]" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </div>
    </DemoPage>
  )
}
