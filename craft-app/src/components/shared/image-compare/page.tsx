import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ImageCompare, type ImageCompareOrientation } from '@/components/ui/image-compare'

const ASSET = '/product-spotlight'

// each studio photo comes with the depth map estimated from it: nearer surfaces are lighter
const VIEWS = {
  Profile: {
    file: 'volar-nimbus-4s',
    alt: 'A white and red running shoe floating in profile above a grey studio floor',
  },
  Upper: {
    file: 'volar-nimbus-4s-side',
    alt: 'Close-up of the shoe’s knit upper, laces and grey cage with the Volar logo',
  },
  Sole: {
    file: 'volar-nimbus-4s-under',
    alt: 'The shoe tilted to show its white and red outsole',
  },
  Toe: {
    file: 'volar-nimbus-4s-top',
    alt: 'The toe box and laces of the shoe from the front',
  },
} as const

type View = keyof typeof VIEWS

const VIEW_NAMES = Object.keys(VIEWS) as View[]
const ORIENTATIONS: readonly ImageCompareOrientation[] = ['horizontal', 'vertical']
const LABELS: [string, string] = ['Photo', 'Depth']

const DEFAULTS = {
  view: 'Profile' as View,
  orientation: 'horizontal' as ImageCompareOrientation,
  labels: true,
  width: 640,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'before',
    type: 'ReactNode',
    description: 'The original, on the left or top. Pass an image with alt text; it covers the frame.',
  },
  { name: 'after', type: 'ReactNode', description: 'The result, on the right or bottom.' },
  {
    name: 'position',
    type: 'number',
    description: 'Where the divider sits, in percent from the left or top, when controlled.',
  },
  {
    name: 'defaultPosition',
    type: 'number',
    default: '50',
    description: 'Where the divider starts, when uncontrolled.',
  },
  {
    name: 'onPositionChange',
    type: '(position: number) => void',
    description: 'Called once per whole percent while dragging, and with the final value on release.',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Vertical stacks the images. Changing it swings the divider a quarter turn.',
  },
  {
    name: 'labels',
    type: '[string, string] | false',
    default: "['Before', 'After']",
    description: 'Captions over each side. They fade as the divider reaches them.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Before and after'",
    description: 'Accessible name of the divider.',
  },
  {
    name: 'aspectRatio',
    type: 'string',
    default: "'3 / 2'",
    description: 'Frame proportions, as a CSS aspect-ratio.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the frame.' },
]

export function ImageComparePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { view, orientation, labels, width } = settings.values
  const [position, setPosition] = useState(50)
  const { file, alt } = VIEWS[view]

  const usage = toUsageSnippet({
    component: 'ImageCompare',
    from: '@/components/ui/image-compare',
    props: {
      before: { expression: `<img src="${ASSET}/${file}.png" alt="${alt}" />` },
      after: { expression: `<img src="${ASSET}/${file}-depth.png" alt="Depth map of the shoe" />` },
      orientation,
      labels: { expression: labels ? "['Photo', 'Depth']" : 'false' },
      label: 'Photo and depth map',
    },
    defaults: { orientation: 'horizontal' },
  })

  return (
    <DemoPage
      eyebrow="ui / image-compare"
      title="Image Compare"
      description="Before and after, split by a divider. Drag anywhere and the handle follows 1:1, stretching into a capsule and rubber-banding past the edges; press the photo and the divider springs there. Switch the orientation and the line swings a quarter turn while the clip follows it. Arrow keys step 1%, Shift steps 10%, Home and End reveal one side, and a double-click on the handle centres it. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="View"
            options={VIEW_NAMES}
            value={view}
            onChange={(next) => settings.set('view', next)}
          />
          <DemoControlGroup
            title="Orientation"
            options={ORIENTATIONS}
            value={orientation}
            onChange={(next) => settings.set('orientation', next)}
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={320}
            max={800}
            step={10}
            unit="px"
          />
          <DemoSwitch
            label="Labels"
            checked={labels}
            onCheckedChange={(next) => settings.set('labels', next)}
          />
          <DemoAction onClick={() => setPosition(100)} disabled={position === 100}>
            Show photo
          </DemoAction>
          <DemoAction onClick={() => setPosition(0)} disabled={position === 0}>
            Show depth
          </DemoAction>
          <DemoAction onClick={() => setPosition(50)} disabled={position === 50}>
            Centre
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/image-compare/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-4" style={{ maxWidth: width }}>
        <ImageCompare
          before={<img src={`${ASSET}/${file}.png`} alt={alt} draggable={false} />}
          after={
            <img
              src={`${ASSET}/${file}-depth.png`}
              alt="Depth map of the shoe, nearer surfaces lighter"
              draggable={false}
            />
          }
          position={position}
          onPositionChange={setPosition}
          orientation={orientation}
          labels={labels ? LABELS : false}
          label="Photo and depth map"
        />
        <p className="text-xs text-muted-foreground tabular-nums" aria-hidden="true">
          {Math.round(100 - position)}% depth
        </p>
      </div>
    </DemoPage>
  )
}
