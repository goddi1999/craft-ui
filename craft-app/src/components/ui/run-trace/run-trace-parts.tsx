// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { ProgressBar } from '../progress-bar'
import { Segmented } from '../segmented-control'
import { StatusPill } from '../status-pill'
import {
  ERROR_BLOCK,
  ERROR_TEXT,
  LANE_PX,
  MONO_PX,
  NAME_PX,
  PAD_PX,
  instant,
  kinds,
  zoomMove,
} from './run-trace.constants'
import type { TraceMetric, TraceSpan } from './run-trace.types'
import {
  formatCost,
  formatMs,
  formatTokens,
  groupSpans,
  lanes,
  tokensOf,
} from './run-trace.utils'

type FlameProps = {
  spans: TraceSpan[]
  elapsedMs: number
  zoomId: string | null
  onZoom: (id: string | null) => void
}

/** Zoomable flame graph with a breadcrumb trail and a hover readout. */
function Flame({ spans, elapsedMs, zoomId, onZoom }: FlameProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  // Zooms from the keyboard (Enter, Esc) jump instantly; clicks animate.
  const [keyboard, setKeyboard] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const [boxWidth, setBoxWidth] = useState(0)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) =>
      setBoxWidth(entry.contentRect.width),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const byId = new Map(spans.map((s) => [s.id, s]))
  const endOf = (s: TraceSpan) => s.endMs ?? elapsedMs
  const inside = (s: TraceSpan, root: string): boolean =>
    s.id === root ||
    (!!s.parentId && byId.has(s.parentId) && inside(byId.get(s.parentId)!, root))

  const zoom = zoomId ? byId.get(zoomId) : undefined
  const from = zoom?.startMs ?? 0
  const to = Math.max(zoom ? endOf(zoom) : elapsedMs, from + 1)
  const lane = lanes(spans, elapsedMs)
  const visible = spans.filter((s) => !zoom || inside(s, zoom.id))
  const top = zoom ? lane.get(zoom.id)! : 0
  const rows = Math.max(1, ...visible.map((s) => lane.get(s.id)! - top + 1))
  const hover = hoverId ? byId.get(hoverId) : undefined
  const pct = (ms: number) => ((ms - from) / (to - from)) * 100

  const trail: TraceSpan[] = []
  for (let s = zoom; s; s = s.parentId ? byId.get(s.parentId) : undefined)
    trail.unshift(s)
  const focus = hover ?? zoom

  return (
    <>
      <nav
        aria-label="Zoom path"
        className="mb-2 flex flex-wrap items-center gap-0.5 text-xs"
      >
        {[null, ...trail].map((s, i) => (
          <span key={`crumb-${s?.id ?? ''}`} className="flex items-center gap-0.5">
            {i > 0 && (
              <ChevronRight
                strokeWidth={2.5}
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              onClick={(e) => {
                setKeyboard(e.detail === 0)
                onZoom(s?.id ?? null)
              }}
              aria-current={i === trail.length ? 'location' : undefined}
              className={cn(
                'rounded-full px-2 py-0.5 font-mono transition-[color,scale] duration-150 ease-out active:scale-[0.97]',
                i === trail.length
                  ? 'bg-foreground/[0.06] text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s?.name ?? 'Whole run'}
            </button>
          </span>
        ))}
      </nav>
      <div className="mb-1 flex justify-between font-mono text-[0.625rem] text-muted-foreground tabular-nums">
        <span>{formatMs(from)}</span>
        <span>{formatMs((from + to) / 2)}</span>
        <span>{formatMs(to)}</span>
      </div>
      <div
        ref={box}
        className="relative overflow-hidden rounded-xl"
        style={{ height: rows * LANE_PX }}
        onPointerLeave={() => setHoverId(null)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && zoom) {
            setKeyboard(true)
            onZoom(zoom.parentId ?? null)
          }
        }}
      >
        {visible.map((s) => {
          const left = Math.max(pct(s.startMs), 0)
          const width = Math.min(pct(endOf(s)), 100) - left
          const error = s.status === 'error'
          const running = s.endMs === undefined
          // Show the name only when it fits whole, the duration only when both fit.
          const px = (width / 100) * boxWidth
          const duration = running ? '…' : formatMs(endOf(s) - s.startMs)
          const nameWidth = PAD_PX + (error ? 8 : 0) + s.name.length * NAME_PX
          const showName = px >= nameWidth
          const showDuration = px >= nameWidth + 4 + duration.length * MONO_PX
          return (
            <motion.button
              key={s.id}
              type="button"
              initial={false}
              animate={{
                left: `${left}%`,
                width: `${width}%`,
                top: (lane.get(s.id)! - top) * LANE_PX,
              }}
              transition={keyboard ? instant : zoomMove}
              onClick={(e) => {
                setKeyboard(e.detail === 0)
                onZoom(s.id === zoom?.id ? (zoom.parentId ?? null) : s.id)
              }}
              onPointerEnter={() => setHoverId(s.id)}
              onFocus={() => setHoverId(s.id)}
              onBlur={() => setHoverId(null)}
              aria-label={`${s.name}, ${kinds[s.kind].label}, ${running ? 'running' : formatMs(endOf(s) - s.startMs)}${error ? ', failed' : ''}. Zoom in`}
              className={cn(
                'absolute flex h-7 items-center gap-1 overflow-hidden rounded-lg px-2 text-left text-[0.6875rem] font-medium whitespace-nowrap outline-offset-1 transition-opacity duration-150',
                error && ERROR_BLOCK,
                hoverId && hoverId !== s.id && 'opacity-70',
                running && 'animate-pulse',
              )}
              style={{
                minWidth: 4,
                ...(error ? {} : { background: kinds[s.kind].color, color: kinds[s.kind].ink }),
              }}
            >
              {error && px >= PAD_PX + 6 && <span aria-hidden="true">!</span>}
              {showName && <span className="min-w-0 truncate">{s.name}</span>}
              {showDuration && (
                <span className="shrink-0 font-mono opacity-75">{duration}</span>
              )}
            </motion.button>
          )
        })}
        {hover && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 rounded-lg bg-popover px-2 py-1 font-mono text-[0.6875rem] whitespace-nowrap text-popover-foreground shadow-sm ring-1 ring-foreground/10"
            style={{
              top: Math.max((lane.get(hover.id)! - top) * LANE_PX - 26, 0),
              left: `${Math.min(Math.max(pct(hover.startMs), 0), 70)}%`,
            }}
          >
            {hover.name} · {formatMs(endOf(hover) - hover.startMs)}
            {tokensOf(hover) > 0 && ` · ${formatTokens(tokensOf(hover))} tok`}
          </div>
        )}
      </div>
      <p className="mt-3 truncate text-xs text-muted-foreground">
        {focus ? (
          <>
            <span className="text-foreground">{focus.name}</span> ·{' '}
            {kinds[focus.kind].label}
            {focus.model && ` · ${focus.model}`} ·{' '}
            {formatMs(endOf(focus) - focus.startMs)}
            {tokensOf(focus) > 0 && ` · ${formatTokens(tokensOf(focus))} tokens`}
            {focus.costUsd !== undefined && ` · ${formatCost(focus.costUsd)}`}
            {focus.status === 'error' && <span className={ERROR_TEXT}> · failed</span>}
          </>
        ) : (
          'Click a block to zoom in, Esc to step back out'
        )}
      </p>
    </>
  )
}

