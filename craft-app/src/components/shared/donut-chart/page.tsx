import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { DonutChart, type DonutChartDatum, type DonutChartProps } from './DonutChart'

type LegendAction = NonNullable<DonutChartProps['legendAction']>

const LEGEND_ACTIONS: LegendAction[] = ['toggle', 'select']

const TRAFFIC_SOURCES: DonutChartDatum[] = [
  { key: 'search', label: 'Search', value: 4210 },
  { key: 'direct', label: 'Direct', value: 2380 },
  { key: 'social', label: 'Social', value: 1190 },
  { key: 'email', label: 'Email', value: 640 },
  { key: 'ads', label: 'Ads', value: 120 },
  { key: 'other', label: 'Referral', value: 90 },
]

const DEFAULTS = {
  size: 208,
  thickness: 24,
  groupBelow: 4,
  maxSegments: 6,
  totalLabel: 'Total',
  legend: true,
  legendAction: 'toggle' as LegendAction,
}

const DATA_PLACEHOLDER = '__data__'

/** Random values with the same keys, so the arcs morph instead of redrawing. */
const shuffleValues = (data: DonutChartDatum[]) =>
  data.map((datum) => ({
    ...datum,
    value: Math.round(60 + Math.random() * 4000),
  }))

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: 'DonutChartDatum[]',
    description: '`{ key, label, value, color? }` per part. A key that survives a change keeps its place and color, so the arcs morph.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'What the whole is, e.g. "Visits by source". Names the chart for assistive tech.',
  },
  {
    name: 'unit',
    type: 'string',
    default: "''",
    description: 'Unit after values, e.g. "visits".',
  },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    default: 'grouped number format',
    description: 'Formats every value the chart prints.',
  },
  {
    name: 'totalLabel',
    type: 'string',
    default: "'Total'",
    description: 'Center label at rest, above the total.',
  },
  {
    name: 'size',
    type: 'number',
    default: '208',
    description: 'Diameter in px. The chart scales down to fit narrower containers.',
  },
  {
    name: 'thickness',
    type: 'number',
    default: '24',
    description: 'Ring thickness in px.',
  },
  {
    name: 'groupBelow',
    type: 'number',
    default: '0.04',
    description: 'Segments below this share of the total (0–1) join "Other".',
  },
  {
    name: 'maxSegments',
    type: 'number',
    default: '6',
    description: 'Most segments drawn, counting "Other"; the smallest beyond it are grouped.',
  },
  {
    name: 'otherLabel',
    type: 'string',
    default: "'Other'",
    description: 'Label of the grouped segment.',
  },
  {
    name: 'activeKey',
    type: 'string | null',
    description: 'Controlled selected segment. Hover and focus preview others without changing it.',
  },
  {
    name: 'defaultActiveKey',
    type: 'string | null',
    default: 'null',
    description: 'Initial selected segment when uncontrolled.',
  },
  {
    name: 'onActiveChange',
    type: '(key: string | null) => void',
    description: 'Called when the selected segment changes.',
  },
  {
    name: 'hiddenKeys',
    type: 'string[]',
    description: 'Controlled hidden segments; the rest of the ring redistributes.',
  },
  {
    name: 'defaultHiddenKeys',
    type: 'string[]',
    description: 'Initially hidden segments when uncontrolled.',
  },
  {
    name: 'onHiddenKeysChange',
    type: '(keys: string[]) => void',
    description: 'Called when a legend row hides or shows a segment.',
  },
  {
    name: 'legendAction',
    type: "'toggle' | 'select'",
    default: "'toggle'",
    description: 'Clicking a legend row hides/shows its segment, or pins it as selected.',
  },
  {
    name: 'legend',
    type: 'boolean',
    default: 'true',
    description: 'Show the synced legend beside or below the ring.',
  },
  {
    name: 'emptyLabel',
    type: 'string',
    default: "'No data yet'",
    description: 'Shown when every value is zero or hidden.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description: 'Ref to the root figure.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root figure.',
  },
]

export function DonutChartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, thickness, groupBelow, maxSegments, totalLabel, legend, legendAction } =
    settings.values
  const [data, setData] = useState(TRAFFIC_SOURCES)

  const usage = toUsageSnippet({
    component: 'DonutChart',
    from: '@/components/shared/donut-chart',
    props: {
      data: DATA_PLACEHOLDER,
      label: 'Visits by source',
      unit: 'visits',
      size,
      thickness,
      groupBelow: groupBelow / 100,
      maxSegments,
      totalLabel: totalLabel || undefined,
      legend,
      legendAction,
    },
    defaults: { ...DEFAULTS, groupBelow: DEFAULTS.groupBelow / 100 },
  }).replace(`data="${DATA_PLACEHOLDER}"`, 'data={data}')

  const handleShuffle = () => setData(shuffleValues)

  const handleRestore = () => setData(TRAFFIC_SOURCES)

  return (
    <DemoPage
      eyebrow="shared / donut-chart"
      title="Donut chart"
      description="Parts of a whole as ring segments, with a live total, small slices grouped into Other, and a legend that toggles segments."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={140}
            max={280}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Thickness"
            value={thickness}
            onValueChange={(value) => settings.set('thickness', value)}
            min={8}
            max={48}
            unit="px"
          />
          <DemoSlider
            label="Group below"
            value={groupBelow}
            onValueChange={(value) => settings.set('groupBelow', value)}
            min={0}
            max={15}
            unit="%"
          />
          <DemoSlider
            label="Max segments"
            value={maxSegments}
            onValueChange={(value) => settings.set('maxSegments', value)}
            min={2}
            max={6}
          />
          <DemoControlGroup
            title="Legend action"
            options={LEGEND_ACTIONS}
            value={legendAction}
            onChange={(value) => settings.set('legendAction', value)}
          />
          <DemoTextField
            label="Total label"
            value={totalLabel}
            onValueChange={(value) => settings.set('totalLabel', value)}
            maxLength={16}
          />
          <DemoSwitch
            label="Legend"
            checked={legend}
            onCheckedChange={(value) => settings.set('legend', value)}
          />
          <div className="flex gap-2 self-end sm:justify-self-end">
            <DemoAction onClick={handleRestore} disabled={data === TRAFFIC_SOURCES}>
              Restore data
            </DemoAction>
            <DemoAction onClick={handleShuffle}>Shuffle data</DemoAction>
          </div>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/donut-chart/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-md justify-center">
        <DonutChart
          label="Visits by source"
          unit="visits"
          data={data}
          size={size}
          thickness={thickness}
          groupBelow={groupBelow / 100}
          maxSegments={maxSegments}
          totalLabel={totalLabel || undefined}
          legend={legend}
          legendAction={legendAction}
          className="w-full"
        />
      </div>
    </DemoPage>
  )
}
