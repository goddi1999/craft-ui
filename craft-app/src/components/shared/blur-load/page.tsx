import {
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  BlurLoadComparison,
  BLUR_LOAD_DEFAULT_BLUR,
  BLUR_LOAD_DEFAULT_DURATION_MS,
} from '@/components/ui/blur-load'

const DEFAULTS = {
  durationMs: BLUR_LOAD_DEFAULT_DURATION_MS,
  blur: BLUR_LOAD_DEFAULT_BLUR,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'src / placeholderSrc / alt',
    type: 'string',
    description:
      'BlurLoad: high-res URL, a tiny placeholder (blurred with a real CSS filter), and accessible alt text.',
  },
  {
    name: 'blur',
    type: 'number',
    default: String(BLUR_LOAD_DEFAULT_BLUR),
    description:
      'Real CSS filter: blur() on the placeholder, in px. The placeholder bleeds 1.5× this past the edges so the box stays solid.',
  },
  {
    name: 'loaded',
    type: 'boolean',
    description:
      'BlurLoad: optional controlled fade. Omit to listen to the img load event.',
  },
  {
    name: 'loading',
    type: "'lazy' | 'eager'",
    default: "'lazy'",
    description: 'BlurLoad: native loading attribute on the high-res image.',
  },
  {
    name: 'images',
    type: 'readonly BlurLoadImage[]',
    default: 'BLUR_LOAD_DEMO_IMAGES',
    description:
      'BlurLoadComparison: scenes for the thumbnail picker; all three panels show the selected one. Defaults to the MacBook Neo set.',
  },
  {
    name: 'defaultView',
    type: "'exploded' | 'flat'",
    default: "'exploded'",
    description:
      'BlurLoadComparison: starting view of the layer stack. Viewers switch with the 3D Layer Stack / Flat Composite tabs or by clicking the stage.',
  },
  {
    name: 'durationMs',
    type: 'number',
    default: String(BLUR_LOAD_DEFAULT_DURATION_MS),
    description: 'BlurLoadComparison: simulated download length for the side-by-side reveal.',
  },
]

export function BlurLoadPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { durationMs, blur } = settings.values

  const usage = toUsageSnippet({
    component: 'BlurLoadComparison',
    from: '@/components/ui/blur-load',
    props: { durationMs, blur },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / blur-load"
      title="Blur Load"
      description="A heavily blurred tiny placeholder, a soft pulse overlay, then a 200ms fade of the high-res image — compared against a blank-box scanline load and a 3-layer stack."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Duration"
            value={durationMs}
            min={600}
            max={5200}
            step={100}
            unit="ms"
            onValueChange={(next) => settings.set('durationMs', next)}
          />
          <DemoSlider
            label="Blur"
            value={blur}
            min={8}
            max={120}
            step={4}
            unit="px"
            onValueChange={(next) => settings.set('blur', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/blur-load/'], usage, props: PROPS }}
    >
      <BlurLoadComparison durationMs={durationMs} blur={blur} className="p-2 sm:p-4" />
    </DemoPage>
  )
}
