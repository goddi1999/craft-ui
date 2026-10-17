import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { CometDial } from './CometDial'

export function CometDialPage() {
  const [volume, setVolume] = useState(40)

  return (
    <DemoPage
      eyebrow="shared / comet-dial"
      title="Comet dial"
      description="A rotary control with a glowing comet tail. Drag or flick it and the value coasts with momentum before springing into place."
    >
      <div className="flex flex-col items-center gap-6 px-4">
        {/* The dial draws light ink, so it sits on a dark stage in both themes. */}
        <div className="rounded-[2.5rem] bg-zinc-950 p-10">
          <CometDial
            label="Volume"
            unit="%"
            value={volume}
            onChange={setVolume}
          />
        </div>
        <p className="text-sm text-muted-foreground">Volume: {volume}%</p>
      </div>
    </DemoPage>
  )
}
