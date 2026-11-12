import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { LoadingSuccessButton } from '@/components/ui/loading-success'

// each idle label with the word that replaces it once the work is done
const LABELS = {
  Deploy: 'Deployed',
  'Save changes': 'Saved',
  'Send invite': 'Invite sent',
} as const

type Label = keyof typeof LABELS

const LABEL_OPTIONS = Object.keys(LABELS) as Label[]

const DEFAULTS = {
  label: 'Deploy' as Label,
  // the source fakes 1.6s of work
  work: 1600,
  hold: 2000,
}

const COMPONENT_DEFAULTS = { successDuration: 2000 }

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const PROPS: DemoPropDoc[] = [
  {
    name: 'action',
    type: '() => Promise<unknown>',
    description:
      'Runs on click. Spins while pending, turns green when it resolves, goes back to idle if it rejects.',
  },
  {
    name: 'status',
    type: "'idle' | 'loading' | 'success'",
    description: 'Controlled status, for when you drive the work yourself.',
  },
  {
    name: 'defaultStatus',
    type: "'idle' | 'loading' | 'success'",
    default: "'idle'",
    description: 'Starting status when uncontrolled.',
  },
  {
    name: 'onStatusChange',
    type: '(status) => void',
    description: 'Called with every status it moves to, including the return to idle.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: "'Submit'",
    description: 'Idle label. A longer label widens the pill.',
  },
  {
    name: 'successLabel',
    type: 'ReactNode',
    default: "'Done'",
    description: 'Shown next to the check.',
  },
  {
    name: 'loadingLabel',
    type: 'string',
    default: "'Loading'",
    description: 'Read out by screen readers while loading.',
  },
  {
    name: 'successDuration',
    type: 'number',
    default: '2000',
    description: 'Milliseconds success stays before going back to idle. `Infinity` keeps it.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the button.' },
]

export function LoadingSuccessButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, work, hold } = settings.values

  const usage = toUsageSnippet({
    component: 'LoadingSuccessButton',
    from: '@/components/ui/loading-success',
    props: {
      action: { expression: 'deploy' },
      successLabel: LABELS[label],
      successDuration: hold,
    },
    defaults: COMPONENT_DEFAULTS,
    children: label,
  })

  return (
    <DemoPage
      eyebrow="ui / loading-success"
      title="Loading to Success"
      description="A submit pill that drops its label and closes into a round spinner while the work runs, then opens into a green pill as the check draws itself, and settles back. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Label"
            options={LABEL_OPTIONS}
            value={label}
            onChange={(next) => settings.set('label', next)}
          />
          <DemoSlider
            label="Work takes"
            value={work}
            onValueChange={(next) => settings.set('work', next)}
            min={300}
            max={4000}
            step={100}
            unit="ms"
          />
          <DemoSlider
            label="Success holds"
            value={hold}
            onValueChange={(next) => settings.set('hold', next)}
            min={600}
            max={4000}
            step={100}
            unit="ms"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/loading-success/'], usage, props: PROPS }}
    >
      <LoadingSuccessButton
        action={() => wait(work)}
        successLabel={LABELS[label]}
        successDuration={hold}
      >
        {label}
      </LoadingSuccessButton>
    </DemoPage>
  )
}
