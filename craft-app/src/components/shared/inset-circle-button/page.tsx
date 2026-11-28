import { DemoSettings, DemoTextField, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { InsetCircleButton } from '@/components/ui/inset-circle-button'

const DEFAULTS = { label: 'View Project' }

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', description: 'Short label inside the circle.' },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the button. Change `size-32` to resize the circle.',
  },
  { name: '...props', type: "ComponentProps<'button'>", description: 'Passed to the button.' },
]

export function InsetCircleButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const text = settings.values.label.trim() || DEFAULTS.label

  const usage = toUsageSnippet({
    component: 'InsetCircleButton',
    from: '@/components/ui/inset-circle-button',
    props: {},
    children: text,
  })

  return (
    <DemoPage
      eyebrow="ui / inset-circle-button"
      title="Inset Circle Button"
      description="A round button with a solid inner disc. On hover or focus the disc shrinks into the centre with a circular clip, and the label fades to the opposite colour as it is uncovered."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={settings.values.label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={14}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/inset-circle-button/'], usage, props: PROPS }}
    >
      <InsetCircleButton>{text}</InsetCircleButton>
    </DemoPage>
  )
}
