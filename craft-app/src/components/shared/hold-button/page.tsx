import { Archive, Rocket, Upload } from 'lucide-react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { HoldButton } from '@/components/ui/hold-button'

const ACTIONS = {
  publish: { label: 'Hold to publish', done: 'Published', Icon: Upload, icon: 'Upload' },
  deploy: { label: 'Hold to deploy', done: 'Deployed', Icon: Rocket, icon: 'Rocket' },
  archive: { label: 'Hold to archive', done: 'Archived', Icon: Archive, icon: 'Archive' },
} as const

type Action = keyof typeof ACTIONS

const ACTION_KEYS = Object.keys(ACTIONS) as Action[]

const DEFAULTS = {
  action: 'publish' as Action,
  duration: 1200,
  doneDuration: 1700,
  width: 220,
}

const COMPONENT_DEFAULTS = { doneLabel: 'Done', duration: 1200, doneDuration: 1700, width: 220 }

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'The label. It is drawn twice: plain, and inverted where the fill has reached.',
  },
  { name: 'icon', type: 'ReactNode', description: 'Icon before the label, sized to 18px.' },
  {
    name: 'onComplete',
    type: '() => void',
    description: 'Fires once, when the fill reaches the end. This is the commit point, not onClick.',
  },
  {
    name: 'doneLabel',
    type: 'string',
    default: "'Done'",
    description: 'Announced to screen readers when the pill turns into the check.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '1200',
    description: 'How long to hold, in ms. Space and Enter hold it from the keyboard.',
  },
  {
    name: 'doneDuration',
    type: 'number',
    default: '1700',
    description: 'How long the check stays before it springs back into the pill, in ms.',
  },
  {
    name: 'width',
    type: 'number',
    default: '220',
    description: 'Pill width in px. It always shrinks to a 56px circle when done.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the button. Other button props pass through.',
  },
]

export function HoldButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { action, duration, doneDuration, width } = settings.values
  const { label, done, Icon, icon } = ACTIONS[action]

  const usage = toUsageSnippet({
    component: 'HoldButton',
    from: '@/components/ui/hold-button',
    props: {
      icon: { expression: `<${icon} />` },
      doneLabel: done,
      duration,
      doneDuration,
      width,
      onComplete: { expression: action },
    },
    defaults: COMPONENT_DEFAULTS,
    children: label,
  })

  return (
    <DemoPage
      eyebrow="ui / hold-button"
      title="Hold to Publish"
      description="Press and hold: the fill sweeps across the pill and the label inverts exactly where it has reached. Let go early and it springs back with a little head-shake; hold to the end and the pill morphs into a green circle while the check draws itself. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Action"
            options={ACTION_KEYS}
            value={action}
            onChange={(next) => settings.set('action', next)}
          />
          <DemoSlider
            label="Hold for"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={400}
            max={3000}
            step={100}
            unit="ms"
          />
          <DemoSlider
            label="Check stays"
            value={doneDuration}
            onValueChange={(next) => settings.set('doneDuration', next)}
            min={800}
            max={4000}
            step={100}
            unit="ms"
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={180}
            max={300}
            step={4}
            unit="px"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/hold-button/'], usage, props: PROPS }}
    >
      <HoldButton
        icon={<Icon />}
        doneLabel={done}
        duration={duration}
        doneDuration={doneDuration}
        width={width}
      >
        {label}
      </HoldButton>
    </DemoPage>
  )
}
