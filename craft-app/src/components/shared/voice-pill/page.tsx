import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { VoicePill } from './VoicePill'
import type { VoicePillStopReason } from './VoicePill'

export function VoicePillPage() {
  const [lastTake, setLastTake] = useState<string | null>(null)

  const handleStop = (info: {
    reason: VoicePillStopReason
    duration: number
  }) => {
    setLastTake(`${info.reason} after ${(info.duration / 1000).toFixed(1)}s`)
  }

  return (
    <DemoPage
      eyebrow="shared / voice-pill"
      title="Voice pill"
      description="Tap to toggle, or hold to talk. The mic button grows into a live waveform pill with a timer; slide left to cancel."
    >
      <div className="flex flex-col items-center gap-6 px-4">
        <VoicePill onStop={handleStop} />
        <p className="text-sm text-muted-foreground">
          {lastTake ? `Last take: ${lastTake}` : 'Simulated input, no microphone needed.'}
        </p>
      </div>
    </DemoPage>
  )
}
