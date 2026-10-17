import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { BrushChart } from './BrushChart'
import type { BrushChartAnnotation, BrushChartDatum } from './BrushChart'

const DAYS = 365
const VISIBLE_DAYS = 90
const DAY_MS = 24 * 60 * 60 * 1000
const START = Date.UTC(2025, 9, 1)

// Deterministic growth with weekly dips stands in for real usage.
const DAILY_ACTIVE_USERS: BrushChartDatum[] = Array.from(
  { length: DAYS },
  (_, day) => ({
    date: START + day * DAY_MS,
    value: Math.round(
      4_000 + day * 18 + Math.sin(day / 9) * 600 - (day % 7 >= 5 ? 900 : 0),
    ),
  }),
)

const ANNOTATIONS: BrushChartAnnotation[] = [
  {
    date: Date.UTC(2026, 2, 24),
    label: 'v2',
    description: 'Offline mode and shared spaces',
  },
]

const lastDate = START + (DAYS - 1) * DAY_MS

export function BrushChartPage() {
  const [range, setRange] = useState<[number, number]>([
    lastDate - VISIBLE_DAYS * DAY_MS,
    lastDate,
  ])

  return (
    <DemoPage
      eyebrow="shared / brush-chart"
      title="Brush chart"
      description="A detail chart paired with an overview strip. Drag the window or its edges below to choose the range shown above."
    >
      <div className="w-full max-w-3xl px-4">
        <BrushChart
          data={DAILY_ACTIVE_USERS}
          label="Daily active users"
          unit="users"
          range={range}
          onRangeChange={setRange}
          annotations={ANNOTATIONS}
        />
      </div>
    </DemoPage>
  )
}
