import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'

import { TextReveal } from './TextReveal'
import type {
  TextRevealAccent,
  TextRevealLength,
  TextRevealSize,
} from './text-reveal.types'

const SIZES: TextRevealSize[] = ['sm', 'default', 'lg']
const LENGTHS: TextRevealLength[] = ['compact', 'default', 'long']
const ACCENTS: TextRevealAccent[] = ['cyan', 'amber', 'magenta', 'plain']

const LINES = [
  'Responsive Animated Text Reveals with CSS Scroll-Driven Animations.',
  'No JavaScript ran to fill this in.',
  'Three text-clipped gradients and a view timeline.',
]

export function TextRevealPage() {
  const [size, setSize] = useState<TextRevealSize>('default')
  const [length, setLength] = useState<TextRevealLength>('default')
  const [accent, setAccent] = useState<TextRevealAccent>('cyan')
  const [debug, setDebug] = useState(false)

  return (
    <div data-slot="text-reveal-stage">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-8 pt-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
            shared / text-reveal
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">
            Scroll-driven text reveals
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
            A sticky line whose fill is three gradients clipped to the text,
            swept left to right by a view timeline — so it re-flows at any size
            without measuring a thing. Ported from{' '}
            <a
              href="https://codepen.io/jh3y/pen/abQyPOK"
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
              title="accent"
              options={ACCENTS}
              value={accent}
              onChange={setAccent}
            />
            <DemoToggleRow>
              <DemoToggle
                label="show driver"
                pressed={debug}
                onPressedChange={setDebug}
              />
            </DemoToggleRow>
          </DemoPanel>
        </div>

        <p className="text-center text-sm opacity-60">Scroll 👇</p>
      </div>

      {LINES.map((line) => (
        <TextReveal
          key={`${line}-${length}`}
          text={line}
          size={size}
          length={length}
          accent={accent}
          debug={debug}
        />
      ))}

      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-5xl font-semibold text-white/80">fin.</p>
      </div>
    </div>
  )
}
