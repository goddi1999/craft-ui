import { Fragment } from 'react'

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

import { ProgressiveBlur } from './ProgressiveBlur'
import { ProgressiveBlurScroller } from './ProgressiveBlurScroller'
import type {
  ProgressiveBlurEdges,
  ProgressiveBlurIntensity,
  ProgressiveBlurSize,
} from './progressive-blur.types'

const SIZES: ProgressiveBlurSize[] = ['sm', 'default', 'lg']
const INTENSITIES: ProgressiveBlurIntensity[] = ['subtle', 'default', 'strong']
const EDGES: ProgressiveBlurEdges[] = ['top', 'bottom', 'both']

const PARAGRAPHS = [
  'As you scroll a container, animate its progressive blur masking composited with intersect.',
  'To tighten up the backdrop-filter blur, combine it with contrast and brightness so the frosted edge keeps its bite instead of turning to milk.',
  'Each layer blurs a little less than the one beneath it, but masks a little further down the band. Stack five of them and the ramp reads as continuous rather than stepped.',
  'The bands themselves ride the scroller’s own scroll-timeline, so the top edge drops into place as soon as content passes under it and the bottom edge clears out as you reach the end.',
  'Nothing here is driven by JavaScript. The scroll position is a timeline, the timeline drives a translate, and the blur is pure CSS.',
  'Resize the frame and the whole thing re-derives itself from the container, because every measurement is relative to the band height rather than a fixed pixel value.',
]

/** Photos between paragraphs, so the blur has colour to work on. */
const PHOTO_AFTER: Record<number, (typeof DEMO_IMAGES)[number]> = {
  1: DEMO_IMAGES[0],
  3: DEMO_IMAGES[3],
  4: DEMO_IMAGES[14],
}

const DEFAULTS = {
  size: 'default' as ProgressiveBlurSize,
  intensity: 'default' as ProgressiveBlurIntensity,
  edges: 'both' as ProgressiveBlurEdges,
  layers: 5,
  accentHue: 164,
  resizable: true,
  debug: false,
}

const COMPONENT_DEFAULTS = { ...DEFAULTS, resizable: false }

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Height of each blur band: 48, 80 or 120px.',
  },
  {
    name: 'intensity',
    type: "'subtle' | 'default' | 'strong'",
    default: "'default'",
    description: 'Blur radius, brightness and contrast together.',
  },
  {
    name: 'edges',
    type: "'top' | 'bottom' | 'both'",
    default: "'both'",
    description: 'Which edges of the scroller get a blur band.',
  },
  {
    name: 'layers',
    type: 'number',
    default: '5',
    description: 'Stacked backdrop-filter layers per band — more is a smoother ramp.',
  },
  {
    name: 'accentHue',
    type: 'number',
    default: '164',
    description: 'Hue of the scrollbar and text selection.',
  },
  {
    name: 'resizable',
    type: 'boolean',
    default: 'false',
    description: 'Let the reader drag the frame to any size.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Outline the blur bands so their travel is visible.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Give the frame its size here — it fills whatever box you set.',
  },
]

export function ProgressiveBlurPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, intensity, edges, layers, accentHue, resizable, debug } =
    settings.values

  const usage = toUsageSnippet({
    component: 'ProgressiveBlur',
    from: '@/components/shared/progressive-blur',
    imports: ['ProgressiveBlurScroller'],
    props: {
      size,
      intensity,
      edges,
      layers,
      accentHue,
      resizable,
      debug,
      className: 'aspect-[3/4] w-[36ch] max-w-full',
    },
    defaults: COMPONENT_DEFAULTS,
    children: `<ProgressiveBlurScroller>
  <article>…</article>
</ProgressiveBlurScroller>`,
  })

  return (
    <DemoPage
      eyebrow="shared / progressive-blur"
      title="Scroll-driven progressive blur"
      description={
        <>
          Stacked <code>backdrop-filter</code> layers with staggered masks
          composited using <code>intersect</code>, sliding in and out on the
          scroller&apos;s own scroll-timeline. Scroll inside the frame. Ported
          from{' '}
          <a href="https://codepen.io/jh3y/pen/eYqyzmM" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Intensity"
            options={INTENSITIES}
            value={intensity}
            onChange={(value) => settings.set('intensity', value)}
          />
          <DemoControlGroup
            title="Edges"
            options={EDGES}
            value={edges}
            onChange={(value) => settings.set('edges', value)}
          />
          <DemoSlider
            label="Layers"
            value={layers}
            onValueChange={(value) => settings.set('layers', value)}
            min={1}
            max={10}
          />
          <DemoSlider
            label="Accent hue"
            value={accentHue}
            onValueChange={(value) => settings.set('accentHue', value)}
            min={0}
            max={360}
            unit="°"
          />
          <DemoSwitch
            label="Resizable"
            checked={resizable}
            onCheckedChange={(value) => settings.set('resizable', value)}
          />
          <DemoSwitch
            label="Debug bands"
            checked={debug}
            onCheckedChange={(value) => settings.set('debug', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/progressive-blur/'],
        usage,
        props: PROPS,
      }}
    >
      <div data-slot="progressive-blur-stage">
        <ProgressiveBlur
          size={size}
          intensity={intensity}
          edges={edges}
          layers={layers}
          accentHue={accentHue}
          resizable={resizable}
          debug={debug}
          className="aspect-[3/4] w-[36ch] max-w-full"
        >
          <ProgressiveBlurScroller>
            <article className="flex flex-col gap-4">
              <h2 className="relative inline-block self-start text-2xl font-semibold">
                Scroll Blurring
                <span className="absolute bottom-1/2 left-[calc(100%+0.25ch)] text-[0.5em] text-[var(--progressive-blur-accent)]">
                  PRO
                </span>
              </h2>
              {PARAGRAPHS.map((copy, index) => (
                <Fragment key={copy}>
                  <p
                    className={
                      index < 2
                        ? 'leading-tight font-semibold text-pretty'
                        : 'font-light opacity-90'
                    }
                  >
                    {copy}
                  </p>
                  {PHOTO_AFTER[index] ? (
                    <img
                      src={PHOTO_AFTER[index].src}
                      alt={PHOTO_AFTER[index].alt}
                      loading="lazy"
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  ) : null}
                </Fragment>
              ))}
            </article>
          </ProgressiveBlurScroller>
        </ProgressiveBlur>
      </div>
    </DemoPage>
  )
}
