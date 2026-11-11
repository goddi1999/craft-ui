import { useState } from 'react'

import {
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from '@/components/ui/choice-controls'
import { Inset, Panel, Shell } from '@/components/ui/surface'

const DEFAULTS = { disabled: false, descriptions: true }

const TOPICS = ['Product updates', 'Security alerts', 'Weekly digest'] as const
const EFFORTS = ['low', 'medium', 'high'] as const

const PROPS: DemoPropDoc[] = [
  { name: 'Switch.checked / defaultChecked', type: 'boolean', default: 'false', description: 'Controlled or initial on state.' },
  { name: 'Switch.onCheckedChange', type: '(checked: boolean) => void', description: 'Called when toggled.' },
  { name: 'Checkbox.checked / defaultChecked', type: "boolean | 'mixed'", default: 'false', description: "'mixed' shows the indeterminate dash." },
  { name: 'Checkbox.onCheckedChange', type: '(checked: boolean) => void', description: 'Called with true when checked, false otherwise.' },
  { name: 'RadioGroup.label', type: 'string', description: 'Accessible name for the group. Required.' },
  { name: 'RadioGroup.value / defaultValue', type: 'string', description: 'Selected radio, controlled or initial.' },
  { name: 'RadioGroup.onValueChange', type: '(value: string) => void', description: 'Called when the selection changes.' },
  { name: 'Radio.value', type: 'string', description: 'The value this radio selects. Required.' },
  { name: 'label / description', type: 'ReactNode', description: 'Visible text next to the control; clicking it toggles the control.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the control.' },
]

export function ChoiceControlsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { disabled, descriptions } = settings.values
  const note = (text: string) => (descriptions ? text : undefined)

  const [topics, setTopics] = useState<string[]>(['Security alerts'])
  const [effort, setEffort] = useState<string>('medium')
  const [web, setWeb] = useState(true)

  const allOn = topics.length === TOPICS.length
  const parent = allOn ? true : topics.length ? 'mixed' : false

  const usage = toUsageSnippet({
    component: 'Switch',
    from: '@/components/ui/choice-controls',
    imports: ['Checkbox', 'Radio', 'RadioGroup'],
    props: {
      label: 'Web search',
      checked: { expression: 'web' },
      onCheckedChange: { expression: 'setWeb' },
      disabled,
    },
  })

  return (
    <DemoPage
      eyebrow="ui / choice-controls"
      title="Choice Controls"
      description={
        <>
          Switch, Checkbox and RadioGroup with a recessed look. The switch
          carries I / O glyphs so state never relies on color alone. Adapted
          from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(next) => settings.set('disabled', next)}
          />
          <DemoSwitch
            label="Descriptions"
            checked={descriptions}
            onCheckedChange={(next) => settings.set('descriptions', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/choice-controls/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="grid w-full max-w-xl items-start gap-3 sm:grid-cols-2">
        <Shell>
          <Panel className="flex flex-col gap-4 p-4">
            <Switch
              label="Web search"
              description={note('Let the agent browse while it answers')}
              checked={web}
              onCheckedChange={setWeb}
              disabled={disabled}
            />
            <Checkbox
              label="Remember this choice"
              description={note('Applies to future conversations')}
              defaultChecked
              disabled={disabled}
            />
            <RadioGroup
              label="Reasoning effort"
              value={effort}
              onValueChange={setEffort}
            >
              {EFFORTS.map((value) => (
                <Radio
                  key={value}
                  value={value}
                  label={value[0].toUpperCase() + value.slice(1)}
                  description={note(
                    value === 'low'
                      ? 'Fastest answers'
                      : value === 'high'
                        ? 'Thinks longer on hard tasks'
                        : undefined,
                  )}
                  disabled={disabled}
                />
              ))}
            </RadioGroup>
            <p className="text-[0.8125rem] text-muted-foreground">
              Controlled: web search is {web ? 'on' : 'off'}, effort is {effort}.
            </p>
          </Panel>
        </Shell>

        <Shell>
          <Panel className="flex flex-col gap-4 p-4">
            <Checkbox
              label="Email notifications"
              description={note('Select all or pick topics below')}
              checked={parent}
              onCheckedChange={(next) => setTopics(next ? [...TOPICS] : [])}
              disabled={disabled}
            />
            <Inset className="flex flex-col gap-3 p-3">
              {TOPICS.map((topic) => (
                <Checkbox
                  key={topic}
                  label={topic}
                  checked={topics.includes(topic)}
                  onCheckedChange={(next) =>
                    setTopics((current) =>
                      next ? [...current, topic] : current.filter((t) => t !== topic),
                    )
                  }
                  disabled={disabled}
                />
              ))}
            </Inset>
            <div className="flex items-center gap-4">
              <Switch aria-label="Off" disabled={disabled} />
              <Switch aria-label="On" defaultChecked disabled={disabled} />
              <Switch aria-label="Disabled on" disabled defaultChecked />
              <Checkbox aria-label="Disabled off" disabled />
              <Checkbox aria-label="Disabled mixed" disabled checked="mixed" />
            </div>
            <RadioGroup
              label="Size"
              defaultValue="m"
              className="flex-row gap-4"
            >
              <Radio value="s" aria-label="Small" disabled={disabled} />
              <Radio value="m" aria-label="Medium" disabled={disabled} />
              <Radio value="l" aria-label="Large" disabled />
            </RadioGroup>
            <p className="text-[0.8125rem] text-muted-foreground">
              Arrow keys move through the size radios and skip the disabled one.
            </p>
          </Panel>
        </Shell>
      </div>
    </DemoPage>
  )
}
