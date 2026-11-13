import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { QuoteWall } from '@/components/ui/quote-wall'

import { DEMO_QUOTES } from './quote-wall.data'

const SIZES = ['sm', 'md', 'lg'] as const
const SIZE_CLASS = {
  sm: 'text-base leading-7',
  md: 'text-lg leading-8 sm:text-xl sm:leading-9',
  lg: 'text-xl leading-9 sm:text-2xl sm:leading-10',
}

const DEFAULTS = { size: 'md' as (typeof SIZES)[number], alternate: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'quotes',
    type: '{ id: string; text: string; author: string; role?: string; avatar?: string | ReactNode }[]',
    description: 'The testimonials, in reading order. Without an avatar the author’s initials are used.',
  },
  {
    name: 'alternate',
    type: 'boolean',
    default: 'true',
    description: 'Tints every other quote so neighbours read apart before anything is focused.',
  },
  {
    name: 'accentClassName',
    type: 'string',
    description: 'Classes for the author’s name; orange by default.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the paragraph; set the type size here.' },
]

export function QuoteWallPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, alternate } = settings.values

  const usage = toUsageSnippet({
    component: 'QuoteWall',
    from: '@/components/ui/quote-wall',
    props: { quotes: { expression: 'quotes' }, alternate, className: SIZE_CLASS[size] },
    defaults: { alternate: true },
  })

  return (
    <DemoPage
      eyebrow="ui / quote-wall"
      title="Quote Wall"
      description="Testimonials set as one running paragraph, each quote led by a tiny avatar. Point at a quote and the rest blur back while the author's name slips in beside it; tap on touch screens, Tab and Escape on a keyboard."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoSwitch
            label="Alternate tint"
            checked={alternate}
            onCheckedChange={(next) => settings.set('alternate', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/quote-wall/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-2xl flex-col gap-5 py-6">
        <p className="text-xs text-muted-foreground">Point at a quote, or tap one, to see who said it.</p>
        <QuoteWall
          quotes={DEMO_QUOTES}
          alternate={alternate}
          className={SIZE_CLASS[size]}
        />
      </div>
    </DemoPage>
  )
}
