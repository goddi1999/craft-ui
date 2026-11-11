import { AnimatePresence } from 'motion/react'
import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  AppleHelloEffectEnglish,
  AppleHelloEffectHindi,
  AppleHelloEffectSpanish,
  AppleHelloEffectVietnamese,
  type AppleHelloEffectLanguage,
} from '@/components/ui/apple-hello-effect'

type Mode = AppleHelloEffectLanguage | 'all'

const MODES: Mode[] = ['english', 'hindi', 'spanish', 'vietnamese', 'all']
const MODE_LABELS: Record<Mode, string> = {
  english: 'English',
  hindi: 'Hindi',
  spanish: 'Spanish',
  vietnamese: 'Vietnamese',
  all: 'All (cycle)',
}

/** Cycle order for "All" mode. */
const CYCLE: AppleHelloEffectLanguage[] = [
  'english',
  'hindi',
  'spanish',
  'vietnamese',
]

const COMPONENTS = {
  english: AppleHelloEffectEnglish,
  hindi: AppleHelloEffectHindi,
  spanish: AppleHelloEffectSpanish,
  vietnamese: AppleHelloEffectVietnamese,
}

const COMPONENT_NAMES: Record<AppleHelloEffectLanguage, string> = {
  english: 'AppleHelloEffectEnglish',
  hindi: 'AppleHelloEffectHindi',
  spanish: 'AppleHelloEffectSpanish',
  vietnamese: 'AppleHelloEffectVietnamese',
}

const DEFAULTS = {
  mode: 'english' as Mode,
  durationScale: 1,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'durationScale',
    type: 'number',
    default: '1 (Hindi 0.8)',
    description:
      'Scales every stroke duration and delay. Below 1 is faster, above 1 slower.',
  },
  {
    name: 'onAnimationComplete',
    type: '() => void',
    description: 'Called when the last stroke finishes drawing.',
  },
  {
    name: 'className',
    type: 'string',
    default: "'h-20'",
    description: 'Sizes the svg; the stroke follows currentColor.',
  },
  {
    name: '...props',
    type: 'motion.svg props',
    description: 'Spread onto the svg, e.g. exit for AnimatePresence.',
  },
]

export function AppleHelloEffectPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { mode, durationScale } = settings.values
  const [replayKey, setReplayKey] = useState(0)
  const [cycleIndex, setCycleIndex] = useState(0)

  const advance = () => setCycleIndex((index) => (index + 1) % CYCLE.length)
  const language = mode === 'all' ? CYCLE[cycleIndex] : mode
  const Hello = COMPONENTS[language]

  const usage = toUsageSnippet({
    component: COMPONENT_NAMES[language],
    from: '@/components/ui/apple-hello-effect',
    props: { durationScale },
    defaults: { durationScale: language === 'hindi' ? 0.8 : 1 },
  })

  return (
    <DemoPage
      eyebrow="ui / apple-hello-effect"
      title="Apple Hello Effect"
      description="Handwritten greeting drawn stroke by stroke, inspired by Apple's Hello screen. Each stroke animates its path length and fades in on its own timing."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Language"
            options={MODES}
            value={mode}
            onChange={(next) => {
              settings.set('mode', next)
              setCycleIndex(0)
            }}
            format={(option) => MODE_LABELS[option]}
          />
          <DemoSlider
            label="Duration scale"
            value={durationScale}
            onValueChange={(next) => settings.set('durationScale', next)}
            min={0.4}
            max={2}
            step={0.1}
            unit="x"
          />
          <DemoAction
            onClick={() => {
              setCycleIndex(0)
              setReplayKey((key) => key + 1)
            }}
          >
            Replay
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/apple-hello-effect/'],
        usage,
        props: PROPS,
      }}
    >
      {/* Remount on replay/slider change so the strokes redraw from zero. */}
      <AnimatePresence mode="wait">
        <Hello
          key={`${replayKey}-${language}-${durationScale}`}
          durationScale={durationScale}
          onAnimationComplete={mode === 'all' ? advance : undefined}
          className="h-24 text-foreground sm:h-32"
        />
      </AnimatePresence>
    </DemoPage>
  )
}
