import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { MacOSSidebar } from './MacOSSidebar'
import type { MacOSSidebarItem } from './macos-sidebar.types'

const ITEMS: MacOSSidebarItem[] = [
  { id: 'all-notes', label: 'All Notes' },
  { id: 'recents', label: 'Recents' },
  { id: 'shared', label: 'Shared' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'archive', label: 'Archive' },
]

export function MacOSSidebarPage() {
  const [selected, setSelected] = useState<MacOSSidebarItem>(ITEMS[0])

  return (
    <DemoPage
      eyebrow="shared / macos-sidebar"
      title="macOS sidebar"
      description="A collapsible rail that springs between widths. The selected row keeps a static backdrop while the hover highlight is a shared layout element, so it slides between rows instead of fading in place."
    >
      <div className="w-full max-w-3xl px-4">
        <MacOSSidebar items={ITEMS} onSelect={setSelected}>
          <div className="flex h-full min-h-[320px] flex-col justify-center py-6">
            <p className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Selected
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              {selected.label}
            </h2>
            <p className="mt-3 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
              Collapse the rail with the panel button. The list blurs out as it
              goes so the icons stay legible through the transition.
            </p>
          </div>
        </MacOSSidebar>
      </div>
    </DemoPage>
  )
}
