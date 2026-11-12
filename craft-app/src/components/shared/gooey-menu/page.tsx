import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GooeyMenu } from '@/components/ui/gooey-menu'

const START_OPTIONS = 'Home, About, Projects, Contact, Book a call, Follow us'
// more rows than this outgrow the preview card
const MAX_OPTIONS = 8

const DEFAULTS = {
  options: START_OPTIONS,
  width: 306,
  label: 'Menu',
  startOpen: false,
}

const COMPONENT_DEFAULTS = { width: 306, label: 'Menu', defaultOpen: false }

// a comma list, trimmed, without blanks or repeats, since each label is also a key
const parseOptions = (text: string) =>
  [...new Set(text.split(',').map((option) => option.trim()))]
    .filter(Boolean)
    .slice(0, MAX_OPTIONS)

const toArraySource = (options: readonly string[]) =>
  `[${options.map((option) => `'${option.replace(/'/g, "\\'")}'`).join(', ')}]`

const DEFAULT_LIST = parseOptions(START_OPTIONS).join('\n')

const PROPS: DemoPropDoc[] = [
  {
    name: 'options',
    type: 'string[]',
    default: "['Home', 'About', 'Projects', 'Contact', 'Book a call', 'Follow us']",
    description: 'The rows, top to bottom. Each label is also its key, so keep them unique.',
  },
  { name: 'value', type: 'string', description: 'The selected option, when controlled.' },
  {
    name: 'defaultValue',
    type: 'string',
    default: 'options[0]',
    description: 'The selected option on mount, when uncontrolled.',
  },
  {
    name: 'onSelect',
    type: '(option: string, index: number) => void',
    description: 'Called on a click, or Enter or Space on the highlighted row.',
  },
  { name: 'open', type: 'boolean', description: 'Open state, when controlled.' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Open state on mount, when uncontrolled.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called on toggle, pick, Escape and a click outside.',
  },
  {
    name: 'width',
    type: 'number',
    default: '306',
    description: 'Width of the pill and the panel in px.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Menu'",
    description: 'Accessible name of the trigger; the selected option is read as its value.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function GooeyMenuPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { width, label, startOpen } = settings.values
  const parsed = parseOptions(settings.values.options)
  // an empty field falls back to the default rows
  const options = parsed.length ? parsed : undefined
  const list = parsed.join('\n')

  const usage = toUsageSnippet({
    component: 'GooeyMenu',
    from: '@/components/ui/gooey-menu',
    props: {
      options:
        options && list !== DEFAULT_LIST ? { expression: toArraySource(options) } : undefined,
      onSelect: { expression: '(option) => navigate(option)' },
      width,
      label: label || undefined,
      defaultOpen: startOpen,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / gooey-menu"
      title="Gooey Menu"
      description="A dark pill that pours its options out like a liquid drop. An SVG goo filter melts the panel into the pill while they are close, so it stretches off on a spring, the rows stagger in, and it all snaps back when you pick. Arrow keys, Enter, Space and Escape drive it, and reduced motion swaps the goo for a fade. Adapted from EasyUI."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Options"
            value={settings.values.options}
            onValueChange={(next) => settings.set('options', next)}
            placeholder="Comma-separated"
            maxLength={120}
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={24}
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={240}
            max={400}
            step={2}
            unit="px"
          />
          <DemoSwitch
            label="Start open"
            checked={startOpen}
            onCheckedChange={(next) => settings.set('startOpen', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/gooey-menu/'], usage, props: PROPS }}
    >
      <GooeyMenu
        // the selection and open state start from props on mount, so new rows remount it
        key={`${list}|${startOpen}`}
        options={options}
        width={width}
        label={label || undefined}
        defaultOpen={startOpen}
      />
    </DemoPage>
  )
}
