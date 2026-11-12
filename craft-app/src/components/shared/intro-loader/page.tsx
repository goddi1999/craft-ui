import { useState } from 'react'

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
import { IntroLoader, type GreetingItem } from '@/components/ui/intro-loader'

const GREETING_SETS = ['world', 'europe', 'asia'] as const
type GreetingSet = (typeof GREETING_SETS)[number]

// world keeps the built-in greetings
const GREETINGS: Record<GreetingSet, GreetingItem[] | undefined> = {
  world: undefined,
  europe: [
    { text: 'Hello', lang: 'EN' },
    { text: 'Hallo', lang: 'DE' },
    { text: 'Bonjour', lang: 'FR' },
    { text: 'Hola', lang: 'ES' },
    { text: 'Ciao', lang: 'IT' },
    { text: 'Olá', lang: 'PT' },
    { text: 'Hej', lang: 'SV' },
  ],
  asia: [
    { text: 'こんにちは', lang: 'JA' },
    { text: '你好', lang: 'ZH' },
    { text: '안녕하세요', lang: 'KO' },
    { text: 'नमस्ते', lang: 'HI' },
    { text: 'สวัสดี', lang: 'TH' },
    { text: 'Xin chào', lang: 'VI' },
  ],
}

const DEFAULTS = {
  greetings: 'world' as GreetingSet,
  intervalMs: 240,
  speedMultiplier: 1,
  showProgress: true,
  showLangBadge: true,
  allowSkip: true,
}

const COMPONENT_DEFAULTS = {
  intervalMs: 240,
  speedMultiplier: 1,
  showProgress: true,
  showLangBadge: true,
  allowSkip: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'greetings',
    type: '(string | { text: string; lang?: string })[]',
    default: 'six languages',
    description:
      'Greetings to cycle through. `lang` fills the badge and the `lang` attribute, so screen readers pronounce each one.',
  },
  {
    name: 'onComplete',
    type: '() => void',
    description: 'Called once the last greeting has lingered, or on Skip and Escape.',
  },
  {
    name: 'fullScreen',
    type: 'boolean',
    default: 'true',
    description:
      'A fixed overlay over the page. False plays in an inline box and leaves a Replay button.',
  },
  {
    name: 'intervalMs',
    type: 'number',
    default: '240',
    description: 'Milliseconds each greeting holds before the speed is applied. Never under 100.',
  },
  {
    name: 'speedMultiplier',
    type: 'number',
    default: '1',
    description: 'Divides every hold, including the last; 2 plays twice as fast.',
  },
  {
    name: 'showProgress',
    type: 'boolean',
    default: 'true',
    description: 'The hairline progress bar.',
  },
  {
    name: 'showLangBadge',
    type: 'boolean',
    default: 'true',
    description: 'The language code beside each greeting that has one.',
  },
  {
    name: 'allowSkip',
    type: 'boolean',
    default: 'true',
    description: 'Show the Skip button and end the intro on Escape.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the overlay, or the inline box.' },
]

export function IntroLoaderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { greetings, intervalMs, speedMultiplier, showProgress, showLangBadge, allowSkip } =
    settings.values
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'IntroLoader',
    from: '@/components/ui/intro-loader',
    props: {
      greetings: GREETINGS[greetings] && { expression: 'greetings' },
      intervalMs,
      speedMultiplier,
      showProgress,
      showLangBadge,
      allowSkip,
      onComplete: { expression: '() => setReady(true)' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / intro-loader"
      title="Intro Loader"
      description="An Apple-style welcome splash. Greetings in many languages blur in one after another, a hairline tracks the progress, and Skip or Escape ends it early. It covers the screen by default; here it plays inline and leaves a Replay button behind. Reduced motion skips straight to a fade. Adapted from EasyUI."
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Greetings"
            options={GREETING_SETS}
            value={greetings}
            onChange={(next) => settings.set('greetings', next)}
          />
          <DemoSlider
            label="Interval"
            value={intervalMs}
            onValueChange={(next) => settings.set('intervalMs', next)}
            min={100}
            max={800}
            step={20}
            unit="ms"
          />
          <DemoSlider
            label="Speed"
            value={speedMultiplier}
            onValueChange={(next) => settings.set('speedMultiplier', next)}
            min={0.5}
            max={2}
            step={0.25}
            unit="×"
          />
          <DemoSwitch
            label="Progress bar"
            checked={showProgress}
            onCheckedChange={(next) => settings.set('showProgress', next)}
          />
          <DemoSwitch
            label="Language badge"
            checked={showLangBadge}
            onCheckedChange={(next) => settings.set('showLangBadge', next)}
          />
          <DemoSwitch
            label="Allow skip"
            checked={allowSkip}
            onCheckedChange={(next) => settings.set('allowSkip', next)}
          />
          <DemoAction onClick={() => setRun((value) => value + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/intro-loader/'], usage, props: PROPS }}
    >
      {/* keyed on every setting too, so a change plays it again from the first greeting */}
      <IntroLoader
        key={`${run}-${JSON.stringify(settings.values)}`}
        fullScreen={false}
        greetings={GREETINGS[greetings]}
        intervalMs={intervalMs}
        speedMultiplier={speedMultiplier}
        showProgress={showProgress}
        showLangBadge={showLangBadge}
        allowSkip={allowSkip}
      />
    </DemoPage>
  )
}
