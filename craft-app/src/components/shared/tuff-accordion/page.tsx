import { Brain, Database, Globe, Wrench } from 'lucide-react'
import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Inset } from '@/components/ui/surface'
import { Accordion, Collapsible, type AccordionItem } from '@/components/ui/tuff-accordion'

const TYPES = ['single', 'multiple'] as const

const DEFAULTS = {
  type: 'single' as (typeof TYPES)[number],
  disabledItem: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'Accordion.items',
    type: 'AccordionItem[]',
    description: 'Sections in order: id, title, optional icon, meta and disabled, plus content.',
  },
  {
    name: 'Accordion.type',
    type: "'single' | 'multiple'",
    default: "'single'",
    description: 'Single keeps at most one section open.',
  },
  {
    name: 'Accordion.value / defaultValue / onValueChange',
    type: 'string[]',
    description: 'Ids of the open sections, controlled or not.',
  },
  {
    name: 'Collapsible.open / defaultOpen / onOpenChange',
    type: 'boolean',
    default: 'false',
    description: 'Open state of the single section.',
  },
  {
    name: 'title / icon / meta',
    type: 'ReactNode / LucideIcon / ReactNode',
    description: 'Header row: title, a filled leading icon and right-aligned meta.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the header closed.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

const toItems = (disabledItem: boolean): AccordionItem[] => [
  {
    id: 'search',
    title: 'Web search',
    icon: Globe,
    meta: '4 results',
    content: 'Searched "onboarding localization best practices" and opened 4 pages.',
  },
  {
    id: 'query',
    title: 'Database query',
    icon: Database,
    meta: '120ms',
    content: 'SELECT country, count(*) FROM signups WHERE created_at > now() - 30d …',
  },
  {
    id: 'tools',
    title: 'Tools used',
    icon: Wrench,
    meta: '2',
    content: 'analytics.export, glossary.lookup',
  },
  {
    id: 'private',
    title: 'Private notes',
    meta: 'locked',
    disabled: disabledItem,
    content: 'Only visible when the item is enabled.',
  },
]

export function TuffAccordionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { type, disabledItem } = settings.values
  const [reasoningOpen, setReasoningOpen] = useState(false)

  const usage = toUsageSnippet({
    component: 'Accordion',
    from: '@/components/ui/tuff-accordion',
    props: { items: { expression: 'items' }, type },
    defaults: { type: 'single' },
  })

  return (
    <DemoPage
      eyebrow="ui / tuff-accordion"
      title="Accordion & Collapsible"
      description={
        <>
          Sections that open with a spring on height. Accordion keeps one or
          many open; Collapsible is a single section for reasoning or details.
          Keyboard toggles skip the animation. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Type"
            options={TYPES}
            value={type}
            onChange={(next) => settings.set('type', next)}
          />
          <DemoSwitch
            label="Disable last item"
            checked={disabledItem}
            onCheckedChange={(next) => settings.set('disabledItem', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/tuff-accordion/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-md flex-col gap-6">
        <Inset className="p-1.5">
          {/* Remount on type change so a multi-open state never leaks into single. */}
          <Accordion
            key={type}
            type={type}
            defaultValue={['search']}
            items={toItems(disabledItem)}
          />
        </Inset>
        <Collapsible
          title="Thought for 6s"
          icon={Brain}
          meta="3 steps"
          open={reasoningOpen}
          onOpenChange={setReasoningOpen}
        >
          Compared sign-ups by country, checked which locales have a reviewed
          glossary, then weighed support volume per language.
        </Collapsible>
      </div>
    </DemoPage>
  )
}
