import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

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

// Product cut-outs, each with a matching greyscale depth map — the shader
// needs both, so the shared photo set cannot stand in here. Vendored under
// public/ because the CodePen CDN 403s off-site requests.
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

const DEFAULTS = {
  preset: 'default' as ProductSpotlightPreset,
  reveal: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'src',
    type: 'string',
    description: 'Product photo, ideally a cut-out on a plain background. Required.',
  },
  {
    name: 'depth',
    type: 'string',
    description: 'Greyscale depth map matching `src` — lighter is nearer. Required.',
  },
  {
    name: 'preset',
    type: "'default' | 'dramatic' | 'soft' | 'cinematic'",
    default: "'default'",
    description: 'Lighting rig: shadow length, softness, spot size and tracking speed.',
  },
  {
    name: 'alt',
    type: 'string',
    default: "''",
    description: 'Describes the product; empty marks the canvas decorative.',
  },
  {
    name: 'ProductSpotlightStack reveal',
    type: 'boolean',
    default: 'false',
    description: 'Fan the stack apart to expose the blueprint card behind.',
  },
  {
    name: 'ProductSpotlightCard variant',
    type: "'default' | 'blueprint'",
    default: "'default'",
    description: 'The finished card, or the decorative depth-map card behind it.',
  },
  {
    name: 'ProductSpotlightCarousel label',
    type: 'string',
    default: "'Product slides'",
    description: 'Accessible name of the slide markers.',
  },
  {
    name: 'ProductSpotlightCarousel inert',
    type: 'boolean',
    default: 'false',
    description: 'Render the markers without interaction — for the blueprint card.',
  },
  {
    name: 'ProductSpotlightSlide index',
    type: 'number',
    description: 'Position in the carousel, 0-based, wiring it to its marker. Required.',
  },
  {
    name: 'ProductSpotlightBody brand / name / price',
    type: 'string',
    description: 'Copy under the photo. All required.',
  },
  {
    name: 'ProductSpotlightBody href',
    type: 'string',
    default: "'#'",
    description: 'Where the buy arrow links to.',
  },
  {
    name: 'SpotlightPointerProvider hoverDelay',
    type: 'number',
    default: '150',
    description: 'Milliseconds the cursor must linger before the light comes up.',
  },
]

export function ProductSpotlightPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { preset, reveal } = settings.values

  const usage = toUsageSnippet({
    component: 'ProductSpotlightStack',
    from: '@/components/shared/product-spotlight',
    imports: [
      'ProductSpotlightCard',
      'ProductSpotlightCarousel',
      'ProductSpotlightSlide',
      'ProductSpotlight',
      'ProductSpotlightBody',
      'SpotlightPointerProvider',
    ],
    props: { reveal },
    defaults: DEFAULTS,
    children: `<ProductSpotlightCard>
  <SpotlightPointerProvider>
    <ProductSpotlightCarousel label="Product views">
      {views.map((view, index) => (
        <ProductSpotlightSlide key={view.src} index={index}>
          <ProductSpotlight src={view.src} depth={view.depth}${preset === 'default' ? '' : ` preset="${preset}"`} alt={view.alt} />
        </ProductSpotlightSlide>
      ))}
    </ProductSpotlightCarousel>
  </SpotlightPointerProvider>
  <ProductSpotlightBody brand="Volar" name="Nimbus 4s" price="$189" />
</ProductSpotlightCard>`,
  })

  return (
    <DemoPage
      eyebrow="shared / product-spotlight"
      title="Product spotlight cards"
      description={
        <>
          A greyscale depth map turns a flat product photo into a lit surface:
          the depth gradient gives normals, a short ray march toward the cursor
          gives contact shadows, and every card on the page shares one WebGL
          context. Hover to move the light; drag or use the markers to change
          view. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/gbLMWYv" target="_blank" rel="noreferrer">
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
            title="Lighting preset"
            options={PRESETS}
            value={preset}
            onChange={(value) => settings.set('preset', value)}
          />
          <DemoSwitch
            label="Reveal depth maps"
            checked={reveal}
            onCheckedChange={(value) => settings.set('reveal', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/product-spotlight/'],
        usage,
        props: PROPS,
      }}
    >
      <div data-slot="product-spotlight-stage">
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
            <ProductSpotlightBody brand="Volar" name="Nimbus 4s" price="$189" />
          </ProductSpotlightCard>
        </ProductSpotlightStack>
      </div>
    </DemoPage>
  )
}
