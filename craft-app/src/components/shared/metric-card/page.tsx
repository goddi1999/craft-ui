import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { MetricCard, type MetricCardProps } from './MetricCard'

const METRICS = ['uptime', 'users', 'errors'] as const
type Metric = (typeof METRICS)[number]

/** Demo data — switching between them shows every part of the card animate. */
const METRIC_DATA: Record<Metric, MetricCardProps> = {
  uptime: {
    label: 'Uptime',
    value: 99.9,
    suffix: '%',
    context: 'Last 30 days',
    change: '+0.2%',
  },
  users: {
    label: 'Active users',
    value: 18_420,
    context: 'This week',
    change: '+12%',
  },
  errors: {
    label: 'Error rate',
    value: 0.4,
    suffix: '%',
    context: 'Last 24 hours',
    change: '-0.1%',
  },
}

const METRIC_LABELS: Record<Metric, string> = {
  uptime: 'Uptime',
  users: 'Users',
  errors: 'Errors',
}

const DEFAULTS = {
  metric: 'uptime' as Metric,
  showChange: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'label',
    type: 'string',
    description: 'Name of the metric, top left. Required.',
  },
  {
    name: 'value',
    type: 'number',
    description: 'The figure; digits roll to each new value. Required.',
  },
  {
    name: 'suffix',
    type: 'string',
    description: 'Unit printed after the figure, e.g. `%`.',
  },
  {
    name: 'decimals',
    type: 'number',
    default: 'decimals in value',
    description: 'Fraction digits to show, so 99.9 never rounds to 100.',
  },
  {
    name: 'context',
    type: 'string',
    description: 'Period or note under the figure. Required.',
  },
  {
    name: 'change',
    type: 'string',
    description:
      'Change since the last period. A leading + tints it green, - red; omit to hide the badge.',
  },
]

export function MetricCardPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { metric, showChange } = settings.values
  const data = METRIC_DATA[metric]
  const change = showChange ? data.change : undefined

  const usage = toUsageSnippet({
    component: 'MetricCard',
    from: '@/components/shared/metric-card',
    props: {
      label: data.label,
      value: data.value,
      suffix: data.suffix,
      context: data.context,
      change,
    },
  })

  return (
    <DemoPage
      eyebrow="shared / metric-card"
      title="Metric card"
      description="A KPI tile with an animated figure, its context, and the change since the last period. Switch metrics to watch the digits roll and the copy swap."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Metric"
            options={METRICS}
            value={metric}
            onChange={(value) => settings.set('metric', value)}
            format={(value) => METRIC_LABELS[value]}
          />
          <DemoSwitch
            label="Show change"
            checked={showChange}
            onCheckedChange={(value) => settings.set('showChange', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/shared/metric-card/',
          'src/components/ui/animated-counter/',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="w-full max-w-sm">
        <MetricCard {...data} change={change} />
      </div>
    </DemoPage>
  )
}
