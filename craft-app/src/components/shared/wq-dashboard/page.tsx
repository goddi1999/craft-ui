import { WqDashboard } from '@/components/ui/wq-dashboard'

import { DemoPage } from '../demo-page'

export function WqDashboardPage() {
  return (
    <DemoPage
      eyebrow="ui / wq-dashboard"
      title="Role Dashboards"
      description="Admin, teacher, and student dashboards for a nursing school LMS, switched by a segmented tab list with per-role sidebar navigation."
    >
      <div className="w-full max-w-5xl px-4 pb-24">
        <WqDashboard />
      </div>
    </DemoPage>
  )
}
