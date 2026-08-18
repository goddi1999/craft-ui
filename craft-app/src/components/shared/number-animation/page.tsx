import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
} from '@/components/shared/demo-controls'

import { NumberAnimation } from './NumberAnimation'
import type {
  NumberAnimationMode,
  NumberAnimationSize,
} from './number-animation.types'

const SIZES: NumberAnimationSize[] = ['sm', 'default', 'lg', 'xl']
const MODES: NumberAnimationMode[] = ['transition', 'animation']
const DURATIONS = [0.4, 1, 2]
const PRESET_VALUES = [0, 25, 55, 80, 100]

export function NumberAnimationPage() {
  const [value, setValue] = useState(55)
  const [size, setSize] = useState<NumberAnimationSize>('lg')
  const [mode, setMode] = useState<NumberAnimationMode>('transition')
  const [duration, setDuration] = useState(1)

  return (
    <div data-slot="number-animation-stage">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
            shared / number-animation
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            CSS number animation
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
            A registered <code>&lt;integer&gt;</code> custom property feeds a
            CSS counter, so the number itself is interpolable — no JavaScript
            ticks a value. Ported from{' '}
            <a
              href="https://codepen.io/jh3y/pen/gbbYZEz"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              jh3y&apos;s CodePen
            </a>
            .
          </p>
        </header>

        <section className="flex flex-col items-center gap-10">
          <div className="flex min-h-40 items-center justify-center">
            <NumberAnimation
              value={value}
              size={size}
              mode={mode}
              duration={duration}
              label="Progress"
            />
          </div>

          <DemoPanel>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] opacity-60">
                value
              </p>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                aria-label="Value"
                className="w-full accent-current"
                onChange={(event) => setValue(Number(event.target.value))}
              />
            </div>
            <DemoControlGroup
              title="presets"
              options={PRESET_VALUES}
              value={value}
              onChange={setValue}
            />
            <DemoControlGroup
              title="mode"
              options={MODES}
              value={mode}
              onChange={setMode}
            />
            <DemoControlGroup
              title="size"
              options={SIZES}
              value={size}
              onChange={setSize}
            />
            <DemoControlGroup
              title="duration"
              options={DURATIONS}
              value={duration}
              onChange={setDuration}
              format={(seconds) => `${seconds}s`}
            />
          </DemoPanel>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] opacity-50">
            Sizes
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {SIZES.map((variantSize) => (
              <li
                key={variantSize}
                className="flex flex-col items-center gap-2 rounded-xl border border-current/10 p-6"
              >
                <NumberAnimation
                  value={value}
                  size={variantSize}
                  mode={mode}
                  duration={duration}
                  label={variantSize}
                />
                <p className="text-xs uppercase tracking-[0.16em] opacity-50">
                  {variantSize}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
