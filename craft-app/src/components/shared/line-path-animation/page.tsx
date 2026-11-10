import {
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { LinePathAnimation } from './LinePathAnimation'
import type { LinePathAnimationTheme } from './line-path-animation.types'

const THEMES: LinePathAnimationTheme[] = ['system', 'light', 'dark']

const DEFAULTS = {
  theme: 'system' as LinePathAnimationTheme,
  title: 'The Problem.',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'title',
    type: 'string',
    default: "'The Problem.'",
    description: 'Hero heading that shrinks as you start scrolling.',
  },
  {
    name: 'steps',
    type: 'string[]',
    default: "['Perhaps.', 'We could scroll', 'to the root', 'of it.']",
    description: 'One full-height section per line; from the third on they align right.',
  },
  {
    name: 'theme',
    type: "'system' | 'light' | 'dark'",
    default: "'system'",
    description: 'Color scheme of the hero; the line section is always dark.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root. It is one viewport tall and scrolls inside.',
  },
]

export function LinePathAnimationPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { theme, title } = settings.values

  const usage = toUsageSnippet({
    component: 'LinePathAnimation',
    from: '@/components/shared/line-path-animation',
    props: { theme, title },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / line-path-animation"
      title="Line Path Animation"
      description="Scroll inside the demo: GSAP ScrollTrigger draws three SVG paths with stroke-dashoffset while the hero shrinks away. Works in portrait and landscape."
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Theme"
            options={THEMES}
            value={theme}
            onChange={(value) => settings.set('theme', value)}
          />
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(value) => settings.set('title', value)}
            maxLength={24}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/line-path-animation/'],
        usage,
        props: PROPS,
      }}
    >
      <LinePathAnimation theme={theme} title={title || undefined} />
    </DemoPage>
  )
}
