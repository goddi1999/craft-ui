import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'

import { ScrollToType } from './ScrollToType'
import type {
  ScrollToTypeLength,
  ScrollToTypeSize,
  ScrollToTypeTheme,
} from './scroll-to-type.types'

const SIZES: ScrollToTypeSize[] = ['sm', 'default', 'lg']
const LENGTHS: ScrollToTypeLength[] = ['compact', 'default', 'long']
const THEMES: ScrollToTypeTheme[] = ['system', 'light', 'dark']
const HUES = [320, 200, 140, 40]

const SAMPLES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquet nulla ac magna semper, at condimentum orci ultrices.',
  'Scroll the page and the caret walks the line one character at a time.',
]

export function ScrollToTypePage() {
  const [size, setSize] = useState<ScrollToTypeSize>('default')
  const [length, setLength] = useState<ScrollToTypeLength>('default')
  const [theme, setTheme] = useState<ScrollToTypeTheme>('system')
  const [cursorHue, setCursorHue] = useState(320)
  const [sample, setSample] = useState(0)

  return (
    <div data-slot="scroll-to-type-stage" data-theme={theme}>
      <div className="relative z-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-8 pt-16">
          <header className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
              shared / scroll-to-type
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">
              Scroll to type
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
              A stepped view-timeline animation converts scroll distance into a
              character index, and two text-clipped gradients draw the fill and
              a blinking caret block. Ported from{' '}
              <a
                href="https://codepen.io/jh3y/pen/YPKmwOv"
                className="underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                jh3y&apos;s CodePen
              </a>
              .
            </p>
          </header>

          <div className="flex justify-center">
            <DemoPanel>
              <DemoControlGroup
                title="text"
                options={[0, 1]}
                value={sample}
                onChange={setSample}
                format={(index) => (index === 0 ? 'lorem' : 'short')}
              />
              <DemoControlGroup
                title="size"
                options={SIZES}
                value={size}
                onChange={setSize}
              />
              <DemoControlGroup
                title="length"
                options={LENGTHS}
                value={length}
                onChange={setLength}
              />
              <DemoControlGroup
                title="cursor hue"
                options={HUES}
                value={cursorHue}
                onChange={setCursorHue}
              />
              <DemoControlGroup
                title="theme"
                options={THEMES}
                value={theme}
                onChange={setTheme}
              />
            </DemoPanel>
          </div>

          <p className="text-center text-sm opacity-60">Scroll down 👇</p>
        </div>

        <ScrollToType
          key={`${sample}-${length}`}
          text={SAMPLES[sample]}
          size={size}
          length={length}
          theme={theme}
          cursorHue={cursorHue}
        />

        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-2xl opacity-40">fin.</p>
        </div>
      </div>
    </div>
  )
}
