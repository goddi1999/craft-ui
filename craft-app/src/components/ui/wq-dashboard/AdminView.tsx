import { useState } from 'react'

import {
  ActivityList,
  Callout,
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
import type {
  AdminClassroomRow,
  AdminData,
  AdminInviteRow,
  AdminPageId,
  AdminTeacherRow,
} from './wq-dashboard.types'

const CLASSROOM_COLUMNS: Column<AdminClassroomRow>[] = [
  { header: 'Name', cell: (row) => row.name },
  { header: 'Lead teacher', cell: (row) => row.lead },
  { header: 'Students', cell: (row) => row.students },
  { header: 'Programme', cell: (row) => row.programme },
  { header: 'Status', cell: (row) => <Pill status={row.status} /> },
  {
    header: 'Actions',
    srOnlyHeader: true,
    cell: (row) => <LinkButton>{row.action}</LinkButton>,
  },
]

const TEACHER_COLUMNS: Column<AdminTeacherRow>[] = [
  { header: 'Name', cell: (row) => row.name },
  { header: 'Email', cell: (row) => row.email },
  { header: 'Faculty', cell: (row) => row.faculty },
  { header: 'Classrooms', cell: (row) => row.classrooms },
  { header: 'Status', cell: (row) => <Pill status={row.status} /> },
]

const INVITE_COLUMNS: Column<AdminInviteRow>[] = [
  { header: 'Email', cell: (row) => row.email },
  { header: 'Role', cell: (row) => row.role },
  { header: 'Invited by', cell: (row) => row.invitedBy },
  { header: 'Sent', cell: (row) => row.sent },
  { header: 'Status', cell: (row) => <Pill status={row.status} /> },
  {
    header: 'Actions',
    srOnlyHeader: true,
    cell: (row) => <LinkButton>{row.action}</LinkButton>,
  },
]

export function AdminView({ data }: { data: AdminData }) {
  const [page, setPage] = useState<AdminPageId>('overview')

  return (
    <DashboardShell<AdminPageId>
      profile={data.profile}
      nav={data.nav}
      activePage={page}
      onNavigate={setPage}
    >
      <AdminPage data={data} page={page} onNavigate={setPage} />
    </DashboardShell>
  )
}

type AdminPageProps = {
  data: AdminData
  page: AdminPageId
  onNavigate: (page: AdminPageId) => void
}

function AdminPage({ data, page, onNavigate }: AdminPageProps) {
  switch (page) {
    case 'overview': {
      const { overview } = data
      return (
        <>
          <PageHeader title={overview.title} subtitle={overview.subtitle} />
          <Callout callout={overview.callout} onNavigate={onNavigate} />
          <MetricGrid metrics={overview.metrics} columns={4} />
          <div className="grid gap-2.5 @xl/main:grid-cols-2">
            <Panel title="Seat utilisation">
              <UsageList items={overview.seats} labelWidth="w-20" />
            </Panel>
            <Panel title="Recent activity">
              <ActivityList items={overview.activity} />
            </Panel>
          </div>
        </>
      )
    }
    case 'classrooms': {
      const { classrooms } = data
      return (
        <>
          <PageHeader title={classrooms.title} subtitle={classrooms.subtitle} />
          <SectionHeader
            title={classrooms.count}
            action={<LinkButton>+ Create classroom</LinkButton>}
          />
          <DataTable
            caption={classrooms.title}
            columns={CLASSROOM_COLUMNS}
            rows={classrooms.rows}
            getKey={(row) => row.name}
          />
        </>
      )
    }
    case 'teachers': {
      const { teachers } = data
      return (
        <>
          <PageHeader title={teachers.title} subtitle={teachers.subtitle} />
          <SectionHeader action={<LinkButton>+ Invite teacher</LinkButton>} />
          <DataTable
            caption={teachers.title}
            columns={TEACHER_COLUMNS}
            rows={teachers.rows}
            getKey={(row) => row.email}
          />
        </>
      )
    }
    case 'invites': {
      const { invites } = data
      return (
        <>
          <PageHeader title={invites.title} subtitle={invites.subtitle} />
          <DataTable
            caption={invites.title}
            columns={INVITE_COLUMNS}
            rows={invites.rows}
            getKey={(row) => row.email}
          />
        </>
      )
    }
    case 'license': {
      const { license } = data
      return (
        <>
          <PageHeader title={license.title} subtitle={license.subtitle} />
          <MetricGrid metrics={license.metrics} columns={3} />
          <SectionHeader title="Quota usage" />
          <UsageList items={license.quotas} labelWidth="w-28" />
        </>
      )
    }
    default:
      return <StubView stub={data.stubs[page]} />
  }
}
