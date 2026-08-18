import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'

import { FlickeringGrid } from './FlickeringGrid'

const SIZES = [3, 4, 6, 10]
const CHANCES = [0.05, 0.12, 0.3]
const COLORS = ['#60a5fa', '#34d399', '#f472b6', '#facc15']

export function FlickeringGridPage() {
  const [squareSize, setSquareSize] = useState(4)
  const [flickerChance, setFlickerChance] = useState(0.12)
  const [color, setColor] = useState('#60a5fa')

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / flickering-grid
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Flickering grid
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A canvas grid whose squares randomly change opacity, throttled to a
            target frame rate and paused when the tab is hidden or the reader
            prefers reduced motion.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-neutral-950">
            <FlickeringGrid
              key={`${squareSize}-${flickerChance}-${color}`}
              squareSize={squareSize}
              gridGap={6}
              flickerChance={flickerChance}
              color={color}
              maxOpacity={0.6}
              className="absolute inset-0"
            />
          </div>

          <DemoPanel>
            <DemoControlGroup
              title="square size"
              options={SIZES}
              value={squareSize}
              onChange={setSquareSize}
              format={(size) => `${size}px`}
            />
            <DemoControlGroup
              title="flicker chance"
              options={CHANCES}
              value={flickerChance}
              onChange={setFlickerChance}
            />
            <DemoControlGroup
              title="color"
              options={COLORS}
              value={color}
              onChange={setColor}
            />
          </DemoPanel>
        </section>
      </div>
    </div>
  )
}
