import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { LiquidSlider } from '@/components/ui/liquid-slider'

const DEFAULTS = {
  blur: 2,
  alpha: 16,
  deltaCap: 5,
  springy: true,
  active: false,
  debug: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    description: 'Controlled value.',
  },
  {
    name: 'defaultValue',
    type: 'number',
    default: '40',
    description: 'Initial value when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Called with the new value on every input.',
  },
  {
    name: 'min / max / step',
    type: 'number',
    default: '0 / 100 / 1',
    description: 'Range of the native input.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Brightness'",
    description: 'Accessible label for the range input.',
  },
  {
    name: 'startIcon / endIcon',
    type: 'ReactNode',
    default: '<SunDim /> / <Sun />',
    description: 'Icons at the minimum and maximum ends.',
  },
  {
    name: 'blur',
    type: 'number',
    default: '2',
    description: 'Gaussian blur (stdDeviation) of the goo filter.',
  },
  {
    name: 'alpha',
    type: 'number',
    default: '16',
    description: 'Alpha multiplier of the goo filter — higher gives sharper blob edges.',
  },
  {
    name: 'deltaCap',
    type: 'number',
    default: '5',
    description: 'Cap on how far pointer speed stretches the thumb.',
  },
  {
    name: 'springy',
    type: 'boolean',
    default: 'true',
    description: 'Spring ease when the thumb grows on press (pointer devices).',
  },
  {
    name: 'active',
    type: 'boolean',
    default: 'false',
    description: 'Hold the thumb in its pressed, glassy state.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Pull the layers apart to show how the effect is built.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function LiquidSliderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { blur, alpha, deltaCap, springy, active, debug } = settings.values
  const [value, setValue] = useState(40)

  const usage = toUsageSnippet({
    component: 'LiquidSlider',
    from: '@/components/ui/liquid-slider',
    props: {
      value: 'VALUE',
      onValueChange: 'ON_CHANGE',
      blur,
      alpha,
      deltaCap,
      springy,
      active,
      debug,
    },
    defaults: DEFAULTS,
  })
    .replace('value="VALUE"', 'value={value}')
    .replace('onValueChange="ON_CHANGE"', 'onValueChange={setValue}')

  return (
    <DemoPage
      eyebrow="ui / liquid-slider"
      title="Liquid Glass Slider"
      description={
        <>
          A native range input with an SVG-knocked-out track and a thumb that
          swells into a gooey glass lens on press, stretching with pointer
          speed. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/qEbYRVg" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Goo blur"
            value={blur}
            onValueChange={(next) => settings.set('blur', next)}
            min={0}
            max={13}
          />
          <DemoSlider
            label="Goo alpha"
            value={alpha}
            onValueChange={(next) => settings.set('alpha', next)}
            min={4}
            max={32}
          />
          <DemoSlider
            label="Stretch cap"
            value={deltaCap}
            onValueChange={(next) => settings.set('deltaCap', next)}
            min={0}
            max={12}
          />
          <DemoSwitch
            label="Spring"
            checked={springy}
            onCheckedChange={(next) => settings.set('springy', next)}
          />
          <DemoSwitch
            label="Hold pressed"
            checked={active}
            onCheckedChange={(next) => settings.set('active', next)}
          />
          <DemoSwitch
            label="Debug layers"
            checked={debug}
            onCheckedChange={(next) => settings.set('debug', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/liquid-slider/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <LiquidSlider
          value={value}
          onValueChange={setValue}
          active={active}
          debug={debug}
          springy={springy}
          blur={blur}
          alpha={alpha}
          deltaCap={deltaCap}
        />
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {value}
        </p>
      </div>
    </DemoPage>
  )
}
