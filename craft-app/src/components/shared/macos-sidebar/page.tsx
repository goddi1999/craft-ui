import { useState } from 'react'

import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { MacOSSidebar } from './MacOSSidebar'
import type { MacOSSidebarItem } from './macos-sidebar.types'

const ALL_ITEMS: MacOSSidebarItem[] = [
  { id: 'all-notes', label: 'All Notes' },
  { id: 'recents', label: 'Recents' },
  { id: 'shared', label: 'Shared' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'archive', label: 'Archive' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'templates', label: 'Templates' },
  { id: 'trash', label: 'Trash' },
]

const DEFAULTS = {
  rows: 5,
  defaultOpen: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'MacOSSidebarItem[]',
    description: 'Rows to list — `{ id, label }` each.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'true',
    description: 'Start expanded; the panel button toggles it.',
  },
  {
    name: 'defaultSelectedId',
    type: 'string',
    default: 'items[0].id',
    description: 'Id of the row selected on first render.',
  },
  {
    name: 'onSelect',
    type: '(item: MacOSSidebarItem) => void',
    description: 'Called when a row is clicked.',
  },
  {
    name: 'onAdd',
    type: '() => void',
    description: 'Called by the + button shown while expanded.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Main content beside the rail.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the outer frame.',
  },
]

export function MacOSSidebarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { rows, defaultOpen } = settings.values
  const [selected, setSelected] = useState<MacOSSidebarItem>(ALL_ITEMS[0])
  const items = ALL_ITEMS.slice(0, rows)

  const handleAdd = () =>
    settings.set('rows', Math.min(rows + 1, ALL_ITEMS.length))

  const usage = toUsageSnippet({
    component: 'MacOSSidebar',
    from: '@/components/shared/macos-sidebar',
    props: {
      items: 'ITEMS',
      defaultOpen,
      onSelect: 'ON_SELECT',
    },
    defaults: DEFAULTS,
    children: '<main>…</main>',
  })
    .replace('items="ITEMS"', 'items={items}')
    .replace('onSelect="ON_SELECT"', 'onSelect={setSelected}')

  return (
    <DemoPage
      eyebrow="shared / macos-sidebar"
      title="macOS sidebar"
      description="A collapsible rail that springs between widths. The selected row keeps a static backdrop while the hover highlight is a shared layout element, so it slides between rows instead of fading in place."
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Rows"
            value={rows}
            onValueChange={(value) => settings.set('rows', value)}
            min={2}
            max={ALL_ITEMS.length}
          />
          <DemoSwitch
            label="Start open"
            checked={defaultOpen}
            onCheckedChange={(value) => settings.set('defaultOpen', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/macos-sidebar/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="mx-auto w-full max-w-3xl">
        <MacOSSidebar
          key={String(defaultOpen)}
          items={items}
          defaultOpen={defaultOpen}
          onSelect={setSelected}
          onAdd={handleAdd}
        >
          <div className="flex h-full min-h-[320px] flex-col justify-center py-6">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Selected
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-balance break-words text-foreground sm:text-3xl">
              {selected.label}
            </h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Collapse the rail with the panel button, or add a row with +. The
              list blurs out as it goes so the icons stay legible through the
              transition.
            </p>
          </div>
        </MacOSSidebar>
      </div>
    </DemoPage>
  )
}
