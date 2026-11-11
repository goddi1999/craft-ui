import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { TaskEditingHeatmap } from '@/components/ui/task-editing-heatmap'

const DEFAULTS = {
  title: 'Editing activity — Aufgabe: Wundheilung Phasen',
  subtitle: 'Mon 17 Mar – Sun 23 Mar',
  hourLabelEvery: 3,
  showInsight: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'data',
    type: 'EditingHeatmapDay[]',
    default: 'TASK_EDITING_SAMPLE',
    description: 'One entry per weekday column, with edit counts keyed by hour.',
  },
  {
    name: 'title',
    type: 'string',
    default: "'Editing activity — Aufgabe: Wundheilung Phasen'",
    description: 'Chart title.',
  },
  {
    name: 'subtitle',
    type: 'string',
    default: "'Mon 17 Mar – Sun 23 Mar'",
    description: 'Date range shown beside the title.',
  },
  {
    name: 'insight',
    type: 'ReactNode',
    description: 'Callout above the grid. Omit to derive the peak; null hides it.',
  },
  {
    name: 'hourLabelEvery',
    type: 'number',
    default: '3',
    description: 'Label every nth hour row.',
  },
  {
    name: 'unit',
    type: 'string',
    default: "'edits'",
    description: 'Unit used in the hover readout and the accessible summary.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the figure.',
  },
]

export function TaskEditingHeatmapPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, subtitle, hourLabelEvery, showInsight } = settings.values

  const usage = toUsageSnippet({
    component: 'TaskEditingHeatmap',
    from: '@/components/ui/task-editing-heatmap',
    props: {
      title,
      subtitle,
      hourLabelEvery,
      insight: showInsight ? undefined : 'NULL',
    },
    defaults: DEFAULTS,
  }).replace('insight="NULL"', 'insight={null}')

  return (
    <DemoPage
      eyebrow="ui / task-editing-heatmap"
      title="Task Editing Heatmap"
      description="A day-by-hour grid of edits on one assignment, so late-evening and weekend cramming stands out at a glance."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(value) => settings.set('title', value)}
            maxLength={60}
          />
          <DemoTextField
            label="Subtitle"
            value={subtitle}
            onValueChange={(value) => settings.set('subtitle', value)}
            maxLength={40}
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
        paths: ['src/components/ui/task-editing-heatmap/'],
        usage,
        props: PROPS,
      }}
    >
      <TaskEditingHeatmap
        title={title}
        subtitle={subtitle}
        hourLabelEvery={hourLabelEvery}
        insight={showInsight ? undefined : null}
        className="mx-auto max-w-3xl"
      />
    </DemoPage>
  )
}
