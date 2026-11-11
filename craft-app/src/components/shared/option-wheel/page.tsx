import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { OptionWheel, type OptionWheelSide } from './OptionWheel'

const GENRES = [
  'Ambient',
  'House',
  'Techno',
  'Jazz',
  'Lo-Fi',
  'Synthwave',
  'Trance',
  'Funk',
  'Disco',
  'Hip-Hop',
  'Chillwave',
  'Drum & Bass',
]

const SIDES: OptionWheelSide[] = ['left', 'right']

/** Theme tokens instead of the dark-tuned default greys. */
const TEXT_COLOR = 'var(--muted-foreground)'
const ACTIVE_COLOR = 'var(--foreground)'

const DEFAULTS = {
  side: 'left' as OptionWheelSide,
  fontSize: 3,
  tilt: 6,
  blur: 2,
  /** Demo shows fade as a percentage; the prop takes 0–1. */
  fadePercent: 25,
  inset: 80,
  loop: false,
  draggable: true,
}

const COMPONENT_DEFAULTS = { ...DEFAULTS, fade: 0.25 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'string[]',
    default: 'DEFAULT_ITEMS',
    description: 'Options on the wheel.',
  },
  {
    name: 'defaultSelected',
    type: 'number',
    default: '3',
    description: 'Index selected on first render.',
  },
  {
    name: 'selectedIndex',
    type: 'number',
    description: 'Controlled selection — the wheel spins to it when it changes.',
  },
  {
    name: 'onChange',
    type: '(index: number, item: string) => void',
    description: 'Called each time a new option reaches the centre.',
  },
  {
    name: 'side',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Edge the labels align to; the arc bends away from it.',
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '3',
    description: 'Label size in rem. Shrinks on its own when the longest label would not fit.',
  },
  {
    name: 'spacing',
    type: 'number',
    default: '1.4',
    description: 'Row height as a multiple of the font size.',
  },
  {
    name: 'curve',
    type: 'number',
    default: '1',
    description: 'How far rows bend sideways along the arc; 0 keeps them in a straight column.',
  },
  {
    name: 'tilt',
    type: 'number',
    default: '6',
    description: 'Degrees each row rotates per step from the centre.',
  },
  {
    name: 'blur',
    type: 'number',
    default: '2',
    description: 'Blur in px added per step from the centre.',
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.25',
    description: 'Opacity lost per step from the centre.',
  },
  {
    name: 'minOpacity',
    type: 'number',
    default: '0.05',
    description: 'Opacity floor for the farthest rows.',
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '200',
    description: 'Easing time constant in ms — higher glides longer.',
  },
  {
    name: 'inset',
    type: 'number',
    default: '80',
    description: 'Distance in px from the aligned edge to the labels.',
  },
  {
    name: 'loop',
    type: 'boolean',
    default: 'false',
    description: 'Wrap around past the last option.',
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Allow dragging up and down to spin. Wheel, click and arrow keys always work.',
  },
  {
    name: 'textColor',
    type: 'string',
    default: "'#a6a6a6'",
    description: 'Colour of the rows away from the centre.',
  },
  {
    name: 'activeColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Colour of the centred row.',
  },
  {
    name: 'soundUrl',
    type: 'string',
    default: "''",
    description: 'Audio file played as a tick on each step. Empty for silence.',
  },
  {
    name: 'soundVolume',
    type: 'number',
    default: '0.5',
    description: 'Tick volume, 0–1.',
  },
]

export function OptionWheelPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { side, fontSize, tilt, blur, fadePercent, inset, loop, draggable } =
    settings.values
  const [selected, setSelected] = useState(3)
  const fade = fadePercent / 100

  const usage = toUsageSnippet({
    component: 'OptionWheel',
    from: '@/components/shared/option-wheel',
    props: {
      side,
      fontSize,
      tilt,
      blur,
      fade,
      inset,
      loop,
      draggable,
      textColor: TEXT_COLOR,
      activeColor: ACTIVE_COLOR,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="shared / option-wheel"
      title="Option wheel"
      description="A curved, draggable picker that bends its options along an arc and blurs them as they fall away from the centre. Drag, scroll, click a row or use the arrow keys."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Side"
            options={SIDES}
            value={side}
            onChange={(value) => settings.set('side', value)}
          />
          <DemoSlider
            label="Font size"
            value={fontSize}
            onValueChange={(value) => settings.set('fontSize', value)}
            min={1.5}
            max={4}
            step={0.5}
            unit="rem"
          />
          <DemoSlider
            label="Tilt"
            value={tilt}
            onValueChange={(value) => settings.set('tilt', value)}
            min={0}
            max={15}
            unit="°"
          />
          <DemoSlider
            label="Blur"
            value={blur}
            onValueChange={(value) => settings.set('blur', value)}
            min={0}
            max={6}
            unit="px"
          />
          <DemoSlider
            label="Fade per step"
            value={fadePercent}
            onValueChange={(value) => settings.set('fadePercent', value)}
            min={0}
            max={50}
            step={5}
            unit="%"
          />
          <DemoSlider
            label="Inset"
            value={inset}
            onValueChange={(value) => settings.set('inset', value)}
            min={0}
            max={120}
            step={4}
            unit="px"
          />
          <DemoSwitch
            label="Loop"
            checked={loop}
            onCheckedChange={(value) => settings.set('loop', value)}
          />
          <DemoSwitch
            label="Draggable"
            checked={draggable}
            onCheckedChange={(value) => settings.set('draggable', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/option-wheel/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full flex-col items-center gap-4">
        {/* The items are absolutely positioned, so the wheel needs a sized box. */}
        <div className="h-[24rem] w-full max-w-md">
          <OptionWheel
            items={GENRES}
            selectedIndex={selected}
            onChange={(index) => setSelected(index)}
            side={side}
            fontSize={fontSize}
            tilt={tilt}
            blur={blur}
            fade={fade}
            inset={inset}
            loop={loop}
            draggable={draggable}
            textColor={TEXT_COLOR}
            activeColor={ACTIVE_COLOR}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{GENRES[selected]}</span>
        </p>
      </div>
    </DemoPage>
  )
}
