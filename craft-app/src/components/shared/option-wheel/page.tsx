import { useState } from 'react'

import OptionWheel from './OptionWheel'

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

export function OptionWheelPage() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / option-wheel
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Option wheel
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A curved, draggable picker that bends its options along an arc and
            blurs them as they fall away from the centre.
          </p>
        </header>

        <section className="flex flex-col items-center gap-6">
          {/* The wheel is `h-full` with absolutely positioned items, so it
              needs a sized surface; its default palette is tuned for dark. */}
          <div className="h-[26rem] w-full max-w-md overflow-hidden rounded-2xl bg-neutral-950 p-6">
            <OptionWheel
              items={GENRES}
              selectedIndex={selected}
              onChange={(index) => setSelected(index)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium">{GENRES[selected]}</span>
          </p>
        </section>
      </div>
    </div>
  )
}
