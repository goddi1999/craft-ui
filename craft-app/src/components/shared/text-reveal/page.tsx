import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { TextReveal } from './TextReveal'
import type {
  TextRevealAccent,
  TextRevealLength,
  TextRevealSize,
} from './text-reveal.types'

const SIZES: TextRevealSize[] = ['sm', 'default', 'lg']
const LENGTHS: TextRevealLength[] = ['compact', 'default', 'long']
const ACCENTS: TextRevealAccent[] = ['cyan', 'amber', 'magenta', 'plain']

const FOLLOW_UP_LINES = [
  'No JavaScript ran to fill this in.',
  'Three text-clipped gradients and a view timeline.',
]

const DEFAULTS = {
  text: 'Responsive Animated Text Reveals with CSS Scroll-Driven Animations.',
  size: 'default' as TextRevealSize,
  length: 'default' as TextRevealLength,
  accent: 'cyan' as TextRevealAccent,
  debug: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  size: 'default',
  length: 'default',
  accent: 'cyan',
  debug: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'text',
    type: 'string',
    description: 'The line that fills in as the reader scrolls. Required.',
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
    description: 'Scroll distance the reveal is spread across — 150, 200 or 320vh.',
  },
  {
    name: 'accent',
    type: "'cyan' | 'amber' | 'magenta' | 'plain'",
    default: "'cyan'",
    description: 'Colour of the highlight edge that leads the sweep.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Outline the section that drives the view timeline.',
  },
  {
    name: '...props',
    type: 'HTMLAttributes<HTMLElement>',
    description: 'Any native section attribute — className, style, id…',
  },
]

export function TextRevealPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { text, size, length, accent, debug } = settings.values
  const lines = [text || DEFAULTS.text, ...FOLLOW_UP_LINES]

  const usage = toUsageSnippet({
    component: 'TextReveal',
    from: '@/components/shared/text-reveal',
    props: { text: lines[0], size, length, accent, debug },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / text-reveal"
      title="Scroll-driven text reveals"
      description={
        <>
          Scroll the page: a sticky line whose fill is three gradients clipped
          to the text, swept left to right by a view timeline — so it re-flows
          at any size without measuring a thing. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/abQyPOK" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      layout="fullscreen"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="First line"
            value={text}
            onValueChange={(value) => settings.set('text', value)}
            maxLength={80}
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
            title="Accent"
            options={ACCENTS}
            value={accent}
            onChange={(value) => settings.set('accent', value)}
          />
          <DemoSwitch
            label="Show driver"
            checked={debug}
            onCheckedChange={(value) => settings.set('debug', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/text-reveal/'],
        usage,
        props: PROPS,
      }}
    >
      <div data-slot="text-reveal-stage">
        <p data-slot="text-reveal-stage-hint">Scroll</p>

        {lines.map((line, index) => (
          <TextReveal
            key={`${index}-${length}`}
            text={line}
            size={size}
            length={length}
            accent={accent}
            debug={debug}
          />
        ))}

        <p data-slot="text-reveal-stage-end">fin.</p>
      </div>
    </DemoPage>
  )
}
