import {
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { EdgeGlowButton } from '@/components/ui/edge-glow-button'

const DEFAULTS = { label: 'See in Action', arrow: true }
const COMPONENT_DEFAULTS = { arrow: true }

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', description: 'Button label, shown in uppercase.' },
  {
    name: 'arrow',
    type: 'boolean',
    default: 'true',
    description: 'Trailing arrow after the label.',
  },
  {
    name: '...props',
    type: "ComponentProps<'button'>",
    description: 'Passed to the button. The wrapper around it holds the edge glow.',
  },
]

export function EdgeGlowButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, arrow } = settings.values
  const text = label.trim() || DEFAULTS.label

  const usage = toUsageSnippet({
    component: 'EdgeGlowButton',
    from: '@/components/ui/edge-glow-button',
    props: { arrow },
    defaults: COMPONENT_DEFAULTS,
    children: text,
  })

  return (
    <DemoPage
      eyebrow="ui / edge-glow-button"
      title="Edge Glow Button"
      description="A pill button with a warm light inside it that springs after the pointer, overshooting slightly before it settles. As the light nears an edge, that edge glows. Keyboard focus centres the light. The spring writes styles directly, so moving the pointer never re-renders."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={20}
          />
          <DemoSwitch
            label="Arrow"
            checked={arrow}
            onCheckedChange={(next) => settings.set('arrow', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/edge-glow-button/'], usage, props: PROPS }}
    >
      <EdgeGlowButton arrow={arrow}>{text}</EdgeGlowButton>
    </DemoPage>
  )
}
