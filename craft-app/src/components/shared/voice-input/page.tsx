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
import { VoiceInput } from '@/components/ui/voice-input'

const INPUTS = ['simulated', 'level'] as const
const INPUT_LABELS: Record<(typeof INPUTS)[number], string> = {
  simulated: 'Simulated voice',
  level: 'level prop',
}
const IDLE_CAPTION = 'Click to dictate a prompt'

const DEFAULTS = {
  demo: true,
  input: 'simulated' as (typeof INPUTS)[number],
  level: 60,
}

const COMPONENT_DEFAULTS = { demo: false, idleCaption: 'Click to speak' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'demo',
    type: 'boolean',
    default: 'false',
    description:
      'Loops record, review and send on its own until the first press. Read once on mount.',
  },
  {
    name: 'level',
    type: 'number',
    description:
      'Live input level from 0 to 1, e.g. from your own audio analyser. Omit it for a simulated voice.',
  },
  {
    name: 'idleCaption',
    type: 'string',
    default: "'Click to speak'",
    description: 'Caption under the waveform while idle.',
  },
  {
    name: 'listeningCaption',
    type: 'string',
    default: "'Listening…'",
    description: 'Caption while recording.',
  },
  {
    name: 'onListeningChange',
    type: '(listening: boolean) => void',
    description: 'Called when the user starts or stops recording. Not called by the demo loop.',
  },
  {
    name: 'onStop',
    type: '(duration: number) => void',
    description: "Called with the take's length in seconds when recording stops.",
  },
  {
    name: 'onSend',
    type: '(duration: number) => void',
    description: "Called with the take's length in seconds when the user sends it.",
  },
  { name: 'onDiscard', type: '() => void', description: 'Called when the user throws the take away.' },
  { name: 'className', type: 'string', description: 'Merged onto the root element.' },
]

export function VoiceInputPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { demo, input, level } = settings.values
  // demo is read once on mount, so restarting the loop means remounting
  const [round, setRound] = useState(0)
  const [lastEvent, setLastEvent] = useState('')

  const handleRestart = () => {
    settings.set('demo', true)
    setRound((value) => value + 1)
  }

  const usage = toUsageSnippet({
    component: 'VoiceInput',
    from: '@/components/ui/voice-input',
    props: {
      demo,
      level: input === 'level' ? { expression: 'micLevel' } : undefined,
      idleCaption: IDLE_CAPTION,
      onSend: { expression: 'handleSend' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / voice-input"
      title="Voice Input"
      description="A voice recorder with a live waveform. While you talk the bars scroll in from the right and a soft ring behind the button breathes with your voice; stop, and the take settles into the row right to left, ready to play back, send or discard. Adapted from Kokonut UI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Demo loop"
            checked={demo}
            onCheckedChange={(next) => settings.set('demo', next)}
          />
          <DemoControlGroup
            title="Input"
            options={INPUTS}
            value={input}
            onChange={(next) => settings.set('input', next)}
            format={(value) => INPUT_LABELS[value]}
          />
          {input === 'level' && (
            <DemoSlider
              label="Level"
              value={level}
              onValueChange={(next) => settings.set('level', next)}
              min={0}
              max={100}
              unit="%"
            />
          )}
          <DemoAction onClick={handleRestart}>Restart demo loop</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/voice-input/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-2">
        <VoiceInput
          key={`${demo}-${round}`}
          demo={demo}
          level={input === 'level' ? level / 100 : undefined}
          idleCaption={IDLE_CAPTION}
          onListeningChange={(listening) => {
            if (listening) setLastEvent('')
          }}
          onSend={(duration) =>
            setLastEvent(`Sent a ${Math.max(1, Math.round(duration))}s voice note to #release-planning`)
          }
          onDiscard={() => setLastEvent('Take discarded')}
        />
        <p className="h-4 text-xs text-muted-foreground">{lastEvent}</p>
      </div>
    </DemoPage>
  )
}
