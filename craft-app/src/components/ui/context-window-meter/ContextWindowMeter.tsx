// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { TriangleAlert } from 'lucide-react'
import { MotionConfig } from 'motion/react'

import { cn } from '@/lib/utils'

import { RollingNumber } from '../rolling-number'
import { Tag } from '../status-pill'
import { Panel, Shell } from '../surface'
import {
  ContextCompactButton,
  ContextMeterGrid,
  ContextSegmentList,
} from './context-window-meter-parts'
import type { ContextWindowMeterProps } from './context-window-meter.types'
import {
  PALETTE,
  WARNING_TOKEN,
  fillCells,
  formatTokens,
} from './context-window-meter.utils'

/**
 * How full the model's context window is, split by what fills it. A grid of
 * cells shows the split; past `warnAt` the last cells are tinted and the
 * compact action is highlighted. `inline` fits a composer footer.
 */
export function ContextWindowMeter({
  data,
  warnAt = 0.8,
  onCompact,
  compacting = false,
  variant = 'card',
  className,
}: ContextWindowMeterProps) {
  const { limit, segments } = data
  const used = segments.reduce((n, s) => n + s.tokens, 0)
  const ratio = used / limit
  const warning = ratio >= warnAt
  const colored = segments.map((s, i) => ({
    ...s,
    color: s.color ?? PALETTE[i % PALETTE.length],
  }))
  const inline = variant === 'inline'
  const count = inline ? 20 : 100
  const cells = fillCells(colored, limit, count)
  const percent = Math.round(ratio * 100)

  const grid = (
    <ContextMeterGrid
      cells={cells}
      count={count}
      limit={limit}
      used={used}
      percent={percent}
      warnAt={warnAt}
      inline={inline}
    />
  )

  const compactButton = onCompact && (
    <ContextCompactButton
      onCompact={onCompact}
      compacting={compacting}
      warning={warning}
      inline={inline}
    />
  )

  const announcement = compacting
    ? 'Compacting context'
    : warning
      ? 'Approaching context limit'
      : ''

  if (inline) {
    return (
      <MotionConfig reducedMotion="user">
        <div
          data-slot="context-window-meter"
          className={cn('flex items-center gap-2 text-xs', WARNING_TOKEN, className)}
        >
          {warning && (
            <TriangleAlert
              fill="currentColor"
              fillOpacity={0.25}
              className="size-3.5 text-(--warning)"
              aria-label="Near limit"
            />
          )}
          {grid}
          <span className="font-mono text-muted-foreground tabular-nums">
            <span className={cn('text-foreground', warning && 'text-(--warning)')}>
              <RollingNumber value={formatTokens(used)} />
            </span>
            {' / '}
            {formatTokens(limit)}
          </span>
          {warning && compactButton}
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </div>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="context-window-meter"
        aria-label="Context window"
        className={cn('max-w-md', WARNING_TOKEN, className)}
      >
        <Panel className="p-4">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h3 className="text-[0.8125rem] text-muted-foreground">
              Context
              {data.model && (
                <Tag className="ml-2 rounded-full px-2 text-foreground">{data.model}</Tag>
              )}
            </h3>
            {compactButton}
          </div>
          <p className="mb-4 flex items-baseline gap-2">
            <span
              className={cn(
                'font-mono text-[2rem] leading-tight font-medium tracking-tight tabular-nums',
                warning && 'text-(--warning)',
              )}
            >
              <RollingNumber value={formatTokens(used)} />
            </span>
            <span className="text-[0.8125rem] text-muted-foreground">
              of {formatTokens(limit)} · <RollingNumber value={`${percent}%`} /> full
            </span>
          </p>
          {grid}
          <p
            className={cn(
              'mt-3 flex items-center gap-1.5 text-xs',
              warning ? 'text-(--warning)' : 'text-muted-foreground',
            )}
          >
            {warning && (
              <TriangleAlert
                fill="currentColor"
                fillOpacity={0.25}
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />
            )}
            {warning
              ? `In the warning zone — ${formatTokens(Math.max(limit - used, 0))} tokens left`
              : `Tinted cells mark the last ${100 - Math.round(warnAt * 100)}%`}
          </p>
        </Panel>
        <ContextSegmentList segments={colored} />
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </Shell>
    </MotionConfig>
  )
}
