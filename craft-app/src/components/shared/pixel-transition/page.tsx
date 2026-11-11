import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import {
  PixelTransition,
  type PixelTransitionImages,
} from '@/components/ui/pixel-transition'

const PAIRS = ['paris', 'macbook', 'series'] as const
type Pair = (typeof PAIRS)[number]

/** Pairs from the shared photo set that read well against each other. */
const PAIR_IMAGES: Record<Pair, PixelTransitionImages> = {
  paris: [DEMO_IMAGES[0].src, DEMO_IMAGES[13].src],
  macbook: [DEMO_IMAGES[3].src, DEMO_IMAGES[9].src],
  series: [DEMO_IMAGES[14].src, DEMO_IMAGES[15].src],
}

const PAIR_LABELS: Record<Pair, string> = {
  paris: 'Paris',
  macbook: 'MacBook',
  series: 'Series',
}

const DEFAULTS = {
  pair: 'paris' as Pair,
  cells: 12,
  frames: 12,
  speed: 0.25,
  /** The prop is a multiplier; the demo shows it as a percentage. */
  delayPercent: 40,
}

/** Placeholder swapped for a JSX expression in the usage snippet. */
const IMAGES_TOKEN = '__images__'

const COMPONENT_DEFAULTS = { cells: 12, frames: 12, speed: 0.25, delay: 0.4 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'images',
    type: 'readonly [string, string]',
    default: 'two CodePen photos',
    description: 'The two image URLs to flip between.',
  },
  {
    name: 'cells',
    type: 'number',
    default: '12',
    description: 'Grid resolution of the pixel mask — cells per side.',
  },
  {
    name: 'frames',
    type: 'number',
    default: '12',
    description: 'Steps the mask animates through.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.25',
    description: 'Duration of each mask in seconds.',
  },
  {
    name: 'delay',
    type: 'number',
    default: '0.4',
    description: 'Delay of the trailing mask, as a multiple of speed.',
  },
  {
    name: 'flipped',
    type: 'boolean',
    description: 'Controlled state — true shows the second image.',
  },
  {
    name: 'defaultFlipped',
    type: 'boolean',
    default: 'false',
    description: 'Starting state when uncontrolled.',
  },
  {
    name: 'onFlippedChange',
    type: '(flipped: boolean) => void',
    description: 'Called when the image is clicked.',
  },
  {
    name: '...props',
    type: "ComponentPropsWithoutRef<'div'>",
    description: 'Any native div attribute — style, className…',
  },
]

export function PixelTransitionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { pair, cells, frames, speed, delayPercent } = settings.values
  const delay = delayPercent / 100
  const [flipped, setFlipped] = useState(false)
  /** Bumped to remount the component, which builds fresh random sprites. */
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'PixelTransition',
    from: '@/components/ui/pixel-transition',
    props: { images: IMAGES_TOKEN, cells, frames, speed, delay },
    defaults: COMPONENT_DEFAULTS,
  }).replace(`images="${IMAGES_TOKEN}"`, 'images={[photoA, photoB]}')

  return (
    <DemoPage
      eyebrow="ui / pixel-transition"
      title="Pixel Transitions with Generated SVG Masks"
      description="Two photos crossfade through a generated SVG pixel-mask sprite sheet, stepped with CSS. Click the image to flip."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Photos"
            options={PAIRS}
            value={pair}
            onChange={(value) => settings.set('pair', value)}
            format={(value) => PAIR_LABELS[value]}
          />
          <DemoSlider
            label="Cells"
            value={cells}
            onValueChange={(value) => settings.set('cells', value)}
            min={4}
            max={24}
            step={2}
          />
          <DemoSlider
            label="Frames"
            value={frames}
            onValueChange={(value) => settings.set('frames', value)}
            min={4}
            max={24}
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(value) => settings.set('speed', value)}
            min={0.25}
            max={2}
            step={0.25}
            unit="s"
          />
          <DemoSlider
            label="Trailing delay"
            value={delayPercent}
            onValueChange={(value) => settings.set('delayPercent', value)}
            min={0}
            max={200}
            step={10}
            unit="%"
          />
          <div className="flex flex-wrap items-end justify-end gap-2">
            <DemoAction onClick={() => setRun((current) => current + 1)}>
              New sprites
            </DemoAction>
            <DemoAction onClick={() => setFlipped((current) => !current)}>
              Flip
            </DemoAction>
          </div>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/pixel-transition/'],
        usage,
        props: PROPS,
      }}
    >
      <PixelTransition
        key={run}
        images={PAIR_IMAGES[pair]}
        cells={cells}
        frames={frames}
        speed={speed}
        delay={delay}
        flipped={flipped}
        onFlippedChange={setFlipped}
        style={{ aspectRatio: '16 / 9' }}
      />
    </DemoPage>
  )
}
