import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { RadialDots } from '@/components/ui/radial-dots'

import { DAILY, HOURLY, HOURS, WEEKDAYS } from './radial-dots.data'

const DATASETS = ['Runs by hour', 'By weekday'] as const

const DEFAULTS = {
  dataset: 'Runs by hour' as (typeof DATASETS)[number],
  series: 3,
  allLabels: false,
  center: true,
}

const PROPS: DemoPropDoc[] = [
  { name: 'labels', type: 'string[]', description: 'One label per sector, clockwise from the top.' },
  { name: 'series', type: 'RadialSeries[]', description: 'Stacked outward in order. The busiest sector fills every ring.' },
  { name: 'title', type: 'string', description: 'Header title.' },
  { name: 'subtitle', type: 'string', description: 'Secondary line under the title.' },
  { name: 'center', type: '{ value: string; caption?: string }', description: 'Headline in the middle. Hovering a sector shows its numbers there instead.' },
  { name: 'axis', type: 'number[]', description: 'Indexes of the labels drawn around the edge. Defaults to the four quarters.' },
  { name: 'format', type: '(value: number) => string', default: '1,234', description: 'Formats sector values.' },
  { name: 'onSelect', type: '(index: number) => void', description: 'Called when a sector is hovered or reached with the arrow keys.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function RadialDotsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { dataset, series, allLabels, center } = settings.values
  const [picked, setPicked] = useState<number | null>(null)

  const daily = dataset === 'By weekday'
  const labels = daily ? WEEKDAYS : HOURS
  const shown = (daily ? DAILY : HOURLY).slice(0, series)
  const axis = daily || allLabels ? labels.map((_, i) => i) : undefined

  const usage = toUsageSnippet({
    component: 'RadialDots',
    from: '@/components/ui/radial-dots',
    props: {
      title: daily ? 'Conversations by weekday' : 'Runs by hour',
      labels: { expression: daily ? 'WEEKDAYS' : 'HOURS' },
      series: { expression: `series.slice(0, ${series})` },
      center: daily
        ? { expression: "{ value: '78%', caption: 'solved by bot' }" }
        : { expression: "{ value: '32 s', caption: 'per run' }" },
      axis: axis ? { expression: 'labels.map((_, i) => i)' } : undefined,
      onSelect: { expression: '(hour) => filterRuns(hour)' },
    },
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / radial-dots"
      title="Radial Dots"
      description={
        <>
          A cycle drawn as rings of dots: each sector is an hour or a weekday
          and its dots stack outward, series by series. Hover a sector or use
          the arrow keys, Home, End and Escape to read it. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Data"
            options={DATASETS}
            value={dataset}
            onChange={(next) => settings.set('dataset', next)}
          />
          <DemoSlider
            label="Series"
            value={series}
            onValueChange={(next) => settings.set('series', next)}
            min={1}
            max={3}
          />
          <DemoSwitch
            label="Label every sector"
            checked={daily || allLabels}
            onCheckedChange={(next) => settings.set('allLabels', next)}
          />
          <DemoSwitch
            label="Centre headline"
            checked={center}
            onCheckedChange={(next) => settings.set('center', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/radial-dots/', 'src/components/ui/surface/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full flex-col items-center gap-3">
        <RadialDots
          key={dataset}
          title={daily ? 'Conversations by weekday' : 'Runs by hour'}
          subtitle={daily ? 'Support bot · last 8 weeks' : 'invoice-agent · last 7 days, UTC'}
          labels={labels}
          axis={axis}
          series={shown}
          center={
            center
              ? daily
                ? { value: '78%', caption: 'solved by bot' }
                : { value: '32 s', caption: 'per run' }
              : { value: '' }
          }
          onSelect={setPicked}
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {picked !== null
            ? `Last read: ${labels[picked] ?? ''}`
            : 'Hover a sector or focus the chart and use the arrow keys.'}
        </p>
      </div>
    </DemoPage>
  )
}
