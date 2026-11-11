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

import {
  GradualBlur,
  type GradualBlurCurve,
  type GradualBlurPosition,
} from './GradualBlur'

const POSITIONS: GradualBlurPosition[] = ['top', 'bottom', 'left', 'right']
const CURVES: GradualBlurCurve[] = [
  'linear',
  'bezier',
  'ease-in',
  'ease-out',
  'ease-in-out',
]

const PHOTOS = DEMO_IMAGES.slice(0, 8)

const DEFAULTS = {
  position: 'bottom' as GradualBlurPosition,
  curve: 'bezier' as GradualBlurCurve,
  size: 7,
  strength: 2,
  layers: 5,
  exponential: true,
  autoHide: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  position: 'bottom',
  target: 'parent',
  height: '6rem',
  strength: 2,
  layers: 8,
  curve: 'linear',
  exponential: true,
  autoHide: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'position',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'bottom'",
    description: 'Edge the blur ramps toward.',
  },
  {
    name: 'target',
    type: "'parent' | 'page'",
    default: "'parent'",
    description: 'Pin inside the positioned parent, or fixed to the viewport.',
  },
  {
    name: 'height',
    type: 'string | number',
    default: "'6rem'",
    description: 'Depth of the blur for top / bottom (and left / right when no width).',
  },
  {
    name: 'width',
    type: 'string | number',
    description: 'Depth for left / right, or the span of a centred top / bottom strip.',
  },
  {
    name: 'strength',
    type: 'number',
    default: '2',
    description: 'Blur multiplier — the deepest layer blurs by 12px × strength.',
  },
  {
    name: 'layers',
    type: 'number',
    default: '8',
    description: 'How many stacked backdrop-filter layers build the ramp (1–16).',
  },
  {
    name: 'curve',
    type: "'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'",
    default: "'linear'",
    description: 'Shape of the ramp from clear to blurred.',
  },
  {
    name: 'exponential',
    type: 'boolean',
    default: 'true',
    description: 'Ramp the blur exponentially so it stays crisp longer.',
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: 'Opacity of each blur layer.',
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1',
    description: 'Saturation boost behind the blur.',
  },
  {
    name: 'tint',
    type: 'string',
    default: "'transparent'",
    description: 'A colour washed in along the ramp.',
  },
  {
    name: 'autoHide',
    type: 'boolean',
    default: 'false',
    description: 'Fade the blur out as the scroller reaches that edge.',
  },
  {
    name: 'container',
    type: 'Element | string | RefObject<Element | null> | null',
    description: 'Scroller autoHide listens to; defaults to a scrolling sibling or the parent.',
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '1',
    description: 'Blur multiplier while the pointer is over the blur.',
  },
  {
    name: 'duration',
    type: 'number | string',
    default: '0.3',
    description: 'Transition duration for autoHide and hover (seconds when a number).',
  },
  {
    name: 'easing',
    type: 'string',
    default: "'ease-out'",
    description: 'Transition easing for autoHide and hover.',
  },
  {
    name: 'zIndex',
    type: 'number',
    default: '1000',
    description: 'Stacking order of the overlay.',
  },
  {
    name: 'className / style',
    type: 'string / CSSProperties',
    description: 'Extra classes and inline styles for the overlay root.',
  },
]

export function GradualBlurPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { position, curve, size, strength, layers, exponential, autoHide } =
    settings.values

  const usage = toUsageSnippet({
    component: 'GradualBlur',
    from: '@/components/shared/gradual-blur',
    props: {
      position,
      height: `${size}rem`,
      strength,
      layers,
      curve,
      exponential,
      autoHide,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / gradual-blur"
      title="Gradual blur"
      description="Stacked backdrop-filter layers whose strength ramps along an edge, so scrolling content fades into a soft focus falloff. Scroll the photos."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Position"
            options={POSITIONS}
            value={position}
            onChange={(value) => settings.set('position', value)}
          />
          <DemoControlGroup
            title="Curve"
            options={CURVES}
            value={curve}
            onChange={(value) => settings.set('curve', value)}
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={2}
            max={14}
            step={0.5}
            unit="rem"
          />
          <DemoSlider
            label="Strength"
            value={strength}
            onValueChange={(value) => settings.set('strength', value)}
            min={0.5}
            max={5}
            step={0.5}
          />
          <DemoSlider
            label="Layers"
            value={layers}
            onValueChange={(value) => settings.set('layers', value)}
            min={1}
            max={16}
          />
          <DemoSwitch
            label="Exponential"
            checked={exponential}
            onCheckedChange={(value) => settings.set('exponential', value)}
          />
          <DemoSwitch
            label="Hide at the end"
            checked={autoHide}
            onCheckedChange={(value) => settings.set('autoHide', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/gradual-blur/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="relative isolate h-[28rem] w-full overflow-hidden">
        <div className="h-full overflow-y-auto overscroll-contain">
          <ul className="mx-auto grid max-w-2xl gap-6 px-6 py-16">
            {PHOTOS.map((photo, index) => (
              <li key={photo.src} className="flex flex-col gap-2">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="aspect-video w-full rounded-xl object-cover"
                />
                <p className="text-sm text-muted-foreground">
                  {index + 1}. {photo.alt}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <GradualBlur
          position={position}
          height={`${size}rem`}
          strength={strength}
          layers={layers}
          curve={curve}
          exponential={exponential}
          autoHide={autoHide}
          zIndex={1}
        />
      </div>
    </DemoPage>
  )
}
