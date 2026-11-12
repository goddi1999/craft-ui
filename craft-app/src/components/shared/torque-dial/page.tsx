import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { TorqueDial } from '@/components/ui/torque-dial'

// min, max, step and unit only make sense together, so the demo offers them as scales
const SCALES = {
  percent: { min: 0, max: 100, step: 1, unit: '%' },
  decibels: { min: -24, max: 12, step: 0.5, unit: 'dB' },
  degrees: { min: 0, max: 360, step: 5, unit: '°' },
} as const
type Scale = keyof typeof SCALES

// each scale keeps its own value, so switching back finds the dial where you left it
const START_VALUES: Record<Scale, number> = { percent: 48, decibels: 0, degrees: 90 }

const DEFAULTS = {
  label: 'Master Output Gain',
  scale: 'percent' as Scale,
  size: 140,
  momentum: true,
  showValue: true,
  disabled: false,
}

const COMPONENT_DEFAULTS = {
  label: 'Dial control',
  min: 0,
  max: 100,
  step: 1,
  unit: '',
  size: 120,
  momentum: true,
  showValue: true,
  disabled: false,
}

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'number', description: 'The current value. The dial is controlled.' },
  {
    name: 'onChange',
    type: '(value: number) => void',
    description: 'Called with each new value while dragging, spinning, scrolling or pressing keys.',
  },
  {
    name: 'onChangeEnd',
    type: '() => void',
    description: 'Called when a drag ends, or when its spin comes to rest.',
  },
  { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
  { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Values snap to this. One key press or wheel notch moves one step.',
  },
  {
    name: 'unit',
    type: 'string',
    default: "''",
    description: 'Suffix after the value, e.g. `%`, `dB`, `°`.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Dial control'",
    description: 'Names the slider for screen readers and sits under the value.',
  },
  { name: 'size', type: 'number', default: '120', description: 'Diameter in px.' },
  {
    name: 'momentum',
    type: 'boolean',
    default: 'true',
    description: 'Keep spinning after a flick, slowing with friction. Off with reduced motion.',
  },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'true',
    description: 'Show the value and label under the dial.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dims the dial and ignores input.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function TorqueDialPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, scale, size, momentum, showValue, disabled } = settings.values
  const [values, setValues] = useState(START_VALUES)
  const { min, max, step, unit } = SCALES[scale]

  const usage = toUsageSnippet({
    component: 'TorqueDial',
    from: '@/components/ui/torque-dial',
    props: {
      value: { expression: 'value' },
      onChange: { expression: 'setValue' },
      min,
      max,
      step,
      unit,
      label,
      size,
      momentum,
      showValue,
      disabled,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / torque-dial"
      title="Torque Dial"
      description="A rotary knob over a 270° gauge. Drag it round, or flick it and let go and it keeps spinning until friction stops it. Scroll over it or use the arrow keys, Home and End to step it, and double-click to put it in the middle. Adapted from EasyUI."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={28}
          />
          <DemoControlGroup
            title="Scale"
            options={Object.keys(SCALES) as Scale[]}
            value={scale}
            onChange={(next) => settings.set('scale', next)}
            format={(option) => {
              const range = SCALES[option]
              return `${range.min} to ${range.max}${range.unit}`
            }}
          />
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(next) => settings.set('size', next)}
            min={80}
            max={200}
            step={4}
            unit="px"
          />
          <DemoSwitch
            label="Momentum"
            checked={momentum}
            onCheckedChange={(next) => settings.set('momentum', next)}
          />
          <DemoSwitch
            label="Show value"
            checked={showValue}
            onCheckedChange={(next) => settings.set('showValue', next)}
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(next) => settings.set('disabled', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/torque-dial/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-6">
        <TorqueDial
          value={values[scale]}
          onChange={(next) => setValues((current) => ({ ...current, [scale]: next }))}
          min={min}
          max={max}
          step={step}
          unit={unit}
          label={label || 'Dial control'}
          size={size}
          momentum={momentum}
          showValue={showValue}
          disabled={disabled}
        />
        <p className="max-w-64 text-center text-xs text-pretty text-muted-foreground">
          Drag and let go mid-turn to spin it. Double-click to centre.
        </p>
      </div>
    </DemoPage>
  )
}
