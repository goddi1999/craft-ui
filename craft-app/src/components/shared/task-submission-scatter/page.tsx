import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { TaskSubmissionScatter } from '@/components/ui/task-submission-scatter'

const LOCALES = ['de-DE', 'en-US', 'en-GB', 'fr-FR'] as const
type Locale = (typeof LOCALES)[number]

const DEFAULTS = {
  earlyWindowHours: 24,
  locale: 'de-DE' as Locale,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'submissions',
    type: 'Submission[]',
    default: 'TASK_SUBMISSION_SAMPLE',
    description: 'One row per group, top to bottom — group label and submittedAt (or null).',
  },
  {
    name: 'dueAt',
    type: 'string',
    default: 'TASK_SUBMISSION_DUE',
    description: 'Local ISO due timestamp, drawn as a dashed line.',
  },
  {
    name: 'earlyWindowHours',
    type: 'number',
    default: '24',
    description: 'Hours before the due date that still count as on time; earlier is early.',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'de-DE'",
    description: 'Locale for axis ticks and tooltips.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root.',
  },
]

export function TaskSubmissionScatterPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { earlyWindowHours, locale } = settings.values

  const usage = toUsageSnippet({
    component: 'TaskSubmissionScatter',
    from: '@/components/ui/task-submission-scatter',
    props: { earlyWindowHours, locale },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / task-submission-scatter"
      title="Task Submission Scatter"
      description="When each group handed in, plotted against a dashed due-date line and colour-coded early, on time, late, or missing."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="On-time window"
            value={earlyWindowHours}
            onValueChange={(value) => settings.set('earlyWindowHours', value)}
            min={0}
            max={96}
            step={6}
            unit="h"
          />
          <DemoControlGroup
            title="Locale"
            options={LOCALES}
            value={locale}
            onChange={(value) => settings.set('locale', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/task-submission-scatter/'],
        usage,
        props: PROPS,
      }}
    >
      <TaskSubmissionScatter
        earlyWindowHours={earlyWindowHours}
        locale={locale}
        className="mx-auto max-w-3xl"
      />
    </DemoPage>
  )
}
