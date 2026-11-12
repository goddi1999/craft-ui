import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { NumberStepper } from '@/components/ui/number-stepper'

const STEPS = [1, 2, 5] as const
const START_SEATS = 2

const DEFAULTS = { min: 1, max: 8, step: 1 as (typeof STEPS)[number] }

const COMPONENT_DEFAULTS = { min: 0, max: 99, step: 1 }

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'number', description: 'Controlled value.' },
  {
    name: 'defaultValue',
    type: 'number',
    default: '0',
    description: 'Value on mount when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Called with the next value. Presses at a limit kick instead and do not call it.',
  },
  { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
  { name: 'max', type: 'number', default: '99', description: 'Highest value.' },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'How much one press moves the value; the last press before a limit lands on it.',
  },
  {
    name: 'label',
    type: 'ReactNode',
    description: "Title on the left, also the group's accessible name.",
  },
  { name: 'description', type: 'ReactNode', description: 'Smaller line under the label.' },
  {
    name: 'decrementLabel',
    type: 'string',
    default: "'Decrease'",
    description: 'Accessible name of the − button.',
  },
  {
    name: 'incrementLabel',
    type: 'string',
    default: "'Increase'",
    description: 'Accessible name of the + button.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the row.' },
]

export function NumberStepperPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { min, max, step } = settings.values
  const [seats, setSeats] = useState(START_SEATS)
  // the bounds can move under the value, so show it clamped
  const value = Math.min(max, Math.max(min, seats))
  const description = `Up to ${max} on the Team plan`

  const usage = toUsageSnippet({
    component: 'NumberStepper',
    from: '@/components/ui/number-stepper',
    props: {
      value: { expression: 'seats' },
      onValueChange: { expression: 'setSeats' },
      min,
      max,
      step,
      label: 'Seats',
      description,
      decrementLabel: 'Remove a seat',
      incrementLabel: 'Add a seat',
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / number-stepper"
      title="Number Stepper"
      description="A row stepper whose number rolls on one soft spring: going up, the new value rises in from below as the old one leaves the top, and going down runs the other way. At a limit the button dims, and pressing it anyway gives it and the number a small sideways kick. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Min"
            value={min}
            onValueChange={(next) => settings.set('min', next)}
            min={0}
            max={4}
          />
          <DemoSlider
            label="Max"
            value={max}
            onValueChange={(next) => settings.set('max', next)}
            min={5}
            max={20}
          />
          <DemoControlGroup
            title="Step"
            options={STEPS}
            value={step}
            onChange={(next) => settings.set('step', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/number-stepper/'], usage, props: PROPS }}
    >
      <NumberStepper
        value={value}
        onValueChange={setSeats}
        min={min}
        max={max}
        step={step}
        label="Seats"
        description={description}
        decrementLabel="Remove a seat"
        incrementLabel="Add a seat"
      />
    </DemoPage>
  )
}
