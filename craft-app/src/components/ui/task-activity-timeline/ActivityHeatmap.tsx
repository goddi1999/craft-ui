import type { CSSProperties } from 'react'

import type { ActivityDay } from './task-activity-timeline.types'
import {
  HOURS,
  LEVEL_COUNT,
  countActive,
  formatHour,
  levelColor,
  toLevel,
} from './task-activity-timeline.utils'

type ActivityHeatmapProps = {
  days: ActivityDay[]
  hourLabelEvery: number
  className?: string
}

/** Day × hour grid shaded by how many groups were editing at once. */
export function ActivityHeatmap({
  days,
  hourLabelEvery,
  className,
}: ActivityHeatmapProps) {
  const counts = days.map((day) => HOURS.map((hour) => countActive(day, hour)))
  const max = Math.max(0, ...counts.flat())

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <div
          aria-hidden="true"
          className="grid min-w-[260px] grid-cols-[40px_repeat(var(--cols),minmax(0,1fr))] sm:grid-cols-[52px_repeat(var(--cols),minmax(0,1fr))] gap-[3px]"
          style={{ '--cols': days.length } as CSSProperties}
        >
          <span />
          {days.map((day) => (
            <span
              key={day.label}
              className="pb-1 text-center text-[11px] text-muted-foreground"
            >
              {day.label}
            </span>
          ))}
          {HOURS.map((hour) => (
            <HeatRow
              key={hour}
              hour={hour}
              showLabel={hour % hourLabelEvery === 0}
              days={days}
              counts={counts.map((dayCounts) => dayCounts[hour])}
              max={max}
            />
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground"
      >
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

      <table className="sr-only">
        <caption>Groups active per hour</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Hours with active groups</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={day.label}>
              <th scope="row">{day.label}</th>
              <td>
                {HOURS.filter((hour) => counts[dayIndex][hour] > 0)
                  .map(
                    (hour) =>
                      `${formatHour(hour)}: ${counts[dayIndex][hour]} active`,
                  )
                  .join(', ') || 'No activity'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type HeatRowProps = {
  hour: number
  showLabel: boolean
  days: ActivityDay[]
  counts: number[]
  max: number
}

function HeatRow({ hour, showLabel, days, counts, max }: HeatRowProps) {
  return (
    <>
      <span className="h-[18px] pr-2 text-right text-[11px] leading-[18px] text-muted-foreground tabular-nums">
        {showLabel ? formatHour(hour) : ''}
      </span>
      {days.map((day, index) => (
        <span
          key={day.label}
          title={`${day.label} ${formatHour(hour)} — ${counts[index]} group${counts[index] === 1 ? '' : 's'} active`}
          className="h-[18px] rounded-[3px]"
          style={{ background: levelColor(toLevel(counts[index], max)) }}
        />
      ))}
    </>
  )
}
