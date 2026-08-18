import { useState } from 'react'

import { DemoControlGroup, DemoPanel } from '@/components/shared/demo-controls'

import YearInDots from './YearInDots'

const PALETTES = {
  mono: { elapsed: '#303033', remaining: '#f7f7f7' },
  ember: { elapsed: '#2a1410', remaining: '#ff5a36' },
  mint: { elapsed: '#10241d', remaining: '#4ade80' },
  violet: { elapsed: '#1c1630', remaining: '#a78bfa' },
} as const

type PaletteName = keyof typeof PALETTES

const PALETTE_NAMES = Object.keys(PALETTES) as PaletteName[]

export function YearInDotsPage() {
  const [palette, setPalette] = useState<PaletteName>('mono')
  const { elapsed, remaining } = PALETTES[palette]

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / year-in-dots
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Year in dots
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            One dot per day of the current year, dimmed as each day passes. The
            dot on today&apos;s boundary keeps pulsing, the count refreshes
            itself at midnight, and clicking the card replays the cascade.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <YearInDots elapsedColor={elapsed} remainingColor={remaining} />

          <DemoPanel>
            <DemoControlGroup
              title="palette"
              options={PALETTE_NAMES}
              value={palette}
              onChange={setPalette}
            />
            <p className="text-xs text-muted-foreground">
              Click the card to replay the entrance animation.
            </p>
          </DemoPanel>
        </section>
      </div>
    </div>
  )
}
