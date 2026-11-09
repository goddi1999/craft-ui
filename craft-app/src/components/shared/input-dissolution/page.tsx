import { useState, type ReactNode } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Input } from '@/components/ui/input'
import {
  InputDissolution,
  type InputDissolutionNoise,
} from '@/components/ui/input-dissolution'

const NOISE_TYPES: InputDissolutionNoise[] = ['fractalNoise', 'turbulence']

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

export function InputDissolutionPage() {
  const [rtl, setRtl] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [filtered, setFiltered] = useState(true)
  const [debug, setDebug] = useState(false)
  const [explode, setExplode] = useState(false)
  const [progress, setProgress] = useState(0)
  const [baseFrequency, setBaseFrequency] = useState(1.8)
  const [numOctaves, setNumOctaves] = useState(10)
  const [seed, setSeed] = useState(1)
  const [noiseType, setNoiseType] =
    useState<InputDissolutionNoise>('fractalNoise')
  const [displacementScale, setDisplacementScale] = useState(20)
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null)

  const handleDebugChange = (next: boolean) => {
    setDebug(next)
    if (!next) setExplode(false)
  }

  return (
    <DemoPage
      eyebrow="ui / input-dissolution"
      title="Input Dissolution"
      description="Submit a valid email and the text dissolves into grain — a clip-path sweep plus an SVG turbulence backdrop-filter."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 px-4 pb-20">
        <div className="flex min-h-72 w-full flex-col items-center justify-center gap-4 py-10">
          <InputDissolution
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

        <DemoPanel>
          <Field label={`Speed · ${speed}s`}>
            <Input
              type="range"
              min={1}
              max={10}
              step={0.1}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </Field>

          <DemoToggleRow>
            <DemoToggle label="RTL" pressed={rtl} onPressedChange={setRtl} />
            <DemoToggle
              label="Filter"
              pressed={filtered}
              onPressedChange={setFiltered}
            />
            <DemoToggle
              label="Debug"
              pressed={debug}
              onPressedChange={handleDebugChange}
            />
            {debug && (
              <DemoToggle
                label="Explode"
                pressed={explode}
                onPressedChange={setExplode}
              />
            )}
          </DemoToggleRow>

          {debug && (
            <Field label={`Progress · ${progress}`}>
              <Input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
              />
            </Field>
          )}

          <DemoControlGroup
            title="Noise type"
            options={NOISE_TYPES}
            value={noiseType}
            onChange={setNoiseType}
          />
          <Field label={`Base frequency · ${baseFrequency}`}>
            <Input
              type="range"
              min={0}
              max={2}
              step={0.001}
              value={baseFrequency}
              onChange={(event) => setBaseFrequency(Number(event.target.value))}
            />
          </Field>
          <Field label={`Octaves · ${numOctaves}`}>
            <Input
              type="range"
              min={0}
              max={10}
              value={numOctaves}
              onChange={(event) => setNumOctaves(Number(event.target.value))}
            />
          </Field>
          <Field label={`Seed · ${seed}`}>
            <Input
              type="range"
              min={0}
              max={1000}
              value={seed}
              onChange={(event) => setSeed(Number(event.target.value))}
            />
          </Field>
          <Field label={`Displacement · ${displacementScale}`}>
            <Input
              type="range"
              min={0}
              max={50}
              value={displacementScale}
              onChange={(event) =>
                setDisplacementScale(Number(event.target.value))
              }
            />
          </Field>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
