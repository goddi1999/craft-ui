import { useEffect, useState } from 'react'

import { DemoPage } from '../demo-page'

import { Progress } from './Progress'

const FILE_SIZE = 4_800
const CHUNK = 240
const TICK_MS = 180

export function ProgressPage() {
  const [sent, setSent] = useState(0)

  useEffect(() => {
    // Loop the fake upload so the bar keeps showing its fill and finish states.
    const id = window.setInterval(() => {
      setSent((current) => (current >= FILE_SIZE ? 0 : current + CHUNK))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <DemoPage
      eyebrow="shared / progress"
      title="Progress"
      description="A determinate progress bar with a label, a live value readout, and a check when it completes."
    >
      <div className="w-full max-w-md px-4">
        <Progress
          label="Uploading report.pdf"
          value={sent}
          max={FILE_SIZE}
          showValue
        />
      </div>
    </DemoPage>
  )
}
