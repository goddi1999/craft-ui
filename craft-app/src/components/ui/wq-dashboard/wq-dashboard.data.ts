import {
  BookOpen,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Gamepad2,
  Share2,
  TriangleAlert,
  Trophy,
} from 'lucide-react'

import type {
  AdminData,
  StudentData,
  TeacherData,
  WqDashboardData,
} from './wq-dashboard.types'

const ACTIVE = { label: 'Active', tone: 'success' } as const

export const WQ_ADMIN_SAMPLE: AdminData = {
  profile: { name: 'Pflegeschule Nord', role: 'Institution Admin' },
  nav: [
    { items: [{ id: 'overview', label: 'Overview' }] },
    {
      title: 'Organisation',
      items: [
        { id: 'org', label: 'Faculties & Cohorts' },
        { id: 'classrooms', label: 'Classrooms' },
      ],
    },
    {
      title: 'People',
      items: [
        { id: 'teachers', label: 'Teachers' },
        { id: 'students', label: 'Students' },
        { id: 'invites', label: 'Invitations', badge: 3 },
      ],
    },
    {
      title: 'Billing',
      items: [
        { id: 'license', label: 'License & Usage' },
        { id: 'entitlements', label: 'Entitlements' },
      ],
    },
    {
      title: 'Compliance',
      items: [
        { id: 'settings', label: 'Settings' },
        { id: 'audit', label: 'Audit Log' },
      ],
    },
  ],
  overview: {
    title: 'Overview',
    subtitle: 'Pflegeschule Nord · Academic year 2025/26',
    callout: {
      tone: 'warning',
      icon: TriangleAlert,
      message: '3 pending invitations have not been accepted.',
      action: { label: 'Review invites', target: 'invites' },
    },
    metrics: [
      { label: 'Active teachers', value: '18', note: 'of 25 seats' },
      {
        label: 'Active students',
        value: '312',
        note: '↑ 24 this month',
        noteTone: 'success',
      },
      { label: 'Classrooms', value: '14', note: '12 active' },
      {
        label: 'Storage used',
        value: '43 GB',
        note: '86 % of 50 GB',
        noteTone: 'warning',
        progress: { percent: 86, tone: 'warning' },
      },
    ],
    seats: [
      { label: 'Teachers', percent: 72, display: '18 / 25', tone: 'success' },
      { label: 'Students', percent: 78, display: '312 / 400', tone: 'success' },
      { label: 'Storage', percent: 86, display: '43 / 50 GB', tone: 'warning' },
    ],
    activity: [
      { text: 'M. Baumann joined as teacher', time: '2 hours ago', tone: 'success' },
      { text: 'Classroom "PG 3A" created', time: 'Yesterday', tone: 'info' },
      { text: 'Storage quota at 86 %', time: 'Auto-alert', tone: 'warning' },
      { text: '3 invitations pending acceptance', time: '3 days ago', tone: 'neutral' },
    ],
  },
  classrooms: {
    title: 'Classrooms',
    subtitle: 'All classrooms in this institution',
    count: '14 classrooms',
    rows: [
      { name: 'PG 3A', lead: 'K. Hoffmann', students: 24, programme: 'Generalistische Pflege', status: ACTIVE, action: 'Edit' },
      { name: 'PG 3B', lead: 'A. Müller', students: 22, programme: 'Generalistische Pflege', status: ACTIVE, action: 'Edit' },
      { name: 'WM 2A', lead: 'T. Braun', students: 18, programme: 'Wundmanagement', status: ACTIVE, action: 'Edit' },
      { name: 'WM 1A', lead: '—', students: 0, programme: 'Wundmanagement', status: { label: 'No teacher', tone: 'warning' }, action: 'Assign' },
      { name: 'Alt 2023', lead: 'S. Klein', students: 20, programme: 'Altenpflege', status: { label: 'Inactive', tone: 'neutral' }, action: 'Reactivate' },
    ],
  },
  teachers: {
    title: 'Teachers',
    subtitle: 'Directory · 18 active staff members',
    rows: [
      { name: 'Katharina Hoffmann', email: 'k.hoffmann@pflegeschule.de', faculty: 'Pflege', classrooms: 2, status: ACTIVE },
      { name: 'Andreas Müller', email: 'a.mueller@pflegeschule.de', faculty: 'Pflege', classrooms: 1, status: ACTIVE },
      { name: 'Tobias Braun', email: 't.braun@pflegeschule.de', faculty: 'Wundmanagement', classrooms: 1, status: ACTIVE },
      { name: 'Maria Becker', email: 'm.becker@pflegeschule.de', faculty: 'Pflege', classrooms: 0, status: { label: 'No classroom', tone: 'warning' } },
    ],
  },
  invites: {
    title: 'Invitations',
    subtitle: '3 pending · sent via email',
    rows: [
      { email: 'n.wagner@extern.de', role: 'Teacher', invitedBy: 'K. Hoffmann', sent: '3 days ago', status: { label: 'Pending', tone: 'warning' }, action: 'Resend' },
      { email: 'l.schmidt@gmail.com', role: 'Student', invitedBy: 'Admin', sent: '5 days ago', status: { label: 'Pending', tone: 'warning' }, action: 'Resend' },
      { email: 'p.meyer@extern.de', role: 'Student', invitedBy: 'Admin', sent: '7 days ago', status: { label: 'Expired', tone: 'danger' }, action: 'Reinvite' },
    ],
  },
  license: {
    title: 'License & Usage',
    subtitle: 'EDU Plus · renews 1 Sep 2026',
    metrics: [
      { label: 'Plan', value: 'EDU Plus', note: 'Per-tenant instance', compact: true },
      { label: 'Next invoice', value: '€ 890', note: '1 Sep 2026', compact: true },
      { label: 'Billing status', value: 'Paid', valueTone: 'success', note: 'Last: 1 Mar 2026', compact: true },
    ],
    quotas: [
      { label: 'Teacher seats', percent: 72, display: '18 / 25', tone: 'success' },
      { label: 'Student seats', percent: 78, display: '312 / 400', tone: 'success' },
      { label: 'Storage', percent: 86, display: '43 / 50 GB', tone: 'warning' },
      { label: 'Classrooms', percent: 35, display: '14 / 40', tone: 'success' },
    ],
  },
  stubs: {
    org: {
      title: 'Faculties & Cohorts',
      subtitle: 'Organisation structure',
      body: 'Faculties → Programmes → Cohorts → Class groups → Offerings. Tree view with inline create/edit coming here.',
    },
    students: {
      title: 'Students',
      subtitle: 'Directory · 312 enrolled',
      body: 'Searchable student directory with classroom assignment, invite flow, and remove-from-institution action.',
    },
    settings: {
      title: 'Settings & Compliance',
      subtitle: 'Institution configuration · GDPR',
      body: 'Locale, timezone, data retention, notification defaults, GDPR data subject requests.',
    },
    audit: {
      title: 'Audit Log',
      subtitle: 'Scoped to this institution · GDPR Art. 32',
      body: 'Time-filtered event log: user added, removed, role changed, data export, login events.',
    },
    entitlements: {
      title: 'Entitlements',
      subtitle: 'Read-only · set by platform',
      body: 'Plan feature flags and per-institution overrides visible here. Cannot be edited at institution level.',
    },
  },
}

