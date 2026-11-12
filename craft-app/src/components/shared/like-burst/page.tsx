import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { LikeBurst } from '@/components/ui/like-burst'

const LABEL = 'Like the 2.4 release notes'

const DEFAULTS = {
  count: 1284,
  showCount: true,
  burst: true,
}

const COMPONENT_DEFAULTS = { burst: true, label: 'Like' }

const PROPS: DemoPropDoc[] = [
  { name: 'pressed', type: 'boolean', description: 'Liked state, for controlled use.' },
  {
    name: 'defaultPressed',
    type: 'boolean',
    default: 'false',
    description: 'Liked state on mount, for uncontrolled use.',
  },
  {
    name: 'onPressedChange',
    type: '(pressed: boolean) => void',
    description: 'Called with the next state on click. The animation plays whenever `pressed` flips.',
  },
  {
    name: 'count',
    type: 'number',
    description:
      'Likes from everyone else; the count rolls up by one while pressed. Leave it out for an icon-only button.',
  },
  {
    name: 'burst',
    type: 'boolean',
    default: 'true',
    description: 'Throw the ring of coloured dots on like. Reduced motion skips it either way.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Like'",
    description: 'Accessible name, read before the count.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the button. Set `[--like-heart:<colour>]` to recolour the heart.',
  },
]

export function LikeBurstPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { count, showCount, burst } = settings.values
  const [liked, setLiked] = useState(false)

  const usage = toUsageSnippet({
    component: 'LikeBurst',
    from: '@/components/ui/like-burst',
    props: {
      pressed: { expression: 'liked' },
      onPressedChange: { expression: 'setLiked' },
      count: showCount ? count : undefined,
      burst,
      label: LABEL,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / like-burst"
      title="Like Burst"
      description="A like button. Tap it and the heart squashes, bounces back filled red and throws a ring of coloured dots while the count rolls up by one; tap again and it drains with a small dip as the count rolls back. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Count"
            value={count}
            onValueChange={(next) => settings.set('count', next)}
            min={0}
            max={9999}
          />
          <DemoSwitch
            label="Show count"
            checked={showCount}
            onCheckedChange={(next) => settings.set('showCount', next)}
          />
          <DemoSwitch
            label="Burst"
            checked={burst}
            onCheckedChange={(next) => settings.set('burst', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/like-burst/'], usage, props: PROPS }}
    >
      <LikeBurst
        pressed={liked}
        onPressedChange={setLiked}
        count={showCount ? count : undefined}
        burst={burst}
        label={LABEL}
      />
    </DemoPage>
  )
}
