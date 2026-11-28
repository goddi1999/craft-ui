import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Card } from '@/components/ui/card'
import {
  GlowProgress,
  type GlowProgressSize,
  type GlowProgressTone,
} from '@/components/ui/glow-progress'

const TONES: readonly GlowProgressTone[] = ['lime', 'orange', 'sky', 'violet']
const SIZES: readonly GlowProgressSize[] = ['sm', 'md', 'lg']
const LESSONS_PER_LEVEL = 10
const START_LEVEL = 5
const START_LESSONS = 3

const DEFAULTS = {
  tone: 'lime' as GlowProgressTone,
  size: 'lg' as GlowProgressSize,
  sparkle: true,
}

const COMPONENT_DEFAULTS = { max: 100, tone: 'lime', size: 'md', sparkle: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    default: '0',
    description: 'Current progress, clamped between 0 and `max`. The fill eases to each new value.',
  },
  { name: 'max', type: 'number', default: '100', description: 'Value that counts as complete.' },
  {
    name: 'tone',
    type: "'lime' | 'orange' | 'sky' | 'violet'",
    default: "'lime'",
    description: 'Fill gradient and the colour of the halo around the sparkle.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Bar height of 10, 18 or 28px. Highlight, sparkle and halo scale with it.',
  },
  {
    name: 'sparkle',
    type: 'boolean',
    default: 'true',
    description: 'Glowing star on the leading edge. Its twinkle stops under reduced motion.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Merged onto the Radix progress root, which keeps its progressbar role and values.',
  },
]

export function GlowProgressPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { tone, size, sparkle } = settings.values
  const [lessons, setLessons] = useState(START_LESSONS)

  const level = START_LEVEL + Math.floor(lessons / LESSONS_PER_LEVEL)
  const lessonsInLevel = lessons % LESSONS_PER_LEVEL
  const percent = (lessonsInLevel / LESSONS_PER_LEVEL) * 100

  const usage = toUsageSnippet({
    component: 'GlowProgress',
    from: '@/components/ui/glow-progress',
    props: { value: { expression: 'progress' }, max: 100, tone, size, sparkle },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / glow-progress"
      title="Glow Progress"
      description="A level-up progress bar built on the Radix progress primitive. A gradient fill with a soft highlight eases to each new value, and a glowing sparkle rides its leading edge."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Tone"
            options={TONES}
            value={tone}
            onChange={(next) => settings.set('tone', next)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoSwitch
            label="Sparkle"
            checked={sparkle}
            onCheckedChange={(next) => settings.set('sparkle', next)}
          />
          <DemoAction onClick={() => setLessons((value) => value + 1)}>Finish a lesson</DemoAction>
          <DemoAction
            onClick={() => setLessons(START_LESSONS)}
            disabled={lessons === START_LESSONS}
          >
            Start over
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/glow-progress/'], usage, props: PROPS }}
    >
      <Card className="w-full max-w-lg items-center gap-7 px-6 py-8 text-center">
        <div className="flex w-full items-center gap-4">
          <span className="w-6 text-xl font-bold tabular-nums">{level}</span>
          <GlowProgress
            value={percent}
            tone={tone}
            size={size}
            sparkle={sparkle}
            aria-label={`Progress to level ${level + 1}`}
          />
          <span className="w-6 text-xl font-bold tabular-nums">{level + 1}</span>
        </div>
        <p className="text-muted-foreground text-balance">
          You finished {lessonsInLevel} of {LESSONS_PER_LEVEL} lessons on this level. Keep going!
        </p>
      </Card>
    </DemoPage>
  )
}
