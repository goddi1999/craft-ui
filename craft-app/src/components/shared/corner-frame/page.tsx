import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  CornerFrame,
  CORNER_FRAME_DEFAULTS,
  type CornerFrameSize,
} from '@/components/ui/corner-frame'

const SIZES: CornerFrameSize[] = ['sm', 'default', 'lg']

const DEFAULTS: {
  size: CornerFrameSize
  length: number
  width: number
  height: number
} = {
  size: 'default',
  length: CORNER_FRAME_DEFAULTS.length,
  width: CORNER_FRAME_DEFAULTS.width,
  height: CORNER_FRAME_DEFAULTS.height,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Preset for length / width / height. Explicit props override it.',
  },
  {
    name: 'length',
    type: 'number',
    default: String(CORNER_FRAME_DEFAULTS.length),
    description: 'Arm length along each edge, in px.',
  },
  {
    name: 'width',
    type: 'number',
    default: String(CORNER_FRAME_DEFAULTS.width),
    description: 'Stroke thickness of the bracket, in px.',
  },
  {
    name: 'height',
    type: 'number',
    default: String(CORNER_FRAME_DEFAULTS.height),
    description: 'Bend radius of the corner, in px (match the parent rounded corner).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Colour via text-* (uses currentColor).',
  },
]

export function CornerFramePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, length, width, height } = settings.values

  const usage = toUsageSnippet({
    component: 'CornerFrame',
    from: '@/components/ui/corner-frame',
    props: { size, length, width, height },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / corner-frame"
      title="Corner Frame"
      description="Four thick rounded L-brackets on a box — corners only, no continuous edges. Tune arm length, stroke width, and bend radius."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoSlider
            label="Length"
            value={length}
            min={16}
            max={96}
            step={2}
            unit="px"
            onValueChange={(next) => settings.set('length', next)}
          />
          <DemoSlider
            label="Width"
            value={width}
            min={4}
            max={28}
            step={1}
            unit="px"
            onValueChange={(next) => settings.set('width', next)}
          />
          <DemoSlider
            label="Height"
            value={height}
            min={8}
            max={64}
            step={2}
            unit="px"
            onValueChange={(next) => settings.set('height', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/corner-frame/'], usage, props: PROPS }}
    >
      <div className="relative h-[min(50dvh,28rem)] min-h-64 w-full overflow-hidden rounded-4xl bg-muted/30">
        <CornerFrame size={size} length={length} width={width} height={height} />
        <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          Parent with <code className="font-mono text-xs">rounded-4xl</code>
        </p>
      </div>
    </DemoPage>
  )
}
