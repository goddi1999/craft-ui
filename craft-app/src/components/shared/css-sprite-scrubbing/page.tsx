import { useState } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'
import { CssSpriteScrubbing } from '@/components/ui/css-sprite-scrubbing'

export function CssSpriteScrubbingPage() {
  const [play, setPlay] = useState(false)
  const [steps, setSteps] = useState(true)

  return (
    <div className="bg-background text-foreground">
      <div className="relative z-20 mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-16 pb-8">
        <header className="text-center">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            ui / css-sprite-scrubbing
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            CSS Sprite Scrubbing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Scroll-scrubbed image sequence using view-timeline and CSS custom
            properties. Ported from{' '}
            <a
              href="https://codepen.io/jh3y"
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
          <DemoPanel className="max-w-md">
            <DemoToggleRow>
              <DemoToggle label="Play" pressed={play} onPressedChange={setPlay} />
              <DemoToggle
                label="Stepped"
                pressed={steps}
                onPressedChange={setSteps}
              />
            </DemoToggleRow>
          </DemoPanel>
        </div>
      </div>

      <CssSpriteScrubbing play={play} steps={steps} />
    </div>
  )
}
