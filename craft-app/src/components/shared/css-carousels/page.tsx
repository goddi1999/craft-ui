import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'
import {
  CssCarousel,
  type CssCarouselSlide,
  type CssCarouselVariant,
} from '@/components/ui/css-carousels'

const VARIANTS: CssCarouselVariant[] = ['fade', 'slide', 'thumbnails', 'scale']

/** Lettered captions over the shared photo set. */
const SLIDES: CssCarouselSlide[] = DEMO_IMAGES.slice(0, 8).map((image, index) => ({
  label: String.fromCharCode(65 + index),
  image: image.src,
}))

const DEFAULTS = {
  variant: 'fade' as CssCarouselVariant,
  count: 5,
}

const SLIDES_PLACEHOLDER = '__slides__'

const PROPS: DemoPropDoc[] = [
  {
    name: 'slides',
    type: 'readonly CssCarouselSlide[]',
    default: 'DEFAULT_CAROUSEL_SLIDES',
    description: 'Slides to cycle through — `{ label, image }` each; the label is drawn over the photo.',
  },
  {
    name: 'variant',
    type: "'fade' | 'slide' | 'thumbnails' | 'scale'",
    default: "'fade'",
    description: 'Transition between slides; thumbnails also turns the dots into tiny photos.',
  },
  {
    name: 'index',
    type: 'number',
    description: 'Controlled active slide index.',
  },
  {
    name: 'defaultIndex',
    type: 'number',
    default: '0',
    description: 'Initial slide when uncontrolled.',
  },
  {
    name: 'onIndexChange',
    type: '(index: number) => void',
    description: 'Called with the new index when an arrow or dot is picked.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Carousel'",
    description: 'Accessible name of the carousel region.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root. It is 400px wide at most, 4:3.',
  },
]

export function CssCarouselsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, count } = settings.values
  const slides = SLIDES.slice(0, count)

  const usage = toUsageSnippet({
    component: 'CssCarousel',
    from: '@/components/ui/css-carousels',
    props: { slides: SLIDES_PLACEHOLDER, variant },
    defaults: DEFAULTS,
  }).replace(`slides="${SLIDES_PLACEHOLDER}"`, 'slides={slides}')

  return (
    <DemoPage
      eyebrow="ui / css-carousels"
      title="c(ss)arousel"
      description="A carousel driven by a group of radio inputs — labels act as arrows and dots, and CSS handles the fade, slide, thumbnail and scale transitions."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(value) => settings.set('variant', value)}
          />
          <DemoSlider
            label="Slides"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={2}
            max={SLIDES.length}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/css-carousels/'],
        usage,
        props: PROPS,
      }}
    >
      <CssCarousel
        variant={variant}
        slides={slides}
        label="Featured photos"
      />
    </DemoPage>
  )
}
