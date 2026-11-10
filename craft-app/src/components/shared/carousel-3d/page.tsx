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

import { Carousel3D } from './Carousel3D'
import { Carousel3DCard } from './Carousel3DCard'
import { Carousel3DRing } from './Carousel3DRing'
import type {
  Carousel3DDepth,
  Carousel3DSize,
  Carousel3DSpeed,
} from './carousel-3d.types'

/** The ring reads best with up to 12 cards. */
const CARDS = DEMO_IMAGES.slice(0, 12)

const SIZES: Carousel3DSize[] = ['sm', 'default', 'lg']
const SPEEDS: Carousel3DSpeed[] = ['slow', 'default', 'fast']
const DEPTHS: Carousel3DDepth[] = ['subtle', 'default', 'extreme']

const DEFAULTS = {
  count: 12,
  size: 'default' as Carousel3DSize,
  speed: 'default' as Carousel3DSpeed,
  depth: 'default' as Carousel3DDepth,
  paused: false,
  fade: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Card width. The carousel grows tall enough to fit it.',
  },
  {
    name: 'speed',
    type: "'slow' | 'default' | 'fast'",
    default: "'default'",
    description: 'One full turn in 64s, 32s or 16s.',
  },
  {
    name: 'depth',
    type: "'subtle' | 'default' | 'extreme'",
    default: "'default'",
    description: 'Perspective strength — extreme foreshortens the most.',
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freeze the rotation.',
  },
  {
    name: 'fade',
    type: 'boolean',
    default: 'true',
    description: 'Fade the left and right edges instead of clipping cards.',
  },
  {
    name: 'Carousel3DRing count',
    type: 'number',
    default: 'children count',
    description: 'Cards around the ring; each one takes 1/count of a turn.',
  },
  {
    name: 'Carousel3DCard index',
    type: 'number',
    description: 'Position on the ring, 0-based. Required.',
  },
]

export function Carousel3DPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, size, speed, depth, paused, fade } = settings.values
  const cards = CARDS.slice(0, count)

  const usage = toUsageSnippet({
    component: 'Carousel3D',
    from: '@/components/shared/carousel-3d',
    imports: ['Carousel3DRing', 'Carousel3DCard'],
    props: { size, speed, depth, paused, fade },
    defaults: DEFAULTS,
    children: `<Carousel3DRing>
  {photos.map((src, index) => (
    <Carousel3DCard key={src} index={index} src={src} alt="" />
  ))}
</Carousel3DRing>`,
  })

  return (
    <DemoPage
      eyebrow="shared / carousel-3d"
      title="Pure CSS 3D Carousel"
      description={
        <>
          Cards stack in one grid cell, then each rotates around the Y axis by
          its share of a full turn and pushes back by the ring radius — no
          JavaScript drives the motion. Ported from{' '}
          <a href="https://codepen.io/thebabydino/pen/dPXVyqN" target="_blank" rel="noreferrer">
            Ana Tudor&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Cards"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={4}
            max={CARDS.length}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Speed"
            options={SPEEDS}
            value={speed}
            onChange={(value) => settings.set('speed', value)}
          />
          <DemoControlGroup
            title="Depth"
            options={DEPTHS}
            value={depth}
            onChange={(value) => settings.set('depth', value)}
          />
          <DemoSwitch
            label="Paused"
            checked={paused}
            onCheckedChange={(value) => settings.set('paused', value)}
          />
          <DemoSwitch
            label="Fade edges"
            checked={fade}
            onCheckedChange={(value) => settings.set('fade', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/carousel-3d/'],
        usage,
        props: PROPS,
      }}
    >
      <Carousel3D
        size={size}
        speed={speed}
        depth={depth}
        paused={paused}
        fade={fade}
        className="w-full"
      >
        <Carousel3DRing>
          {cards.map((card, index) => (
            <Carousel3DCard
              key={card.src}
              index={index}
              src={card.src}
              alt={card.alt}
            />
          ))}
        </Carousel3DRing>
      </Carousel3D>
    </DemoPage>
  )
}
