import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import { ScrollImageComparison } from '@/components/ui/scroll-image-comparison'

/** Before/after photo pairs from the shared demo set. */
const PAIRS = {
  'Pair 1': [DEMO_IMAGES[0], DEMO_IMAGES[15]],
  'Pair 2': [DEMO_IMAGES[3], DEMO_IMAGES[12]],
  'Pair 3': [DEMO_IMAGES[4], DEMO_IMAGES[9]],
} as const

type PairName = keyof typeof PAIRS

const PAIR_NAMES = Object.keys(PAIRS) as PairName[]

const DEFAULTS = {
  pair: 'Pair 1' as PairName,
  defaultValue: 50,
  reveal: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'beforeSrc',
    type: 'string',
    default: 'Vercel home (dark)',
    description: 'Image underneath, revealed on the left of the handle.',
  },
  {
    name: 'afterSrc',
    type: 'string',
    default: 'Vercel home (light)',
    description: 'Image on top, clipped from the left by the handle.',
  },
  {
    name: 'beforeAlt',
    type: 'string',
    default: "'Vercel home, dark theme'",
    description: 'Alt text for the underneath image.',
  },
  {
    name: 'afterAlt',
    type: 'string',
    default: "'Vercel home, light theme'",
    description: 'Alt text for the top image.',
  },
  {
    name: 'defaultValue',
    type: 'number',
    default: '50',
    description: 'Starting handle position, 0–100.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Called with the handle position, 0–100, as it moves.',
  },
  {
    name: 'reveal',
    type: 'boolean',
    default: 'false',
    description: 'Explode the layers into 3D with pointer parallax to show how it works.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Compare images'",
    description: 'Accessible name of the range input.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function ScrollImageComparisonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { pair, defaultValue, reveal } = settings.values
  const [before, after] = PAIRS[pair]

  const usage = toUsageSnippet({
    component: 'ScrollImageComparison',
    from: '@/components/ui/scroll-image-comparison',
    props: {
      beforeSrc: before.src,
      afterSrc: after.src,
      defaultValue,
      reveal,
    },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / scroll-image-comparison"
      title="Scroll Image Comparison"
      description="A before/after slider with no JS wiring — the range thumb owns a view-timeline that animates --compare to clip the top image. Reveal explodes the layers in 3D."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Photos"
            options={PAIR_NAMES}
            value={pair}
            onChange={(value) => settings.set('pair', value)}
          />
          <DemoSlider
            label="Start position"
            value={defaultValue}
            onValueChange={(value) => settings.set('defaultValue', value)}
            min={0}
            max={100}
            unit="%"
          />
          <DemoSwitch
            label="Reveal layers"
            checked={reveal}
            onCheckedChange={(value) => settings.set('reveal', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/scroll-image-comparison/'],
        usage,
        props: PROPS,
      }}
    >
      {/* Remount on a new start position so `defaultValue` applies again. */}
      <ScrollImageComparison
        key={defaultValue}
        beforeSrc={before.src}
        beforeAlt={before.alt}
        afterSrc={after.src}
        afterAlt={after.alt}
        defaultValue={defaultValue}
        reveal={reveal}
      />
    </DemoPage>
  )
}
