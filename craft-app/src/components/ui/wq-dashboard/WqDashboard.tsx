import { Content, List, Root, Trigger } from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

import { AdminView } from './AdminView'
import { StudentView } from './StudentView'
import { TeacherView } from './TeacherView'
import { WQ_DASHBOARD_SAMPLE } from './wq-dashboard.data'
import { FOCUS_RING, PRESS } from './wq-dashboard.tones'
import type { WqDashboardData, WqRole } from './wq-dashboard.types'

export type WqDashboardProps = {
  /** Content for all three role dashboards. @default WQ_DASHBOARD_SAMPLE */
  data?: WqDashboardData
  /** Controlled role. */
  role?: WqRole
  /** Initial role when uncontrolled. @default 'admin' */
  defaultRole?: WqRole
  onRoleChange?: (role: WqRole) => void
  className?: string
}

const ROLES: { value: WqRole; label: string }[] = [
  { value: 'admin', label: 'Institution Admin' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'student', label: 'Student' },
]

/**
 * Three role-specific dashboard mockups behind a segmented tab list. Each
 * panel stays mounted, so a role keeps its open page when you switch away.
 */
export function WqDashboard({
  data = WQ_DASHBOARD_SAMPLE,
  role,
  defaultRole = 'admin',
  onRoleChange,
  className,
}: WqDashboardProps) {
  return (
    <Root
      data-slot="wq-dashboard"
      value={role}
      defaultValue={defaultRole}
      onValueChange={(next) => onRoleChange?.(next as WqRole)}
      className={cn('@container w-full text-foreground', className)}
    >
      <List
        aria-label="Dashboard role"
        className="mb-5 flex gap-0.5 rounded-xl bg-muted p-[3px]"
      >
        {ROLES.map((item) => (
          <Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'flex-1 rounded-[9px] px-1 py-2 text-xs font-medium tracking-[0.01em] text-muted-foreground',
              'hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgb(0_0_0/0.06)]',
              PRESS,
              FOCUS_RING,
            )}
          >
            {item.label}
          </Trigger>
        ))}
      </List>

      <Content
        forceMount
        value="admin"
        className="outline-none data-[state=inactive]:hidden"
      >
        <AdminView data={data.admin} />
      </Content>
      <Content
        forceMount
        value="teacher"
        className="outline-none data-[state=inactive]:hidden"
      >
        <TeacherView data={data.teacher} />
      </Content>
      <Content
        forceMount
        value="student"
        className="outline-none data-[state=inactive]:hidden"
      >
        <StudentView data={data.student} />
      </Content>
    </Root>
  )
}
