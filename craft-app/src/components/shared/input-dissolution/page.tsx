import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  InputDissolution,
  type InputDissolutionNoise,
} from '@/components/ui/input-dissolution'

const NOISE_TYPES: InputDissolutionNoise[] = ['fractalNoise', 'turbulence']

const DEFAULTS = {
  placeholder: 'rockstar@ui.dev',
  submitLabel: 'Enlist',
  rtl: false,
  speed: 2,
  filtered: true,
  debug: false,
  explode: false,
  progress: 0,
  baseFrequency: 1.8,
  numOctaves: 10,
  seed: 1,
  noiseType: 'fractalNoise' as InputDissolutionNoise,
  displacementScale: 20,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'placeholder',
    type: 'string',
    default: "'rockstar@ui.dev'",
    description: 'Placeholder shown in the empty field.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Email address'",
    description: 'Accessible name for the email field.',
  },
  {
    name: 'submitLabel',
    type: 'string',
    default: "'Enlist'",
    description: 'Submit button text, rendered as [LABEL].',
  },
  {
    name: 'onSubmit',
    type: '(value: string) => void',
    description: 'Called with the email when a valid value is submitted, before it dissolves.',
  },
  {
    name: 'rtl',
    type: 'boolean',
    default: 'false',
    description: 'Dissolve right-to-left instead of left-to-right.',
  },
  {
    name: 'speed',
    type: 'number',
    default: '2',
    description: 'Seconds the dissolve sweep takes.',
  },
  {
    name: 'filtered',
    type: 'boolean',
    default: 'true',
    description: 'Run the text copy through the blur and displacement filter.',
  },
  {
    name: 'debug',
    type: 'boolean',
    default: 'false',
    description: 'Freeze the sweep and drive it from progress instead.',
  },
  {
    name: 'explode',
    type: 'boolean',
    default: 'false',
    description: 'In debug, tilt the stage and pull each pass apart in 3D.',
  },
  {
    name: 'progress',
    type: 'number',
    default: '0',
    description: 'Manual sweep position (0–100) used in debug.',
  },
  {
    name: 'baseFrequency',
    type: 'number',
    default: '1.8',
    description: 'feTurbulence base frequency — higher means finer grains.',
  },
  {
    name: 'numOctaves',
    type: 'number',
    default: '10',
    description: 'feTurbulence octaves.',
  },
  {
    name: 'seed',
    type: 'number',
    default: '1',
    description: 'feTurbulence seed.',
  },
  {
    name: 'noiseType',
    type: "'fractalNoise' | 'turbulence'",
    default: "'fractalNoise'",
    description: 'feTurbulence noise type.',
  },
  {
    name: 'displacementScale',
    type: 'number',
    default: '20',
    description: 'feDisplacementMap scale — how far the grains scatter.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function InputDissolutionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    placeholder,
    submitLabel,
    rtl,
    speed,
    filtered,
    debug,
    explode,
    progress,
    baseFrequency,
    numOctaves,
    seed,
    noiseType,
    displacementScale,
  } = settings.values
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null)

  const handleDebugChange = (next: boolean) => {
    settings.set('debug', next)
    if (!next) settings.set('explode', false)
  }

  const usage = toUsageSnippet({
    component: 'InputDissolution',
    from: '@/components/ui/input-dissolution',
    props: {
      placeholder,
      submitLabel,
      rtl,
      speed,
      filtered,
      debug,
      explode: debug ? explode : undefined,
      progress: debug ? progress : undefined,
      noiseType,
      baseFrequency,
      numOctaves,
      seed,
      displacementScale,
    },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / input-dissolution"
      title="Input Dissolution"
      description={
        <>
          Submit a valid email and the text dissolves into grain — a clip-path
          sweep plus an SVG turbulence backdrop-filter. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/raNYLXQ" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Placeholder"
            value={placeholder}
            onValueChange={(value) => settings.set('placeholder', value)}
            maxLength={40}
          />
          <DemoTextField
            label="Submit label"
            value={submitLabel}
            onValueChange={(value) => settings.set('submitLabel', value)}
            maxLength={16}
          />
          <DemoSlider
            label="Speed"
            value={speed}
            onValueChange={(value) => settings.set('speed', value)}
            min={0.5}
            max={10}
            step={0.1}
            unit="s"
          />
          <DemoControlGroup
            title="Noise type"
            options={NOISE_TYPES}
            value={noiseType}
            onChange={(value) => settings.set('noiseType', value)}
          />
          <DemoSlider
            label="Base frequency"
            value={baseFrequency}
            onValueChange={(value) => settings.set('baseFrequency', value)}
            min={0}
            max={2}
            step={0.01}
          />
          <DemoSlider
            label="Octaves"
            value={numOctaves}
            onValueChange={(value) => settings.set('numOctaves', value)}
            min={1}
            max={10}
          />
          <DemoSlider
            label="Seed"
            value={seed}
            onValueChange={(value) => settings.set('seed', value)}
            min={0}
            max={1000}
          />
          <DemoSlider
            label="Displacement"
            value={displacementScale}
            onValueChange={(value) => settings.set('displacementScale', value)}
            min={0}
            max={50}
          />
          <DemoSwitch
            label="Right to left"
            checked={rtl}
            onCheckedChange={(value) => settings.set('rtl', value)}
          />
          <DemoSwitch
            label="Filter"
            checked={filtered}
            onCheckedChange={(value) => settings.set('filtered', value)}
          />
          <DemoSwitch
            label="Debug"
            checked={debug}
            onCheckedChange={handleDebugChange}
          />
          {debug ? (
            <>
              <DemoSwitch
                label="Explode"
                checked={explode}
                onCheckedChange={(value) => settings.set('explode', value)}
              />
              <DemoSlider
                label="Progress"
                value={progress}
                onValueChange={(value) => settings.set('progress', value)}
                min={0}
                max={100}
                unit="%"
              />
            </>
          ) : null}
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/input-dissolution/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <InputDissolution
          placeholder={placeholder}
          submitLabel={submitLabel || DEFAULTS.submitLabel}
          rtl={rtl}
          speed={speed}
          filtered={filtered}
          debug={debug}
          explode={explode}
          progress={progress}
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          seed={seed}
          noiseType={noiseType}
          displacementScale={displacementScale}
          onSubmit={setLastSubmitted}
        />
        <p className="min-h-5 text-xs text-muted-foreground" aria-live="polite">
          {lastSubmitted ? `Enlisted ${lastSubmitted}` : ''}
        </p>
      </div>
    </DemoPage>
  )
}
