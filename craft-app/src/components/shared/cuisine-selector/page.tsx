import {
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { CUISINES, CuisineSelector } from '@/components/ui/cuisine-selector'

const DEFAULTS = {
  legend: 'What are your favorite cuisines?',
  count: CUISINES.length as number,
}

const OPTIONS_PLACEHOLDER = '__options__'

const PROPS: DemoPropDoc[] = [
  {
    name: 'options',
    type: 'readonly string[]',
    default: 'CUISINES',
    description: 'Chip labels, one checkbox each.',
  },
  {
    name: 'value',
    type: 'string[]',
    description: 'Controlled selection.',
  },
  {
    name: 'defaultValue',
    type: 'string[]',
    default: '[]',
    description: 'Initial selection when uncontrolled.',
  },
  {
    name: 'onChange',
    type: '(value: string[]) => void',
    description: 'Called with the new selection whenever a chip is toggled or reset.',
  },
  {
    name: 'legend',
    type: 'string',
    default: "'What are your favorite cuisines?'",
    description: 'Fieldset legend above the chips.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Classes for the root form.',
  },
]

export function CuisineSelectorPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { legend, count } = settings.values
  const options = CUISINES.slice(0, count)

  const usage = toUsageSnippet({
    component: 'CuisineSelector',
    from: '@/components/ui/cuisine-selector',
    imports: count === CUISINES.length ? [] : ['CUISINES'],
    props: {
      options: count === CUISINES.length ? undefined : OPTIONS_PLACEHOLDER,
      legend: legend || undefined,
    },
    defaults: DEFAULTS,
  }).replace(
    `options="${OPTIONS_PLACEHOLDER}"`,
    `options={CUISINES.slice(0, ${count})}`,
  )

  return (
    <DemoPage
      eyebrow="ui / cuisine-selector"
      title="Cuisine Selector with :has()"
      description="A multi-select chip list driven by :has(:checked) — selected chips reveal a check, grow a soft orange ring, and a reset clears the set."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Legend"
            value={legend}
            onValueChange={(value) => settings.set('legend', value)}
            maxLength={48}
          />
          <DemoSlider
            label="Cuisines"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={4}
            max={CUISINES.length}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/cuisine-selector/'],
        usage,
        props: PROPS,
      }}
    >
      <CuisineSelector options={options} legend={legend || undefined} />
    </DemoPage>
  )
}
