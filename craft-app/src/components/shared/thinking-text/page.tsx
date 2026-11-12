import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ThinkingText } from '@/components/ui/thinking-text'

const STEPS = {
  agent: [
    'Reading the repo…',
    'Tracing calls…',
    'Drafting the fix…',
    'Running tests…',
    'Almost there…',
  ],
  search: ['Searching the docs…', 'Reading 12 sources…', 'Comparing answers…', 'Writing it up…'],
  deploy: ['Building…', 'Uploading assets…', 'Warming the edge…', 'Going live…'],
} as const

type Task = keyof typeof STEPS

const TASKS = Object.keys(STEPS) as Task[]

const LABELS: Record<Task, string> = {
  agent: 'Fixing a bug',
  search: 'Searching',
  deploy: 'Deploying',
}

const DEFAULTS = {
  task: 'agent' as Task,
  interval: 1500,
  showElapsed: true,
}

const COMPONENT_DEFAULTS = { interval: 1500, showElapsed: false }

const PROPS: DemoPropDoc[] = [
  {
    name: 'texts',
    type: 'string[]',
    default: "['Thinking...', 'Processing...', …]",
    description: 'Words to cycle through, in order. One word stays put.',
  },
  {
    name: 'interval',
    type: 'number',
    default: '1500',
    description: 'Milliseconds each word stays before the next one rises in.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Loading'",
    description: 'Stable status for screen readers; the cycling words are hidden from them.',
  },
  {
    name: 'showElapsed',
    type: 'boolean',
    default: 'false',
    description: 'Show the seconds spent so far. Counts from zero each time it is turned on.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root `<output>`; set the size here.' },
]

export function ThinkingTextPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { task, interval, showElapsed } = settings.values

  const usage = toUsageSnippet({
    component: 'ThinkingText',
    from: '@/components/ui/thinking-text',
    props: { texts: { expression: 'steps' }, interval, showElapsed, label: LABELS[task] },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / thinking-text"
      title="Thinking Text"
      description="A status line for an assistant at work. Each step rises in letter by letter out of a soft blur, a brightness wave runs across it, then it blurs away upward for the next. Adapted from Kokonut UI (MIT)."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Task"
            options={TASKS}
            value={task}
            onChange={(next) => settings.set('task', next)}
            format={(value) => LABELS[value]}
          />
          <DemoSlider
            label="Interval"
            value={interval}
            onValueChange={(next) => settings.set('interval', next)}
            min={800}
            max={3000}
            step={100}
            unit="ms"
          />
          <DemoSwitch
            label="Elapsed timer"
            checked={showElapsed}
            onCheckedChange={(next) => settings.set('showElapsed', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/thinking-text/'], usage, props: PROPS }}
    >
      {/* keyed on the task so a new list starts from its first step */}
      <ThinkingText
        key={task}
        texts={STEPS[task]}
        interval={interval}
        showElapsed={showElapsed}
        label={LABELS[task]}
        className="text-2xl sm:text-3xl"
      />
    </DemoPage>
  )
}
