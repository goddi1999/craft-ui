import type { LucideIcon } from 'lucide-react'

export type WqRole = 'admin' | 'teacher' | 'student'

/** Semantic colour channel shared by pills, deltas, bars, and callouts. */
export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export type PageHeading = { title: string; subtitle: string }

export type Profile = { name: string; role: string }

export type NavItem<Id extends string> = { id: Id; label: string; badge?: number }
export type NavSection<Id extends string> = {
  /** Small caps heading above the items. Omit for the top group. */
  title?: string
  items: NavItem<Id>[]
}

export type Metric = {
  label: string
  value: string
  /** Line under the value, e.g. `↑ 24 this month`. */
  note?: string
  /** Colour of the note. @default 'neutral' */
  noteTone?: Tone
  valueTone?: Tone
  /** Renders the value at body size, for words rather than numbers. */
  compact?: boolean
  progress?: { percent: number; tone: Tone }
}

/** A labelled meter, e.g. `Teachers 18 / 25`. */
export type Usage = { label: string; percent: number; display: string; tone: Tone }

export type Status = { label: string; tone: Tone }

export type Activity = { text: string; time: string; tone: Tone }

/** Inline figure such as **3** open tasks. */
export type InlineStat = { value: string; label: string }

export type Classroom = {
  name: string
  meta: string
  stats: InlineStat[]
  status?: Status
  actions?: string[]
}

export type Callout<Id extends string> = {
  tone: Tone
  icon: LucideIcon
  message: string
  action?: { label: string; target: Id }
}

export type QuickAction = { label: string; icon: LucideIcon }

export type Quest = {
  title: string
  subtitle: string
  icon: LucideIcon
  tone: Tone
  /** Percent complete; omit to hide the bar. */
  progress?: number
  status: Status
}

export type StubPage = PageHeading & { body: string }

/* ─── Admin ─── */

export type AdminPageId =
  | 'overview'
  | 'org'
  | 'classrooms'
  | 'teachers'
  | 'students'
  | 'invites'
  | 'license'
  | 'entitlements'
  | 'settings'
  | 'audit'

export type AdminClassroomRow = {
  name: string
  lead: string
  students: number
  programme: string
  status: Status
  action: string
}
export type AdminTeacherRow = {
  name: string
  email: string
  faculty: string
  classrooms: number
  status: Status
}
export type AdminInviteRow = {
  email: string
  role: string
  invitedBy: string
  sent: string
  status: Status
  action: string
}

export type AdminData = {
  profile: Profile
  nav: NavSection<AdminPageId>[]
  overview: PageHeading & {
    callout: Callout<AdminPageId>
    metrics: Metric[]
    seats: Usage[]
    activity: Activity[]
  }
  classrooms: PageHeading & { count: string; rows: AdminClassroomRow[] }
  teachers: PageHeading & { rows: AdminTeacherRow[] }
  invites: PageHeading & { rows: AdminInviteRow[] }
  license: PageHeading & { metrics: Metric[]; quotas: Usage[] }
  stubs: Record<'org' | 'students' | 'settings' | 'audit' | 'entitlements', StubPage>
}

/* ─── Teacher ─── */

export type TeacherPageId =
  | 'overview'
  | 'classrooms'
  | 'attendance'
  | 'rewards'
  | 'courses'
  | 'games'
  | 'tasks'
  | 'analytics'
  | 'notif'

export type TeacherSubmissionRow = {
  student: string
  task: string
  classroom: string
  submitted: string
  status: Status
}
export type TeacherGameRow = {
  game: string
  type: string
  version: string
  deliveries: string
  status: Status
}

export type TeacherData = {
  profile: Profile
  nav: NavSection<TeacherPageId>[]
  overview: PageHeading & {
    metrics: Metric[]
    classrooms: Classroom[]
    quickActions: QuickAction[]
    submissions: TeacherSubmissionRow[]
  }
  classrooms: PageHeading & { items: Classroom[] }
  games: PageHeading & { rows: TeacherGameRow[] }
  analytics: PageHeading & {
    metrics: Metric[]
    progressTitle: string
    progress: Usage[]
  }
  stubs: Record<'attendance' | 'rewards' | 'courses' | 'tasks' | 'notif', StubPage>
}

/* ─── Student ─── */

export type StudentPageId =
  | 'overview'
  | 'classrooms'
  | 'tasks'
  | 'play'
  | 'rewards'
  | 'notes'
  | 'messages'
  | 'notif'

export type StudentTaskRow = {
  task: string
  classroom: string
  due: string
  status: Status
}
export type StudentGame = {
  title: string
  icon: LucideIcon
  tone: Tone
  action: string
}
export type Joker = { name: string; available: number }

export type StudentData = {
  profile: Profile
  nav: NavSection<StudentPageId>[]
  overview: PageHeading & {
    callout: Callout<StudentPageId>
    metrics: Metric[]
    quests: Quest[]
  }
  classrooms: PageHeading & { items: Classroom[] }
  tasks: PageHeading & { rows: StudentTaskRow[] }
  play: PageHeading & {
    stats: { label: string; value: string }[]
    games: StudentGame[]
  }
  rewards: PageHeading & { metrics: Metric[]; jokers: Joker[] }
  stubs: Record<'notes' | 'messages' | 'notif', StubPage>
}

export type WqDashboardData = {
  admin: AdminData
  teacher: TeacherData
  student: StudentData
}
