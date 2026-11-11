import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  TaskActivityTimeline,
  type TaskActivityView,
} from '@/components/ui/task-activity-timeline'

const VIEWS: TaskActivityView[] = ['heatmap', 'groups']

const DEFAULTS = {
  view: 'heatmap' as TaskActivityView,
  hourLabelEvery: 4,
  showInsight: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  defaultView: 'heatmap',
  hourLabelEvery: 4,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'days',
    type: 'ActivityDay[]',
    default: 'TASK_ACTIVITY_DAYS',
    description: 'Days in display order, each with the hours every group was editing.',
  },
  {
    name: 'groups',
    type: 'ActivityGroup[]',
    default: 'TASK_ACTIVITY_GROUPS',
    description: 'Groups in row and legend order — key, label and colour.',
  },
  {
    name: 'insight',
    type: 'ReactNode',
    description: 'Callout above the chart. Omit to derive the peak and idle groups; null hides it.',
  },
  {
    name: 'view',
    type: "'heatmap' | 'groups'",
    description: 'Controlled view; pair with onViewChange.',
  },
  {
    name: 'defaultView',
    type: "'heatmap' | 'groups'",
    default: "'heatmap'",
    description: 'Initial view when uncontrolled.',
  },
  {
    name: 'onViewChange',
    type: '(view: TaskActivityView) => void',
    description: 'Called when the tab list switches view.',
  },
  {
    name: 'hourLabelEvery',
    type: 'number',
    default: '4',
    description: 'Label every nth hour row in the heatmap.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function TaskActivityTimelinePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { view, hourLabelEvery, showInsight } = settings.values

  const usage = toUsageSnippet({
    component: 'TaskActivityTimeline',
    from: '@/components/ui/task-activity-timeline',
    props: {
      defaultView: view,
      hourLabelEvery,
      insight: showInsight ? undefined : 'NULL',
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace('insight="NULL"', 'insight={null}')

  return (
    <DemoPage
      eyebrow="ui / task-activity-timeline"
      title="Task Activity Timeline"
      description="Group work on one task, as a day-by-hour heatmap or as per-group 24-hour tracks, switched by a tab list."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="View"
            options={VIEWS}
            value={view}
            onChange={(value) => settings.set('view', value)}
          />
          <DemoSlider
            label="Label every nth hour"
            value={hourLabelEvery}
            onValueChange={(value) => settings.set('hourLabelEvery', value)}
            min={1}
            max={12}
          />
          <DemoSwitch
            label="Insight callout"
            checked={showInsight}
            onCheckedChange={(value) => settings.set('showInsight', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/task-activity-timeline/'],
        usage,
        props: PROPS,
      }}
    >
      <TaskActivityTimeline
        view={view}
        onViewChange={(value) => settings.set('view', value)}
        hourLabelEvery={hourLabelEvery}
        insight={showInsight ? undefined : null}
        className="mx-auto max-w-3xl"
      />
    </DemoPage>
  )
}
