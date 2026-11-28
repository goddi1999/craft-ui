import {
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { FillSweepButton } from '@/components/ui/fill-sweep-button'

const ACCENTS = { orange: '#f97316', lime: '#84cc16', sky: '#0ea5e9', pink: '#ec4899' } as const
type AccentName = keyof typeof ACCENTS
const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[]

const DEFAULTS = { label: 'Preview in browser', accent: 'orange' as AccentName }
const COMPONENT_DEFAULTS = { accent: ACCENTS.orange }

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', description: 'Button label.' },
  {
    name: 'accent',
    type: 'string',
    default: "'#f97316'",
    description: 'Colour that sweeps in from the left. Any CSS colour.',
  },
  { name: '...props', type: "ComponentProps<'button'>", description: 'Passed to the button.' },
]

export function FillSweepButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, accent } = settings.values
  const text = label.trim() || DEFAULTS.label

  const usage = toUsageSnippet({
    component: 'FillSweepButton',
    from: '@/components/ui/fill-sweep-button',
    props: { accent: ACCENTS[accent] },
    defaults: COMPONENT_DEFAULTS,
    children: text,
  })

  return (
    <DemoPage
      eyebrow="ui / fill-sweep-button"
      title="Fill Sweep Button"
      description="An outlined pill that floods with colour from the left on hover or focus. The fill scales on the GPU while the label flips to the page colour to stay readable."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={28}
          />
          <DemoControlGroup
            title="Accent"
            options={ACCENT_NAMES}
            value={accent}
            onChange={(next) => settings.set('accent', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/fill-sweep-button/'], usage, props: PROPS }}
    >
      <FillSweepButton accent={ACCENTS[accent]}>{text}</FillSweepButton>
    </DemoPage>
  )
}
