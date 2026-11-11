import {
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GsapInfiniteLoop } from '@/components/ui/gsap-infinite-loop'

const PRESETS = {
  original: [
    'Infinite',
    'loops',
    'without',
    'repeating',
    'or',
    'shuffling',
    'elements',
    'using',
    'GSAP',
    '🤙',
  ],
  craft: ['Craft', 'UI', 'with', 'reusable', 'primitives', '✨'],
  seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
} as const

type PresetName = keyof typeof PRESETS

const PRESET_NAMES = Object.keys(PRESETS) as PresetName[]

const PRESET_LABELS: Record<PresetName, string> = {
  original: 'Original',
  craft: 'Craft',
  seasons: 'Seasons',
}

const DEFAULTS = {
  preset: 'original' as PresetName,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'string[]',
    default: "['Infinite', 'loops', …, '🤙']",
    description:
      'Words shown in the vertical carousel. Emoji-only entries keep their case and a fixed width.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
  {
    name: '...props',
    type: "Omit<HTMLAttributes<HTMLDivElement>, 'children'>",
    description: 'Any native div attribute except children.',
  },
]

const toItemsSource = (items: readonly string[]) =>
  `{[${items.map((item) => `'${item}'`).join(', ')}]}`

export function GsapInfiniteLoopPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { preset } = settings.values
  const items = PRESETS[preset]

  const usage = toUsageSnippet({
    component: 'GsapInfiniteLoop',
    from: '@/components/ui/gsap-infinite-loop',
    props: { items: preset === 'original' ? undefined : 'ITEMS' },
  }).replace('items="ITEMS"', `items=${toItemsSource(items)}`)

  return (
    <DemoPage
      eyebrow="ui / gsap-infinite-loop"
      title="GSAP Infinite Loops Without DOM Shuffle"
      description={
        <>
          A vertical word carousel driven by overlapping GSAP timelines — the
          same list nodes are reused three times in the master timeline, so
          nothing is cloned or shuffled. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/pvzbRzB" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Word set"
            options={PRESET_NAMES}
            value={preset}
            onChange={(value) => settings.set('preset', value)}
            format={(name) => PRESET_LABELS[name]}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/gsap-infinite-loop/'],
        usage,
        props: PROPS,
      }}
    >
      <GsapInfiniteLoop
        key={preset}
        items={[...items]}
        className="w-full justify-center"
      />
    </DemoPage>
  )
}
