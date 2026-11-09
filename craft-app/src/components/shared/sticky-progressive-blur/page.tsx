import { useState } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { Slider } from '@/components/ui/slider'
import { StickyProgressiveBlur } from '@/components/ui/sticky-progressive-blur'

import { DemoPage } from '../demo-page'

type KnobProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

function Knob({ label, value, min, max, step = 1, onChange }: KnobProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium tracking-[0.16em] uppercase opacity-60">
          {label}
        </span>
        <span className="text-muted-foreground tabular-nums">{value}</span>
      </div>
      <Slider
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  )
}

export function StickyProgressiveBlurPage() {
  const [layers, setLayers] = useState(5)
  const [mask, setMask] = useState(45)
  const [blur, setBlur] = useState(40)
  const [saturate, setSaturate] = useState(0.1)
  const [padding, setPadding] = useState(50)
  const [debug, setDebug] = useState(false)

  return (
    <DemoPage
      eyebrow="ui / sticky-progressive-blur"
      title="Sticky Progressive Blur"
      description="Stacked backdrop-filter layers, each with a sine-eased blur and mask, pin to the bottom of the viewport so images melt into a progressive blur as they scroll."
      align="stretch"
    >
      <div className="flex w-full flex-col items-center gap-12">
        <DemoPanel className="max-w-md">
          <div className="grid gap-5 sm:grid-cols-2">
            <Knob label="Layers" value={layers} min={2} max={10} onChange={setLayers} />
            <Knob label="Mask %" value={mask} min={5} max={100} onChange={setMask} />
            <Knob label="Blur px" value={blur} min={2} max={100} onChange={setBlur} />
            <Knob
              label="Saturate"
              value={saturate}
              min={0}
              max={1}
              step={0.01}
              onChange={setSaturate}
            />
            <Knob label="Padding %" value={padding} min={0} max={100} onChange={setPadding} />
          </div>
          <DemoToggleRow>
            <DemoToggle label="Debug" pressed={debug} onPressedChange={setDebug} />
          </DemoToggleRow>
        </DemoPanel>

        <StickyProgressiveBlur
          layers={layers}
          mask={mask}
          blur={blur}
          saturate={saturate}
          padding={padding}
          debug={debug}
        />
      </div>
    </DemoPage>
  )
}
