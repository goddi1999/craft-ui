import { Content, List, Root, Trigger } from '@radix-ui/react-tabs'
import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { ActivityHeatmap } from './ActivityHeatmap'
import { GroupTimeline } from './GroupTimeline'
import {
  TASK_ACTIVITY_DAYS,
  TASK_ACTIVITY_GROUPS,
} from './task-activity-timeline.data'
import type {
  ActivityDay,
  ActivityGroup,
} from './task-activity-timeline.types'
import { HOURS, countActive, formatHour } from './task-activity-timeline.utils'

export type TaskActivityView = 'heatmap' | 'groups'

export type TaskActivityTimelineProps = {
  /** Days in display order. @default TASK_ACTIVITY_DAYS */
  days?: ActivityDay[]
  /** Groups in row and legend order. @default TASK_ACTIVITY_GROUPS */
  groups?: ActivityGroup[]
  /** Callout above the chart. Omit to show the derived peak and idle groups; pass `null` to hide. */
  insight?: ReactNode
  /** Controlled view. */
  view?: TaskActivityView
  /** Initial view when uncontrolled. @default 'heatmap' */
  defaultView?: TaskActivityView
  onViewChange?: (view: TaskActivityView) => void
  /** Label every nth hour row in the heatmap. @default 4 */
  hourLabelEvery?: number
  className?: string
}

const triggerClass =
  'rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground outline-none ' +
  'transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none ' +
  'hover:text-foreground active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 ' +
  'data-[state=active]:border-foreground/20 data-[state=active]:bg-muted data-[state=active]:font-medium data-[state=active]:text-foreground'

export function TaskActivityTimeline({
  days = TASK_ACTIVITY_DAYS,
  groups = TASK_ACTIVITY_GROUPS,
  insight,
  view,
  defaultView = 'heatmap',
  onViewChange,
  hourLabelEvery = 4,
  className,
}: TaskActivityTimelineProps) {
  const callout = insight === undefined ? deriveInsight(days, groups) : insight

  return (
    <Root
      data-slot="task-activity-timeline"
      value={view}
      defaultValue={defaultView}
      onValueChange={(next) => onViewChange?.(next as TaskActivityView)}
      className={cn(
        'w-full text-foreground [--heat:#3B6D11] dark:[--heat:#A6D96A]',
        className,
      )}
    >
      <List aria-label="Chart view" className="mb-5 flex gap-1">
        <Trigger value="heatmap" className={triggerClass}>
          Heatmap
        </Trigger>
        <Trigger value="groups" className={triggerClass}>
          By group
        </Trigger>
      </List>

      {callout !== null && (
        <p className="mb-5 flex items-center gap-2 rounded-md bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
          <CircleAlert
            aria-hidden="true"
            className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <span>{callout}</span>
        </p>
      )}

      <Content value="heatmap" className="outline-none">
        <ActivityHeatmap days={days} hourLabelEvery={hourLabelEvery} />
      </Content>
      <Content value="groups" className="outline-none">
        <GroupTimeline days={days} groups={groups} />
      </Content>
    </Root>
  )
}

function deriveInsight(days: ActivityDay[], groups: ActivityGroup[]) {
  const peak = days
    .flatMap((day) =>
      HOURS.map((hour) => ({ day, hour, count: countActive(day, hour) })),
    )
    .reduce((best, cell) => (cell.count > best.count ? cell : best), {
      day: days[0],
      hour: 0,
      count: 0,
    })
  const idle = groups.filter(
    (group) => !days.some((day) => day.sessions[group.key]?.length),
  )

  if (peak.count === 0) return 'No group activity recorded'
  return (
    <>
      Peak activity{' '}
      <strong className="font-medium text-foreground">
        {peak.day.label} {formatHour(peak.hour)}
      </strong>{' '}
      · {peak.count} groups at once
      {idle.length > 0 &&
        ` · ${idle.map((group) => group.label).join(', ')} never edited`}
    </>
  )
}
