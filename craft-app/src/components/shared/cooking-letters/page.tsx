import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { CookingLetters } from '@/components/ui/cooking-letters'

const DEFAULTS = {
  duration: 2.2,
  debug: false,
  scrub: false,
  progress: 0,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'lines',
    type: 'readonly string[]',
    default: 'COOKING_LETTERS_LINES',
    description: 'One paragraph per entry; each character becomes a rolling cube.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '2.2',
    description: 'Seconds for one roll cycle.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Tilt the stage in 3D and isolate one line to show how the cubes work.',
  },
  {
    name: 'scrub',
    type: 'boolean',
    default: 'false',
    description: 'In debug mode, drive the roll with `progress` instead of looping.',
  },
  {
    name: 'progress',
    type: 'number',
    default: '0',
    description: 'Manual roll position (0–100), used when `debug` and `scrub` are on.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root column of lines.',
  },
]

export function CookingLettersPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { duration, debug, scrub, progress } = settings.values
  const scrubbing = debug && scrub

  const usage = toUsageSnippet({
    component: 'CookingLetters',
    from: '@/components/ui/cooking-letters',
    props: {
      duration,
      debug,
      scrub: debug ? scrub : undefined,
      progress: scrubbing ? progress : undefined,
    },
    defaults: DEFAULTS,
  })

  const handleDebugChange = (next: boolean) => {
    settings.set('debug', next)
    if (!next) settings.set('scrub', false)
  }

  return (
    <DemoPage
      eyebrow="ui / cooking-letters"
      title="Cooking Letters"
      description="Every letter is a tiny CSS cube that rolls over in a sine-staggered wave — flip on debug to tilt the stage and scrub a line."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={0.8}
            max={5}
            step={0.1}
            unit="s"
          />
          <DemoSwitch
            label="Debug"
            checked={debug}
            onCheckedChange={handleDebugChange}
          />
          {debug ? (
            <DemoSwitch
              label="Scrub"
              checked={scrub}
              onCheckedChange={(value) => settings.set('scrub', value)}
            />
          ) : null}
          {scrubbing ? (
            <DemoSlider
              label="Progress"
              value={progress}
              onValueChange={(value) => settings.set('progress', value)}
              min={0}
              max={100}
            />
          ) : null}
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/cooking-letters/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="grid w-full place-items-center overflow-hidden py-6">
        <CookingLetters
          duration={duration}
          debug={debug}
          scrub={scrub}
          progress={progress}
        />
      </div>
    </DemoPage>
  )
}
