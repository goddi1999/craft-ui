import { useState } from 'react'

import { cn } from '@/lib/utils'

import {
  TASK_SUBMISSION_DUE,
  TASK_SUBMISSION_SAMPLE,
} from './task-submission-scatter.data'
import type {
  PlottedSubmission,
  Submission,
} from './task-submission-scatter.types'
import {
  STATUS_META,
  STATUS_ORDER,
  getDayTicks,
  plot,
  toX,
} from './task-submission-scatter.utils'

export type TaskSubmissionScatterProps = {
  /** One row per group, top to bottom. @default TASK_SUBMISSION_SAMPLE */
  submissions?: Submission[]
  /** Local ISO due timestamp, drawn as a dashed line. @default TASK_SUBMISSION_DUE */
  dueAt?: string
  /** Hours before the due date that still count as on time; anything earlier is early. @default 24 */
  earlyWindowHours?: number
  /** Locale for axis ticks and tooltips. @default 'de-DE' */
  locale?: string
  className?: string
}

const ROW_HEIGHT = 40

const STAT_TONES = {
  total: 'text-foreground',
  early: 'text-emerald-600 dark:text-emerald-400',
  onTime: 'text-amber-600 dark:text-amber-400',
  lateOrMissing: 'text-red-600 dark:text-red-400',
} as const

export function TaskSubmissionScatter({
  submissions = TASK_SUBMISSION_SAMPLE,
  dueAt = TASK_SUBMISSION_DUE,
  earlyWindowHours = 24,
  locale = 'de-DE',
  className,
}: TaskSubmissionScatterProps) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const due = new Date(dueAt).getTime()
  const { points, start, end } = plot(submissions, due, earlyWindowHours)
  const ticks = getDayTicks(start, end)
  const dueX = toX(due, start, end)

  const tickFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  // Narrow plots only have room for day and month on the axis.
  const shortTickFormat = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'numeric',
  })
  const stampFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  const describe = (point: PlottedSubmission) =>
    point.submittedAt
      ? `Submitted ${stampFormat.format(new Date(point.submittedAt))}`
      : 'Not submitted'

  const count = (status: PlottedSubmission['status']) =>
    points.filter((point) => point.status === status).length
  const stats = [
    { label: 'Total groups', value: points.length, tone: STAT_TONES.total },
    { label: 'Submitted early', value: count('early'), tone: STAT_TONES.early },
    { label: 'On time', value: count('onTime'), tone: STAT_TONES.onTime },
    {
      label: 'Late / missing',
      value: count('late') + count('missing'),
      tone: STAT_TONES.lateOrMissing,
    },
  ]

  return (
    <figure
      data-slot="task-submission-scatter"
      className={cn('w-full text-foreground', className)}
    >
      <dl className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-muted px-3.5 py-3">
            <dt className="mb-1 text-xs text-muted-foreground">{stat.label}</dt>
            <dd className={cn('text-2xl font-medium tabular-nums', stat.tone)}>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto pb-1">
        <div className="grid min-w-[280px] grid-cols-[auto_1fr] gap-x-3 pt-6 pr-6 sm:pr-8">
          <ul aria-hidden="true">
            {points.map((point) => (
              <li
                key={point.group}
                className="flex items-center justify-end text-xs text-muted-foreground"
                style={{ height: ROW_HEIGHT }}
              >
                {point.group}
              </li>
            ))}
          </ul>

          <div
            className="relative"
            style={{ height: points.length * ROW_HEIGHT }}
            onPointerLeave={() => setActiveGroup(null)}
          >
            {points.map((point, row) => (
              <span
                key={point.group}
                aria-hidden="true"
                className="absolute inset-x-0 border-t border-border/60"
                style={{ top: (row + 0.5) * ROW_HEIGHT }}
              />
            ))}
            {ticks.map((tick) => (
              <span
                key={tick}
                aria-hidden="true"
                className="absolute inset-y-0 border-l border-border/60"
                style={{ left: `${toX(tick, start, end)}%` }}
              />
            ))}

            <span
              aria-hidden="true"
              className="absolute inset-y-0 border-l-[1.5px] border-dashed border-[#E24B4A]/70"
              style={{ left: `${dueX}%` }}
            >
              <span className="absolute -top-5 left-0 -translate-x-1/2 text-[11px] whitespace-nowrap text-[#E24B4A]">
                Due date
              </span>
            </span>

            {points.map((point, row) => (
              <Marker
                key={point.group}
                point={point}
                top={(row + 0.5) * ROW_HEIGHT}
                detail={describe(point)}
                isActive={activeGroup === point.group}
                onActivate={setActiveGroup}
                onDeactivate={() => setActiveGroup(null)}
              />
            ))}
          </div>

          <span />
          <div aria-hidden="true" className="relative mt-2 h-4">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute -translate-x-1/2 text-[11px] whitespace-nowrap text-muted-foreground"
                style={{ left: `${toX(tick, start, end)}%` }}
              >
                <span className="sm:hidden">
                  {shortTickFormat.format(new Date(tick))}
                </span>
                <span className="max-sm:hidden">
                  {tickFormat.format(new Date(tick))}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-3.5 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {STATUS_ORDER.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: STATUS_META[status].color }}
            />
            {STATUS_META[status].label}
          </li>
        ))}
      </ul>

      <figcaption className="sr-only">
        Submission times per group against the due date{' '}
        {stampFormat.format(new Date(due))}.
      </figcaption>
    </figure>
  )
}

type MarkerProps = {
  point: PlottedSubmission
  top: number
  detail: string
  isActive: boolean
  onActivate: (group: string) => void
  onDeactivate: () => void
}

function Marker({
  point,
  top,
  detail,
  isActive,
  onActivate,
  onDeactivate,
}: MarkerProps) {
  const isMissing = point.status === 'missing'
  const { label, color } = STATUS_META[point.status]
  const alignEnd = point.x > 70

  return (
    <button
      type="button"
      aria-label={`${point.group}: ${detail} (${label})`}
      className="group absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      style={{ left: `${point.x}%`, top }}
      onPointerEnter={() => onActivate(point.group)}
      onFocus={() => onActivate(point.group)}
      onBlur={onDeactivate}
    >
      <span
        aria-hidden="true"
        className={cn(
          'block transition-transform duration-150 ease-out motion-reduce:transition-none',
          isMissing ? 'size-2.5 rotate-45 rounded-[2px]' : 'size-[18px] rounded-full',
          isActive && 'scale-125',
        )}
        style={{ background: color }}
      />
      {isActive && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute bottom-full z-10 mb-1.5 rounded-md border border-border bg-popover px-2.5 py-2 text-left whitespace-nowrap text-popover-foreground shadow-md',
            alignEnd ? 'right-0' : 'left-1/2 -translate-x-1/2',
          )}
        >
          <span className="block text-[13px] font-medium">{point.group}</span>
          <span className="block text-xs text-muted-foreground">{detail}</span>
        </span>
      )}
    </button>
  )
}
