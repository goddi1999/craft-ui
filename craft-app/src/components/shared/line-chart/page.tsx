import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { LineChart } from './LineChart'
import type { LineChartDatum, LineChartProps, LineChartSeries } from './LineChart'

type Curve = NonNullable<LineChartProps['curve']>

const RANGES = [7, 14, 30, 90] as const
type Range = (typeof RANGES)[number]
const CURVES: Curve[] = ['smooth', 'linear']

const START = Date.UTC(2026, 8, 1)
const DAY_MS = 24 * 60 * 60 * 1000

const fullDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

// Deterministic waves stand in for real traffic so the demo renders the same every time.
const makeSignups = (days: number): LineChartDatum[] => {
  const axisEvery = Math.ceil(days / 6)
  return Array.from({ length: days }, (_, day) => {
    const date = new Date(START + day * DAY_MS)
    return {
      key: date.toISOString().slice(0, 10),
      label: fullDate.format(date),
      axisLabel: day % axisEvery === 0 ? shortDate.format(date) : undefined,
      values: {
        signups: Math.round(120 + day * 2.4 + Math.sin(day / 2) * 18),
        previous: Math.round(100 + day * 1.2 + Math.cos(day / 3) * 12),
      },
    }
  })
}

const DATA: Record<Range, LineChartDatum[]> = {
  7: makeSignups(7),
  14: makeSignups(14),
  30: makeSignups(30),
  90: makeSignups(90),
}

const CURRENT: LineChartSeries = { key: 'signups', label: 'This period' }
const PREVIOUS: LineChartSeries = {
  key: 'previous',
  label: 'Previous period',
  dashed: true,
}

const DEFAULTS = {
  range: 30 as Range,
  curve: 'smooth' as Curve,
  height: 220,
  comparison: true,
  legend: true,
  loading: false,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  curve: 'smooth',
  height: 220,
  loading: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: 'LineChartDatum[]',
    description: 'Points in order — `{ key, label, axisLabel?, values }` each.',
  },
  {
    name: 'series',
    type: 'LineChartSeries[]',
    description: 'Lines to draw — `{ key, label, color?, dashed?, area? }` each.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'What is measured, e.g. "Signups". Names the chart for assistive technology.',
  },
  {
    name: 'unit',
    type: 'string',
    default: "''",
    description: 'Unit after each value in the tooltip, e.g. "ms".',
  },
  {
    name: 'height',
    type: 'number',
    default: '220',
    description: 'Plot height in px. The width follows the container.',
  },
  {
    name: 'curve',
    type: "'smooth' | 'linear'",
    default: "'smooth'",
    description: 'Monotone curves that never swing past the data, or straight segments.',
  },
  {
    name: 'legend',
    type: 'boolean',
    description: 'Series toggles above the plot. Shown by default with more than one series.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Keep the current lines on screen, dimmed, while the next range loads.',
  },
  {
    name: 'formatValue',
    type: '(value: number, series: LineChartSeries) => string',
    description: 'Formats values in the tooltip and data table.',
  },
  {
    name: 'formatTick',
    type: '(value: number) => string',
    default: 'compact number',
    description: 'Formats the value axis, e.g. 1.2K.',
  },
  {
    name: 'hiddenSeries / defaultHiddenSeries',
    type: 'string[]',
    description: 'Controlled or initial hidden series keys.',
  },
  {
    name: 'onHiddenSeriesChange',
    type: '(hidden: string[]) => void',
    description: 'Called when a legend toggle hides or shows a series.',
  },
  {
    name: 'onActiveChange',
    type: '(index: number | null, datum: LineChartDatum | null) => void',
    description: 'Called as the crosshair moves, and with null when it leaves.',
  },
  {
    name: 'emptyLabel',
    type: 'string',
    default: "'No data for this range'",
    description: 'Shown when there are no points.',
  },
  {
    name: 'categoryLabel',
    type: 'string',
    default: "'Date'",
    description: 'Header of the first column in the screen-reader data table.',
  },
  {
    name: 'ref / className',
    type: 'Ref<HTMLElement> / string',
    description: 'Ref to the root figure and extra classes.',
  },
]

export function LineChartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { range, curve, height, comparison, legend, loading } = settings.values
  const series = comparison ? [CURRENT, PREVIOUS] : [CURRENT]

  const usage = toUsageSnippet({
    component: 'LineChart',
    from: '@/components/shared/line-chart',
    props: {
      label: 'Signups',
      data: 'DATA',
      series: 'SERIES',
      curve,
      height,
      legend: comparison && !legend ? false : undefined,
      loading,
    },
    defaults: COMPONENT_DEFAULTS,
  })
    .replace('data="DATA"', 'data={data}')
    .replace('series="SERIES"', 'series={series}')

  return (
    <DemoPage
      eyebrow="shared / line-chart"
      title="Line chart"
      description="Trends over time with a scrubbing crosshair, a dashed comparison series, and a legend that hides series. Switch the range to watch the lines morph."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Range"
            options={RANGES}
            value={range}
            onChange={(value) => settings.set('range', value)}
            format={(value) => `${value} days`}
          />
          <DemoControlGroup
            title="Curve"
            options={CURVES}
            value={curve}
            onChange={(value) => settings.set('curve', value)}
          />
          <DemoSlider
            label="Height"
            value={height}
            onValueChange={(value) => settings.set('height', value)}
            min={140}
            max={360}
            step={10}
            unit="px"
          />
          <DemoSwitch
            label="Previous period"
            checked={comparison}
            onCheckedChange={(value) => settings.set('comparison', value)}
          />
          {comparison ? (
            <DemoSwitch
              label="Legend"
              checked={legend}
              onCheckedChange={(value) => settings.set('legend', value)}
            />
          ) : null}
          <DemoSwitch
            label="Loading"
            checked={loading}
            onCheckedChange={(value) => settings.set('loading', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/line-chart/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="mx-auto w-full max-w-3xl">
        <LineChart
          label="Signups"
          data={DATA[range]}
          series={series}
          curve={curve}
          height={height}
          legend={comparison ? legend : undefined}
          loading={loading}
        />
      </div>
    </DemoPage>
  )
}
