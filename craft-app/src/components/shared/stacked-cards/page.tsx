import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { StackedCards, type StackedCard } from '@/components/ui/stacked-cards'

// images are bundled under public/ so the demo never depends on a remote host
const PLACES: Required<StackedCard>[] = [
  {
    id: 'ha-long',
    title: 'Ha Long Bay',
    description:
      'Close to two thousand limestone islands rise out of emerald water, and every tour boat still finds the same beach.',
    image: '/apple-carousel/1.webp',
    imageAlt:
      'Limestone islands rising from turquoise water in Ha Long Bay, with tour boats near a sandy beach.',
    href: 'https://en.wikipedia.org/wiki/Quảng_Ninh_province',
    ctaLabel: 'Set sail',
  },
  {
    id: 'tra-su',
    title: 'Tra Su Forest',
    description:
      'A green waterway under an arch of cajuput trees. The only traffic jam is two rowboats politely waiting.',
    image: '/apple-carousel/2.webp',
    imageAlt:
      'A narrow waterway under an arch of cajuput trees, their trunks reflected in the still green water.',
    href: 'https://en.wikipedia.org/wiki/An_Giang_province',
    ctaLabel: 'Paddle in',
  },
  {
    id: 'trang-an',
    title: 'Trang An',
    description:
      'A pavilion on still water at the foot of karst cliffs. Bring a camera; the reflections do most of the work.',
    image: '/apple-carousel/3.webp',
    imageAlt: 'A traditional pavilion on the water at the foot of steep limestone mountains.',
    href: 'https://en.wikipedia.org/wiki/Ninh_Bình_province',
    ctaLabel: 'Drift closer',
  },
  {
    id: 'hue',
    title: 'Imperial City, Hue',
    description:
      'A gate tower with tiered roofs on an old stone wall, still patient with everyone trying to fit it in one photo.',
    image: '/apple-carousel/4.webp',
    imageAlt: 'A gate tower with tiered roofs on top of an old stone wall, framed by bare trees.',
    href: 'https://en.wikipedia.org/wiki/Huế',
    ctaLabel: 'Walk the walls',
  },
  {
    id: 'bai-dinh',
    title: 'Bai Dinh Pagoda',
    description:
      'A pagoda complex among the trees, with a lake and mountains behind it. Comfortable shoes strongly advised.',
    image: '/apple-carousel/5.webp',
    imageAlt:
      'An aerial view of a pagoda complex among trees, with a lake and mountains in the distance.',
    href: 'https://en.wikipedia.org/wiki/Ninh_Bình_province',
    ctaLabel: 'Climb the steps',
  },
  {
    id: 'saigon',
    title: 'Saigon River',
    description:
      'The skyline lights up over the river at dusk, right as the motorbikes reach peak confidence.',
    image: '/apple-carousel/6.webp',
    imageAlt:
      'Skyscrapers along the Saigon River at sunset, with the Bitexco Financial Tower in the middle.',
    href: 'https://en.wikipedia.org/wiki/Ho_Chi_Minh_City',
    ctaLabel: 'Catch the sunset',
  },
  {
    id: 'dragon-bridge',
    title: 'Dragon Bridge, Da Nang',
    description:
      'A bridge shaped like a dragon, lit up every night. On weekends it breathes actual fire.',
    image: '/apple-carousel/7.webp',
    imageAlt: 'The Dragon Bridge lit up at night under a purple sky, reflected in the river.',
    href: 'https://en.wikipedia.org/wiki/Da_Nang',
    ctaLabel: 'Wait for the fire',
  },
]

const DEFAULTS = {
  count: 4,
  title: 'Postcards from Vietnam',
  subtitle: 'Scroll down: each card pins under the last and shrinks as the next one lands.',
  links: true,
}

const COMPONENT_DEFAULTS = { title: '', subtitle: '' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'cards',
    type: 'StackedCard[]',
    description:
      'Top to bottom, each `{ id, title, description, image, imageAlt?, href?, ctaLabel? }`.',
  },
  { name: 'title', type: 'string', description: 'Heading above the cards.' },
  { name: 'subtitle', type: 'string', description: 'Line under the heading.' },
  {
    name: 'StackedCard.href',
    type: 'string',
    description: 'The call to action only shows when a card has both `href` and `ctaLabel`.',
  },
  {
    name: '...props',
    type: "ComponentProps<'section'>",
    description: 'Any section attribute; `aria-label` replaces the default "Stacked Stories".',
  },
  { name: 'className', type: 'string', description: 'Merged onto the section.' },
]

export function StackedCardsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, title, subtitle, links } = settings.values
  const cards = PLACES.slice(0, count).map((place) =>
    links ? place : { ...place, href: undefined },
  )

  const usage = toUsageSnippet({
    component: 'StackedCards',
    from: '@/components/ui/stacked-cards',
    props: { cards: { expression: 'cards' }, title, subtitle },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / stacked-cards"
      title="Stacked Cards"
      description="Cards that pin and stack as you scroll. Each one sticks a little lower than the last so its top edge shows like a tab, and shrinks as the next card slides over it; scroll back up and they spread out again. Plain sticky positioning does the stacking, so the page keeps its native scroll. Adapted from EasyUI."
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
            maxLength={40}
          />
          <DemoTextField
            label="Subtitle"
            value={subtitle}
            onValueChange={(next) => settings.set('subtitle', next)}
            maxLength={100}
          />
          <DemoSlider
            label="Cards"
            value={count}
            onValueChange={(next) => settings.set('count', next)}
            min={2}
            max={PLACES.length}
          />
          <DemoSwitch
            label="Links"
            checked={links}
            onCheckedChange={(next) => settings.set('links', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/stacked-cards/'], usage, props: PROPS }}
    >
      <StackedCards cards={cards} title={title} subtitle={subtitle} />
    </DemoPage>
  )
}
