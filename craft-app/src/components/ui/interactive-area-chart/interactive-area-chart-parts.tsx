import { motion, type MotionValue } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  FADE,
  GRID_FADE,
  INSTANT,
  MEDIUM,
  PAD,
  PILL_SPRING,
  TIP_WIDTH,
} from './interactive-area-chart.constants'
import type { ChartPoint, ChartSeries } from './interactive-area-chart.types'
import {
  formatAxisDate,
  formatDate,
  formatTick,
  formatValue,
  indexToX,
  labelIndices,
  percentChange,
  toY,
} from './interactive-area-chart.utils'

export function ChartHeader({
  title,
  shown,
  first,
  range,
  scrubbing,
}: {
  title: string
  shown: ChartPoint
  first: ChartPoint
  range: string
  scrubbing: boolean
}) {
  const change = percentChange(first.value, shown.value)

  return (
    <div className="min-w-0">
      <p className="text-[13px] text-muted-foreground">{title}</p>
      <p className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-3xl">
        {formatValue(shown.value)}
      </p>
      <p
        className={cn(
          'mt-1 text-xs tabular-nums sm:text-[13px]',
          change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
        )}
      >
        {change >= 0 ? '+' : ''}
        {(change * 100).toFixed(1)}%{' '}
        <span className="text-muted-foreground">
          {scrubbing ? formatDate(shown.date) : `last ${range}`}
        </span>
      </p>
    </div>
  )
}

export function RangeTabs({
  id,
  ranges,
  active,
  reduced,
  onChange,
}: {
  id: string
  ranges: string[]
  active: string
  reduced: boolean
  onChange: (range: string) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Range"
      className="flex shrink-0 self-start rounded-full bg-muted p-0.5 sm:self-auto"
    >
      {ranges.map((range) => (
        <button
          key={range}
          role="tab"
          type="button"
          aria-selected={range === active}
          onClick={() => onChange(range)}
          className={cn(
            'relative z-10 rounded-full px-2.5 py-1 text-xs font-medium outline-none transition-[color,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:active:scale-100 sm:px-3',
            range === active ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {range === active && (
            <motion.span
              layoutId={`${id}-pill`}
              className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
              transition={reduced ? INSTANT : PILL_SPRING}
            />
          )}
          {range}
        </button>
      ))}
    </div>
  )
}

// keyed by range, so the old axes fade out while the new ones fade in
export function ChartGrid({
  series,
  width,
  height,
  narrow,
}: {
  series: ChartSeries
  width: number
  height: number
  narrow: boolean
}) {
  const { points, ticks, low, high } = series
  const length = points.length
  const labels = labelIndices(length, narrow ? 3 : width < MEDIUM ? 4 : 5)

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={GRID_FADE}
    >
      {ticks.map((tick) => {
        const y = toY((tick - low) / (high - low), height)
        return (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y}
              y2={y}
              stroke="currentColor"
              className="text-border"
            />
            <text
              x={PAD.left - 10}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[11px] tabular-nums"
            >
              {formatTick(tick)}
            </text>
          </g>
        )
      })}
      {labels.map((index, j) => (
        <text
          key={index}
          x={indexToX(index, length, width)}
          y={height - 6}
          textAnchor={j === 0 ? 'start' : j === labels.length - 1 ? 'end' : 'middle'}
          className="fill-muted-foreground text-[11px]"
        >
          {formatAxisDate(points[index].date, length, narrow)}
        </text>
      ))}
    </motion.g>
  )
}

export function ChartTooltip({
  point,
  x,
  visible,
}: {
  point: ChartPoint
  x: MotionValue<number>
  visible: boolean
}) {
  return (
    // the header already reads out the value, so this stays out of the accessibility tree
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 rounded-lg border border-border bg-popover px-2.5 py-1.5 shadow-sm"
      style={{ x, width: TIP_WIDTH }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={FADE}
    >
      <p className="text-[11px] leading-tight text-muted-foreground">{formatDate(point.date)}</p>
      <p className="text-sm font-medium text-popover-foreground tabular-nums">
        {formatValue(point.value)}
      </p>
    </motion.div>
  )
}
