import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DEMO_IMAGES } from '@/components/shared/demo-media'
import { DemoPage } from '@/components/shared/demo-page'

import { PlaybookScrollAnimationSubgrid } from './PlaybookScrollAnimationSubgrid'
import type {
  PlaybookScrollAnimationSubgridStagger,
  PlaybookScrollAnimationSubgridTheme,
} from './playbook-scroll-animation-subgrid.types'

const THEMES: PlaybookScrollAnimationSubgridTheme[] = ['system', 'light', 'dark']
const STAGGERS: PlaybookScrollAnimationSubgridStagger[] = ['range', 'timing']

const DEFAULTS = {
  theme: 'system' as PlaybookScrollAnimationSubgridTheme,
  stagger: 'range' as PlaybookScrollAnimationSubgridStagger,
  enhanced: true,
  stick: true,
  center: true,
  layers: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'images',
    type: 'PlaybookScrollAnimationSubgridImage[]',
    default: 'PLAYBOOK_DEFAULT_IMAGES',
    description: '15 photos — 6 outer, 6 middle, 2 inner, then the centre one. Short lists repeat.',
  },
  {
    name: 'theme',
    type: "'system' | 'light' | 'dark'",
    default: "'system'",
    description: 'Colour scheme; system follows the page’s .dark class.',
  },
  {
    name: 'enhanced',
    type: 'boolean',
    default: 'true',
    description: 'Run the scroll-linked animation; off shows the static end state.',
  },
  {
    name: 'stick',
    type: 'boolean',
    default: 'true',
    description: 'Pin the photo grid while its section scrolls past.',
  },
  {
    name: 'center',
    type: 'boolean',
    default: 'true',
    description: 'Scale the centre photo down from full-viewport size.',
  },
  {
    name: 'layers',
    type: 'boolean',
    default: 'true',
    description: 'Fade and scale the surrounding photo layers in.',
  },
  {
    name: 'stagger',
    type: "'range' | 'timing'",
    default: "'range'",
    description: 'Stagger the layers by animation range or by easing curve.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function TheCraftOfUiPlaybookCssScrollAnimationWSubgridPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { theme, stagger, enhanced, stick, center, layers } = settings.values

  const usage = toUsageSnippet({
    component: 'PlaybookScrollAnimationSubgrid',
    from: '@/components/shared/the-craft-of-ui-playbook-css-scroll-animation-w-subgrid',
    props: { theme, stagger, enhanced, stick, center, layers },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / the-craft-of-ui-playbook-css-scroll-animation-w-subgrid"
      title="Playbook Scroll Animation"
      description={
        <>
          Scroll the page: a full-viewport photo scales down into a subgrid
          cell while three layers of photos fade and scale in around it, all on
          a CSS view timeline with a GSAP fallback. Ported from{' '}
          <a href="https://codepen.io/code_double/pen/WbGXdQb" target="_blank" rel="noreferrer">
            The Craft of UI&apos;s CodePen
          </a>
          .
        </>
      }
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Theme"
            options={THEMES}
            value={theme}
            onChange={(value) => settings.set('theme', value)}
          />
          <DemoControlGroup
            title="Stagger"
            options={STAGGERS}
            value={stagger}
            onChange={(value) => settings.set('stagger', value)}
          />
          <DemoSwitch
            label="Scroll animation"
            checked={enhanced}
            onCheckedChange={(value) => settings.set('enhanced', value)}
          />
          <DemoSwitch
            label="Sticky grid"
            checked={stick}
            onCheckedChange={(value) => settings.set('stick', value)}
          />
          <DemoSwitch
            label="Scale centre photo"
            checked={center}
            onCheckedChange={(value) => settings.set('center', value)}
          />
          <DemoSwitch
            label="Animate layers"
            checked={layers}
            onCheckedChange={(value) => settings.set('layers', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/the-craft-of-ui-playbook-css-scroll-animation-w-subgrid/'],
        usage,
        props: PROPS,
      }}
    >
      <PlaybookScrollAnimationSubgrid
        theme={theme}
        stagger={stagger}
        enhanced={enhanced}
        stick={stick}
        center={center}
        layers={layers}
        images={DEMO_IMAGES.slice(0, 15)}
      />
    </DemoPage>
  )
}
