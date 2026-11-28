import {
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { OutlineWipeButton } from '@/components/ui/outline-wipe-button'

const ACCENTS = { orange: '#f97316', lime: '#84cc16', sky: '#0ea5e9', pink: '#ec4899' } as const
type AccentName = keyof typeof ACCENTS
const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[]

const DEFAULTS = { label: 'MicroKit', accent: 'orange' as AccentName }
const COMPONENT_DEFAULTS = { accent: ACCENTS.orange }

const PROPS: DemoPropDoc[] = [
  {
    name: 'label',
    type: 'string',
    description: 'Text drawn as an outline. It is also the accessible name of the button.',
  },
  {
    name: 'accent',
    type: 'string',
    default: "'#f97316'",
    description: 'Colour of the wipe, the caret and the glow. Any CSS colour.',
  },
  { name: '...props', type: "ComponentProps<'button'>", description: 'Passed to the button.' },
]

export function OutlineWipeButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, accent } = settings.values
  const text = label.trim() || DEFAULTS.label

  const usage = toUsageSnippet({
    component: 'OutlineWipeButton',
    from: '@/components/ui/outline-wipe-button',
    props: { label: text, accent: ACCENTS[accent] },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / outline-wipe-button"
      title="Outline Wipe Button"
      description="Outlined display text with a caret resting at its start. Hover or focus it and the caret sweeps across, wiping the letters in solid colour with a soft glow behind them."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={16}
          />
          <DemoControlGroup
            title="Accent"
            options={ACCENT_NAMES}
            value={accent}
            onChange={(next) => settings.set('accent', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/outline-wipe-button/'], usage, props: PROPS }}
    >
      <OutlineWipeButton label={text} accent={ACCENTS[accent]} />
    </DemoPage>
  )
}
