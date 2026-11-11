import { useMemo } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  Hyperspeed,
  hyperspeedPresets,
  type HyperspeedOptions,
} from '@/components/ui/hyperspeed'

type PresetName = keyof typeof hyperspeedPresets

const PRESET_NAMES = Object.keys(hyperspeedPresets) as PresetName[]

const PRESET_LABELS: Record<PresetName, string> = {
  one: 'Cyberpunk',
  two: 'Akira',
  three: 'Golden',
  four: 'Split',
  five: 'Sunset',
  six: 'Deep',
}

const DISTORTIONS = [
  'turbulentDistortion',
  'mountainDistortion',
  'xyDistortion',
  'LongRaceDistortion',
  'deepDistortion',
] as const
type DistortionName = (typeof DISTORTIONS)[number]

const DISTORTION_LABELS: Record<DistortionName, string> = {
  turbulentDistortion: 'turbulent',
  mountainDistortion: 'mountain',
  xyDistortion: 'xy',
  LongRaceDistortion: 'long race',
  deepDistortion: 'deep',
}

const presetValues = (name: PresetName) => {
  const preset = hyperspeedPresets[name]
  return {
    distortion: preset.distortion as DistortionName,
    lanesPerRoad: preset.lanesPerRoad,
    lightPairsPerRoadWay: preset.lightPairsPerRoadWay,
    speedUp: preset.speedUp,
  }
}

const DEFAULTS = { preset: 'one' as PresetName, ...presetValues('one') }

const PROPS: DemoPropDoc[] = [
  {
    name: 'effectOptions',
    type: 'Partial<HyperspeedOptions>',
    default: '{}',
    description:
      'Distortion, road size, traffic density, speeds and the colors palette. Merged over the defaults; a new object rebuilds the scene, so memoize it.',
  },
  {
    name: 'effectOptions.distortion',
    type: 'string | Distortion',
    description:
      "'turbulentDistortion', 'mountainDistortion', 'xyDistortion', 'LongRaceDistortion', 'deepDistortion' or a custom shader distortion.",
  },
  {
    name: 'effectOptions.onSpeedUp / onSlowDown',
    type: '(ev: MouseEvent | TouchEvent) => void',
    description: 'Called when the pointer is pressed (accelerate) and released.',
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Reserved for light-theme palette overrides; currently has no effect.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the WebGL host. It fills its positioned parent.',
  },
]

export function HyperspeedPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { preset, distortion, lanesPerRoad, lightPairsPerRoadWay, speedUp } =
    settings.values

  // A new object rebuilds the WebGL scene, so only build one when a setting changes.
  const effectOptions = useMemo<Partial<HyperspeedOptions>>(
    () => ({
      ...(hyperspeedPresets[preset] as Partial<HyperspeedOptions>),
      distortion,
      lanesPerRoad,
      lightPairsPerRoadWay,
      speedUp,
    }),
    [preset, distortion, lanesPerRoad, lightPairsPerRoadWay, speedUp],
  )

  const handlePresetChange = (name: PresetName) => {
    settings.set('preset', name)
    const values = presetValues(name)
    settings.set('distortion', values.distortion)
    settings.set('lanesPerRoad', values.lanesPerRoad)
    settings.set('lightPairsPerRoadWay', values.lightPairsPerRoadWay)
    settings.set('speedUp', values.speedUp)
  }

  const presetDefaults = presetValues(preset)
  const overrides = (
    [
      ['distortion', distortion, `'${distortion}'`],
      ['lanesPerRoad', lanesPerRoad, lanesPerRoad],
      ['lightPairsPerRoadWay', lightPairsPerRoadWay, lightPairsPerRoadWay],
      ['speedUp', speedUp, speedUp],
    ] as const
  )
    .filter(([key, value]) => presetDefaults[key] !== value)
    .map(([key, , source]) => `${key}: ${source}`)
  const optionsSource = overrides.length
    ? `{{ ...hyperspeedPresets.${preset}, ${overrides.join(', ')} }}`
    : `{hyperspeedPresets.${preset}}`

  const usage = toUsageSnippet({
    component: 'Hyperspeed',
    from: '@/components/ui/hyperspeed',
    imports: ['hyperspeedPresets'],
    props: { effectOptions: 'OPTIONS' },
  }).replace('effectOptions="OPTIONS"', `effectOptions=${optionsSource}`)

  return (
    <DemoPage
      eyebrow="ui / hyperspeed"
      title="Hyperspeed"
      description="A Three.js road tunnel with distortable geometry, streaking traffic lights, and bloom — steered entirely by the effectOptions object. Click and hold the scene to speed up."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Preset"
            options={PRESET_NAMES}
            value={preset}
            onChange={handlePresetChange}
            format={(name) => PRESET_LABELS[name]}
          />
          <DemoControlGroup
            title="Distortion"
            options={DISTORTIONS}
            value={distortion}
            onChange={(value) => settings.set('distortion', value)}
            format={(name) => DISTORTION_LABELS[name]}
          />
          <DemoSlider
            label="Lanes per road"
            value={lanesPerRoad}
            onValueChange={(value) => settings.set('lanesPerRoad', value)}
            min={1}
            max={5}
          />
          <DemoSlider
            label="Light pairs per road"
            value={lightPairsPerRoadWay}
            onValueChange={(value) => settings.set('lightPairsPerRoadWay', value)}
            min={10}
            max={80}
            step={5}
          />
          <DemoSlider
            label="Speed-up on hold"
            value={speedUp}
            onValueChange={(value) => settings.set('speedUp', value)}
            min={1}
            max={4}
            step={0.5}
            unit="×"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/hyperspeed/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="relative h-[28rem] w-full overflow-hidden bg-black">
        <Hyperspeed effectOptions={effectOptions} className="absolute inset-0" />
      </div>
    </DemoPage>
  )
}
