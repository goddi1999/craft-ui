import { useState } from 'react'

import { cn } from '@/lib/utils'

import {
  Callout,
  ClassroomCard,
  DashboardShell,
  DataTable,
  LinkButton,
  MetricGrid,
  PageHeader,
  Panel,
  Pill,
  QuestCard,
  SectionHeader,
  StubView,
  type Column,
} from './wq-dashboard.parts'
import { TONE_SOFT } from './wq-dashboard.tones'
import type {
  StudentData,
  StudentPageId,
  StudentTaskRow,
} from './wq-dashboard.types'

const TASK_COLUMNS: Column<StudentTaskRow>[] = [
  { header: 'Task', cell: (row) => row.task },
  { header: 'Classroom', cell: (row) => row.classroom },
  { header: 'Due', cell: (row) => row.due },
  { header: 'Status', cell: (row) => <Pill status={row.status} /> },
]

export function StudentView({ data }: { data: StudentData }) {
  const [page, setPage] = useState<StudentPageId>('overview')

  return (
    <DashboardShell<StudentPageId>
      profile={data.profile}
      nav={data.nav}
      activePage={page}
      onNavigate={setPage}
    >
      <StudentPage data={data} page={page} onNavigate={setPage} />
    </DashboardShell>
  )
}

type StudentPageProps = {
  data: StudentData
  page: StudentPageId
  onNavigate: (page: StudentPageId) => void
}

function StudentPage({ data, page, onNavigate }: StudentPageProps) {
  switch (page) {
    case 'overview': {
      const { overview } = data
      return (
        <>
          <PageHeader title={overview.title} subtitle={overview.subtitle} />
          <Callout callout={overview.callout} onNavigate={onNavigate} />
          <MetricGrid metrics={overview.metrics} columns={3} />
          <SectionHeader title="Continue learning" />
          <div className="flex flex-col gap-2">
            {overview.quests.map((quest) => (
              <QuestCard key={quest.title} quest={quest} />
            ))}
          </div>
        </>
      )
    }
    case 'classrooms': {
      const { classrooms } = data
      return (
        <>
          <PageHeader title={classrooms.title} subtitle={classrooms.subtitle} />
          <div className="flex flex-col gap-2.5">
            {classrooms.items.map((classroom) => (
              <ClassroomCard key={classroom.name} classroom={classroom} />
            ))}
          </div>
        </>
      )
    }
    case 'tasks': {
      const { tasks } = data
      return (
        <>
          <PageHeader title={tasks.title} subtitle={tasks.subtitle} />
          <DataTable
            caption={tasks.title}
            columns={TASK_COLUMNS}
            rows={tasks.rows}
            getKey={(row) => row.task}
          />
        </>
      )
    }
    case 'play': {
      const { play } = data
      return (
        <>
          <PageHeader title={play.title} subtitle={play.subtitle} />
          <div className="grid gap-2.5 @xl/main:grid-cols-2">
            <Panel title="My game stats">
              <dl className="flex flex-col gap-2.5">
                {play.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center">
                    <dt className="w-36 text-xs text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="text-base font-medium tabular-nums">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel title="Available games">
              <ul className="flex flex-col gap-2">
                {play.games.map(({ title, icon: Icon, tone, action }) => (
                  <li
                    key={title}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-background/60 px-2.5 py-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-md',
                        TONE_SOFT[tone],
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                      {title}
                    </span>
                    <LinkButton>{action}</LinkButton>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </>
      )
    }
    case 'rewards': {
      const { rewards } = data
      return (
        <>
          <PageHeader title={rewards.title} subtitle={rewards.subtitle} />
          <MetricGrid metrics={rewards.metrics} columns={3} />
          <SectionHeader title="My Jokers" />
          <ul className="grid gap-2.5 @md/main:grid-cols-3">
            {rewards.jokers.map((joker) => (
              <li key={joker.name} className="rounded-lg bg-muted px-4 py-3.5">
                <p className="mb-2 text-[13px] font-medium">{joker.name}</p>
                <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                  {joker.available} available
                  {joker.available > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <LinkButton>Request →</LinkButton>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </>
      )
    }
    default:
      return <StubView stub={data.stubs[page]} />
  }
}