const PG3A_STATS = [
  { value: '3', label: 'course deliveries' },
  { value: '2', label: 'game deliveries' },
  { value: '4', label: 'task deliveries' },
  { value: '86%', label: 'avg lesson progress' },
]
const WM2A_STATS = [
  { value: '2', label: 'course deliveries' },
  { value: '1', label: 'game delivery' },
  { value: '3', label: 'task deliveries' },
  { value: '71%', label: 'avg lesson progress' },
]
const CLASSROOM_ACTIONS = ['Roster', 'Attendance', 'Deliveries', 'Rewards']

export const WQ_TEACHER_SAMPLE: TeacherData = {
  profile: { name: 'Katharina Hoffmann', role: 'Teacher' },
  nav: [
    { items: [{ id: 'overview', label: 'Overview' }] },
    {
      title: 'Teaching',
      items: [
        { id: 'classrooms', label: 'My Classrooms' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'rewards', label: 'Rewards' },
      ],
    },
    {
      title: 'Studio',
      items: [
        { id: 'courses', label: 'Course Studio' },
        { id: 'games', label: 'Game Studio' },
        { id: 'tasks', label: 'Task Studio' },
      ],
    },
    {
      title: 'Insights',
      items: [
        { id: 'analytics', label: 'Analytics' },
        { id: 'notif', label: 'Notifications', badge: 5 },
      ],
    },
  ],
  overview: {
    title: 'Good morning, Katharina',
    subtitle: 'Tuesday, 18 March 2026 · 2 classrooms active today',
    metrics: [
      { label: 'My classrooms', value: '2', note: 'PG 3A · WM 2A' },
      { label: 'Open submissions', value: '7', note: '3 overdue', noteTone: 'warning' },
      { label: 'Joker requests', value: '2', note: 'awaiting approval' },
    ],
    classrooms: [
      {
        name: 'PG 3A — Generalistische Pflege',
        meta: '24 students · Lead teacher',
        stats: [
          { value: '1', label: 'session today' },
          { value: '3', label: 'open tasks' },
          { value: '86%', label: 'avg progress' },
        ],
      },
      {
        name: 'WM 2A — Wundmanagement',
        meta: '18 students · Lead teacher',
        stats: [
          { value: '0', label: 'sessions today' },
          { value: '4', label: 'open tasks' },
          { value: '71%', label: 'avg progress' },
        ],
      },
    ],
    quickActions: [
      { label: 'New task', icon: ClipboardList },
      { label: 'Start game', icon: Gamepad2 },
      { label: 'Take attendance', icon: ClipboardCheck },
      { label: 'View progress', icon: ChartColumn },
      { label: 'Award points', icon: Trophy },
      { label: 'Share course', icon: Share2 },
    ],
    submissions: [
      { student: 'L. Fischer', task: 'Wundassessment ABCDE', classroom: 'WM 2A', submitted: 'Yesterday', status: { label: 'Awaiting review', tone: 'warning' } },
      { student: 'T. Schulz', task: 'Verbandswechsel Protokoll', classroom: 'WM 2A', submitted: '2 days ago', status: { label: 'Overdue review', tone: 'danger' } },
      { student: 'M. Koch', task: 'Fallstudie Dekubitus', classroom: 'PG 3A', submitted: 'Today', status: { label: 'New', tone: 'info' } },
    ],
  },
  classrooms: {
    title: 'My Classrooms',
    subtitle: 'Primary and co-teacher roles',
    items: [
      {
        name: 'PG 3A — Generalistische Pflege',
        meta: '24 students · Lead teacher · Active',
        status: ACTIVE,
        stats: PG3A_STATS,
        actions: CLASSROOM_ACTIONS,
      },
      {
        name: 'WM 2A — Wundmanagement',
        meta: '18 students · Lead teacher · Active',
        status: ACTIVE,
        stats: WM2A_STATS,
        actions: CLASSROOM_ACTIONS,
      },
    ],
  },
  games: {
    title: 'Game Studio',
    subtitle: 'My games · draft and published',
    rows: [
      { game: 'Wundklassifikation Quiz', type: 'Image Pin', version: 'v3', deliveries: '2 classrooms', status: { label: 'Published', tone: 'success' } },
      { game: 'PPE Sequence Drag', type: 'Sort/Drag', version: 'v1', deliveries: '1 classroom', status: { label: 'Published', tone: 'success' } },
      { game: 'Wundassessment ABCDE', type: 'Open Question', version: 'v2 draft', deliveries: '0', status: { label: 'Draft', tone: 'warning' } },
    ],
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Lesson progress · learning events · game performance',
    metrics: [
      { label: 'Avg lesson completion', value: '79%', note: '↑ 4% vs last week', noteTone: 'success' },
      { label: 'Game sessions this week', value: '47', note: 'across 2 classrooms' },
      { label: 'Avg game score', value: '68%', note: '↓ 2% vs last week', noteTone: 'warning' },
    ],
    progressTitle: 'Lesson progress by student (PG 3A)',
    progress: [
      { label: 'L. Fischer', percent: 92, display: '92%', tone: 'success' },
      { label: 'T. Schulz', percent: 84, display: '84%', tone: 'success' },
      { label: 'M. Koch', percent: 61, display: '61%', tone: 'warning' },
      { label: 'S. Weber', percent: 48, display: '48%', tone: 'warning' },
    ],
  },
  stubs: {
    attendance: {
      title: 'Attendance',
      subtitle: 'Sessions · schedules · exceptions',
      body: 'Session list per classroom. Manual open/close. Mark present/absent per student. Recurring schedule builder with exception dates.',
    },
    rewards: {
      title: 'Rewards',
      subtitle: 'Points · Jokers · classroom leaderboard',
      body: 'Joker types: Hausaufgaben-Joker, Fehler-Joker, Open-Notes-Joker, Platzwahl, Gruppenbelohnung. Approve/deny pending requests. Manual point awards via point_ledger.',
    },
    courses: {
      title: 'Course Studio',
      subtitle: 'My courses · topics · lessons · versions',
      body: 'Course list → Topics → Lessons (Yoopta editor). Publish snapshot to course_versions. Topic availability rules: lock, manual unlock, scheduled unlock.',
    },
    tasks: {
      title: 'Task Studio',
      subtitle: 'Templates · deliveries · groups · submissions',
      body: 'Task template builder. Published versions. Delivery per classroom. Group assignment. Review and return submissions with inline feedback.',
    },
    notif: {
      title: 'Notifications',
      subtitle: 'Delivery-scoped inbox',
      body: "In-app notification list filtered to this teacher's deliveries. 5 unread: 2 joker requests, 3 new task submissions.",
    },
  },
}

