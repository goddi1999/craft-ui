import { useState } from 'react'

import {
  DemoControlGroup,
  DemoPanel,
} from '@/components/shared/demo-controls'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PixelTransition } from '@/components/ui/pixel-transition'

const CELL_OPTIONS = [8, 12, 16] as const
const FRAME_OPTIONS = [8, 12, 16] as const

export function PixelTransitionPage() {
  const [cells, setCells] = useState<(typeof CELL_OPTIONS)[number]>(12)
  const [frames, setFrames] = useState<(typeof FRAME_OPTIONS)[number]>(12)
  const [speed, setSpeed] = useState(0.25)
  const [delay, setDelay] = useState(0.4)
  const [flipped, setFlipped] = useState(false)
  const [regenKey, setRegenKey] = useState(0)

  return (
    <DemoPage
      eyebrow="ui / pixel-transition"
      title="Pixel Transitions with Generated SVG Masks"
      description="Crossfade two images through a generated SVG pixel-mask sprite sheet. Click the image (or Transition) to flip."
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-4 pb-20">
        <PixelTransition
          key={`${cells}-${frames}-${regenKey}`}
          cells={cells}
          frames={frames}
          speed={speed}
          delay={delay}
          flipped={flipped}
          onFlippedChange={setFlipped}
        />

        <DemoPanel>
          <Button type="button" onClick={() => setFlipped((f) => !f)}>
            Transition
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setRegenKey((k) => k + 1)}
          >
            Regenerate sprites
          </Button>

          <DemoControlGroup
            title="cells"
            options={[...CELL_OPTIONS]}
            value={cells}
            onChange={setCells}
          />

          <DemoControlGroup
            title="frames"
            options={[...FRAME_OPTIONS]}
            value={frames}
            onChange={setFrames}
          />

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Speed (s)
            </span>
            <Input
              type="number"
              min={0.2}
              max={2}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value) || 0.25)}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Delay (×)
            </span>
            <Input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value) || 0)}
            />
          </label>
        </DemoPanel>
      </div>
    </DemoPage>
  )
}
