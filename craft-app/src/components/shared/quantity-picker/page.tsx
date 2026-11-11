import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { QuantityPicker } from '@/components/ui/quantity-picker'

const DEFAULTS = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  readOnly: false,
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
    default: 'min',
    description: 'Starting value when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Called with every valid number, from typing or the buttons.',
  },
  {
    name: 'min',
    type: 'number',
    default: '0',
    description: 'Lowest accepted value.',
  },
  {
    name: 'max',
    type: 'number',
    default: '100',
    description: 'Highest accepted value.',
  },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Amount the buttons add or remove; also used for validity.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dim the picker and ignore input.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    default: 'false',
    description: 'Show the value but lock the buttons and the input.',
  },
  {
    name: 'name',
    type: 'string',
    default: "'quantity'",
    description: 'Form field name of the inner input.',
  },
  {
    name: 'id',
    type: 'string',
    description: 'Id of the inner input, for an external label.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Quantity'",
    description: 'Accessible name of the group.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root element.',
  },
]

export function QuantityPickerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { min, max, step, disabled, readOnly } = settings.values
  const [value, setValue] = useState(42)

  const usage = toUsageSnippet({
    component: 'QuantityPicker',
    from: '@/components/ui/quantity-picker',
    props: { value, min, max, step, disabled, readOnly },
    defaults: DEFAULTS,
  }).replace(`value={${value}}`, 'value={value} onValueChange={setValue}')

  return (
    <DemoPage
      eyebrow="ui / quantity-picker"
      title="Quantity Picker"
      description="Just an <input type=number> with extras: digits roll on a track as you step, the real input surfaces on focus, and an out-of-range value turns red and shakes when you leave it."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Min"
            value={min}
            onValueChange={(next) => settings.set('min', next)}
            min={0}
            max={50}
          />
          <DemoSlider
            label="Max"
            value={max}
            onValueChange={(next) => settings.set('max', next)}
            min={60}
            max={1000}
            step={10}
          />
          <DemoSlider
            label="Step"
            value={step}
            onValueChange={(next) => settings.set('step', next)}
            min={1}
            max={10}
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(next) => settings.set('disabled', next)}
          />
          <DemoSwitch
            label="Read only"
            checked={readOnly}
            onCheckedChange={(next) => settings.set('readOnly', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/quantity-picker/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <QuantityPicker
          value={value}
          onValueChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
        />
        <p className="text-xs text-muted-foreground tabular-nums">
          value {value} · range {min}–{max} · step {step}
        </p>
      </div>
    </DemoPage>
  )
}
