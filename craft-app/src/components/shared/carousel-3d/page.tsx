import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'

import { Carousel3D } from './Carousel3D'
import { Carousel3DCard } from './Carousel3DCard'
import { Carousel3DRing } from './Carousel3DRing'
import type {
  Carousel3DDepth,
  Carousel3DSize,
  Carousel3DSpeed,
} from './carousel-3d.types'

const PHOTO_IDS = [
  '1540968221243-29f5d70540bf',
  '1596135187959-562c650d98bc',
  '1628944682084-831f35256163',
  '1590013330451-3946e83e0392',
  '1590421959604-741d0eec0a2e',
  '1572613000712-eadc57acbecd',
  '1570097192570-4b49a6736f9f',
  '1620789550663-2b10e0080354',
  '1617775623669-20bff4ffaa5c',
  '1548600916-dc8492f8e845',
  '1573824969595-a76d4365a2e6',
  '1633936929709-59991b5fdd72',
]

const CARDS = PHOTO_IDS.map((id) => ({
  id,
  src: `https://images.unsplash.com/photo-${id}?w=280`,
}))

const SIZES: Carousel3DSize[] = ['sm', 'default', 'lg']
const SPEEDS: Carousel3DSpeed[] = ['slow', 'default', 'fast']
const DEPTHS: Carousel3DDepth[] = ['subtle', 'default', 'extreme']
const COUNTS = [4, 6, 8, 12]

export function Carousel3DPage() {
  const [size, setSize] = useState<Carousel3DSize>('default')
  const [speed, setSpeed] = useState<Carousel3DSpeed>('default')
  const [depth, setDepth] = useState<Carousel3DDepth>('default')
  const [count, setCount] = useState(12)
  const [paused, setPaused] = useState(false)
  const [fade, setFade] = useState(true)

  const cards = CARDS.slice(0, count)

  return (
    <div data-slot="carousel-3d-stage">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
            shared / carousel-3d
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Pure CSS 3D carousel
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
            Cards stack in a single grid cell, then each one rotates around the
            Y axis by its share of a full turn and pushes back along Z by the
            ring radius — no JavaScript drives the motion. Ported from{' '}
            <a
              href="https://codepen.io/thebabydino/pen/dPXVyqN"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              Ana Tudor&apos;s CodePen
            </a>
            .
          </p>
        </header>

        <section className="flex flex-col items-center gap-10">
          <Carousel3D
            size={size}
            speed={speed}
            depth={depth}
            paused={paused}
            fade={fade}
            className="h-[26rem] w-full"
          >
            <Carousel3DRing>
              {cards.map((card, index) => (
                <Carousel3DCard
                  key={card.id}
                  index={index}
                  src={card.src}
                  alt=""
                />
              ))}
            </Carousel3DRing>
          </Carousel3D>

          <DemoPanel>
            <DemoControlGroup
              title="cards"
              options={COUNTS}
              value={count}
              onChange={setCount}
            />
            <DemoControlGroup
              title="size"
              options={SIZES}
              value={size}
              onChange={setSize}
            />
            <DemoControlGroup
              title="speed"
              options={SPEEDS}
              value={speed}
              onChange={setSpeed}
            />
            <DemoControlGroup
              title="depth"
              options={DEPTHS}
              value={depth}
              onChange={setDepth}
            />
            <DemoToggleRow>
              <DemoToggle
                label="paused"
                pressed={paused}
                onPressedChange={setPaused}
              />
              <DemoToggle label="fade" pressed={fade} onPressedChange={setFade} />
            </DemoToggleRow>
          </DemoPanel>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] opacity-50">
            Depth
          </h2>
          <ul className="grid gap-4">
            {DEPTHS.map((variantDepth) => (
              <li
                key={variantDepth}
                className="rounded-xl border border-current/10 p-4"
              >
                <p className="mb-2 text-xs uppercase tracking-[0.16em] opacity-50">
                  {variantDepth}
                </p>
                <Carousel3D
                  size="sm"
                  depth={variantDepth}
                  speed="slow"
                  className="h-56"
                >
                  <Carousel3DRing>
                    {CARDS.slice(0, 8).map((card, index) => (
                      <Carousel3DCard
                        key={card.id}
                        index={index}
                        src={card.src}
                        alt=""
                      />
                    ))}
                  </Carousel3DRing>
                </Carousel3D>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
