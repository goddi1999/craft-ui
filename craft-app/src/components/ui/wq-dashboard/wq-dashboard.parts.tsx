import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  FOCUS_RING,
  PRESS,
  TONE_CALLOUT,
  TONE_FILL,
  TONE_SOFT,
  TONE_TEXT,
} from './wq-dashboard.tones'
import type {
  Activity,
  Callout as CalloutData,
  Classroom,
  Metric,
  NavSection,
  PageHeading,
  Profile,
  Quest,
  Status,
  StubPage,
  Tone,
  Usage,
} from './wq-dashboard.types'

/* ─── Shell ─── */

type DashboardShellProps<Id extends string> = {
  profile: Profile
  nav: NavSection<Id>[]
  activePage: Id
  onNavigate: (page: Id) => void
  children: ReactNode
}

/** Sidebar + main frame. The sidebar collapses into a scrolling strip when the dashboard is narrow. */
export function DashboardShell<Id extends string>({
  profile,
  nav,
  activePage,
  onNavigate,
  children,
}: DashboardShellProps<Id>) {
  return (
    <div className="grid min-h-[520px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground @3xl:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="flex min-w-0 flex-col border-b border-border bg-muted/60 pt-4 @3xl:border-r @3xl:border-b-0 @3xl:pb-4">
        <div className="mb-2 border-b border-border px-4 pb-3.5">
          <p className="truncate text-[13px] font-medium">{profile.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {profile.role}
          </p>
        </div>
        <nav aria-label={`${profile.role} navigation`}>
          <ul className="flex overflow-x-auto @3xl:flex-col @3xl:gap-0.5 @3xl:overflow-visible">
            {nav.map((section, index) => (
              <li key={section.title ?? index} className="contents">
                {section.title && (
                  <p className="mt-2 hidden px-3 pt-1 pb-0.5 text-[10px] font-medium tracking-[0.06em] text-muted-foreground uppercase @3xl:block">
                    {section.title}
                  </p>
                )}
                <ul className="contents">
                  {section.items.map((item) => (
                    <li key={item.id} className="shrink-0">
                      <button
                        type="button"
                        aria-current={item.id === activePage ? 'page' : undefined}
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                          'group flex w-full items-center gap-2 px-4 py-[7px] text-left text-[13px] whitespace-nowrap text-muted-foreground',
                          'transition-[background-color,color] duration-100 ease-out motion-reduce:transition-none',
                          'hover:bg-background hover:text-foreground aria-[current=page]:bg-background aria-[current=page]:font-medium aria-[current=page]:text-foreground',
                          FOCUS_RING,
                          'focus-visible:ring-inset',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="-mr-1 hidden h-4 w-[3px] shrink-0 rounded-sm bg-sky-500 opacity-0 group-aria-[current=page]:opacity-100 @3xl:block"
                        />
                        {item.label}
                        {item.badge !== undefined && (
                          <span
                            className={cn(
                              'ml-auto rounded-full px-1.5 py-px text-[10px] tabular-nums',
                              TONE_SOFT.danger,
                            )}
                          >
                            {item.badge}
                            <span className="sr-only"> new</span>
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="@container/main min-w-0 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}

/* ─── Text blocks ─── */

export function PageHeader({ title, subtitle }: PageHeading) {
  return (
    <header className="mb-5">
      <h3 className="mb-1 text-base font-medium">{title}</h3>
      <p className="text-[13px] text-muted-foreground">{subtitle}</p>
    </header>
  )
}

export function SectionHeader({
  title,
  action,
}: {
  title?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3">
      {title ? <h4 className="text-[13px] font-medium">{title}</h4> : <span />}
      {action}
    </div>
  )
}

export function LinkButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-sm text-xs font-medium hover:underline',
        TONE_TEXT.info,
        PRESS,
        FOCUS_RING,
      )}
    >
      {children}
    </button>
  )
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-lg bg-muted px-4 py-3.5', className)}>
      {title && <h4 className="mb-2 text-[13px] font-medium">{title}</h4>}
      {children}
    </section>
  )
}

export function StubView({ stub }: { stub: StubPage }) {
  return (
    <>
      <PageHeader title={stub.title} subtitle={stub.subtitle} />
      <Panel>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {stub.body}
        </p>
      </Panel>
    </>
  )
}

export function Callout<Id extends string>({
  callout,
  onNavigate,
}: {
  callout: CalloutData<Id>
  onNavigate: (page: Id) => void
}) {
  const Icon = callout.icon
  const { action } = callout
  return (
    <div
      role="status"
      className={cn(
        'mb-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px]',
        TONE_CALLOUT[callout.tone],
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>
        {callout.message}{' '}
        {action && (
          <button
            type="button"
            onClick={() => onNavigate(action.target)}
            className={cn('rounded-sm font-medium underline', FOCUS_RING)}
          >
            {action.label} →
          </button>
        )}
      </p>
    </div>
  )
}

/* ─── Figures ─── */

export function Pill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        TONE_SOFT[status.tone],
      )}
    >
      {status.label}
    </span>
  )
}

export function ProgressBar({
  percent,
  tone,
  label,
  className,
}: {
  percent: number
  tone: Tone
  label: string
  className?: string
}) {
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'h-1.5 overflow-hidden rounded-full bg-foreground/10',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full', TONE_FILL[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

const METRIC_COLUMNS = {
  3: 'grid-cols-1 @md/main:grid-cols-3',
  4: 'grid-cols-2 @2xl/main:grid-cols-4',
} as const

export function MetricGrid({
  metrics,
  columns,
}: {
  metrics: Metric[]
  columns: keyof typeof METRIC_COLUMNS
}) {
  return (
    <dl className={cn('mb-5 grid gap-2.5', METRIC_COLUMNS[columns])}>
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg bg-muted px-4 py-3.5">
          <dt className="mb-1.5 text-[11px] font-medium tracking-[0.03em] text-muted-foreground uppercase">
            {metric.label}
          </dt>
          <dd
            className={cn(
              'font-medium tabular-nums',
              metric.compact ? 'text-base' : 'text-[22px] leading-tight',
              metric.valueTone && TONE_TEXT[metric.valueTone],
            )}
          >
            {metric.value}
          </dd>
          {metric.note && (
            <dd
              className={cn(
                'mt-1 text-[11px]',
                TONE_TEXT[metric.noteTone ?? 'neutral'],
              )}
            >
              {metric.note}
            </dd>
          )}
          {metric.progress && (
            <dd>
              <ProgressBar
                className="mt-1.5"
                label={metric.label}
                {...metric.progress}
              />
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}

export function UsageList({
  items,
  labelWidth = 'w-24',
}: {
  items: Usage[]
  /** Tailwind width class for the label column. */
  labelWidth?: string
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5">
          <span
            className={cn(
              'shrink-0 truncate text-xs text-muted-foreground',
              labelWidth,
            )}
          >
            {item.label}
          </span>
          <ProgressBar
            className="flex-1"
            label={`${item.label}: ${item.display}`}
            percent={item.percent}
            tone={item.tone}
          />
          <span className="w-16 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums">
            {item.display}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-2.5 py-2">
          <span
            aria-hidden="true"
            className={cn('mt-1 size-2 shrink-0 rounded-full', TONE_FILL[item.tone])}
          />
          <div>
            <p className="text-xs leading-snug">{item.text}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {item.time}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ─── Table ─── */

export type Column<Row> = {
  header: string
  cell: (row: Row) => ReactNode
  /** Hides the visible header, e.g. for an actions column. */
  srOnlyHeader?: boolean
}

export function DataTable<Row>({
  columns,
  rows,
  getKey,
  caption,
}: {
  columns: Column<Row>[]
  rows: Row[]
  getKey: (row: Row) => string
  caption: string
}) {
  return (
    <div className="mb-5 overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className="border-b border-border px-2.5 py-1.5 text-left text-[11px] font-medium tracking-[0.03em] whitespace-nowrap text-muted-foreground uppercase"
              >
                <span className={cn(column.srOnlyHeader && 'sr-only')}>
                  {column.header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getKey(row)}
              className="transition-colors duration-100 hover:bg-muted motion-reduce:transition-none"
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className="border-b border-border px-2.5 py-2 whitespace-nowrap [tr:last-child>&]:border-b-0"
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Cards ─── */

function InlineStats({ classroom }: { classroom: Classroom }) {
  return (
    <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
      {classroom.stats.map((stat) => (
        <li key={stat.label} className="text-[11px] text-muted-foreground">
          <strong className="font-medium text-foreground">{stat.value}</strong>{' '}
          {stat.label}
        </li>
      ))}
    </ul>
  )
}

const CARD_SURFACE = 'rounded-lg border border-border bg-muted px-4 py-3.5'

/** Classroom summary. Pass `onSelect` to make the whole card a button. */
export function ClassroomCard({
  classroom,
  onSelect,
}: {
  classroom: Classroom
  onSelect?: () => void
}) {
  const heading = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium">{classroom.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{classroom.meta}</p>
      </div>
      {classroom.status && <Pill status={classroom.status} />}
    </div>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          CARD_SURFACE,
          'w-full text-left hover:border-foreground/25 active:scale-[0.99]',
          'transition-[border-color,transform] duration-150 ease-out motion-reduce:transition-none',
          FOCUS_RING,
        )}
      >
        {heading}
        <InlineStats classroom={classroom} />
      </button>
    )
  }

  return (
    <article className={CARD_SURFACE}>
      {heading}
      <InlineStats classroom={classroom} />
      {classroom.actions && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {classroom.actions.map((action) => (
            <LinkButton key={action}>{action}</LinkButton>
          ))}
        </div>
      )}
    </article>
  )
}

export function QuestCard({ quest }: { quest: Quest }) {
  const Icon = quest.icon
  return (
    <article className="flex items-center gap-3 rounded-lg border border-border bg-muted px-3.5 py-3">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md',
          TONE_SOFT[quest.tone],
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium">{quest.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{quest.subtitle}</p>
        {quest.progress !== undefined && (
          <ProgressBar
            className="mt-1.5"
            label={`${quest.title} progress`}
            percent={quest.progress}
            tone="success"
          />
        )}
      </div>
      <span
        className={cn(
          'shrink-0 text-[11px] whitespace-nowrap',
          TONE_TEXT[quest.status.tone],
        )}
      >
        {quest.status.label}
      </span>
    </article>
  )
}
