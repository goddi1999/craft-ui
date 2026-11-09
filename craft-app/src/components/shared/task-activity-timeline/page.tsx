import { TaskActivityTimeline } from '@/components/ui/task-activity-timeline'

import { DemoPage } from '../demo-page'

export function TaskActivityTimelinePage() {
  return (
    <DemoPage
      eyebrow="ui / task-activity-timeline"
      title="Task Activity Timeline"
      description="Group work on one task, as a day-by-hour heatmap or as per-group 24-hour tracks, switched by a tab list."
    >
      <div className="w-full max-w-3xl px-4 pb-24">
        <TaskActivityTimeline
          insight={
            <>
              Peak activity{' '}
              <strong className="font-medium text-foreground">
                Sunday 19:00–22:00
              </strong>{' '}
              · Fridays and Sundays carry the week · Group 8 never edited
            </>
          }
        />
      </div>
    </DemoPage>
  )
}
