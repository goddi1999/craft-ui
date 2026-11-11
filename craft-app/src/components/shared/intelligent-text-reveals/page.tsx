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
import { IntelligentTextReveals } from '@/components/ui/intelligent-text-reveals'

const TINTS = {
  blue: 'hsl(220 73% 72% / 0.64)',
  pink: 'hsl(330 80% 72% / 0.64)',
  amber: 'hsl(38 92% 60% / 0.64)',
  green: 'hsl(150 60% 55% / 0.64)',
} as const
type Tint = keyof typeof TINTS

const TINT_NAMES = Object.keys(TINTS) as Tint[]

const DEFAULTS = {
  duration: 1.4,
  delay: 0.5,
  blur: 4,
  tint: 'blue' as Tint,
  signature: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  duration: 1.4,
  delay: 0.5,
  blur: 4,
  color: TINTS.blue,
  signature: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Rich copy to reveal — text, links, <br />s. Rendered three times: sizer, tinted lead and real text.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '1.4',
    description: 'Seconds for the wipe to travel the block.',
  },
  {
    name: 'delay',
    type: 'number',
    default: '0.5',
    description: 'Seconds before the wipe starts.',
  },
  {
    name: 'color',
    type: 'string',
    default: "'hsl(220 73% 72% / 0.64)'",
    description: 'Tint of the blurred lead edge — any CSS color.',
  },
  {
    name: 'blur',
    type: 'number',
    default: '4',
    description: 'Blur of the lead edge in px.',
  },
  {
    name: 'signature',
    type: 'boolean',
    default: 'true',
    description: 'Draw the hand-sketched bear signature after the copy lands.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root. Change `key` to replay.',
  },
]

export function IntelligentTextRevealsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { duration, delay, blur, tint, signature } = settings.values
  const [replayCount, setReplayCount] = useState(0)

  const handleReplay = () => setReplayCount((count) => count + 1)

  const usage = toUsageSnippet({
    component: 'IntelligentTextReveals',
    from: '@/components/ui/intelligent-text-reveals',
    props: { duration, delay, blur, color: TINTS[tint], signature },
    defaults: COMPONENT_DEFAULTS,
    children: 'Copy that washes in behind a sweeping mask.',
  })

  return (
    <DemoPage
      eyebrow="ui / intelligent-text-reveals"
      title="Intelligent Text Reveals"
      description={
        <>
          Copy washes in behind a sweeping radial mask, led by a tinted,
          blurred echo that squeezes the line-height as it passes. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/zxYQagX" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={0.2}
            max={4}
            step={0.1}
            unit="s"
          />
          <DemoSlider
            label="Delay"
            value={delay}
            onValueChange={(value) => settings.set('delay', value)}
            min={0}
            max={4}
            step={0.1}
            unit="s"
          />
          <DemoSlider
            label="Blur"
            value={blur}
            onValueChange={(value) => settings.set('blur', value)}
            min={0}
            max={10}
            unit="px"
          />
          <DemoControlGroup
            title="Lead tint"
            options={TINT_NAMES}
            value={tint}
            onChange={(value) => settings.set('tint', value)}
          />
          <DemoSwitch
            label="Signature"
            checked={signature}
            onCheckedChange={(value) => settings.set('signature', value)}
          />
          <DemoAction onClick={handleReplay}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/intelligent-text-reveals/'],
        usage,
        props: PROPS,
      }}
    >
      <IntelligentTextReveals
        key={`${replayCount}-${duration}-${delay}`}
        duration={duration}
        delay={delay}
        blur={blur}
        color={TINTS[tint]}
        signature={signature}
      >
        Design Engineer, currently with{' '}
        <a href="https://vercel.com/home">Vercel</a>. Formerly CSS + UI DevRel
        at Google.
        <br />
        <br />
        Showing you how to craft high-impact web experiences. Writing{' '}
        <a href="https://newsletter.craftofui.com">"The Craft of UI"</a>.
        Spoken at events all{' '}
        <a href="https://youtu.be/loKm4JcT4U4?si=cJB9Q9Up00LWIJ6S">
          over the world
        </a>{' '}
        and had work featured by many. You can find my work and insights on{' '}
        <a href="https://twitter.com/intent/follow?screen_name=jh3yy">X</a>.
        <br />
        <br />
        Join my course <a href="https://course.craftofui.com">waitlist</a>.
      </IntelligentTextReveals>
    </DemoPage>
  )
}
