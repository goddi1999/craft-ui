import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { WordRoll } from '@/components/ui/word-roll'

const WORDS = ['designers', 'engineers', 'founders', 'support teams']

const DEFAULTS = {
  lead: 'Built for',
  autoPlay: true,
  interval: 2400,
}

const COMPONENT_DEFAULTS = { autoPlay: true, interval: 2400 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'words',
    type: 'string[]',
    description: 'Take turns at the end of the line. Renders nothing when empty.',
  },
  { name: 'lead', type: 'string', description: 'Text before the rolling word, in a muted colour.' },
  {
    name: 'index',
    type: 'number',
    description: 'Index of the word showing, when you control it. Wraps around the list.',
  },
  {
    name: 'defaultIndex',
    type: 'number',
    default: '0',
    description: 'Index of the first word when uncontrolled.',
  },
  {
    name: 'onIndexChange',
    type: '(index: number) => void',
    description: 'Called with the next index when the word turns, by itself or on a click.',
  },
  {
    name: 'autoPlay',
    type: 'boolean',
    default: 'true',
    description: 'Turn to the next word by itself. A click (or Enter) always turns it now.',
  },
  {
    name: 'interval',
    type: 'number',
    default: '2400',
    description: 'How long each word stays before the next rolls in, in ms.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the button. Set a text size here; everything scales with it.',
  },
]

export function WordRollPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { lead, autoPlay, interval } = settings.values
  const [index, setIndex] = useState(0)

  const usage = toUsageSnippet({
    component: 'WordRoll',
    from: '@/components/ui/word-roll',
    props: { words: { expression: 'words' }, lead, autoPlay, interval },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / word-roll"
      title="Word Roll"
      description="The last word of a line rolls up and out letter by letter while the next one rolls in from below, and the space it sits in stretches to the new width on a spring. It turns by itself; click or press Enter to turn it now. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Lead"
            value={lead}
            onValueChange={(next) => settings.set('lead', next)}
            maxLength={24}
          />
          <DemoSwitch
            label="Turn by itself"
            checked={autoPlay}
            onCheckedChange={(next) => settings.set('autoPlay', next)}
          />
          {autoPlay && (
            <DemoSlider
              label="Interval"
              value={interval}
              onValueChange={(next) => settings.set('interval', next)}
              min={800}
              max={5000}
              step={100}
              unit="ms"
            />
          )}
          <DemoAction onClick={() => setIndex((current) => (current + 1) % WORDS.length)}>
            Next word
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/word-roll/'], usage, props: PROPS }}
    >
      <WordRoll
        words={WORDS}
        lead={lead}
        index={index}
        onIndexChange={setIndex}
        autoPlay={autoPlay}
        interval={interval}
      />
    </DemoPage>
  )
}
