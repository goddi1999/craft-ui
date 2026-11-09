import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import {
  SHIMMER_PRESETS,
  ShimmerAccordion,
  type ShimmerPresetName,
} from '@/components/ui/shimmer-accordion'

import { DemoPage } from '../demo-page'

const PRESET_NAMES = Object.keys(SHIMMER_PRESETS) as ShimmerPresetName[]
const SPEEDS = [0.5, 1, 2] as const

export function ShimmerAccordionPage() {
  const [presetName, setPresetName] = useState<ShimmerPresetName>('Default')
  const [showIcons, setShowIcons] = useState<boolean>(
    SHIMMER_PRESETS.Default.icons,
  )
  const [speed, setSpeed] = useState<number>(1)

  const preset = SHIMMER_PRESETS[presetName]

  const handlePresetChange = (name: ShimmerPresetName) => {
    setPresetName(name)
    setShowIcons(SHIMMER_PRESETS[name].icons)
  }

  return (
    <DemoPage
      eyebrow="ui / shimmer-accordion"
      title="Shimmer Accordion"
      description="A FAQ accordion whose answers are written in by a coloured band of text-clipped gradients, timed in characters per second so every answer reads at the same pace."
    >
      <div className="flex w-full flex-col items-center gap-16 pb-24">
        <ShimmerAccordion
          mode={preset.mode}
          cps={preset.cps * speed}
          textAlpha={preset.textAlpha}
          angle={preset.angle}
          offset={preset.offset}
          stops={preset.stops}
          showIcons={showIcons}
        />

        <DemoPanel>
          <DemoControlGroup
            title={`preset · ${preset.mode}`}
            options={PRESET_NAMES}
            value={presetName}
            onChange={handlePresetChange}
          />
          <DemoControlGroup
            title="speed"
            options={SPEEDS}
            value={speed}
            onChange={setSpeed}
            format={(multiplier) => `${multiplier}×`}
          />
          <DemoToggleRow>
            <DemoToggle
              label="icons"
              pressed={showIcons}
              onPressedChange={setShowIcons}
            />
          </DemoToggleRow>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
