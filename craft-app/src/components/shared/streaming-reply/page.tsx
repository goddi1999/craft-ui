import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { StreamingReply, type StreamingReplyTurn } from '@/components/ui/streaming-reply'

const TURNS: StreamingReplyTurn[] = [
  {
    question: 'Why did the last deploy fail?',
    answer:
      'The build ran out of memory while bundling the docs site. Raising the limit to 4 GB fixes it today; moving the docs into their own job keeps it fixed.',
  },
  {
    question: 'Which feature flags can we remove?',
    answer:
      'Six flags have been fully on for over a month and no code reads them anymore. The oldest is new-checkout, which shipped in March.',
  },
]

const DEFAULTS = {
  loop: true,
  thinkingLabel: 'Thinking',
}

const COMPONENT_DEFAULTS = { loop: true, thinkingLabel: 'Thinking' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'turns',
    type: '{ question: string; answer: string }[]',
    description:
      'Played one after another; the thread clears between them. Renders nothing when empty.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'true',
    description: 'Start over after the last turn. Off, the last turn stays on screen.',
  },
  {
    name: 'thinkingLabel',
    type: 'string',
    default: "'Thinking'",
    description: 'Shimmering label in the reply bubble before the answer starts.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the thread. It is 360px wide at most; the reply opens to 90% of it.',
  },
]

export function StreamingReplyPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { loop, thinkingLabel } = settings.values
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'StreamingReply',
    from: '@/components/ui/streaming-reply',
    props: { turns: { expression: 'turns' }, loop, thinkingLabel },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / streaming-reply"
      title="Streaming Reply"
      description="A question rises in and the answer bubble opens as a small shimmering “Thinking” pill. Then the reply streams in a word at a time, each word rising and sharpening on its own spring while the bubble widens and grows a line at a time. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Loop"
            checked={loop}
            onCheckedChange={(next) => settings.set('loop', next)}
          />
          <DemoTextField
            label="Thinking label"
            value={thinkingLabel}
            onValueChange={(next) => settings.set('thinkingLabel', next)}
            maxLength={24}
          />
          <DemoAction onClick={() => setRun((current) => current + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/streaming-reply/'], usage, props: PROPS }}
    >
      <StreamingReply key={run} turns={TURNS} loop={loop} thinkingLabel={thinkingLabel} />
    </DemoPage>
  )
}
