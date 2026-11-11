import {
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { VoiceNote } from './VoiceNote'

const DEFAULTS = {
  maxDuration: 12,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  maxDuration: 4,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'maxDuration',
    type: 'number',
    default: '4',
    description: 'Longest take in seconds; recording stops itself on reaching it.',
  },
  {
    name: 'onSend',
    type: '(payload: { durationSeconds: number }) => void',
    description: 'Called with the take length when the send button is pressed.',
  },
  {
    name: 'onCancel',
    type: '() => void',
    description: 'Called when the take is thrown away.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function VoiceNotePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { maxDuration } = settings.values

  const usage = toUsageSnippet({
    component: 'VoiceNote',
    from: '@/components/shared/voice-note',
    props: { maxDuration },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / voice-note"
      title="Voice note"
      description="A recorder pill that grows out of a mic button. The side actions slide in from behind it, an SVG stroke counts the take down, and the timer rolls one digit at a time."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Max duration"
            value={maxDuration}
            onValueChange={(value) => settings.set('maxDuration', value)}
            min={2}
            max={30}
            unit="s"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/voice-note/'],
        usage,
        props: PROPS,
      }}
    >
      <VoiceNote maxDuration={maxDuration} />
    </DemoPage>
  )
}
