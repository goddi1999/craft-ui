import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  BrightnessGlyph,
  ControlSlider,
  FlashlightGlyph,
  VolumeGlyph,
} from '@/components/ui/control-slider'

const DEFAULTS = { stretch: 35, width: 72, height: 168 }
const COMPONENT_DEFAULTS = { stretch: 0.35, width: 72, height: 168 }

const PROPS: DemoPropDoc[] = [
  { name: 'label', type: 'string', description: 'Accessible name, e.g. `Brightness`. Required.' },
  { name: 'value', type: 'number', description: 'Controlled level from 0 to 1.' },
  { name: 'defaultValue', type: 'number', default: '0.5', description: 'Initial level when uncontrolled.' },
  { name: 'onValueChange', type: '(value: number) => void', description: 'Every change while dragging or stepping.' },
  { name: 'onValueCommit', type: '(value: number) => void', description: 'Once when a drag, tap or key press settles.' },
  {
    name: 'icon',
    type: 'ReactNode | (value: number) => ReactNode',
    description: 'Glyph at the bottom. `BrightnessGlyph`, `VolumeGlyph` and `FlashlightGlyph` react to the value.',
  },
  {
    name: 'toggle',
    type: 'boolean',
    default: 'false',
    description: 'A tap flips between off and the last level; Enter and Space do the same.',
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.35',
    description: 'How far a drag past either end stretches the tile, as a share of its height. 0 turns it off.',
  },
  { name: 'width', type: 'number', default: '72', description: 'Tile width in px.' },
  { name: 'height', type: 'number', default: '168', description: 'Tile height in px; also the drag distance from 0 to 1.' },
  { name: 'step', type: 'number', default: '0.05', description: 'Arrow-key step.' },
]

export function ControlSliderPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { stretch, width, height } = settings.values
  const [brightness, setBrightness] = useState(0.8)
  const [volume, setVolume] = useState(0.45)
  const [torch, setTorch] = useState(0)

  const shared = { stretch: stretch / 100, width, height }

  const usage = toUsageSnippet({
    component: 'ControlSlider',
    from: '@/components/ui/control-slider',
    props: {
      label: 'Brightness',
      value: { expression: 'level' },
      onValueChange: { expression: 'setLevel' },
      icon: { expression: '(value) => <BrightnessGlyph value={value} />' },
      ...shared,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  const readout = (label: string, value: number) => (
    <span>
      {label} <span className="text-foreground tabular-nums">{Math.round(value * 100)}%</span>
    </span>
  )

  return (
    <DemoPage
      eyebrow="ui / control-slider"
      title="Control Slider"
      description="Control Center tiles. Drag anywhere on a tile to set the level, without it jumping to your finger; drag past either end and the tile stretches that way, narrowing a little, then springs back. The torch also toggles on a tap."
      previewClassName="min-h-[380px]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Stretch"
            value={stretch}
            onValueChange={(next) => settings.set('stretch', next)}
            min={0}
            max={60}
            unit="%"
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={56}
            max={96}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Height"
            value={height}
            onValueChange={(next) => settings.set('height', next)}
            min={120}
            max={220}
            step={4}
            unit="px"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/control-slider/'], usage, props: PROPS }}
    >
      <div className="flex flex-col items-center gap-8 py-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <ControlSlider
            label="Brightness"
            value={brightness}
            onValueChange={setBrightness}
            icon={(value) => <BrightnessGlyph value={value} />}
            {...shared}
          />
          <ControlSlider
            label="Volume"
            value={volume}
            onValueChange={setVolume}
            icon={(value) => <VolumeGlyph value={value} />}
            {...shared}
          />
          <ControlSlider
            label="Torch"
            value={torch}
            onValueChange={setTorch}
            toggle
            icon={(value) => <FlashlightGlyph value={value} />}
            {...shared}
          />
        </div>
        <p className="flex gap-4 text-xs text-muted-foreground">
          {readout('Brightness', brightness)}
          {readout('Volume', volume)}
          {readout('Torch', torch)}
        </p>
      </div>
    </DemoPage>
  )
}
