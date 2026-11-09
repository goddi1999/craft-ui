import { TaskSubmissionScatter } from '@/components/ui/task-submission-scatter'

import { DemoPage } from '../demo-page'

export function TaskSubmissionScatterPage() {
  return (
    <DemoPage
      eyebrow="ui / task-submission-scatter"
      title="Task Submission Scatter"
      description="When each group handed in, plotted against a dashed due-date line and colour-coded early, on time, late, or missing."
    >
      <div className="w-full max-w-3xl px-4 pb-24">
        <TaskSubmissionScatter />
      </div>
    </DemoPage>
  )
}
