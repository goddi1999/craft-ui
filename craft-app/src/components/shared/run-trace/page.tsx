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
import { RunTrace } from '@/components/ui/run-trace'

import { RUN_MS, at } from './run-trace.data'

const VIEWS = ['flame', 'breakdown'] as const
const DEFAULTS = { view: 'flame' as (typeof VIEWS)[number], speed: 1 }
const COMPONENT_DEFAULTS = { view: 'flame' }
const TICK_MS = 100

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: '{ spans: TraceSpan[]; elapsedMs: number }',
    description:
      'The run so far. A span has id, name, kind (llm, tool, agent, retrieval), startMs and optional parentId, endMs, model, tokens, costUsd and status. Leave endMs undefined while it is running.',
  },
  { name: 'view', type: "'flame' | 'breakdown'", default: "'flame'", description: 'A zoomable flame graph, or time, tokens and cost totalled by name.' },
  { name: 'onZoom', type: '(span: TraceSpan | null) => void', description: 'Called when the flame graph zooms into a span, or back out (null).' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

export function RunTracePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { view, speed } = settings.values
  // Starts finished so the first paint (and the card thumbnail) is a full trace.
  const [time, setTime] = useState(RUN_MS)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (run === 0) return
    setTime(0)
    const timer = setInterval(() => {
      setTime((t) => {
        if (t >= RUN_MS) {
          clearInterval(timer)
          return t
        }
        return Math.min(t + TICK_MS * speed, RUN_MS)
      })
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [run, speed])

  const usage = toUsageSnippet({
    component: 'RunTrace',
    from: '@/components/ui/run-trace',
    props: {
      data: { expression: '{ spans, elapsedMs }' },
      view,
      onZoom: { expression: '(span) => setZoomed(span?.id ?? null)' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      previewClassName="min-h-[28rem]"
      eyebrow="ui / run-trace"
      title="Run Trace"
      description={
        <>
          An agent run as a trace: click a block of the flame graph to zoom in,
          Esc to step back out, or switch to the breakdown for time, tokens and
          cost by name. Replay to watch spans open and close. Adapted from{' '}
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
          <DemoSlider
            label="Replay speed"
            value={speed}
            onValueChange={(next) => settings.set('speed', next)}
            min={1}
            max={4}
            step={1}
            unit="x"
          />
          <DemoAction onClick={() => setRun((n) => n + 1)}>Replay run</DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/run-trace/',
          'src/components/ui/surface/',
          'src/components/ui/status-pill/',
          'src/components/ui/progress-bar/',
          'src/components/ui/segmented-control/',
          'src/components/ui/rolling-number/',
          'src/components/ui/spinner.tsx',
        ],
        usage,
        props: PROPS,
      }}
    >
      <RunTrace data={at(time)} view={view} />
    </DemoPage>
  )
}
