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
import { Mark, MarkerText, type MarkType } from '@/components/ui/marker-text'

const MARK_TYPES: readonly MarkType[] = ['highlight', 'underline', 'circle', 'box', 'strike']

const DEFAULTS = {
  headline: 'highlight' as MarkType,
  gap: 140,
}

const COMPONENT_DEFAULTS = { gap: 140 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Text with `Mark` phrases anywhere inside it, at any depth.',
  },
  {
    name: 'show',
    type: 'boolean',
    description:
      'Controlled. `true` draws the marks, `false` hides them at once. Omit it to draw once, when the text is 60% on screen.',
  },
  {
    name: 'gap',
    type: 'number',
    default: '140',
    description: 'Milliseconds between one mark finishing and the next one starting.',
  },
  { name: 'onDrawn', type: '() => void', description: 'Called after the last mark lands.' },
  { name: 'as', type: 'ElementType', default: "'div'", description: 'Element to render as.' },
  { name: 'className', type: 'string', description: 'Merged onto the root element.' },
  {
    name: 'Mark type',
    type: "'highlight' | 'underline' | 'circle' | 'box' | 'strike'",
    default: "'highlight'",
    description:
      'How the phrase is marked. Highlights render as `<mark>`, strikes as `<s>`; circles and boxes never wrap.',
  },
  {
    name: 'Mark color',
    type: 'string',
    description:
      'Any CSS colour. Defaults: yellow highlight, orange underline, accent circle, green box, destructive strike.',
  },
  {
    name: 'Mark strokeWidth',
    type: 'number',
    description: 'Pen width in px. Defaults to a width that suits the font size.',
  },
]

const typeAttribute = (type: MarkType) => (type === 'highlight' ? '' : ` type="${type}"`)

export function MarkerTextPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { headline, gap } = settings.values
  const [round, setRound] = useState(0)

  const usage = toUsageSnippet({
    component: 'MarkerText',
    from: '@/components/ui/marker-text',
    imports: ['Mark'],
    props: { gap },
    defaults: COMPONENT_DEFAULTS,
    children: `<h2>
  Ship release notes <Mark${typeAttribute(headline)}>before standup</Mark>.
</h2>`,
  })

  return (
    <DemoPage
      eyebrow="ui / marker-text"
      title="Marker Text"
      description="Phrases get marked up by hand: a chisel highlighter behind the text, then pen underlines, circles, boxes and strikes over it, one stroke after another with the pen pressing in and lifting off. Adapted from Kokonut UI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Headline mark"
            options={MARK_TYPES}
            value={headline}
            onChange={(next) => settings.set('headline', next)}
          />
          <DemoSlider
            label="Gap"
            value={gap}
            onValueChange={(next) => settings.set('gap', next)}
            min={0}
            max={600}
            step={20}
            unit="ms"
          />
          <DemoAction onClick={() => setRound((value) => value + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/marker-text/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-xl px-2 py-6">
        <MarkerText
          // any change replays the whole drawing from blank
          key={`${round}-${headline}-${gap}`}
          show={round === 0 ? undefined : true}
          gap={gap}
          className="text-foreground"
        >
          <h2 className="text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-[2.6rem]">
            Ship release notes <Mark type={headline}>before standup</Mark>.
          </h2>
          <p className="mt-6 text-[17px] leading-8 text-muted-foreground">
            Every merged PR lands in the draft{' '}
            <Mark type="underline">the moment CI goes green</Mark>, the changelog builds in{' '}
            <Mark type="circle">under a second</Mark>, and it all lives in a{' '}
            <Mark type="box">plain Markdown file</Mark> in your repo. No more digging through{' '}
            <Mark type="strike">twelve Slack threads</Mark> on release day.
          </p>
        </MarkerText>
      </div>
    </DemoPage>
  )
}
