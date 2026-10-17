import { DemoPage } from '../demo-page'

import { WaffleChart } from './WaffleChart'
import type { WaffleCategory } from './WaffleChart'

const POWER_MIX: WaffleCategory[] = [
  { key: 'wind-solar', label: 'Wind and solar', value: 218 },
  { key: 'hydro', label: 'Hydro', value: 20 },
  { key: 'gas', label: 'Gas', value: 76 },
  { key: 'coal', label: 'Coal', value: 132 },
  { key: 'other', label: 'Other', value: 61 },
]

export function WaffleChartPage() {
  return (
    <DemoPage
      eyebrow="shared / waffle-chart"
      title="Waffle chart"
      description="A 10 by 10 grid of cells where each cell is one percent, so shares read as countable squares."
    >
      <div className="w-full max-w-xl px-4">
        <WaffleChart data={POWER_MIX} label="Electricity generation, 2023" unit="TWh" />
      </div>
    </DemoPage>
  )
}
