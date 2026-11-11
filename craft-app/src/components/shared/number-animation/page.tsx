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

import { NumberAnimation } from './NumberAnimation'
import type {
  NumberAnimationMode,
  NumberAnimationSize,
} from './number-animation.types'

const SIZES: NumberAnimationSize[] = ['sm', 'default', 'lg', 'xl']
const MODES: NumberAnimationMode[] = ['transition', 'animation']

const DEFAULTS = {
  value: 55,
  size: 'lg' as NumberAnimationSize,
  mode: 'transition' as NumberAnimationMode,
  duration: 1,
  suffix: '%',
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  size: 'default',
  mode: 'transition',
  duration: 1,
  suffix: '%',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    description: 'The integer to show; changing it animates the counter. Required.',
  },
  {
    name: 'size',
    type: "'sm' | 'default' | 'lg' | 'xl'",
    default: "'default'",
    description: 'Font size of the number.',
  },
  {
    name: 'mode',
    type: "'transition' | 'animation'",
    default: "'transition'",
    description:
      'Tween the registered property directly, or replay an additive keyframe from the last value.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '1',
    description: 'Seconds the number takes to arrive.',
  },
  {
    name: 'suffix',
    type: 'string',
    default: "'%'",
    description: 'Text after the number. Pass an empty string for none.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'What the number measures, read out by screen readers.',
  },
  {
    name: '...props',
    type: 'HTMLAttributes<HTMLDivElement>',
    description: 'Any native div attribute, applied to the root.',
  },
]

export function NumberAnimationPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { value, size, mode, duration, suffix } = settings.values

  const handleRandomValue = () => {
    let next = value
    while (Math.abs(next - value) < 20) next = Math.round(Math.random() * 100)
    settings.set('value', next)
  }

  const usage = toUsageSnippet({
    component: 'NumberAnimation',
    from: '@/components/shared/number-animation',
    props: { value, size, mode, duration, suffix, label: 'Progress' },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / number-animation"
      title="CSS number animation"
      description={
        <>
          A registered <code>&lt;integer&gt;</code> custom property feeds a CSS
          counter, so the number itself is interpolable — no JavaScript ticks a
          value. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/gbbYZEz" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Value"
            value={value}
            onValueChange={(next) => settings.set('value', next)}
            min={0}
            max={100}
          />
          <DemoControlGroup
            title="Mode"
            options={MODES}
            value={mode}
            onChange={(next) => settings.set('mode', next)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={0.25}
            max={3}
            step={0.25}
            unit="s"
          />
          <DemoTextField
            label="Suffix"
            value={suffix}
            onValueChange={(next) => settings.set('suffix', next)}
            maxLength={6}
          />
          <DemoAction onClick={handleRandomValue}>Random value</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/number-animation/'],
        usage,
        props: PROPS,
      }}
    >
      <NumberAnimation
        value={value}
        size={size}
        mode={mode}
        duration={duration}
        suffix={suffix}
        label="Progress"
      />
    </DemoPage>
  )
}
