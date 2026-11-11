import {
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import {
  SCROLL_DRIVEN_LENS_ITEMS,
  ScrollDrivenLens,
} from '@/components/ui/scroll-driven-lens'

const PHOTOS = [0, 4, 9, 12] as const

const DEFAULTS = {
  photo: 0 as (typeof PHOTOS)[number],
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'readonly ScrollDrivenLensItem[]',
    default: 'SCROLL_DRIVEN_LENS_ITEMS',
    description:
      'Frames left to right — `{ src, zoom, lens, crop, alt? }`; `crop` is how far object-view-box zooms in.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Camera lenses'",
    description: 'Accessible name of the horizontal scroller.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function ScrollDrivenLensPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { photo } = settings.values
  const image = DEMO_IMAGES[photo]
  const items = SCROLL_DRIVEN_LENS_ITEMS.map((item) => ({
    ...item,
    src: image.src,
    alt: image.alt,
  }))

  const usage = toUsageSnippet({
    component: 'ScrollDrivenLens',
    from: '@/components/ui/scroll-driven-lens',
    imports: ['SCROLL_DRIVEN_LENS_ITEMS'],
  }).replace(
    '<ScrollDrivenLens />',
    `<ScrollDrivenLens
  items={SCROLL_DRIVEN_LENS_ITEMS.map((item) => ({ ...item, src: photo }))}
/>`,
  )

  return (
    <DemoPage
      eyebrow="ui / scroll-driven-lens"
      title="Scroll-Driven Lens"
      description="Swipe the camera lenses sideways — an inline view() timeline scales and brightens the frame in focus, crops it with object-view-box, and flashes its caption at centre."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Photo"
            options={PHOTOS}
            value={photo}
            onChange={(value) => settings.set('photo', value)}
            format={(value) => `Photo ${PHOTOS.indexOf(value) + 1}`}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/scroll-driven-lens/'],
        usage,
        props: PROPS,
      }}
    >
      <ScrollDrivenLens items={items} />
    </DemoPage>
  )
}
