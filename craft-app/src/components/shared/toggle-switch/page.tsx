import { useId, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ToggleSwitch, type ToggleSwitchColor } from '@/components/ui/toggle-switch'

const COLORS: readonly ToggleSwitchColor[] = ['green', 'primary']

const ROWS = [
  { id: 'deploy', title: 'Auto-deploy main', detail: 'Every merge ships to production' },
  { id: 'previews', title: 'Preview comments', detail: 'Post a link on each pull request' },
  { id: 'alerts', title: 'Spend alerts', detail: 'Email me at 80% of the budget' },
  { id: 'telemetry', title: 'Usage telemetry', detail: 'Share anonymous usage data' },
] as const

type RowId = (typeof ROWS)[number]['id']

// the source starts with only the first switch on
const START: Record<RowId, boolean> = {
  deploy: true,
  previews: false,
  alerts: false,
  telemetry: false,
}

const DEFAULTS = {
  color: 'green' as ToggleSwitchColor,
  disabled: false,
}

const COMPONENT_DEFAULTS = { color: 'green', disabled: false }

const PROPS: DemoPropDoc[] = [
  { name: 'checked', type: 'boolean', description: 'Controlled state.' },
  {
    name: 'defaultChecked',
    type: 'boolean',
    default: 'false',
    description: 'Starting state when uncontrolled.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean) => void',
    description: 'Called with the next state on every flip.',
  },
  {
    name: 'color',
    type: "'green' | 'primary'",
    default: "'green'",
    description: "Fill when on: iOS green, or your theme's primary so it follows the accent.",
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims it and ignores clicks.' },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Name it with this or `aria-labelledby` when there is no visible label.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the track button.' },
]

function SettingRow({
  title,
  detail,
  checked,
  onCheckedChange,
  color,
  disabled,
}: {
  title: string
  detail: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  color: ToggleSwitchColor
  disabled: boolean
}) {
  const id = useId()

  return (
    <div className="flex h-[60px] items-center justify-between gap-4">
      <div className="min-w-0">
        <p id={`${id}-title`} className="text-[15px] font-medium text-foreground">
          {title}
        </p>
        <p id={`${id}-detail`} className="mt-0.5 truncate text-xs text-muted-foreground">
          {detail}
        </p>
      </div>
      <ToggleSwitch
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-detail`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        color={color}
        disabled={disabled}
      />
    </div>
  )
}

export function ToggleSwitchPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { color, disabled } = settings.values
  const [on, setOn] = useState(START)

  const handleFlipAll = () =>
    setOn((current) => ({
      deploy: !current.deploy,
      previews: !current.previews,
      alerts: !current.alerts,
      telemetry: !current.telemetry,
    }))

  const usage = toUsageSnippet({
    component: 'ToggleSwitch',
    from: '@/components/ui/toggle-switch',
    props: {
      'aria-label': 'Auto-deploy main',
      checked: { expression: 'enabled' },
      onCheckedChange: { expression: 'setEnabled' },
      color,
      disabled,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / toggle-switch"
      title="Toggle Switch"
      description="An iOS-style switch with some give. Flip it and the knob stretches toward where it is going, lands with a small bounce and rounds back up while the track fills. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Colour"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(next) => settings.set('disabled', next)}
          />
          <DemoAction onClick={handleFlipAll} disabled={disabled}>
            Flip all
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/toggle-switch/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-[320px] rounded-3xl bg-muted px-4 py-1.5">
        {ROWS.map((row) => (
          <SettingRow
            key={row.id}
            title={row.title}
            detail={row.detail}
            checked={on[row.id]}
            onCheckedChange={(next) => setOn((current) => ({ ...current, [row.id]: next }))}
            color={color}
            disabled={disabled}
          />
        ))}
      </div>
    </DemoPage>
  )
}
