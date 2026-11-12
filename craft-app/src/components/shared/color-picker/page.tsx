import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ColorPicker, type ColorFormat, type ColorSwatch } from '@/components/ui/color-picker'

const FORMATS: readonly ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch']
const BACKGROUNDS = {
  white: '#FFFFFF',
  cream: '#F6F1E7',
  ink: '#111113',
} as const
type Background = keyof typeof BACKGROUNDS

const START_COLOR = '#2F6BFF'
const SWATCHES: ColorSwatch[] = [
  { id: 'blue', color: '#2F6BFF' },
  { id: 'violet', color: '#8B5CF6' },
  { id: 'pink', color: '#EC4899' },
  { id: 'amber', color: '#F59E0B' },
  { id: 'green', color: '#10B981' },
]

const DEFAULTS = {
  label: 'Accent',
  background: 'white' as Background,
  format: 'hex' as ColorFormat,
  maxSwatches: 7,
}

const COMPONENT_DEFAULTS = {
  label: 'Color',
  background: '#FFFFFF',
  defaultFormat: 'hex',
  maxSwatches: 7,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'string',
    description: 'The colour, when controlled. Reads hex, rgb(), hsl() or oklch().',
  },
  {
    name: 'defaultValue',
    type: 'string',
    default: "'#2F6BFF'",
    description: 'The starting colour, when uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(hex: string) => void',
    description: 'Gets hex, with two alpha digits when the colour is not opaque.',
  },
  {
    name: 'background',
    type: 'string',
    default: "'#FFFFFF'",
    description: 'What the colour will sit on; the contrast readout grades against it.',
  },
  { name: 'label', type: 'string', default: "'Color'", description: 'Name on the swatch.' },
  {
    name: 'swatches',
    type: 'ColorSwatch[]',
    description: 'Saved colours, when controlled. `{ id, color }` each.',
  },
  {
    name: 'defaultSwatches',
    type: 'ColorSwatch[]',
    default: '[]',
    description: 'The starting saved colours, when uncontrolled.',
  },
  {
    name: 'onSwatchesChange',
    type: '(swatches: ColorSwatch[]) => void',
    description: 'Called on save, delete and reorder.',
  },
  {
    name: 'maxSwatches',
    type: 'number',
    default: '7',
    description: 'Most saved colours; saving past it drops the oldest.',
  },
  {
    name: 'defaultFormat',
    type: "'hex' | 'rgb' | 'hsl' | 'oklch'",
    default: "'hex'",
    description: 'Format the text field starts in. The format button cycles it.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function ColorPickerPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, background, format, maxSwatches } = settings.values
  const [color, setColor] = useState(START_COLOR)
  const backgroundColor = BACKGROUNDS[background]

  const usage = toUsageSnippet({
    component: 'ColorPicker',
    from: '@/components/ui/color-picker',
    props: {
      value: { expression: 'color' },
      onValueChange: { expression: 'setColor' },
      label,
      background: backgroundColor,
      defaultFormat: format,
      maxSwatches,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / color-picker"
      title="Color Picker"
      description="A colour field whose swatch grows into a full picker. Drag the area and sliders, type hex, RGB, HSL or OKLCH while the format label morphs between them, check contrast against the background, and save swatches you can drag, move with Alt and the arrows, or delete. Adapted from uiarc."
      align="start"
      previewClassName="min-h-[34rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={24}
          />
          <DemoControlGroup
            title="Background"
            options={Object.keys(BACKGROUNDS) as Background[]}
            value={background}
            onChange={(next) => settings.set('background', next)}
          />
          <DemoControlGroup
            title="Start format"
            options={FORMATS}
            value={format}
            onChange={(next) => settings.set('format', next)}
          />
          <DemoSlider
            label="Max swatches"
            value={maxSwatches}
            onValueChange={(next) => settings.set('maxSwatches', next)}
            min={3}
            max={7}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/color-picker/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-[44rem] items-start justify-between gap-6">
        <ColorPicker
          // the start format is read once, so a new one remounts the picker
          key={format}
          value={color}
          onValueChange={setColor}
          label={label}
          background={backgroundColor}
          defaultFormat={format}
          defaultSwatches={SWATCHES}
          maxSwatches={maxSwatches}
        />
        <div
          aria-hidden
          style={{ background: backgroundColor }}
          className="hidden w-56 shrink-0 flex-col gap-4 rounded-2xl border p-5 sm:flex"
        >
          <span
            style={{ background: color }}
            className="h-10 rounded-xl shadow-[inset_0_0_0_1px_oklch(0%_0_0/0.08)]"
          />
          <p style={{ color }} className="text-2xl leading-tight font-semibold">
            The quick brown fox
          </p>
          <span style={{ borderColor: color, color }} className="w-fit rounded-full border px-3 py-1 text-xs font-medium">
            {color}
          </span>
        </div>
      </div>
    </DemoPage>
  )
}
