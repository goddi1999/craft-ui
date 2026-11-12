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
import { ReadAlong } from '@/components/ui/read-along'

const TEXTS = {
  motto: 'Make the thing, then make it simple, then make it yours.',
  release: 'Version 2.4 is live in every region. Rollbacks stay one click away.',
  onboarding: 'Invite your team, connect the repo, then ship your first preview.',
} as const

type TextKey = keyof typeof TEXTS

const TEXT_KEYS = Object.keys(TEXTS) as TextKey[]

const DEFAULTS = {
  text: 'motto' as TextKey,
  speed: 1,
  playing: true,
  loop: true,
}

const COMPONENT_DEFAULTS = { speed: 1, playing: true, loop: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'text',
    type: 'string',
    description: 'The sentence. Split on spaces; punctuation stays with its word.',
  },
  {
    name: 'index',
    type: 'number',
    description: 'The word being read, when controlled. -1 means none, before the start.',
  },
  {
    name: 'defaultIndex',
    type: 'number',
    default: '-1',
    description: 'The starting word, when uncontrolled.',
  },
  {
    name: 'onIndexChange',
    type: '(index: number) => void',
    description: 'Called when it moves on by itself, or from a click or the arrow keys.',
  },
  {
    name: 'playing',
    type: 'boolean',
    default: 'true',
    description: 'Reads on by itself. When false the pill stays on its word.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Fades out and starts over after the last word; when false it stops there.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Reading speed; 2 reads twice as fast. Each word is read 200ms plus 35ms a character.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the text block. Set a font size here; the pill is sized in em.',
  },
]

export function ReadAlongPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { text, speed, playing, loop } = settings.values
  // a new key reads it again from the top
  const [round, setRound] = useState(0)

  const usage = toUsageSnippet({
    component: 'ReadAlong',
    from: '@/components/ui/read-along',
    props: { text: TEXTS[text], speed, playing, loop },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / read-along"
      title="Read Along"
      description="A pill slides from word to word behind the sentence while the words already read turn bright. Its two edges are separate springs, the front one quick and the back one slow, so it stretches as it travels and closes up again at each line break. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Text"
            options={TEXT_KEYS}
            value={text}
            onChange={(next) => settings.set('text', next)}
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(next) => settings.set('speed', next)}
            min={0.5}
            max={2}
            step={0.25}
            unit="×"
          />
          <DemoSwitch
            label="Playing"
            checked={playing}
            onCheckedChange={(next) => settings.set('playing', next)}
          />
          <DemoSwitch
            label="Loop"
            checked={loop}
            onCheckedChange={(next) => settings.set('loop', next)}
          />
          <DemoAction onClick={() => setRound((value) => value + 1)}>Start over</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/read-along/'], usage, props: PROPS }}
    >
      <ReadAlong
        key={`${text}-${round}`}
        text={TEXTS[text]}
        speed={speed}
        playing={playing}
        loop={loop}
      />
    </DemoPage>
  )
}
