import { Calendar, House, Inbox, LayoutGrid, Settings } from 'lucide-react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { SidebarCollapse, type SidebarCollapseItem } from '@/components/ui/sidebar-collapse'

const ITEMS: SidebarCollapseItem[] = [
  { value: 'home', label: 'Home', icon: <House strokeWidth={1.9} /> },
  { value: 'inbox', label: 'Inbox', icon: <Inbox strokeWidth={1.9} /> },
  { value: 'projects', label: 'Projects', icon: <LayoutGrid strokeWidth={1.9} /> },
  { value: 'calendar', label: 'Calendar', icon: <Calendar strokeWidth={1.9} /> },
  { value: 'settings', label: 'Settings', icon: <Settings strokeWidth={1.9} /> },
]

const DEFAULTS = {
  open: true,
  stagger: 40,
}

const COMPONENT_DEFAULTS = { stagger: 40 }

const PROPS: DemoPropDoc[] = [
  { name: 'title', type: 'string', description: 'Product or workspace name next to the logo.' },
  {
    name: 'logo',
    type: 'ReactNode',
    description:
      "Mark left of the title; fades out when folded so the toggle can take its place. Defaults to the title's first letter on the primary colour.",
  },
  {
    name: 'items',
    type: '{ value: string; label: string; icon: ReactNode }[]',
    description: 'The nav items. Icon svgs are sized to 22 px; folded, the label shows as a tooltip.',
  },
  { name: 'value', type: 'string', description: 'The picked item, for controlled use.' },
  {
    name: 'defaultValue',
    type: 'string',
    default: 'items[0].value',
    description: 'The picked item on mount, for uncontrolled use.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Called when an item is clicked; the highlight springs over to it.',
  },
  { name: 'open', type: 'boolean', description: 'Expanded, or folded to the icon rail. Controlled.' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'true',
    description: 'Expanded on mount, for uncontrolled use.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called when the toggle is clicked.',
  },
  {
    name: 'stagger',
    type: 'number',
    default: '40',
    description: 'ms between labels as they cascade back in on open. Closing hides them all at once.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the aside.' },
]

export function SidebarCollapsePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { open, stagger } = settings.values

  const usage = toUsageSnippet({
    component: 'SidebarCollapse',
    from: '@/components/ui/sidebar-collapse',
    props: {
      title: 'Northwind',
      items: { expression: 'items' },
      open: { expression: 'open' },
      onOpenChange: { expression: 'setOpen' },
      stagger,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / sidebar-collapse"
      title="Sidebar Collapse"
      description="A sidebar that folds into an icon rail. The panel narrows on a soft spring while the arrow turns over and takes the logo's place; open it again and the labels cascade back in one after another, while the highlight springs to whichever item you pick. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Expanded"
            checked={open}
            onCheckedChange={(next) => settings.set('open', next)}
          />
          <DemoSlider
            label="Label stagger"
            value={stagger}
            onValueChange={(next) => settings.set('stagger', next)}
            min={0}
            max={120}
            step={5}
            unit="ms"
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/sidebar-collapse/'], usage, props: PROPS }}
    >
      <SidebarCollapse
        title="Northwind"
        items={ITEMS}
        defaultValue="home"
        open={open}
        onOpenChange={(next) => settings.set('open', next)}
        stagger={stagger}
      />
    </DemoPage>
  )
}
