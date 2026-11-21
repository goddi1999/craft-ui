import { Sparkles } from 'lucide-react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  LoadingCarousel,
  type LoadingCarouselAspectRatio,
  type LoadingCarouselTextPosition,
} from '@/components/ui/loading-carousel'

const ASPECTS: LoadingCarouselAspectRatio[] = ['video', 'wide', 'square']
const POSITIONS: LoadingCarouselTextPosition[] = ['bottom', 'top']

const DEFAULTS = {
  aspectRatio: 'video' as LoadingCarouselAspectRatio,
  textPosition: 'bottom' as LoadingCarouselTextPosition,
  showIndicators: true,
  showNavigation: false,
  showProgress: true,
  backgroundTips: false,
  backgroundGradient: false,
  shuffleTips: false,
  autoplayInterval: 4500,
}

type Settings = typeof DEFAULTS

const PRESETS: { label: string; values: Partial<Settings> }[] = [
  { label: 'Default', values: {} },
  { label: 'Wide, top text', values: { aspectRatio: 'wide', textPosition: 'top', showIndicators: false } },
  { label: 'Background tips', values: { aspectRatio: 'wide', backgroundTips: true, backgroundGradient: true } },
  { label: '2s + navigation', values: { autoplayInterval: 2000, showNavigation: true } },
  { label: 'Shuffled 3s', values: { shuffleTips: true, autoplayInterval: 3000, showProgress: false } },
  { label: 'Square background', values: { aspectRatio: 'square', backgroundTips: true, backgroundGradient: true } },
]

type BooleanKey =
  | 'showIndicators'
  | 'showNavigation'
  | 'showProgress'
  | 'backgroundTips'
  | 'backgroundGradient'
  | 'shuffleTips'

const SWITCHES: { key: BooleanKey; label: string }[] = [
  { key: 'showIndicators', label: 'Indicators' },
  { key: 'showNavigation', label: 'Navigation' },
  { key: 'showProgress', label: 'Progress' },
  { key: 'backgroundTips', label: 'Background tips' },
  { key: 'backgroundGradient', label: 'Background gradient' },
  { key: 'shuffleTips', label: 'Shuffle tips' },
]

const PROPS: DemoPropDoc[] = [
  { name: 'tips', type: 'LoadingTip[]', default: 'DEFAULT_TIPS', description: '{ text, background, url? } per slide; background is any CSS background value.' },
  { name: 'aspectRatio', type: "'video' | 'wide' | 'square'", default: "'video'", description: 'Slide shape.' },
  { name: 'textPosition', type: "'top' | 'bottom'", default: "'bottom'", description: 'Where the tip text sits.' },
  { name: 'showIndicators', type: 'boolean', default: 'true', description: 'One clickable bar per tip.' },
  { name: 'showNavigation', type: 'boolean', default: 'false', description: 'Previous / next buttons.' },
  { name: 'showProgress', type: 'boolean', default: 'true', description: 'Fill the active bar over the interval.' },
  { name: 'backgroundTips', type: 'boolean', default: 'false', description: 'Draw the tip text over the slide.' },
  { name: 'backgroundGradient', type: 'boolean', default: 'false', description: 'Darken the slide bottom for legibility.' },
  { name: 'shuffleTips', type: 'boolean', default: 'false', description: 'Shuffle tip order once on mount.' },
  { name: 'autoplayInterval', type: 'number', default: '4500', description: 'Milliseconds per tip. Pauses on hover and focus.' },
  { name: 'onTipChange', type: '(index: number) => void', description: 'Called when the visible tip changes.' },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function LoadingCarouselPage() {
  const settings = useDemoSettings(DEFAULTS)
  const values = settings.values
  const usage = toUsageSnippet({
    component: 'LoadingCarousel',
    from: '@/components/ui/loading-carousel',
    props: values,
    defaults: DEFAULTS,
  })

  const handlePreset = (preset: Partial<Settings>) => {
    settings.reset()
    for (const key of Object.keys(preset) as (keyof Settings)[]) {
      settings.set(key, preset[key] as never)
    }
  }

  // Remount when shuffle changes so the new order is drawn.
  const carouselKey = `${values.shuffleTips}`

  return (
    <DemoPage
      eyebrow="ui / loading-carousel"
      title="Loading Carousel"
      description="A rotating carousel of loading tips with a progress bar per tip. Autoplays, pauses on hover or focus, and slides between gradient backgrounds. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          {PRESETS.map((preset) => (
            <DemoAction key={preset.label} onClick={() => handlePreset(preset.values)}>
              <Sparkles className="size-4" aria-hidden /> {preset.label}
            </DemoAction>
          ))}
          <DemoControlGroup
            title="Aspect ratio"
            options={ASPECTS}
            value={values.aspectRatio}
            onChange={(next) => settings.set('aspectRatio', next)}
          />
          <DemoControlGroup
            title="Text position"
            options={POSITIONS}
            value={values.textPosition}
            onChange={(next) => settings.set('textPosition', next)}
          />
          {SWITCHES.map(({ key, label }) => (
            <DemoSwitch
              key={key}
              label={label}
              checked={values[key]}
              onCheckedChange={(next) => settings.set(key, next)}
            />
          ))}
          <DemoSlider
            label="Interval"
            value={values.autoplayInterval}
            onValueChange={(next) => settings.set('autoplayInterval', next)}
            min={1500}
            max={8000}
            step={250}
            unit="ms"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/loading-carousel/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-3xl">
        <LoadingCarousel key={carouselKey} {...values} />
      </div>
    </DemoPage>
  )
}
