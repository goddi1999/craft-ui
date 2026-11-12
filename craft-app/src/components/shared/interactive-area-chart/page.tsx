import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  DEFAULT_AREA_CHART_DATA,
  InteractiveAreaChart,
  makeSeries,
  type AreaChartData,
} from '@/components/ui/interactive-area-chart'

const RANGES = ['7D', '30D', '1Y'] as const
type Range = (typeof RANGES)[number]

// the same ranges trending down, to show the falling colour and the morph between datasets
const DECLINE: AreaChartData = {
  '7D': makeSeries(7, 5, 13600, -170, 800),
  '30D': makeSeries(30, 17, 14200, -55, 900),
  '1Y': makeSeries(365, 41, 16800, -16, 600),
}

const DATASETS = { growth: DEFAULT_AREA_CHART_DATA, decline: DECLINE }
type Dataset = keyof typeof DATASETS

const DEFAULTS = {
  title: 'Portfolio Valuation',
  dataset: 'growth' as Dataset,
  defaultRange: '30D' as Range,
  height: 260,
}

const COMPONENT_DEFAULTS = { title: 'Revenue', defaultRange: '30D', height: 280 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: 'Record<string, { date: number; value: number }[]>',
    default: 'DEFAULT_AREA_CHART_DATA',
    description:
      'Series keyed by range label, oldest first, dates in UTC ms. New data morphs in. `makeSeries` builds seeded demo series.',
  },
  {
    name: 'defaultRange',
    type: 'string',
    default: "'30D'",
    description: 'Range shown first. Falls back to the first key when missing.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'Revenue'",
    description: 'Label above the value; also names the chart for screen readers.',
  },
  {
    name: 'height',
    type: 'number',
    default: '280',
    description: 'Height of the plot in px, header not included.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function InteractiveAreaChartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, dataset, defaultRange, height } = settings.values
  // bumping this remounts the chart, which plays the draw-in again
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'InteractiveAreaChart',
    from: '@/components/ui/interactive-area-chart',
    props: {
      data: dataset === 'growth' ? undefined : { expression: 'data' },
      title,
      defaultRange,
      height,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / interactive-area-chart"
      title="Interactive Area Chart"
      description="A hand-drawn SVG area chart with no chart library. Switch ranges and the curve morphs point for point, even mid-switch. Scrub with the pointer, or focus the chart and use the arrow keys, and a spring-tracked crosshair and tooltip follow while the header shows the value and change. Adapted from EasyUI."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
            maxLength={32}
          />
          <DemoControlGroup
            title="Data"
            options={Object.keys(DATASETS) as Dataset[]}
            value={dataset}
            onChange={(next) => settings.set('dataset', next)}
          />
          <DemoControlGroup
            title="Start range"
            options={RANGES}
            value={defaultRange}
            onChange={(next) => settings.set('defaultRange', next)}
          />
          <DemoSlider
            label="Height"
            value={height}
            onValueChange={(next) => settings.set('height', next)}
            min={200}
            max={360}
            step={10}
            unit="px"
          />
          <DemoAction onClick={() => setRun((value) => value + 1)}>Replay draw-in</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/interactive-area-chart/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-card p-3 shadow-xs sm:p-6">
        <InteractiveAreaChart
          // the start range is read once, so a new one remounts the chart
          key={`${defaultRange}-${run}`}
          data={DATASETS[dataset]}
          title={title || 'Untitled'}
          defaultRange={defaultRange}
          height={height}
        />
      </div>
    </DemoPage>
  )
}
