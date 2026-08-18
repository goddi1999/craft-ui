import { useState } from 'react'

import {
  DemoPanel,
  DemoToggle,
  DemoToggleRow,
} from '@/components/shared/demo-controls'

import YoutubeEmbed from './YoutubeEmbed'

const VIDEO_ID = 'dQw4w9WgXcQ'

export function YoutubeEmbedPage() {
  const [mask, setMask] = useState(true)
  const [controls, setControls] = useState(false)
  const [mute, setMute] = useState(true)

  return (
    <div className="min-h-svh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            shared / youtube-embed
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            YouTube embed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            A YouTube iframe wrapper that builds its own player URL and can mask
            the chrome so the video reads as background art.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <YoutubeEmbed
            videoId={VIDEO_ID}
            mask={mask}
            controls={controls}
            mute={mute}
            className="w-full overflow-hidden rounded-2xl"
          />

          <DemoPanel>
            <DemoToggleRow>
              <DemoToggle label="mask" pressed={mask} onPressedChange={setMask} />
              <DemoToggle
                label="controls"
                pressed={controls}
                onPressedChange={setControls}
              />
              <DemoToggle label="mute" pressed={mute} onPressedChange={setMute} />
            </DemoToggleRow>
          </DemoPanel>
        </section>
      </div>
    </div>
  )
}
