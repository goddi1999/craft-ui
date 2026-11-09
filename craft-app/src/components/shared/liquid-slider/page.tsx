import { useState } from 'react'

import { LiquidSlider } from '@/components/ui/liquid-slider'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '../demo-controls'
import { DemoPage } from '../demo-page'

const BLUR_OPTIONS = [0, 2, 6, 13] as const
const ALPHA_OPTIONS = [8, 16, 32] as const
const DELTA_OPTIONS = [0, 5, 12] as const

export function LiquidSliderPage() {
  const [value, setValue] = useState(40)
  const [active, setActive] = useState(false)
  const [debug, setDebug] = useState(false)
  const [springy, setSpringy] = useState(true)
  const [blur, setBlur] = useState<number>(2)
  const [alpha, setAlpha] = useState<number>(16)
  const [deltaCap, setDeltaCap] = useState<number>(5)

  return (
    <DemoPage
      eyebrow="ui / liquid-slider"
      title="Liquid Glass Slider"
      description="A native range input with an SVG-knocked-out track and a thumb that swells into a gooey glass lens on press, stretching with pointer speed."
    >
      <div className="flex w-full flex-col items-center gap-16">
        <div className="flex min-h-48 items-center justify-center">
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
        </div>

        <DemoPanel>
          <p className="text-sm tabular-nums opacity-70">Value: {value}</p>
          <DemoToggleRow>
            <DemoToggle label="Active" pressed={active} onPressedChange={setActive} />
            <DemoToggle label="Debug" pressed={debug} onPressedChange={setDebug} />
            <DemoToggle label="Spring" pressed={springy} onPressedChange={setSpringy} />
          </DemoToggleRow>
          <DemoControlGroup
            title="Goo blur (stdDeviation)"
            options={BLUR_OPTIONS}
            value={blur}
            onChange={setBlur}
          />
          <DemoControlGroup
            title="Goo alpha"
            options={ALPHA_OPTIONS}
            value={alpha}
            onChange={setAlpha}
          />
          <DemoControlGroup
            title="Stretch cap"
            options={DELTA_OPTIONS}
            value={deltaCap}
            onChange={setDeltaCap}
          />
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
