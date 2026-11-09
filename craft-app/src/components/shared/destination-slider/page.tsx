import { useState } from 'react'

import { DestinationSlider } from '@/components/ui/destination-slider'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '../demo-controls'
import { DemoPage } from '../demo-page'

const ACCENTS = {
  Coral: 'hsl(10 100% 65%)',
  Violet: 'hsl(265 90% 66%)',
  Lime: 'hsl(90 75% 48%)',
  Sky: 'hsl(200 95% 55%)',
} as const

type AccentName = keyof typeof ACCENTS

const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[]
const BUMP_HEIGHTS = [20, 40, 60] as const
const BUMP_WIDTHS = [100, 150, 220] as const

export function DestinationSliderPage() {
  const [value, setValue] = useState(30)
  const [explode, setExplode] = useState(false)
  const [accent, setAccent] = useState<AccentName>('Coral')
  const [bumpHeight, setBumpHeight] = useState<number>(40)
  const [bumpWidth, setBumpWidth] = useState<number>(150)

  return (
    <DemoPage
      eyebrow="ui / destination-slider"
      title="Destination Slider"
      description="A native range input skinned with SVG and GSAP — the dotted track bumps up under the held marker and a gooey balloon shows where you're headed."
    >
      <div className="flex w-full flex-col items-center gap-16">
        <div className="flex min-h-56 items-center justify-center pt-16">
          <DestinationSlider
            value={value}
            onValueChange={setValue}
            explode={explode}
            accent={ACCENTS[accent]}
            bumpHeight={bumpHeight}
            bumpWidth={bumpWidth}
          />
        </div>

        <DemoPanel>
          <p className="text-sm tabular-nums opacity-70">Value: {value}</p>
          <DemoToggleRow>
            <DemoToggle
              label="Explode"
              pressed={explode}
              onPressedChange={setExplode}
            />
          </DemoToggleRow>
          <DemoControlGroup
            title="Accent"
            options={ACCENT_NAMES}
            value={accent}
            onChange={setAccent}
          />
          <DemoControlGroup
            title="Bump height"
            options={BUMP_HEIGHTS}
            value={bumpHeight}
            onChange={setBumpHeight}
          />
          <DemoControlGroup
            title="Bump width"
            options={BUMP_WIDTHS}
            value={bumpWidth}
            onChange={setBumpWidth}
          />
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
