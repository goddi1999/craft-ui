import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { HeadlineReveal, type HeadlineRevealProps } from '@/components/ui/headline-reveal'

type Tag = NonNullable<HeadlineRevealProps['as']>

const TAGS: readonly Tag[] = ['h1', 'h2', 'h3', 'p']

// uiarc's display sizes; the component leaves type to the page, like a plain heading
const TYPE: Record<Tag, string> = {
  h1: 'text-[3.25rem] leading-[1.1] font-semibold tracking-[-0.03em]',
  h2: 'text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.03em]',
  h3: 'text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em]',
  p: 'text-lg leading-[1.4] tracking-[-0.01em] text-muted-foreground',
}

const DEFAULTS = {
  first: 'Your whole roadmap,',
  second: 'finally in one place',
  as: 'h1' as Tag,
  delay: 0.1,
}

const COMPONENT_DEFAULTS = { as: 'h2', delay: 0 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'text',
    type: 'string',
    description: 'The copy to reveal. Use `\\n` for a line break that works at every width.',
  },
  {
    name: 'as',
    type: "'h1' | 'h2' | 'h3' | 'p'",
    default: "'h2'",
    description:
      'Rendered element. A heading is named by `aria-label`; `p` keeps a hidden copy and blurs less.',
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Seconds before the first word rises.',
  },
  {
    name: 'id',
    type: 'string',
    description: 'Forwarded to the element, e.g. for `aria-labelledby`.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Merged onto the element. Set the type size here; it caps at 24ch with balanced lines.',
  },
]

export function HeadlineRevealPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { first, second, as, delay } = settings.values
  const [run, setRun] = useState(0)

  const text = [first, second]
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')

  const usage = toUsageSnippet({
    component: 'HeadlineReveal',
    from: '@/components/ui/headline-reveal',
    props: {
      as,
      text: { expression: JSON.stringify(text) },
      delay,
      className: TYPE[as],
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / headline-reveal"
      title="Headline Reveal"
      description="A headline that reveals itself once as it mounts: each word rises out of its own feathered clip while it sharpens from a blur, on a stagger that stays short however long the line is. The entrance is pure CSS, so it starts on first paint, and screen readers hear one clean sentence. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="First line"
            value={first}
            onValueChange={(next) => settings.set('first', next)}
          />
          <DemoTextField
            label="Second line"
            value={second}
            onValueChange={(next) => settings.set('second', next)}
          />
          <DemoControlGroup
            title="Element"
            options={TAGS}
            value={as}
            onChange={(next) => settings.set('as', next)}
          />
          <DemoSlider
            label="Delay"
            value={delay}
            onValueChange={(next) => settings.set('delay', next)}
            min={0}
            max={1}
            step={0.05}
            unit="s"
          />
          <DemoAction onClick={() => setRun((value) => value + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/headline-reveal/'], usage, props: PROPS }}
    >
      <div className="grid min-h-56 w-full place-items-center">
        {/* words are keyed by position, so typing only re-reveals the words that changed */}
        <HeadlineReveal
          key={run}
          as={as}
          text={text || 'Type a headline'}
          delay={delay}
          className={TYPE[as]}
        />
      </div>
    </DemoPage>
  )
}
