import { useMemo, useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { UsageSummary, type UsageDay } from '@/components/ui/usage-summary'

import { MODELS, makeDays, totalCost } from './usage-summary.data'

const DAY_OPTIONS = [7, 14, 30] as const
const CURRENCIES = ['USD', 'EUR', 'GBP'] as const

const DEFAULTS = {
  days: 7 as (typeof DAY_OPTIONS)[number],
  budget: true,
  // Share of the budget already spent: under the warning, past it, over.
  spent: 65,
  currency: 'USD' as (typeof CURRENCIES)[number],
  delta: true,
}

const COMPONENT_DEFAULTS = { currency: 'USD', warnAt: 0.8, title: 'Usage' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: '{ days: UsageDay[]; models: UsageModel[]; previousCost?: number; budget?: { limit: number; label?: string } }',
    description:
      'Daily tokens and cost per model, the models (with optional colours), the previous period’s cost for the delta, and an optional budget.',
  },
  { name: 'currency', type: 'string', default: "'USD'", description: 'ISO 4217 code used to format costs.' },
  { name: 'warnAt', type: 'number', default: '0.8', description: 'Share of the budget (0–1) past which the budget bar warns.' },
  { name: 'title', type: 'string', default: "'Usage'", description: 'Card title and accessible name.' },
  { name: 'onSelectDay', type: '(day: UsageDay) => void', description: 'Called when a day’s bar is clicked or activated with the keyboard.' },
  { name: 'className', type: 'string', description: 'Extra classes for the card.' },
]

export function UsageSummaryPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { days: dayCount, budget, spent, currency, delta } = settings.values
  const [selected, setSelected] = useState<UsageDay | null>(null)

  const days = useMemo(() => makeDays(dayCount), [dayCount])
  const previous = useMemo(() => totalCost(makeDays(dayCount, dayCount)), [dayCount])
  // Pick the limit so the current spend sits at the chosen share of it.
  const limit = Math.round(totalCost(days) / (spent / 100))

  const usage = toUsageSnippet({
    component: 'UsageSummary',
    from: '@/components/ui/usage-summary',
    props: {
      data: { expression: '{ days, models, previousCost, budget: { limit: 600 } }' },
      currency,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / usage-summary"
      title="Usage Summary"
      description={
        <>
          Daily cost as stacked bars per model with a tooltip, a per-model
          breakdown, a delta against the previous period and a budget meter that
          warns and flips to over. Bars are buttons: arrow keys, Home and End
          move between days. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Days"
            options={DAY_OPTIONS}
            value={dayCount}
            onChange={(next) => settings.set('days', next)}
          />
          <DemoSwitch
            label="Budget"
            checked={budget}
            onCheckedChange={(next) => settings.set('budget', next)}
          />
          <DemoSlider
            label="Budget spent"
            value={spent}
            onValueChange={(next) => settings.set('spent', next)}
            min={30}
            max={130}
            unit="%"
          />
          <DemoControlGroup
            title="Currency"
            options={CURRENCIES}
            value={currency}
            onChange={(next) => settings.set('currency', next)}
          />
          <DemoSwitch
            label="Delta vs previous"
            checked={delta}
            onCheckedChange={(next) => settings.set('delta', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/usage-summary/',
          'src/components/ui/surface/',
          'src/components/ui/status-pill/',
          'src/components/ui/progress-bar/',
          'src/components/ui/rolling-number/',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-4">
        <UsageSummary
          data={{
            days,
            models: MODELS,
            previousCost: delta ? previous : undefined,
            budget: budget
              ? { limit, label: dayCount === 30 ? 'Monthly budget' : 'Budget' }
              : undefined,
          }}
          currency={currency}
          onSelectDay={setSelected}
        />
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 font-mono text-xs text-muted-foreground"
        >
          {selected
            ? `Selected ${selected.date}`
            : 'Click a bar to select a day'}
        </p>
      </div>
    </DemoPage>
  )
}
