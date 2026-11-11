import { useEffect, useRef } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { Progress } from './Progress'

const STEP = 5
const TICK_MS = 180

const DEFAULTS = {
  value: 64,
  label: 'Uploading report.pdf',
  showValue: true,
}

const COMPONENT_DEFAULTS = { value: 0, showValue: false }

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    default: '0',
    description: 'Current progress, clamped between 0 and max.',
  },
  {
    name: 'max',
    type: 'number',
    default: '100',
    description: 'Value that counts as complete.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Text above the bar; also its accessible name. A new label swaps in.',
  },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'false',
    description: 'Show the percentage, and a check once it reaches 100%.',
  },
  {
    name: '...props',
    type: 'HTMLAttributes<HTMLDivElement>',
    description: 'Any native div attribute, applied to the root.',
  },
]

export function ProgressPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { value, label, showValue } = settings.values
  const timerRef = useRef<number | undefined>(undefined)

  const stopSimulation = () => window.clearInterval(timerRef.current)

  // A fake upload: step the value from 0 to 100, then stop.
  const handleSimulate = () => {
    stopSimulation()
    let current = 0
    settings.set('value', current)
    timerRef.current = window.setInterval(() => {
      current = Math.min(current + STEP, 100)
      settings.set('value', current)
      if (current === 100) stopSimulation()
    }, TICK_MS)
  }

  const handleReset = () => {
    stopSimulation()
    settings.reset()
  }

  useEffect(() => () => window.clearInterval(timerRef.current), [])

  const usage = toUsageSnippet({
    component: 'Progress',
    from: '@/components/shared/progress',
    props: { label, value, showValue },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / progress"
      title="Progress"
      description="A determinate progress bar with a label, a live value readout, and a check when it completes."
      settings={
        <DemoSettings onReset={handleReset} canReset={settings.isDirty}>
          <DemoSlider
            label="Value"
            value={value}
            onValueChange={(next) => {
              stopSimulation()
              settings.set('value', next)
            }}
            min={0}
            max={100}
            unit="%"
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={40}
          />
          <DemoSwitch
            label="Show value"
            checked={showValue}
            onCheckedChange={(next) => settings.set('showValue', next)}
          />
          <DemoAction onClick={handleSimulate}>
            Simulate upload
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/progress/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="w-full max-w-md">
        <Progress label={label || undefined} value={value} showValue={showValue} />
      </div>
    </DemoPage>
  )
}
