import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { FunnelChart } from '@/components/ui/funnel-chart'

import { DATASETS, type FunnelDataset } from './funnel-chart.data'

const DATASET_KEYS = Object.keys(DATASETS) as FunnelDataset[]

const DEFAULTS = {
  dataset: 'signup' as FunnelDataset,
  showSummary: true,
  animated: true,
}

const COMPONENT_DEFAULTS = {
  showSummary: true,
  animated: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'stages',
    type: 'FunnelStage[]',
    description:
      '`{ label, value, color? }` from top of funnel to bottom. Widths scale to the largest value.',
  },
  {
    name: 'formatValue',
    type: '(n: number) => string',
    default: 'Intl compact integers',
    description: 'Formats stage values in the labels, tooltip and screen-reader table.',
  },
  {
    name: 'showSummary',
    type: 'boolean',
    default: 'true',
    description: 'Overall conversion and biggest drop-off line above the chart.',
  },
  {
    name: 'animated',
    type: 'boolean',
    default: 'true',
    description: 'Spring draw-in for bars and bridges. Honours prefers-reduced-motion.',
  },
  {
    name: 'onSelect',
    type: '(index: number | null) => void',
    description: 'Called when a stage is hovered, pressed, or reached with the arrow keys.',
  },
  { name: 'ariaLabel', type: 'string', description: 'Accessible name for the SVG and table caption.' },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function FunnelChartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { dataset, showSummary, animated } = settings.values
  const [run, setRun] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const stages = DATASETS[dataset]

  const usage = toUsageSnippet({
    component: 'FunnelChart',
    from: '@/components/ui/funnel-chart',
    props: {
      stages: { expression: 'stages' },
      showSummary,
      animated,
      onSelect: { expression: '(i) => openStage(i)' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / funnel-chart"
      title="Funnel Chart"
      description="A conversion funnel drawn as SVG bars with curved drop-off bridges and loss chips between stages. Hover, press or use the arrow keys to read each stage; Escape clears. Works in light and dark without a chart library."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Data"
            options={DATASET_KEYS}
            value={dataset}
            onChange={(next) => settings.set('dataset', next)}
          />
          <DemoSwitch
            label="Summary"
            checked={showSummary}
            onCheckedChange={(next) => settings.set('showSummary', next)}
          />
          <DemoSwitch
            label="Animated"
            checked={animated}
            onCheckedChange={(next) => settings.set('animated', next)}
          />
          <DemoAction onClick={() => setRun((value) => value + 1)}>Replay draw-in</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/funnel-chart/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-3">
        <div className="w-full max-w-xl overflow-visible rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
          <FunnelChart
            key={`${dataset}-${run}-${animated}`}
            stages={stages}
            showSummary={showSummary}
            animated={animated}
            ariaLabel={`${dataset} funnel`}
            onSelect={(index) => setSelected(index === null ? null : stages[index].label)}
          />
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {selected
            ? `Last read: ${selected}`
            : 'Hover a stage, press on touch, or focus the chart and use the arrow keys.'}
        </p>
      </div>
    </DemoPage>
  )
}
