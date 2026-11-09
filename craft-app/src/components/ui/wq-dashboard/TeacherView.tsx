import { useState } from 'react'

import { cn } from '@/lib/utils'

import {
  ClassroomCard,
  DashboardShell,
  DataTable,
  LinkButton,
  MetricGrid,
  PageHeader,
  Panel,
  Pill,
  SectionHeader,
  StubView,
  UsageList,
  type Column,
} from './wq-dashboard.parts'
import { FOCUS_RING, PRESS } from './wq-dashboard.tones'
import type {
  QuickAction,
  TeacherData,
  TeacherGameRow,
  TeacherPageId,
  TeacherSubmissionRow,
} from './wq-dashboard.types'

const SUBMISSION_COLUMNS: Column<TeacherSubmissionRow>[] = [
  { header: 'Student', cell: (row) => row.student },
  { header: 'Task', cell: (row) => row.task },
  { header: 'Classroom', cell: (row) => row.classroom },
  { header: 'Submitted', cell: (row) => row.submitted },
  { header: 'Status', cell: (row) => <Pill status={row.status} /> },
]

const GAME_COLUMNS: Column<TeacherGameRow>[] = [
  { header: 'Game', cell: (row) => row.game },
  { header: 'Type', cell: (row) => row.type },
  { header: 'Version', cell: (row) => row.version },
  { header: 'Deliveries', cell: (row) => row.deliveries },
  { header: 'Status', cell: (row) => <Pill status={row.status} /> },
]

export function TeacherView({ data }: { data: TeacherData }) {
  const [page, setPage] = useState<TeacherPageId>('overview')

  return (
    <DashboardShell<TeacherPageId>
      profile={data.profile}
      nav={data.nav}
      activePage={page}
      onNavigate={setPage}
    >
      <TeacherPage data={data} page={page} onNavigate={setPage} />
    </DashboardShell>
  )
}

type TeacherPageProps = {
  data: TeacherData
  page: TeacherPageId
  onNavigate: (page: TeacherPageId) => void
}

function TeacherPage({ data, page, onNavigate }: TeacherPageProps) {
  switch (page) {
    case 'overview': {
      const { overview } = data
      return (
        <>
          <PageHeader title={overview.title} subtitle={overview.subtitle} />
          <MetricGrid metrics={overview.metrics} columns={3} />
          <div className="mb-5 grid gap-2.5 @xl/main:grid-cols-2">
            <section>
              <SectionHeader title="My classrooms" />
              <div className="flex flex-col gap-2">
                {overview.classrooms.map((classroom) => (
                  <ClassroomCard
                    key={classroom.name}
                    classroom={classroom}
                    onSelect={() => onNavigate('classrooms')}
                  />
                ))}
              </div>
            </section>
            <section>
              <SectionHeader title="Quick actions" />
              <QuickActions actions={overview.quickActions} />
            </section>
          </div>
          <SectionHeader
            title="Pending submissions"
            action={<LinkButton>View all →</LinkButton>}
          />
          <DataTable
            caption="Pending submissions"
            columns={SUBMISSION_COLUMNS}
            rows={overview.submissions}
            getKey={(row) => `${row.student}-${row.task}`}
          />
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
    case 'games': {
      const { games } = data
      return (
        <>
          <PageHeader title={games.title} subtitle={games.subtitle} />
          <SectionHeader action={<LinkButton>+ New game</LinkButton>} />
          <DataTable
            caption={games.title}
            columns={GAME_COLUMNS}
            rows={games.rows}
            getKey={(row) => row.game}
          />
        </>
      )
    }
    case 'analytics': {
      const { analytics } = data
      return (
        <>
          <PageHeader title={analytics.title} subtitle={analytics.subtitle} />
          <MetricGrid metrics={analytics.metrics} columns={3} />
          <Panel title={analytics.progressTitle}>
            <UsageList items={analytics.progress} labelWidth="w-28" />
          </Panel>
        </>
      )
    }
    default:
      return <StubView stub={data.stubs[page]} />
  }
}

function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className={cn(
            'flex flex-col items-center gap-1 rounded-lg border border-border bg-muted p-2.5 text-center text-xs text-muted-foreground',
            'hover:bg-background hover:text-foreground',
            PRESS,
            FOCUS_RING,
          )}
        >
          <Icon aria-hidden="true" className="size-[18px]" />
          {label}
        </button>
      ))}
    </div>
  )
}
