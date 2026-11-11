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
  RollingCounter,
  type RollingCounterGrouping,
} from '@/components/ui/rolling-counter'

const GROUPINGS: RollingCounterGrouping[] = ['western', 'indian']
const SEPARATORS = [',', '.', ' ', ''] as const
const SEPARATOR_LABELS: Record<(typeof SEPARATORS)[number], string> = {
  ',': '1,000',
  '.': '1.000',
  ' ': '1 000',
  '': '1000',
}

const DEFAULTS = {
  value: 1284,
  decimals: 0,
  duration: 0.6,
  separator: ',' as (typeof SEPARATORS)[number],
  grouping: 'western' as RollingCounterGrouping,
  prefix: '$',
}

const COMPONENT_DEFAULTS = {
  decimals: 0,
  duration: 0.6,
  separator: ',',
  grouping: 'western',
}

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'number', description: 'The number to show. Required.' },
  {
    name: 'decimals',
    type: 'number',
    default: '0',
    description: 'Digits after the decimal separator (0–15).',
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.6',
    description: 'Spring length of each roll, in seconds.',
  },
  {
    name: 'padStart',
    type: 'number',
    default: '1',
    description: 'Minimum whole digits, padded with zeros — e.g. 3 shows 007.',
  },
  {
    name: 'separator',
    type: 'string',
    default: "','",
    description: "Thousands separator; '' turns grouping off.",
  },
  { name: 'decimalSeparator', type: 'string', default: "'.'", description: 'Separator before the decimals.' },
  {
    name: 'grouping',
    type: "'western' | 'indian'",
    default: "'western'",
    description: 'Thousands (1,234,567) or lakh/crore (12,34,567).',
  },
  { name: 'prefix / suffix', type: 'ReactNode', description: 'Shown before / after; slides with layout, never rolls.' },
]

const randomValue = (decimals: number) =>
  Math.round(Math.random() * 10 ** (2 + Math.floor(Math.random() * 6)) * 10 ** decimals) /
  10 ** decimals

export function RollingCounterPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { value, decimals, duration, separator, grouping, prefix } = settings.values

  const usage = toUsageSnippet({
    component: 'RollingCounter',
    from: '@/components/ui/rolling-counter',
    props: {
      value: { expression: String(value) },
      decimals,
      duration,
      separator,
      grouping,
      prefix: prefix || undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / rolling-counter"
      title="Rolling Counter"
      description="Digits roll like an odometer: each column spins the short way to its new face on a spring, new places fade in, and separators slide into position. Screen readers get the plain number."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Value"
            value={value}
            onValueChange={(next) => settings.set('value', next)}
            min={0}
            max={250000}
            step={137}
          />
          <DemoSlider
            label="Decimals"
            value={decimals}
            onValueChange={(next) => settings.set('decimals', next)}
            min={0}
            max={3}
          />
          <DemoSlider
            label="Roll duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={0.2}
            max={1.6}
            step={0.1}
            unit="s"
          />
          <DemoControlGroup
            title="Separator"
            options={SEPARATORS}
            value={separator}
            onChange={(next) => settings.set('separator', next)}
            format={(option) => SEPARATOR_LABELS[option]}
          />
          <DemoControlGroup
            title="Grouping"
            options={GROUPINGS}
            value={grouping}
            onChange={(next) => settings.set('grouping', next)}
          />
          <DemoTextField
            label="Prefix"
            value={prefix}
            onValueChange={(next) => settings.set('prefix', next)}
            maxLength={4}
          />
          <DemoAction onClick={() => settings.set('value', randomValue(decimals))}>
            Random value
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/rolling-counter/'], usage, props: PROPS }}
    >
      <RollingCounter
        value={value}
        decimals={decimals}
        duration={duration}
        separator={separator}
        grouping={grouping}
        prefix={prefix || undefined}
        className="text-5xl font-semibold tracking-tight sm:text-7xl"
      />
    </DemoPage>
  )
}
