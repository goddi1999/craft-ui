import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  SpeechBubble,
  type SpeechBubbleSide,
  type SpeechBubbleTone,
} from '@/components/ui/speech-bubble'

import { ToneSwatches } from './ToneSwatches'

const SIDES: readonly SpeechBubbleSide[] = ['right', 'left']

const DEFAULTS = {
  text: 'Hello, how are you?',
  showCursor: true,
  side: 'right' as SpeechBubbleSide,
  tone: 'default' as SpeechBubbleTone,
}

const COMPONENT_DEFAULTS = { showCursor: true, side: 'right', tone: 'default' }

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', description: 'The message.' },
  {
    name: 'showCursor',
    type: 'boolean',
    default: 'true',
    description: 'A blinking caret after the text, hidden below md.',
  },
  {
    name: 'side',
    type: "'right' | 'left'",
    default: "'right'",
    description: 'The bottom corner the tail sits on.',
  },
  {
    name: 'tone',
    type: 'SpeechBubbleTone',
    default: "'default'",
    description:
      'One of 25 palette tones from speech-bubble-variants; white text on the darker ones, ink on the ten light ones.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Merged onto the root. Set `--speech-bubble-bg` / `--speech-bubble-fg` to recolour.',
  },
]

export function SpeechBubblePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { text, showCursor, side, tone } = settings.values

  const usage = toUsageSnippet({
    component: 'SpeechBubble',
    from: '@/components/ui/speech-bubble',
    props: { showCursor, side, tone },
    defaults: COMPONENT_DEFAULTS,
    children: text,
  })

  return (
    <DemoPage
      eyebrow="ui / speech-bubble"
      title="Speech Bubble"
      description="A pill-shaped chat bubble with a curved tail and an optional blinking caret. Its colours come from two CSS variables, so a parent can retint it; the avatar orbit uses it for its bubbles. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Text"
            value={text}
            onValueChange={(next) => settings.set('text', next)}
          />
          <ToneSwatches value={tone} onChange={(next) => settings.set('tone', next)} />
          <DemoControlGroup
            title="Tail"
            options={SIDES}
            value={side}
            onChange={(next) => settings.set('side', next)}
          />
          <DemoSwitch
            label="Cursor"
            checked={showCursor}
            onCheckedChange={(next) => settings.set('showCursor', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/speech-bubble/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-8 px-6">
        <SpeechBubble showCursor={showCursor} side={side} tone={tone}>
          {text}
        </SpeechBubble>
        <SpeechBubble showCursor={false} side={side === 'right' ? 'left' : 'right'} tone={tone}>
          No cursor variant
        </SpeechBubble>
      </div>
    </DemoPage>
  )
}
