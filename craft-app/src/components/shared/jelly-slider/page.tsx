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
import { JellySlider } from '@/components/ui/jelly-slider'

const FORMATS = ['percent', 'number'] as const
const START = 40

const DEFAULTS = {
  format: 'percent' as (typeof FORMATS)[number],
  step: 1,
  showScale: true,
}

const COMPONENT_DEFAULTS = { step: 1, showScale: true }

const asPercent = (value: number) => `${value}%`

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'number', description: 'Controlled value. Use with `onValueChange`.' },
  { name: 'defaultValue', type: 'number', default: 'min', description: 'Starting value when uncontrolled.' },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Fires on every change while dragging and on each key press.',
  },
  {
    name: 'onValueCommit',
    type: '(value: number) => void',
    description: 'Fires once the pointer lets go, or after a key press.',
  },
  { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
  { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Drag granularity. Arrow keys move one scale mark (5% of the range), Page keys two.',
  },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    description: 'Text for the drop, the scale numbers and `aria-valuetext`. The drop is 36px, keep it short.',
  },
  { name: 'showScale', type: 'boolean', default: 'true', description: 'The marks and numbers under the track.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the slider and ignores input.' },
  {
    name: 'aria-label',
    type: 'string',
    default: "'Value'",
    description: 'Name of the slider. Ignored when `aria-labelledby` is set.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root. It is `w-full max-w-80` by default.' },
]

export function JellySliderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { format, step, showScale } = settings.values
  const [rollout, setRollout] = useState(START)
  const formatValue = format === 'percent' ? asPercent : undefined

  const usage = toUsageSnippet({
    component: 'JellySlider',
    from: '@/components/ui/jelly-slider',
    props: {
      value: { expression: 'rollout' },
      onValueChange: { expression: 'setRollout' },
      step,
      showScale,
      formatValue: formatValue ? { expression: '(value) => `${value}%`' } : undefined,
      'aria-label': 'Rollout',
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / jelly-slider"
      title="Jelly Slider"
      description="A slider whose thumb stretches with speed. Grab it and a value drop rises out of the thumb, leaning the way you drag and melting back in when you let go; pull past either end and it meets rubber before snapping back. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Format"
            options={FORMATS}
            value={format}
            onChange={(next) => settings.set('format', next)}
          />
          <DemoSlider
            label="Step"
            value={step}
            onValueChange={(next) => settings.set('step', next)}
            min={1}
            max={10}
          />
          <DemoSwitch
            label="Scale"
            checked={showScale}
            onCheckedChange={(next) => settings.set('showScale', next)}
          />
          <DemoAction onClick={() => setRollout(Math.round(Math.random() * 20) * 5)}>
            Jump to a random value
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/jelly-slider/'], usage, props: PROPS }}
    >
      {/* the drop rises about 40px above the track, so leave it room */}
      <div className="flex w-full max-w-80 flex-col gap-5 pt-12">
        <JellySlider
          value={rollout}
          onValueChange={setRollout}
          step={step}
          showScale={showScale}
          formatValue={formatValue}
          aria-label="Rollout"
        />
        <p className="text-center text-sm text-muted-foreground">
          New editor rolls out to{' '}
          <span className="font-medium text-foreground tabular-nums">{rollout}%</span> of
          workspaces
        </p>
      </div>
    </DemoPage>
  )
}
