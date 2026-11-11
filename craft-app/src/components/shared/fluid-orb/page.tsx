import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { FluidOrb } from '@/components/ui/fluid-orb'

// hex, not theme tokens: the shader mixes the colour itself and needs raw RGB
const COLORS = ['#1A73F2', '#FF3B30', '#F75001', '#34C759'] as const
type OrbColor = (typeof COLORS)[number]
const COLOR_NAMES: Record<OrbColor, string> = {
  '#1A73F2': 'Blue',
  '#FF3B30': 'Red',
  '#F75001': 'Orange',
  '#34C759': 'Green',
}

const DEFAULTS = {
  color: '#1A73F2' as OrbColor,
  size: 240,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#1A73F2'",
    description:
      'Any hex colour (#rgb or #rrggbb). The middle band is a pale tint of it and the bottom the full colour; the top stays white.',
  },
  { name: 'size', type: 'number', default: '240', description: 'Diameter of the orb in pixels.' },
]

export function FluidOrbPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { color, size } = settings.values

  const usage = toUsageSnippet({
    component: 'FluidOrb',
    from: '@/components/ui/fluid-orb',
    props: { size, color },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / fluid-orb"
      title="Fluid Orb"
      description="An ambient WebGL orb, inspired by ChatGPT's voice mode. Colour patches drift and re-form on their own, white at the top and pooling into the full colour at the bottom. Holds a still frame under reduced motion."
      previewClassName="min-h-[24rem] bg-muted/50"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Color"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
            format={(option) => (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2.5 rounded-full ring-1 ring-foreground/10"
                  style={{ backgroundColor: option }}
                />
                {COLOR_NAMES[option]}
              </span>
            )}
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(next) => settings.set('size', next)}
            min={96}
            max={320}
            step={8}
            unit="px"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/fluid-orb/'], usage, props: PROPS }}
    >
      <FluidOrb size={size} color={color} />
    </DemoPage>
  )
}
