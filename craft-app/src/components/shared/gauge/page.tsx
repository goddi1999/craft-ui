import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { Gauge } from './Gauge'
import type { GaugeProps, GaugeThreshold } from './Gauge'

type GaugeTone = NonNullable<GaugeProps['tone']>

const TONES: GaugeTone[] = ['accent', 'success', 'warning', 'danger']
const DISK_SIZE_GB = 500

const DISK_THRESHOLDS: GaugeThreshold[] = [
  { from: 0, tone: 'success', label: 'Healthy' },
  { from: 70, tone: 'warning', label: 'Filling up' },
  { from: 90, tone: 'danger', label: 'Critical' },
]

const DEFAULTS = {
  value: 72,
  label: 'Disk usage',
  tone: 'accent' as GaugeTone,
  showThresholds: true,
  showDetail: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = { min: 0, max: 100, tone: 'accent' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    description: 'Current reading, clamped between min and max.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Name of the meter, shown under the ring and read by screen readers.',
  },
  {
    name: 'min',
    type: 'number',
    default: '0',
    description: 'Value at the start of the arc.',
  },
  {
    name: 'max',
    type: 'number',
    default: '100',
    description: 'Value at the end of the arc.',
  },
  {
    name: 'detail',
    type: 'string',
    description: 'Secondary line under the label, e.g. "360 of 500 GB".',
  },
  {
    name: 'tone',
    type: "'accent' | 'success' | 'warning' | 'danger'",
    default: "'accent'",
    description: 'Arc color when no threshold band applies.',
  },
  {
    name: 'thresholds',
    type: 'GaugeThreshold[]',
    description:
      'Bands `{ from, tone, label }` — the highest one reached sets the color and names the state.',
  },
]

export function GaugePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { value, label, tone, showThresholds, showDetail } = settings.values
  const detail = showDetail
    ? `${Math.round((value / 100) * DISK_SIZE_GB)} of ${DISK_SIZE_GB} GB`
    : undefined

  const usage = toUsageSnippet({
    component: 'Gauge',
    from: '@/components/shared/gauge',
    props: {
      value,
      label,
      detail,
      tone: showThresholds ? undefined : tone,
      thresholds: showThresholds ? 'THRESHOLDS' : undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace('thresholds="THRESHOLDS"', 'thresholds={thresholds}')

  return (
    <DemoPage
      eyebrow="shared / gauge"
      title="Gauge"
      description="A radial meter whose arc sweeps to the value, with threshold bands that name the state so it never rests on color alone."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Value"
            value={value}
            onValueChange={(next) => settings.set('value', next)}
            min={0}
            max={100}
            unit="%"
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={24}
          />
          <DemoSwitch
            label="Threshold bands"
            checked={showThresholds}
            onCheckedChange={(next) => settings.set('showThresholds', next)}
          />
          {showThresholds ? null : (
            <DemoControlGroup
              title="Tone"
              options={TONES}
              value={tone}
              onChange={(next) => settings.set('tone', next)}
            />
          )}
          <DemoSwitch
            label="Detail line"
            checked={showDetail}
            onCheckedChange={(next) => settings.set('showDetail', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/gauge/'],
        usage,
        props: PROPS,
      }}
    >
      <Gauge
        label={label || ' '}
        value={value}
        detail={detail}
        tone={tone}
        thresholds={showThresholds ? DISK_THRESHOLDS : undefined}
      />
    </DemoPage>
  )
}
