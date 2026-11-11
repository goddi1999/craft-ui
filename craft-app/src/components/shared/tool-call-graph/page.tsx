import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ToolCallGraph, type ToolCallMetric } from '@/components/ui/tool-call-graph'

import { FRAMES } from './tool-call-graph.data'

const METRIC_OPTIONS = ['calls', 'latency', 'errors'] as const
const HIGHLIGHT_OPTIONS = ['auto', 'none'] as const

const DEFAULTS = {
  metric: 'calls' as ToolCallMetric,
  highlight: 'auto' as (typeof HIGHLIGHT_OPTIONS)[number],
  threshold: 2,
  stats: true,
  live: true,
}

const COMPONENT_DEFAULTS = { errorThreshold: 0.02, title: 'Tool call graph' }

const TICK_MS = 1400
const LAST = FRAMES.length - 1

const PROPS: DemoPropDoc[] = [
  {
    name: 'agent',
    type: '{ label: string; meta?: string }',
    description:
      'The caller on the left. `meta` is a short second line, e.g. "agent · 3.1k runs".',
  },
  {
    name: 'tools',
    type: 'ToolCallNode[]',
    description:
      'Tools in the order they are drawn, top to bottom: id, label, calls, p50Ms, errorRate and optional retries.',
  },
  {
    name: 'metric',
    type: "'calls' | 'latency' | 'errors'",
    description:
      'Controlled metric that sets the edge weights. Pair with `onMetricChange`.',
  },
  {
    name: 'defaultMetric',
    type: "'calls' | 'latency' | 'errors'",
    default: "'calls'",
    description: 'Initial metric when uncontrolled.',
  },
  {
    name: 'onMetricChange',
    type: '(metric: ToolCallMetric) => void',
    description: 'Called when the segmented control changes the metric.',
  },
  {
    name: 'highlight',
    type: 'string | null',
    default: 'highest of the metric',
    description: 'Tool to pick out with a flowing edge. `null` for none.',
  },
  {
    name: 'errorThreshold',
    type: 'number',
    default: '0.02',
    description: 'Error rate (0 to 1) from which a tool reads as failing.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'Tool call graph'",
    description: 'Header title.',
  },
  {
    name: 'subtitle',
    type: 'string',
    default: 'agent · total calls',
    description: 'Secondary line under the title.',
  },
  {
    name: 'stats',
    type: 'ToolCallStat[]',
    default: 'calls, error rate, retries',
    description:
      'Footer row of label and value pairs; `accent` draws a value in the accent colour. `[]` hides it.',
  },
  {
    name: 'formatLatency',
    type: '(ms: number) => string',
    default: '"212 ms" / "1.8 s"',
    description: 'Formats p50 latency.',
  },
  {
    name: 'onSelect',
    type: '(id: string) => void',
    description: 'Called when a tool node is clicked or pressed.',
  },
  { name: 'className', type: 'string', description: 'Extra classes for the card.' },
]

export function ToolCallGraphPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { metric, highlight, threshold, stats, live } = settings.values
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  // The feed counts its way to the end of the 24 h window, one tick at a time.
  useEffect(() => {
    if (!live || !playing || frame >= LAST) return
    const id = window.setTimeout(() => setFrame((f) => Math.min(f + 1, LAST)), TICK_MS)
    return () => window.clearTimeout(id)
  }, [live, playing, frame])

  const tools = FRAMES[live ? frame : LAST]
  const total = tools.reduce((a, t) => a + t.calls, 0)
  const retries = tools.reduce((a, t) => a + t.retries, 0)

  const usage = toUsageSnippet({
    component: 'ToolCallGraph',
    from: '@/components/ui/tool-call-graph',
    props: {
      agent: { expression: "{ label: 'triage-l · v14', meta: 'agent · 3.1k runs' }" },
      tools: { expression: 'tools' },
      defaultMetric: metric,
      highlight: highlight === 'none' ? { expression: 'null' } : undefined,
      errorThreshold: threshold / 100,
      stats: stats ? undefined : { expression: '[]' },
    },
    defaults: { ...COMPONENT_DEFAULTS, defaultMetric: 'calls' },
  })

  return (
    <DemoPage
      eyebrow="ui / tool-call-graph"
      title="Tool Call Graph"
      description={
        <>
          One agent fanned out to the tools it calls. Each edge is as heavy as the chosen
          metric (calls, p50 latency or error rate) and the top tool is picked out with a
          flowing edge. Hover or focus a tool to isolate its edge. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Metric"
            options={METRIC_OPTIONS}
            value={metric}
            onChange={(next) => settings.set('metric', next)}
          />
          <DemoControlGroup
            title="Highlight"
            options={HIGHLIGHT_OPTIONS}
            value={highlight}
            onChange={(next) => settings.set('highlight', next)}
          />
          <DemoSlider
            label="Error threshold"
            value={threshold}
            onValueChange={(next) => settings.set('threshold', next)}
            min={0.5}
            max={5}
            step={0.5}
            unit="%"
          />
          <DemoSwitch
            label="Footer stats"
            checked={stats}
            onCheckedChange={(next) => settings.set('stats', next)}
          />
          <DemoSwitch
            label="Live feed"
            checked={live}
            onCheckedChange={(next) => settings.set('live', next)}
          />
          <DemoAction
            onClick={() => setPlaying((p) => !p)}
            disabled={!live || frame >= LAST}
          >
            {playing ? 'Pause' : 'Play'}
          </DemoAction>
          <DemoAction
            onClick={() => {
              setFrame(0)
              setPlaying(true)
            }}
          >
            Replay
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/tool-call-graph/',
          'src/components/ui/surface/',
          'src/components/ui/segmented-control/',
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-4">
        <ToolCallGraph
          agent={{ label: 'triage-l · v14', meta: 'agent · 3.1k runs' }}
          subtitle={`triage-l · v14 · last 24 h · ${total.toLocaleString('en-US')} calls`}
          tools={tools}
          metric={metric}
          onMetricChange={(next) => settings.set('metric', next)}
          highlight={highlight === 'none' ? null : undefined}
          errorThreshold={threshold / 100}
          onSelect={setSelected}
          stats={
            stats
              ? [
                  { label: 'Calls / run', value: (total / 3120).toFixed(1) },
                  { label: 'Tool share of latency', value: '63%' },
                  {
                    label: 'Retries',
                    value: `${retries.toLocaleString('en-US')} · ${((retries / total) * 100).toFixed(1)}%`,
                  },
                  {
                    label: 'Hot path',
                    value: 'refund.create → email.send',
                    accent: true,
                  },
                ]
              : []
          }
        />
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 font-mono text-xs text-muted-foreground"
        >
          {selected ? `Selected ${selected}` : 'Click a tool to select it'}
        </p>
      </div>
    </DemoPage>
  )
}
