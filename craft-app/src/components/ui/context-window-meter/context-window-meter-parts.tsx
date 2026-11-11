// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { LoaderCircle, Lock, Shrink } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import type { ColoredSegment } from './context-window-meter.types'
import { formatTokens } from './context-window-meter.utils'

type MeterGridProps = {
  cells: (string | null)[]
  count: number
  limit: number
  used: number
  percent: number
  warnAt: number
  inline: boolean
}

/** The cell grid, exposed to assistive tech as a single meter. */
export function ContextMeterGrid({
  cells,
  count,
  limit,
  used,
  percent,
  warnAt,
  inline,
}: MeterGridProps) {
  return (
    <div
      role="meter"
      aria-label="Context window usage"
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuenow={used}
      aria-valuetext={`${used.toLocaleString('en-US')} of ${limit.toLocaleString('en-US')} tokens (${percent}%)`}
      className={cn(
        'grid',
        inline ? 'w-28 grid-cols-[repeat(20,1fr)] gap-px' : 'grid-cols-20 gap-1',
      )}
    >
      {cells.map((color, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'transition-colors duration-200 ease-out motion-reduce:duration-0',
            inline ? 'h-2.5 rounded-[2px]' : 'aspect-square rounded-[3px]',
            !color &&
              (i >= Math.round(warnAt * count)
                ? 'bg-(--warning)/20'
                : 'bg-foreground/[0.07]'),
          )}
          style={{ background: color ?? undefined }}
        />
      ))}
    </div>
  )
}

type CompactButtonProps = {
  onCompact: () => void
  compacting: boolean
  warning: boolean
  inline: boolean
}

export function ContextCompactButton({
  onCompact,
  compacting,
  warning,
  inline,
}: CompactButtonProps) {
  const Icon = compacting ? LoaderCircle : Shrink
  return (
    <Button
      variant="secondary"
      size="xs"
      onClick={onCompact}
      disabled={compacting}
      aria-busy={compacting}
      aria-label={compacting ? 'Compacting context' : 'Compact context'}
      className={cn(
        'disabled:opacity-70',
        warning && 'bg-(--warning)/15 text-(--warning) hover:bg-(--warning)/25',
        inline && 'h-6 gap-1.5 px-2.5 text-[0.6875rem]',
      )}
    >
      <Icon
        strokeWidth={2.5}
        aria-hidden="true"
        className={cn(compacting && 'animate-spin motion-reduce:animate-none')}
      />
      {compacting ? 'Compacting…' : 'Compact'}
    </Button>
  )
}

export function ContextSegmentList({ segments }: { segments: ColoredSegment[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-1 px-3 py-3 @sm:grid-cols-2">
      {segments.map((s) => (
        <li key={s.id} className="flex items-start gap-2.5 py-1">
          <span
            aria-hidden="true"
            className="mt-1 size-2.5 shrink-0 rounded-[3px]"
            style={{ background: s.color }}
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 truncate text-[0.8125rem]">
              {s.label}
              {s.pinned && (
                <Lock
                  fill="currentColor"
                  fillOpacity={0.25}
                  className="size-3 shrink-0 text-muted-foreground"
                  aria-label="Pinned"
                />
              )}
            </span>
            {s.detail && (
              <span className="block truncate text-xs text-muted-foreground">
                {s.detail}
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {formatTokens(s.tokens)}
          </span>
        </li>
      ))}
    </ul>
  )
}
