import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'

import { ProductSpotlight } from './ProductSpotlight'
import { ProductSpotlightBody } from './ProductSpotlightBody'
import {
  ProductSpotlightCard,
  ProductSpotlightStack,
} from './ProductSpotlightCard'
import {
  ProductSpotlightCarousel,
  ProductSpotlightSlide,
} from './ProductSpotlightCarousel'
import { SpotlightPointerProvider } from './SpotlightPointerProvider'
import { SPOTLIGHT_PRESETS } from './depth-spotlight-presets'
import type { ProductSpotlightPreset } from './product-spotlight.types'

// Vendored under public/ rather than hotlinked: the CodePen CDN 403s
// off-site requests, and the depth map must load for the shader to run.
const ASSET = '/product-spotlight'

const VIEWS = [
  { id: 'front', src: `${ASSET}/volar-nimbus-4s.png` },
  { id: 'side', src: `${ASSET}/volar-nimbus-4s-side.png` },
  { id: 'under', src: `${ASSET}/volar-nimbus-4s-under.png` },
  { id: 'top', src: `${ASSET}/volar-nimbus-4s-top.png` },
].map((view) => ({
  ...view,
  depth: view.src.replace('.png', '-depth.png'),
}))

const PRESETS = Object.keys(SPOTLIGHT_PRESETS) as ProductSpotlightPreset[]

export function ProductSpotlightPage() {
  const [preset, setPreset] = useState<ProductSpotlightPreset>('default')
  const [reveal, setReveal] = useState(false)

  return (
    <div data-slot="product-spotlight-stage">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
            shared / product-spotlight
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Product spotlight cards
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
            A greyscale depth map turns a flat product photo into a lit surface:
            the depth gradient gives normals, a short ray march toward the
            cursor gives contact shadows, and every card on the page shares one
            WebGL context. Ported from{' '}
            <a
              href="https://codepen.io/jh3y/pen/gbLMWYv"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              jh3y&apos;s CodePen
            </a>
            .
          </p>
        </header>

        <section className="flex flex-col items-center gap-12">
          <ProductSpotlightStack reveal={reveal}>
            <ProductSpotlightCard variant="blueprint">
              <ProductSpotlightCarousel inert label="Depth maps">
                {VIEWS.map((view, index) => (
                  <ProductSpotlightSlide key={view.id} index={index}>
                    <img src={view.depth} alt="" />
                  </ProductSpotlightSlide>
                ))}
              </ProductSpotlightCarousel>
              <ProductSpotlightBody
                brand="Volar"
                name="Nimbus 4s"
                price="$189"
                tabIndex={-1}
              />
            </ProductSpotlightCard>

            <ProductSpotlightCard>
              <SpotlightPointerProvider
                hoverDelay={SPOTLIGHT_PRESETS[preset].hoverDelay}
              >
                <ProductSpotlightCarousel label="Product views">
                  {VIEWS.map((view, index) => (
                    <ProductSpotlightSlide key={view.id} index={index}>
                      <ProductSpotlight
                        src={view.src}
                        depth={view.depth}
                        preset={preset}
                        alt={`Volar Nimbus 4s, ${view.id} view`}
                      />
                    </ProductSpotlightSlide>
                  ))}
                </ProductSpotlightCarousel>
              </SpotlightPointerProvider>
              <ProductSpotlightBody
                brand="Volar"
                name="Nimbus 4s"
                price="$189"
              />
            </ProductSpotlightCard>
          </ProductSpotlightStack>

          <DemoPanel>
            <DemoControlGroup
              title="lighting preset"
              options={PRESETS}
              value={preset}
              onChange={setPreset}
            />
            <DemoToggleRow>
              <DemoToggle
                label="reveal depth maps"
                pressed={reveal}
                onPressedChange={setReveal}
              />
            </DemoToggleRow>
            <p className="text-xs opacity-60">
              Hover the card to move the light. Drag or use the markers to
              change view — every slide is lit from the same cursor.
            </p>
          </DemoPanel>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] opacity-50">
            Presets
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {PRESETS.map((variantPreset) => (
              <li
                key={variantPreset}
                className="flex flex-col items-center gap-3 rounded-xl border border-current/10 p-4"
              >
                <div className="w-full overflow-hidden rounded-2xl">
                  <ProductSpotlight
                    src={VIEWS[0].src}
                    depth={VIEWS[0].depth}
                    preset={variantPreset}
                    alt={`Volar Nimbus 4s lit with the ${variantPreset} preset`}
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.16em] opacity-50">
                  {variantPreset}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
