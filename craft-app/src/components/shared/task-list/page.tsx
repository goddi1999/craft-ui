import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { TaskList, type Task, type TaskSize } from '@/components/ui/task-list'

const TASKS: Task[] = [
  { id: 'ship', label: 'Ship a new component to the registry', done: true },
  { id: 'preview', label: 'Record a preview for the gallery' },
  { id: 'docs', label: 'Write the API table' },
  { id: 'star', label: 'Star Rare UI' },
]

const SIZES: TaskSize[] = ['sm', 'md', 'lg']

// the accent is any CSS colour; these are just a few to try
const ACCENTS = ['#FF5F2E', '#2E7BFF', '#16A34A', '#A855F7'] as const
const ACCENT_NAMES: Record<(typeof ACCENTS)[number], string> = {
  '#FF5F2E': 'Orange',
  '#2E7BFF': 'Blue',
  '#16A34A': 'Green',
  '#A855F7': 'Purple',
}

const DEFAULTS = {
  size: 'md' as TaskSize,
  accent: '#FF5F2E' as (typeof ACCENTS)[number],
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'tasks',
    type: 'Task[]',
    description: 'Controlled rows — each an id, a label and an optional done flag.',
  },
  {
    name: 'defaultTasks',
    type: 'Task[]',
    default: '[]',
    description: 'Rows to start with when uncontrolled; the list tracks which are done itself.',
  },
  {
    name: 'onTasksChange',
    type: '(tasks: Task[]) => void',
    description: 'Called with the full list each time a row is ticked or unticked.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Text, circle, padding and radius scale together; the circle always matches one line of the label.',
  },
  {
    name: 'accent',
    type: 'string',
    default: "'#FF5F2E'",
    description: 'Any CSS colour for the filled circle and the focus ring. The strike and faded text stay grey.',
  },
  {
    name: 'onSettled',
    type: '() => void',
    description: 'TaskItem only: fires once a row has finished ticking, which is how TaskList knows when to move it down.',
  },
  {
    name: 'checked / defaultChecked / onCheckedChange',
    type: 'boolean / boolean / (checked: boolean) => void',
    description: 'TaskItem only: use a single row on its own, controlled or not.',
  },
]

const countDone = (tasks: Task[]) => tasks.filter((task) => task.done).length

export function TaskListPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, accent } = settings.values
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(countDone(TASKS))

  const handleRestart = () => {
    setDone(countDone(TASKS))
    setRun((n) => n + 1)
  }

  const usage = toUsageSnippet({
    component: 'TaskList',
    from: '@/components/ui/task-list',
    props: {
      defaultTasks: {
        expression: `[\n    { id: 'ship', label: 'Ship a new component', done: true },\n    { id: 'preview', label: 'Record a preview' },\n  ]`,
      },
      size,
      accent,
    },
    defaults: { size: 'md', accent: '#FF5F2E' },
  })

  return (
    <DemoPage
      eyebrow="ui / task-list"
      title="Task List"
      description={
        <>
          A checklist that strikes out completed tasks: the circle fills and ticks, the label strikes
          through, the row flicks, then springs to the bottom of the list. Unticking plays it all
          backwards. Ported from{' '}
          <a href="https://github.com/swamimalode07/rare-ui" target="_blank" rel="noreferrer">
            rare-ui
          </a>
          .
        </>
      }
      previewClassName="bg-background flex-col gap-5"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoControlGroup
            title="Accent"
            options={ACCENTS}
            value={accent}
            onChange={(next) => settings.set('accent', next)}
            format={(option) => (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: option }} />
                {ACCENT_NAMES[option]}
              </span>
            )}
          />
          <DemoAction onClick={handleRestart}>Restart list</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/task-list/'], usage, props: PROPS }}
    >
      <TaskList
        key={run}
        defaultTasks={TASKS}
        size={size}
        accent={accent}
        onTasksChange={(tasks) => setDone(countDone(tasks))}
      />
      <p className="text-xs text-muted-foreground tabular-nums">
        {done} of {TASKS.length} done
      </p>
    </DemoPage>
  )
}
