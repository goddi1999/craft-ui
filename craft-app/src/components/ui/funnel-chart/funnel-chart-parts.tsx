import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { FADE, INSTANT, TIP_WIDTH } from './funnel-chart.constants'
import type { FunnelStage } from './funnel-chart.types'
import { dropPct, ofTop, pctText } from './funnel-chart.utils'

type SummaryProps = {
  stages: FunnelStage[]
  conv: number
  worst: number
  drop: number
}

/** Conversion headline + biggest drop-off. */
export function FunnelSummary({ stages, conv, worst, drop }: SummaryProps) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
      <p className="text-[13px] text-foreground">
        <span className="text-[22px] font-semibold tracking-[-0.03em] tabular-nums">
          {pctText(conv)}
        </span>{' '}
        <span className="text-muted-foreground">overall conversion</span>
      </p>
      <p className="text-[12px] text-muted-foreground">
        Biggest drop: {stages[worst].label} → {stages[worst + 1].label}{' '}
        <span className="tabular-nums text-rose-500">−{pctText(drop)}</span>
      </p>
    </div>
  )
}

type TooltipProps = {
  stage: FunnelStage
  index: number
  stages: FunnelStage[]
  top: number
  x: number
  y: number
  boundsWidth: number
  formatValue: (n: number) => string
  fromKeyboard: boolean
}

/** Floating card for the active stage. */
export function FunnelTooltip({
  stage,
  index,
  stages,
  top,
  x,
  y,
  boundsWidth,
  formatValue,
  fromKeyboard,
}: TooltipProps) {
  const lost =
    index < stages.length - 1 ? stage.value - stages[index + 1].value : null
  const left = Math.min(
    Math.max(x - TIP_WIDTH / 2, 0),
    Math.max(boundsWidth - TIP_WIDTH, 0),
  )

  return (
    <AnimatePresence>
      <motion.div
        key="tip"
        initial={fromKeyboard ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: FADE }}
        exit={{ opacity: 0, transition: INSTANT }}
        className="pointer-events-none absolute z-10 rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10"
        style={{
          width: Math.min(TIP_WIDTH, boundsWidth),
          left,
          top: y + 12,
          transformOrigin: 'top center',
        }}
      >
        <p className="mb-1 font-medium text-foreground">{stage.label}</p>
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground">Users</span>
          <span className="tabular-nums text-foreground">{formatValue(stage.value)}</span>
        </p>
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground">Of top</span>
          <span className="tabular-nums text-foreground">{pctText(ofTop(stage.value, top))}</span>
        </p>
        {lost !== null && (
          <p className="mt-1.5 flex justify-between gap-4 border-t border-border pt-1.5">
            <span className="text-muted-foreground">Lost next</span>
            <span className="tabular-nums text-rose-500">
              −{formatValue(lost)} ({pctText(dropPct(stage.value, stages[index + 1].value))})
            </span>
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

type TableProps = {
  stages: FunnelStage[]
  top: number
  formatValue: (n: number) => string
  caption: string
}

/** The same numbers as a table, for screen readers. */
export function FunnelDataTable({ stages, top, formatValue, caption }: TableProps) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Stage</th>
          <th scope="col">Users</th>
          <th scope="col">% of first stage</th>
        </tr>
      </thead>
      <tbody>
        {stages.map((s, i) => (
          <tr key={i}>
            <th scope="row">{s.label}</th>
            <td>{formatValue(s.value)}</td>
            <td>{pctText(ofTop(s.value, top))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type ChipProps = {
  x: number
  y: number
  label: string
  hot: boolean
}

/** Drop-off percentage pill between two stages. */
export function DropChip({ x, y, label, hot }: ChipProps) {
  return (
    <g className="select-none">
      <rect
        x={x - 28}
        y={y - 10}
        width={56}
        height={20}
        rx={10}
        className={cn(
          'fill-background',
          hot ? 'stroke-rose-400/60' : 'stroke-foreground/10',
        )}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          'text-[11px] tabular-nums',
          hot ? 'fill-rose-500' : 'fill-muted-foreground',
        )}
      >
        {label}
      </text>
    </g>
  )
}
