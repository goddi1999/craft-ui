import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { DynamicMenu, type DynamicMenuItem } from '@/components/ui/dynamic-menu'

const LINKS: DynamicMenuItem[] = [
  { label: 'Projects', href: '#projects', badge: '12' },
  { label: 'Deployments', href: '#deployments' },
  { label: 'Changelog', href: '#changelog', badge: 'New' },
  { label: 'Docs', href: '#docs' },
  { label: 'Settings', href: '#settings' },
]

const ROWS = [3, 4, 5] as const

const DEFAULTS = { openWidth: 300, rows: 4 as (typeof ROWS)[number] }

const COMPONENT_DEFAULTS = { openWidth: 300 }

const PROPS: DemoPropDoc[] = [
  { name: 'brand', type: 'ReactNode', description: 'Name in the pill, next to the toggle.' },
  {
    name: 'items',
    type: 'DynamicMenuItem[]',
    description: 'The links, `{ label, href, badge? }`. The open panel is as tall as the rows need.',
  },
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Open state on mount when uncontrolled.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called from the toggle, Escape, and a picked link.',
  },
  {
    name: 'onSelect',
    type: '(item, event) => void',
    description: 'Called when a link is clicked, before the menu closes. `event.preventDefault()` to route yourself.',
  },
  {
    name: 'openWidth',
    type: 'number',
    default: '300',
    description: 'Width of the open panel in px; it never grows past its container.',
  },
  { name: 'closedWidth', type: 'number', default: '150', description: 'Width of the closed pill in px.' },
  { name: 'className', type: 'string', description: 'Merged onto the panel.' },
]

export function DynamicMenuPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { openWidth, rows } = settings.values
  const links = LINKS.slice(0, rows)

  const usage = toUsageSnippet({
    component: 'DynamicMenu',
    from: '@/components/ui/dynamic-menu',
    props: { brand: 'Craft', items: { expression: 'links' }, openWidth },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / dynamic-menu"
      title="Dynamic Menu"
      description="A small pill with a two-line toggle. Open, it springs into a panel, width first and height a little softer behind it, while the lines turn into a cross and the links rise in one by one; closing drops them away in reverse. Adapted from Design Bookmark's motion studies."
      previewClassName="min-h-[26rem]"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Open width"
            value={openWidth}
            onValueChange={(next) => settings.set('openWidth', next)}
            min={220}
            max={360}
            step={10}
            unit="px"
          />
          <DemoControlGroup
            title="Links"
            options={ROWS}
            value={rows}
            onChange={(next) => settings.set('rows', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/dynamic-menu/'], usage, props: PROPS }}
    >
      <DynamicMenu
        brand="Craft"
        items={links}
        openWidth={openWidth}
        // the demo has nowhere to go
        onSelect={(_, event) => event.preventDefault()}
      />
    </DemoPage>
  )
}
