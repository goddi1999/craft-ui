import {
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { Accordion, type AccordionProps } from './Accordion'

type AccordionSize = NonNullable<AccordionProps['size']>

const FAQ_ITEMS = [
  {
    title: 'Can I cancel anytime?',
    content: 'Yes. Your plan stays active until the period ends.',
  },
  {
    title: 'Do you offer refunds?',
    content: 'Within 14 days of purchase, no questions asked.',
  },
  {
    title: 'Can I switch plans later?',
    content: 'Upgrade or downgrade whenever you like. We prorate the difference.',
  },
]

const SIZES: AccordionSize[] = ['md', 'lg']
/** -1 opens nothing; any other value is the index of the open row. */
const OPEN_ROWS = [-1, 0, 1, 2] as const

const DEFAULTS = {
  size: 'lg' as AccordionSize,
  defaultOpen: 0 as (typeof OPEN_ROWS)[number],
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  size: 'md',
  defaultOpen: 0,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: '{ title: string; content: ReactNode }[]',
    description: 'Rows to render — the title is the trigger, the content the panel.',
  },
  {
    name: 'defaultOpen',
    type: 'number',
    default: '0',
    description: 'Index of the row open on mount. Out of range (e.g. -1) starts all closed.',
  },
  {
    name: 'size',
    type: "'md' | 'lg'",
    default: "'md'",
    description: 'lg suits page-level FAQs: larger questions, body-size answers.',
  },
]

export function AccordionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, defaultOpen } = settings.values

  const usage = toUsageSnippet({
    component: 'Accordion',
    from: '@/components/shared/accordion',
    props: { size, defaultOpen },
    defaults: COMPONENT_DEFAULTS,
  }).replace('<Accordion', '<Accordion items={faqs}')

  return (
    <DemoPage
      eyebrow="shared / accordion"
      title="Accordion"
      description="Stacked disclosure rows where one panel opens at a time, with a smooth height spring and a rotating chevron."
      align="start"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Open on mount"
            options={OPEN_ROWS}
            value={defaultOpen}
            onChange={(value) => settings.set('defaultOpen', value)}
            format={(value) => (value < 0 ? 'none' : `row ${value + 1}`)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/accordion/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="w-full max-w-lg">
        {/* Remount so a new defaultOpen applies right away. */}
        <Accordion key={defaultOpen} size={size} defaultOpen={defaultOpen} items={FAQ_ITEMS} />
      </div>
    </DemoPage>
  )
}
