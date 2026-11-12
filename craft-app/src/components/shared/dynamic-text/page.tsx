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
import { DynamicText, type DynamicTextMode } from '@/components/ui/dynamic-text'

const MODES: readonly DynamicTextMode[] = ['morph', 'decode', 'cycle']
const CONTENTS = ['words', 'status'] as const
type Content = (typeof CONTENTS)[number]

const CONTENT_LABELS: Record<Content, string> = { words: 'Rotating words', status: 'Controlled text' }

// the component's own default per mode, so the slider starts where it would
const INTERVALS: Record<DynamicTextMode, number> = { morph: 2200, decode: 2800, cycle: 900 }

// cycle keeps the built-in greetings
const WORDS: Record<DynamicTextMode, string[] | undefined> = {
  morph: ['Review', 'Revise', 'Release'],
  decode: ['Build 4127 queued', 'Build 4127 ready', 'Deployed to fra1'],
  cycle: undefined,
}

const TEXT = 'text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl'

const STATUSES = ['12 checks running', '3 checks failing', '128 checks passing']

const DEFAULTS = {
  mode: 'morph' as DynamicTextMode,
  content: 'words' as Content,
  interval: INTERVALS.morph,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'mode',
    type: "'morph' | 'decode' | 'cycle'",
    default: "'morph'",
    description:
      'Morph: letters travel, fall and land, digits roll. Decode: monospace cells scramble and lock left to right. Cycle: morph with a greeting rhythm.',
  },
  {
    name: 'text',
    type: 'string',
    description: 'The string to show; change it to animate. Announced politely. When set, `words` is ignored.',
  },
  {
    name: 'words',
    type: '(string | { text: string; lang?: string })[]',
    description: 'Words to rotate through when `text` is not set. `lang` sets pronunciation per word. Defaults depend on the mode.',
  },
  {
    name: 'interval',
    type: 'number',
    default: '2200 · 2800 · 900',
    description: 'Milliseconds each word holds (morph · decode · cycle). In cycle mode the middle words speed up from it.',
  },
  { name: 'loop', type: 'boolean', default: 'true, false in cycle', description: 'Start over after the last word.' },
  { name: 'onComplete', type: '() => void', description: 'Called once the last word shows. Never called when looping.' },
  { name: 'className', type: 'string', description: 'Merged onto the root `<span>`; set the font size here, the motion scales with it.' },
]

export function DynamicTextPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { mode, content, interval } = settings.values
  const [run, setRun] = useState(0)
  const [status, setStatus] = useState(0)
  const isStatus = content === 'status'

  const handleModeChange = (next: DynamicTextMode) => {
    settings.set('mode', next)
    settings.set('interval', INTERVALS[next])
  }

  const usage = toUsageSnippet({
    component: 'DynamicText',
    from: '@/components/ui/dynamic-text',
    props: isStatus
      ? { mode, text: { expression: 'status' } }
      : { mode, words: WORDS[mode] && { expression: 'words' }, interval },
    defaults: { mode: 'morph', interval: INTERVALS[mode] },
  })

  return (
    <DemoPage
      eyebrow="ui / dynamic-text"
      title="Dynamic Text"
      description="Text where letters are physical: shared letters glide to their new place on a low arc, old ones tip and fall off the baseline, new ones drop in and land with a squash, and digits roll like a counter. Decode scrambles and locks cells left to right. Adapted from Kokonut UI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup title="Mode" options={MODES} value={mode} onChange={handleModeChange} />
          <DemoControlGroup
            title="Content"
            options={CONTENTS}
            value={content}
            onChange={(next) => settings.set('content', next)}
            format={(value) => CONTENT_LABELS[value]}
          />
          {!isStatus && (
            <DemoSlider
              label="Interval"
              value={interval}
              onValueChange={(next) => settings.set('interval', next)}
              min={300}
              max={4000}
              step={100}
              unit="ms"
            />
          )}
          {isStatus ? (
            <DemoAction onClick={() => setStatus((value) => (value + 1) % STATUSES.length)}>
              Next status
            </DemoAction>
          ) : (
            <DemoAction onClick={() => setRun((value) => value + 1)}>Replay</DemoAction>
          )}
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/dynamic-text/'], usage, props: PROPS }}
    >
      {isStatus ? (
        <DynamicText
          mode={mode}
          text={STATUSES[status]}
          className={TEXT}
        />
      ) : (
        // keyed so a new mode or Replay starts from the first word
        <DynamicText
          key={`${mode}-${run}`}
          mode={mode}
          words={WORDS[mode]}
          interval={interval}
          className={TEXT}
        />
      )}
    </DemoPage>
  )
}
