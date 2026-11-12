import { useRef, useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { OnboardingChecklist, type OnboardingStep } from '@/components/ui/onboarding-checklist'

// long enough to see the spinner, short enough not to wait on it
const ACTION_MS = 900
const ALREADY_DONE = ['profile', 'github']

const DEFAULTS = {
  title: 'Set up your workspace',
  doneTitle: 'You’re all set',
  startDone: false,
  startHidden: false,
  width: 440,
}

const COMPONENT_DEFAULTS = { doneTitle: 'You’re all set', defaultHidden: false }

const wait = () => new Promise<void>((resolve) => window.setTimeout(resolve, ACTION_MS))

const PROPS: DemoPropDoc[] = [
  { name: 'title', type: 'string', description: 'Heading while steps are left.' },
  {
    name: 'doneTitle',
    type: 'string',
    default: "'You’re all set'",
    description: 'Heading once every step is done; it rises in over the title.',
  },
  {
    name: 'steps',
    type: 'OnboardingStep[]',
    description:
      '`{ id, title, description?, actionLabel?, onAction? }`. Without `actionLabel` a step is checked off by hand. `onAction` resolves to check the step off, or throws an Error whose message shows under it.',
  },
  {
    name: 'defaultCompleted',
    type: 'string[]',
    default: '[]',
    description: 'Ids already done on mount; they start in the completed row.',
  },
  {
    name: 'onCompletedChange',
    type: '(completed: string[]) => void',
    description: 'Called with the done ids, in step order, after every check or uncheck.',
  },
  {
    name: 'defaultHidden',
    type: 'boolean',
    default: 'false',
    description: 'Start folded down to the header bar.',
  },
  {
    name: 'onHiddenChange',
    type: '(hidden: boolean) => void',
    description: 'Called when Hide or Show is pressed.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

export function OnboardingChecklistPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, doneTitle, startDone, startHidden, width } = settings.values
  const [run, setRun] = useState(0)
  // the invite fails once per run, so the error state shows before it goes through
  const inviteTries = useRef(0)

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Add your name and photo',
      description: 'Teammates see this next to everything you post.',
      actionLabel: 'Open profile',
      onAction: wait,
    },
    {
      id: 'invite',
      title: 'Invite your team',
      description: 'Send invites by email or share a link. You can change roles later.',
      actionLabel: 'Send invites',
      onAction: async () => {
        inviteTries.current += 1
        await wait()
        if (inviteTries.current === 1) throw new Error('Couldn’t reach the mail server. Try again.')
      },
    },
    {
      id: 'github',
      title: 'Connect GitHub',
      description: 'Link a repository so pull requests show up in your projects.',
      actionLabel: 'Connect',
      onAction: wait,
    },
    {
      id: 'project',
      title: 'Create your first project',
      description: 'Projects hold the tasks, docs and files for one piece of work.',
      actionLabel: 'New project',
      onAction: wait,
    },
    {
      id: 'tour',
      title: 'Take the two-minute tour',
      description: 'A quick walk through the editor, shortcuts and search. Check it off when you’re done.',
    },
  ]

  const restart = () => {
    inviteTries.current = 0
    setRun((value) => value + 1)
  }

  const usage = toUsageSnippet({
    component: 'OnboardingChecklist',
    from: '@/components/ui/onboarding-checklist',
    props: {
      title,
      doneTitle,
      steps: { expression: 'steps' },
      defaultCompleted: startDone ? { expression: "['profile', 'github']" } : undefined,
      defaultHidden: startHidden,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / onboarding-checklist"
      title="Onboarding Checklist"
      description="A getting started checklist. The ring and the rolling count follow every check, a finished step strikes through and folds into a completed row you can open again, and the next step opens and takes focus. Steps can run async actions with a spinner and show an error when one fails. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
          />
          <DemoTextField
            label="Done title"
            value={doneTitle}
            onValueChange={(next) => settings.set('doneTitle', next)}
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={300}
            max={520}
            step={10}
            unit="px"
          />
          <DemoSwitch
            label="Start with two steps done"
            checked={startDone}
            onCheckedChange={(next) => settings.set('startDone', next)}
          />
          <DemoSwitch
            label="Start hidden"
            checked={startHidden}
            onCheckedChange={(next) => settings.set('startHidden', next)}
          />
          <DemoAction onClick={restart}>Start over</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/onboarding-checklist/'], usage, props: PROPS }}
    >
      <div className="w-full" style={{ maxWidth: width }}>
        <OnboardingChecklist
          key={`${run}-${startDone}-${startHidden}`}
          title={title}
          doneTitle={doneTitle}
          steps={steps}
          defaultCompleted={startDone ? ALREADY_DONE : []}
          defaultHidden={startHidden}
        />
      </div>
    </DemoPage>
  )
}
