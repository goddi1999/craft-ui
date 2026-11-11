import { ImagesIcon } from 'lucide-react'
import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxThumbnail,
  LightboxThumbnailStrip,
  LightboxThumbnailStripTrack,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
  createLightboxHandle,
} from '@/components/ui/lightbox'
import { cn } from '@/lib/utils'

type Photo = {
  id: number
  thumbnail: string
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

const VARIANTS = ['Grid', 'Single', 'Thumbnails', 'Handle'] as const
type Variant = (typeof VARIANTS)[number]

const photo = (id: number, alt: string, caption: string): Photo => ({
  id,
  thumbnail: `/lightbox/${id}-640w.webp`,
  src: `/lightbox/${id}-2048w.webp`,
  alt,
  caption,
  width: 2048,
  height: 1152,
})

const PHOTOS: Photo[] = [
  photo(1, 'Limestone islands rising from turquoise water in Ha Long Bay, with tour boats near a sandy beach.', 'Ha Long Bay, Quang Ninh'),
  photo(2, 'A narrow waterway under an arch of cajuput trees, their trunks reflected in the still green water.', 'Tra Su Forest, An Giang'),
  photo(3, 'A traditional pavilion on the water at the foot of steep limestone mountains.', 'Trang An, Ninh Binh'),
  photo(4, 'A gate tower with tiered roofs on top of an old stone wall, framed by bare trees.', 'Imperial City, Hue'),
  photo(5, 'An aerial view of a pagoda complex among trees, with a lake and mountains in the distance.', 'Bai Dinh Pagoda, Ninh Binh'),
  photo(6, 'Skyscrapers along the Saigon River at sunset, with the Bitexco Financial Tower in the middle.', 'Saigon River, Ho Chi Minh City'),
  photo(7, 'The Dragon Bridge lit up at night under a purple sky, reflected in the river.', 'Dragon Bridge, Da Nang'),
]

const SINGLE = {
  src: '/lightbox/cabinet-1000w.webp',
  alt: 'The whole cabinet from the front: iPhones and their boxes on two shelves, and an iPad with its box on the bottom shelf.',
  caption: 'Apple Museum cabinet',
  width: 1000,
  height: 1488,
}

const GRID_PHOTOS = PHOTOS.slice(0, 4)

const handle = createLightboxHandle()

const DEFAULTS = {
  variant: 'Grid' as Variant,
  zoomControls: true,
  counter: true,
  scrollToZoom: false,
}

const PROPS: DemoPropDoc[] = [
  { name: 'open / defaultOpen / onOpenChange', type: 'boolean', description: 'Controlled or uncontrolled open state.' },
  { name: 'index / defaultIndex / onIndexChange', type: 'number', default: '0', description: 'The slide on show, controlled or uncontrolled.' },
  { name: 'handle', type: 'LightboxHandle', description: 'From createLightboxHandle(); call handle.open(index) / handle.close() from anywhere, no trigger needed.' },
  { name: 'LightboxTrigger index', type: 'number', default: '0', description: 'Slide to open on. Its child is a function receiving { imageRef }; attach it to the thumbnail <img> for the shared-image transition.' },
  { name: 'LightboxItem index / caption', type: 'number / string', description: 'One per slide; the caption feeds <LightboxCaption />.' },
  { name: 'LightboxMedia width / height', type: 'number', description: 'Intrinsic size of the photo. Only the ratio is used, to fit it inside the slide.' },
  { name: 'LightboxZoom maxZoom', type: 'number', default: '4', description: 'Highest zoom. Also minZoom (1) and zoomStep (2, per button press or double tap).' },
  { name: 'LightboxZoom scrollToZoom', type: 'boolean', default: 'false', description: 'Zoom with the plain mouse wheel; otherwise only Ctrl + wheel and trackpad pinch zoom.' },
  { name: 'LightboxCounter children', type: '({ current, total }) => ReactNode', description: "Custom text; defaults to '1 / 4'." },
]

function Slides({ photos, scrollToZoom }: { photos: Photo[]; scrollToZoom: boolean }) {
  return (
    <LightboxSlides aria-label="Photos" aria-roledescription="carousel">
      {photos.map((item, index) => (
        <LightboxSlide key={item.id}>
          <LightboxItem
            index={index}
            caption={item.caption}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${photos.length}`}
          >
            <LightboxZoom scrollToZoom={scrollToZoom}>
              <LightboxMedia width={item.width} height={item.height}>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  draggable={false}
                />
              </LightboxMedia>
            </LightboxZoom>
          </LightboxItem>
        </LightboxSlide>
      ))}
    </LightboxSlides>
  )
}

type ChromeProps = { zoomControls: boolean; counter: boolean; navigation?: boolean }

function Chrome({ zoomControls, counter, navigation = true }: ChromeProps) {
  return (
    <>
      <LightboxHeader className={HEADER_CLEARANCE}>
        {zoomControls && (
          <>
            <LightboxZoomOut />
            <LightboxZoomIn />
          </>
        )}
        <LightboxClose />
      </LightboxHeader>
      {navigation && (
        <>
          <LightboxPrevious />
          <LightboxNext />
        </>
      )}
      <LightboxFooter>
        <div className="flex flex-col items-center gap-0.5">
          <LightboxCaption />
          {counter && (
            <LightboxCounter>
              {({ current, total }) => `${current} of ${total}`}
            </LightboxCounter>
          )}
        </div>
      </LightboxFooter>
    </>
  )
}

// The gallery's own top bar (back + theme switch) floats above everything at the
// top right, so the viewer's buttons sit to its left. Not needed in an app.
const HEADER_CLEARANCE = 'pe-36'

const THUMB_CLASS =
  'block h-auto w-full rounded-[inherit] outline -outline-offset-1 outline-foreground/10'

function GridDemo(props: ChromeProps & { scrollToZoom: boolean }) {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
        {GRID_PHOTOS.map((item, index) => (
          <LightboxTrigger
            key={item.id}
            index={index}
            className="aspect-square overflow-hidden rounded-lg"
          >
            {({ imageRef }) => (
              <img
                ref={imageRef}
                className="size-full rounded-[inherit] object-cover outline -outline-offset-1 outline-foreground/10"
                src={item.thumbnail}
                alt={item.alt}
                width={item.width}
                height={item.height}
              />
            )}
          </LightboxTrigger>
        ))}
      </div>
      <LightboxContent aria-label="Photos of Vietnam">
        <Slides photos={GRID_PHOTOS} scrollToZoom={props.scrollToZoom} />
        <Chrome {...props} />
      </LightboxContent>
    </Lightbox>
  )
}

function SingleDemo({ zoomControls, scrollToZoom }: ChromeProps & { scrollToZoom: boolean }) {
  return (
    <Lightbox>
      <figure className="w-full max-w-xs">
        <LightboxTrigger index={0} className="w-full overflow-hidden rounded-xl">
          {({ imageRef }) => (
            <img
              ref={imageRef}
              className={THUMB_CLASS}
              src={SINGLE.src}
              alt={SINGLE.alt}
              width={SINGLE.width}
              height={SINGLE.height}
            />
          )}
        </LightboxTrigger>
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {SINGLE.caption}
        </figcaption>
      </figure>
      <LightboxContent aria-label={SINGLE.caption}>
        <LightboxSlides>
          <LightboxSlide>
            <LightboxItem index={0} caption={SINGLE.caption}>
              <LightboxZoom maxZoom={4} scrollToZoom={scrollToZoom}>
                <LightboxMedia width={SINGLE.width} height={SINGLE.height}>
                  <img
                    src={SINGLE.src}
                    alt={SINGLE.alt}
                    width={SINGLE.width}
                    height={SINGLE.height}
                    draggable={false}
                  />
                </LightboxMedia>
              </LightboxZoom>
            </LightboxItem>
          </LightboxSlide>
        </LightboxSlides>
        <Chrome zoomControls={zoomControls} counter={false} navigation={false} />
      </LightboxContent>
    </Lightbox>
  )
}

function ThumbnailsDemo({ zoomControls, counter, scrollToZoom }: ChromeProps & { scrollToZoom: boolean }) {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-3">
        {PHOTOS.map((item, index) => (
          <LightboxTrigger
            key={item.id}
            index={index}
            className={cn('overflow-hidden rounded-lg', index === 0 && 'col-span-2 sm:col-span-3')}
          >
            {({ imageRef }) => (
              <img
                ref={imageRef}
                className={THUMB_CLASS}
                // The wide cover tile needs the full-size image to stay sharp.
                src={index === 0 ? item.src : item.thumbnail}
                alt={item.alt}
                width={item.width}
                height={item.height}
              />
            )}
          </LightboxTrigger>
        ))}
      </div>
      <LightboxContent aria-label="Photos of Vietnam">
        <Slides photos={PHOTOS} scrollToZoom={scrollToZoom} />
        <LightboxHeader className={HEADER_CLEARANCE}>
          {zoomControls && (
            <>
              <LightboxZoomOut />
              <LightboxZoomIn />
            </>
          )}
          <LightboxClose />
        </LightboxHeader>
        <LightboxPrevious />
        <LightboxNext />
        <LightboxFooter>
          <LightboxCaption />
          {counter && <LightboxCounter />}
          <LightboxThumbnailStrip>
            <LightboxThumbnailStripTrack aria-label="Photo thumbnails">
              {PHOTOS.map((item, index) => (
                <LightboxThumbnail key={item.id} index={index}>
                  <img src={item.thumbnail} alt={item.caption} />
                </LightboxThumbnail>
              ))}
            </LightboxThumbnailStripTrack>
          </LightboxThumbnailStrip>
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  )
}

function HandleDemo(props: ChromeProps & { scrollToZoom: boolean }) {
  return (
    <>
      <Button variant="outline" onClick={() => handle.open(0)}>
        <ImagesIcon />
        View {PHOTOS.length} photos
      </Button>
      <Lightbox handle={handle}>
        <LightboxContent aria-label="Photos of Vietnam">
          <Slides photos={PHOTOS} scrollToZoom={props.scrollToZoom} />
          <Chrome {...props} />
        </LightboxContent>
      </Lightbox>
    </>
  )
}

const USAGE_CHILDREN: Record<Variant, string> = {
  Grid: `<LightboxTrigger index={0}>
  {({ imageRef }) => <img ref={imageRef} src={photo.thumbnail} alt={photo.alt} />}
</LightboxTrigger>
<LightboxContent aria-label="Photos">
  <LightboxSlides>
    <LightboxSlide>
      <LightboxItem index={0} caption={photo.caption}>
        <LightboxZoom>
          <LightboxMedia width={2048} height={1152}>
            <img src={photo.src} alt={photo.alt} draggable={false} />
          </LightboxMedia>
        </LightboxZoom>
      </LightboxItem>
    </LightboxSlide>
  </LightboxSlides>
  <LightboxHeader><LightboxClose /></LightboxHeader>
  <LightboxPrevious />
  <LightboxNext />
  <LightboxFooter><LightboxCaption /></LightboxFooter>
</LightboxContent>`,
  Single: `<LightboxTrigger index={0}>
  {({ imageRef }) => <img ref={imageRef} src={image.src} alt={image.alt} />}
</LightboxTrigger>
<LightboxContent aria-label={image.caption}>
  {/* one slide, no previous / next */}
</LightboxContent>`,
  Thumbnails: `<LightboxFooter>
  <LightboxCaption />
  <LightboxThumbnailStrip>
    <LightboxThumbnailStripTrack>
      <LightboxThumbnail index={0}><img src={photo.thumbnail} alt="" /></LightboxThumbnail>
    </LightboxThumbnailStripTrack>
  </LightboxThumbnailStrip>
</LightboxFooter>`,
  Handle: `const handle = createLightboxHandle()

<Button onClick={() => handle.open(0)}>View photos</Button>
<Lightbox handle={handle}>
  <LightboxContent aria-label="Photos">{/* slides */}</LightboxContent>
</Lightbox>`,
}

export function LightboxPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, zoomControls, counter, scrollToZoom } = settings.values
  // Remount on variant change so each demo starts closed.
  const [nonce, setNonce] = useState(0)

  const usage = toUsageSnippet({
    component: 'Lightbox',
    from: '@/components/ui/lightbox',
    imports: [
      'LightboxTrigger',
      'LightboxContent',
      'LightboxSlides',
      'LightboxSlide',
      'LightboxItem',
      'LightboxZoom',
      'LightboxMedia',
      'LightboxHeader',
      'LightboxClose',
      'LightboxPrevious',
      'LightboxNext',
      'LightboxFooter',
      'LightboxCaption',
      ...(variant === 'Thumbnails'
        ? ['LightboxThumbnailStrip', 'LightboxThumbnailStripTrack', 'LightboxThumbnail']
        : []),
      ...(variant === 'Handle' ? ['createLightboxHandle'] : []),
    ],
    props: variant === 'Handle' ? { handle: { expression: 'handle' } } : {},
    children: USAGE_CHILDREN[variant],
  })

  const chrome = { zoomControls, counter, scrollToZoom }

  return (
    <DemoPage
      eyebrow="ui / lightbox"
      title="Lightbox"
      description="Click a photo and it grows out of its thumbnail into a full-screen viewer: swipe or use the arrow keys between slides, pinch, scroll or double-tap to zoom and drag to pan, pull down or press Escape to close, and focus lands back on the thumbnail."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoSwitch
            label="Zoom controls"
            checked={zoomControls}
            onCheckedChange={(next) => settings.set('zoomControls', next)}
          />
          <DemoSwitch
            label="Counter"
            checked={counter}
            onCheckedChange={(next) => settings.set('counter', next)}
          />
          <DemoSwitch
            label="Scroll to zoom"
            checked={scrollToZoom}
            onCheckedChange={(next) => settings.set('scrollToZoom', next)}
          />
          <DemoAction onClick={() => setNonce((current) => current + 1)}>Reset viewer</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/lightbox/', 'public/lightbox/'], usage, props: PROPS }}
    >
      <div key={`${variant}-${nonce}`} className="flex w-full justify-center">
        {variant === 'Grid' && <GridDemo {...chrome} />}
        {variant === 'Single' && <SingleDemo {...chrome} />}
        {variant === 'Thumbnails' && <ThumbnailsDemo {...chrome} />}
        {variant === 'Handle' && <HandleDemo {...chrome} />}
      </div>
    </DemoPage>
  )
}
