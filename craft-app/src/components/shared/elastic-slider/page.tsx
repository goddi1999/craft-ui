import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ElasticSlider } from '@/components/ui/elastic-slider'

const DEFAULTS = { min: 0, max: 10, step: 0.5 }

const COMPONENT_DEFAULTS = { min: 0, max: 1, step: 0.01 }

const PROPS: DemoPropDoc[] = [
  { name: 'label', type: 'string', description: 'Label shown inside the track. Required.' },
  { name: 'value', type: 'number', description: 'Controlled value; use with onValueChange.' },
  {
    name: 'defaultValue',
    type: 'number',
    default: 'min',
    description: 'Initial value for uncontrolled mode.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Called with the new value on drag, click, or key press.',
  },
  { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
  { name: 'max', type: 'number', default: '1', description: 'Maximum value.' },
  { name: 'step', type: 'number', default: '0.01', description: 'Smallest increment.' },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    description: 'Format the displayed value. Defaults to toFixed based on step.',
  },
  {
    name: 'aria-label',
    type: 'string',
    default: 'label',
    description: 'Accessible name.',
  },
]

export function ElasticSliderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { min, max, step } = settings.values
  const [opacity, setOpacity] = useState(0.5)
  const [playground, setPlayground] = useState(5)

  const usage = toUsageSnippet({
    component: 'ElasticSlider',
    from: '@/components/ui/elastic-slider',
    props: {
      label: 'Opacity',
      min,
      max,
      step,
      defaultValue: { expression: String(min) },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / elastic-slider"
      title="Elastic Slider"
      description="A slider that stretches like rubber when dragged past its ends, snaps magnetically to ticks, and fades its handle out of the way of the label and value. Arrow keys, Shift+Arrow, Home and End all work."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Min"
            value={min}
            onValueChange={(next) => settings.set('min', Math.min(next, max - step))}
            min={-20}
            max={20}
          />
          <DemoSlider
            label="Max"
            value={max}
            onValueChange={(next) => settings.set('max', Math.max(next, min + step))}
            min={1}
            max={100}
          />
          <DemoSlider
            label="Step"
            value={step}
            onValueChange={(next) => settings.set('step', next)}
            min={0.1}
            max={5}
            step={0.1}
          />
          <DemoAction onClick={() => setPlayground(min)}>Reset playground</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/elastic-slider/'], usage, props: PROPS }}
    >
      <div className="flex w-50 flex-col gap-4">
        <ElasticSlider
          label="Opacity"
          min={0}
          max={1}
          value={opacity}
          onValueChange={setOpacity}
        />
        <ElasticSlider
          label="Blur"
          min={0}
          max={100}
          step={1}
          defaultValue={20}
          formatValue={(v) => `${v}px`}
        />
        <ElasticSlider label="Saturation" min={0} max={10} step={0.1} defaultValue={8} />
        <ElasticSlider
          label="Playground"
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, playground))}
          onValueChange={setPlayground}
        />
      </div>
    </DemoPage>
  )
}
