import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'
import { QuantityPicker } from '@/components/ui/quantity-picker'

import { DemoPage } from '../demo-page'

const STEPS = [1, 2, 5, 10] as const
const MINS = [0, 10, 50] as const
const MAXES = [20, 100, 1000] as const

export function QuantityPickerPage() {
  const [value, setValue] = useState(42)
  const [step, setStep] = useState<number>(1)
  const [min, setMin] = useState<number>(0)
  const [max, setMax] = useState<number>(100)

  return (
    <DemoPage
      eyebrow="ui / quantity-picker"
      title="Quantity Picker"
      description="Just an <input type=number> with extras: digits roll on a track as you step, the real input surfaces on focus, and an out-of-range value turns red and shakes when you leave it."
    >
      <div className="flex w-full flex-col items-center gap-16 pb-24">
        <div className="flex flex-col items-center gap-4">
          <QuantityPicker
            value={value}
            onValueChange={setValue}
            min={min}
            max={max}
            step={step}
          />
          <p className="text-xs text-muted-foreground tabular-nums">
            value: {value} · range {min}–{max} · step {step}
          </p>
        </div>

        <DemoPanel>
          <DemoControlGroup
            title="step"
            options={STEPS}
            value={step}
            onChange={setStep}
          />
          <DemoControlGroup
            title="min"
            options={MINS}
            value={min}
            onChange={setMin}
          />
          <DemoControlGroup
            title="max"
            options={MAXES}
            value={max}
            onChange={setMax}
          />
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
