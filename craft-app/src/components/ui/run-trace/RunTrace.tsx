// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { MotionConfig } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { RollingNumber } from '../rolling-number'
import { Spinner } from '../spinner'
import { Panel, Shell } from '../surface'
import { Breakdown, Flame } from './run-trace-parts'
import type { RunTraceProps } from './run-trace.types'
import { formatMs } from './run-trace.utils'

/**
 * A run of an agent as a trace: a zoomable flame graph of spans, or a
 * breakdown of time, tokens and cost by name. Open spans pulse while the run
 * is recording.
 */
export function RunTrace({ data, view = 'flame', onZoom, className }: RunTraceProps) {
  const { spans, elapsedMs } = data
  const [zoomId, setZoomId] = useState<string | null>(null)
  const running = spans.some((s) => s.endMs === undefined)
  const zoom = (id: string | null) => {
    setZoomId(id)
    onZoom?.(id ? (spans.find((s) => s.id === id) ?? null) : null)
  }

  let body: ReactNode = (
    <p className="py-8 text-center text-[0.8125rem] text-muted-foreground">
      Waiting for spans…
    </p>
  )
  if (spans.length > 0)
    body =
      view === 'flame' ? (
        <Flame spans={spans} elapsedMs={elapsedMs} zoomId={zoomId} onZoom={zoom} />
      ) : (
        <Breakdown spans={spans} elapsedMs={elapsedMs} />
      )

  return (
    <MotionConfig reducedMotion="user">
      <Shell data-slot="run-trace" aria-label="Run trace" className={cn('max-w-2xl', className)}>
        <Panel className="p-4">{body}</Panel>
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 text-[0.8125rem] text-muted-foreground">
          {running && <Spinner size="xs" aria-label="Recording" />}
          {running ? 'Recording' : 'Finished in'}{' '}
          <RollingNumber
            className="font-mono text-foreground"
            value={formatMs(elapsedMs)}
          />
          <span className="ml-auto">
            <RollingNumber value={String(spans.length)} /> spans
          </span>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {running ? '' : `Run finished in ${formatMs(elapsedMs)}`}
        </p>
      </Shell>
    </MotionConfig>
  )
}
