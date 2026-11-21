import { getAvatarUrls } from '@wq-org/avatars'
import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ToneSwatches } from '@/components/shared/speech-bubble'
import { MorphingSpeechBubble } from '@/components/ui/morphing-speech-bubble'
import type { SpeechBubbleSide, SpeechBubbleTone } from '@/components/ui/speech-bubble'

const SIDES: readonly SpeechBubbleSide[] = ['left', 'right']

// short, long, one word, two lines: each swap changes the shape in a different way
const MESSAGES = [
  'Hi!',
  'Hey, I’m Willfried 👋',
  'Ready for today’s lesson?',
  'Serious games are fun.',
  'Drag the tiles into the right order, then press check when you think you’ve got it.',
  'Nice!',
  'One more round?',
]

const WILLFRIED = getAvatarUrls().find((avatar) => avatar.name === 'Willfried')

const DEFAULTS = {
  tone: 'blue' as SpeechBubbleTone,
  side: 'left' as SpeechBubbleSide,
  duration: 0.5,
  bounce: 0.2,
  blur: true,
  autoplay: true,
  interval: 2200,
}

const COMPONENT_DEFAULTS = {
  tone: 'blue',
  side: 'left',
  duration: 0.5,
  bounce: 0.2,
  blur: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'message',
    type: 'string',
    description: 'The current text. Change it and the bubble morphs to fit.',
  },
  { name: 'avatarSrc', type: 'string', description: 'Image of the speaker.' },
  {
    name: 'name',
    type: 'string',
    description: 'Speaker name, used as alt text and in the live region.',
  },
  {
    name: 'tone',
    type: 'SpeechBubbleTone',
    default: "'blue'",
    description:
      'One of 25 palette tones from speech-bubble-variants; white text on the darker ones, ink on the ten light ones.',
  },
  {
    name: 'side',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Which side the avatar sits on; the tail points at it.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.5',
    description: 'Seconds the spring takes to settle. The text exit runs at 40% of it.',
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.2',
    description: 'Spring overshoot, 0 to 0.5.',
  },
  {
    name: 'blur',
    type: 'boolean',
    default: 'true',
    description: 'Blur the swapping text so both states read as one shape.',
  },
  {
    name: 'maxWidth',
    type: 'number',
    default: '280',
    description: 'Line length in px before the text wraps.',
  },
  {
    name: 'avatarSize',
    type: 'number',
    default: '48',
    description: 'Avatar size in px.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the row.' },
]

export function MorphingSpeechBubblePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { tone, side, duration, bounce, blur, autoplay, interval } = settings.values
  const [index, setIndex] = useState(0)
  const [custom, setCustom] = useState('')
  const message = custom.trim() === '' ? MESSAGES[index] : custom

  useEffect(() => {
    if (!autoplay || custom.trim() !== '') return
    const id = window.setTimeout(() => setIndex((value) => (value + 1) % MESSAGES.length), interval)
    return () => window.clearTimeout(id)
  }, [autoplay, interval, index, custom])

  const handleNext = () => {
    setCustom('')
    setIndex((value) => (value + 1) % MESSAGES.length)
  }

  const usage = toUsageSnippet({
    component: 'MorphingSpeechBubble',
    from: '@/components/ui/morphing-speech-bubble',
    props: {
      message: { expression: 'message' },
      avatarSrc: { expression: 'avatar.src' },
      name: 'Willfried',
      tone,
      side,
      duration,
      bounce,
      blur,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / morphing-speech-bubble"
      title="Morphing Speech Bubble"
      description="Willfried talks, and his bubble springs to the size of each new message the way the dynamic island does: the shell morphs while the old text blurs out fast and the new text blurs in. Slow the duration down to watch the morph, or type your own message."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <ToneSwatches value={tone} onChange={(next) => settings.set('tone', next)} />
          <DemoControlGroup
            title="Avatar"
            options={SIDES}
            value={side}
            onChange={(next) => settings.set('side', next)}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={0.2}
            max={2}
            step={0.05}
            unit="s"
          />
          <DemoSlider
            label="Bounce"
            value={bounce}
            onValueChange={(next) => settings.set('bounce', next)}
            min={0}
            max={0.5}
            step={0.05}
          />
          <DemoSwitch
            label="Blur text"
            checked={blur}
            onCheckedChange={(next) => settings.set('blur', next)}
          />
          <DemoSwitch
            label="Autoplay"
            checked={autoplay}
            onCheckedChange={(next) => settings.set('autoplay', next)}
          />
          <DemoSlider
            label="Interval"
            value={interval}
            onValueChange={(next) => settings.set('interval', next)}
            min={800}
            max={5000}
            step={100}
            unit="ms"
          />
          <DemoTextField label="Your message" value={custom} onValueChange={setCustom} />
          <DemoAction onClick={handleNext}>Next message</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/morphing-speech-bubble/', 'src/components/ui/speech-bubble/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex min-h-[220px] w-full max-w-md items-end justify-center px-4">
        {WILLFRIED ? (
          <MorphingSpeechBubble
            message={message}
            avatarSrc={WILLFRIED.imageUrl}
            name={WILLFRIED.name}
            tone={tone}
            side={side}
            duration={duration}
            bounce={bounce}
            blur={blur}
          />
        ) : null}
      </div>
    </DemoPage>
  )
}
