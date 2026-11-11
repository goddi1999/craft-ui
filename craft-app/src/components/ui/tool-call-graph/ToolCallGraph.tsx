// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Network } from 'lucide-react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'

import { cn } from '@/lib/utils'

import { Segmented } from '../segmented-control'
import { Panel, Shell, ShellHeader } from '../surface'
import { METRICS, GAP, TONE_TOKENS } from './tool-call-graph.constants'
import { useWidth } from './tool-call-graph.hooks'
import { AgentNode, ToolEdges, ToolRow } from './tool-call-graph-parts'
import type {
  HotTone,
  ToolCallGraphProps,
  ToolCallMetric,
  ToolCallNode,
  ToolCallStat,
} from './tool-call-graph.types'
import { buildEdges, count, percent, seconds, valueOf } from './tool-call-graph.utils'

/**
 * One agent fanned out to the tools it calls. Each edge is as heavy as the
 * chosen metric — call volume, p50 latency or error rate — and the tool with
 * the most of it is picked out with a flowing edge.
 */
export function ToolCallGraph({
  agent,
  tools,
  metric: metricProp,
  defaultMetric = 'calls',
  onMetricChange,
  highlight,
  errorThreshold = 0.02,
  title = 'Tool call graph',
  subtitle,
  stats,
  formatLatency = seconds,
  onSelect,
  className,
}: ToolCallGraphProps) {
  const uid = useId()
  const reduce = useReducedMotion()
  const [inner, setInner] = useState<ToolCallMetric>(defaultMetric)
  const metric = metricProp ?? inner
  const [active, setActive] = useState<string | null>(null)
  const [ref, width, measured] = useWidth()

  const setMetric = (next: ToolCallMetric) => {
    if (metricProp === undefined) setInner(next)
    onMetricChange?.(next)
  }

  const max = Math.max(0, ...tools.map((t) => valueOf(t, metric)))
  const hotId =
    highlight !== undefined
      ? highlight
      : max > 0
        ? (tools.find((t) => valueOf(t, metric) === max)?.id ?? null)
        : null
  const hot = tools.find((t) => t.id === hotId)
  const failing = (t: ToolCallNode) => t.errorRate >= errorThreshold
  // Errors view paints a failing hot tool red; every other pick uses the accent.
  const hotTone: HotTone =
    hot && metric === 'errors' && failing(hot) ? 'negative' : 'brand'
  const noun = METRICS.find((m) => m.value === metric)!.noun

  const total = tools.reduce((a, t) => a + t.calls, 0)
  const errors = tools.reduce((a, t) => a + t.calls * t.errorRate, 0)
  const retries = tools.some((t) => t.retries !== undefined)
    ? tools.reduce((a, t) => a + (t.retries ?? 0), 0)
    : null
  const footer: ToolCallStat[] = stats ?? [
    { label: 'Calls', value: count(total) },
    { label: 'Error rate', value: total ? percent(errors / total) : '–' },
    ...(retries === null ? [] : [{ label: 'Retries', value: count(retries) }]),
  ]

  const { height, edges } = buildEdges(tools, metric, width, max)
  const segmented = (
    <Segmented
      label="Edge metric"
      options={METRICS}
      value={metric}
      onValueChange={setMetric}
    />
  )

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="tool-call-graph"
        className={cn('max-w-2xl', TONE_TOKENS, className)}
      >
        <ShellHeader
          icon={Network}
          title={title}
          subtitle={subtitle ?? `${agent.label} · ${count(total)} calls`}
          aside={<div className="hidden @lg:block">{segmented}</div>}
        />
        <Panel className="p-4 @max-sm:p-3 @lg:p-5">
          <div className="mb-4 @lg:hidden">{segmented}</div>
          <div
            className="-mx-2 grid grid-cols-[2.25rem_minmax(1.25rem,1fr)_minmax(0,7fr)] items-center rounded-xl px-2 py-4 @md:grid-cols-[8.5rem_minmax(2.5rem,1fr)_minmax(0,2.2fr)] @xl:grid-cols-[9.5rem_minmax(4rem,1fr)_minmax(0,20rem)] @lg:py-7"
            style={{
              backgroundImage:
                'radial-gradient(color-mix(in oklab, var(--foreground) 11%, transparent) 0.8px, transparent 1.2px)',
              backgroundSize: '12px 12px',
              backgroundPosition: 'center',
            }}
          >
            <AgentNode agent={agent} />

            <div ref={ref} className="h-full">
              <ToolEdges
                edges={edges}
                width={width}
                height={height}
                measured={measured}
                active={active}
                hotId={hotId}
                hotTone={hotTone}
                reduce={reduce}
              />
            </div>

            <ul className="flex min-w-0 flex-col" style={{ gap: GAP }}>
              {tools.map((t) => (
                <ToolRow
                  key={t.id}
                  tool={t}
                  metric={metric}
                  noun={noun}
                  uid={uid}
                  isHot={t.id === hotId}
                  bad={failing(t)}
                  hotTone={hotTone}
                  formatLatency={formatLatency}
                  onActive={setActive}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>

          {footer.length > 0 && (
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 px-1 @md:grid @md:grid-cols-2 @2xl:flex @2xl:gap-x-8">
              {footer.map((s) => (
                <div key={s.label} className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd
                    className={cn(
                      'mt-1 font-mono text-[0.8125rem] break-words tabular-nums',
                      s.accent ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <p role="status" aria-live="polite" className="sr-only">
            {hot ? `Highest ${noun}: ${hot.label}` : ''}
          </p>
        </Panel>
      </Shell>
    </MotionConfig>
  )
}
