import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { HookSidebar, type HookSidebarColor } from '@/components/ui/hook-sidebar'

const COLORS: HookSidebarColor[] = [
  'orange',
  'violet',
  'blue',
  'teal',
  'green',
  'pink',
  'foreground',
]

const ITEMS = [
  'Introduction',
  'Installation',
  'Usage',
  'Composition',
  'Accessibility',
  'API reference',
  'Changelog',
]

const DEFAULTS = {
  label: 'On this page',
  color: 'orange' as HookSidebarColor,
  dashed: true,
}

const COMPONENT_DEFAULTS = { color: 'orange', dashed: true }

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'Array<string | { label: string; href?: string }>',
    description: 'Rows. With href they render as router links and the current route is active.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Heading above the list and the nav’s accessible name.',
  },
  {
    name: 'value / defaultValue',
    type: 'number',
    default: '0',
    description: 'Active row, controlled or initial. Pair value with onChange.',
  },
  {
    name: 'onChange',
    type: '(index: number) => void',
    description: 'Called with the row that was clicked.',
  },
  {
    name: 'color',
    type: "'orange' | 'violet' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'pink' | 'foreground'",
    default: "'orange'",
    description: 'Color of the rail that hooks into the active row.',
  },
  {
    name: 'dashed',
    type: 'boolean',
    default: 'true',
    description: 'Draw the rails as dashed lines.',
  },
]

export function HookSidebarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, color, dashed } = settings.values

  const usage = toUsageSnippet({
    component: 'HookSidebar',
    from: '@/components/ui/hook-sidebar',
    props: {
      items: { expression: "['Introduction', 'Installation', 'Usage']" },
      label,
      color,
      dashed,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / hook-sidebar"
      title="Hook Sidebar"
      description="A table of contents whose active row is marked by a rail that springs down the edge and hooks into it. Hover a row to see a second, faint rail."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Color"
            options={COLORS}
            value={color}
            onChange={(value) => settings.set('color', value)}
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={32}
          />
          <DemoSwitch
            label="Dashed"
            checked={dashed}
            onCheckedChange={(value) => settings.set('dashed', value)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/hook-sidebar/'], usage, props: PROPS }}
    >
      <HookSidebar
        items={ITEMS}
        label={label || undefined}
        color={color}
        dashed={dashed}
        defaultValue={2}
        className="w-56"
      />
    </DemoPage>
  )
}