export const WQ_STUDENT_SAMPLE: StudentData = {
  profile: { name: 'Lena Fischer', role: 'Student · PG 3A' },
  nav: [
    { items: [{ id: 'overview', label: 'Overview' }] },
    {
      title: 'Learning',
      items: [
        { id: 'classrooms', label: 'My Classrooms' },
        { id: 'tasks', label: 'My Tasks', badge: 2 },
        { id: 'play', label: 'Play Games' },
      ],
    },
    {
      title: 'Personal',
      items: [
        { id: 'rewards', label: 'My Rewards' },
        { id: 'notes', label: 'My Notes' },
        { id: 'messages', label: 'Messages' },
        { id: 'notif', label: 'Notifications', badge: 3 },
      ],
    },
  ],
  overview: {
    title: 'Good morning, Lena',
    subtitle: "Tuesday, 18 March · Here's what's on today",
    callout: {
      tone: 'info',
      icon: ClipboardList,
      message: 'Task “Fallstudie Dekubitus” is due tomorrow.',
      action: { label: 'Open task', target: 'tasks' },
    },
    metrics: [
      {
        label: 'Overall progress',
        value: '92%',
        note: '↑ 3% this week',
        noteTone: 'success',
        progress: { percent: 92, tone: 'success' },
      },
      { label: 'My points', value: '1 240', note: 'Level 4 · Wundexperte' },
      { label: 'Learning streak', value: '12 days', note: 'in a row' },
    ],
    quests: [
      {
        title: 'Wundmanagement Grundlagen',
        subtitle: 'PG 3A · Lesson 4 of 6 · Wundklassifikation',
        icon: BookOpen,
        tone: 'info',
        progress: 67,
        status: { label: '67% done', tone: 'info' },
      },
      {
        title: 'Wundklassifikation Quiz',
        subtitle: 'PG 3A · Image Pin game · Not started',
        icon: Gamepad2,
        tone: 'success',
        status: { label: 'New', tone: 'neutral' },
      },
      {
        title: 'Fallstudie Dekubitus',
        subtitle: 'PG 3A · Task · Due tomorrow',
        icon: ClipboardList,
        tone: 'warning',
        status: { label: 'Due soon', tone: 'danger' },
      },
    ],
  },
  classrooms: {
    title: 'My Classrooms',
    subtitle: 'Active enrolments',
    items: [
      {
        name: 'PG 3A — Generalistische Pflege',
        meta: 'K. Hoffmann · 24 students',
        stats: [
          { value: '3', label: 'courses' },
          { value: '2', label: 'games available' },
          { value: '4', label: 'tasks' },
          { value: '92%', label: 'my progress' },
        ],
        actions: ['Courses & Lessons', 'Games', 'Tasks', 'Rewards'],
      },
    ],
  },
  tasks: {
    title: 'My Tasks',
    subtitle: 'All assignments across active classrooms',
    rows: [
      { task: 'Fallstudie Dekubitus', classroom: 'PG 3A', due: 'Tomorrow', status: { label: 'In progress', tone: 'warning' } },
      { task: 'Wundassessment ABCDE', classroom: 'WM 2A', due: '25 Mar', status: { label: 'Not started', tone: 'neutral' } },
      { task: 'Verbandswechsel Protokoll', classroom: 'PG 3A', due: '—', status: { label: 'Returned · B+', tone: 'success' } },
      { task: 'Gruppenarbeit Hydrokolloide', classroom: 'WM 2A', due: '—', status: { label: 'Submitted', tone: 'success' } },
    ],
  },
  play: {
    title: 'Play Games',
    subtitle: 'Solo · Versus · Class sessions',
    stats: [
      { label: 'Games played', value: '14' },
      { label: 'Avg score', value: '74%' },
      { label: 'Best score', value: '96%' },
    ],
    games: [
      { title: 'Wundklassifikation Quiz', icon: Gamepad2, tone: 'info', action: 'Play' },
      { title: 'PPE Sequence — Versus', icon: Trophy, tone: 'success', action: 'Join' },
    ],
  },
  rewards: {
    title: 'My Rewards',
    subtitle: 'PG 3A · Points · Level · Jokers',
    metrics: [
      { label: 'Total points', value: '1 240', note: '+80 this week', noteTone: 'success' },
      {
        label: 'Level',
        value: '4',
        note: 'Wundexperte · 260 to lvl 5',
        progress: { percent: 62, tone: 'success' },
      },
      { label: 'Rank', value: '#3', note: 'Class leaderboard' },
    ],
    jokers: [
      { name: 'Hausaufgaben-Joker', available: 1 },
      { name: 'Fehler-Joker', available: 0 },
      { name: 'Open-Notes-Joker', available: 2 },
    ],
  },
  stubs: {
    notes: {
      title: 'My Notes',
      subtitle: 'Personal notes · pinned · linked to lessons',
      body: 'Personal note cards, pinnable, linkable to specific lessons. Soft-delete only. Never shared with teacher.',
    },
    messages: {
      title: 'Messages',
      subtitle: 'Teacher-initiated threads only',
      body: 'Conversation list. Read cursor per thread. Teacher initiates 1:1 — student can reply. Safeguarding: student cannot initiate new threads with teacher.',
    },
    notif: {
      title: 'Notifications',
      subtitle: 'Your inbox · 3 unread',
      body: 'Task returned with feedback, game delivery published, joker approved. Preference controls: email / in-app toggles.',
    },
  },
}

export const WQ_DASHBOARD_SAMPLE: WqDashboardData = {
  admin: WQ_ADMIN_SAMPLE,
  teacher: WQ_TEACHER_SAMPLE,
  student: WQ_STUDENT_SAMPLE,
}
