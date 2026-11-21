import { DemoSettings, DemoSlider, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { FeatureCarousel, type FeatureCarouselImages } from '@/components/ui/feature-carousel'

const IMAGES: FeatureCarouselImages = {
  alt: 'Feature screenshot',
  step1light1: '/feature-carousel/feature-1.svg',
  step1light2: '/feature-carousel/feature-2.svg',
  step2light1: '/feature-carousel/feature-3.svg',
  step2light2: '/feature-carousel/feature-4.svg',
  step3light: '/feature-carousel/feature-5.svg',
  step4light: '/feature-carousel/feature-1.svg',
}

const CLASSES = {
  step1img1Class:
    'pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50 top-[57%] left-[25%] rounded-[24px] max-md:scale-[160%] max-md:rounded-[24px] md:top-[29%] md:left-[35px] md:group-hover:translate-y-2',
  step1img2Class:
    'pointer-events-none w-[60%] overflow-hidden border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50 top-[53%] left-[69%] rounded-2xl max-md:scale-[160%] max-md:rounded-[24px] md:top-[21%] md:left-[calc(50%+35px+1rem)] md:group-hover:-translate-y-6',
  step2img1Class:
    'pointer-events-none w-[50%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500 dark:border-stone-700 top-[69%] left-[25%] max-md:scale-[160%] md:top-[30%] md:left-[35px] md:group-hover:translate-y-2',
  step2img2Class:
    'pointer-events-none w-[40%] overflow-hidden rounded-2xl rounded-t-[24px] border border-stone-100/10 transition-all duration-500 dark:border-stone-700 top-[53%] left-[70%] max-md:scale-[140%] md:top-[25%] md:left-[calc(50%+27px+1rem)] md:group-hover:-translate-y-6',
  step3imgClass:
    'pointer-events-none w-[90%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500 dark:border-stone-700 top-[50%] left-[5%] md:top-[30%] md:left-[68px]',
  step4imgClass:
    'pointer-events-none w-[90%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500 dark:border-stone-700 top-[50%] left-[5%] md:top-[30%] md:left-[68px]',
}

const TITLE = 'Interactive Feature Demo'
const DESCRIPTION = 'Showcase your features with smooth animations and transitions'
const BG_CLASS = 'bg-gradient-to-tr from-neutral-900/90 to-neutral-800/90'

const DEFAULTS = { interval: 3000 }

const PROPS: DemoPropDoc[] = [
  { name: 'title', type: 'string', description: 'Accessible name of the carousel (screen-reader text).' },
  { name: 'description', type: 'string', description: 'Accessible description (screen-reader text).' },
  {
    name: 'image',
    type: 'FeatureCarouselImages',
    description: 'step1light1/2, step2light1/2, step3light, step4light image URLs plus alt.',
  },
  {
    name: 'step1img1Class … step4imgClass',
    type: 'string',
    description: 'Position and size classes for each step image (replace the defaults).',
  },
  { name: 'bgClass', type: 'string', description: 'Background classes for the card surface.' },
  { name: 'interval', type: 'number', default: '3000', description: 'Milliseconds between automatic steps.' },
  { name: 'className', type: 'string', description: 'Merged onto the outer wrapper.' },
]

export function FeatureCarouselPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { interval } = settings.values
  const usage = toUsageSnippet({
    component: 'FeatureCarousel',
    from: '@/components/ui/feature-carousel',
    props: { title: TITLE, description: DESCRIPTION, bgClass: BG_CLASS, interval },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / feature-carousel"
      title="Feature Carousel"
      description="A four-step feature showcase that auto-advances every few seconds, springing screenshots in and out while a cursor-following glow traces the card edge. Click to skip ahead. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Interval"
            value={interval}
            onValueChange={(next) => settings.set('interval', next)}
            min={1500}
            max={6000}
            step={250}
            unit="ms"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/feature-carousel/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-4xl rounded-[34px] bg-neutral-700 p-2">
        <div className="relative z-10 grid w-full gap-8 rounded-[28px] bg-neutral-950 p-2">
          <FeatureCarousel
            title={TITLE}
            description={DESCRIPTION}
            image={IMAGES}
            bgClass={BG_CLASS}
            interval={interval}
            className="text-neutral-50"
            {...CLASSES}
          />
        </div>
      </div>
    </DemoPage>
  )
}
