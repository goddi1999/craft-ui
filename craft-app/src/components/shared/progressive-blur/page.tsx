import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'

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
const LAYER_COUNTS = [2, 3, 5, 8]

const PARAGRAPHS = [
  'As you scroll a container, animate its progressive blur masking composited with intersect.',
  'To tighten up the backdrop-filter blur, combine it with contrast and brightness so the frosted edge keeps its bite instead of turning to milk.',
  'Each layer blurs a little less than the one beneath it, but masks a little further down the band. Stack five of them and the ramp reads as continuous rather than stepped.',
  'The bands themselves ride the scroller’s own scroll-timeline, so the top edge drops into place as soon as content passes under it and the bottom edge clears out as you reach the end.',
  'Nothing here is driven by JavaScript. The scroll position is a timeline, the timeline drives a translate, and the blur is pure CSS.',
  'Resize the frame and the whole thing re-derives itself from the container, because every measurement is relative to the band height rather than a fixed pixel value.',
]

export function ProgressiveBlurPage() {
  const [size, setSize] = useState<ProgressiveBlurSize>('default')
  const [intensity, setIntensity] = useState<ProgressiveBlurIntensity>('default')
  const [edges, setEdges] = useState<ProgressiveBlurEdges>('both')
  const [layers, setLayers] = useState(5)
  const [resizable, setResizable] = useState(true)
  const [debug, setDebug] = useState(false)

  return (
    <div data-slot="progressive-blur-stage">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
            shared / progressive-blur
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Scroll-driven progressive blur
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
            Stacked <code>backdrop-filter</code> layers with staggered masks
            composited using <code>intersect</code>, sliding in and out on the
            scroller&apos;s own scroll-timeline. Ported from{' '}
            <a
              href="https://codepen.io/jh3y/pen/eYqyzmM"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              jh3y&apos;s CodePen
            </a>
            .
          </p>
        </header>

        <section className="flex flex-col items-center gap-10">
          <ProgressiveBlur
            size={size}
            intensity={intensity}
            edges={edges}
            layers={layers}
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
                  <p
                    key={copy}
                    className={
                      index < 2
                        ? 'text-pretty font-semibold leading-tight'
                        : 'font-light opacity-90'
                    }
                  >
                    {copy}
                  </p>
                ))}
              </article>
            </ProgressiveBlurScroller>
          </ProgressiveBlur>

          <DemoPanel>
            <DemoControlGroup
              title="size"
              options={SIZES}
              value={size}
              onChange={setSize}
            />
            <DemoControlGroup
              title="intensity"
              options={INTENSITIES}
              value={intensity}
              onChange={setIntensity}
            />
            <DemoControlGroup
              title="edges"
              options={EDGES}
              value={edges}
              onChange={setEdges}
            />
            <DemoControlGroup
              title="layers"
              options={LAYER_COUNTS}
              value={layers}
              onChange={setLayers}
            />
            <DemoToggleRow>
              <DemoToggle
                label="resizable"
                pressed={resizable}
                onPressedChange={setResizable}
              />
              <DemoToggle
                label="debug"
                pressed={debug}
                onPressedChange={setDebug}
              />
            </DemoToggleRow>
          </DemoPanel>
        </section>
      </div>
    </div>
  )
}
