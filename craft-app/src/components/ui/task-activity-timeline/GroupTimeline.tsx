import type { ActivityDay, ActivityGroup } from './task-activity-timeline.types'
import {
  AXIS_TICKS,
  formatHour,
  formatRun,
  toRuns,
} from './task-activity-timeline.utils'

type GroupTimelineProps = {
  days: ActivityDay[]
  groups: ActivityGroup[]
  className?: string
}

/** One 24-hour track per group per day, with consecutive hours merged into blocks. */
export function GroupTimeline({ days, groups, className }: GroupTimelineProps) {
  const activeDays = days.filter((day) =>
    groups.some((group) => day.sessions[group.key]?.length),
  )

  return (
    <div className={className}>
      <div className="flex flex-col gap-5">
        {activeDays.map((day) => (
          <section key={day.label} aria-label={day.label}>
            <h4 className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {day.label}
            </h4>
            <div
              aria-hidden="true"
              className="mb-1 grid grid-cols-[64px_1fr] gap-2"
            >
              <span />
              <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground tabular-nums">
                {AXIS_TICKS.map((tick) => (
                  <span key={tick}>{formatHour(tick)}</span>
                ))}
              </div>
            </div>
            <ul className="flex flex-col gap-1.5">
              {groups.map((group) => {
                const hours = day.sessions[group.key]
                if (!hours?.length) return null
                return <GroupRow key={group.key} group={group} hours={hours} />
              })}
            </ul>
          </section>
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {groups.map((group) => (
          <li
            key={group.key}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ background: group.color }}
            />
            {group.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

type GroupRowProps = { group: ActivityGroup; hours: number[] }

function GroupRow({ group, hours }: GroupRowProps) {
  const runs = toRuns(hours)
  const summary = `${group.label}: ${runs.map(formatRun).join(', ')}`

  return (
    <li className="grid grid-cols-[64px_1fr] items-center gap-2">
      <span className="text-right text-xs text-muted-foreground">
        {group.label}
      </span>
      <div
        role="img"
        aria-label={summary}
        className="relative h-5 overflow-hidden rounded bg-muted"
      >
        {runs.map((run) => (
          <span
            key={run.start}
            title={`${group.label} · ${formatRun(run)}`}
            className="absolute top-0.5 h-4 rounded-[3px]"
            style={{
              left: `${(run.start / 24) * 100}%`,
              width: `calc(${((run.end - run.start) / 24) * 100}% - 1px)`,
              background: group.color,
            }}
          />
        ))}
      </div>
    </li>
  )
}
