import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ExpandCard, type ExpandCardItem } from '@/components/ui/expand-card'

// a glowing orb: lit from the top left, drifting into a second colour at the bottom right
const orb = (from: string, to: string) => (
  <span
    style={{
      background: `radial-gradient(55% 55% at 30% 22%, rgba(255,255,255,.42) 0, rgba(255,255,255,0) 70%), radial-gradient(110% 80% at 50% 118%, rgba(0,0,0,.16) 0, rgba(0,0,0,0) 60%), radial-gradient(95% 95% at 82% 88%, ${to} 8%, transparent 78%), ${from}`,
    }}
  />
)

const PLANS: ExpandCardItem[] = [
  {
    id: 'hobby',
    title: 'Hobby',
    subtitle: 'Just you',
    aside: 'Free',
    description: 'For side projects and prototypes. Preview deploys and community support.',
    tags: ['1 seat', 'Previews'],
    action: 'Start free',
    media: orb('#3ec9ff', '#5b5bff'),
  },
  {
    id: 'pro',
    title: 'Pro',
    subtitle: 'Up to 10 seats',
    aside: '$20/mo',
    description: 'For small teams that ship daily. Faster builds and protected previews.',
    tags: ['10 seats', 'Analytics'],
    action: 'Start trial',
    media: orb('#9d6bff', '#3a3ad9'),
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    subtitle: 'SSO and audit logs',
    aside: 'Custom',
    description: 'For companies with compliance needs. SAML sign-in and a 99.99% SLA.',
    tags: ['SSO', 'SLA'],
    action: 'Talk to sales',
    media: orb('#ffb38a', '#ff4f86'),
  },
]

const OPEN = ['none', 'hobby', 'pro', 'enterprise'] as const
type Open = (typeof OPEN)[number]

const isOpen = (id: string | null): id is Open => OPEN.some((option) => option === id)

const DEFAULTS = { open: 'none' as Open, actions: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'ExpandCardItem[]',
    description:
      'The rows. Each has id and title, plus optional subtitle, aside (e.g. a price), description, tags, action (the button label) and media (fills the photo slot).',
  },
  { name: 'value', type: 'string | null', description: 'Id of the open card, or null for none. Controlled.' },
  {
    name: 'defaultValue',
    type: 'string | null',
    default: 'null',
    description: 'Id of the card open at first render. Uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: string | null) => void',
    description: 'Called with the id of the card that opens, or null when it folds back (click again or Escape).',
  },
  {
    name: 'onAction',
    type: '(item: ExpandCardItem) => void',
    description: 'Called when the button in an open card is pressed.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function ExpandCardPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { open, actions } = settings.values
  const [picked, setPicked] = useState<ExpandCardItem | null>(null)

  const items = actions ? PLANS : PLANS.map((plan) => ({ ...plan, action: undefined }))

  const usage = toUsageSnippet({
    component: 'ExpandCard',
    from: '@/components/ui/expand-card',
    props: {
      items: { expression: 'plans' },
      value: { expression: 'open' },
      onValueChange: { expression: 'setOpen' },
      onAction: actions ? { expression: '(plan) => choosePlan(plan.id)' } : undefined,
    },
  })

  return (
    <DemoPage
      eyebrow="ui / expand-card"
      title="Expand Card"
      description="Three plan rows. Open one and it rides to the top and grows into a card: the photo widens into a cover, the title slides under it and the details fade in while the other rows fall away. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Open"
            options={OPEN}
            value={open}
            onChange={(next) => settings.set('open', next)}
          />
          <DemoSwitch
            label="Action button"
            checked={actions}
            onCheckedChange={(checked) => settings.set('actions', checked)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/expand-card/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-5">
        <ExpandCard
          items={items}
          value={open === 'none' ? null : open}
          onValueChange={(id) => settings.set('open', isOpen(id) ? id : 'none')}
          onAction={setPicked}
        />
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {picked ? `${picked.action} · ${picked.title}` : 'Pick a plan to see it open'}
        </p>
      </div>
    </DemoPage>
  )
}
