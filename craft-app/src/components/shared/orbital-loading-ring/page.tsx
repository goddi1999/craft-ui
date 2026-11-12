import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  OrbitalLoadingRing,
  type OrbitalLoadingRingVariant,
} from '@/components/ui/orbital-loading-ring'

const VARIANTS: readonly OrbitalLoadingRingVariant[] = ['default', 'dense', 'minimal']
// the ring takes the text colour, so a text class is all a tint needs
const TINTS = {
  foreground: undefined,
  muted: 'text-muted-foreground',
  blue: 'text-blue-600 dark:text-blue-400',
  violet: 'text-violet-600 dark:text-violet-400',
} as const
type Tint = keyof typeof TINTS

const DEFAULTS = {
  variant: 'dense' as OrbitalLoadingRingVariant,
  size: 96,
  speed: 1,
  label: 'Syncing registry',
  tint: 'foreground' as Tint,
}

const COMPONENT_DEFAULTS = { variant: 'default', size: 72, speed: 1, label: 'Loading' }

const PROPS: DemoPropDoc[] = [
  { name: 'size', type: 'number', default: '72', description: 'Width and height in px.' },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Multiplies how fast the orbits turn and the core pulses; 0 holds it still.',
  },
  {
    name: 'variant',
    type: "'default' | 'dense' | 'minimal'",
    default: "'default'",
    description: '`minimal` drops the outer trailing dot, `dense` adds one to the inner orbit.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Loading'",
    description: 'What screen readers announce; the root is a `role="status"` region.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the root. A `text-*` class tints the tracks, particles and glow.',
  },
]

export function OrbitalLoadingRingPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, size, speed, label, tint } = settings.values

  const usage = toUsageSnippet({
    component: 'OrbitalLoadingRing',
    from: '@/components/ui/orbital-loading-ring',
    props: { size, speed, variant, label: label || undefined, className: TINTS[tint] },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / orbital-loading-ring"
      title="Orbital Loading Ring"
      description="A loader of two orbits around a pulsing core. The outer satellite turns at a steady pace while the inner one eases the other way, over a dashed and a solid track. Everything takes the text colour, so it follows light and dark and a text class tints it; reduced motion holds every part still. Adapted from EasyUI."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoControlGroup
            title="Tint"
            options={Object.keys(TINTS) as Tint[]}
            value={tint}
            onChange={(next) => settings.set('tint', next)}
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(next) => settings.set('size', next)}
            min={40}
            max={160}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(next) => settings.set('speed', next)}
            min={0.25}
            max={3}
            step={0.25}
            unit="×"
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={32}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/orbital-loading-ring/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-4">
        <OrbitalLoadingRing
          size={size}
          speed={speed}
          variant={variant}
          label={label || undefined}
          className={TINTS[tint]}
        />
        {/* the ring already announces the label, so this is for sighted users only */}
        <p aria-hidden className="text-xs text-muted-foreground">
          {label || 'Loading'}
        </p>
      </div>
    </DemoPage>
  )
}
