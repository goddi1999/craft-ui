import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  SparkleButton,
  type SparkleButtonHue,
  type SparkleButtonSize,
} from '@/components/ui/sparkle-button'

const HUES: SparkleButtonHue[] = [
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'pink',
  'orange',
]
const SIZES: SparkleButtonSize[] = ['sm', 'default', 'lg']

/** Matches the button's own hue map so the stage glows the same color. */
const STAGE_HUE: Record<SparkleButtonHue, number> = {
  violet: 260,
  indigo: 275,
  blue: 220,
  cyan: 190,
  teal: 175,
  green: 145,
  pink: 330,
  orange: 35,
}

const DEFAULTS = {
  hue: 'violet' as SparkleButtonHue,
  size: 'default' as SparkleButtonSize,
  label: 'Generate Site',
  showIcon: true,
  particleCount: 20,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    default: "'Generate Site'",
    description: 'Button label, rendered with the gradient text.',
  },
  {
    name: 'hue',
    type: "'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'pink' | 'orange'",
    default: "'violet'",
    description: 'Color of the glow, sparks and label gradient.',
  },
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Overall scale of the pill.',
  },
  {
    name: 'showIcon',
    type: 'boolean',
    default: 'true',
    description: 'Show the sparkle icon before the label.',
  },
  {
    name: 'particleCount',
    type: 'number',
    default: '20',
    description: 'How many particles orbit the button on hover.',
  },
  {
    name: '...props',
    type: 'ButtonHTMLAttributes',
    description: 'Any native button attribute — onClick, disabled, type…',
  },
]

export function SparkleButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { hue, size, label, showIcon, particleCount } = settings.values

  const usage = toUsageSnippet({
    component: 'SparkleButton',
    from: '@/components/ui/sparkle-button',
    props: { hue, size, showIcon, particleCount },
    defaults: DEFAULTS,
    children: label,
  })

  return (
    <DemoPage
      eyebrow="ui / sparkle-button"
      title="Sparkle Button"
      description={
        <>
          A hover-activated pill button with a conic spark, orbiting particles
          and gradient label text. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/LYJMPBL" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Hue"
            options={HUES}
            value={hue}
            onChange={(value) => settings.set('hue', value)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={32}
          />
          <DemoSlider
            label="Particles"
            value={particleCount}
            onValueChange={(value) => settings.set('particleCount', value)}
            min={0}
            max={40}
          />
          <DemoSwitch
            label="Show icon"
            checked={showIcon}
            onCheckedChange={(value) => settings.set('showIcon', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/sparkle-button/'],
        usage,
        props: PROPS,
      }}
    >
      <div
        data-slot="sparkle-button-stage"
        style={{ ['--sparkle-button-stage-hue' as string]: STAGE_HUE[hue] }}
      >
        <SparkleButton
          hue={hue}
          size={size}
          showIcon={showIcon}
          particleCount={particleCount}
        >
          {label || undefined}
        </SparkleButton>
      </div>
    </DemoPage>
  )
}
