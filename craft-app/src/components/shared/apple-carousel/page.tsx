// Items must be direct children of AppleCarouselContent (it reads and clones them),
// so the slides are render functions, not wrapper components.
import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from '@/components/ui/apple-carousel'
import { cn } from '@/lib/utils'

const VARIANTS = ['default', 'caption'] as const
type Variant = (typeof VARIANTS)[number]

const VARIANT_LABELS: Record<Variant, string> = {
  default: 'Default',
  caption: 'Caption',
}

const DEFAULTS = {
  variant: 'default' as Variant,
  duration: 3.6,
  autoPlay: true,
}

const COMPONENT_DEFAULTS = { duration: 5000, loop: true, autoPlay: true }

type Place = {
  title: string
  description: string
  image: string
  href: string
}

// Images are bundled under public/ so the demo never depends on a remote host.
const PLACES: Place[] = [
  {
    title: 'Quang Ninh',
    description: 'Limestone islands rise from emerald water.',
    image: '/apple-carousel/1.webp',
    href: 'https://en.wikipedia.org/wiki/Quảng_Ninh_province',
  },
  {
    title: 'An Giang',
    description: 'Cajuput trees arch over a quiet green waterway.',
    image: '/apple-carousel/2.webp',
    href: 'https://en.wikipedia.org/wiki/An_Giang_province',
  },
  {
    title: 'Ninh Binh',
    description: 'A pavilion rests on still water beneath karst cliffs.',
    image: '/apple-carousel/3.webp',
    href: 'https://en.wikipedia.org/wiki/Ninh_Bình_province',
  },
  {
    title: 'Hue',
    description: 'Tiered palace roofs against a pale sky.',
    image: '/apple-carousel/4.webp',
    href: 'https://en.wikipedia.org/wiki/Huế',
  },
  {
    title: 'Ninh Binh',
    description: 'Temple corridors wind toward a lake among the mountains.',
    image: '/apple-carousel/5.webp',
    href: 'https://en.wikipedia.org/wiki/Ninh_Bình_province',
  },
  {
    title: 'Ho Chi Minh City',
    description: 'The skyline glows over the river at dusk.',
    image: '/apple-carousel/6.webp',
    href: 'https://en.wikipedia.org/wiki/Ho_Chi_Minh_City',
  },
  {
    title: 'Da Nang',
    description: 'A dragon-shaped bridge lights up the evening river.',
    image: '/apple-carousel/7.webp',
    href: 'https://en.wikipedia.org/wiki/Da_Nang',
  },
]

const PROPS: DemoPropDoc[] = [
  {
    name: 'duration',
    type: 'number',
    default: '5000',
    description: 'AppleCarouselRoot: time each card stays up during autoplay, in ms.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description:
      'AppleCarouselRoot: wrap the last card to the first. Off, autoplay stops on the last card.',
  },
  {
    name: 'autoPlay',
    type: 'boolean',
    default: 'true',
    description:
      'AppleCarouselRoot: start playing on mount. Read once; the play button takes over.',
  },
  {
    name: 'size',
    type: "'default' | 'sm'",
    default: "'default'",
    description: 'AppleCarouselControls: size of the tab list and play button.',
  },
  {
    name: 'useAppleCarouselItem()',
    type: '{ index, isCurrent, isClone }',
    description:
      'Inside an item: its state. Content also renders in loop clones, so check isClone before starting media.',
  },
]

function renderDefaultSlides() {
  return PLACES.map((place) => (
    // The link is the panel's first focusable element, so the panel itself
    // leaves the tab order.
    <AppleCarouselItem key={place.image} tabIndex={-1} className="@max-3xl:h-96">
      <a
        href={place.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block size-full rounded-[inherit] select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <img
          src={place.image}
          alt={place.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="size-full object-cover"
        />
      </a>
    </AppleCarouselItem>
  ))
}

function renderCaptionSlides() {
  return PLACES.map((place) => (
    // The caption always sits on a photo, so the card resolves the dark
    // tokens in either theme.
    <AppleCarouselItem key={place.image} className="dark @max-3xl:h-96">
      <img
        src={place.image}
        alt={place.title}
        draggable={false}
        className="absolute inset-0 size-full object-cover select-none"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/30 to-transparent"
      />
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex items-center gap-4 px-12 pb-10 text-xl/6 text-foreground',
          'opacity-36 transition-opacity duration-150 ease-out in-data-current:opacity-100 in-data-current:duration-400',
          '@max-5xl:gap-3 @max-5xl:px-6 @max-5xl:pb-6 @max-5xl:text-base/5',
          '@max-3xl:flex-col @max-3xl:px-6 @max-3xl:text-center',
        )}
      >
        <a
          href={place.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Learn more
        </a>
        <p className="text-pretty text-shadow-sm">
          <span className="font-semibold after:px-2 after:opacity-50 after:content-['•'/''] @max-3xl:block @max-3xl:after:hidden">
            {place.title}
          </span>
          {place.description}
        </p>
      </div>
    </AppleCarouselItem>
  ))
}

export function AppleCarouselPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, duration, autoPlay } = settings.values

  const usage = toUsageSnippet({
    component: 'AppleCarouselRoot',
    from: '@/components/ui/apple-carousel',
    props: { duration: duration * 1000, autoPlay },
    defaults: COMPONENT_DEFAULTS,
    children: `<AppleCarouselContent>
  {items.map((item) => (
    <AppleCarouselItem key={item.id}>{/* card */}</AppleCarouselItem>
  ))}
</AppleCarouselContent>
<AppleCarouselControls>
  <AppleCarouselTabList aria-label="Slides">
    {items.map((item) => (
      <AppleCarouselTab key={item.id}>{item.title}</AppleCarouselTab>
    ))}
  </AppleCarouselTabList>
  <AppleCarouselPlayButton />
</AppleCarouselControls>`,
  })

  return (
    <DemoPage
      eyebrow="ui / apple-carousel"
      title="Apple Carousel"
      description="A scroll-snap gallery in the style of apple.com: wide cards with the next one peeking in, a seamless loop, springy tab and play controls, and a progress dot that doubles as the autoplay timer. Swipe, arrow-key the tabs, or let it play."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
            format={(option) => VARIANT_LABELS[option]}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={1}
            max={8}
            step={0.2}
            unit="s"
          />
          <DemoSwitch
            label="Autoplay"
            checked={autoPlay}
            onCheckedChange={(next) => settings.set('autoPlay', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/apple-carousel/'], usage, props: PROPS }}
    >
      {/* autoPlay is read on mount, so flipping it or the variant remounts. */}
      <AppleCarouselRoot
        key={`${variant}-${autoPlay}`}
        duration={duration * 1000}
        autoPlay={autoPlay}
        className="max-w-5xl"
      >
        <AppleCarouselContent>
          {variant === 'caption' ? renderCaptionSlides() : renderDefaultSlides()}
        </AppleCarouselContent>
        <AppleCarouselControls>
          <AppleCarouselTabList aria-label="Places in Viet Nam">
            {PLACES.map((place) => (
              <AppleCarouselTab key={place.image}>{place.title}</AppleCarouselTab>
            ))}
          </AppleCarouselTabList>
          <AppleCarouselPlayButton />
        </AppleCarouselControls>
      </AppleCarouselRoot>
    </DemoPage>
  )
}
