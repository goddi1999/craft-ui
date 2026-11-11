import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { RollingNumber } from '@/components/ui/rolling-number'

type NumberFormat = 'plain' | 'grouped' | 'currency' | 'percent' | 'compact'
const FORMATS: NumberFormat[] = ['plain', 'grouped', 'currency', 'percent', 'compact']

const DEFAULTS = {
  format: 'grouped' as NumberFormat,
  value: 48_213,
  stagger: 24,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number | string',
    description:
      'A number, formatted with format or en-US grouping, or a preformatted string such as "87.2k".',
  },
  { name: 'format', type: '(value: number) => string', description: 'Formats a numeric value. Ignored for strings.' },
  { name: 'stagger', type: 'number', default: '24', description: 'Delay between neighbouring digits, right to left, in ms.' },
  { name: 'className', type: 'string', description: 'Extra classes; set the font size here.' },
]

const FORMATTERS: Record<NumberFormat, { fn?: (n: number) => string; source?: string }> = {
  plain: { fn: (n) => String(n), source: '(n) => String(n)' },
  grouped: {},
  currency: {
    fn: (n) => `$${n.toLocaleString('en-US')}`,
    source: '(n) => `$${n.toLocaleString("en-US")}`',
  },
  percent: {
    fn: (n) => `${(n / 1000).toFixed(1)}%`,
    source: '(n) => `${(n / 1000).toFixed(1)}%`',
  },
  compact: {},
}

// Deterministic pseudo-random walk so each press shows a different, repeatable jump.
const next = (v: number) => (v * 7919 + 104_729) % 100_000

const formatValue = (format: NumberFormat, value: number) =>
  format === 'compact' ? `${(value / 1000).toFixed(1)}k` : value

export function RollingNumberPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { format, value, stagger } = settings.values
  const display = formatValue(format, value)
  const formatter = FORMATTERS[format]

  const usage = toUsageSnippet({
    component: 'RollingNumber',
    from: '@/components/ui/rolling-number',
    props: {
      value: typeof display === 'string' ? display : { expression: String(value) },
      format: formatter.source ? { expression: formatter.source } : undefined,
      stagger,
      className: 'text-5xl font-semibold',
    },
    defaults: { stagger: 24 },
  })

  return (
    <DemoPage
      eyebrow="ui / rolling-number"
      title="Rolling Number"
      description={
        <>
          An odometer-style number: every digit rolls on its own wheel, the
          rightmost first, while units and separators stay put. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Format"
            options={FORMATS}
            value={format}
            onChange={(nextFormat) => settings.set('format', nextFormat)}
          />
          <DemoSlider
            label="Value"
            value={value}
            onValueChange={(v) => settings.set('value', v)}
            min={0}
            max={99_999}
            step={1}
          />
          <DemoSlider
            label="Stagger"
            value={stagger}
            onValueChange={(v) => settings.set('stagger', v)}
            min={0}
            max={120}
            unit="ms"
          />
          <DemoAction onClick={() => settings.set('value', next(value))}>
            Random value
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/rolling-number/'], usage, props: PROPS }}
    >
      <RollingNumber
        value={display}
        format={formatter.fn}
        stagger={stagger}
        className="text-5xl font-semibold"
      />
    </DemoPage>
  )
}
