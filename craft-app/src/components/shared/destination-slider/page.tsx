import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { DestinationSlider } from '@/components/ui/destination-slider'

const ACCENTS = [
  'hsl(10 100% 65%)',
  'hsl(265 90% 66%)',
  'hsl(90 75% 48%)',
  'hsl(200 95% 55%)',
] as const
type Accent = (typeof ACCENTS)[number]

const ACCENT_LABELS: Record<Accent, string> = {
  'hsl(10 100% 65%)': 'Coral',
  'hsl(265 90% 66%)': 'Violet',
  'hsl(90 75% 48%)': 'Lime',
  'hsl(200 95% 55%)': 'Sky',
}

const DEFAULTS = {
  accent: 'hsl(10 100% 65%)' as Accent,
  bumpHeight: 40,
  bumpWidth: 150,
  bumpTopWidth: 65,
  explode: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    description: 'Controlled value.',
  },
  {
    name: 'defaultValue',
    type: 'number',
    default: '30',
    description: 'Initial value when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Called with the new value on every input.',
  },
  {
    name: 'min',
    type: 'number',
    default: '0',
    description: 'Lowest value.',
  },
  {
    name: 'max',
    type: 'number',
    default: '100',
    description: 'Highest value.',
  },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Value granularity.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Destination'",
    description: 'Accessible label of the range input.',
  },
  {
    name: 'accent',
    type: 'string',
    default: "'hsl(10 100% 65%)'",
    description: 'CSS color of the marker and its balloon.',
  },
  {
    name: 'bumpHeight',
    type: 'number',
    default: '40',
    description: 'How high the track lifts under the held marker, in viewBox units.',
  },
  {
    name: 'bumpWidth',
    type: 'number',
    default: '150',
    description: 'Overall width of the bump, in viewBox units (the track is 300).',
  },
  {
    name: 'bumpTopWidth',
    type: 'number',
    default: '65',
    description: 'Width of the bump’s rounded peak, in viewBox units.',
  },
  {
    name: 'explode',
    type: 'boolean',
    default: 'false',
    description: 'Reveal the native range input under the drawing.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root. It is 260px wide at most.',
  },
]

export function DestinationSliderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { accent, bumpHeight, bumpWidth, bumpTopWidth, explode } = settings.values

  const usage = toUsageSnippet({
    component: 'DestinationSlider',
    from: '@/components/ui/destination-slider',
    props: { accent, bumpHeight, bumpWidth, bumpTopWidth, explode },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / destination-slider"
      title="Destination Slider"
      description="A native range input skinned with SVG and GSAP — drag the marker: the dotted track bumps up under it and a gooey balloon shows where you're headed."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Accent"
            options={ACCENTS}
            value={accent}
            onChange={(value) => settings.set('accent', value)}
            format={(value) => ACCENT_LABELS[value]}
          />
          <DemoSlider
            label="Bump height"
            value={bumpHeight}
            onValueChange={(value) => settings.set('bumpHeight', value)}
            min={0}
            max={60}
          />
          <DemoSlider
            label="Bump width"
            value={bumpWidth}
            onValueChange={(value) => settings.set('bumpWidth', value)}
            min={80}
            max={240}
            step={10}
          />
          <DemoSlider
            label="Peak width"
            value={bumpTopWidth}
            onValueChange={(value) => settings.set('bumpTopWidth', value)}
            min={20}
            max={120}
            step={5}
          />
          <DemoSwitch
            label="Explode"
            checked={explode}
            onCheckedChange={(value) => settings.set('explode', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/destination-slider/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex min-h-56 items-center justify-center pt-12">
        <DestinationSlider
          accent={accent}
          bumpHeight={bumpHeight}
          bumpWidth={bumpWidth}
          bumpTopWidth={bumpTopWidth}
          explode={explode}
        />
      </div>
    </DemoPage>
  )
}
