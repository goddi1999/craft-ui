import { CircleAlert } from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { TASK_EDITING_SAMPLE } from './task-editing-heatmap.data'
import type {
  EditingHeatmapCell,
  EditingHeatmapDay,
} from './task-editing-heatmap.types'
import {
  HOURS,
  LEVEL_COUNT,
  findPeak,
  formatHour,
  levelColor,
  toCells,
  toLevel,
} from './task-editing-heatmap.utils'

export type TaskEditingHeatmapProps = {
  /** One entry per weekday column. @default TASK_EDITING_SAMPLE */
  data?: EditingHeatmapDay[]
  /** Chart title. @default 'Editing activity — Aufgabe: Wundheilung Phasen' */
  title?: string
  /** Date range shown beside the title. @default 'Mon 17 Mar – Sun 23 Mar' */
  subtitle?: string
  /** Callout above the grid. Omit to show the derived peak; pass `null` to hide. */
  insight?: ReactNode
  /** Label every nth hour row. @default 3 */
  hourLabelEvery?: number
  /** Unit used in the readout and the accessible summary. @default 'edits' */
  unit?: string
  className?: string
}

export function TaskEditingHeatmap({
  data = TASK_EDITING_SAMPLE,
  title = 'Editing activity — Aufgabe: Wundheilung Phasen',
  subtitle = 'Mon 17 Mar – Sun 23 Mar',
  insight,
  hourLabelEvery = 3,
  unit = 'edits',
  className,
}: TaskEditingHeatmapProps) {
  const [hovered, setHovered] = useState<EditingHeatmapCell | null>(null)

  const cells = toCells(data)
  const max = Math.max(0, ...cells.map((cell) => cell.value))
  const peak = findPeak(cells)
  const total = cells.reduce((sum, cell) => sum + cell.value, 0)

  const summary = peak
    ? `Heatmap of ${total} ${unit} across ${data.length} days. Peak: ${peak.day} ${formatHour(peak.hour)} with ${peak.value} ${unit}.`
    : `Heatmap with no ${unit}.`

  const derivedInsight = peak ? (
    <>
      Most editing on{' '}
      <strong className="font-medium text-foreground">
        {peak.day} {formatHour(peak.hour)}
      </strong>{' '}
      · {peak.value} {unit}
    </>
  ) : (
    `No ${unit} recorded`
  )
  const callout = insight === undefined ? derivedInsight : insight

  return (
    <figure
      data-slot="task-editing-heatmap"
      className={cn(
        'w-full text-foreground [--heat:#3B6D11] dark:[--heat:#A6D96A]',
        className,
      )}
    >
      <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </figcaption>

      {callout !== null && (
        <p className="mb-5 flex items-center gap-2 rounded-md bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
          <CircleAlert
            aria-hidden="true"
            className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <span>{callout}</span>
        </p>
      )}

      <div className="overflow-x-auto">
        <div
          role="img"
          aria-label={summary}
          className="grid min-w-[400px] grid-cols-[52px_repeat(var(--cols),minmax(0,1fr))] gap-[3px]"
          style={{ '--cols': data.length } as CSSProperties}
          onPointerLeave={() => setHovered(null)}
        >
          <span aria-hidden="true" />
          {data.map((day) => (
            <span
              key={day.label}
              aria-hidden="true"
              className="pb-1 text-center text-[11px] text-muted-foreground"
            >
              {day.label}
            </span>
          ))}

          {HOURS.map((hour) => (
            <HourRow
              key={hour}
              hour={hour}
              showLabel={hour % hourLabelEvery === 0}
              cells={cells.filter((cell) => cell.hour === hour)}
              max={max}
              hovered={hovered}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-[3px]">
            {Array.from({ length: LEVEL_COUNT + 1 }, (_, level) => (
              <span
                key={level}
                className="size-3.5 rounded-[2px]"
                style={{ background: levelColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        <span className="tabular-nums">
          {hovered
            ? `${hovered.day} ${formatHour(hovered.hour)} · ${hovered.value} ${unit}`
            : 'Hover a cell for details'}
        </span>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Active hours</th>
          </tr>
        </thead>
        <tbody>
          {data.map((day) => (
            <tr key={day.label}>
              <th scope="row">{day.label}</th>
              <td>
                {HOURS.filter((hour) => day.edits[hour])
                  .map((hour) => `${formatHour(hour)}: ${day.edits[hour]}`)
                  .join(', ') || `No ${unit}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

type HourRowProps = {
  hour: number
  showLabel: boolean
  cells: EditingHeatmapCell[]
  max: number
  hovered: EditingHeatmapCell | null
  onHover: (cell: EditingHeatmapCell) => void
}

function HourRow({
  hour,
  showLabel,
  cells,
  max,
  hovered,
  onHover,
}: HourRowProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="h-[18px] pr-2 text-right text-[11px] leading-[18px] text-muted-foreground tabular-nums"
      >
        {showLabel ? formatHour(hour) : ''}
      </span>
      {cells.map((cell) => {
        const isHovered = hovered?.day === cell.day && hovered.hour === hour
        return (
          <span
            key={cell.day}
            className={cn(
              'h-[18px] rounded-[3px] outline-offset-1',
              isHovered && 'outline-1 outline-foreground/60 outline-solid',
            )}
            style={{ background: levelColor(toLevel(cell.value, max)) }}
            onPointerEnter={() => onHover(cell)}
          />
        )
      })}
    </>
  )
}
