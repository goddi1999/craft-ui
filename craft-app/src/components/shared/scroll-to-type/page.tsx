import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { ScrollToType } from './ScrollToType'
import type {
  ScrollToTypeLength,
  ScrollToTypeSize,
  ScrollToTypeTheme,
} from './scroll-to-type.types'

const SIZES: ScrollToTypeSize[] = ['sm', 'default', 'lg']
const LENGTHS: ScrollToTypeLength[] = ['compact', 'default', 'long']
const THEMES: ScrollToTypeTheme[] = ['system', 'light', 'dark']

const SAMPLES = {
  lorem:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquet nulla ac magna semper, at condimentum orci ultrices.',
  short: 'Scroll and the caret walks the line one character at a time.',
} as const

type SampleName = keyof typeof SAMPLES

const SAMPLE_NAMES = Object.keys(SAMPLES) as SampleName[]

/** Height of the demo's own scroller; the component types inside it. */
const VIEWPORT = '28rem'

const DEFAULTS = {
  sample: 'lorem' as SampleName,
  size: 'default' as ScrollToTypeSize,
  length: 'default' as ScrollToTypeLength,
  theme: 'system' as ScrollToTypeTheme,
  cursorHue: 320,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'text',
    type: 'string',
    description: 'The line that gets typed out as the reader scrolls. Required.',
  },
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg'",
    default: "'default'",
    description: 'Fluid font size of the line.',
  },
  {
    name: 'length',
    type: "'compact' | 'default' | 'long'",
    default: "'default'",
    description: 'Scroll distance the typing is spread over — 1.5, 2 or 3.2 viewports.',
  },
  {
    name: 'theme',
    type: "'system' | 'light' | 'dark'",
    default: "'system'",
    description: 'color-scheme of the component.',
  },
  {
    name: 'cursorHue',
    type: 'number',
    default: '320',
    description: 'Hue of the blinking cursor block, 0–360.',
  },
  {
    name: '--scroll-to-type-viewport',
    type: 'CSS length',
    default: '100vh',
    description: 'Height of the scroller it types in. Set it when the component sits in its own scroller.',
  },
  {
    name: '...props',
    type: 'HTMLAttributes<HTMLElement>',
    description: 'Any native section attribute, plus className and style.',
  },
]

export function ScrollToTypePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { sample, size, length, theme, cursorHue } = settings.values

  const usage = toUsageSnippet({
    component: 'ScrollToType',
    from: '@/components/shared/scroll-to-type',
    props: { text: SAMPLES[sample], size, length, theme, cursorHue },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / scroll-to-type"
      title="Scroll to Type"
      description={
        <>
          Scroll inside the demo: a stepped view-timeline animation converts
          scroll distance into a character index, and two text-clipped
          gradients draw the fill and a blinking caret block. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/YPKmwOv" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Text"
            options={SAMPLE_NAMES}
            value={sample}
            onChange={(value) => settings.set('sample', value)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(value) => settings.set('size', value)}
          />
          <DemoControlGroup
            title="Length"
            options={LENGTHS}
            value={length}
            onChange={(value) => settings.set('length', value)}
          />
          <DemoControlGroup
            title="Theme"
            options={THEMES}
            value={theme}
            onChange={(value) => settings.set('theme', value)}
          />
          <DemoSlider
            label="Cursor hue"
            value={cursorHue}
            onValueChange={(value) => settings.set('cursorHue', value)}
            min={0}
            max={360}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/scroll-to-type/'],
        usage,
        props: PROPS,
      }}
    >
      <div data-slot="scroll-to-type-stage" data-theme={theme}>
        <div className="relative z-10 h-[28rem] overflow-y-auto">
          <p className="flex h-[14rem] items-end justify-center pb-6 text-sm opacity-60">
            Scroll down
          </p>
          <ScrollToType
            key={`${sample}-${length}`}
            text={SAMPLES[sample]}
            size={size}
            length={length}
            theme={theme}
            cursorHue={cursorHue}
            style={{ ['--scroll-to-type-viewport' as string]: VIEWPORT }}
          />
          <p className="flex h-[14rem] items-center justify-center text-2xl opacity-40">
            fin.
          </p>
        </div>
      </div>
    </DemoPage>
  )
}
