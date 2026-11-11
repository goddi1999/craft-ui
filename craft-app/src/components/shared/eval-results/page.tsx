import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { EvalResults, type EvalFilter } from '@/components/ui/eval-results'

import { METRICS, STEPS, casesAt } from './eval-results.data'

const VIEWS = ['grid', 'compare'] as const
const FILTERS: EvalFilter[] = ['all', 'failed', 'regressed', 'improved']
const DEFAULTS = {
  view: 'grid' as (typeof VIEWS)[number],
  filter: 'all' as EvalFilter,
  baseline: 84.9,
}
const COMPONENT_DEFAULTS = { view: 'grid' }
const STEP_MS = 110

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: '{ suite: string; label?: string; cases: EvalCase[]; baselinePassRate?: number; metrics?: EvalMetric[] }',
    description:
      'The run. Each case has id, name, status (pending, running, pass, fail, regressed, improved) and optional score, input, expected, actual and reason. Metrics feed the compare view.',
  },
  { name: 'view', type: "'grid' | 'compare'", default: "'grid'", description: 'Every case as a cell, or metrics and regressions.' },
  { name: 'filter', type: "'all' | 'failed' | 'regressed' | 'improved'", description: 'Controlled filter. Omit for internal state.' },
  { name: 'onFilterChange', type: '(filter: EvalFilter) => void', description: 'Called when the filter changes.' },
  { name: 'selectedId', type: 'string | null', description: 'Controlled selected case id.' },
  { name: 'onSelectCase', type: '(testCase: EvalCase) => void', description: 'Called when a case is clicked or activated with the keyboard.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function EvalResultsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { view, filter, baseline } = settings.values
  const [step, setStep] = useState(STEPS)
  const [selectedId, setSelectedId] = useState<string | null>('case-23')
  const [run, setRun] = useState(0)

  // Replay: cases start pending, then batches run and resolve.
  useEffect(() => {
    if (run === 0) return
    setSelectedId(null)
    setStep(0)
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS) {
          clearInterval(timer)
          return s
        }
        return s + 1
      })
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [run])

  const usage = toUsageSnippet({
    component: 'EvalResults',
    from: '@/components/ui/eval-results',
    props: {
      data: {
        expression: `{ suite: 'sql-generation', cases, baselinePassRate: ${baseline / 100}, metrics }`,
      },
      view,
      filter,
      onFilterChange: { expression: 'setFilter' },
      selectedId: { expression: 'selectedId' },
      onSelectCase: { expression: '(c) => setSelectedId(c.id)' },
    },
    defaults: { ...COMPONENT_DEFAULTS, filter: 'all' },
  })

  return (
    <DemoPage
      eyebrow="ui / eval-results"
      title="Eval Results"
      description={
        <>
          A grid with one cell per eval case: filter by outcome, click or use
          the arrow keys to open a case, or switch to the compare view for
          metrics and regressions. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="View"
            options={[...VIEWS]}
            value={view}
            onChange={(next) => settings.set('view', next)}
          />
          <DemoControlGroup
            title="Filter"
            options={FILTERS}
            value={filter}
            onChange={(next) => settings.set('filter', next)}
          />
          <DemoSlider
            label="Baseline pass rate"
            value={baseline}
            onValueChange={(next) => settings.set('baseline', next)}
            min={60}
            max={100}
            step={0.5}
            unit="%"
          />
          <DemoAction onClick={() => setRun((n) => n + 1)}>Replay run</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/eval-results/',
          'src/components/ui/surface/',
          'src/components/ui/status-pill/',
          'src/components/ui/progress-bar/',
          'src/components/ui/segmented-control/',
          'src/components/ui/rolling-number/',
        ],
        usage,
        props: PROPS,
      }}
    >
      <EvalResults
        data={{
          suite: 'sql-generation',
          label: 'opus-5.5 vs sonnet-5.5',
          cases: casesAt(step),
          baselinePassRate: baseline / 100,
          metrics: METRICS,
        }}
        view={view}
        filter={filter}
        onFilterChange={(next) => settings.set('filter', next)}
        selectedId={selectedId}
        onSelectCase={(c) => setSelectedId(c.id)}
      />
    </DemoPage>
  )
}
