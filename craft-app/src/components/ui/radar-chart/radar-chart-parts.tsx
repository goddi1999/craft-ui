// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { motion } from 'motion/react'

import { TIP, enter, exit } from './radar-chart.constants'
import type { ColoredMember, RadarBaseline, RadarSeries } from './radar-chart.types'

type TooltipProps = {
  axis: string
  value: string
  tip: readonly [number, number]
  cy: number
  width: number
  height: number
  fromKeyboard: boolean
  members: ColoredMember[]
  memberLine: string
  baseline?: RadarBaseline
  baselineValue: string
}

/** Floating card for the active axis. Opens below the vertex on the top half, above on the bottom. */
export function RadarTooltip({
  axis,
  value,
  tip,
  cy,
  width,
  height,
  fromKeyboard,
  members,
  memberLine,
  baseline,
  baselineValue,
}: TooltipProps) {
  return (
    <motion.div
      key="tip"
      initial={fromKeyboard ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1, transition: enter }}
      exit={{ opacity: 0, transition: exit }}
      className="pointer-events-none absolute z-10 rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10"
      style={{
        width: Math.min(TIP, width),
        left: Math.min(Math.max(tip[0] - TIP / 2, 0), Math.max(width - TIP, 0)),
        ...(tip[1] <= cy
          ? { top: tip[1] + 12, transformOrigin: 'top center' }
          : { bottom: height - tip[1] + 12, transformOrigin: 'bottom center' }),
      }}
    >
      <p className="flex gap-3">
        <span className="flex-1 font-medium">{axis}</span>
        <span className="font-mono tabular-nums">{value}</span>
      </p>
      {members.length > 0 && (
        <p className="mt-1 font-mono text-[0.8125rem] text-foreground tabular-nums">
          {memberLine}
        </p>
      )}
      {baseline && (
        <p className="mt-1 flex gap-3 text-muted-foreground">
          <span className="flex-1">{baseline.label}</span>
          <span className="font-mono tabular-nums">{baselineValue}</span>
        </p>
      )}
    </motion.div>
  )
}

type LegendProps = {
  series: RadarSeries
  color: string
  baseline?: RadarBaseline
  members: ColoredMember[]
}

export function RadarLegend({ series, color, baseline, members }: LegendProps) {
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ background: color }}
        />
        {series.label}
      </span>
      {baseline && (
        <span className="flex items-center gap-1.5">
          <svg aria-hidden="true" width={12} height={2} className="overflow-visible">
            <line
              x1={0}
              y1={1}
              x2={12}
              y2={1}
              className="stroke-foreground/45"
              strokeWidth={1.25}
              strokeDasharray="3 2"
            />
          </svg>
          {baseline.label}
        </span>
      )}
      {members.map((m) => (
        <span key={m.id} className="flex items-center gap-1.5" title={m.name}>
          <span
            aria-hidden="true"
            className="size-2 rounded-full"
            style={{ background: m.color }}
          />
          {m.label}
        </span>
      ))}
    </div>
  )
}

type TableProps = {
  title: string
  axes: string[]
  series: RadarSeries
  values: string[]
  baseline?: RadarBaseline
  members: ColoredMember[]
  format: (value: number) => string
}

/** The same numbers as a table, for screen readers. */
export function RadarDataTable({
  title,
  axes,
  series,
  values,
  baseline,
  members,
  format,
}: TableProps) {
  return (
    <table className="sr-only">
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">Axis</th>
          <th scope="col">{series.label}</th>
          {baseline && <th scope="col">{baseline.label}</th>}
          {members.map((m) => (
            <th key={m.id} scope="col">
              {m.name ?? m.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {axes.map((axis, i) => (
          <tr key={axis}>
            <th scope="row">{axis}</th>
            <td>{values[i]}</td>
            {baseline && <td>{format(baseline.values[i] ?? 0)}</td>}
            {members.map((m) => (
              <td key={m.id}>{format(m.values[i] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
