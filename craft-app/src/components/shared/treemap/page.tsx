import { DemoPage } from '../demo-page'

import { Treemap } from './Treemap'
import type { TreemapNode } from './Treemap'

const REVENUE_BY_REGION: TreemapNode = {
  id: 'all',
  label: 'All regions',
  children: [
    {
      id: 'na',
      label: 'North America',
      children: [
        { id: 'us', label: 'United States', value: 18400, color: 24 },
        { id: 'ca', label: 'Canada', value: 2350, color: 19 },
        { id: 'mx', label: 'Mexico', value: 1280, color: 31 },
      ],
    },
    {
      id: 'eu',
      label: 'Europe',
      children: [
        { id: 'de', label: 'Germany', value: 4120, color: 28 },
        { id: 'uk', label: 'United Kingdom', value: 3860, color: 12 },
        { id: 'fr', label: 'France', value: 2740, color: 16 },
        { id: 'nl', label: 'Netherlands', value: 1190, color: 22 },
      ],
    },
    {
      id: 'apac',
      label: 'Asia Pacific',
      children: [
        { id: 'jp', label: 'Japan', value: 3020, color: 9 },
        { id: 'au', label: 'Australia', value: 1960, color: 14 },
        { id: 'sg', label: 'Singapore', value: 880, color: 37 },
      ],
    },
  ],
}

const formatGrowth = (value: number) => `+${value}%`

export function TreemapPage() {
  return (
    <DemoPage
      eyebrow="shared / treemap"
      title="Treemap"
      description="Nested rectangles sized by value and shaded by a second measure. Click a group to zoom in, and use the breadcrumb to step back out."
    >
      <div className="w-full max-w-3xl px-4">
        <Treemap
          data={REVENUE_BY_REGION}
          label="ARR"
          colorLabel="Growth"
          formatColor={formatGrowth}
        />
      </div>
    </DemoPage>
  )
}
