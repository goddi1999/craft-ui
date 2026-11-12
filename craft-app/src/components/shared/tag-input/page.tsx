import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { TagInput } from '@/components/ui/tag-input'

const START = ['onboarding', 'web']
// what "Add a label" types in, in order, skipping any already there
const SUGGESTIONS = ['billing', 'needs review', 'api', 'docs', 'p1', 'mobile']

const LABEL = 'Labels'
const HELP = 'Press Enter or comma to add'
const PLACEHOLDER = 'Add a label'

const DEFAULTS = { showLabel: true, showHelp: true }

const PROPS: DemoPropDoc[] = [
  { name: 'value', type: 'string[]', description: 'The tags, controlled.' },
  {
    name: 'defaultValue',
    type: 'string[]',
    default: '[]',
    description: 'The tags at first render, uncontrolled.',
  },
  {
    name: 'onValueChange',
    type: '(value: string[]) => void',
    description:
      'Called with the new list. Enter or a comma adds, Backspace in an empty field removes the last tag; duplicates are ignored.',
  },
  {
    name: 'label',
    type: 'ReactNode',
    description: 'Label above the field. Without one the placeholder names the input.',
  },
  { name: 'description', type: 'ReactNode', description: 'Help text under the field.' },
  { name: 'placeholder', type: 'string', default: "'Add a tag'", description: 'Shown in the empty input.' },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function TagInputPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { showLabel, showHelp } = settings.values
  const [labels, setLabels] = useState(START)

  const next = SUGGESTIONS.find((suggestion) => !labels.includes(suggestion))

  const usage = toUsageSnippet({
    component: 'TagInput',
    from: '@/components/ui/tag-input',
    props: {
      value: { expression: 'labels' },
      onValueChange: { expression: 'setLabels' },
      label: showLabel ? LABEL : undefined,
      description: showHelp ? HELP : undefined,
      placeholder: PLACEHOLDER,
    },
  })

  return (
    <DemoPage
      eyebrow="ui / tag-input"
      title="Tag Input"
      description="A field that turns words into chips. Press Enter and the word grows from nothing to its own width and pops in; the x shrinks a chip away and the chips after it slide over. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Label"
            checked={showLabel}
            onCheckedChange={(checked) => settings.set('showLabel', checked)}
          />
          <DemoSwitch
            label="Help text"
            checked={showHelp}
            onCheckedChange={(checked) => settings.set('showHelp', checked)}
          />
          <DemoAction
            onClick={() => {
              if (next) setLabels((current) => [...current, next])
            }}
            disabled={!next}
          >
            Add a label
          </DemoAction>
          <DemoAction
            onClick={() => setLabels((current) => current.slice(1))}
            disabled={labels.length === 0}
          >
            Remove oldest
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/tag-input/'], usage, props: PROPS }}
    >
      <TagInput
        value={labels}
        onValueChange={setLabels}
        label={showLabel ? LABEL : undefined}
        description={showHelp ? HELP : undefined}
        placeholder={PLACEHOLDER}
      />
    </DemoPage>
  )
}