const METRIC_OPTIONS: { value: TraceMetric; label: string }[] = [
  { value: 'time', label: 'Time' },
  { value: 'tokens', label: 'Tokens' },
  { value: 'cost', label: 'Cost' },
]

/** Time, tokens or cost totalled per span name, as share bars. */
function Breakdown({ spans, elapsedMs }: { spans: TraceSpan[]; elapsedMs: number }) {
  const [metric, setMetric] = useState<TraceMetric>('time')
  const list = groupSpans(spans, elapsedMs).sort((a, b) => b[metric] - a[metric])
  const total = list.reduce((n, g) => n + g[metric], 0) || 1
  const show = (n: number) =>
    metric === 'time' ? formatMs(n) : metric === 'tokens' ? formatTokens(n) : formatCost(n)

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Agent spans excluded: they wrap their children
        </p>
        <Segmented
          label="Metric"
          value={metric}
          onValueChange={(next) => setMetric(next as TraceMetric)}
          options={METRIC_OPTIONS}
        />
      </div>
      <ol className="flex flex-col gap-1">
        {list.map((g) => (
          <motion.li
            layout
            key={g.name}
            transition={{ layout: zoomMove }}
            className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-x-3 rounded-xl px-2 py-2 hover:bg-foreground/[0.03] @md:grid-cols-[minmax(0,1fr)_3rem_4.5rem]"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-mono text-xs">
                {g.name}
                <span className="font-sans text-[0.6875rem] text-muted-foreground">
                  {kinds[g.kind].label}
                </span>
                {g.errors > 0 && (
                  <StatusPill
                    size="sm"
                    tone="negative"
                    className="h-4 px-1.5 font-sans text-[0.625rem]"
                  >
                    {g.errors} failed
                  </StatusPill>
                )}
              </p>
              <ProgressBar
                kind="meter"
                striped
                color={kinds[g.kind].color}
                value={g[metric]}
                max={total}
                label={`${g.name} share of ${metric}`}
                className="mt-1.5 bg-foreground/[0.06]"
              />
            </div>
            <span className="hidden text-right font-mono text-[0.6875rem] text-muted-foreground tabular-nums @md:block">
              {g.calls}×
            </span>
            <span className="text-right font-mono text-xs tabular-nums">
              {show(g[metric])}
              <span className="block text-[0.625rem] text-muted-foreground">
                {Math.round((g[metric] / total) * 100)}%
              </span>
            </span>
          </motion.li>
        ))}
      </ol>
    </>
  )
}

export { Breakdown, Flame }
