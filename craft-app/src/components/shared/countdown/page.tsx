import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { Countdown } from './Countdown'

const DAY_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000

export function CountdownPage() {
  // Targets are relative to page load so the demo never reaches zero.
  const [{ keynoteAt, saleEndsAt }] = useState(() => {
    const now = Date.now()
    return {
      keynoteAt: now + 3 * DAY_MS + 4 * HOUR_MS,
      saleEndsAt: now + 5 * HOUR_MS,
    }
  })

  return (
    <DemoPage
      eyebrow="shared / countdown"
      title="Countdown"
      description="Rolling digits that count down to a moment in a given time zone, with a compact inline variant."
    >
      <div className="flex flex-col items-center gap-12 px-4">
        <Countdown target={keynoteAt} label="Keynote starts in" />
        <Countdown
          variant="compact"
          units={['hours', 'minutes', 'seconds']}
          target={saleEndsAt}
          label="Sale ends in"
          completeLabel="Ended"
        />
      </div>
    </DemoPage>
  )
}
