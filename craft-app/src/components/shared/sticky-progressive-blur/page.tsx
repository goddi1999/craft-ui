import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { StickyProgressiveBlur } from '@/components/ui/sticky-progressive-blur'

const DEFAULTS = {
  layers: 5,
  mask: 45,
  blur: 40,
  saturate: 0.1,
  padding: 50,
  debug: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'layers',
    type: 'number',
    default: '5',
    description: 'Number of stacked backdrop-filter layers.',
  },
  {
    name: 'blur',
    type: 'number',
    default: '40',
    description: 'Strongest blur in px, applied by the first layer.',
  },
  {
    name: 'mask',
    type: 'number',
    default: '45',
    description: 'Height of the blurred band, as % of the viewport.',
  },
  {
    name: 'saturate',
    type: 'number',
    default: '0.1',
    description: 'Image saturation, 0–1.',
  },
  {
    name: 'padding',
    type: 'number',
    default: '50',
    description: 'Where the first image starts, as % of the viewport.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Outline each blur layer and label the overlay.',
  },
  {
    name: 'images',
    type: 'readonly string[]',
    default: 'STICKY_PROGRESSIVE_BLUR_IMAGES',
    description: 'Images that scroll up into the blur.',
  },
  {
    name: 'tag / heading / description',
    type: 'string',
    description: 'Copy for the sticky intro beside the images.',
  },
  {
    name: 'ctaLabel / ctaHref',
    type: 'string',
    description: 'Call-to-action label and link.',
  },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function StickyProgressiveBlurPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { layers, mask, blur, saturate, padding, debug } = settings.values

  const usage = toUsageSnippet({
    component: 'StickyProgressiveBlur',
    from: '@/components/ui/sticky-progressive-blur',
    props: { layers, blur, mask, saturate, padding, debug },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / sticky-progressive-blur"
      title="Sticky Progressive Blur"
      description="Scroll the page: stacked backdrop-filter layers, each with a sine-eased blur and mask, pin to the bottom of the viewport so images melt into a progressive blur as they scroll."
      // The blur layers are `position: sticky` against the page scroll, so the
      // demo can't live inside the clipped preview card.
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Layers"
            value={layers}
            onValueChange={(next) => settings.set('layers', next)}
            min={2}
            max={10}
          />
          <DemoSlider
            label="Blur"
            value={blur}
            onValueChange={(next) => settings.set('blur', next)}
            min={2}
            max={100}
            unit="px"
          />
          <DemoSlider
            label="Mask"
            value={mask}
            onValueChange={(next) => settings.set('mask', next)}
            min={5}
            max={100}
            unit="%"
          />
          <DemoSlider
            label="Padding"
            value={padding}
            onValueChange={(next) => settings.set('padding', next)}
            min={0}
            max={100}
            unit="%"
          />
          <DemoSlider
            label="Saturate"
            value={saturate}
            onValueChange={(next) => settings.set('saturate', next)}
            min={0}
            max={1}
            step={0.01}
          />
          <DemoSwitch
            label="Debug"
            checked={debug}
            onCheckedChange={(next) => settings.set('debug', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/sticky-progressive-blur/'],
        usage,
        props: PROPS,
      }}
    >
      <StickyProgressiveBlur
        layers={layers}
        mask={mask}
        blur={blur}
        saturate={saturate}
        padding={padding}
        debug={debug}
      />
    </DemoPage>
  )
}
