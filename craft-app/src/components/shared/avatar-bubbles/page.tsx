import { getAvatarUrls } from '@wq-org/avatars'
import { useMemo, useState } from 'react'

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
import {
  AvatarBubbles,
  AvatarBubblesAction,
  DEFAULT_LAYOUT,
  layoutBubbles,
  withBleed,
} from '@/components/ui/avatar-bubbles'

const DEFAULTS = {
  count: 5,
  bleed: 0,
  parallax: true,
  eyebrow: 'Apple Card Family',
  title: 'Healthy finances. Family style.',
}

const COMPONENT_DEFAULTS = { parallax: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'bubbles',
    type: '{ id, src, name, tone, x, y, size }[]',
    description:
      'Circles to draw. x and y are the top-left in % of the card (may be negative to bleed off the edge); size is the diameter in % of its width. tone is coral, pink, lilac, periwinkle, mint or sand.',
  },
  { name: 'children', type: 'ReactNode', description: 'Text block, anchored bottom left. Size it with cqw units to scale with the card.' },
  { name: 'action', type: 'ReactNode', description: 'Anchored bottom right, e.g. <AvatarBubblesAction />.' },
  { name: 'parallax', type: 'boolean', default: 'true', description: 'Bubbles drift subtly with the pointer. Off under reduced motion.' },
  { name: 'layoutBubbles(avatars, layout?)', type: 'helper', description: 'Pairs { src, name } avatars with the default five-slot layout.' },
]

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

export function AvatarBubblesPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, bleed, parallax, eyebrow, title } = settings.values
  const [replayKey, setReplayKey] = useState(0)

  const pool = useMemo(
    () => getAvatarUrls().map((avatar) => ({ id: avatar.id, src: avatar.imageUrl, name: avatar.name })),
    [],
  )
  const [picked, setPicked] = useState(() => shuffle(pool).slice(0, 6))

  const bubbles = layoutBubbles(picked, withBleed(DEFAULT_LAYOUT, bleed / 100).slice(0, count))

  const usage = toUsageSnippet({
    component: 'AvatarBubbles',
    from: '@/components/ui/avatar-bubbles',
    props: {
      bubbles: { expression: 'layoutBubbles(avatars)' },
      parallax,
      action: { expression: '<AvatarBubblesAction />' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / avatar-bubbles"
      title="Avatar Bubbles"
      description="A card clipping a loose cluster of pastel avatar circles that bleed off its edges. They spring in, float out of sync, lift on hover while the rest dim, and drift with the pointer."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider label="Bubbles" value={count} onValueChange={(next) => settings.set('count', next)} min={3} max={6} />
          <DemoSlider label="Bleed" value={bleed} onValueChange={(next) => settings.set('bleed', next)} min={-20} max={40} unit="%" />
          <DemoSwitch label="Parallax" checked={parallax} onCheckedChange={(next) => settings.set('parallax', next)} />
          <DemoTextField label="Eyebrow" value={eyebrow} onValueChange={(next) => settings.set('eyebrow', next)} maxLength={32} />
          <DemoTextField label="Title" value={title} onValueChange={(next) => settings.set('title', next)} maxLength={48} />
          <DemoAction onClick={() => setPicked(shuffle(pool).slice(0, 6))}>Shuffle avatars</DemoAction>
          <DemoAction onClick={() => setReplayKey((key) => key + 1)}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/avatar-bubbles/'], usage, props: PROPS }}
    >
      <AvatarBubbles
        key={replayKey}
        bubbles={bubbles}
        parallax={parallax}
        action={<AvatarBubblesAction />}
        className="max-w-2xl"
      >
        <p className="text-[max(0.75rem,2.2cqw)] font-semibold">{eyebrow}</p>
        <h2 className="mt-[1cqw] max-w-[14ch] text-[8cqw] leading-[0.98] font-bold tracking-tight text-balance">
          {title}
        </h2>
      </AvatarBubbles>
    </DemoPage>
  )
}
