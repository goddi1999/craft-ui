import { TaskEditingHeatmap } from '@/components/ui/task-editing-heatmap'

import { DemoPage } from '../demo-page'

export function TaskEditingHeatmapPage() {
  return (
    <DemoPage
      eyebrow="ui / task-editing-heatmap"
      title="Task Editing Heatmap"
      description="A day-by-hour grid of edits on one assignment, so late-evening and weekend cramming stands out at a glance."
    >
      <div className="w-full max-w-3xl px-4 pb-24">
        <TaskEditingHeatmap
          insight={
            <>
              Most editing on{' '}
              <strong className="font-medium text-foreground">
                Sunday 19:00–22:00
              </strong>{' '}
              · Almost no activity during school hours (08:00–14:00)
            </>
          }
        />
      </div>
    </DemoPage>
  )
}
